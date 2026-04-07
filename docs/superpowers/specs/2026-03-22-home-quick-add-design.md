# Home Page Quick Add — Design Spec

**Date:** 2026-03-22
**Status:** Approved

---

## Context

The home page Fan Favourites section displays up to 15 products per tab across 3 collection tabs. Currently these cards (`.cvh-prod-card`) are plain anchor tags — clicking navigates to the product detail page. There is no way to add a product to cart without leaving the home page.

The collection pages already have a mature quick-add implementation (`sd-collection.js`) that:
- AJAX-adds single-variant products to cart
- Navigates to the PDP for multi-variant products

This feature brings the same behaviour to the home page product cards.

---

## Scope

- **In scope:** All 3 Fan Favourites tab panels in `sections/main-home.liquid`
- **Out of scope:** Category cards, brand link cards, promotional banners, any other home page sections

---

## Design

### 1. Liquid — `sections/main-home.liquid`

Each `.cvh-prod-card` `<a>` tag in all three tab panels (tab1, tab2, tab3) gets a quick-add button injected inside `.cvh-prod-card__img`, after the `.cvh-prod-card__badges` div:

```html
<button class="cvh-prod-card__quick-add"
  data-variant-id="{{ pv.id }}"
  data-has-variants="{% if p.variants.size > 1 %}true{% else %}false{% endif %}"
  data-product-url="{{ p.url }}"
  aria-label="Quick add {{ p.title }}"
  type="button">
  + Quick Add
</button>
```

The button sits inside the `<a>` tag. The click handler calls `e.stopPropagation()` on the button click — this prevents the event from bubbling up to the anchor and triggering navigation. `preventDefault()` is not needed (a `type="button"` has no default action to cancel).

No data attributes are needed on the `<a>` tag itself — all required data lives on the button.

### 2. CSS (inline in `main-home.liquid`)

Added to the existing `<style>` block. Note: `.cvh-prod-card__img` already has `position: relative; overflow: hidden` in the existing styles — no change needed there.

```css
/* Quick Add button — slide up on hover */
.cvh-prod-card__quick-add {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2C4731;
  color: #fff;
  border: none;
  padding: 10px 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transform: translateY(100%);
  transition: transform 0.22s ease;
  z-index: 2;
}
.cvh-prod-card:hover .cvh-prod-card__quick-add {
  transform: translateY(0);
}
/* Loading state */
.cvh-prod-card__quick-add.is-loading {
  opacity: 0.7;
  pointer-events: none;
}
/* Hidden on mobile — no hover on touch */
@media (max-width: 768px) {
  .cvh-prod-card__quick-add { display: none; }
}
```

### 3. JavaScript (inline `<script>` in `main-home.liquid`)

Placed at the bottom of the section file, **before** the `{% schema %}` block.

Event delegation scoped to `.cvh-featured` (the parent container of all 3 tab panels):

**Flow:**
1. Delegate click on `.cvh-prod-card__quick-add`
2. Call `e.stopPropagation()` to block the parent `<a>` link
3. Read `data-has-variants` from button
   - `true` → store scroll position in `sessionStorage` (key: `'cv_return_scroll_' + window.location.pathname`), then `window.location = btn.dataset.productUrl + '?return_to=' + encodeURIComponent(window.location.href)` — matches the `sd-collection.js` multi-variant pattern exactly
   - `false` → AJAX quick add:
     - Set loading state: `btn.disabled = true`, text → "Adding..."
     - `POST /cart/add.js` with `{ id: variantId, quantity: 1 }`
     - On success:
       - Fetch `/cart.js` to get full cart object
       - Show success toast: `showToast('Added to cart — ' + item.title, 'success')` where `item` is the response from `/cart/add.js`
       - Dispatch `cart:updated` with the full `/cart.js` response as `detail` — triggers cart drawer open + re-render + badge update
     - On error: show generic toast `showToast('Could not add to cart — please try again.', 'error')` — matches `sd-collection.js` (does not attempt to parse Shopify error body)
     - Restore button: re-enable, reset text to "+ Quick Add"

**Cart event:** `document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }))` where `cart` is the parsed `/cart.js` response. This matches the exact pattern in `sd-collection.js`.

**Toast system:** Implement a minimal `showToast(msg, type)` inline (same pattern as `sd-collection.js`) — fixed bottom-right, auto-dismiss after 3.5s, `role="status"` for accessibility.

---

## File Changes

| File | Change |
|------|--------|
| `sections/main-home.liquid` | Add button markup to all 3 tab panels; add CSS to `<style>` block; add `<script>` block before `{% schema %}` |

No new files required.

---

## Verification

1. **Desktop — single-variant product:** Hover a card → button slides up → click → "Adding..." state → success toast → cart drawer opens with item added → badge updates
2. **Desktop — multi-variant product:** Hover a card → button slides up → click → navigates to PDP
3. **Mobile:** Quick add buttons are hidden (`display: none`); tapping a card navigates to PDP as before
4. **Tab switching:** Switch to Tab 2, hover a card, quick-add — confirms event delegation works across all tabs
5. **All 3 tabs:** Quick add works on Tab 1, Tab 2, and Tab 3 independently
6. **Error state:** If Shopify returns an error (e.g. out of stock / 422), a toast appears with the error message and the button resets to "+ Quick Add"
7. **Cart badge:** Badge count increments after a successful quick add
