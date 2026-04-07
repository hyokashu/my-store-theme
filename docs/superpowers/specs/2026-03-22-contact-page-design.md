# Contact Page Design Spec
**Date:** 2026-03-22
**Status:** Approved

---

## Context

The store has no contact page. Customers need a way to send enquiries (order questions, product questions, general) that land in the store's mailbox. Shopify's native `{% form 'contact' %}` tag handles delivery to the store email automatically — no third-party integration needed.

---

## Files to Create

| File | Purpose |
|------|---------|
| `sections/main-contact.liquid` | Self-contained section: CSS + HTML + schema |
| `templates/page.contact.json` | Assigns the section to a Shopify page template |

**Post-deploy step (manual):** In Shopify Admin → Pages, create a page titled "Contact Us" and assign the `page.contact` template.

---

## Page Structure

### 1. Hero Header
- **Background:** `var(--cv-primary)` (`#2C4731` forest green) — matches the site header tone
- **Eyebrow:** "GET IN TOUCH" — uppercase, gold (`#C59B43`), small tracking
- **Heading:** "We'd love to hear from you" — Nunito, large, white
- **Subheading:** "Have a question about an order or product? Send us a message and we'll get back to you shortly." — Inter, white at 70% opacity
- Centred text, comfortable vertical padding (4rem top/bottom)

### 2. Two-Column Body
- **Background:** `var(--cv-bg)` (`#FDFBF2` parchment)
- **Layout:** CSS grid, two equal columns on desktop (`1fr 1fr`), stacked single column on mobile
- **Max-width:** `72rem`, centred, `1.5rem` horizontal padding
- **Vertical padding:** `4rem` top/bottom

#### Left Column — Contact Info
- Gold accent bar (3px, 40px wide — matching `.cvh-section-title::before` pattern)
- Heading: "Reach Out" — Nunito, `1.5rem`, forest green
- Reply time chip: clock SVG icon + "Usually replies within 24 hours" — small, muted green
- Store email as a `mailto:` link — styled in forest green, underline on hover
- Reassurance copy: "We're a small team of collectors — every message gets a real reply."
- Muted green text, `0.9375rem`, relaxed line height

#### Right Column — Contact Form Card
- **Card:** white background, `var(--cv-shadow)` shadow, `var(--cv-radius)` border radius (`1rem`), `2rem` padding
- **Form tag:** `{% form 'contact' %}`
- **Fields** (stacked, labelled above):
  - Your Name — `<input type="text" name="contact[name]">`
  - Email Address — `<input type="email" name="contact[email]">`
  - Message — `<textarea name="contact[body]" rows="5">`
- **Input styling:** `2.875rem` height (inputs), `1rem` border radius, `1px solid var(--cv-border)` (`#BDC9B6`), river blue focus ring (`#21496D`), `var(--cv-bg)` background
- **Submit button:** Full-width, gold primary (`var(--color-cta-primary)`), `"Send Message"` label, `2.875rem` height
- **Success state:** When `form.posted_successfully?` is true, replace form content with a green confirmation message: "Message sent! We'll be in touch soon."
- **Error state:** If `form.errors` exist, show an inline error summary above the form in red (`var(--cv-destructive)`)

---

## Schema Settings (Customizer)
All text editable in the Shopify theme customizer:

| Setting | Type | Default |
|---------|------|---------|
| `hero_eyebrow` | text | "GET IN TOUCH" |
| `hero_heading` | text | "We'd love to hear from you" |
| `hero_subheading` | textarea | "Have a question about an order or product?..." |
| `contact_heading` | text | "Reach Out" |
| `reply_time` | text | "Usually replies within 24 hours" |
| `store_email` | text | (blank — store owner fills in) |
| `reassurance_text` | textarea | "We're a small team of collectors..." |

---

## CSS Approach
- Fully self-contained in `sections/main-contact.liquid` — no external CSS file
- Class prefix: `.cvh-contact-` to match existing `cvh-` convention
- Reuse design tokens via CSS variables — no hardcoded colours except where tokens don't exist
- Mobile-first: single column below 768px, two columns above

---

## Verification
1. Create a "Contact Us" page in Shopify Admin → Pages, assign `page.contact` template
2. Visit the page — confirm hero renders in dark green, two-column layout shows on desktop
3. Submit the form — confirm email arrives in the store mailbox
4. Submit with empty fields — confirm browser validation fires
5. Check mobile — confirm single-column stacked layout
