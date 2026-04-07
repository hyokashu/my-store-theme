# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-column contact page with a Shopify native contact form that emails submissions to the store mailbox.

**Architecture:** Two new files — `templates/page.contact.json` (Shopify page template) and `sections/main-contact.liquid` (self-contained section with all CSS, HTML, and schema). The section uses Shopify's `{% form 'contact' %}` tag which routes submissions to the store's configured contact email automatically.

**Tech Stack:** Shopify Liquid, CSS (no JS required), Shopify native contact form

**Spec:** `docs/superpowers/specs/2026-03-22-contact-page-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `templates/page.contact.json` | Assigns `main-contact` section to a Shopify page |
| Create | `sections/main-contact.liquid` | All CSS, HTML markup, and schema settings for the contact page |

---

### Task 1: Create the page template JSON

**Files:**
- Create: `templates/page.contact.json`

- [ ] **Step 1: Create the template file**

```json
{
  "sections": {
    "main-contact": {
      "type": "main-contact",
      "settings": {}
    }
  },
  "order": ["main-contact"]
}
```

Save to `templates/page.contact.json`.

- [ ] **Step 2: Verify the file is valid JSON**

Run: `cat templates/page.contact.json | python3 -m json.tool`
Expected: prints formatted JSON with no errors.

- [ ] **Step 3: Commit**

```bash
git add templates/page.contact.json
git commit -m "feat(contact): add page.contact template"
```

---

### Task 2: Build the section — CSS and hero header

**Files:**
- Create: `sections/main-contact.liquid`

- [ ] **Step 1: Create the section file with design tokens + hero CSS + hero HTML**

```liquid
{% comment %}
  Supply District — main-contact.liquid
  Contact Us page. Self-contained CSS + Liquid. Uses Shopify {% form 'contact' %}.
{% endcomment %}

<style>
/* =============================================================
   Design Tokens
   ============================================================= */
:root {
  --cv-bg:              #FDFBF2;
  --cv-fg:              #1C2B1F;
  --cv-card:            #ffffff;
  --cv-primary:         #2C4731;
  --cv-primary-fg:      #FDFBF2;
  --cv-muted-fg:        #425E3B;
  --cv-border:          #BDC9B6;
  --cv-destructive:     #c94030;
  --cv-success:         #3d7a1f;
  --cv-accent-blue:     #21496D;
  --color-cta-primary:  #C59B43;
  --color-cta-primary-fg:    #1a2510;
  --color-cta-primary-hover: #A8832C;
  --cv-radius:          1rem;
  --cv-shadow:          0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05);
  --cv-shadow-md:       0 4px 16px rgba(0,0,0,0.08);
  --cv-font-sans:       'Inter', system-ui, -apple-system, sans-serif;
  --cv-font-head:       'Nunito', system-ui, sans-serif;
}

/* =============================================================
   Shared Layout
   ============================================================= */
.cvh-contact__inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* =============================================================
   1. HERO
   ============================================================= */
.cvh-contact-hero {
  background: var(--cv-primary);
  padding: 4rem 0;
  text-align: center;
}
.cvh-contact-hero__eyebrow {
  font-family: var(--cv-font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C59B43;
  margin: 0 0 0.75rem;
}
.cvh-contact-hero__heading {
  font-family: var(--cv-font-head);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 1rem;
  line-height: 1.1;
}
.cvh-contact-hero__sub {
  font-family: var(--cv-font-sans);
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(253,251,242,0.7);
  max-width: 36rem;
  margin: 0 auto;
}
</style>

<!-- ① HERO -->
<section class="cvh-contact-hero">
  <div class="cvh-contact__inner">
    {%- if section.settings.hero_eyebrow != blank -%}
      <p class="cvh-contact-hero__eyebrow">{{ section.settings.hero_eyebrow }}</p>
    {%- endif -%}
    <h1 class="cvh-contact-hero__heading">{{ section.settings.hero_heading }}</h1>
    {%- if section.settings.hero_subheading != blank -%}
      <p class="cvh-contact-hero__sub">{{ section.settings.hero_subheading }}</p>
    {%- endif -%}
  </div>
</section>
```

- [ ] **Step 2: Commit what we have so far**

```bash
git add sections/main-contact.liquid
git commit -m "feat(contact): add section scaffold + hero"
```

---

### Task 3: Build the two-column body

**Files:**
- Modify: `sections/main-contact.liquid`

- [ ] **Step 1: Add the body CSS inside the existing `<style>` block (after the hero styles)**

```css
/* =============================================================
   2. BODY — two-column grid
   ============================================================= */
.cvh-contact-body {
  background: var(--cv-bg);
  padding: 4rem 0 5rem;
}
.cvh-contact-body__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 768px) {
  .cvh-contact-body__grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
}

/* --- Left column: info --- */
.cvh-contact-info__accent {
  width: 40px;
  height: 3px;
  background: #C59B43;
  margin-bottom: 1rem;
}
.cvh-contact-info__heading {
  font-family: var(--cv-font-head);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--cv-primary);
  margin: 0 0 1.25rem;
  letter-spacing: -0.01em;
}
.cvh-contact-info__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--cv-muted-fg);
  background: rgba(44,71,49,0.07);
  border-radius: 9999px;
  padding: 0.35rem 0.75rem;
  margin-bottom: 1.25rem;
}
.cvh-contact-info__chip svg {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}
.cvh-contact-info__email {
  display: block;
  font-family: var(--cv-font-sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--cv-primary);
  text-decoration: none;
  margin-bottom: 1.25rem;
  transition: color 0.15s;
}
.cvh-contact-info__email:hover { color: var(--color-cta-primary); }
.cvh-contact-info__reassurance {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--cv-muted-fg);
  margin: 0;
}

/* --- Right column: form card --- */
.cvh-contact-form-card {
  background: var(--cv-card);
  border-radius: var(--cv-radius);
  box-shadow: var(--cv-shadow-md);
  padding: 2rem;
}
.cvh-contact-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
}
.cvh-contact-field label {
  font-family: var(--cv-font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cv-fg);
}
.cvh-contact-field input,
.cvh-contact-field textarea {
  font-family: var(--cv-font-sans);
  font-size: 0.9375rem;
  color: var(--cv-fg);
  background: var(--cv-bg);
  border: 1px solid var(--cv-border);
  border-radius: var(--cv-radius);
  padding: 0 1rem;
  height: 2.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
}
.cvh-contact-field textarea {
  height: auto;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  resize: vertical;
}
.cvh-contact-field input:focus,
.cvh-contact-field textarea:focus {
  border-color: var(--cv-accent-blue);
  box-shadow: 0 0 0 3px rgba(33,73,109,0.12);
}
.cvh-contact-submit {
  display: block;
  width: 100%;
  height: 2.875rem;
  background: var(--color-cta-primary);
  color: var(--color-cta-primary-fg);
  font-family: var(--cv-font-sans);
  font-size: 0.9375rem;
  font-weight: 700;
  border: none;
  border-radius: var(--cv-radius);
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  margin-top: 0.5rem;
}
.cvh-contact-submit:hover {
  background: var(--color-cta-primary-hover);
  transform: translateY(-1px);
}
.cvh-contact-submit:active { transform: translateY(0); }

/* --- Success state --- */
.cvh-contact-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 1.5rem 0;
}
.cvh-contact-success svg {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--cv-success);
}
.cvh-contact-success p {
  font-family: var(--cv-font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: var(--cv-success);
  margin: 0;
}

/* --- Error state --- */
.cvh-contact-errors {
  background: rgba(201,64,48,0.07);
  border: 1px solid rgba(201,64,48,0.3);
  border-radius: calc(var(--cv-radius) / 2);
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  color: var(--cv-destructive);
}
```

- [ ] **Step 2: Add the body HTML after the hero section closing tag**

```liquid
<!-- ② BODY -->
<section class="cvh-contact-body">
  <div class="cvh-contact__inner cvh-contact-body__grid">

    <!-- Left: Contact Info -->
    <div class="cvh-contact-info">
      <div class="cvh-contact-info__accent"></div>
      <h2 class="cvh-contact-info__heading">{{ section.settings.contact_heading | default: 'Reach Out' }}</h2>

      {%- if section.settings.reply_time != blank -%}
        <div class="cvh-contact-info__chip">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{{ section.settings.reply_time }}</span>
        </div>
      {%- endif -%}

      {%- if section.settings.store_email != blank -%}
        <a class="cvh-contact-info__email" href="mailto:{{ section.settings.store_email }}">
          {{ section.settings.store_email }}
        </a>
      {%- endif -%}

      {%- if section.settings.reassurance_text != blank -%}
        <p class="cvh-contact-info__reassurance">{{ section.settings.reassurance_text }}</p>
      {%- endif -%}
    </div>

    <!-- Right: Form Card -->
    <div class="cvh-contact-form-card">
      {%- form 'contact' -%}
        {%- if form.posted_successfully? -%}
          <div class="cvh-contact-success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>Message sent! We'll be in touch soon.</p>
          </div>
        {%- else -%}
          {%- if form.errors -%}
            <div class="cvh-contact-errors">
              {{ form.errors | default_errors }}
            </div>
          {%- endif -%}

          <div class="cvh-contact-field">
            <label for="ContactFormName">Your Name</label>
            <input type="text" id="ContactFormName" name="contact[name]" value="{{ form.name }}" autocomplete="name" required>
          </div>

          <div class="cvh-contact-field">
            <label for="ContactFormEmail">Email Address</label>
            <input type="email" id="ContactFormEmail" name="contact[email]" value="{{ form.email }}" autocomplete="email" required>
          </div>

          <div class="cvh-contact-field">
            <label for="ContactFormMessage">Message</label>
            <textarea id="ContactFormMessage" name="contact[body]" rows="5" required>{{ form.body }}</textarea>
          </div>

          <button type="submit" class="cvh-contact-submit">Send Message</button>
        {%- endif -%}
      {%- endform -%}
    </div>

  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add sections/main-contact.liquid
git commit -m "feat(contact): add two-column body, form card, success/error states"
```

---

### Task 4: Add the schema block

**Files:**
- Modify: `sections/main-contact.liquid`

- [ ] **Step 1: Append the schema at the very end of the file**

```liquid
{% schema %}
{
  "name": "Contact Page",
  "tag": "div",
  "class": "cvh-contact-wrap",
  "settings": [
    { "type": "header",   "content": "Hero" },
    { "type": "text",     "id": "hero_eyebrow",    "label": "Eyebrow",     "default": "GET IN TOUCH" },
    { "type": "text",     "id": "hero_heading",    "label": "Heading",     "default": "We'd love to hear from you" },
    { "type": "textarea", "id": "hero_subheading", "label": "Subheading",  "default": "Have a question about an order or product? Send us a message and we'll get back to you shortly." },
    { "type": "header",   "content": "Contact Info" },
    { "type": "text",     "id": "contact_heading",   "label": "Heading",          "default": "Reach Out" },
    { "type": "text",     "id": "reply_time",         "label": "Reply time",       "default": "Usually replies within 24 hours" },
    { "type": "text",     "id": "store_email",        "label": "Store email" },
    { "type": "textarea", "id": "reassurance_text",   "label": "Reassurance text", "default": "We're a small team of collectors — every message gets a real reply." }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Validate the schema JSON is well-formed**

Run: `python3 -c "import json; json.load(open('sections/main-contact.liquid'))"` will fail (it's Liquid not pure JSON). Instead, manually extract the JSON between `{% schema %}` and `{% endschema %}` and validate:

```bash
sed -n '/{% schema %}/{n;:a;/{% endschema %}/q;p;n;ba}' sections/main-contact.liquid | python3 -m json.tool
```

Expected: prints formatted JSON with no errors.

- [ ] **Step 3: Commit**

```bash
git add sections/main-contact.liquid
git commit -m "feat(contact): add schema settings for theme customizer"
```

---

### Task 5: Deploy and verify

- [ ] **Step 1: Push to git remote**

```bash
git pull --rebase origin development && git push origin development
```

- [ ] **Step 2: Push to Shopify live theme**

```bash
shopify theme push --theme 188853125301 --store supply-district-8763.myshopify.com --allow-live
```

Expected: `success` banner with no errors.

- [ ] **Step 3: Create the page in Shopify Admin (manual step)**

1. Go to Shopify Admin → Online Store → Pages → Add page
2. Title: "Contact Us"
3. Under "Template", select `page.contact`
4. Save

- [ ] **Step 4: Verify the page renders correctly**

Visit `https://supply-district-8763.myshopify.com/pages/contact-us` and check:
- Dark green hero with gold eyebrow, white heading, and muted subheading
- Two-column layout on desktop (info left, form card right)
- Single-column stacked layout on mobile (resize browser to <768px)
- Form fields show correct labels, correct border radius and focus ring colour

- [ ] **Step 5: Verify form submission**

Fill in the form with a test name, email, and message and submit. Check:
- Green success message appears in the card (no page reload required in Shopify — actually it does redirect, so confirm the success state renders)
- Email arrives in the store's configured contact mailbox

- [ ] **Step 6: Verify error state**

Try submitting with an invalid email address — browser native validation should block it. Try submitting with empty fields — browser validation should block it.
