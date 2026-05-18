# CN Explainer Section — Image-Led Redesign

## Context

The "Why Chinese-Market Cards Are Different" section currently uses emoji icons, bold titles, and long body text paragraphs. It reads as bland and text-heavy. The goal is to replace emoji with uploaded images, eliminate body text entirely, and use a layout that adapts dramatically between desktop (full-bleed overlay) and mobile (horizontal split rows).

---

## What Changes

**File:** `sections/main-home.liquid`

Three areas change in this one file:
1. CSS block — new styles for the two layouts
2. HTML block — new image-led markup replacing the current emoji/text markup
3. Schema — add 3 `image_picker` settings (one per card), remove `icon_show` / body text settings

---

## Layout Design

### Desktop (≥768px) — Full-bleed overlay

3-column grid. Each card is a fixed-height image container (~220px) with:
- The uploaded image filling the entire card (`object-fit: cover`)
- A `linear-gradient(to top, rgba(0,0,0,0.85) → transparent)` overlay
- A gold pill label (e.g. "Unique to CN") above the title at the bottom
- The card title in white serif text (`font-family: var(--cv-font-head)`)
- No body text

### Mobile (<768px) — Horizontal split rows

3 stacked rows. Each row is a fixed-height card (~80px) split into:
- A square image column (80px wide, full row height)
- A text column: bold title + one-line caption (kept to ≤8 words)
- Rows alternate: image-left / image-right / image-left

---

## Schema Changes

**Remove:** `cn_col1_icon`, `cn_col2_icon`, `cn_col3_icon` (emoji text fields)
**Remove:** `cn_col1_body`, `cn_col2_body`, `cn_col3_body` (textarea fields)

**Add** (one per column):
```
{ "type": "image_picker", "id": "cn_col1_image", "label": "Column 1 image" }
{ "type": "image_picker", "id": "cn_col2_image", "label": "Column 2 image" }
{ "type": "image_picker", "id": "cn_col3_image", "label": "Column 3 image" }
```

**Keep:** `show_cn_explainer`, `cn_explainer_title`, `cn_explainer_sub`, all `cn_colN_title` text fields.

**Add** short caption fields for mobile (one-liner, ≤8 words):
```
{ "type": "text", "id": "cn_col1_caption", "label": "Column 1 short caption (mobile)", "default": "Art not in English or Japanese sets." }
{ "type": "text", "id": "cn_col2_caption", "label": "Column 2 short caption (mobile)", "default": "China-only boxes and New Year specials." }
{ "type": "text", "id": "cn_col3_caption", "label": "Column 3 short caption (mobile)", "default": "Limited supply keeps collector value high." }
```

**Add** gold pill label fields:
```
{ "type": "text", "id": "cn_col1_label", "label": "Column 1 label (pill)", "default": "Unique to CN" }
{ "type": "text", "id": "cn_col2_label", "label": "Column 2 label (pill)", "default": "Region-locked" }
{ "type": "text", "id": "cn_col3_label", "label": "Column 3 label (pill)", "default": "Holds Value" }
```

---

## HTML Structure

Replace the current `.cvh-cn-explainer__grid` contents with:

```liquid
<div class="cvh-cn-explainer__grid">
  {% for i in (1..3) %}
    {% assign img_key    = 'cn_col' | append: i | append: '_image' %}
    {% assign title_key  = 'cn_col' | append: i | append: '_title' %}
    {% assign label_key  = 'cn_col' | append: i | append: '_label' %}
    {% assign caption_key= 'cn_col' | append: i | append: '_caption' %}
    {% assign img        = section.settings[img_key] %}
    <div class="cvh-cn-explainer__item">
      <div class="cvh-cn-explainer__img-wrap">
        {% if img != blank %}
          <img src="{{ img | image_url: width: 700 }}"
               alt="{{ section.settings[title_key] }}"
               width="700" height="467"
               loading="lazy">
        {% else %}
          <div class="cvh-cn-explainer__img-placeholder"></div>
        {% endif %}
        <div class="cvh-cn-explainer__overlay">
          <span class="cvh-cn-explainer__pill">{{ section.settings[label_key] }}</span>
          <div class="cvh-cn-explainer__title">{{ section.settings[title_key] }}</div>
        </div>
      </div>
      <div class="cvh-cn-explainer__mobile-body">
        <div class="cvh-cn-explainer__title">{{ section.settings[title_key] }}</div>
        <div class="cvh-cn-explainer__caption">{{ section.settings[caption_key] }}</div>
      </div>
    </div>
  {% endfor %}
</div>
```

> Note: `.cvh-cn-explainer__img-wrap` and `.cvh-cn-explainer__overlay` are only visible on desktop. `.cvh-cn-explainer__mobile-body` is only visible on mobile. CSS handles the swap.

---

## CSS Changes

Replace existing `.cvh-cn-explainer__grid`, `.cvh-cn-explainer__item`, `.cvh-cn-explainer__icon`, `.cvh-cn-explainer__body` rules with:

```css
/* ── Grid ── */
.cvh-cn-explainer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

/* ── Mobile-first: horizontal split row ── */
.cvh-cn-explainer__item {
  background: var(--cv-card);
  border: 1px solid var(--cv-border);
  border-radius: var(--cv-radius);
  overflow: hidden;
  display: grid;
  grid-template-columns: 80px 1fr;
  height: 80px;
}
.cvh-cn-explainer__item:nth-child(even) { grid-template-columns: 1fr 80px; }
.cvh-cn-explainer__item:nth-child(even) .cvh-cn-explainer__img-wrap { order: 2; }
.cvh-cn-explainer__item:nth-child(even) .cvh-cn-explainer__mobile-body { order: 1; }

.cvh-cn-explainer__img-wrap {
  position: relative;
  height: 100%;
}
.cvh-cn-explainer__img-wrap img,
.cvh-cn-explainer__img-placeholder {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.cvh-cn-explainer__img-placeholder { background: var(--cv-border); }

/* Overlay hidden on mobile */
.cvh-cn-explainer__overlay { display: none; }

.cvh-cn-explainer__mobile-body {
  display: flex; flex-direction: column; justify-content: center;
  padding: 0.6rem 0.75rem;
}
.cvh-cn-explainer__mobile-body .cvh-cn-explainer__title {
  font-family: var(--cv-font-head); font-size: 0.8rem; font-weight: 700;
  color: var(--cv-fg); line-height: 1.2; margin: 0 0 0.2rem;
}
.cvh-cn-explainer__caption {
  font-size: 0.72rem; color: var(--cv-muted-fg); line-height: 1.35; margin: 0;
}

/* ── Desktop (≥768px): flip to full-bleed overlay ── */
@media (min-width: 768px) {
  .cvh-cn-explainer__grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .cvh-cn-explainer__item {
    display: block;
    height: auto;
    background: transparent;
    border: none;
  }
  .cvh-cn-explainer__img-wrap { height: 220px; }
  .cvh-cn-explainer__overlay {
    display: flex;
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 100%);
    flex-direction: column; justify-content: flex-end;
    padding: 1.1rem;
  }
  .cvh-cn-explainer__pill {
    display: inline-block; width: fit-content; margin-bottom: 0.4rem;
    font-size: 0.625rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--cv-primary-alt, #C59B43);
    border: 1px solid rgba(197,155,67,0.5); border-radius: 999px; padding: 2px 9px;
  }
  .cvh-cn-explainer__overlay .cvh-cn-explainer__title {
    font-family: var(--cv-font-head); font-size: 1rem; font-weight: 700;
    color: #fff; line-height: 1.2; margin: 0;
  }
  .cvh-cn-explainer__mobile-body { display: none; }
}
```

---

## Verification

1. `shopify theme dev --store supply-district-8763.myshopify.com`
2. **Desktop:** Confirm 3-column full-bleed cards with gradient overlay, gold pill, white title — no body text
3. **Mobile (≤767px):** Confirm 3 stacked rows, alternating image side, title + caption visible
4. **No image uploaded:** Confirm placeholder background shows, no broken `<img>` tags
5. **Theme editor:** Confirm image_picker slots appear for all 3 cards, titles/labels/captions editable
