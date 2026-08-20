# DESIGN.md — City Center Apartments

This file is the concrete design source-of-truth for **City Center Apartments** (`tashkentapartmentstours.com`). It mirrors the SCSS architecture in `assets/styles/` and lists the canonical tokens, motion curves, breakpoints and component anatomies that every agent must consume via CSS variables — never reinvent, never hardcode.

For engineering rules see [requirements_ai.md](requirements_ai.md). For design philosophy (why these choices) see [frontend.md](frontend.md). For the build plan see [plan.md](plan.md).

The brand in one line: **a warm cream page, one deep-red accent, near-black ink, and nothing else.** Depth comes from tonal contrast and `rem(2)` hairlines. There is no dark mode, no gradient, no shadow, no blur.

---

## 1. Color System

Strictly light. `<html>` carries `color-scheme: light` permanently. There is no `prefers-color-scheme` branch and no `[data-theme]` attribute. Dark **sections** exist as a local design choice and are handled by the `on-dark` mixin (§ 2), not by a theme.

All tokens live in `assets/styles/colors.scss`.

**Brand**

| Token | Value | Use |
|---|---|---|
| `--brand-red` | `#770101` | Raw brand red — the source value |
| `--brand-rose` | `#9f7070` | Raw brand rose — the source value |
| `--primary-color` | `#770101` | Primary CTA fill, focus ring, active nav, icon accents, inline links |
| `--light-primary-color` | `#9f7070` | Primary hover, muted rose accents, decorative hairlines, large-text-only accent |

`--primary-color` / `--light-primary-color` are the semantic aliases components consume. `--brand-red` / `--brand-rose` exist so the raw hue is nameable in one place; prefer the semantic pair everywhere.

**Surface**

| Token | Value | Use |
|---|---|---|
| `--surface-warm` | `#f5eee7` | **Default page background** (`.app-shell`), hero plates, warm sections |
| `--surface` | `#ffffff` | Cards, white sections, scrolled header, drawer panel |
| `--surface-mute` | `#ede4da` | Chips, hover fill, media-placeholder fill, step numbers |
| `--surface-ink` | `#241e1c` | Dark-contrast sections and the footer |
| `--card-cream` | `#f5eee7` | Alias — card on a white surface |
| `--white` | `#ffffff` | Pure white for labels on `--primary-color` |
| `--black` | `#241e1c` | Raw ink source value |

**Ink**

| Token | Value | Use |
|---|---|---|
| `--ink` | `#241e1c` | Headings, strongest body text |
| `--ink-80` | `rgba(36, 30, 28, 0.8)` | Body copy inside sections |
| `--ink-60` | `rgba(36, 30, 28, 0.68)` | Secondary copy, captions, card descriptions |
| `--ink-40` | `rgba(36, 30, 28, 0.4)` | Breadcrumb separators, tertiary hints |
| `--ink-20` | `rgba(36, 30, 28, 0.16)` | Accordion rules, decorative dividers |
| `--text-color` | `#241e1c` | Default document text colour |
| `--text-color-secondary` | `rgba(36, 30, 28, 0.68)` | Secondary document text |

**Borders and status**

| Token | Value | Use |
|---|---|---|
| `--border-color` | `rgba(36, 30, 28, 0.12)` | Every card, tile, table and list hairline |
| `--hr-border-color` | `rgba(36, 30, 28, 0.08)` | `<hr>` |
| `--error-color` | `#770101` | Error text (the brand red doubles as the error hue) |
| `--error-background` | `rgba(119, 1, 1, 0.08)` | Error surface tint |
| `--success-color` | `#241e1c` | Success text |
| `--success-background` | `rgba(36, 30, 28, 0.06)` | Success surface tint |

**On-dark inversions** — consumed only by the `on-dark` mixin, never referenced directly by a component.

| Token | Value |
|---|---|
| `--on-dark-text` | `#ffffff` |
| `--on-dark-text-secondary` | `rgba(255, 255, 255, 0.72)` |
| `--on-dark-text-muted` | `rgba(255, 255, 255, 0.62)` |
| `--on-dark-border` | `rgba(255, 255, 255, 0.16)` |
| `--on-dark-surface` | `rgba(255, 255, 255, 0.04)` |
| `--on-dark-surface-hover` | `rgba(255, 255, 255, 0.08)` |

### Contrast law — enforce, do not skip

| Pair | Ratio | Verdict |
|---|---|---|
| `#241e1c` on `#f5eee7` | 14.3:1 | ✓ body text |
| `#241e1c` on `#ffffff` | 16.4:1 | ✓ body text |
| `rgba(36, 30, 28, 0.68)` on `#f5eee7` | 5.3:1 | ✓ secondary copy |
| `#770101` on `#f5eee7` | 10.2:1 | ✓ body text and links |
| `#770101` on `#ffffff` | 11.7:1 | ✓ body text and links |
| `#ffffff` on `#770101` | 11.7:1 | ✓ CTA labels |
| `#ffffff` on `#241e1c` | 16.4:1 | ✓ dark sections |
| `rgba(255,255,255,0.62)` on `#241e1c` | 7.1:1 | ✓ muted copy on dark |
| **`#9f7070` on `#f5eee7`** | **3.6:1** | **✗ fails AA for body text** |
| **`#9f7070` on `#241e1c`** | **3.9:1** | **✗ fails AA for body text** |

`--light-primary-color` on a light surface is permitted **only** for: text ≥ `rem(24)` bold, hairline borders, decorative separators, non-informational icons, and hover states of elements that are already accessible. Never for paragraphs, labels, captions or link text. On `--surface-ink` it measures 3.9:1 — the `on-dark` mixin remaps `--primary-color` to it for icons, fills, hairlines and large bold type, never for body-sized text.

### Forbidden palette

Any fifth hue. Any gradient (`linear-`, `radial-`, `conic-`, two-stop card fills, `background-image` gradients). Any decorative `box-shadow`. `backdrop-filter` / `filter: blur()`. Purple-on-white AI-slop. Neon accents. Pastel rainbows. Cool blue-grey shadows. Material-style elevation.

The palette is: **deep-red primary + rose hover + warm cream surface + near-black ink.** Changing it means rewriting `colors.scss`, not patching a component.

---

## 2. Typography

Font family: **Onest**, variable weight axis `400..700`, served as local `.woff2` from `public/fonts/onest/` with Latin, Latin-Ext, Cyrillic and Cyrillic-Ext subsets. The Latin and Cyrillic files are preloaded in `nuxt.config.ts`. `--font` resolves to `Onest, "Onest Fallback", sans-serif`.

**One typeface only.** No display pairing, no `@fontsource/*`, no second family even as a fallback. The heavy grotesk look of the reference mockups is Onest 700 at `-0.03em` tracking at display sizes.

**Weight tokens**

| Token | Value |
|---|---|
| `--font-weight-regular` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-bold` | `700` |

### Fluid display tokens

Display sizes are `clamp()` tokens defined once in `assets/styles/base/_typography.scss` and consumed by name. Components never restate a display size.

| Token | Value | Use |
|---|---|---|
| `--fz-hero` | `clamp(rem(44), 7vw, rem(96))` | Home hero `h1` only |
| `--fz-page-title` | `clamp(rem(32), 4.6vw, rem(64))` | `h1` on every inner page (`PageHero`) |
| `--fz-section-title` | `clamp(rem(26), 3.4vw, rem(44))` | Every section `h2` |
| `--fz-subsection-title` | `clamp(rem(20), 1.8vw, rem(28))` | Card and block `h3` |
| `--fz-lead` | `clamp(rem(18), 1.4vw, rem(20))` | Lead paragraph under a heading |
| `--fz-body` | `rem(16)` | Body copy — never below 16 (anti-zoom) |
| `--fz-body-sm` | `rem(14)` | Card descriptions, chips, table cells |
| `--fz-caption` | `rem(12)` | Column labels, ratios, all-caps labels |

### Element scale

The global `h1`–`h6` rule carries `line-height: var(--lh-snug)`, `letter-spacing: var(--ls-heading)`, `color: var(--text-color)` and `text-wrap: balance`. `h1`–`h3` are 700, `h4`–`h6` are 500 with `--ls-body`.

| Element | Desktop ≥1366 | ≤1279 | ≤1023 | ≤639 |
|---|---|---|---|---|
| `h1` | `rem(64)` | `rem(48)` | `rem(40)` | `rem(32)` |
| `h2` | `rem(44)` | `rem(36)` | `rem(30)` | `rem(26)` |
| `h3` | `rem(28)` | `rem(24)` | `rem(22)` | `rem(20)` |
| `h4` | `rem(22)` | `rem(22)` | `rem(20)` | `rem(18)` |
| `h5` | `rem(20)` | `rem(20)` | `rem(18)` | `rem(18)` |
| `h6` | `rem(18)` | `rem(18)` | `rem(18)` | `rem(16)` |
| Body | `rem(16)` | `rem(16)` | `rem(16)` | `rem(16)` |
| Small | `rem(14)` | `rem(14)` | `rem(14)` | `rem(14)` |

Components that render display type use the `--fz-*` tokens above rather than the raw `h*` sizes, so a `SectionHeader` heading is `--fz-section-title` regardless of which tag it renders.

### Line-height and tracking

| Token | Value | Use |
|---|---|---|
| `--lh-hero` | `0.92` (mobile `1`) | Home hero display |
| `--lh-tight` | `1` | Inner-page `h1` |
| `--lh-snug` | `1.06` | All headings |
| `--lh-base` | `1.4` | Global default, chips, table cells |
| `--lh-relaxed` | `1.6` | Paragraphs, list items, blockquotes |
| `--ls-hero` | `-0.03em` | Home hero display |
| `--ls-display` | `-0.03em` | Stat counters |
| `--ls-heading` | `-0.02em` | `h1`–`h3`, section titles |
| `--ls-body` | `0` | Body copy, `h4`–`h6` |
| `--ls-caps` | `0.1em` | The all-caps exception |

**All-caps is permitted in exactly four places**, always at `--fz-caption` with `--ls-caps`: footer column titles, the locale code in the language switcher, the `MediaPlaceholder` "photo needed" label, and column labels inside a card (`In every apartment`, `Around the corner`, `Routes we drive`). Nowhere else, and never on body copy.

### Forbidden typographic patterns

Gradient text fills (`background-clip: text`). Manual `text-shadow`. Whole-paragraph italics — italic is for the rare emphasised word. Decorative underlines — underline means link. Decorative dot-marks on or beside text. And **eyebrow / kicker / preheader / dateline labels above any heading — zero tolerance.** The `h1`/`h2`/`h3` introduces itself.

---

## 3. Spacing & Sizing

Every sizing value is even and expressed with `functions.rem()` at the token layer, consumed as `var(--*)` in components.

| Token | Value | Mobile | Use |
|---|---|---|---|
| `--base-padding` | `rem(16)` | — | Smallest comfortable padding |
| `--base-gap` | `rem(16)` | — | Default flex/grid gap |
| `--small-margin` | `rem(24)` | `rem(16)` (`rem(20)` ≤1279) | Tight vertical rhythm |
| `--large-margin` | `rem(40)` | `rem(24)` (`rem(32)` ≤1279) | Block-to-block rhythm |
| `--inner-radius` | `rem(16)` | — | Inner corners — media inside a card, chips on tiles |
| `--outer-radius` | `rem(32)` | `rem(24)` | Cards, tiles, media plates, modals |
| `--pill-radius` | `rem(999)` | — | Buttons, chips, circular markers |
| `--section-py` | `rem(120)` | `rem(72)` (`rem(96)` ≤1279) | Vertical padding of every public section |
| `--interactive-height` | `rem(56)` | — | Canonical interactive height |
| `--container` | `min(100%, rem(1600))` | — | Page max-width clamp |
| `--app-header-height` | `rem(80)` | `rem(64)` (`rem(72)` ≤1279) | Fixed header height, reserved by `.app-shell__main` |
| `--bottom-nav-height` | `0px` | `calc(rem(72) + env(safe-area-inset-bottom))` | Reserved by `.app-shell` `padding-bottom` |

**Container sizes** — the shared `<AppContainer size="…">`:

| Size | max-width | When to use |
|---|---|---|
| `narrow` | `rem(880)` | `AppNotFound` only |
| `default` | `rem(1280)` | Not used on public pages |
| `wide` | `rem(1600)` | **Mandatory for every public-page section** |
| `full` | none | Edge-to-edge only — the reviews marquee track |

**Rules.** Values even — `rem(14)`, `rem(16)`, `rem(20)` yes; `rem(13)`, `rem(15)` never. Every border, outline and text-decoration-thickness ≥ `rem(2)`. Hero plates reserve space with `aspect-ratio`, never `min-height: 100dvh`. Touch targets ≥ `rem(44)` on mobile. Every public section wraps its content in `<AppContainer size="wide">` so all left and right edges sit on one vertical guide.

---

## 4. Motion

**Canonical easing: `--ease-decel` = `cubic-bezier(0.22, 1, 0.36, 1)`** for everything. `--ease-soft` = `cubic-bezier(0.33, 1, 0.68, 1)` exists for masked type only. No spring, no bounce, no scroll-jacking, no page-transition morphs.

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | `200ms` | Hover tint, border colour, icon nudge, link colour |
| `--dur-state` | `240ms` | Card hover, chip, dropdown, accordion icon |
| `--dur-drawer` | `360ms` | Mobile menu, off-canvas drawer |
| `--dur-header` | `400ms` | Header hide/show on scroll |
| `--dur-reveal` | `900ms` | Default scroll reveal |
| `--btns-transition` | `300ms` | Legacy button timing token |
| `--transition` | `240ms var(--ease-decel)` | Composite shorthand; becomes `0ms linear` under reduced motion |

Hero intro timelines run staged between 400ms and 1200ms; the toast enter/leave pair is a symmetric 320ms.

**Symmetric mandate.** Every open/close element animates with identical enter and leave duration and easing, driven by Vue `<Transition>` + SCSS. GSAP is never used for "this appeared / this disappeared".

### The reveal vocabulary — reuse it, never rebuild it

Registered by `plugins/scroll-reveal.ts`; the CSS contract lives in `assets/styles/animations/__animations.scss`.

| Directive / composable | Effect | Use on |
|---|---|---|
| `v-reveal` | Fade + rise. Variants `.up` (default) `.down` `.left` `.right` `.scale` `.zoom` `.clip` `.clipLeft`; timing `.fast` / `.slow` | Single blocks, prose, action rows |
| `v-reveal.stagger` | Reveals direct children in sequence | Grids, lists, chip rows |
| `v-reveal.text` (`.chars`) | Masked word reveal | Section headings — already applied inside `SectionHeader` |
| `v-parallax="8..12"` | Scrubbed vertical parallax (GSAP, lazy) | Media only |
| `useHeroIntro(rootRef)` | Staged hero timeline via `data-hero="title\|lead\|actions\|card\|media"` | `PageHero`, `HomeHero` |
| `useStatsCounter(rootRef, sel)` | Count-up numerics | `StatBand` |
| `useGsap()` | Memoised lazy GSAP | Parallax and counters only |

**Rules.** One heading per section gets `v-reveal.text` — and because `SectionHeader` already carries it, a section must never add another. One grid per section gets `v-reveal.stagger`. Never double-animate an element. Never `v-parallax` something already carrying a CSS transform. Reduced motion self-disables through the global `bp.reduced-motion` block — never add a per-component guard.

**Assigned motion, by element**

| Element | Mechanism |
|---|---|
| Home hero `h1` | `useHeroIntro` masked words |
| Inner-page `h1`, lead, actions, chips, media | `PageHero` `data-hero="title / lead / actions / card / media"` |
| Every section `h2` | `v-reveal.text` inside `SectionHeader` |
| Every card grid, checklist, step list | `v-reveal.stagger` |
| Prose blocks and link rows | `v-reveal` (default up) |
| Detail media plates | `v-reveal.scale` |
| Reviews marquee | CSS `@keyframes` translate, paused on hover and focus, static grid under reduced motion |
| Card hover | `border-color` + `background-color` + chip `translateX(rem(2))`. Never a `translateY` lift, never a shadow |

---

## 5. Breakpoints

Source of truth: `assets/styles/helpers/_breakpoints.scss`. **Always the mixins, never a raw `@media`.**

| Tier | Range | Navigation pattern |
|---|---|---|
| `mobile` | `0–639px` | `AppMobileBottomNav` — 5 slots, centre `Book` pill |
| `tablet` | `640–1023px` | Burger → `AppMobileMenu` drawer |
| `laptop` | `1024–1279px` | Burger → `AppMobileMenu` drawer |
| `notebook` | `1280–1365px` | Inline horizontal nav + `BookButton` |
| `desktop` | `≥1366px` | Inline horizontal nav + `BookButton` |

Mixins: `bp.down($tier)`, `bp.up($tier)`, `bp.only($tier)`, `bp.between($from, $to)`, `bp.short` (`max-height: 500px`), `bp.reduced-motion`. Import alias is always `bp`.

```scss
@use "~/assets/styles/helpers/breakpoints" as bp;

.section {
    padding-block: var(--section-py);

    @include bp.down("laptop") { grid-template-columns: 1fr; }
    @include bp.down("mobile") { gap: functions.rem(24); }
}
```

**Zero navigation gaps at any width.** Visibility of viewport-gated chrome is decided before first paint by the `data-tier` attribute: an inline `<script>` in `nuxt.config.ts` writes `data-tier` on `<html>` using the same thresholds, and `main.scss` pairs it with `:root[data-tier="…"]` rules that outrank scoped `@media`. Keep the scoped `@media` rules as the no-JS fallback; do not layer a post-hydration `v-if` on top.

Grids step through intermediate column counts (4 → 2 → 1, or 3 → 2 → 1) — never straight from a wide desktop grid to one mobile column.

---

## 6. Component Anatomy

Every primitive is built once in `components/ui/` (or `components/layout/`) and reused. Never re-style one inline; add a variant to the component instead.

### `BaseButton` — `components/ui/BaseButton.vue`

Default padding `rem(16) rem(28)` at `rem(16)`; `size="small"` is `rem(12) rem(20)` at `rem(14)`. Radius `--pill-radius`. Border `rem(2) solid transparent` or token-coloured per variant. Focus ring `rem(2) solid var(--primary-color)` at `rem(4)` offset. Transitions `background-color`, `color`, `border-color` at 240ms `--ease-decel`.

| Variant | Anatomy |
|---|---|
| `primary` | `--primary-color` fill, white label; hover `--light-primary-color` |
| `secondary` | `--surface-mute` fill, `--ink` label; hover `--surface-warm` |
| `outline-light` | Transparent, `rem(2)` `--ink` border, `--ink` label; hover fills `--ink`, label `--surface-warm` |
| `outline-dark` | For `--surface-ink` sections: transparent, `rem(2)` white border; hover fills white, label `--surface-ink` |
| `ghost` | Text + trailing arrow, no fill, no inline padding; hover `--primary-color` |
| `icon` | Icon-only `--interactive-height` circle, `--border-color` hairline, `--ink` glyph; hover fills `--surface-mute` with a `--light-primary-color` border. Token-driven, so it inverts correctly inside `on-dark` |
| `primary-pill` | **The signature CTA** — see below |

`to` is resolved through `useLocalePath()` internally, so pass raw paths with a trailing slash. `href` renders a plain `<a>`. States: `disabled`, `loading` (inline spinner, `aria-busy="true"`), `fullwidth`.

### `BaseButton --primary-pill` — sitewide signature CTA

```
[ padding-left rem(28) ][ label rem(16)/500 ][ gap rem(16) ][ chip circle rem(44) ][ padding-right rem(8) ]
```

| Property | Value |
|---|---|
| Radius | `--pill-radius` |
| Background | `--primary-color`, hover `--light-primary-color` |
| Label | white, `rem(16)`, weight 500 |
| Padding | `rem(8) rem(8) rem(8) rem(28)` (mobile left `rem(20)`) |
| Total height | ~`rem(60)` desktop, ~`rem(56)` mobile |
| Chip | white circle `rem(44)` (mobile `rem(40)`) with a `--primary-color` `SvgArrowRight`; overridable via the `#icon` slot |
| Chip motion | `translateX(rem(2))` on hover, 240ms `--ease-decel`, skipped under reduced motion |

**Discipline:** `primary-pill` is the **booking** CTA only — header, hero, card footers, contacts band, closing band, mobile bottom nav. Secondary navigation uses `outline-light`, `outline-dark` or `ghost`. Never combine it with `rounded` (it is already round).

### `BookButton` — `components/ui/BookButton.vue`

The one file that owns the WhatsApp contract. Wraps `BaseButton` (`primary-pill` by default), resolves `href` from `useBookingLink(contextKind, itemTitle)`, and always sets `target="_blank"`, `rel="noopener noreferrer"` and an `aria-label` that names the item. Every booking CTA on the site renders this — no component ever builds a `wa.me` URL itself.

### `PageHero` — `components/ui/PageHero.vue`

The one hero for all five inner pages. `--surface-warm`, `padding-block: rem(48) var(--section-py)` (mobile `rem(32)`), `AppContainer size="wide"`.

Anatomy top→bottom: `AppBreadcrumbs` → `h1` at `--fz-page-title` / `--lh-tight` / `--ls-heading` → lead at `--fz-lead` / `--lh-relaxed` / `--ink-80`, max-width `rem(680)` → `#actions` slot → `FactChip` row. With `photoBrief` set it becomes a two-column grid (`1.1fr / 0.9fr`) with a `MediaPlaceholder` on the right, collapsing to one column at ≤1279px. Root ref drives `useHeroIntro`, so the parts carry `data-hero` and the media is **never** opacity-hidden — it stays LCP-eligible.

### `OfferCard` — `components/ui/OfferCard.vue`

The one card used by apartments, tours and transfers. `MediaPlaceholder` (16:10, `--inner-radius`) → `h3` at `--fz-subsection-title` → description at `--fz-body-sm` / `--ink-60` → `FactChip` row → default slot → footer with `"Price on request"` left and `BookButton size="small"` right, separated by a `rem(2)` top hairline. Padding `rem(24)` (mobile `rem(16)`), radius `--outer-radius`, border `rem(2) solid var(--border-color)`. `tone="light"` sits on `--surface`; `tone="dark"` sits on `rgba(255,255,255,0.04)` and switches the button to `outline-dark`. `facts` accepts plain strings or `CardFact` objects (`{ label, icon }`) which render the chip icon. Hover moves the border to `--light-primary-color` and the title to `--primary-color`, and lifts a dark card to `--on-dark-surface-hover` — no translate, no shadow.

### `BaseCarousel` — `components/ui/BaseCarousel.vue`

The one horizontal slider. Takes `items` and exposes each through the default slot, so slides stay whatever component the section needs. Native CSS scroll-snap track (`scroll-snap-type: x mandatory`, `scroll-behavior: smooth`, hidden scrollbar) — no carousel dependency. Visible slides step 3 → 2 (≤1279) → 1 (≤639); never a fractional count. Controls are two `BaseButton variant="icon"` circles pinned right below the track, disabled at each end through `useScroll`'s `arrivedState` (throttled), labelled from `common.carousel-prev` / `common.carousel-next`.

Pointer-drag ("grab and pull") is handled with template pointer handlers plus `setPointerCapture`: touch pointers are ignored so the platform keeps its own momentum scrolling, mouse and pen drag the track directly. Snapping is suspended while dragging (`--dragging`) and while the release glides to the nearest slide (`--settling`), otherwise mandatory snap fights the imperative `scrollLeft`. A drag beyond `rem(6)` swallows the following click so a pulled card never fires its link. Under reduced motion every smooth scroll resolves to an instant jump.

### `MediaPlaceholder` — `components/ui/MediaPlaceholder.vue`

**The single swap point** for real photography. Props `{ brief, ratio, tone, label, compact }`. `compact` keeps the frame and the label but drops the visible brief and ratio — every card context uses it, large single plates (heroes, detail pages) do not. Renders a `--surface-mute` (or `rgba(255,255,255,0.05)` on dark) block at the given `aspect-ratio`, `--outer-radius`, an inset `rem(2)` dashed hairline at 32% opacity, and the shot brief centred at `--fz-body-sm` with `max-width: rem(420)` and `text-wrap: balance`. Carries `role="img"` and `:aria-label="brief"`. Replacing it with `OptimizedMedia` is a one-component change.

### `FactChip` — `components/ui/FactChip.vue`

Pill: `--surface-mute` fill, `--pill-radius`, `rem(10) rem(18)` padding, `--fz-body-sm` at weight 500, `line-height: 1.2`, `white-space: nowrap`, optional `icon` prop — an `IconName` rendered through `SvgIcon` at `--icon-size-sm` in `--primary-color`.

### `SectionHeader` — `components/ui/SectionHeader.vue`

`h2` at `--fz-section-title` (already carrying `v-reveal.text`) + optional lead at `--fz-lead` / `--ink-60`, max-width `rem(760)`, + optional `#action` slot pinned right. `split` (default `true`) puts the action beside the title; `:split="false"` stacks. No eyebrow, no badge, no dot — ever.

### `CheckList` / `StepList` — `components/ui/`

`CheckList` — `<ul>` with a `rem(24)` `--primary-color` circle holding a white `SvgCheck`, rows at `--fz-body` / `--lh-relaxed` / `--ink-80`, `rem(14)` gap, `v-reveal.stagger` built in. The sanctioned multi-row marker exception.

`StepList` — ordered 3-column grid (2 at ≤1279px, 1 at ≤639px) of `rem(2)`-hairline cards at `rem(28)` padding, each opening with a `rem(48)` `--surface-mute` circle carrying the index, then an `h3` and body copy.

### `StatBand` — `components/ui/StatBand.vue`

`<dl>` of 3–4 figures, 4 columns → 2 at ≤1279px. Numbers `clamp(rem(40), 4vw, rem(64))` at weight 700, `line-height: 1`, `--ls-display`, tabular numerals, wired to `useStatsCounter`. `tone="dark"` (default) applies `on-dark`; `tone="light"` uses `--surface-mute`. Radius `--outer-radius`, padding `rem(56) rem(40)`.

### `BaseAccordion` — `components/ui/BaseAccordion.vue`

Row separated by a `rem(2)` `--ink-20` top rule. Trigger is a full-width button, `rem(28) 0` padding, `rem(20)` label (mobile `rem(16)`), `aria-expanded` + `aria-controls`. The icon is a `rem(44)` circle with two `rem(16)×rem(2)` bars; open state fills it `--primary-color` with white bars and rotates the vertical bar to horizontal. The panel animates `grid-template-rows: 0fr → 1fr` over 420ms `--ease-decel` with a paired opacity fade — symmetric on close.

### `BaseModal` / `BaseDropdown` / `AppMobileMenu`

`BaseModal` — teleported to `body`, backdrop `rgba(36, 30, 28, 0.6)` (no blur), panel `--surface` at `--inner-radius`, `rem(32)` padding, `max-width: rem(520)`, `max-height: 90dvh` with internal scroll, `useScrollLock` + `useFocusTrap`, Escape and backdrop close, symmetric 240ms.

`BaseDropdown` — the only floating primitive. Auto-flips on both axes against real viewport bounds; consumers do not pass `placement` or `align`. Panel `--surface`, `rem(2) solid var(--border-color)`, `rem(12)` radius, `var(--z-dropdown)`, 240ms scale + opacity, CSS only. Closes on click-outside, Escape and route change.

`AppMobileMenu` — right-hand drawer, panel `min(100%, rem(400)) × 100dvh` on `--surface`, backdrop `rgba(36, 30, 28, 0.5)`, scroll lock, focus trap, symmetric `--dur-drawer` slide, auto-closes when the viewport leaves the 640–1279px burger range.

### `AppMobileBottomNav` — `components/layout/`

Fixed bottom bar, mobile only, height `--bottom-nav-height` = `calc(rem(72) + env(safe-area-inset-bottom))`. Five slots: `Home · Apartments · Book · Tours · More`. The centre slot is an `<a>` to the WhatsApp link rendered as a `rem(56)` `--primary-color` circle with a white `SvgWhatsApp`, raised `rem(-12)` and ringed with `rem(4)` of `--surface` so it reads as lifted without a shadow. `aria-label` required.

### `AppBreadcrumbs` — `components/layout/`

Semantic `<nav> → <ol> → <li>`, last item a `<span aria-current="page">`, separators as decorative `::before` `/` glyphs at `--ink-40`. `rem(14)`, weight 500. Themed through `--crumb-color`, `--crumb-color-hover`, `--crumb-current`, `--crumb-sep`; `on-dark` prop swaps them to the white scale. Links go through `useLocalePath()`.

---

## 7. Iconography

Icons are Vue SFCs in `components/svg/` with a hardcoded `viewBox="0 0 24 24"`, `stroke="currentColor"` (or `fill="currentColor"`), and an inline style object driving `width`, `height` **and `minWidth`** from `--icon-size`. Colour follows text; size follows the parent. Never set width or height on an SVG from SCSS — set `--icon-size` on the parent instead. No emoji, ever.

| Token | Value | Use |
|---|---|---|
| `--icon-size-xs` | `rem(12)` | Inline beside captions |
| `--icon-size-sm` | `rem(16)` | List markers, ghost-button arrows, chip icons, breadcrumb glyphs |
| `--icon-size-md` | `rem(20)` | Default — drawer links, form labels |
| `--icon-size-lg` | `rem(24)` | Header burger, feature medallions |
| `--icon-size-xl` | `rem(32)` | Large CTAs |
| `--icon-size-2xl` | `rem(48)` | Hero / feature icons |
| `--icon-size` | alias of `-md` | Fallback |

Shipped set: `SvgArrowRight`, `SvgArrowUpRight`, `SvgBath`, `SvgBed`, `SvgBuilding`, `SvgBurger`, `SvgCalendar`, `SvgCheck`, `SvgChevronDown`, `SvgClock`, `SvgClose`, `SvgDocument`, `SvgEmptyInbox`, `SvgGrid`, `SvgHeart`, `SvgInstagram`, `SvgKey`, `SvgLink`, `SvgLinkedIn`, `SvgMail`, `SvgMountain`, `SvgPhone`, `SvgPin`, `SvgPlane`, `SvgQuote`, `SvgRuler`, `SvgSearch`, `SvgSnowflake`, `SvgStar`, `SvgTelegram`, `SvgTrain`, `SvgUsers`, `SvgWhatsApp`, `SvgWifi`, `SvgYouTube`, `SvgZoomIn`, `SvgZoomOut`, plus `nav/SvgNav{Home,Apartments,Tours,Transfer,Contact,More}`.

---

## 8. Photography & Imagery

**Direction: warm editorial documentary.** Real rooms and real ridgelines in natural light, warm white balance (slightly amber, never cool blue), faint film grain, no people in frame, generous negative space, one clear subject per shot. Interiors read lived-in rather than staged: cream plaster, pale oak, terracotta leather, muted rose textiles. Landscapes name the actual place — the Amirsoy gondola line, the Chimgan ridge, the blue dome of Chorsu, the Tashkent City towers at golden hour.

**We do not shoot:** stock corporate imagery, sterile studio flat-lays, neon-graded cityscapes, HDR-crushed skies, low-key dramatic chiaroscuro, gratuitous drone footage, models posing as guests, or abstract gradient blobs as decoration.

**Current state.** No photography has been supplied, so every image slot renders `MediaPlaceholder` carrying its shot brief as the accessible label. The briefs in the content composables and locale files double as generation prompts. When real photos arrive, swapping `MediaPlaceholder` for `OptimizedMedia` is a one-component change.

**When photos land**, every `<img>` goes through `components/ui/OptimizedMedia.vue` (`<NuxtImg>`): AVIF + WebP build-time variants, explicit `width` and `height` (CLS prevention is mandatory), `loading="eager"` + `fetchpriority="high"` for the above-fold LCP image and lazy for everything below, meaningful `alt` always.

**Art-direction crops**

| Breakpoint | Crop |
|---|---|
| `≤639px` | Portrait or square — 4:5 or 1:1 |
| `640–1023px` | 16:10 |
| `≥1024px` | 16:10 for cards, 4:3 for inner-page heroes, 4:5 for the home hero plate |

Mobile assets never load on desktop and vice versa — `<source media="…">` segregation is strict.

---

## 9. Z-Index Scale

Defined in `assets/styles/base/_zIndexes.scss`. Never write a raw `z-index: 999`.

| Token | Value | Use |
|---|---|---|
| `--z-background` | `-1` | Background decoration |
| `--z-base` | `0` | Default content |
| `--z-base-upper` | `1` | Slightly raised content, sticky sub-navs |
| `--z-content` | `2` | Main UI elements |
| `--z-layout` | `3` | Sticky header, sticky bottom nav |
| `--z-dropdown` | `4` | Open dropdowns and popovers |
| `--z-app-nav` | `5` | App navigation surfaces |
| `--z-overlay` | `5` | Backdrops |
| `--z-modal` | `6` | Modals, drawers, route loader |
| `--z-popover` | `7` | Tooltips above modals |
| `--z-tooltip` | `8` | Standard tooltips |
| `--z-toast` | `9` | Toast notifications |
| `--z-top` | `10` | Debug overlays only — never production UI |

Any section that sets a raw `z-index` on a positioned child **must** carry `isolation: isolate` on its root, or those values compete with the header at the page root.

---

## 10. Forbidden Patterns (Visual)

- **Gradients — zero tolerance.** No `linear-gradient`, `radial-gradient`, `conic-gradient`, two-stop card fill or gradient `background-image` anywhere. Every surface is one solid token.
- **`box-shadow` for decoration — zero tolerance.** No elevated cards, no glow on CTAs, no hover shadow. Depth is a `rem(2)` alpha hairline plus tonal contrast. The only permitted `box-shadow` is the functional `:-webkit-autofill` reset.
- **`backdrop-filter` / `filter: blur()`** — glassmorphism and frosted navigation bars.
- **Eyebrows, kickers, preheaders, datelines** above any heading, and **pill / badge labels** ("NEW", "PRO"). Functional list labels — footer column titles, card column labels, the locale code — are not eyebrows and stay.
- **Decorative dot-marks** on or beside text: no brand-mark period after a heading, no coloured dot inside a letter counter, no accent dot glued to a keyword.
- **A fifth hue.** Monotony is solved with spacing and type contrast, never with a new colour.
- **`--light-primary-color` as body-text colour on a light surface** — it fails AA at 3.4:1.
- **Dark-mode toggle**, `prefers-color-scheme` branches, `[data-theme="dark"]`.
- **Atomic CSS** (Tailwind, UnoCSS, ad-hoc utility classes) and inline `style` props — the sole exception is `--icon-size` on an `<svg>`.
- **Raw `@media`** outside `_breakpoints.scss`, raw `px`, odd sizing values, borders under `rem(2)`.
- Auto-playing hero video, particle effects, confetti, animated emoji, skewed decorative shapes, page-transition morphs, bouncing spring easing.

**What we DO use:** `rem(2)` hairline borders; background-tint hover; alpha transparency for depth; one confident decel easing for every state change; a single deep-red accent on a calm cream field; generous negative space; large headings against restrained body copy; scroll reveals that always serve content; and real, warm photography once it exists.
