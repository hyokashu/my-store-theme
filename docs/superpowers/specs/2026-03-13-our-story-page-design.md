# Our Story Page — Design Spec
**Date:** 2026-03-13
**Status:** Approved (v4 — post spec-review)

---

## Context

Supply District needs a dedicated "Our Story" page accessible from the green "Our Story" CTA on the homepage About section (`/pages/our-story`). The page serves as a trust-building destination for first-time visitors — a hybrid of personal founder narrative and brand mission that explains why the store exists and what it stands for.

---

## Goals

- Give first-time visitors a reason to trust Supply District before they buy
- Tell a hybrid founder + brand mission story: personal origin moment, then the values built around it
- Provide rich image placement throughout so the page feels premium and visual
- Make every text and image element editable through the Shopify theme customizer
- Match the existing site aesthetic exactly (navy/green palette, Space Grotesk headings, Inter body)

---

## Page Structure (6 sections, top to bottom)

### 1. Hero
- Dark navy background (`#282d52`), **flat colour only — no background image picker**
- Green eyebrow label: `font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: #2e9963; font-weight: 600; margin-bottom: 0.75rem`
- Headline: Space Grotesk, `font-size: clamp(1.75rem, 5vw, 2.75rem)`, weight 800, white, `letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1rem`
- Subheadline: Inter, `font-size: 1rem; color: rgba(255,255,255,0.65); max-width: 520px; margin: 0 auto; line-height: 1.7`
- Section: `padding: 4rem 0`; inner container: `max-width: 80rem; margin: 0 auto; padding: 0 1rem; text-align: center`
- Mobile: same layout, fonts scale via `clamp`
- **Customizer fields:** `eyebrow` (text, default "Our Story"), `heading` (text, default "Built by Collectors. Trusted by the Community."), `subheading` (textarea, default "We started Supply District because we got tired of the same problem every collector faces. Here's why we exist.")

---

### 2. Origin Story (50/50 split)
- White background (`#ffffff`), `padding: 4rem 0`
- Inner container: `max-width: 80rem; margin: 0 auto; padding: 0 1rem`
- At `min-width: 768px`: inner padding `0 2rem`
- **HTML source order:** image `<div class="cvh-os-story__img">` first, text `<div class="cvh-os-story__text">` second — image naturally appears on top on mobile with no CSS `order` override needed

**Desktop (`min-width: 768px`):**
- `display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center`
- Image: `aspect-ratio: 4/5; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1)`
- Image `<img>`: `object-fit: cover; width: 100%; height: 100%; display: block`

**Mobile (`max-width: 767px`):**
- `grid-template-columns: 1fr; gap: 2rem`
- Image: `aspect-ratio: 16/9` (wider ratio works better on narrow screens)

**Placeholder:** if no image set, render `<div>` with `background: #eeecea; display: flex; align-items: center; justify-content: center; color: #76798c; font-size: 0.875rem` containing the shop name.

**Text column styles:**
- Eyebrow `<p>`: `font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #76798c; font-weight: 600; margin: 0 0 0.5rem`
- Green divider `<div>`: `width: 2rem; height: 3px; background: #2e9963; border-radius: 2px; margin-bottom: 1rem`
- Heading `<h2>`: Space Grotesk, `font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #282d52; line-height: 1.2; margin: 0 0 1rem`
- Body richtext output `<div class="cvh-os-story__body">`: `font-size: 1rem; line-height: 1.75; color: #76798c`; scoped reset: `.cvh-os-story__body p { margin: 0 0 0.75rem } .cvh-os-story__body p:last-child { margin-bottom: 0 }`

**Customizer fields:** `story_image` (image_picker), `story_eyebrow` (text, default "How It Started"), `story_heading` (text, default "We got tired of crushed corners and sketchy reseals."), `story_body` (richtext, default two `<p>` paragraphs — see Sample Copy)

---

### 3. Value Pillars with Photos
- Off-white background (`#f7f6f3`), `padding: 4rem 0`
- Inner container: `max-width: 80rem; margin: 0 auto; padding: 0 1rem`; at `min-width: 768px`: `padding: 0 2rem`

**Section heading block (centred, above grid, `margin-bottom: 2.5rem`):**
- Eyebrow: **hardcoded**, not a customizer field — `<p>` with `font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #76798c; font-weight: 600; margin: 0 0 0.5rem; text-align: center`. Text: "Our Commitments"
- Heading: `<h2>` — Space Grotesk, `font-size: clamp(1.5rem, 3vw, 1.875rem); font-weight: 800; color: #282d52; letter-spacing: -0.02em; margin: 0 0 0.375rem; text-align: center`
- Subheading: `<p>` — Inter, `font-size: 1rem; color: #76798c; margin: 0.375rem 0 0; text-align: center`

**Grid:**
- Desktop (`min-width: 768px`): `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem`
- Below `768px`: `grid-template-columns: 1fr` — **single column intentionally** (no 2-col tablet intermediate; 2-col would produce awkward narrow cards)

**Each card (`<div class="cvh-os-pillar-card">`):**
- `background: #ffffff; border: 1px solid #E5E7EB; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); overflow: hidden`
- Image at top: `<div class="cvh-os-pillar-card__img">` — `aspect-ratio: 16/9; overflow: hidden`; `<img>` inside: `object-fit: cover; width: 100%; height: 100%; display: block`
- If no image set: placeholder `<div>` with `background: #eeecea; aspect-ratio: 16/9`
- Body: `<div class="cvh-os-pillar-card__body" style="padding: 1rem 1.25rem">`
  - Title `<h3>`: Space Grotesk, `font-size: 1rem; font-weight: 700; color: #282d52; margin: 0 0 0.375rem`
  - Description `<p>`: Inter, `font-size: 0.875rem; line-height: 1.6; color: #76798c; margin: 0`

**Customizer fields (section-level):** `pillars_heading` (text, default "What We Stand For"), `pillars_subheading` (text, default "Three promises. Every order.")
**Customizer fields (per `value_pillar` block):** `pillar_image` (image_picker), `pillar_title` (text, default "Our Promise"), `pillar_desc` (textarea, default "Short description of this value.")

---

### 4. Founder Quote
- Full-width dark navy band (`#282d52`), `padding: 4rem 2rem; text-align: center`
- Inner container: `<div style="max-width: 600px; margin: 0 auto">`

**Opening quote mark:**
- `<span aria-hidden="true" class="cvh-os-quote__mark">`  containing the `"` character
- CSS: `font-family: Georgia, serif; font-size: 5rem; line-height: 0.8; color: rgba(255,255,255,0.15); display: block; text-align: center; margin-bottom: 0.5rem`

**Pull-quote:**
- HTML: `<blockquote class="cvh-os-quote__text">` — must reset browser defaults: `margin: 0; padding: 0; border: none`
- Font: Space Grotesk, `font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight: 600; font-style: italic; color: #ffffff; line-height: 1.6; margin-bottom: 1.25rem`

**Attribution:**
- `<p class="cvh-os-quote__attr">`: `font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #2e9963; margin: 0`

**Customizer fields:** `quote_text` (textarea, default "We didn't build Supply District to be the biggest. We built it to be the one you'd trust with your most-wanted pull."), `quote_attribution` (text, default "— Founder, Supply District")

---

### 5. Photo Gallery Strip
- White background (`#ffffff`), `padding: 2rem 0` — **vertical padding only; inner container handles horizontal**
- Inner container: `max-width: 80rem; margin: 0 auto; padding: 0 1rem`; at `min-width: 640px`: `padding: 0 2rem`
- **Intentionally no section heading or caption** — pure atmospheric visual row
- Desktop (`min-width: 640px`): `display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem`
  - **Note:** this section intentionally uses `640px` as its desktop breakpoint rather than the site standard of `768px` — this is correct and should not be normalised to `768px`
- Mobile (< `640px`): `grid-template-columns: repeat(2, 1fr); gap: 0.75rem`
- Each cell `<div class="cvh-os-gallery__item">`: `aspect-ratio: 1/1; border-radius: 8px; overflow: hidden`
- `<img>` inside: `object-fit: cover; width: 100%; height: 100%; display: block`
- **Empty state:** if image not set, slot renders as `<div>` with `background: #eeecea; aspect-ratio: 1/1; border-radius: 8px` — slot is **not hidden**, it maintains grid symmetry
- Implemented as repeatable `gallery_image` blocks (max 4)
- **Per-block field:** `gallery_img` (image_picker)

---

### 6. CTA
- Off-white background (`#f7f6f3`), `padding: 4rem 0; border-top: 1px solid #eeecea`
- Inner container: `max-width: 80rem; margin: 0 auto; padding: 0 1rem; text-align: center`; at `min-width: 768px`: `padding: 0 2rem`
- Heading `<h2>`: Space Grotesk, `font-size: clamp(1.375rem, 3vw, 1.75rem); font-weight: 800; color: #282d52; margin-bottom: 0.5rem`
- Subtext `<p>`: Inter, `font-size: 0.9375rem; color: #76798c; margin-bottom: 1.5rem`
- Button row `<div class="cvh-os-cta__btns">`:
  - Base: `display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap`
  - Mobile (`max-width: 639px`): `flex-direction: column; align-items: center`
  - Scoped button size override on mobile: `.cvh-os-cta .cvh-os-btn` at `max-width: 639px` → `width: 100%; max-width: 320px; justify-content: center`

- **Button nil-safety:** Shopify `url` schema fields do not reliably support `default` values. Render each button conditionally:
  ```liquid
  {% if section.settings.cta1_label != blank %}
    <a href="{{ section.settings.cta1_url | default: '#' }}" class="cvh-os-btn cvh-os-btn--primary">
      {{ section.settings.cta1_label }}
    </a>
  {% endif %}
  ```

**Customizer fields:** `cta_heading` (text, default "Ready to shop with confidence?"), `cta_subtext` (textarea, default "Every order backed by our authenticity guarantee."), `cta1_label` (text, default "Shop Collection"), `cta1_url` (url — no default; handled via Liquid fallback to `#`), `cta2_label` (text, default "Contact Us"), `cta2_url` (url — no default; Liquid fallback to `#`)

---

## Technical Implementation

### Files to Create
| File | Purpose |
|------|---------|
| `templates/page.our-story.json` | Routes `/pages/our-story` to the `our-story` section only — no `main-page` block; Shopify admin page content is intentionally bypassed |
| `sections/our-story.liquid` | Self-contained section: Google Fonts link, `<style>` block (`:root` tokens + all section CSS), Liquid HTML for all 6 sections, `{% schema %}` |

### `templates/page.our-story.json`
```json
{
  "sections": {
    "our_story": {
      "type": "our-story",
      "blocks": {
        "pillar1": { "type": "value_pillar", "settings": {} },
        "pillar2": { "type": "value_pillar", "settings": {} },
        "pillar3": { "type": "value_pillar", "settings": {} },
        "gallery1": { "type": "gallery_image", "settings": {} },
        "gallery2": { "type": "gallery_image", "settings": {} },
        "gallery3": { "type": "gallery_image", "settings": {} },
        "gallery4": { "type": "gallery_image", "settings": {} }
      },
      "block_order": ["pillar1","pillar2","pillar3","gallery1","gallery2","gallery3","gallery4"]
    }
  },
  "order": ["our_story"]
}
```
Block `settings` objects are empty — all defaults come from the schema.

### CSS Architecture in `our-story.liquid`

**CSS variables are NOT globally available.** Only `base.css` and `sd-header.css` load on every page — neither defines `--cv-*` or `--color-cta-*` tokens. Each section (e.g. `main-home.liquid`) defines its own `:root` block. `our-story.liquid` must do the same.

**Google Fonts** must be loaded in the section:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
```

**Required `:root` block:**
```css
:root {
  --cv-bg:                   #f7f6f3;
  --cv-fg:                   #1c1f36;
  --cv-card:                 #ffffff;
  --cv-primary:              #282d52;
  --cv-primary-fg:           #f8f7f5;
  --cv-secondary:            #eeecea;
  --cv-muted-fg:             #76798c;
  --cv-border:               #dedad5;
  --cv-radius:               0.5rem;
  --cv-font-sans:            'Inter', system-ui, -apple-system, sans-serif;
  --cv-font-head:            'Space Grotesk', system-ui, sans-serif;
  --color-cta-primary:       #2e9963;
  --color-cta-primary-fg:    #ffffff;
  --color-cta-primary-hover: #25834f;
}
```

### CSS Class Namespace
All classes use the prefix **`cvh-os-`**.

Examples: `.cvh-os-hero`, `.cvh-os-story`, `.cvh-os-pillars`, `.cvh-os-pillar-card`, `.cvh-os-quote`, `.cvh-os-gallery`, `.cvh-os-cta`, `.cvh-os__inner`

### Button Styles (redeclared inline)
`.cvh-btn` from `main-home.liquid` is not globally available. Redeclare as:
```css
.cvh-os-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: var(--cv-radius); font-family: var(--cv-font-sans); font-size: 1rem; font-weight: 700; cursor: pointer; text-decoration: none; transition: background 0.15s, color 0.15s, border-color 0.15s; white-space: nowrap; }
.cvh-os-btn--primary { background: var(--color-cta-primary); color: #fff; border: 2px solid var(--color-cta-primary); }
.cvh-os-btn--primary:hover { background: var(--color-cta-primary-hover); border-color: var(--color-cta-primary-hover); }
.cvh-os-btn--outline { background: transparent; color: var(--cv-primary); border: 2px solid var(--cv-primary); }
.cvh-os-btn--outline:hover { background: var(--cv-primary); color: #fff; }
@media (max-width: 639px) {
  .cvh-os-cta .cvh-os-btn { width: 100%; max-width: 320px; justify-content: center; }
}
```

### Full Schema (no `presets` — section is tied to a page template and should not appear as an addable section in the customizer for other templates)
```json
{
  "name": "Our Story",
  "tag": "div",
  "class": "cvh-os-wrap",
  "blocks": [
    {
      "type": "value_pillar",
      "name": "Value Pillar",
      "limit": 3,
      "settings": [
        { "type": "image_picker", "id": "pillar_image", "label": "Pillar image" },
        { "type": "text",         "id": "pillar_title", "label": "Title",        "default": "Our Promise" },
        { "type": "textarea",     "id": "pillar_desc",  "label": "Description",  "default": "Short description of this value." }
      ]
    },
    {
      "type": "gallery_image",
      "name": "Gallery Photo",
      "limit": 4,
      "settings": [
        { "type": "image_picker", "id": "gallery_img", "label": "Photo" }
      ]
    }
  ],
  "settings": [
    { "type": "header",   "content": "Hero" },
    { "type": "text",     "id": "eyebrow",           "label": "Eyebrow",            "default": "Our Story" },
    { "type": "text",     "id": "heading",            "label": "Heading",            "default": "Built by Collectors. Trusted by the Community." },
    { "type": "textarea", "id": "subheading",         "label": "Subheading",         "default": "We started Supply District because we got tired of the same problem every collector faces. Here\u2019s why we exist." },

    { "type": "header",      "content": "Origin Story" },
    { "type": "image_picker","id": "story_image",     "label": "Image" },
    { "type": "text",        "id": "story_eyebrow",   "label": "Eyebrow",            "default": "How It Started" },
    { "type": "text",        "id": "story_heading",   "label": "Heading",            "default": "We got tired of crushed corners and sketchy reseals." },
    { "type": "richtext",    "id": "story_body",      "label": "Body",               "default": "<p>Two collectors, one too many bad purchases. We decided to build the store we always wished existed \u2014 where every product is factory sealed, every shipment is insured, and every customer is treated like a fellow collector.<\/p><p>Supply District launched from Melbourne with one goal: be the most trusted source for sealed TCG product in Australia.<\/p>" },

    { "type": "header",   "content": "Value Pillars" },
    { "type": "text",     "id": "pillars_heading",    "label": "Section heading",    "default": "What We Stand For" },
    { "type": "text",     "id": "pillars_subheading", "label": "Section subheading", "default": "Three promises. Every order." },

    { "type": "header",   "content": "Founder Quote" },
    { "type": "textarea", "id": "quote_text",         "label": "Quote",              "default": "We didn\u2019t build Supply District to be the biggest. We built it to be the one you\u2019d trust with your most-wanted pull." },
    { "type": "text",     "id": "quote_attribution",  "label": "Attribution",        "default": "\u2014 Founder, Supply District" },

    { "type": "header",   "content": "CTA" },
    { "type": "text",     "id": "cta_heading",        "label": "Heading",            "default": "Ready to shop with confidence?" },
    { "type": "textarea", "id": "cta_subtext",        "label": "Subtext",            "default": "Every order backed by our authenticity guarantee." },
    { "type": "text",     "id": "cta1_label",         "label": "Button 1 label",     "default": "Shop Collection" },
    { "type": "url",      "id": "cta1_url",           "label": "Button 1 URL" },
    { "type": "text",     "id": "cta2_label",         "label": "Button 2 label",     "default": "Contact Us" },
    { "type": "url",      "id": "cta2_url",           "label": "Button 2 URL" }
  ]
}
```

---

## Responsive Breakpoints Summary

| Section | Mobile (< 640px) | Mid (640–767px) | Desktop (≥ 768px) |
|---------|-----------------|-----------------|-------------------|
| Hero | `clamp` scales font | same | same |
| Origin Story | 1-col, image `16/9` | 1-col, image `16/9` | 2-col, image `4/5` |
| Value Pillars | 1-col | 1-col (intentional) | 3-col |
| Founder Quote | `clamp(1rem, 2.5vw, 1.25rem)` quote | same | same |
| Gallery Strip | 2-col (`< 640px`) | 4-col (`≥ 640px`) | 4-col |
| CTA | buttons stack vertically | buttons side-by-side | buttons side-by-side |

---

## Verification
1. Create a Shopify page with handle `our-story`. Assign template `page.our-story`. Visit `/pages/our-story` — all 6 sections render with sample copy and `#eeecea` placeholder boxes where images are absent.
2. Confirm the page does **not** render the Shopify admin page content field (no stray `<div>` above the hero).
3. Open theme customizer → navigate to "Our Story" page → confirm settings appear under these header groups: **Hero**, **Origin Story**, **Value Pillars**, **Founder Quote**, **CTA**. Note: the **Gallery Strip** has no section-level settings and will not appear as a settings group — it appears as `gallery_image` blocks in the block list only. This is correct, not a bug.
4. Confirm `value_pillar` blocks (3) and `gallery_image` blocks (4) are individually editable, re-orderable, and removable.
5. Add an image to every picker → confirm aspect ratios: Origin Story `4/5` desktop / `16/9` mobile; Pillar cards `16/9`; Gallery cells `1/1`.
6. Remove all images → confirm all placeholder boxes render at correct aspect ratios with no broken slots or collapsed grid cells.
7. Inspect DevTools → confirm `--cv-primary`, `--color-cta-primary`, and other `--cv-*` tokens are present in `:root` (set by `our-story.liquid`'s own style block).
8. **Mobile (< 640px):** origin story is 1-col image-top; pillars are 1-col; gallery is 2-col; CTA buttons stack vertically at full width.
9. **Desktop (≥ 768px):** origin story is 2-col; pillars are 3-col; gallery is 4-col; CTA buttons side-by-side.
10. Leave CTA URL fields blank → both buttons still render (with `href="#"` fallback) — no broken links or hidden buttons.
