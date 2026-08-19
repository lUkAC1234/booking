# Frontend Design Philosophy — Meta-Prompt Template

You are writing `frontend.md` — the **design philosophy** (the WHY behind every visual decision) — for a NEW project. Answer each section's prompts FOR THIS BRAND. Keep it short and opinionated; restraint is a feature. The concrete tokens (colours, dimensions, motion curves) live in [DESIGN.md](DESIGN.md); the engineering rules and code patterns live in [requirements_ai.md](requirements_ai.md). Here you only justify the intent.

How to use this template:
- Work through sections 1–10 in order. Each section gives you PROMPTS to answer and a `>>> EXAMPLE (reference brand)` illustration showing the depth and tone expected. The examples are a de-branded reference, not a spec to copy — replace them with this brand's answers.
- Bold defaults marked **(recommended default)** are genuinely universal — keep them unless the brand has a deliberate reason to deviate, and if you deviate, say why.
- The output is short on purpose. If a restrained brand needs three sentences where the example uses five, write three.
- Do not invent concrete token values here — defer those to DESIGN.md and reference them by name.

---

## 1. Voice & Position

Prompts to answer:
- Who is the brand and what does it do, in one sentence? Who is the target visitor (role, mindset, what they're tired of seeing)?
- Define the brand voice in **3–4 adjectives** and say what each one rules out.
- What is the default locale / language posture? Which locales reach full parity?
- List **4–6 things this brand is explicitly NOT** (the aesthetics you are rejecting). This negative list is as important as the positive one.

>>> EXAMPLE (reference brand)
> A web studio competing for the enterprise client. The target visitor is a decision-maker (founder, marketing director, ops lead) who has seen too many noisy agency websites and is looking for **calm competence**. Voice: *Editorial* (a thoughtful magazine layout, not a flashy SaaS landing), *Confident but not loud* (present results, don't shout features), *Minimal but warm* (light theme on a soft accent, not sterile white). It is NOT: a Web3 / crypto aesthetic; a consumer-app vibrant-gradient palette; a brutalist / experimental layout; a maximalist marketing site with parallax-on-everything; a dark-mode-by-default developer-tool design.

---

## 2. Composition Principles

Prompts to answer. For each, state the rule and the one-line reason it earns its place:
- **Hero layout.** What is the page hero's recognizable rhythm (centered stack? split? something else)? When, if ever, is the alternative allowed?
- **Section rhythm.** How do sections flow below the hero (card rhythm, alternating blocks, etc.) and what governs the spacing between them?
- **Negative space.** Commit to a target — **generous negative space is a recommended default** (the page should breathe). State the rule: when a section feels tight, *remove* an element, never add one to "balance".
- **Type-driven hierarchy.** What carries the eye — a big H1 against restrained body? State that heading hierarchy is strictly typographic, never decorative (no gradient fills, no underlines, no badge eyebrows).
- **Symmetry vs. asymmetry.** Is the page centered overall but asymmetric within sections? Define the allowed rhythm.
- **Colour choreography by section.** Does the page alternate surface tones down the scroll to renew attention? If so, define the sequence and the "never two X in a row" rules. State which token may NEVER be a section background (typically the single accent).
- **Dark-surface text handling.** Specify the mechanism that inverts text tokens on dark backgrounds (a single mixin / utility applied where the dark background is set) rather than per-element white overrides — this is a correctness rule, not a cosmetic one, because heading colour resolves from a custom property that cascades by DOM proximity, not specificity.
- **Hero brand element.** Is the brand name / wordmark a hero-scale graphic rather than a corner logo? Where does it appear, and what is its discipline (stands alone, no eyebrow/kicker, fade-up only)? Prefer live text over an image so it ships at zero network cost, stays crisp at any zoom, and remains crawlable.
- **Shared horizontal edges.** Mandate that every public-page section wraps content in the same max-width container so all left/right edges align to one vertical guide. Name the exceptions (full-bleed marquees, watermark elements needing `overflow: hidden`).

>>> EXAMPLE (reference brand)
> Every page hero is **centered** — H1, lead, primary CTA stacked on the vertical axis; no left-text/right-image split unless the image is genuinely informational. Below the hero, sections flow as horizontal cards in a step rhythm with calm spacing between them. ~30–40% negative space above the fold. The overall page is centered, but within sections asymmetric balance is allowed (a card with image one side, quote the other, alternating direction down a list). A long page alternates surface tones in a deliberate sequence (warm → tonal accent → dark contrast → soft accent → warm → dark CTA → dark footer) so the eye is renewed at each scroll; never two dark sections in a row except CTA → Footer (which read as one statement), never two tonal accents in a row. The accent colour is **never** a full-section background — only CTA fill, focus ring, inline accent. Dark blocks invert text via a single `on-dark` mixin applied where the background is set, never per-element white. The brand wordmark is a full hero-scale text element (not a 32px corner logo) in the home hero, the about hero, and the footer; it stands alone with no eyebrow above or below and never animates beyond a fade-up. Every section wraps in one wide container (e.g. 1600px) so all edges share a single guide.

---

## 3. Color Philosophy

Prompts to answer:
- How many colours does the palette commit to? Name the role of each (accent, calm surface, ink/text) and reference the token names from DESIGN.md rather than restating hex values.
- State the discipline: do you refuse a third accent? **(Recommended default: yes.)** If a section feels monotonous, the fix is contrast in spacing and typography, not a new colour.
- Where is the single accent allowed, and where is it forbidden (e.g. never as a large fill)?

>>> EXAMPLE (reference brand)
> The palette is **two colours plus ink**: a single accent used sparingly (CTAs, focus rings, active state — never a large surface fill), one calm accent surface (hero plates, the warm alternative to pure white), and ink (text and dark-contrast sections), plus white, near-white, and alpha-scaled ink for secondary text. A third accent is **never** introduced; monotony is solved with spacing and type contrast. That discipline is what makes the site feel intentional.

---

## 4. Typography Philosophy

Prompts to answer:
- How many typefaces? **(Recommended default: one.)** Name it (defer the file/weights to DESIGN.md) and justify the choice in terms this brand cares about — tone, multi-script coverage for your locales, variable-font payload, readability.
- Do you pair a display font for headlines? State the position and the reason. Pairing is a maximalist move; restraint favours one family executed precisely.
- Italic and underline policy: italic reserved for the rare emphasized word (no whole-paragraph italics); **underline means "link" only** — never decoration.

>>> EXAMPLE (reference brand)
> One contemporary humanist sans, no display-font pairing. Chosen for a soft editorial cut that reads friendly and confident without feeling cold; it ships as a variable font (one file per subset covers Regular / Medium / Bold) and carries Latin and Cyrillic on the same metric, which matters for multi-locale parity. The H1 is just that font in Bold. Italic is reserved for the rare emphasized word; underline means "link".

---

## 5. Photography / Imagery Direction

Prompts to answer:
- What is the visual treatment of imagery (warm/cool, real/studio, grain, posture of people)? Be specific enough that a photographer or a stock-search could follow it.
- List **what you do NOT shoot** — the clichés to avoid.
- What imagery does each content type get (case studies, testimonials, etc.)?
- If the brand uses illustration or abstract graphics instead of photography, define that language here and skip the photo specifics.

>>> EXAMPLE (reference brand)
> Lifestyle, warm-toned: real environments (an office desk, a hand on a coffee cup, afternoon window light), warm white balance (slightly amber, never cool blue), modest film-like grain, people in natural posture. We do NOT shoot studio product flat-lays, stock corporate handshakes, neon-graded cityscapes, gratuitous drone shots, or abstract gradient blobs as decoration. Case studies get screen mockups (the work itself) plus one or two environment shots; testimonials get warm, casual face portraits, not LinkedIn-headshot polish.

---

## 6. What Replaces "Decoration"

Prompts to answer:
- Maximalist sites carry visual interest with drop shadows, gradients, illustration, and parallax. If this brand rejects those, what carries the interest instead? Name the actual sources (spacing rhythm, type hierarchy, colour discipline, imagery, subtle motion).
- Finish with the one-line feeling the finished page should evoke.

>>> EXAMPLE (reference brand)
> No drop shadows, gradients, decorative illustration, or parallax-on-everything. Interest comes from **spacing rhythm** (generous, mathematically deliberate), **typography hierarchy** (big H1 against restrained body creates the contrast a gradient would in a noisy site), **colour discipline** (a single accent on a calm surface reads as intent), **photography** (real, warm, human imagery is the texture), and **subtle motion** (hover-tints and scroll-driven reveals that always serve content). The page should feel like a well-set magazine spread — open, calm, intentional; the eye knows where to go without being told.

---

## 7. Motion Philosophy

Prompts to answer:
- State the motion *level* for this brand (restrained? expressive? maximally expressive?) and what it serves. Motion is **content-serving, never decorative noise (recommended default)**.
- Specify state-change timing (a tight band, e.g. 220–360ms) and the entrance language (scroll reveals, hero timeline, staggers, masked type).
- Keep these hard constraints as **recommended defaults**: transform / opacity / clip-path only; **one signature easing curve, decel-out, no spring/bounce**; no scroll-jacking; parallax reserved for media, never parallax-on-everything; no page-transition morphs.
- **Reduced motion is honoured automatically** — every reveal/parallax self-disables under `prefers-reduced-motion: reduce` and resolves to its final static state. Non-negotiable.
- State the performance budget (lazy-loaded animation lib, engine-managed `will-change`, Lighthouse / LCP targets preserved).
- Name the project's signature easing curve. The reference default is `cubic-bezier(0.22, 1, 0.36, 1)` (decel-out) — confident, not bouncy.

>>> EXAMPLE (reference brand)
> Motion is content-serving and **expressive** — entrances are clearly visible and confident (larger travel, pronounced staggers, masked type, directional and clip-wipe reveals, count-up numbers, gentle parallax on hero media). Expressive raises *amplitude and variety*, NOT the rulebook: transform/opacity/clip-path only, the signature `cubic-bezier(0.22, 1, 0.36, 1)` easing, no spring/bounce, no scroll-jacking, no parallax-on-everything. State changes run 220–360ms. Scroll reveal is the default page texture (CSS + IntersectionObserver); the hero is a short staged timeline where the H1 reveals word-by-word, then lead, then actions — and the hero media is never opacity-hidden, so it stays the LCP element. Parallax is reserved for media only. Reduced-motion is honoured automatically; the performance budget is sacred (animation lib lazy-loaded, Lighthouse 100 / sub-2s LCP preserved).

---

## 8. Accessibility Is Design

Accessibility is **non-negotiable** — a design constraint, not an afterthought. Keep the following as **recommended defaults** and confirm them for this brand (adjust the accent colour reference and touch-target unit to this project's tokens):

- Heading order strictly H1 → H2 → H3, no skipping.
- Colour contrast: minimum 4.5:1 for body text, 3:1 for large text — verified on every section.
- Touch targets: minimum ~44px on mobile.
- Focus states: visible, using the brand accent. Never `outline: none` without a replacement.
- Alt text: meaningful, never "image".
- Aria-labels on icon-only buttons (burger, close, language switcher).
- Reduced motion respected.
- Keyboard navigation works on every interactive element — Escape closes dropdowns/modals, Tab moves logically.

Prompt to answer: is there anything brand-specific to add (e.g. a high-contrast requirement on a particular surface)? A site that fails accessibility fails the brand's promise of competence.

---

## 9. Specific Patterns We DON'T Use

List the design clichés that are off-limits for this brand without an explicit override. The reference set below holds for most restrained brands — keep what applies, add brand-specific bans, and remove any that genuinely conflict with this brand's intent:

- **Eyebrows / kickers / datelines above headings** — the H1/H2 introduces itself. (Functional list labels like footer column titles are not eyebrows and are allowed.)
- **Pill / badge labels** above sections ("NEW", "PRO", "BETA"). If it matters, put it in the H1 or body.
- **Gradient text fills.** Solid colour only. **(Recommended default.)**
- **Drop-shadow depth.** Use alpha transparency for depth, not blur.
- **Glassmorphism / `backdrop-filter: blur()`.**
- **Dark mode toggle.** Dark sections are local design choices, not a theme (state your brand's stance).
- **Page / view transition morphs.** Standard router transitions are fine; "fly-over" / "morph" transitions create perceived latency.
- **Bouncing animations** (spring physics, `ease: back.out`). The easing stays confident, not playful. **(Recommended default.)**
- **Confetti / particle effects.**
- **Auto-playing video as hero.** A still image with an optional fade is enough.

Prompt to answer: which of these does this brand additionally enforce or relax, and why?

---

## 10. The Test

Before publishing any new section / page, ask. Adapt the first and last questions to this brand's voice; the middle three are **recommended universal checks**:

1. **Does this look at home in the medium the brand aspires to?** (e.g. a quality print magazine.) If it instead looks like the aesthetic you rejected in Section 1 → wrong project.
2. **Could I remove one element and the section still works?** If yes → remove it.
3. **Is there a single moment of "interest" the eye lands on?** If everything competes for attention → simplify.
4. **Does it work at 360px and 1920px with the same intentionality?** If only one breakpoint feels designed → fix the other.
5. **Would a peer at a competing brand recognize the restraint?** That's the bar.

Design is what's left when nothing more can be removed.
