# Shipping & Returns Page — Design Spec

**Date:** 2026-03-22
**Status:** Approved

---

## Context

Supply District has no dedicated Shipping & Returns page. Footer links point to a placeholder. Customers need a clear, on-brand policy page covering delivery information and return conditions. The goal is a polished, interactive page that matches the existing "Enchanted Forest" design system and is fully editable from the Shopify theme customizer.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Layout | Tab + Accordion | User selected; clean and organised for detailed policies |
| Tabs | Shipping + Returns | Two tabs only; simple and symmetrical |
| Info strips | Icon + text rows (not pill badges) | User requested less button-like appearance |
| Accordion | Single-open (collapse on open) | User requested; reduces visual clutter |
| Editability | Full Shopify schema (settings + blocks) | User requested all content editable in customizer |

---

## Visual Design

Follows the existing theme design system exactly:

- **Background:** `#FDFBF2` (parchment)
- **Hero:** `#2C4731` forest green background, white text, gold eyebrow + accent line
- **Primary text:** `#1C2B1F`, headings `#2C4731`
- **Accent / active states:** `#C59B43` gold (active tab indicator, open chevron)
- **Cards:** white `#fff` with `#BDC9B6` border, `1rem` radius
- **Fonts:** Nunito (headings, 800 weight), Inter (body)
- **Animations:** `sd-fade-up` on load (matches other sections)

---

## Page Structure

```
[Hero]
  - Eyebrow (editable)
  - Heading (editable)
  - Subheading (editable)

[Tab Bar]
  - Shipping tab (label editable)
  - Returns tab (label editable)

[Shipping Tab Pane]
  - Section icon (emoji, editable)
  - Section heading (editable)
  - Section subtext (editable)
  [Info Strip]
    - Up to 3 chips: icon (emoji) + label — each editable via section settings
  [Accordion]
    - shipping_faq blocks: question + answer (merchant-addable, reorderable)
  [Contact CTA Banner]
    - Heading, subtext, button label + URL (editable)

[Returns Tab Pane]
  - Section icon (emoji, editable)
  - Section heading (editable)
  - Section subtext (editable)
  [Info Strip]
    - Up to 3 chips: icon (emoji) + label — each editable via section settings
  [Accordion]
    - returns_faq blocks: question + answer (merchant-addable, reorderable)
  [Contact CTA Banner]
    - Heading, subtext, button label + URL (editable)
```

---

## Shopify Schema

### Section Settings

**Hero**
- `hero_eyebrow` — text, default: "Store Policies"
- `hero_heading` — text, default: "Shipping & Returns"
- `hero_subheading` — text, default: "Everything you need to know about getting your order and hassle-free returns."

**Tab Labels**
- `shipping_tab_label` — text, default: "Shipping"
- `returns_tab_label` — text, default: "Returns"

**Shipping Section**
- `shipping_icon` — text (emoji), default: "🚚"
- `shipping_heading` — text, default: "Shipping Information"
- `shipping_subtext` — text, default: "We ship Australia-wide. All orders are carefully packed and dispatched from our warehouse."
- `shipping_chip_1_icon` — text, default: "🎁"
- `shipping_chip_1_label` — text, default: "Free shipping on orders over $250"
- `shipping_chip_2_icon` — text, default: "📦"
- `shipping_chip_2_label` — text, default: "Australia only"
- `shipping_chip_3_icon` — text, default: "🔒"
- `shipping_chip_3_label` — text, default: "Tracked & insured"

> Each chip renders conditionally — only output when its label setting is non-blank (e.g. `{%- if section.settings.shipping_chip_2_label != blank -%}`). This prevents empty chip rows if a merchant clears a label.
- `shipping_cta_heading` — text, default: "Still have shipping questions?"
- `shipping_cta_subtext` — text, default: "Our team is happy to help — usually within 1 business day."
- `shipping_cta_label` — text, default: "Contact Us"
- `shipping_cta_url` — url, default: "/pages/contact"

**Returns Section**
- `returns_icon` — text (emoji), default: "↩️"
- `returns_heading` — text, default: "Returns Policy"
- `returns_subtext` — text, default: "We want you to shop with confidence. If something isn't right, we'll do our best to make it easy."
- `returns_chip_1_icon` — text, default: "📅"
- `returns_chip_1_label` — text, default: "14-day return window"
- `returns_chip_2_icon` — text, default: "🔒"
- `returns_chip_2_label` — text, default: "Sealed products only"
- `returns_chip_3_icon` — text, default: "📧"
- `returns_chip_3_label` — text, default: "Contact us first"

> Same conditional render rule applies — only output each returns chip when its label is non-blank.
- `returns_cta_heading` — text, default: "Need to start a return?"
- `returns_cta_subtext` — text, default: "Reach out and we'll guide you through the process."
- `returns_cta_label` — text, default: "Contact Us"
- `returns_cta_url` — url, default: "/pages/contact"

### Blocks

**`shipping_faq`**
- `question` — text
- `answer` — richtext (supports bold, links)

Default blocks (5):
1. How long does delivery take? / Standard 3–7 business days metro, 5–10 regional.
2. How much does shipping cost? / Calculated at checkout; free over $250.
3. How can I track my order? / Tracking number emailed on dispatch.
4. What if my order arrives damaged? / Contact within 48 hours with photos.
5. Do you offer click & collect? / Online only, no click & collect.

**`returns_faq`**
- `question` — text
- `answer` — richtext

Default blocks (6):
1. What is your return policy? / 14 days, sealed/unopened only.
2. How do I start a return? / Contact us first with order number.
3. Who pays for return shipping? / Customer pays unless item was wrong/damaged.
4. When will I receive my refund? / 3–5 business days after inspection.
5. Are sale items returnable? / No — final sale only.
6. What if I received the wrong item? / Contact within 48 hours, we'll fix it.

---

## JavaScript Behaviour

- **Tab switching:** Click tab → hide all panes, show selected, update active class on tab buttons. No animation (instant switch).
- **Accordion:** Click question → close all siblings in same pane → open clicked (if not already open; clicking open item closes it). CSS `max-height` transition for smooth open/close.
- **Block filtering:** Each tab pane renders only `section.blocks` where `block.type == 'shipping_faq'` (Shipping pane) or `block.type == 'returns_faq'` (Returns pane). Both block types coexist in the section schema and are filtered in Liquid by type.
- **Initialisation:** First `shipping_faq` block open by default; first `returns_faq` block open by default.
- All JS is vanilla, inline in the section file (no external dependencies).

---

## Files to Create

| File | Purpose |
|---|---|
| `sections/main-shipping-returns.liquid` | The section: HTML + inline CSS + JS + Shopify schema |
| `templates/page.shipping-returns.json` | Template that loads the section |

## Patterns to Follow

- Inline CSS pattern: `sections/main-contact.liquid` — all styles scoped inside the section file
- Animation: `sd-fade-up` class + keyframe — must be declared inline in the section's `<style>` block (the keyframe is NOT global; each section defines it inline, matching the pattern in `sections/main-home.liquid`)
- Schema structure: match label/default/id conventions from `sections/main-contact.liquid`
- Section naming: `.sdsr-*` prefix (Supply District Shipping Returns) to avoid CSS collisions

---

## Default Content (Seeded via Schema)

All accordion questions and info chip labels are pre-populated with real policy content reflecting:
- Free shipping over $250 (AU only)
- 14-day return window
- Factory-sealed products only eligible for return
- Customer pays return postage
- Sale items are final sale
- Wrong/damaged items handled within 48 hours

---

## Verification

1. Run `shopify theme dev --store supply-district-8763.myshopify.com`
2. Create a new page in Shopify admin, assign template `page.shipping-returns`
3. Visit the page — hero, tabs, accordions, info strip, and CTA all render correctly
4. Open Theme Customizer → navigate to the page → confirm all section settings and blocks are editable
5. Add a new FAQ block, reorder blocks — confirm changes reflect on page
6. Test on mobile (375px): single-column layout, tabs scrollable, accordions full-width
7. Confirm footer "Shipping & Returns" link points to the new page
