# Our Story Page — Design Spec
**Date:** 2026-03-13
**Status:** Approved

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
- Dark navy background (`#282d52`)
- Green eyebrow label (e.g. "Our Story")
- Large Space Grotesk headline (e.g. "Built by Collectors. Trusted by the Community.")
- Muted subheadline paragraph
- **Customizer fields:** eyebrow text, heading, subheading

### 2. Origin Story (50/50 split)
- Left: image picker (4:3 aspect ratio, rounded corners, drop shadow) — reuses pattern from `sections/about-supply-district.liquid`
- Right: eyebrow, green divider bar, heading, richtext body (two paragraphs)
- White background
- **Customizer fields:** image picker, eyebrow, heading, richtext body

### 3. Value Pillars with Photos
- Section heading centered above the grid ("What We Stand For" / "Three promises. Every order.")
- 3-column card grid on desktop, single column on mobile
- Each card: image picker at top (landscape photo) + title + short description below
- White cards, `border: 1px solid #E5E7EB`, `border-radius: 8px`, `box-shadow: 0 4px 12px rgba(0,0,0,0.04)` — matches cart card treatment
- Off-white section background (`#f7f6f3`)
- **Customizer fields per card (3 blocks):** image picker, card title, card description

### 4. Founder Quote
- Full-width dark navy band
- Centered italic pull-quote in Space Grotesk
- Green attribution line (e.g. "— Founder, Supply District")
- **Customizer fields:** quote text, attribution

### 5. Photo Gallery Strip
- White background
- 4-column equal grid of square images (aspect-ratio: 1/1), `border-radius: 8px`
- No captions — purely atmospheric
- Collapses to 2-column on mobile
- **Customizer fields:** 4× image picker

### 6. CTA
- Off-white background with top border separator
- Centered headline + subtext
- Two buttons: primary green ("Shop Collection") + outline navy ("Contact Us")
- **Customizer fields:** heading, subtext, button 1 label + URL, button 2 label + URL

---

## Technical Implementation

### Files to Create
| File | Purpose |
|------|---------|
| `templates/page.our-story.json` | Page template — routes `/pages/our-story` to the new section |
| `sections/our-story.liquid` | Self-contained section with all 6 sections, inline CSS, and full schema |

### Files Referenced (not modified)
| File | Notes |
|------|-------|
| `sections/about-supply-district.liquid` | Pattern reference for 50/50 image+text layout and green divider |
| `sections/main-home.liquid` | Pattern reference for CSS variables, button styles, typography |
| `sections/main-cart.liquid` | Pattern reference for card border/shadow treatment |

### Design Tokens (from existing theme)
```
--cv-bg:             #f7f6f3
--cv-fg:             #1c1f36
--cv-card:           #ffffff
--cv-primary:        #282d52   (navy)
--cv-muted-fg:       #76798c
--cv-border:         #dedad5
--color-cta-primary: #2e9963   (green)
--cv-font-sans:      'Inter', system-ui
--cv-font-head:      'Space Grotesk', system-ui
--cv-radius:         0.5rem
```

### Button Classes (reuse from main-home.liquid)
- `.cvh-btn.cvh-btn--primary` — green filled
- `.cvh-btn.cvh-btn--outline` — navy outline

### Responsive Breakpoints
- Mobile-first
- `@media (min-width: 768px)` — 50/50 origin story grid, 3-col value pillars
- `@media (min-width: 640px)` — 2-col gallery (mobile)
- `@media (min-width: 768px)` — 4-col gallery (desktop)

### Schema Structure
- Section-level settings for: hero fields, origin story fields, quote fields, CTA fields
- Block type `value_pillar` (repeatable, max 3) for the value cards
- Block type `gallery_image` (repeatable, max 4) for the photo strip
- Preset with 3 value_pillar blocks and 4 gallery_image blocks pre-added

---

## Sample Copy (placeholder — all editable in customizer)

**Hero:**
- Eyebrow: "Our Story"
- Heading: "Built by Collectors. Trusted by the Community."
- Subheading: "We started Supply District because we got tired of the same problem every collector faces. Here's why we exist."

**Origin Story:**
- Eyebrow: "How It Started"
- Heading: "We got tired of crushed corners and sketchy reseals."
- Body: "Two collectors, one too many bad purchases. We decided to build the store we always wished existed — where every product is factory sealed, every shipment is insured, and every customer is treated like a fellow collector.\n\nSupply District launched from Melbourne with one goal: be the most trusted source for sealed TCG product in Australia."

**Value Pillars:**
1. "100% Authentic" — "Authorized distributor sourced. Every product verified before it ships."
2. "Protected Packaging" — "Bubble-wrapped, double-boxed, and insured. Corners arrive intact."
3. "Same-Day Dispatch" — "Orders before 2pm weekdays dispatch the same day. No delays."

**Founder Quote:**
- Quote: "We didn't build Supply District to be the biggest. We built it to be the one you'd trust with your most-wanted pull."
- Attribution: "— Founder, Supply District"

**CTA:**
- Heading: "Ready to shop with confidence?"
- Subtext: "Every order backed by our authenticity guarantee."
- Button 1: "Shop Collection" → `/collections/all`
- Button 2: "Contact Us" → `/pages/contact`

---

## Verification
1. Create a new Shopify page with handle `our-story` in the admin
2. Assign the template `page.our-story` to it
3. Visit `/pages/our-story` — all 6 sections render correctly
4. Open theme customizer → navigate to the Our Story page → all fields appear and are editable
5. Add images via image pickers — they render correctly in each section
6. Resize to mobile — origin story stacks vertically, value pillars go single-column, gallery goes 2-column
7. Click "Shop Collection" CTA — navigates correctly
