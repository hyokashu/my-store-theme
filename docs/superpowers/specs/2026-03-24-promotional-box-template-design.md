# Promotional Box Product Template — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Context

The store sells TCG products in two broad categories: Booster Boxes and Promotional Boxes (Premium Collections, Gift Boxes, Special Sets). The existing `product.json` template and `main-product.liquid` section are optimised for booster boxes — showing pack counts, cards-per-pack, and pull rate expectations.

Promotional boxes have a fundamentally different value proposition: guaranteed exclusive promos, accessories, and curated highlights rather than random pack odds. The "Box Contents" tab needs to reflect this with different data, different labels, and a "Exclusive Highlights" grid instead of "Pull Rate Expectations".

The goal is a `product.promotional-box.json` template that a merchant can assign to any Promotional Box product to automatically show the right content structure.

---

## Approach: Mode setting in existing section (Option B)

Add a `box_contents_mode` select setting (`booster_box` | `promotional_box`) to `sections/main-product.liquid`. When set to `promotional_box`, the Box Contents tab renders promo-specific Liquid. All other sections of the product page (gallery, price, trust signals, tabs nav, similar products) are unchanged.

**Why not a new section file:** Would duplicate ~2055 lines. Future product page changes (trust signals, layout) would need to be applied twice. The conditional is well-scoped to a single tab's inner content block.

---

## Files

| File | Action |
|---|---|
| `sections/main-product.liquid` | Modified |
| `templates/product.promotional-box.json` | New |

---

## `sections/main-product.liquid` Changes

### 1. Top liquid block (after line 30)

Add after existing `pack_count` / `cards_per_pack` assignments:

```liquid
assign promo_mode = false
if section.settings.box_contents_mode == 'promotional_box'
  assign promo_mode = true
endif
```

### 2. Box Contents tab (lines 1334–1392)

Wrap the existing inner content in `{% unless promo_mode %}...{% else %}...{% endunless %}`.

**Promo mode — "What's Inside" items**

Same `.cv-content-item` HTML structure. Values come from metafields directly (no arithmetic). Three distinct SVG icons:

| Row | Icon | Default Label | Metafield Value | Schema setting |
|---|---|---|---|---|
| 1 | Sparkle/star SVG | "Exclusive Promos:" | `custom.promo_cards_included` | `promo_item1_label`, `promo_item1_desc` |
| 2 | Box SVG (reused) | "Booster Packs:" | `custom.booster_packs_included` + suffix | `promo_item2_label`, `promo_item2_suffix`, `promo_item2_desc` |
| 3 | Gift SVG | "Accessories:" | `custom.accessories_included` | `promo_item3_label`, `promo_item3_desc` |

Representative HTML for row 1 (rows 2 and 3 follow the same structure with their respective settings and metafields):

```liquid
<div class="cv-content-item">
  <div class="cv-content-item__icon">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <!-- sparkle/star path -->
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  </div>
  <div class="cv-content-item__main">
    <div class="cv-content-item__row">
      <span class="cv-content-item__label">{{ section.settings.promo_item1_label | default: 'Exclusive Promos:' }}</span>
      <span class="cv-content-item__value">{{ product.metafields.custom.promo_cards_included.value | default: '—' }}</span>
    </div>
    <span class="cv-content-item__desc">{{ section.settings.promo_item1_desc | default: 'Exclusive alternate-art promotional cards' }}</span>
  </div>
</div>
```

Row 2 uses `promo_item2_label`, `custom.booster_packs_included.value`, `promo_item2_suffix`, `promo_item2_desc`.
Row 3 uses `promo_item3_label`, `custom.accessories_included.value`, `promo_item3_desc`.

**Promo mode — "Exclusive Highlights" grid**

Reuses existing CSS classes `.cv-pull-rates`, `.cv-pull-grid`, `.cv-pull-item`, `.cv-pull-item__label`, `.cv-pull-item__value` — zero new CSS required.

```liquid
{%- assign promo_highlights = product.metafields.custom.promo_highlights.value -%}
{%- if promo_highlights != blank and promo_highlights.size > 0 -%}
  <div class="cv-pull-rates">
    <h4>Exclusive Highlights</h4>
    <p>This set includes the following guaranteed exclusive items:</p>
    <div class="cv-pull-grid">
      {%- for item in promo_highlights -%}
        <div class="cv-pull-item">
          <span class="cv-pull-item__label">{{ item.title }}</span>
          <span class="cv-pull-item__value">{{ item.subtitle }}</span>
        </div>
      {%- endfor -%}
    </div>
  </div>
{%- endif -%}
```

**Promo mode — Meta cards**

First card ("Release Date") is identical to booster box mode, using `custom.release_date`.

Second card label changes from "Set Size" to "Product Type", pulling from `custom.promo_product_type`:

```liquid
<div class="cv-meta-card">
  <span class="cv-meta-card__label">Product Type</span>
  <span class="cv-meta-card__value">{{ product.metafields.custom.promo_product_type.value | default: '—' }}</span>
</div>
```

Note: `.value` is required for `single_line_text` metafields in Shopify OS 2.0 — without it Liquid renders the raw metafield object. The existing booster box `release_date` and `set_size` outputs in the section also omit `.value`; this should be noted but is out of scope for this feature.

### 3. Schema additions (at end of settings array)

```json
{
  "type": "header",
  "content": "Promotional Box Mode"
},
{
  "type": "select",
  "id": "box_contents_mode",
  "label": "Box Contents Mode",
  "default": "booster_box",
  "options": [
    { "value": "booster_box", "label": "Booster Box" },
    { "value": "promotional_box", "label": "Promotional Box" }
  ]
},
{
  "type": "header",
  "content": "Promotional Box — Row Labels"
},
{ "type": "text", "id": "promo_item1_label",  "label": "Row 1 — Label",       "default": "Exclusive Promos:" },
{ "type": "text", "id": "promo_item1_desc",   "label": "Row 1 — Description", "default": "Exclusive alternate-art promotional cards" },
{ "type": "text", "id": "promo_item2_label",  "label": "Row 2 — Label",       "default": "Booster Packs:" },
{ "type": "text", "id": "promo_item2_suffix", "label": "Row 2 — Unit",        "default": "packs" },
{ "type": "text", "id": "promo_item2_desc",   "label": "Row 2 — Description", "default": "Each pack contains randomly assorted cards" },
{ "type": "text", "id": "promo_item3_label",  "label": "Row 3 — Label",       "default": "Accessories:" },
{ "type": "text", "id": "promo_item3_desc",   "label": "Row 3 — Description", "default": "Sleeves, deck boxes, and other collectible accessories" }
```

---

## `templates/product.promotional-box.json` (new file)

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {
        "show_payment_icons": true,
        "show_afterpay": false,
        "show_trust_signals": true,
        "show_similar": true,
        "show_recent_sales": false,
        "tab_description_label": "Description",
        "tab_contents_label": "Box Contents",
        "box_contents_mode": "promotional_box",
        "contents_heading": "What's Inside",
        "promo_item1_label": "Exclusive Promos:",
        "promo_item1_desc": "Exclusive alternate-art promotional cards",
        "promo_item2_label": "Booster Packs:",
        "promo_item2_suffix": "packs",
        "promo_item2_desc": "Each pack contains randomly assorted cards",
        "promo_item3_label": "Accessories:",
        "promo_item3_desc": "Sleeves, deck boxes, and other collectible accessories"
      }
    }
  },
  "order": ["main"]
}
```

---

## Metafield Reference

| Namespace.Key | Type | Purpose |
|---|---|---|
| `custom.promo_cards_included` | `single_line_text` or `number_integer` | Row 1 value (Exclusive Promos) |
| `custom.booster_packs_included` | `single_line_text` or `number_integer` | Row 2 value (Booster Packs) |
| `custom.accessories_included` | `single_line_text` | Row 3 value (Accessories) |
| `custom.promo_highlights` | `json` — array of `{ "title": "...", "subtitle": "..." }` | Exclusive Highlights grid items |
| `custom.promo_product_type` | `single_line_text` | Second meta card (e.g. "Gift Box", "Special Set") |
| `custom.release_date` | `single_line_text` (existing) | First meta card — unchanged |

---

## Verification

1. Assign the `product.promotional-box` template to a test product in Shopify Admin
2. Populate all 5 metafields on that product
3. Run `shopify theme dev --store supply-district-8763.myshopify.com`
4. Open the product page and click "Box Contents" tab — verify:
   - 3 items show with promo-specific labels, icons, and metafield values
   - "Exclusive Highlights" grid renders if `promo_highlights` is set
   - Second meta card shows "Product Type" (not "Set Size")
5. Open an existing booster box product (which uses `product.json`, which does NOT include `box_contents_mode` in its settings) — confirm the box contents tab renders in booster mode via the schema `default: "booster_box"` fallback. Specifically verify pack count, cards-per-pack, pull rates grid (if set), and "Set Size" card all render correctly
6. Open Shopify Theme Editor → navigate to a promotional box product → confirm `box_contents_mode` setting is visible and set to "Promotional Box"
