# City Center Apartments — Implementation Plan

> **Audience: an AI coding agent.** Execute phases strictly in order. Do not start Phase N+1 until every checkbox in Phase N passes. Every rule in `requirements/requirements_ai.md`, `requirements/DESIGN.md`, and `requirements/frontend.md` is binding. **Zero comments in shipped code.**
>
> **First action of Phase 0:** copy this entire file verbatim to `requirements/plan.md`.

---

## Context

The repo currently holds a **generic Nuxt 3 SSG template** whose read path was wired to a Django + Redis backend (`payload.<lang>.json` → `usePayload()` → `useStaticSlice()`). That backend will never exist for this project. The site is a **static marketing site** for a Tashkent short-stay + tourism operator, deployed to **Vercel**.

**Business:** daily-rate apartments in central Tashkent, guided tours (Amirsoy / Chimgan / Charvak / city / day trips), and airport transfers. There is **no booking engine, no calendar, no form** — every conversion path is one button that opens a prefilled WhatsApp chat.

**Goals, in priority order:**
1. **Sell.** Every scroll depth has a visible route into WhatsApp.
2. **Rank.** Nuxt 3 was chosen for SEO; the keyword clusters below are contractual, not decorative.
3. **Feel expensive and smooth.** Motion is the product's first impression.

---

## Locked decisions

| Decision | Value |
|---|---|
| Brand name | **City Center Apartments** |
| Domain | `tashkentapartmentstours.com` |
| WhatsApp (booking CTA) | `+998 98 808 05 15` → `https://wa.me/998988080515` |
| Telegram | `+998 88 707 05 04` → `https://t.me/+998887070504` |
| Logo | not yet supplied → **live-text wordmark** (see Phase 1 §1.6) |
| Locales | **`en` default (no prefix)**, `ru` at `/ru/`. `uz` deleted entirely. |
| Content source | **i18n JSON + typed feature composables.** The whole `payload` pipeline is deleted. |
| Prices | **Not shown.** Every price slot reads "Price on request" / "Цена по запросу". No `Offer` / `priceRange` JSON-LD. |
| Reviews | 12 **invented placeholder** reviews now, real ones later. **No `Review` / `AggregateRating` JSON-LD** until real texts land (Phase 4 §4.7 defines the one-flag switch). |
| Social-proof toasts | **With people counts**, as requested by the owner (`"3 people just booked a Chimgan tour"`). Owner-accepted risk; see Phase 4 §4.2 for the exact guard rails required. |
| URL slugs | Keyword-bearing, identical across both locales |
| Images | Not supplied → **`MediaPlaceholder` blocks** carrying a detailed shot brief. One component swap converts them to real photos. |

### Route map

| File | `en` (default) | `ru` |
|---|---|---|
| `pages/index.vue` | `/` | `/ru/` |
| `pages/tashkent-city-center-apartments/index.vue` | `/tashkent-city-center-apartments/` | `/ru/tashkent-city-center-apartments/` |
| `pages/tashkent-tours-amirsoy-chimgan/index.vue` | `/tashkent-tours-amirsoy-chimgan/` | `/ru/tashkent-tours-amirsoy-chimgan/` |
| `pages/tashkent-airport-transfer/index.vue` | `/tashkent-airport-transfer/` | `/ru/tashkent-airport-transfer/` |
| `pages/about-us/index.vue` | `/about-us/` | `/ru/about-us/` |
| `pages/contact-us/index.vue` | `/contact-us/` | `/ru/contact-us/` |
| `pages/[...slug].vue` | 404 | 404 |

`pages/kontakty/` is **deleted** (replaced by `contact-us`). Every internal link goes through `useLocalePath()` with a trailing slash.

---

## Design system (authoritative — this replaces the neutral template palette)

### D1. Colour

Exactly four brand colours. Everything else is an **alpha step of `#212121`** or pure white. Rewrite `assets/styles/colors.scss` wholesale; do not patch components.

**Brand**
| Token | Value | Use |
|---|---|---|
| `--primary-color` | `#770101` | Primary CTA fill, focus ring, active nav, icon accents, section eyebrow-free heading accents |
| `--light-primary-color` | `#9F7070` | Primary hover, muted rose accents, decorative hairlines, large-text-only accent |

**Surface**
| Token | Value | Use |
|---|---|---|
| `--surface-warm` | `#F5EEE7` | **Default page background** (`.app-shell`) |
| `--surface` | `#FFFFFF` | Cards, scrolled header, drawer panel, toast |
| `--surface-mute` | `#EDE4DA` | Chips, hover fill, input-ish blocks, media-placeholder fill (10% deeper cream) |
| `--surface-ink` | `#212121` | Dark-contrast sections + footer |
| `--card-cream` | `#F5EEE7` | Alias — card on white surface |

**Ink**
| Token | Value |
|---|---|
| `--ink` | `#212121` |
| `--ink-80` | `rgba(33, 33, 33, 0.8)` |
| `--ink-60` | `rgba(33, 33, 33, 0.62)` |
| `--ink-40` | `rgba(33, 33, 33, 0.4)` |
| `--ink-20` | `rgba(33, 33, 33, 0.16)` |
| `--text-color` | `#212121` |
| `--text-color-secondary` | `rgba(33, 33, 33, 0.62)` |

**Borders / status**
| Token | Value |
|---|---|
| `--border-color` | `rgba(33, 33, 33, 0.12)` |
| `--hr-border-color` | `rgba(33, 33, 33, 0.08)` |
| `--error-color` | `#770101` |
| `--error-background` | `rgba(119, 1, 1, 0.08)` |
| `--success-color` | `#212121` |
| `--success-background` | `rgba(33, 33, 33, 0.06)` |

**Contrast law — enforce, do not skip.**
- `#212121` on `#F5EEE7` = **14.2:1** ✓ body text
- `#770101` on `#F5EEE7` = **11.1:1** ✓ body text and links
- `#FFFFFF` on `#770101` = **10.9:1** ✓ CTA labels
- `#FFFFFF` on `#212121` = **15.9:1** ✓ dark sections
- **`#9F7070` on `#F5EEE7` = 3.4:1 → FAILS AA for body text.** `--light-primary-color` on a light surface is permitted **only** for: text ≥ `rem(24)` bold, hairline borders, decorative separators, non-informational icons, and hover states of already-accessible elements. Never for paragraphs, labels, captions, or link text. On `--surface-ink` it is 5.2:1 and is free to use.

**Forbidden palette:** any fifth hue; any gradient (`linear-`/`radial-`/`conic-`, incl. removing the inherited `--card-mint` / `--linear-background` gradient tokens); any `box-shadow` for depth; `backdrop-filter`; drop-shadow "elevation". Depth = `rem(2)` alpha hairline + tonal contrast only.

Also delete from `colors.scss`: `--card-peach`, `--card-mint-from`, `--card-mint-to`, `--card-mint`, `--linear-background`, `--accent-color`, `--accent-color-opacity`, `--surface-peach`, `--surface-violet`. Grep every removed token across `**/*.vue` and `**/*.scss` and repoint usages before deleting.

### D2. Section colour choreography

Home scroll sequence, never two identical surfaces adjacent, accent **never** a full-section background:

`Hero (--surface-warm)` → `Apartments (--surface)` → `Tours (--surface-ink)` → `Transfer (--surface-warm)` → `Contacts (--surface)` → `Reviews (--surface-ink)` → `Footer (--surface-ink)`.

Reviews → Footer is the single sanctioned dark→dark pair (they read as one closing statement); separate them with a `rem(2)` `rgba(255,255,255,0.1)` hairline.

Dark sections apply a **single `on-dark` mixin** (`assets/styles/helpers/_mixins.scss`) at the element that sets the dark background. It reassigns `--text-color`, `--ink`, `--ink-60`, `--border-color`, `--surface`, `--icon accent` to their inverted values so descendants resolve by cascade. **No per-element `color: white` overrides anywhere.**

### D3. Typography

**Onest**, already shipped at `public/fonts/onest/` with Latin / Latin-Ext / Cyrillic / Cyrillic-Ext subsets and preloads already configured in `nuxt.config.ts`. **Do not add a second typeface and do not add `@fontsource/*`.** The reference mockups' heavy grotesk is reproduced with Onest 700 at `-0.03em` tracking at display sizes.

Weights: 400 / 500 / 700 only.

**Desktop (≥1366px)**
| Element | Size | Weight | Line-height |
|---|---|---|---|
| Hero display (`h1` on `/`) | `rem(96)` | 700 | `0.92` |
| `h1` (inner pages) | `rem(64)` | 700 | `1.0` |
| `h2` | `rem(44)` | 700 | `1.06` |
| `h3` | `rem(28)` | 700 | `1.1` |
| `h4` | `rem(22)` | 500 | `1.2` |
| `h5` | `rem(20)` | 500 | `1.2` |
| `h6` | `rem(18)` | 500 | `1.2` |
| Lead | `rem(20)` | 400 | `1.5` |
| Body | `rem(16)` | 400 | `1.6` |
| Small / caption | `rem(14)` | 400 | `1.4` |
| Chip label | `rem(14)` | 500 | `1.2` |

**Notebook/laptop (≤1279px):** hero `rem(72)`, h1 `rem(48)`, h2 `rem(36)`, h3 `rem(24)`.
**Tablet (≤1023px):** hero `rem(56)`, h1 `rem(40)`, h2 `rem(30)`, h3 `rem(22)`.
**Mobile (≤639px):** hero `rem(44)`, h1 `rem(32)`, h2 `rem(26)`, h3 `rem(20)`, lead `rem(18)`, body `rem(16)` (never below 16 — anti-zoom).

Letter-spacing: `-0.03em` on hero display, `-0.02em` on `h1`/`h2`, `-0.01em` on `h3`, `0` on body. All-caps permitted **only** on: footer column titles, the locale code in the switcher, and transfer-route labels — always with `0.1em` tracking at `rem(12)`.

**Forbidden:** gradient text fills, `text-shadow`, whole-paragraph italics, decorative underlines (underline = link only), **eyebrow / kicker / badge labels above any heading — zero tolerance**, decorative dot-marks on or beside text.

### D4. Spacing, radius, containers

| Token | Value |
|---|---|
| `--base-padding` | `rem(16)` |
| `--base-gap` | `rem(16)` |
| `--small-margin` | `rem(24)` (mobile `rem(16)`) |
| `--large-margin` | `rem(40)` (mobile `rem(24)`) |
| `--inner-radius` | `rem(16)` |
| `--outer-radius` | `rem(32)` |
| `--pill-radius` | `rem(999)` |
| `--section-py` | `rem(120)` desktop / `rem(96)` laptop / `rem(72)` mobile |
| `--container` | `min(100%, rem(1600))` |

All values even. Borders / outlines ≥ `rem(2)`. Every public section wraps content in `<AppContainer size="wide">` — one shared vertical guide; the only exceptions are full-bleed dark section backgrounds (the container still constrains the *content*) and the reviews marquee track.

Canonical interactive height `rem(56)`; mobile touch targets ≥ `rem(44)`.

### D5. Motion

Signature easing **`cubic-bezier(0.22, 1, 0.36, 1)`** (`--ease-decel`) for everything. Secondary `--ease-soft` `cubic-bezier(0.33, 1, 0.68, 1)` for masked type only. **No spring, no bounce, no scroll-jacking, no page-transition morphs.**

| Use | Duration |
|---|---|
| Micro (hover tint, border, icon nudge) | `200ms` |
| Standard (dropdown, chip, card hover) | `240ms` |
| Drawer / mobile menu | `360ms` |
| Header hide/show | `400ms` |
| Scroll reveal (default) | `900ms` |
| Hero intro timeline | `400–1200ms` staged |
| Toast enter/leave | `320ms` (symmetric) |

**Reuse the existing motion system in full — do not rebuild it:**
- `v-reveal` (+ `.up/.down/.left/.right/.scale/.zoom/.clip/.clipLeft`, `.fast/.slow`) — block reveals
- `v-reveal.stagger` — grids and lists
- `v-reveal.text` (`.chars`) — masked word reveal for section headings
- `v-parallax="8..12"` — media only
- `useHeroIntro(rootRef)` — hero timeline via `data-hero="title|lead|actions|card|media"`
- `useStatsCounter(rootRef, sel)` — count-up numbers
- `useGsap()` — lazy GSAP; parallax + counters only

Rules: one heading per section gets `v-reveal.text`; one grid per section gets `v-reveal.stagger`; never double-animate an element; never `v-parallax` something already carrying a CSS transform. Reduced motion self-disables via the existing `@media (prefers-reduced-motion: reduce)` block — do not add per-component guards.

**Assigned motion, by section** (Phase 2/3 must follow this and add nothing more):
| Element | Mechanism |
|---|---|
| Home hero H1 | `useHeroIntro` masked words |
| Home hero lead / CTA row / chips | `data-hero="lead" / "actions" / "card"` |
| Hero media plate | `data-hero="media"` (scale 1.06 → 1) + `v-parallax="8"` |
| Every section `h2` | `v-reveal.text` |
| Every card grid | `v-reveal.stagger` |
| Dark section body copy | `v-reveal` (default up) |
| Reviews marquee | CSS `@keyframes` translate, `animation-play-state: paused` on hover/focus, disabled under reduced motion |
| Social-proof toast | Vue `<Transition>`, symmetric 320ms |
| Card hover | `background-color` + `border-color` + chip `translateX(rem(2))`. **Never** `translateY` lift, never shadow. |

### D6. Component anatomy

**`BaseButton` — extend the existing component, do not fork it.**

Variants to keep/adjust:
- `primary` — `--primary-color` fill, white label, radius `rem(999)`, height `rem(56)` (`small`: `rem(44)`), hover `--light-primary-color`.
- `outline-light` — transparent, `rem(2)` `--ink` border, `--ink` label; hover fills `--ink`, label white.
- `outline-dark` — for `--surface-ink` sections: transparent, `rem(2)` white border; hover fills white, label `--ink`.
- `ghost` — text + arrow chip, no fill, no padding-inline.
- `primary-pill` — **the signature CTA.** Retune to brand: `--primary-color` fill, white label `rem(16)`/500, padding `rem(8) rem(8) rem(8) rem(28)`, chip = white circle `rem(44)` with `--primary-color` arrow, total height `rem(60)` (`rem(56)` mobile), chip `translateX(rem(2))` on hover.
- **Remove** `secondary` if unused after Phase 3; otherwise repoint its fill to `--surface-mute`.

Signature-CTA discipline: `primary-pill` is the **booking** button only (header, hero, every card footer, contacts band, mobile bottom nav). Secondary navigation uses `outline-light` / `ghost`. Never combine `primary-pill` with `rounded` (already round).

**New shared primitives (build once in `components/ui/`, reuse everywhere):**

| Component | Anatomy |
|---|---|
| `BookButton.vue` | Thin wrapper over `BaseButton variant="primary-pill"` that resolves `href` from `useBookingLink(context)` and sets `target="_blank" rel="noopener noreferrer"` + `aria-label`. **Every** booking CTA on the site renders this — one file owns the WhatsApp contract. |
| `MediaPlaceholder.vue` | Props `{ ratio, brief, tone? }`. Renders a `--surface-mute` (or `rgba(255,255,255,0.06)` on dark) block with `aspect-ratio`, `rem(2)` `--ink-20` hairline, `--outer-radius`, and the shot brief centred at `rem(14)`/`--ink-60`, `max-width: rem(420)`, `text-wrap: balance`. `role="img"` + `:aria-label="brief"`. **This is the single swap point** — replacing it with `OptimizedMedia` later is a one-component change. |
| `FactChip.vue` | Pill: `--surface-mute` fill, `rem(999)` radius, `rem(10) rem(18)` padding, `rem(14)`/500 label, optional leading icon at `--icon-size-sm`. Matches the `74 m² · 3 beds · 2 baths · 16 floor` row in the reference mockup. |
| `OfferCard.vue` | The one card used by apartments, tours, and transfers. Anatomy top→bottom: `MediaPlaceholder` (16:10) → title `h3` → 1–2 line description `--ink-60` → `FactChip` row → footer row with `"Price on request"` (`rem(14)`, `--ink-60`) on the left and `BookButton size="small"` on the right. Surface `--surface` on light sections / `rgba(255,255,255,0.04)` on dark. `rem(2)` `--border-color` hairline, `--outer-radius`, `rem(24)` padding. Hover: border → `--light-primary-color`, chip nudge. |
| `SectionHeader.vue` | `h2` (with `v-reveal.text`) + optional lead paragraph + optional trailing `ghost` link ("All tours →"). No eyebrow, no badge, no dot. |
| `StatBand.vue` | 3–4 count-up figures on `--surface-ink`, wired to `useStatsCounter`. |

**Reused as-is:** `AppContainer`, `BaseHeading`, `BaseLead`, `BaseAccordion` (FAQ), `BaseModal`, `BaseDropdown`, `BaseEmptyState`, `BaseSkeleton`, `AppBreadcrumbs`, `AppAlerts`, `AppRouteLoader`, `AppNotFound`, every `components/svg/*`.

**Deleted:** `components/ui/InlineContactForm.vue`, `components/ui/BasePhoneInput.vue`, `components/ui/ContactPhoneCard.vue` (superseded by a contacts section built from `OfferCard`-grade primitives), `components/sections/FaqSection.vue` → moves to `features/faq/components/FaqSection.vue`.

### D7. Iconography

Existing `components/svg/*` only; `--icon-size` driven; `stroke="currentColor"`. Reuse `SvgWhatsApp`, `SvgTelegram`, `SvgInstagram`, `SvgPin`, `SvgClock`, `SvgUsers`, `SvgStar`, `SvgCheck`, `SvgArrowRight`, `SvgArrowUpRight`, `SvgChevronDown`, `SvgHeart`, `SvgQuote`, `SvgPhone`, `SvgMail`.

**New icons needed** (same SFC pattern, `viewBox="0 0 24 24"`, no hardcoded width/height): `SvgMountain`, `SvgPlane`, `SvgBed`, `SvgBath`, `SvgRuler`, `SvgBuilding`, `SvgWifi`, `SvgKey`, `SvgSnowflake`, `SvgTrain`, and `nav/SvgNavApartments`, `nav/SvgNavTours`, `nav/SvgNavTransfer`.

Scale: `--icon-size-xs rem(12)` / `-sm rem(16)` / `-md rem(20)` (default) / `-lg rem(24)` / `-xl rem(32)` / `-2xl rem(48)`.

### D8. Navigation across breakpoints

Zero navigation gaps at any width. Keep the existing Pattern-D `data-tier` mechanism in `nuxt.config.ts` + `main.scss`; extend its rules to the new elements.

- **Mobile (≤639px):** `AppMobileBottomNav` — 5 slots: `Home` · `Apartments` · **`Book` (red `--primary-color` circle, `rem(56)`, raised `rem(-12)`, `SvgWhatsApp`)** · `Tours` · `More` (opens drawer). Header shows wordmark + lang switcher only. Matches the reference mockup's red centre pill.
- **Tablet + laptop (640–1279px):** header burger → `AppMobileMenu` drawer with all 5 links + Book CTA + lang switcher. Inline nav hidden, bottom nav hidden.
- **Notebook + desktop (≥1280px):** inline horizontal nav (5 links) + `BookButton size="small"` + lang switcher. Burger and bottom nav hidden.

CLS rule: in `.app-header__controls`, viewport-gated elements come **before** the always-rendered lang switcher (anchor last).

---

## Content & SEO map

### Word-count quotas (per locale — RU is translated, never abbreviated)

| Page | Min words | Min internal links | JSON-LD |
|---|---|---|---|
| `/` | **800** | **12** | `Organization` (layout), `WebSite`, `LocalBusiness`, `ItemList<Service>` |
| `/tashkent-city-center-apartments/` | **1200** | **14** | `ItemList<Apartment>`, `BreadcrumbList`, `FAQPage` |
| `/tashkent-tours-amirsoy-chimgan/` | **1200** | **14** | `ItemList<TouristTrip>`, `BreadcrumbList`, `FAQPage` |
| `/tashkent-airport-transfer/` | **1200** | **14** | `Service` (`TaxiService`), `BreadcrumbList`, `FAQPage` |
| `/about-us/` | **1500** | **6** | `AboutPage`, `Organization` |
| `/contact-us/` | **800** | **6** | `ContactPage`, `LocalBusiness`, `ContactPoint` |

Keyword density: primary 3–8 occurrences, each secondary 1–3, each long-tail 1. **No stuffing (≥3% density), no hidden text, no synonym-only dilution.** Prose must read naturally aloud.

### Keyword clusters

**`/` — Home**
- Primary: `apartments in Tashkent city center` / `квартиры посуточно в центре Ташкента`
- Secondary: `Tashkent tours`, `Amirsoy tour`, `Tashkent airport transfer`, `daily rent Tashkent`
- Long-tail: `where to stay in Tashkent city center`, `what to do in Tashkent for tourists`

**`/tashkent-city-center-apartments/` — Apartments**
- Primary: `Tashkent city center apartments`
- Secondary: `daily apartment rent Tashkent`, `apartment near Amir Timur Square`, `Tashkent City Park apartment`, `short stay Tashkent`
- Long-tail: `how to rent an apartment in Tashkent for a few days`, `is it safe to rent apartments in Tashkent`

**`/tashkent-tours-amirsoy-chimgan/` — Tours**
- Primary: `Tashkent tours`
- Secondary: `Amirsoy resort tour`, `Chimgan mountains tour`, `Charvak lake trip`, `Beldersay`, `Chorsu bazaar tour`, `Tashkent metro tour`, `Samarkand day trip from Tashkent`, `Bukhara day trip`
- Long-tail: `how far is Amirsoy from Tashkent`, `best day trips from Tashkent`, `Chimgan mountains in winter`

**`/tashkent-airport-transfer/` — Transfer**
- Primary: `Tashkent airport transfer`
- Secondary: `Tashkent airport taxi`, `TAS airport pickup`, `airport to city center Tashkent`, `night airport transfer Tashkent`
- Long-tail: `how much is a taxi from Tashkent airport to the city center`, `meet and greet Tashkent airport`

**`/about-us/` — About**
- Primary: `City Center Apartments Tashkent`
- Secondary: `Tashkent local host`, `apartments and tours Tashkent`, `English speaking guide Tashkent`
- Long-tail: `who runs apartment rentals in Tashkent`

**`/contact-us/` — Contact**
- Primary: `book apartment Tashkent WhatsApp`
- Secondary: `contact Tashkent apartment host`, `Tashkent tour booking`, `Tashkent transfer booking`
- Long-tail: `how to book an apartment in Tashkent without a card`

### Meta titles / descriptions

Formula: `<Primary keyword> · <Concrete benefit> · <Brand>`, **≤ 60 chars**, keyword front-loaded. Descriptions 140–160 chars, keyword in the first half, one concrete number, CTA verb at the end. **`|` is forbidden in every locale string** (vue-i18n plural separator) — use `·`, `—`, `.`, `:`.

Write all twelve strings (6 pages × 2 locales) into `i18n/locales/<lang>/seo.json`. Starting EN set (tune to the char budget, verify with the Phase 4 grep):

| Page | Title (EN) |
|---|---|
| `/` | `Tashkent Apartments, Tours & Transfers · City Center` |
| Apartments | `Tashkent City Center Apartments · Daily Rent` |
| Tours | `Tashkent Tours: Amirsoy, Chimgan · City Center Apts` |
| Transfer | `Tashkent Airport Transfer 24/7 · City Center Apts` |
| About | `About Us · Tashkent Apartments & Tours · City Center` |
| Contact | `Contact & Booking on WhatsApp · City Center Apts` |

The `<Brand>` suffix resolves from `useAppConfig().brand.name` — never hardcode a literal in a template.

### Content inventory

**Apartments (2)** — `features/apartments/composables/useApartments.ts`

| id | slug-key | Facts | Photo brief (16:10) |
|---|---|---|---|
| `amir-timur-loft` | `apartments.amir-timur-loft.*` | 74 m² · 2 bedrooms · 2 baths · 8th floor · fibre Wi-Fi · self check-in | *Warm daylight interior of a two-bedroom Tashkent apartment: cream plaster walls, low oak coffee table, deep terracotta leather armchair, floor lamp with a white linen shade, sheer curtains diffusing afternoon light, a framed abstract print above a sideboard, ceramic vases. Editorial interiors photography, warm white balance, soft natural light, faint film grain, no people, 16:10 landscape.* |
| `tashkent-city-panorama` | `apartments.tashkent-city-panorama.*` | 52 m² · 1 bedroom · 1 bath · 16th floor · city view · self check-in | *High-floor studio in Tashkent City: floor-to-ceiling window with the Tashkent City Park towers visible at golden hour, cream bouclé sofa, round marble side table, muted rose throw blanket, minimal styling. Warm grading, natural light only, no people, 16:10 landscape.* |

Each apartment additionally carries: 5–7 amenity bullets, a "what's nearby" list (Amir Timur Square, Broadway, Chorsu, metro station, Tashkent City Park), and a 2-paragraph description block feeding the 1200-word quota.

**Tours (10)** — `features/tours/composables/useTours.ts`, grouped by `category`

| Category | Tours |
|---|---|
| `mountains` | Amirsoy Resort Day Trip · Chimgan Mountains & Cable Car · Charvak Lake Escape · Beldersay Peak Hike |
| `city` | Old Tashkent: Chorsu Bazaar & Khast Imam · Tashkent Metro Architecture Tour · Bazaar & Food Walk |
| `winter` | Amirsoy & Beldersay Ski Day Transfer |
| `day-trips` | Samarkand Day Trip (Afrosiyob high-speed train) · Bukhara Day Trip |

Each tour: duration, group size, difficulty/season, 3–5 highlight bullets, and a photo brief. Photo briefs must name the real landmark (e.g. *"Amirsoy resort gondola rising over snow-dusted Tian Shan ridges under a clear winter sky, wide landscape, cool-neutral highlights with warm sunlit slopes, no people in frame, 16:10"*).

Home shows the 4 `mountains` tours; `/tashkent-tours-amirsoy-chimgan/` shows all 10 grouped by category with an `h2` per group.

**Transfers (5 routes)** — `features/transfer/composables/useTransferRoutes.ts`
Tashkent Airport (TAS) → City Center · City Center → TAS · TAS → Amirsoy / Chimgan · Late-night & early-morning flights · Railway station transfers (Samarkand / Bukhara departures).
Service features: meet & greet with a name sign, flight tracking, 60 minutes free waiting, child seat on request, English- and Russian-speaking driver, sedan or minivan.

**Reviews (12)** — `features/reviews/composables/useReviews.ts`
Each: `{ id, name, country, service: "apartments" | "tours" | "transfer", quoteKey }`. Mix nationalities and services. Texts live in `i18n/locales/<lang>/reviews.json`. **Placeholder status must be tracked by a single `REVIEWS_ARE_VERIFIED = false` constant in the composable, and the `Review` JSON-LD must be gated behind it.**

**FAQ (10)** — `features/faq/composables/useFaq.ts` with a `page` field so each page renders its own subset and emits a matching `FAQPage` schema.

---

# PHASE 0 — Strip the backend, rewire config, wire Vercel

**Goal:** a clean, building, backend-free Nuxt 3 SSG project on `en`/`ru`, deployable to Vercel. No new features yet.

### 0.1 Persist this plan
Write this file verbatim to `requirements/plan.md`.

### 0.2 Delete (backend leftovers, unused, or superseded)

```
requirements/requirements_backend.md
server/                                   (whole directory: api/health.get.ts + data/payload.*.json)
public/data/                              (payload.{ru,en,uz}.json)
composables/usePayload.ts
composables/useSiteConfigData.ts
composables/useLeadForm.ts
stores/site-config.ts
plugins/00.static-payload.server.ts
plugins/00.payload-bootstrap.client.ts
plugins/zz.payload-fix.ts
middleware/payload-bootstrap.global.ts
types/payload.ts
types/api.ts
components/ui/InlineContactForm.vue
components/ui/BasePhoneInput.vue
components/ui/ContactPhoneCard.vue
nginx.conf
i18n/locales/uz/                          (whole directory)
i18n/locales/{en,ru}/forms.json
pages/kontakty/
```

After deleting, grep for every deleted symbol and fix the fallout before moving on:
`usePayload`, `useStaticSlice`, `EMPTY_PAYLOAD`, `payloadLocaleFromPath`, `ensureClientPayload`, `waitForPayloadBootstrap`, `setClientPayload`, `markPayloadBootstrapReady`, `StaticPayload`, `PayloadLocale`, `useSiteConfigStore`, `useSiteConfigData`, `SiteConfig`, `useLeadForm`, `PaginatedResponse`, `ApiError`, `InlineContactForm`, `BasePhoneInput`, `ContactPhoneCard`, `apiBase`, `forms.`.

Known call sites to fix:
- `composables/useSeo.ts` — drop the `useStaticSlice("seo-og-image", …)` block; `DEFAULT_OG_IMAGE` becomes the sole fallback and is changed to `/og-default.png` (built in 0.7).
- `layouts/default.vue` — remove the `useSiteConfigData()` call.
- `components/layout/AppFooter.vue` — replace every `siteConfig.data.*` read with `useAppConfig().contact.*` (see 0.4).
- `composables/useFaq.ts` — rewrite as a static content composable (Phase 3 fills the data).

### 0.3 Brand + contact constants — `app.config.ts`

```ts
export default defineAppConfig({
    brand: {
        name: "City Center Apartments",
        legalName: "City Center Apartments",
        domain: "tashkentapartmentstours.com",
    },
    contact: {
        whatsapp: "998988080515",
        telegram: "998887070504",
        city: "Tashkent",
        country: "UZ",
        timezone: "Asia/Tashkent",
    },
});
```

Drop `pagination` (no listings pagination). Every phone/social read in the app resolves from here — **no hardcoded numbers in any component.** `AppFooter` builds its links from `contact.whatsapp` / `contact.telegram`; Instagram and email are omitted until supplied (the footer already renders conditionally — keep that).

### 0.4 `nuxt.config.ts`

- `runtimeConfig.public`: remove `apiBase`; set `defaultLocale: "en"`; keep `siteUrl` defaulting to `https://tashkentapartmentstours.com`; keep `gtmId` / `gaId`.
- `app.head.htmlAttrs.lang: "en"`; `meta theme-color` → `#F5EEE7`.
- `i18n`: `defaultLocale: "en"`, `locales: [{ code: "en", language: "en-US", name: "English", files: [...] }, { code: "ru", language: "ru-RU", name: "Русский", files: [...] }]`. Keep `strategy: "prefix_except_default"`, `lazy: true`, `langDir: "locales/"`, `detectBrowserLanguage: false`. New namespace list per locale: `common, nav, footer, seo, home, apartments, tours, transfer, about, contact, reviews, faq, social-proof, alert, error-boundary, error404`.
- `site.url` / `site.name` → domain + `"City Center Apartments"`. Keep `trailingSlash: true`.
- `nitro.prerender.routes`: all 12 URLs (6 pages × 2 locales), explicitly listed, `crawlLinks: true` retained.
- `nitro.routeRules`: replace the `/en/**` / `/uz/**` / `/kontakty/**` entries with `/**: { prerender: true }` and drop `/data/payload.**` entirely. **Keep the asset cache-control entries but understand they are inert on Vercel static output** — the real headers are set in `vercel.json` (0.6).
- Keep: `preset: "static"`, `compressPublicAssets`, `features.inlineStyles: true`, all `experimental` flags, `build.transpile: ["gsap"]`, the `data-tier` critical inline script, the two font preloads.

### 0.5 Fix `scripts/strip-leaked-paths.mjs`
Its regex targets `frontend/i18n/locales/`, but this repo has no `frontend/` prefix — it currently strips **nothing**. Change the pattern to match `i18n/locales/` with an optional leading path segment. Verify after a build that the emitted JS no longer contains absolute locale paths.

### 0.6 Vercel

Create `vercel.json` at repo root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "installCommand": "npm ci",
  "trailingSlash": true,
  "cleanUrls": false,
  "headers": [
    { "source": "/_nuxt/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/_ipx/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
    ]}
  ]
}
```

`framework: null` + explicit `outputDirectory` is deliberate: the project stays on `nitro.preset: "static"` (no serverless functions, no Nuxt→Vercel adapter), so Vercel serves `.output/public` as pure static files at CDN edge. Do **not** switch to `preset: "vercel"` — it would introduce a function runtime this site does not need.

Rewrite `.env.example`:
```
NUXT_PUBLIC_SITE_URL=https://tashkentapartmentstours.com
NUXT_PUBLIC_SITE_NAME=City Center Apartments
NUXT_PUBLIC_GTM_ID=
NUXT_PUBLIC_GA_ID=
```
Confirm `.gitignore` covers `.vercel`, `.output`, `.nuxt`, `node_modules`, `.env`.

### 0.7 OG image
`public/og-image.svg` is not a valid social share asset (1200×630 PNG is mandatory). Add `scripts/build-og-image.mjs` that rasterises a brand SVG (`#F5EEE7` field, `#212121` wordmark, `#770101` rule) to `public/og-default.png` at exactly 1200×630 using the already-installed `sharp`, and prepend it to the `build` script. Point `useSeo`'s `DEFAULT_OG_IMAGE` at `/og-default.png`. Delete `public/og-image.svg` and fix the three `og-image.png` references inside `composables/useJsonLd.ts`.

### 0.8 `useJsonLd.ts` adjustments
- Replace every `["ru", "en", "uz"]` / `["ru-RU","en-US","uz-UZ"]` list with the two live locales; default `inLanguage` becomes `"en-US"`.
- Delete unused builders: `jobPosting`, `blog`, `collectionPage`, `article`, `creativeWork`. (Grep first — if none are referenced after Phase 3, they go.)
- Strip the `priceRange` default and the `offers` / `hasOfferCatalog` branch from `localBusiness` (no prices are published).
- Add three small builders following the existing `inject(id, json)` pattern: `apartment(input)` → `Apartment`, `touristTrip(input)` → `TouristTrip`, `taxiService(input)` → `TaxiService`. Each accepts `{ name, description, url }` plus type-specific fields, and none emits price data.

### Phase 0 exit criteria
- [ ] `npm install && npm run typecheck` → 0 errors
- [ ] `npm run lint` → 0 warnings
- [ ] `npm run build` completes; `.output/public/` contains `index.html` and `ru/index.html`
- [ ] `grep -rE "payload|apiBase|site-config|LeadForm|uz" --include='*.ts' --include='*.vue' .` returns nothing outside `node_modules`/`requirements`
- [ ] No `frontend/` path strings remain in built JS
- [ ] `public/og-default.png` exists and is exactly 1200×630

---

# PHASE 1 — Design system, shared primitives, layout chrome

**Goal:** the brand is fully expressed in tokens and reusable components. Still no page content.

### 1.1 `assets/styles/colors.scss`
Rewrite to §D1 exactly. Remove every deleted token after repointing its usages.

### 1.2 `assets/styles/main.scss`
Add: `--section-py`, `--pill-radius`, `--inner-radius`, `--outer-radius`, `--base-padding`, `--base-gap`, `--small-margin`, `--large-margin`, `--container`, `--icon-size*` ladder (§D7), `--lh-snug: 1.06`. Set `--app-header-height` to `rem(80)` desktop / `rem(72)` laptop / `rem(64)` mobile. Set `--bottom-nav-height: calc(rem(72) + env(safe-area-inset-bottom))` on mobile, `0px` elsewhere (the raised centre Book pill needs the extra height).

Extend the `:root[data-tier=…]` block to cover the new header/bottom-nav elements exactly as the existing pattern does.

### 1.3 `assets/styles/base/_typography.scss`
Implement §D3's full responsive scale through the `bp` mixins. Set the display exception for the home hero via a `--hero-display-*` token consumed by the hero component. **Never redeclare these sizes in a component.**

### 1.4 `assets/styles/helpers/_mixins.scss`
Add the `on-dark` mixin (§D2). It reassigns the text/border/surface custom properties for descendants — it is the **only** mechanism for dark-section text inversion.

### 1.5 SVG icons
Add the 13 new icon SFCs from §D7, matching the existing pattern byte-for-byte in structure (`viewBox`, `currentColor`, `--icon-size`-driven inline `iconStyle`, `minWidth` present).

### 1.6 Layout chrome

**`components/layout/AppHeader.vue`**
- Wordmark: live text `City Center Apartments` at `rem(20)`/700, `-0.02em`, `--ink`. On mobile it may wrap to two lines at `rem(16)` — set an explicit `max-width` so it never pushes the controls. When the logo file arrives it replaces this text node; nothing else changes.
- Nav links (order): Apartments · Tours · Airport transfer · About · Contact. All via `useLocalePath()` with trailing slashes.
- Controls, in source order: `BookButton size="small"` → burger → `AppLangSwitcher` (**anchor last**, per the CLS rule).
- Keep the existing scroll hide/show + `--scrolled` behaviour. Scrolled state: `--surface` background + `--border-color` bottom hairline. Top state: transparent.
- Keep the `provide("appHeaderHidden", hidden)` contract for the lang dropdown.

**`components/layout/AppMobileBottomNav.vue`**
Rebuild to the 5-slot layout of §D8. The centre `Book` slot is an `<a>` to the WhatsApp link (`useBookingLink("general")`), rendered as a `rem(56)` `--primary-color` circle with a white `SvgWhatsApp`, translated `rem(-12)` upward and given a matching `rem(4)` `--surface` ring so it reads as raised without a shadow. `aria-label` required.

**`components/layout/AppMobileMenu.vue`**
All 5 links + `BookButton fullwidth` + lang switcher. Keep the existing drawer mechanics: teleport, scroll lock, focus trap, Escape, route-change close, symmetric 360ms, and the `watch(burgerVisible, …)` auto-close when the viewport leaves the burger range.

**`components/layout/AppFooter.vue`**
Restructure to 4 columns on desktop → 2 on tablet → 1 on mobile:
1. Wordmark (hero-scale, `rem(40)`, standing alone — no tagline glued to it) + one-sentence positioning line.
2. Pages (all 5 links — these count toward the internal-link quota).
3. Contact (WhatsApp + Telegram links, `Tashkent, Uzbekistan`, `Daily 08:00–23:00 (Asia/Tashkent)`).
4. `BookButton` + social icon row.
Bottom bar: `© {year} City Center Apartments. All rights reserved.` + lang switcher. Surface `--surface-ink`, `on-dark` mixin applied at the root. Keep `v-reveal.stagger` on the top grid. Replace the `rem(1)` hairline currently in `&__contact-link + &` with `rem(2)` (the existing value violates the border rule).

### 1.7 Shared primitives
Build `BookButton`, `MediaPlaceholder`, `FactChip`, `OfferCard`, `SectionHeader`, `StatBand` to §D6. Retune `BaseButton` variants to the brand. Retune `BaseAccordion` to brand tokens for the FAQ.

### 1.8 `features/booking/composables/useBookingLink.ts`

```
useBookingLink(context: BookingContext): ComputedRef<string>
```
`BookingContext` is a discriminated union: `{ kind: "general" }` | `{ kind: "apartment"; id }` | `{ kind: "tour"; id }` | `{ kind: "transfer"; id }`. Returns `https://wa.me/<contact.whatsapp>?text=<encodeURIComponent(message)>`, where the message is a locale-aware `t()` string (`booking.message.general`, `booking.message.apartment`, …) interpolated with the item's translated title. **No `Math.random()`, no `Date.now()`, no `window`** — the value must be identical on server and client. All 4 message strings live in `common.json` per locale.

### Phase 1 exit criteria
- [ ] Typecheck + lint clean; build succeeds
- [ ] `grep -rE "border[^:]*:\s*(rem\(1\)|1px\s)" --include='*.scss' --include='*.vue' .` → 0 matches
- [ ] `grep -rE "@media\s" --include='*.scss' --include='*.vue' .` → matches only in `helpers/_breakpoints.scss` and `animations/__animations.scss`
- [ ] `grep -rE "box-shadow|backdrop-filter|linear-gradient|radial-gradient|conic-gradient" --include='*.scss' --include='*.vue' .` → only the `:-webkit-autofill` reset
- [ ] `grep -riE "inter|roboto|montserrat|poppins|manrope|archivo|@fontsource" .` (excluding `node_modules`) → 0 matches
- [ ] Resize 360 → 640 → 768 → 1024 → 1280 → 1440 → 1920: every top-level page reachable at every width, no flash of wrong-tier chrome
- [ ] Header CTA, bottom-nav Book pill, and footer CTA all open the correct prefilled WhatsApp chat in both locales

---

# PHASE 2 — Home page

**Goal:** `/` and `/ru/` complete, ≥800 words per locale, ≥12 internal links, all JSON-LD present.

Build under `features/home/components/`. `pages/index.vue` may only call `useSeo`, `useJsonLd`, and compose the section components — **zero markup, zero logic**.

Section order is the owner's, verbatim:

### 2.1 `HomeHero.vue` — `--surface-warm`
Two-column at ≥1024px (text left `1.1fr`, media right `1fr`), stacked on mobile. Modelled on reference mockup 1.
- `h1` — the display size from §D3, `data-hero="title"`, masked-word reveal. EN copy pattern: **"Find your home in the heart of Tashkent"** (contains the primary keyword as a close natural variant). One `h1` per page, no exceptions.
- Lead (`data-hero="lead"`), 2 sentences, naming apartments + tours + transfers.
- Actions row (`data-hero="actions"`): `BookButton` + `outline-light` "See the apartments" → `/tashkent-city-center-apartments/`.
- `FactChip` row (`data-hero="card"`, staggered): `2 apartments in the centre` · `10 tours` · `Airport transfers 24/7` · `Reply in 10 minutes`.
- Media: `MediaPlaceholder` 4:5, `data-hero="media"`, `v-parallax="8"`. Brief: *"Cream-plastered Tashkent apartment building facade in late afternoon light with deep-red architectural accents, low camera angle, clean geometric composition, warm grading, faint film grain, no people, 4:5 portrait."*
- **The media block is never opacity-hidden** — it must stay LCP-eligible.

### 2.2 `HomeApartments.vue` — `--surface`
`SectionHeader` (`h2`: "Apartments in Tashkent city center") + 2-column `OfferCard` grid (1 column ≤639px), `v-reveal.stagger`. Trailing `ghost` link to the apartments page.

### 2.3 `HomeTours.vue` — `--surface-ink` (`on-dark`)
`SectionHeader` (`h2` naming Amirsoy and Chimgan explicitly) + the 4 `mountains` `OfferCard`s in a 4→2→1 responsive grid, `v-reveal.stagger`. Cards use the dark variant. Trailing `outline-dark` link to the tours page.

### 2.4 `HomeTransfer.vue` — `--surface-warm`
Split layout: left `SectionHeader` + a 6-item feature checklist (`SvgCheck`, `<ul>` — the sanctioned `::before`-marker exception); right a 5-row route list from `useTransferRoutes()`, each row `From → To` with an `SvgArrowRight` and a `"Price on request"` line. `BookButton` beneath. Link to the transfer page.

### 2.5 `HomeContacts.vue` — `--surface`
Two large contact tiles (WhatsApp, Telegram) built from `OfferCard`-grade markup: icon, channel name, the number, expected reply time, arrow chip. Plus a line of trust facts (`Tashkent, Uzbekistan` · `Daily 08:00–23:00` · `English & Russian`). Links to `/contact-us/` and `/about-us/`.

### 2.6 `HomeReviews.vue` — `--surface-ink` (`on-dark`)
`SectionHeader` + a two-row horizontal marquee of all 12 review cards (row 1 → left, row 2 → right, different speeds). Card: `SvgQuote`, quote text, name, country, service tag. Pure CSS `@keyframes` translate; `animation-play-state: paused` on `:hover`/`:focus-within`; fully disabled under reduced motion (rows become a static wrapped grid). Container `size="full"` with `overflow: hidden` — the sanctioned full-bleed exception. **No `Review` JSON-LD** (§ locked decisions).

### 2.7 `pages/index.vue`
`useSeo({ title, description })` from `seo.json`; `useJsonLd().website()`, `.localBusiness({...})`, `.itemList([apartments, tours, transfer], "Services")`. `organization()` is emitted once by `layouts/default.vue`.

### Phase 2 exit criteria
- [ ] `/` and `/ru/` each ≥ 800 words of real body copy
- [ ] ≥ 12 internal links per locale, every one through `useLocalePath()`, no "click here" / bare "read more" anchor text
- [ ] Exactly one `<h1>`; heading order H1 → H2 → H3, no skips
- [ ] Hero media is the LCP element and is never `opacity: 0`
- [ ] Every section wraps content in `<AppContainer size="wide">` (reviews marquee excepted)
- [ ] Reduced-motion pass: every reveal, the parallax, and the marquee resolve to a static final state
- [ ] Lighthouse (mobile, throttled) on `/` and `/ru/`: **100 / 100 / 100 / 100**, LCP < 2 s

---

# PHASE 3 — The five inner pages

**Goal:** all pages complete at quota, in both locales.

Each page file contains only `useSeo` + `useJsonLd` + composed section components. Every page starts with `<AppBreadcrumbs>` (semantic `nav > ol > li`, last item `aria-current="page"`) and ends with a shared closing CTA band + a page-scoped `FaqSection`.

### 3.1 `/tashkent-city-center-apartments/` — `features/apartments/components/`
`ApartmentsHero` (h1 with the primary keyword) → `ApartmentsList` (both apartments as full-width detail blocks: `MediaPlaceholder`, description, `FactChip` grid, amenities checklist, "what's nearby" list, `BookButton`) → `ApartmentsLocation` (why the centre: Amir Timur Square, Broadway, Chorsu, metro, Tashkent City Park — each a paragraph, several linking to relevant tours) → `ApartmentsHowItWorks` (3 steps: message on WhatsApp → confirm dates → self check-in) → FAQ (apartment subset) → CTA band.
JSON-LD: `itemList` of `apartment()` entries + `breadcrumbList` + `faqPage`. **1200 words, 14 internal links.**

### 3.2 `/tashkent-tours-amirsoy-chimgan/` — `features/tours/components/`
`ToursHero` → four `ToursGroup` blocks (`h2` per category: Mountains · Tashkent city · Winter & ski · Day trips), each an `OfferCard` grid with `v-reveal.stagger` → `ToursPractical` (season table, what to bring, drive times from the city centre, pickup from the apartments) → FAQ (tour subset) → CTA band.
JSON-LD: `itemList` of `touristTrip()` entries + `breadcrumbList` + `faqPage`. **1200 words, 14 internal links.**

### 3.3 `/tashkent-airport-transfer/` — `features/transfer/components/`
`TransferHero` → `TransferRoutes` (5 route rows, `"Price on request"`) → `TransferFeatures` (meet & greet, flight tracking, 60 min free waiting, child seat, bilingual driver, sedan/minivan) → `TransferHowItWorks` (send flight number on WhatsApp → confirmation → driver meets you with a name sign) → `TransferAirportGuide` (arrivals hall, SIM cards, currency exchange, drive time to the centre — the long-tail depth) → FAQ (transfer subset) → CTA band.
JSON-LD: `taxiService()` + `breadcrumbList` + `faqPage`. **1200 words, 14 internal links.**

### 3.4 `/about-us/` — `features/about/components/`
`AboutHero` (hero-scale wordmark, standing alone, fade-up only) → `AboutStory` (2–3 paragraphs) → `AboutStats` (`StatBand`, count-up: apartments, tours, years hosting, languages) → `AboutPrinciples` (4 principle blocks: local hosts, one WhatsApp thread, honest pricing, no hidden fees) → `AboutServices` (three blocks linking to the three service pages) → CTA band.
JSON-LD: `aboutPage()` + `organization()`. **1500 words, 6 internal links.**

### 3.5 `/contact-us/` — `features/contact/components/`
`ContactHero` → `ContactChannels` (WhatsApp / Telegram tiles, large, with response-time copy) → `ContactHours` (daily hours, Asia/Tashkent, what to include in a first message) → `ContactAreas` (districts and landmarks served, links to all service pages) → CTA band. **No form, no map embed, no calendar.**
JSON-LD: `contactPage({ telephone, ... })` + `localBusiness()`. **800 words, 6 internal links.**

### 3.6 Shared closing band
One `features/booking/components/BookingCtaBand.vue` on `--surface-ink`, reused by all five pages: `h2`, one-line lead, `BookButton` + Telegram `outline-dark` button. Built once, never duplicated.

### 3.7 `error.vue` / `[...slug].vue`
Rebrand to the new palette; the 404 offers links to all five pages (counts as internal linking) plus a `BookButton`.

### Phase 3 exit criteria
- [ ] Every page meets its word quota **in both locales** (translated, not abbreviated)
- [ ] Every page meets its internal-link minimum
- [ ] Exactly one `<h1>` per page; strict H1→H2→H3 order
- [ ] Every page emits its full JSON-LD set; Rich Results test → **0 errors, 0 warnings**
- [ ] `grep -r '|' i18n/locales/` finds no pipe inside any message value
- [ ] Every locale JSON file wraps its content in a top-level key matching its filename
- [ ] Typecheck + lint clean

---

# PHASE 4 — Social proof, polish, SEO verification, ship

### 4.1 `features/social-proof/`
- `stores/social-proof.ts` (Pinia): `queue`, `current`, `shownCount`, `dismissed`; actions `start()`, `next()`, `dismiss()`.
- `composables/useSocialProof.ts`: builds the message pool from `social-proof.json` and the tour/apartment titles.
- `components/SocialProofToaster.vue`: rendered **inside the existing `<ClientOnly>` block in `layouts/default.vue`**.

### 4.2 Toast mechanics — mandatory guard rails
- Position: bottom-left, above `--bottom-nav-height` + `env(safe-area-inset-bottom)`; `z-index: var(--z-toast)`.
- Card: `--surface`, `rem(2)` `--border-color`, `--outer-radius`, `rem(16)` padding, `max-width: rem(360)`, small `MediaPlaceholder`-free icon chip in `--primary-color`, message text `rem(14)`, relative-time line `rem(12)`/`--ink-60`, close button ≥ `rem(44)`.
- Trigger: first toast at **25% scroll depth or 20 s**, whichever first; subsequent every **35–55 s**; **hard cap 4 per session**; never on `/contact-us/`.
- State: `sessionStorage` read **inside `onMounted`** only. Randomness (`Math.random()`) is client-only by construction (inside `<ClientOnly>`) — never at setup top level.
- A11y: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`, dismissible by button **and** Escape, never traps focus, never blocks a CTA.
- Motion: Vue `<Transition>`, symmetric 320ms slide+fade, canonical easing; auto-dismiss after 6 s; **fully suppressed under `prefers-reduced-motion`** (the toaster does not render at all).
- Cleanup: every `setTimeout` / `setInterval` cleared in `onBeforeUnmount`; scroll depth via `useScroll` from `@vueuse/core`, never a raw listener.
- Message pool (~14 variants across the three services), e.g. `"{n} people are viewing this apartment right now"`, `"{n} people just booked a Chimgan mountains tour"`, `"{n} airport transfers confirmed today"`. `n` ∈ 2–5.
- **Never place these strings inside JSON-LD, `<meta>`, or prerendered HTML.** They are client-only UI. This is non-negotiable: putting fabricated counts into structured data is a manual-action risk, and prerendering them would make them crawlable claims.

### 4.3 `public/llms.txt`, `robots.txt`, sitemap
Rewrite `llms.txt` to describe the real business. Confirm `@nuxtjs/robots` points at `/sitemap_index.xml` and that the built sitemap contains all 12 URLs with trailing slashes and correct hreflang alternates.

### 4.4 Performance pass
- Confirm the hero `MediaPlaceholder` is not lazy and not opacity-hidden.
- Below-the-fold heavy sections (`HomeReviews`, `SocialProofToaster`) rendered via the `Lazy` prefix.
- `shallowRef` for the review/tour arrays; `markRaw` for icon components passed through `<component :is>`; stable `:key` (entity id, never index) in every `v-for`.
- Verify GSAP is still lazy and only loaded by parallax + counters.

### 4.5 Greppable SEO verification — all five must produce **empty** output
```sh
find .output/public -name "index.html" -exec grep -L "hreflang" {} \;
find .output/public -name "index.html" -exec grep -L 'rel="canonical"' {} \;
for f in $(find .output/public -name "index.html"); do c=$(grep -c "<h1" "$f"); [ "$c" != "1" ] && echo "$f has $c h1"; done
find .output/public -name "index.html" -exec grep -L "application/ld+json" {} \;
find .output/public -name "index.html" -exec grep -L "og:image" {} \;
```
Plus: every page has ≥ 3 `hreflang` matches (en + ru + x-default); no `?utm_` in any canonical; `/ru/...` canonicals include the `/ru/` prefix; every `<title>` ≤ 60 chars; every `<meta name="description">` between 140 and 160 chars.

Pattern-D check on `.output/public/index.html`: the `setAttribute('data-tier'` inline script appears **before** the first inline `<style>`, and a `:root[data-tier="…"]` selector appears in the inlined critical CSS.

### 4.6 Full audit sweep
Run the complete verification checklist from `requirements_ai.md` on every new component: no destructured reactive sources without `storeToRefs`/`toRefs`; no bare `if (someRef)`; no `onMounted` + `$fetch`; no raw `addEventListener`; no manual imports of auto-imported symbols; no top-level `window`/`document`/`localStorage`/`Date.now()`/`Math.random()`; no `any`, no `as` (except `as const`), no `!`, no `@ts-ignore`; **no comments anywhere**. Reload each page three times in both locales: zero hydration-mismatch warnings, zero appear-then-disappear flashes.

### 4.7 Review-schema switch (leave documented, leave OFF)
`useReviews()` exports `REVIEWS_ARE_VERIFIED = false`. `ReviewsSection` emits `Review` + `AggregateRating` JSON-LD **only** when it is `true`. Flipping it after real reviews land is the entire change. Ship with it `false`.

### 4.8 Ship
`npm run build` → `vercel` preview deploy → verify both locales, all 12 routes, the WhatsApp deep links on a real phone, and Lighthouse 100×4 on `/` mobile → promote to production. Add `NUXT_PUBLIC_SITE_URL` and `NUXT_PUBLIC_SITE_NAME` in the Vercel project settings.

### Phase 4 exit criteria
- [ ] All five SEO greps empty
- [ ] Rich Results test: 0 errors, 0 warnings, on all 6 pages × 2 locales
- [ ] Lighthouse 100/100/100/100 on every page × every locale, mobile and desktop
- [ ] LCP < 2 s on throttled mobile
- [ ] Zero hydration warnings, zero flashes, zero console errors
- [ ] Toast never appears under reduced motion and never in prerendered HTML
- [ ] Vercel production deploy live on `tashkentapartmentstours.com`

---

## Standing constraints (apply to every phase)

1. **Zero comments** in any shipped `.ts`, `.vue`, or `.scss`.
2. Build it **once** in `components/ui/` and reuse. If you write the same block twice, extract it.
3. Page files hold only `useSeo` + `useJsonLd` + composed sections.
4. Tokens only — no raw px, no atomic CSS, no inline `style` (sole exception: `--icon-size` on `<svg>`).
5. Breakpoint mixins only — never a raw `@media`.
6. Borders ≥ `rem(2)`; all sizes even.
7. No gradients, no `box-shadow`, no `backdrop-filter`, no blur.
8. No eyebrows, no badges, no decorative dot-marks.
9. Full EN/RU parity — a section that exists in one locale exists in the other, at the same depth.
10. Accessibility is not optional: heading order, 4.5:1 body contrast, `rem(44)` touch targets, visible focus rings in `--primary-color`, meaningful alt/aria text, keyboard reachability, honoured reduced motion.

---

## Open items awaiting the owner

- **Logo file** → replaces the wordmark text node in `AppHeader`, `AppFooter`, `AboutHero`, and the OG image. No other change.
- **Apartment and tour photography** → replaces every `MediaPlaceholder` with `OptimizedMedia`. The briefs in the content composables are the generation prompts.
- **Real review texts** → replace `reviews.json` strings and flip `REVIEWS_ARE_VERIFIED` to `true`.
- **Email address, Instagram handle, exact street address** → `app.config.ts` `contact` block; the footer and `LocalBusiness` schema pick them up conditionally.
