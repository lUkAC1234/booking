# DESIGN.md — City Center Apartments

This file is the concrete design source-of-truth for **City Center Apartments** (`tashkentapartmentstours.com`). It mirrors the SCSS architecture in `assets/styles/` and lists the canonical tokens, motion curves, breakpoints and component anatomies that every agent must consume via CSS variables — never reinvent, never hardcode.

For engineering rules see [requirements_ai.md](requirements_ai.md). For design philosophy (why these choices) see [frontend.md](frontend.md). For the build plan see [plan.md](plan.md).

The brand in one line: **a warm cream page, one deep-red accent, near-black ink, and nothing else.** Depth comes from tonal contrast and `rem(2)` hairlines. There is no dark mode, no gradient, no shadow, no blur.

---

## 1. Color System

Strictly light. `<html>` carries `color-scheme: light` permanently. There is no `prefers-color-scheme` branch and no `[data-theme]` attribute. Dark **sections** exist as a local design choice and are handled by the `on-dark` mixin (§ 2), not by a theme.

All tokens live in `assets/styles/colors.scss`.

**Brand**

| Token                   | Value     | Use                                                                             |
| ----------------------- | --------- | ------------------------------------------------------------------------------- |
| `--brand-red`           | `#770101` | Raw brand red — the source value                                                |
| `--brand-rose`          | `#9f7070` | Raw brand rose — the source value                                               |
| `--primary-color`       | `#770101` | Primary CTA fill, focus ring, active nav, icon accents, inline links            |
| `--light-primary-color` | `#9f7070` | Primary hover, muted rose accents, decorative hairlines, large-text-only accent |

`--primary-color` / `--light-primary-color` are the semantic aliases components consume. `--brand-red` / `--brand-rose` exist so the raw hue is nameable in one place; prefer the semantic pair everywhere.

**Surface**

| Token            | Value     | Use                                                                    |
| ---------------- | --------- | ---------------------------------------------------------------------- |
| `--surface-warm` | `#f5eee7` | **Default page background** (`.app-shell`), hero plates, warm sections |
| `--surface`      | `#ffffff` | Cards, white sections, scrolled header, drawer panel                   |
| `--surface-mute` | `#ede4da` | Chips, hover fill, media-placeholder fill, step numbers                |
| `--surface-ink`  | `#241e1c` | Dark-contrast sections and the footer                                  |
| `--card-cream`   | `#f5eee7` | Alias — card on a white surface                                        |
| `--white`        | `#ffffff` | Pure white for labels on `--primary-color`                             |
| `--black`        | `#241e1c` | Raw ink source value                                                   |

**Ink**

| Token                    | Value                    | Use                                         |
| ------------------------ | ------------------------ | ------------------------------------------- |
| `--ink`                  | `#241e1c`                | Headings, strongest body text               |
| `--ink-80`               | `rgba(36, 30, 28, 0.8)`  | Body copy inside sections                   |
| `--ink-60`               | `rgba(36, 30, 28, 0.68)` | Secondary copy, captions, card descriptions |
| `--ink-40`               | `rgba(36, 30, 28, 0.4)`  | Breadcrumb separators, tertiary hints       |
| `--ink-20`               | `rgba(36, 30, 28, 0.16)` | Accordion rules, decorative dividers        |
| `--text-color`           | `#241e1c`                | Default document text colour                |
| `--text-color-secondary` | `rgba(36, 30, 28, 0.68)` | Secondary document text                     |

**Borders and status**

| Token                  | Value                    | Use                                                 |
| ---------------------- | ------------------------ | --------------------------------------------------- |
| `--border-color`       | `rgba(36, 30, 28, 0.12)` | Every card, tile, table and list hairline           |
| `--hr-border-color`    | `rgba(36, 30, 28, 0.08)` | `<hr>`                                              |
| `--error-color`        | `#770101`                | Error text (the brand red doubles as the error hue) |
| `--error-background`   | `rgba(119, 1, 1, 0.08)`  | Error surface tint                                  |
| `--success-color`      | `#241e1c`                | Success text                                        |
| `--success-background` | `rgba(36, 30, 28, 0.06)` | Success surface tint                                |

**On-dark inversions** — consumed only by the `on-dark` mixin, never referenced directly by a component.

| Token                      | Value                       |
| -------------------------- | --------------------------- |
| `--on-dark-text`           | `#ffffff`                   |
| `--on-dark-text-secondary` | `rgba(255, 255, 255, 0.72)` |
| `--on-dark-text-muted`     | `rgba(255, 255, 255, 0.62)` |
| `--on-dark-border`         | `rgba(255, 255, 255, 0.16)` |
| `--on-dark-surface`        | `rgba(255, 255, 255, 0.04)` |
| `--on-dark-surface-hover`  | `rgba(255, 255, 255, 0.08)` |

### Contrast law — enforce, do not skip

| Pair                                  | Ratio     | Verdict                      |
| ------------------------------------- | --------- | ---------------------------- |
| `#241e1c` on `#f5eee7`                | 14.3:1    | ✓ body text                  |
| `#241e1c` on `#ffffff`                | 16.4:1    | ✓ body text                  |
| `rgba(36, 30, 28, 0.68)` on `#f5eee7` | 5.3:1     | ✓ secondary copy             |
| `#770101` on `#f5eee7`                | 10.2:1    | ✓ body text and links        |
| `#770101` on `#ffffff`                | 11.7:1    | ✓ body text and links        |
| `#ffffff` on `#770101`                | 11.7:1    | ✓ CTA labels                 |
| `#ffffff` on `#241e1c`                | 16.4:1    | ✓ dark sections              |
| `rgba(255,255,255,0.62)` on `#241e1c` | 7.1:1     | ✓ muted copy on dark         |
| **`#9f7070` on `#f5eee7`**            | **3.6:1** | **✗ fails AA for body text** |
| **`#9f7070` on `#241e1c`**            | **3.9:1** | **✗ fails AA for body text** |

`--light-primary-color` on a light surface is permitted **only** for: text ≥ `rem(24)` bold, hairline borders, decorative separators, non-informational icons, and hover states of elements that are already accessible. Never for paragraphs, labels, captions or link text. On `--surface-ink` it measures 3.9:1 — the `on-dark` mixin remaps `--primary-color` to it for icons, fills, hairlines and large bold type, never for body-sized text.

### Forbidden palette

Any fifth hue. Any gradient (`linear-`, `radial-`, `conic-`, two-stop card fills, `background-image` gradients). Any decorative `box-shadow`. `backdrop-filter` / `filter: blur()`. Purple-on-white AI-slop. Neon accents. Pastel rainbows. Cool blue-grey shadows. Material-style elevation.

The palette is: **deep-red primary + rose hover + warm cream surface + near-black ink.** Changing it means rewriting `colors.scss`, not patching a component.

---

## 2. Typography

Font family: **Onest**, variable weight axis `400..700`, served as local `.woff2` from `public/fonts/onest/` with Latin, Latin-Ext, Cyrillic and Cyrillic-Ext subsets. The Latin and Cyrillic files are preloaded in `nuxt.config.ts`. `--font` resolves to `Onest, "Onest Fallback", sans-serif`.

**One typeface only.** No display pairing, no `@fontsource/*`, no second family even as a fallback. The heavy grotesk look of the reference mockups is Onest 700 at `-0.03em` tracking at display sizes.

**Weight tokens**

| Token                   | Value |
| ----------------------- | ----- |
| `--font-weight-regular` | `400` |
| `--font-weight-medium`  | `500` |
| `--font-weight-bold`    | `700` |

### Fluid display tokens

Display sizes are `clamp()` tokens defined once in `assets/styles/base/_typography.scss` and consumed by name. Components never restate a display size.

| Token                   | Value                            | Use                                    |
| ----------------------- | -------------------------------- | -------------------------------------- |
| `--fz-hero`             | `clamp(rem(44), 7vw, rem(96))`   | Home hero `h1` only                    |
| `--fz-page-title`       | `clamp(rem(32), 4.6vw, rem(64))` | `h1` on every inner page (`PageHero`)  |
| `--fz-section-title`    | `clamp(rem(26), 3.4vw, rem(44))` | Every section `h2`                     |
| `--fz-subsection-title` | `clamp(rem(20), 1.8vw, rem(28))` | Card and block `h3`                    |
| `--fz-lead`             | `clamp(rem(18), 1.4vw, rem(20))` | Lead paragraph under a heading         |
| `--fz-body`             | `rem(16)`                        | Body copy — never below 16 (anti-zoom) |
| `--fz-body-sm`          | `rem(14)`                        | Card descriptions, chips, table cells  |
| `--fz-caption`          | `rem(12)`                        | Column labels, ratios, all-caps labels |

### Element scale

The global `h1`–`h6` rule carries `line-height: var(--lh-snug)`, `letter-spacing: var(--ls-heading)`, `color: var(--text-color)` and `text-wrap: balance`. `h1`–`h3` are 700, `h4`–`h6` are 500 with `--ls-body`.

| Element | Desktop ≥1366 | ≤1279     | ≤1023     | ≤639      |
| ------- | ------------- | --------- | --------- | --------- |
| `h1`    | `rem(64)`     | `rem(48)` | `rem(40)` | `rem(32)` |
| `h2`    | `rem(44)`     | `rem(36)` | `rem(30)` | `rem(26)` |
| `h3`    | `rem(28)`     | `rem(24)` | `rem(22)` | `rem(20)` |
| `h4`    | `rem(22)`     | `rem(22)` | `rem(20)` | `rem(18)` |
| `h5`    | `rem(20)`     | `rem(20)` | `rem(18)` | `rem(18)` |
| `h6`    | `rem(18)`     | `rem(18)` | `rem(18)` | `rem(16)` |
| Body    | `rem(16)`     | `rem(16)` | `rem(16)` | `rem(16)` |
| Small   | `rem(14)`     | `rem(14)` | `rem(14)` | `rem(14)` |

Components that render display type use the `--fz-*` tokens above rather than the raw `h*` sizes, so a `SectionHeader` heading is `--fz-section-title` regardless of which tag it renders.

### Line-height and tracking

| Token          | Value               | Use                                 |
| -------------- | ------------------- | ----------------------------------- |
| `--lh-hero`    | `0.92` (mobile `1`) | Home hero display                   |
| `--lh-tight`   | `1`                 | Inner-page `h1`                     |
| `--lh-snug`    | `1.06`              | All headings                        |
| `--lh-base`    | `1.4`               | Global default, chips, table cells  |
| `--lh-relaxed` | `1.6`               | Paragraphs, list items, blockquotes |
| `--ls-hero`    | `-0.03em`           | Home hero display                   |
| `--ls-display` | `-0.03em`           | Stat counters                       |
| `--ls-heading` | `-0.02em`           | `h1`–`h3`, section titles           |
| `--ls-body`    | `0`                 | Body copy, `h4`–`h6`                |
| `--ls-caps`    | `0.1em`             | The all-caps exception              |

**All-caps is permitted in exactly four places**, always at `--fz-caption` with `--ls-caps`: footer column titles, the locale code in the language switcher, the `MediaPlaceholder` "photo needed" label, and column labels inside a card (`In every apartment`, `Around the corner`, `Routes we drive`). Nowhere else, and never on body copy.

### Forbidden typographic patterns

Gradient text fills (`background-clip: text`). Manual `text-shadow`. Whole-paragraph italics — italic is for the rare emphasised word. Decorative underlines — underline means link. Decorative dot-marks on or beside text. And **eyebrow / kicker / preheader / dateline labels above any heading — zero tolerance.** The `h1`/`h2`/`h3` introduces itself.

---

## 3. Spacing & Sizing

Every sizing value is even and expressed with `functions.rem()` at the token layer, consumed as `var(--*)` in components.

| Token                  | Value                  | Mobile                                        | Use                                                                               |
| ---------------------- | ---------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| `--base-padding`       | `rem(16)`              | —                                             | Smallest comfortable padding                                                      |
| `--base-gap`           | `rem(16)`              | —                                             | Default flex/grid gap                                                             |
| `--small-margin`       | `rem(24)`              | `rem(16)` (`rem(20)` ≤1279)                   | Tight vertical rhythm                                                             |
| `--large-margin`       | `rem(40)`              | `rem(24)` (`rem(32)` ≤1279)                   | Block-to-block rhythm                                                             |
| `--inner-radius`       | `rem(16)`              | —                                             | Inner corners — media inside a card, chips on tiles                               |
| `--outer-radius`       | `rem(32)`              | `rem(24)`                                     | Cards, tiles, media plates, modals                                                |
| `--pill-radius`        | `rem(999)`             | —                                             | Buttons, chips, circular markers                                                  |
| `--section-py`         | `rem(120)`             | `rem(72)` (`rem(96)` ≤1279)                   | Vertical padding of every public section                                          |
| `--interactive-height` | `rem(56)`              | —                                             | Icon-only circle diameter                                                         |
| `--control-height`     | `rem(60)`              | `rem(56)`                                     | Canonical height of every default-size control — button, pill, outline, switcher  |
| `--control-height-sm`  | `rem(48)`              | —                                             | Canonical height of every `small` control — header CTA, language switcher, burger |
| `--container`          | `min(100%, rem(1600))` | —                                             | Page max-width clamp                                                              |
| `--app-header-height`  | `rem(80)`              | `rem(64)` (`rem(72)` ≤1279)                   | Fixed header height, reserved by `.app-shell__main`                               |
| `--bottom-nav-height`  | `0px`                  | `calc(rem(72) + env(safe-area-inset-bottom))` | Reserved by `.app-shell` `padding-bottom`                                         |

**Container sizes** — the shared `<AppContainer size="…">`:

| Size      | max-width   | When to use                                   |
| --------- | ----------- | --------------------------------------------- |
| `narrow`  | `rem(880)`  | `AppNotFound` only                            |
| `default` | `rem(1280)` | Not used on public pages                      |
| `wide`    | `rem(1600)` | **Mandatory for every public-page section**   |
| `full`    | none        | Edge-to-edge only — the reviews marquee track |

**Rules.** Values even — `rem(14)`, `rem(16)`, `rem(20)` yes; `rem(13)`, `rem(15)` never. Every border, outline and text-decoration-thickness ≥ `rem(2)`. Hero plates reserve space with `aspect-ratio`, never `min-height: 100dvh`. Touch targets ≥ `rem(44)` on mobile. Every public section wraps its content in `<AppContainer size="wide">` so all left and right edges sit on one vertical guide.

---

## 4. Motion

**Canonical easing: `--ease-decel` = `cubic-bezier(0.22, 1, 0.36, 1)`** for everything. `--ease-soft` = `cubic-bezier(0.33, 1, 0.68, 1)` exists for masked type only. No spring, no bounce, no scroll-jacking, no page-transition morphs.

| Token               | Value                     | Use                                                            |
| ------------------- | ------------------------- | -------------------------------------------------------------- |
| `--dur-micro`       | `200ms`                   | Hover tint, border colour, icon nudge, link colour             |
| `--dur-state`       | `240ms`                   | Card hover, chip, dropdown, accordion icon                     |
| `--dur-drawer`      | `360ms`                   | Mobile menu, off-canvas drawer                                 |
| `--dur-header`      | `400ms`                   | Header hide/show on scroll                                     |
| `--dur-reveal`      | `900ms`                   | Default scroll reveal                                          |
| `--btns-transition` | `300ms`                   | Legacy button timing token                                     |
| `--transition`      | `240ms var(--ease-decel)` | Composite shorthand; becomes `0ms linear` under reduced motion |

Hero intro timelines run staged between 400ms and 1200ms; the toast enter/leave pair is a symmetric 320ms.

**Every page ships the whole stylesheet, inline.** `vite.build.cssCodeSplit` is `false` and Nuxt's `inlineStyles` is off, so the build emits one stylesheet, and `scripts/inline-critical-css.mjs` folds it into every prerendered page as a single `<style>`. No page links or fetches CSS at runtime. This is not a micro-optimisation — with per-component CSS chunks, a section that was not on the first page (a CTA band, a card grid) had its styles arrive with the route chunk on client-side navigation, so its buttons rendered as bare markup for a frame and then snapped into shape. One inline sheet makes that impossible on first load and on every navigation after it. The cost is ~115 KB of CSS per document, which brotli takes to ~22 KB.

**Nothing is hidden after it has been painted.** A reveal that arms an element on `mounted` makes the browser show it, then hide it, then fade it back in — the flash reads as a half-drawn component, and it is worst on buttons. Two rules keep it from happening. The hero arms itself in CSS under `:root.js [data-hero="root"]` — the inline `<head>` script stamps `js` on `<html>` before the first paint, so the parts are hidden from frame one and `hero-in` releases them; a `heroReadyFallback` animation reveals everything after 3s if the JS never arrives, and no-JS visitors never get the `js` class at all. `v-reveal` measures the element in a batched `requestAnimationFrame` and **skips arming anything already inside the viewport** — content the visitor can already see stays exactly as it was painted, and only what is still below the fold gets a reveal.

**Symmetric mandate.** Every open/close element animates with identical enter and leave duration and easing, driven by Vue `<Transition>` + SCSS. GSAP is never used for "this appeared / this disappeared".

### The reveal vocabulary — reuse it, never rebuild it

Registered by `plugins/scroll-reveal.ts`; the CSS contract lives in `assets/styles/animations/__animations.scss`.

| Directive / composable          | Effect                                                                                                                        | Use on                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `v-reveal`                      | Fade + rise. Variants `.up` (default) `.down` `.left` `.right` `.scale` `.zoom` `.clip` `.clipLeft`; timing `.fast` / `.slow` | Single blocks, prose, action rows                         |
| `v-reveal.stagger`              | Reveals direct children in sequence                                                                                           | Grids, lists, chip rows                                   |
| `v-reveal.text` (`.chars`)      | Masked word reveal                                                                                                            | Section headings — already applied inside `SectionHeader` |
| `v-parallax="8..12"`            | Scrubbed vertical parallax (GSAP, lazy)                                                                                       | Media only                                                |
| `useHeroIntro(rootRef)`         | Staged hero timeline via `data-hero="title\|lead\|actions\|card\|media"`                                                      | `PageHero`, `HomeHero`                                    |
| `useStatsCounter(rootRef, sel)` | Count-up numerics                                                                                                             | `StatBand`                                                |
| `useGsap()`                     | Memoised lazy GSAP                                                                                                            | Parallax and counters only                                |

**Rules.** One heading per section gets `v-reveal.text` — and because `SectionHeader` already carries it, a section must never add another. One grid per section gets `v-reveal.stagger`. Never double-animate an element. Never `v-parallax` something already carrying a CSS transform. Reduced motion self-disables through the global `bp.reduced-motion` block — never add a per-component guard.

**Assigned motion, by element**

| Element                                      | Mechanism                                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Home hero `h1`                               | `useHeroIntro` masked words                                                                                |
| Inner-page `h1`, lead, actions, chips, media | `PageHero` `data-hero="title / lead / actions / card / media"`                                             |
| Every section `h2`                           | `v-reveal.text` inside `SectionHeader`                                                                     |
| Every card grid, checklist, step list        | `v-reveal.stagger`                                                                                         |
| Prose blocks and link rows                   | `v-reveal` (default up)                                                                                    |
| Detail media plates                          | `v-reveal.scale`                                                                                           |
| Reviews marquee                              | CSS `@keyframes` translate, paused on hover and focus, static grid under reduced motion                    |
| Card hover                                   | `border-color` + `background-color` + chip `translateX(rem(2))`. Never a `translateY` lift, never a shadow |

---

## 5. Breakpoints

Source of truth: `assets/styles/helpers/_breakpoints.scss`. **Always the mixins, never a raw `@media`.**

| Tier       | Range         | Navigation pattern                                 |
| ---------- | ------------- | -------------------------------------------------- |
| `mobile`   | `0–639px`     | `AppMobileBottomNav` — 5 slots, centre `Book` pill |
| `tablet`   | `640–1023px`  | Burger → `AppMobileMenu` drawer                    |
| `laptop`   | `1024–1279px` | Burger → `AppMobileMenu` drawer                    |
| `notebook` | `1280–1365px` | Inline horizontal nav + `BookButton`               |
| `desktop`  | `≥1366px`     | Inline horizontal nav + `BookButton`               |

Mixins: `bp.down($tier)`, `bp.up($tier)`, `bp.only($tier)`, `bp.between($from, $to)`, `bp.short` (`max-height: 500px`), `bp.reduced-motion`, `bp.touch` (`hover: none` — pointer capability, not width). Import alias is always `bp`.

```scss
@use "~/assets/styles/helpers/breakpoints" as bp;

.section {
    padding-block: var(--section-py);

    @include bp.down("laptop") {
        grid-template-columns: 1fr;
    }
    @include bp.down("mobile") {
        gap: functions.rem(24);
    }
}
```

**Zero navigation gaps at any width.** Visibility of viewport-gated chrome is decided before first paint by the `data-tier` attribute: an inline `<script>` in `nuxt.config.ts` writes `data-tier` on `<html>` using the same thresholds, and `main.scss` pairs it with `:root[data-tier="…"]` rules that outrank scoped `@media`. Keep the scoped `@media` rules as the no-JS fallback; do not layer a post-hydration `v-if` on top.

Grids step through intermediate column counts (4 → 2 → 1, or 3 → 2 → 1) — never straight from a wide desktop grid to one mobile column.

---

## 6. Component Anatomy

Every primitive is built once in `components/ui/` (or `components/layout/`) and reused. Never re-style one inline; add a variant to the component instead.

### `BaseButton` — `components/ui/BaseButton.vue`

Default padding `rem(16) rem(28)` at `rem(16)`; `size="small"` is `rem(12) rem(20)` at `rem(14)`. Radius `--pill-radius`.

**One height for every variant.** The root carries `min-height: var(--button-h)`, which resolves to `--control-height` by default and `--control-height-sm` at `size="small"`, so a filled button, an outline button and the signature pill are never a few pixels apart in a row. Padding still sets the horizontal rhythm; the faces centre their content inside the resolved height. Only two variants opt out: `ghost` (`auto` — it is a text link, not a control) and `icon` (`--interactive-height` — it is a circle sized by its glyph). Any hand-rolled control that stands beside a button — the language switcher trigger, the header burger — reads the same two tokens instead of restating a height. Border `rem(2) solid transparent` or token-coloured per variant. Focus ring `rem(2) solid var(--primary-color)` at `rem(4)` offset. Transitions `color` and `border-color` at `--dur-state` `--ease-decel`.

**Hover fill — pointer-origin ink.** No variant cross-fades `background-color`; nothing on the button transitions colour at all. The root is an `inline-grid` with one cell holding **two stacked faces**, both `grid-area: 1 / 1`, each carrying the full chrome (`padding`, `gap`, the `rem(2)` `--btn-border` hairline, the label, the chip): `.base-button__face` is the resting look, `.base-button__face--ink` is the hovered look — `--btn-ink` fill, `--btn-ink-label` label, `--btn-ink-border` hairline — and is `aria-hidden`, so the duplicated label is never announced. The inked face is revealed by `clip-path: circle(0% → 150%)` over `--btn-ink-dur` (680ms) on `--ease-decel`, centred on the pointer's real entry / exit point: `pointerenter` and `pointerleave` write `--btn-ink-x` / `--btn-ink-y` onto the element, defaulting to `50% 50%` for keyboard focus. 150% is the general cover radius — `circle()` resolves a percentage against `√(w²+h²)/√2`, so `√2 ≈ 141%` always reaches the far corner.

Because the fill, the label and the hairline all live in **one clipped layer**, the wave crosses them together: the swept half of a word already reads in the inverted colour while the rest still reads in the resting one. Nothing snaps at the end of the transition. The root carries no padding and no border, so the inked face spans the whole border box and no ring of the resting colour survives.

`ghost` inks the label only (`--btn-ink: transparent`, `--btn-ink-label: --primary-color`); `disabled` and `loading` hide the inked face outright.

**Touch.** Under `bp.touch` (`hover: none`) the wave is dropped — hover is a lie on a touchscreen and a sticky `:hover` would freeze the circle mid-sweep. The inked face falls back to `clip-path: none` plus an `opacity` fade at `--dur-state`, on `:hover`, `:focus-visible` and `:active`, so a tap reads as one smooth colour change.

**Full-width.** `fullwidth` sets `justify-content: space-between` on the root and `flex-grow: 1` + `space-between` on `__label`, so the label sits on the leading edge and the chip or trailing icon pins to the trailing edge instead of floating together in the middle of a wide bar.

| Variant         | Anatomy                                                                                                                                                                                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary`       | `--primary-color` fill, white label; hover `--light-primary-color`                                                                                                                                                                                                                                                         |
| `secondary`     | `--surface-mute` fill, `--ink` label; hover `--surface-warm`                                                                                                                                                                                                                                                               |
| `outline-light` | Transparent, `rem(2)` `--ink` border, `--ink` label; hover fills `--ink`, label `--surface-warm`                                                                                                                                                                                                                           |
| `outline-dark`  | For `--surface-ink` sections: transparent, `rem(2)` white border; hover fills white, label `--surface-ink`                                                                                                                                                                                                                 |
| `ghost`         | Text + trailing arrow, no fill, no inline padding; hover `--primary-color`                                                                                                                                                                                                                                                 |
| `icon`          | Icon-only `--interactive-height` circle, borderless: a flat `--surface-mute` disc with an `--ink` glyph; hover inks `--primary-color` over `--dur-state` with a `--white` glyph. `disabled` keeps full opacity and the same disc, dropping the glyph to `--ink-40`. Token-driven, so it inverts correctly inside `on-dark` |
| `primary-pill`  | **The signature CTA** — see below                                                                                                                                                                                                                                                                                          |

`to` is resolved through `useLocalePath()` internally, so pass raw paths with a trailing slash. `href` renders a plain `<a>`. States: `disabled`, `loading` (inline spinner, `aria-busy="true"`), `fullwidth`.

### `BaseButton --primary-pill` — sitewide signature CTA

```
[ padding-left rem(28) ][ label rem(16)/500 ][ gap rem(16) ][ chip circle rem(44) ][ padding-right rem(8) ]
```

| Property     | Value                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Radius       | `--pill-radius`                                                                                                                                |
| Background   | `--primary-color`, hover `--light-primary-color`                                                                                               |
| Label        | white, `rem(16)`, weight 500                                                                                                                   |
| Padding      | `rem(6) rem(6) rem(6) rem(28)` (mobile left `rem(20)`)                                                                                         |
| Total height | `--control-height` — `rem(60)` desktop, `rem(56)` mobile                                                                                       |
| Chip         | white circle `rem(44)` (mobile `rem(40)`, `size="small"` `rem(36)`) with a `--primary-color` `SvgArrowRight`; overridable via the `#icon` slot |
| Chip motion  | `translateX(rem(2))` on hover, 240ms `--ease-decel`, skipped under reduced motion                                                              |

**Discipline:** `primary-pill` is the **booking** CTA only — header, hero, card footers, contacts band, closing band, mobile bottom nav. Secondary navigation uses `outline-light`, `outline-dark` or `ghost`. Never combine it with `rounded` (it is already round).

### `BookButton` — `components/ui/BookButton.vue`

The one file that owns the WhatsApp contract. Wraps `BaseButton` (`primary-pill` by default), resolves `href` from `useBookingLink(contextKind, itemTitle)`, and always sets `target="_blank"`, `rel="noopener noreferrer"` and an `aria-label` that names the item. Every booking CTA on the site renders this — no component ever builds a `wa.me` URL itself.

### `PageHero` — `components/ui/PageHero.vue`

The one hero for all five inner pages, in two modes. Anatomy top→bottom in both: `AppBreadcrumbs` → `h1` at `--fz-page-title` / `--lh-tight` / `--ls-heading` → lead at `--fz-lead` / `--lh-relaxed` / `--ink-80`, max-width `rem(680)` → `#actions` slot → fact panel. The panel takes `chips` as `CardFact[]` (`{ label, icon }`) and renders one `--surface` plate at `--outer-radius` with a `rem(2)` `--border-color` hairline and `rem(8)` inner padding, split into equal cells by the same hairline — icon at `--icon-size-lg` in `--primary-color`, label at `--fz-body-sm` weight 500. Cells step 4 → 2 (≤1279) → 1 (≤639). Root ref drives `useHeroIntro`, so the parts carry `data-hero` and the media is **never** opacity-hidden — it stays LCP-eligible.

**Text mode (default).** `--surface-warm`, `padding-block: rem(48) var(--section-py)` (mobile `rem(32)`). It carries no image and is not supposed to: from `1280px` up the copy becomes an editorial split — breadcrumbs across the top, the `h1` in the left column (`1.05fr`), the lead and the actions stacked in the right (`0.95fr`) — so the full container width reads as composed rather than half-empty. Below `1280px` it stacks in one `rem(880)` column. Used by apartments, about and contact.

**Photo mode.** Passing `photo` (`{ desktop, mobile, alt, width, height }`) turns it into the full-screen twin of the home hero: `HeroMedia` behind, `on-dark`, `margin-top: calc(-1 * var(--app-header-height))` so it runs under the header, an `inset: 0` `rgba(36, 30, 28, 0.56)` overlay, and `min-height: 100dvh` on the inner with the copy vertically centred. The copy stays a single `rem(880)` column — the split is a light-mode device only. The fact panel inverts through the `on-dark` token remap; its icons go `--ink` (white) rather than the remapped rose accent, matching the home hero. The page must set `definePageMeta({ darkHeader: true })` and its actions must use `outline-dark`, not `outline-light`. Used by tours and transfer.

### `HeroMedia` — `components/ui/HeroMedia.vue`

The one full-bleed hero background. Absolutely positioned `inset: 0` at `z-index: 0`, `object-fit: cover`. Renders a `<picture>` with a `(max-width: 639px)` WebP source off `mobileSrc`, a WebP source off `desktopSrc`, and a JPEG `<img>` fallback — all through `useImage()` at quality 70, desktop widths `640/960/1280/1672`, mobile widths `360/480/640/941`. The art-direction contract is **16:9 desktop, 9:16 mobile**; `width` and `height` are the desktop file's real pixels and are required. `fetchpriority="high"` and `decoding="async"` are baked in because this element is always the page's LCP. `HomeHero` and `PageHero` photo mode both render it — nothing else builds a `<picture>` by hand.

### `OfferCard` — `components/ui/OfferCard.vue`

The one card used by apartments, tours and transfers. `MediaPlaceholder` (16:10, `--inner-radius`) → `h3` at `--fz-subsection-title` → description at `--fz-body-sm` / `--ink-60` → `FactChip` row → default slot → footer with `"Price on request"` left and `BookButton size="small"` right, separated by a `rem(2)` top hairline. Padding `rem(24)` (mobile `rem(16)`), radius `--outer-radius`, border `rem(2) solid var(--border-color)`. `tone="light"` sits on `--surface`; `tone="dark"` sits on `rgba(255,255,255,0.04)` and switches the button to `outline-dark`. `facts` accepts plain strings or `CardFact` objects (`{ label, icon }`) which render the chip icon. Hover moves the border to `--light-primary-color` and the title to `--primary-color`, and lifts a dark card to `--on-dark-surface-hover` — no translate, no shadow.

### `BaseCarousel` — `components/ui/BaseCarousel.vue`

The one horizontal slider. Takes `items` and exposes each through the default slot as `{ item, index }`, so slides stay whatever component the section needs. Visible slides step 3 → 2 (≤1279) → 1 (≤639); never a fractional count.

**Two modes, two control placements.** In the default multi-slide mode the controls are two `BaseButton variant="icon"` circles pinned right **below** the track, disabled at each end. The `single` prop — the gallery variant, used by `MediaGallery` — pins one slide at every width and moves the same two circles **on top of the frame**, vertically centred against the left and right edges at `rem(16)` inset (`rem(8)` on mobile). The control row becomes `position: absolute; inset: 0` with `pointer-events: none`, only the buttons taking pointer events, so the image underneath stays clickable for the lightbox. Labels come from `common.carousel-prev` / `common.carousel-next`.

**Over a photo the controls must ignore the section they sit in.** `variant="icon"` is a `--surface-mute` disc with an `--ink` glyph, and inside an `on-dark` section that remaps to `rgba(255,255,255,0.08)` — a disc that disappears completely once it is floating over photography rather than over the dark plate it was designed for. The overlay control row therefore re-establishes the light token set with `@include mixins.on-light` and then pushes the disc one step further to `--surface-mute: var(--white)`, because a solid white circle is the only fill that separates from arbitrary photography. This is a token remap at a boundary — the same device `on-dark` itself uses — not an instance override, so the button keeps its own hover (inks to `--primary-color` with a white glyph) and its own disabled state.

**Drag differs by mode, deliberately.** Multi-slide mode is a "grab and pull" track: pointer handlers plus `setPointerCapture` move the track live with edge resistance, and release settles to the nearest slide or flicks one along. Single mode does **not** move with the pointer — a photo that slides half-way and springs back reads as jitter, not as control. It only measures the gesture and, past `rem(40)` of travel, advances one slide with the same `--carousel-speed` transition the arrows use, so a swipe and an arrow press look identical. A drag beyond `rem(6)` swallows the following click in both modes, so pulling the track never opens the lightbox. Under reduced motion every transition resolves to an instant jump.

### `MediaGallery` — `components/ui/MediaGallery.vue`

The one photo gallery, used by both apartments and tours. Wraps `BaseCarousel single` (one 16:9 slide per view, arrows below the frame) and makes every slide an `<a href>` to the original file, so the lightbox is **Fancybox** (`@fancyapps/ui`), never a hand-rolled modal, and a no-JS visitor still reaches the photo.

**The JS never loads until the visitor reaches for it.** There is no `bind()` on mount: `pointerenter` / `focusin` warm the chunk through `useFancybox()` (the same memoised lazy pattern as `useGsap()`), and a slide's `@click.prevent` awaits it and calls `Fancybox.show(photos, { startIndex })`. Passing the slide array directly is what scopes the set — one gallery, its own photos, no `data-fancybox` group attribute and no teardown to forget. That keeps ~115 KB (~35 KB brotli) of lightbox JS off the initial load of every page that carries a gallery. Its **CSS stays a static import** so it lands in the single site stylesheet and the lightbox never renders unstyled.

Every label goes through the `l10n` option — Fancybox ships no Russian locale: `common.close`, `common.carousel-next`, `common.carousel-prev`, `common.gallery-modal`, `common.gallery-thumbs`, `common.gallery-error`. The toolbar is trimmed to `counter` left, `thumbs` + `close` right; the default slideshow, fullscreen and zoom-level buttons are dropped as clutter (pinch, wheel and double-click still zoom). `zoomEffect` is off and enter/leave are the symmetric `f-fadeIn` / `f-fadeOut` pair, per the symmetric mandate in § 4.

Thumbnails run `Thumbs: { type: "classic" }` — a plain synced strip of equal `rem(96) × rem(54)` frames at a `rem(12)` gap. Fancybox's default `"modern"` (Apple-Photos style) derives its whole layout from `--f-thumb-clip-width` and a `--width-diff` against `--f-thumb-width`, so re-sizing the thumbs to brand values left the clip maths inconsistent and the frames overlapped each other. Classic has no clip maths. `--f-thumb-clip-width` is pinned equal to `--f-thumb-width` anyway so the modern layout could never fold them again, and `--f-thumb-bg` is overridden to a solid `--on-dark-surface` because the vendor default is a `linear-gradient`.

Slides render through `OptimizedMedia` at `fetch-priority="low"` so a gallery never competes with the hero LCP fetch, and each call site passes the `sizes` string for its own layout (`ApartmentsList` 2-up, `OfferCard` in the home grid, `OfferCard` in the tours carousel) rather than inheriting one wrong default. The anchor carries `cursor: zoom-in`, and a drag on the carousel swallows the click so pulling the track never opens the lightbox.

**The page must not move when the lightbox opens or closes.** Fancybox's own scroll lock removes the scrollbar and compensates with `body { margin-right }` — which does nothing for `position: fixed` chrome, so the header and the bottom nav jumped by half a scrollbar width on every open and close. `hideScrollbar: false` switches it off and `assets/styles/components/_fancybox.scss` locks the page instead:

```scss
:root.with-fancybox {
    overflow: hidden;
    scrollbar-gutter: stable;
    scroll-behavior: auto;
}
```

`overflow: hidden` still makes the root a scroll container, so `scrollbar-gutter: stable` keeps the gutter reserved, the ICB width never changes, and nothing — flow content or fixed element — shifts in either direction. `:root.with-fancybox` (0,2,0) outranks the vendor's `html.with-fancybox` (0,1,1) whatever the bundle order, the same specificity device `:root.js` and `:root[data-tier]` use in § 5.

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

### `TransferRoutesTable` — `features/transfer/components/TransferRoutesTable.vue`

**The one routes table**, rendered identically by the home transfer section and the transfer page — never re-implemented as a list. A `--surface` plate at `--inner-radius` — `--outer-radius` reads as a bulbous corner on a plate this tall, and the row hover fill pushed past the curve — with `overflow: hidden` so hovered rows clip to it, a `rem(2)` `--border-color` hairline and `rem(8)` padding, holding an optional `title` `h3` (which also labels the table), the table itself, and an optional `#actions` footer separated by a top hairline. Columns are route / journey time / price, the header row all-caps at `--fz-caption` over a `rem(2)` `--border-color` rule — the same neutral hairline every row uses, never `--ink`, which read as a hard black bar across the plate; each row opens with a `rem(44)` `--surface-mute` medallion carrying the route `IconName`, then `from` → `to` around a `--primary-color` arrow. Hover tints the row `--surface-warm`, turns the medallion `--surface` and nudges the arrow `rem(2)`. At ≤1023px the table becomes stacked cards: medallion beside a vertical `from` ↓ `to` stack, with journey time and price on one line below, price pinned right.

### `BaseAccordion` — `components/ui/BaseAccordion.vue`

Row separated by a `rem(2)` `--ink-20` top rule. Trigger is a full-width button, `rem(28) 0` padding, `rem(20)` label (mobile `rem(16)`), `aria-expanded` + `aria-controls`. The icon is a `rem(44)` circle with two `rem(16)×rem(2)` bars; open state fills it `--primary-color` with white bars and rotates the vertical bar to horizontal. The panel animates `grid-template-rows: 0fr → 1fr` over 420ms `--ease-decel` with a paired opacity fade — symmetric on close.

### `BaseDropdown` / `AppMobileMenu`

The site has **no modal**. `BaseModal` was built and never rendered by anything, so it was deleted along with `BaseSkeleton` and `BaseEmptyState` — the lightbox is Fancybox's own `<dialog>`, the mobile menu is a drawer, and nothing else asks for a centred panel. If a real modal need appears, build it then; do not restore a speculative primitive.

`BaseDropdown` — the only floating primitive. Auto-flips on both axes against real viewport bounds; consumers do not pass `placement` or `align`. Panel `--surface`, `rem(2) solid var(--border-color)`, `rem(12)` radius, `var(--z-dropdown)`, 240ms scale + opacity, CSS only. Closes on click-outside, Escape and route change.

`AppMobileMenu` — right-hand drawer, panel `min(100%, rem(400)) × 100dvh` on `--surface`, backdrop `rgba(36, 30, 28, 0.5)`, scroll lock, focus trap, symmetric `--dur-drawer` slide, auto-closes when the viewport leaves the 640–1279px burger range.

### `AppMobileBottomNav` — `components/layout/`

Fixed bottom bar, mobile only, height `--bottom-nav-height` = `calc(rem(72) + env(safe-area-inset-bottom))`. Five slots: `Home · Apartments · Book · Tours · More`. The centre slot is an `<a>` to the WhatsApp link rendered as a `rem(56)` `--primary-color` circle with a white `SvgWhatsApp`, raised `rem(-12)` and ringed with `rem(4)` of `--surface` so it reads as lifted without a shadow. `aria-label` required.

### `AppBreadcrumbs` — `components/layout/`

Semantic `<nav> → <ol> → <li>`, last item a `<span aria-current="page">`, separators as decorative `::before` `/` glyphs at `--ink-40`. `rem(14)`, weight 500. Themed through `--crumb-color`, `--crumb-color-hover`, `--crumb-current`, `--crumb-sep`; `on-dark` prop swaps them to the white scale. Links go through `useLocalePath()`.

---

## 7. Iconography

Icons are Vue SFCs in `components/svg/` with a hardcoded `viewBox="0 0 24 24"`, `stroke="currentColor"` (or `fill="currentColor"`), and an inline style object driving `width`, `height` **and `minWidth`** from `--icon-size`. Colour follows text; size follows the parent. Never set width or height on an SVG from SCSS — set `--icon-size` on the parent instead. No emoji, ever.

**`SvgLogo` is the one exception** — it is the brand mark, not an icon. It keeps its native `viewBox="0 0 1358 1159"` (the mark is not square, so a 24×24 box would distort it), and its inline style drives `height` from **`--logo-size`** with `width: auto`. It is `fill="currentColor"` like everything else, so it inherits whatever colour its parent sets and needs no per-page variant: in `AppHeader` it sits inside `.app-header__brand`, which resolves `--ink` — near-black on a light header, white through the `--over-hero` remap on a photo hero. `--logo-size` is `rem(34)` in the header, `rem(26)` on mobile. To recolour it anywhere, set `color` on the wrapper; never touch the SVG.

| Token             | Value          | Use                                                              |
| ----------------- | -------------- | ---------------------------------------------------------------- |
| `--icon-size-xs`  | `rem(12)`      | Inline beside captions                                           |
| `--icon-size-sm`  | `rem(16)`      | List markers, ghost-button arrows, chip icons, breadcrumb glyphs |
| `--icon-size-md`  | `rem(20)`      | Default — drawer links, form labels                              |
| `--icon-size-lg`  | `rem(24)`      | Header burger, feature medallions                                |
| `--icon-size-xl`  | `rem(32)`      | Large CTAs                                                       |
| `--icon-size-2xl` | `rem(48)`      | Hero / feature icons                                             |
| `--icon-size`     | alias of `-md` | Fallback                                                         |

Shipped set — every one of these is rendered somewhere; icons that stopped being used were deleted rather than kept "in case": `SvgArrowRight`, `SvgArrowUpRight`, `SvgBath`, `SvgBed`, `SvgBuilding`, `SvgBurger`, `SvgCalendar`, `SvgCar`, `SvgCheck`, `SvgChevronDown`, `SvgClock`, `SvgClose`, `SvgDocument`, `SvgHeart`, `SvgKey`, `SvgLogo`, `SvgMountain`, `SvgPin`, `SvgPlane`, `SvgQuote`, `SvgRuler`, `SvgTelegram`, `SvgTrain`, `SvgUsers`, `SvgWhatsApp`, `SvgWifi`, plus `nav/SvgNav{Home,Apartments,Tours}`. The `IconName` union in `types/models.ts` and the `v-if` chain in `SvgIcon.vue` must stay in lockstep with this list.

---

## 8. Photography & Imagery

**Direction: warm editorial documentary.** Real rooms and real ridgelines in natural light, warm white balance (slightly amber, never cool blue), faint film grain, no people in frame, generous negative space, one clear subject per shot. Interiors read lived-in rather than staged: cream plaster, pale oak, terracotta leather, muted rose textiles. Landscapes name the actual place — the Amirsoy gondola line, the Chimgan ridge, the blue dome of Chorsu, the Tashkent City towers at golden hour.

**We do not shoot:** stock corporate imagery, sterile studio flat-lays, neon-graded cityscapes, HDR-crushed skies, low-key dramatic chiaroscuro, gratuitous drone footage, models posing as guests, or abstract gradient blobs as decoration.

**Current state.** Both apartments have real photography — `/images/apartment1/` is the **Amir Temur avenue** flat and `/images/apartment2/` is the **Buyuk Turon** flat (the folder numbering is the owner's, not the page order; the location map at the end of each set is what identifies them). Files are `image1…imageN.webp` at 1672×941, shown in that order by `MediaGallery` on both the home apartments cards and the apartments page.

All seven tours have real photography too, same convention — `image1…imageN.webp` at 1672×941 under `/images/tours/<folder>/`, two per tour except Besh Qozon which has three. The folder names are the owner's and do not match the tour ids, so `useTours()` carries the map: `amirsoy → amirsoy`, `chimgan → greaterchimgan`, `charvak → charvak`, `chinorkent → chinorkent`, `tashkent-metro → metro`, `besh-qozon → beshqozon`, `magic-city → magiccity`. Each photo has its own descriptive alt string at `tours.items.<id>.photos.{one,two,three}`, naming the actual place; the older `tours.items.<id>.photo` generation brief stays as `OfferCard`'s `photoBrief` fallback. Those photos also feed the `TouristTrip` JSON-LD `image` array on the tours page. Three heroes have real photography — home (`/images/`), tours (`/images/excursions/`) and transfer (`/images/airport/`), each shipped as a 1672×941 desktop file plus a 941×1672 mobile file and rendered through `HeroMedia`. Their locale `hero.photo` string is now the **alt text**, short and descriptive, not a generation prompt. The transfer "included in every transfer" section is a car showcase: copy and checklist left, the Kia Sportage cutout (`/images/car/car.webp`, alpha preserved through `ipx`) right, sitting straight on the section with no plate behind it. That is why the section is `--surface` and not `on-dark` — the car is black, and it needs a light ground to read. The routes section above it moved to `--surface-warm` in exchange, so the page still alternates warm → white all the way down. Every remaining image slot still renders `MediaPlaceholder` carrying its shot brief as the accessible label; those briefs double as generation prompts. When the rest of the photos arrive, swapping `MediaPlaceholder` for `OptimizedMedia` is a one-component change.

**When photos land**, every `<img>` goes through `components/ui/OptimizedMedia.vue` (`<NuxtImg>`): AVIF + WebP build-time variants, explicit `width` and `height` (CLS prevention is mandatory), `loading="eager"` + `fetchpriority="high"` for the above-fold LCP image and lazy for everything below, meaningful `alt` always.

**Art-direction crops**

| Breakpoint   | Crop                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `≤639px`     | Portrait or square — 4:5 or 1:1                                         |
| `640–1023px` | 16:10                                                                   |
| `≥1024px`    | 16:10 for cards, 4:3 for inner-page heroes, 4:5 for the home hero plate |

Mobile assets never load on desktop and vice versa — `<source media="…">` segregation is strict.

---

## 9. Z-Index Scale

Defined in `assets/styles/base/_zIndexes.scss`. Never write a raw `z-index: 999`.

| Token            | Value | Use                                       |
| ---------------- | ----- | ----------------------------------------- |
| `--z-background` | `-1`  | Background decoration                     |
| `--z-base`       | `0`   | Default content                           |
| `--z-base-upper` | `1`   | Slightly raised content, sticky sub-navs  |
| `--z-content`    | `2`   | Main UI elements                          |
| `--z-layout`     | `3`   | Sticky header, sticky bottom nav          |
| `--z-dropdown`   | `4`   | Open dropdowns and popovers               |
| `--z-app-nav`    | `5`   | App navigation surfaces                   |
| `--z-overlay`    | `5`   | Backdrops                                 |
| `--z-modal`      | `6`   | Modals, drawers, route loader             |
| `--z-popover`    | `7`   | Tooltips above modals                     |
| `--z-tooltip`    | `8`   | Standard tooltips                         |
| `--z-toast`      | `9`   | Toast notifications                       |
| `--z-top`        | `10`  | Debug overlays only — never production UI |

Any section that sets a raw `z-index` on a positioned child **must** carry `isolation: isolate` on its root, or those values compete with the header at the page root.

---

## 10. Forbidden Patterns (Visual)

- **Gradients — zero tolerance.** No `linear-gradient`, `radial-gradient`, `conic-gradient`, two-stop card fill or gradient `background-image` anywhere. Every surface is one solid token.
- **`box-shadow` for decoration — zero tolerance.** No elevated cards, no glow on CTAs, no hover shadow. Depth is a `rem(2)` alpha hairline plus tonal contrast. The only permitted `box-shadow` is the functional `:-webkit-autofill` reset.
- **`backdrop-filter` / `filter: blur()`** — glassmorphism and frosted navigation bars. **One sanctioned exception, owner-approved 2026-08-22: the Fancybox lightbox chrome** (`.fancybox-brand` in `assets/styles/components/_fancybox.scss`). It is a vendor overlay in the browser's top layer above a dimmed backdrop, not a page surface, and the blur is what makes it read as current rather than 2015. It stays scoped to that one class — backdrop, buttons, arrows and counter. No page surface, header, card, drawer or modal ever gets it.
- **Eyebrows, kickers, preheaders, datelines** above any heading, and **pill / badge labels** ("NEW", "PRO"). Functional list labels — footer column titles, card column labels, the locale code — are not eyebrows and stay.
- **Decorative dot-marks** on or beside text: no brand-mark period after a heading, no coloured dot inside a letter counter, no accent dot glued to a keyword.
- **A fifth hue.** Monotony is solved with spacing and type contrast, never with a new colour.
- **`--light-primary-color` as body-text colour on a light surface** — it fails AA at 3.4:1.
- **Dark-mode toggle**, `prefers-color-scheme` branches, `[data-theme="dark"]`.
- **Atomic CSS** (Tailwind, UnoCSS, ad-hoc utility classes) and inline `style` props — the sole exception is `--icon-size` on an `<svg>`.
- **Raw `@media`** outside `_breakpoints.scss`, raw `px`, odd sizing values, borders under `rem(2)`.
- Auto-playing hero video, particle effects, confetti, animated emoji, skewed decorative shapes, page-transition morphs, bouncing spring easing.

**What we DO use:** `rem(2)` hairline borders; background-tint hover; alpha transparency for depth; one confident decel easing for every state change; a single deep-red accent on a calm cream field; generous negative space; large headings against restrained body copy; scroll reveals that always serve content; and real, warm photography once it exists.
