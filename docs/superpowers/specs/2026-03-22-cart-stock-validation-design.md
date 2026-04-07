# Cart Stock Validation — Design Spec

**Date:** 2026-03-22
**Status:** Approved

---

## Problem

The cart page and cart drawer allow customers to increment item quantities beyond available stock. Shopify's backend may reject the order at checkout, but there is no frontend prevention, no user feedback during cart editing, and no visible stock information to set expectations.

---

## Goals

- Cap quantity controls in both cart surfaces at `inventory_quantity`
- Show stock badges ("Only N left" / "Max quantity reached") near the quantity controls
- Block quantity increases at the limit with a disabled `+` button
- Surface Shopify's own inventory error messages (422 responses) instead of generic errors
- Handle the product page add-to-cart edge case: if Shopify rejects the add, show its description

---

## Out of Scope

- Real-time inventory polling / websocket updates
- Reserving inventory during cart sessions (requires backend)
- Changes to checkout or order processing

---

## Technical Approach

### Data source

**Cart page** (`main-cart.liquid`): Liquid-rendered — embed `data-inventory-qty` and `data-inventory-policy` directly on each qty control wrapper. After `updateCart()` re-fetches the full page HTML and re-initialises via `initCartLogic()`, the new DOM already has fresh inventory data. No extra API calls needed.

**Cart drawer** (`cart-drawer.liquid`): JS-rendered from `/cart.js` JSON — the cart JSON does not include inventory data. After `renderCart()` builds the DOM, fetch `/products/{handle}.js` in parallel for each unique product handle in the cart. Build a `variantId → {qty, policy}` map and apply limits. Cache fetched product data per page session to avoid redundant requests.

**Product page** (`main-product.liquid`): `/cart/add.js` already returns a 422 with `description` when stock is exceeded. Fix the `submitCart()` response handler to check `r.ok` and display Shopify's message rather than a generic "Error – Try Again".

---

## Changes by File

### 1. `sections/main-cart.liquid`

**Liquid HTML changes:**

Add inventory data attributes to the qty control wrapper (line ~311):

```liquid
<div class="cv-qty"
  data-inventory-qty="{% if item.variant.inventory_management == 'shopify' %}{{ item.variant.inventory_quantity }}{% else %}9999{% endif %}"
  data-inventory-policy="{{ item.variant.inventory_policy }}">
```

Add a stock badge element after the `+` button inside the qty wrapper:

```html
<span class="sdc-stock-badge" aria-live="polite"></span>
```

**JS changes** (inside `<script>` in the section):

1. Add `applyStockLimits()` — reads inventory data attrs, disables `+` button, populates badge:
   - `policy !== 'deny'` → skip (product allows overselling)
   - `currentQty >= inventoryQty` → disable `+`, badge: `"Max quantity reached"`
   - `inventoryQty - currentQty <= 5` → badge: `"Only {{ n }} left"` where `n = inventoryQty - currentQty` (remaining purchasable units)
   - Else → clear badge, ensure `+` enabled

2. Call `applyStockLimits()` at the end of `initCartLogic()`.

3. Fix `updateCart()` to handle 422. The current first chain link is `.then(r => window.location.pathname)` which discards `r` entirely — **this must be replaced**:
   ```javascript
   fetch('/cart/change.js', { ... })
   .then(function(r) {
     return r.json().then(function(data) {
       if (!r.ok) { showError(data.description || 'Failed to update cart.'); throw data; }
       return r; // pass through to page re-fetch
     });
   })
   .then(function() { return fetch(window.location.pathname); })
   // ... rest of chain unchanged
   ```

4. Fix the `+` click handler to read the item's inventory cap before calling `updateCart()`:
   - If `currentQty >= inventoryQty`, skip the call and call `applyStockLimits()` instead.

5. Fix the debounced `change` event on `sdc-qty-input` to clamp the typed value before calling `updateCart()`. The handler currently reads `parseInt(input.value)` and calls `updateCart(key, qty)` if positive. Add a clamp step:
   ```javascript
   var ctrl = input.closest('.cv-qty');
   var maxQty = parseInt(ctrl.dataset.inventoryQty, 10);
   var policy = ctrl.dataset.inventoryPolicy;
   if (policy === 'deny' && qty > maxQty) {
     input.value = maxQty;
     qty = maxQty;
   }
   updateCart(key, qty);
   ```
   This prevents a user from typing `999` into the input and bypassing the `+` button guard.

---

### 2. `sections/cart-drawer.liquid`

**JS changes** (inside `<script>` in the section):

1. Add `inventoryCache` object at module scope (`{}`). Maps product handle → variant inventory map.

2. Add `inventoryFetchInFlight` object at module scope (`{}`). Maps product handle → in-flight Promise. Add `fetchInventoryForCart(items)`:
   - Extract unique handles from `items`
   - For each handle not already in cache AND not in-flight: start fetch, store Promise in `inventoryFetchInFlight[handle]`, populate cache on resolve
   - For handles already in-flight, reuse the existing Promise
   - `Promise.all()` over all relevant Promises (cached + in-flight) to wait for all data before `applyDrawerStockLimits()` runs
   - Populate cache: `inventoryCache[handle][variantId] = { qty, policy }` and delete `inventoryFetchInFlight[handle]` on resolve

3. Modify the `renderCart(cart)` function to call `fetchInventoryForCart` and wait for it to resolve before applying limits — these must be async, not sequential:
   ```javascript
   // After building and inserting DOM...
   fetchInventoryForCart(cart.items).then(function() {
     applyDrawerStockLimits(cart.items);
   });
   ```

4. Add `applyDrawerStockLimits(items)`:
   - For each item, look up `inventoryCache[item.handle][item.variant_id]`
   - Find the rendered `.scd-item[data-key]` in the DOM
   - Apply same badge + disable logic as cart page

5. Update item HTML builder (in `renderCart`) to add a `<span class="scd-stock-badge">` after the `+` button.

6. Fix `changeQty()` to handle 422 — the fix must **prevent the success path from running**:
   ```javascript
   function changeQty(key, qty) {
     // ...loading state...
     return fetch('/cart/change.js', { ... })
       .then(function(r) {
         return r.json().then(function(data) {
           if (!r.ok) { showError(data.description || 'Something went wrong.'); throw data; }
           return data; // valid cart object
         });
       })
       .then(function(cart) { renderCart(cart); return cart; })
       .catch(function(err) {
         if (itemRow) itemRow.classList.remove('is-updating');
         // showError already called above for 422; only show generic for network errors
         if (!err || !err.description) showError('Something went wrong. Please try again.');
       });
   }
   ```
   Note: the drawer quantity input has `readonly`, so manual typing is not a vector here.

7. Fix `+` button click handler to check inventory cache before calling `changeQty()`:
   - If cached `qty` is defined and `policy === 'deny'` and `currentQty >= cachedQty`, skip and call `applyDrawerStockLimits()`.

---

### 3. `sections/main-product.liquid`

**JS changes** in `submitCart()` (line ~1748):

Replace current `.then(r => r.json())` pattern with a status check:

```javascript
.then(function(r) {
  return r.json().then(function(data) {
    if (!r.ok) throw data;
    return data;
  });
})
.catch(function(err) {
  var msg = (err && err.description) ? err.description : 'Error – Try Again';
  btnElement.innerHTML = msg;
  btnElement.disabled = false;
  setTimeout(function() { btnElement.innerHTML = originalHtml; }, 3000);
});
```

This surfaces Shopify's message (e.g., `"You can only add 2 of this item to your cart."`) instead of the generic error state.

---

## Stock Badge Styles

Add to an appropriate CSS file (or inline in each section):

```css
.sdc-stock-badge,
.scd-stock-badge {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #c0392b;
  margin-top: 4px;
  min-height: 1em;
}
```

---

## Inventory Policy Logic

| `inventory_management` | `inventory_policy` | Behaviour |
|---|---|---|
| `shopify` | `deny` | Apply caps and badges |
| `shopify` | `continue` | No cap (product allows overselling) |
| `""` (not tracked) | any | No cap (`data-inventory-qty` = 9999) |

---

## Verification

1. Add a product with limited stock (e.g., qty 3) to the cart.
2. Open cart drawer — click `+` to reach the limit → `+` button disables, badge shows "Max quantity reached".
3. Open cart page (`/cart`) — same behaviour.
4. On the product page, with 3 already in cart and stock = 3, click Add to Cart → should show Shopify's rejection message.
5. Set a product to 2 remaining stock, add 1 to cart — badge shows "Only 1 left" (remaining = 2 stock − 1 in cart).
6. Test with a product set to "Continue selling when out of stock" — no caps should apply.
