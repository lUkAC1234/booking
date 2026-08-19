# <PROJECT_NAME> — Project Documentation

This document is the architecture reference for this full-stack template. It describes **what each part of the stack does** and is filled in per project. Companion documents:

- [requirements/DESIGN.md](DESIGN.md) — design tokens, motion curves, breakpoints, component anatomies.
- [requirements/frontend.md](frontend.md) — design philosophy (the *why* behind visual decisions).
- [requirements/requirements_ai.md](requirements_ai.md) — frontend engineering rules (Nuxt 3).
- [requirements/requirements_backend.md](requirements_backend.md) — backend engineering rules (Django + Ninja).

---

## Project Overview

**<PROJECT_NAME>** (`<DOMAIN>`) is a <PURPOSE — one sentence describing what the site is for>. The frontend is a **Nuxt 3** statically-generated site (Nitro static output) with islands of interactivity; the backend is an async, Redis-cached Django Ninja API administered through the Django admin. Read-side content is shipped to the frontend at build time as per-locale static JSON, so the prerendered site has no runtime dependency on the backend. Target locales: **<LOCALES — default `ru`, plus `en`, `uz`>**.

---

## Tech Stack

### Frontend (`frontend/`)

| Library | Purpose |
|---|---|
| Nuxt 3 | Full-stack Vue meta-framework, Nitro static output (`nuxt generate`) |
| Vue 3 | Composition API (`<script setup lang="ts">`) |
| TypeScript | Strict typing |
| @nuxtjs/i18n | i18n with `strategy: 'prefix_except_default'`, lazy locale JSON, SEO mode |
| @nuxt/image | Responsive images (WebP/AVIF), build-time variants |
| @nuxtjs/sitemap | Per-locale sitemap with hreflang |
| @nuxtjs/robots | `robots.txt` generation |
| Pinia (@pinia/nuxt) | Client state management |
| VueUse (@vueuse/nuxt) | Utility composables (matchMedia, intersection observer, clipboard) |
| GSAP | Animations, lazy-imported and client-only |
| sass-embedded | SCSS preprocessor (modern API) |

### Backend (`backend/`)

| Library | Purpose |
|---|---|
| Django 5.2 | Web framework, ASGI |
| django-ninja | Async REST framework on Pydantic 2 (replaces DRF) |
| Pydantic 2 | Schema validation + JSON serialization |
| PostgreSQL (psycopg 3) | Write-side system of record |
| Redis (django-redis) | Read-side cache for the public API |
| django-parler | Multilingual ORM fields for content models |
| django-unfold | Modern admin UI |
| django-ratelimit | Rate-limiting for write endpoints |
| django-cors-headers | CORS |
| Pillow | Server-side image processing (WebP compression) |
| httpx | Async outbound HTTP (notifications) |

### Database & Cache

- **PostgreSQL** — write-only system of record; all admin edits land here.
- **Redis** — primary read source for the public API; `GET` endpoints are served from cache and invalidated by Django signals on admin writes.

---

## Architecture

```
   Browser ── HTTP ──▶  Static host / CDN
                        - serves frontend .output/public/ (prerendered HTML + assets)
                        - proxies /api/ and /admin/ to the backend
                              │
                        ASGI server (uvicorn worker)
                        - config.asgi:application
                        - Django Ninja  /api/v1/*
                        - Unfold admin  /admin/*
                              │
              ┌───────────────┼────────────────┐
        ┌─────▼─────┐   ┌──────▼──────┐   ┌──────▼──────┐
        │   Redis   │   │ PostgreSQL  │   │  Media FS   │
        │ read cache│   │   writes    │   │  uploads    │
        └───────────┘   └─────────────┘   └─────────────┘
```

### Build-time static payload pipeline

Read-side content is **not fetched at runtime**. It is exported once at build time and inlined per route:

1. **Backend export.** A management command (`export_payload`) builds the payload in-process (no HTTP) and writes one file per locale: `payload.<lang>.json` (e.g. `ru`, `en`, `uz`).
2. **Frontend ingestion.** The command writes those files into `frontend/server/data/` (and they are also published to `frontend/public/data/`). Nuxt reads them at build time to enumerate dynamic prerender routes.
3. **Per-slice hydration.** A server-only plugin provides the current locale's payload to the app; `usePayload()` surfaces it through a `useState`-backed ref, and `useStaticSlice<T>(key, selector)` extracts exactly one slice so each prerendered route inlines only the data it uses. The `useState` key prefix is `app:slice:`.
4. **Refresh.** A backend signal listens to writes on content models and triggers a debounced rebuild → CI re-runs `export_payload` and redeploys the static site with a fresh payload.

The static payload shape is exactly:

```
StaticPayload = { site_config: SiteConfig; faq: FaqPayloadItem[] }
```

Composables consuming it stay synchronous `computed()` slices — no `useAsyncData`, no `$fetch` on the read path. For example, `useFaq()` returns `{ items }` where `items = useStaticSlice<FaqPayloadItem[]>("faq", (p) => p.faq)`.

### SSR / SSG prerender

`nuxt generate` emits every prerenderable route as static HTML × every locale. Dynamic routes are enumerated from the static payload via the Nitro config hook; `crawlLinks: true` walks internal links so newly-linked pages are discovered automatically. Islands (`<ClientOnly>`, GSAP scenes) are used only where strictly necessary — header, footer, and above-the-fold content are fully SSR-emitted HTML.

### Read API (Redis-cached, signal-invalidated)

All public reads are `async def` and decorated with the caching decorator from `common/cache/`. Cache keys, TTLs, and stampede protection live under `common/cache/`. Per-model signal handlers in `web/signals/<model>.py` call the invalidation helpers in `common/signals/` on write; `WebConfig.ready()` imports all signals. When Redis is unreachable a circuit breaker trips and reads fall through to PostgreSQL.

### SEO layer

Each page calls `useSeo({ title, description })`; page types add structured data via `useJsonLd()`. `@nuxtjs/sitemap` generates the per-locale sitemap, `@nuxtjs/robots` emits `robots.txt`, and `@nuxtjs/i18n` (`seo: true`) auto-injects `<link rel="alternate" hreflang>` plus `x-default` and the canonical link — do not hand-inject hreflang.

### Lead-write path

`POST /leads` is the one runtime write path. It is **rate-limited** (`django-ratelimit`), protected by a server-side **honeypot** field, and each genuine lead fires a fire-and-forget **Telegram notification** (`common/notifications/`, httpx async) so dispatch never slows the response. Configured via env (bot token + chat id). The submission timezone is env-driven (`<TIME_ZONE>`).

### Image pipeline

- **Backend:** uploaded images are compressed to WebP and right-sized on save (per-field max edge); the Unfold admin shows a thumbnail preview of the stored file.
- **Frontend:** images render through `@nuxt/image` (responsive variants) via the shared `OptimizedMedia` component.

---

## Directory Structure

```
<repo-root>/
├── requirements/
│   ├── project.md                  # this document
│   ├── requirements_ai.md          # frontend engineering rules
│   ├── requirements_backend.md     # backend engineering rules
│   ├── frontend.md                 # design philosophy
│   └── DESIGN.md                   # design tokens + motion + patterns
├── frontend/                       # Nuxt 3 SSG
└── backend/                        # Django ASGI + Ninja + Redis
```

### Frontend (`frontend/`)

```
frontend/
├── nuxt.config.ts          # modules + i18n + sitemap + robots + image + nitro hooks
├── app.vue                 # <NuxtLayout><NuxtPage /></NuxtLayout>
├── app.config.ts           # app config incl. brand placeholder (useAppConfig().brand)
├── error.vue               # global error / 404 shell
├── assets/styles/          # token-driven SCSS architecture (single global import)
├── components/             # global shared UI (auto-imported)
│   ├── ui/                 # BaseButton, OptimizedMedia, form primitives, etc.
│   ├── layout/             # AppHeader, AppFooter, container, lang switcher
│   └── seo/                # JsonLd helpers
├── composables/            # global composables (usePayload, useStaticSlice, useSeo, useJsonLd, ...)
├── features/               # domain-driven modules (e.g. contact: lead form; faq)
├── i18n/locales/{ru,en,uz}/ # namespace-wrapped locale JSON
├── layouts/                # default chrome wrapper
├── middleware/             # trailing-slash and locale guards
├── pages/                  # file-based routing (mirrored across locales by i18n)
├── plugins/                # server static-payload provider, gsap (client), etc.
├── public/                 # favicon, static data/, fonts, og assets
├── server/data/            # build-time payload.<lang>.json
├── stores/                 # Pinia global stores
├── types/                  # api / models / env typings
└── utils/                  # pure helpers (format, etc.)
```

### Backend (`backend/`)

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/                 # settings.py, urls.py, asgi.py, wsgi.py
├── common/
│   ├── cache/              # client, keys, ttl, decorators, stampede protection
│   ├── signals/            # cache invalidation helpers
│   ├── notifications/      # Telegram (lead alerts)
│   └── image_processing*   # WebP compression (sync + async)
└── web/
    ├── apps.py             # ready() imports signals
    ├── admin/<model>.py    # Unfold + Parler language tabs
    ├── models/<model>.py   # content models (TranslatableModel) + SiteConfig + Lead
    ├── signals/<model>.py  # per-model invalidation + payload-rebuild trigger
    ├── management/commands/export_payload.py
    ├── api/v1/
    │   ├── api.py          # NinjaAPI instance, mounted at /api/v1/
    │   └── <domain>/       # router.py + schemas.py per domain
    └── migrations/
```

---

## URL → File mapping

Routing is **file-based** (`pages/`), mirrored across every locale by `@nuxtjs/i18n` with `strategy: 'prefix_except_default'`. The default locale has no prefix; others are prefixed (`/en/...`, `/uz/...`).

| Source file | default locale | prefixed locale |
|---|---|---|
| `pages/index.vue` | `/` | `/en/`, `/uz/` |
| `pages/<segment>/index.vue` | `/<segment>/` | `/en/<segment>/`, `/uz/<segment>/` |
| `pages/<segment>/[slug].vue` | `/<segment>/<slug>/` | `/en/<segment>/<slug>/`, `/uz/<segment>/<slug>/` |
| `pages/[...slug].vue` | 404 catch-all | per-locale 404 |

Kept routes in this template: `/` (welcome shell), `/kontakty/` (lead form), plus the 404 catch-all. Add project routes by dropping files under `pages/`.

---

## i18n

- **Locales:** `ru` (default, no URL prefix), `en` at `/en/`, `uz` at `/uz/`.
- **Strategy:** `prefix_except_default` — every page exists in every locale (1:1 mirror). hreflang + `x-default` are emitted automatically (`seo: true`).
- **Locale JSON:** static UI strings only, namespace-wrapped, in `i18n/locales/{ru,en,uz}/`. Namespaces: `common`, `nav`, `footer`, `seo`, `forms`, `faq`, `contact`, `alert`, `error-boundary`, `error404` (and `time` only if a util still needs it).
- **Content:** multilingual content models use `django-parler` `TranslatableModel`. Slugs are transliterated, **not translated**, so a path is stable across locales (preserves link equity).

---

## Theming

- **Token-driven SCSS.** All visual values come from CSS variables defined in the SCSS architecture (`assets/styles/`), consumed via `var(--*)`. No raw px, no Tailwind/atomic CSS.
- **Light theme only.** `<html data-theme="light">` is permanent; no theme toggle, no dark-mode media query.
- **Neutralised palette.** The shipped palette is brand-neutral placeholder tokens. To re-skin a project, swap the tokens documented in [DESIGN.md](DESIGN.md) — that is the single source of truth for the design system.

---

## Build & Run

### Frontend

```bash
cd frontend
cp .env.example .env       # set NUXT_PUBLIC_API_BASE, NUXT_PUBLIC_SITE_URL
npm install
npm run dev                # http://localhost:3000
npm run build              # SSG → .output/public/
npm run preview            # serve the built static output
npm run typecheck          # vue-tsc
```

The default site URL is `https://example.com`; override with `NUXT_PUBLIC_SITE_URL`. The frontend reads `frontend/server/data/payload.<lang>.json`, so run the backend export below once before building locally.

### Backend

```bash
cd backend
python -m venv .venv
./.venv/Scripts/activate          # Windows; use source .venv/bin/activate on POSIX
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
# run as ASGI (required for async Ninja views):
python -m uvicorn config.asgi:application --host 127.0.0.1 --port 8000
# export the build-time static payload for the frontend:
python manage.py export_payload --out=../frontend/server/data/
```

---

## Contact / Brand data

Fill in per project. At runtime these live in the `SiteConfig` singleton (editable in the admin) and flow into the frontend via the static payload; the values below are the documentation copy.

- **Brand name:** `<BRAND_NAME>` (frontend fallback: `useAppConfig().brand.name` → `"Brand"`)
- **Domain:** `<DOMAIN>` (default site URL fallback: `https://example.com`)
- **Email:** `<CONTACT_EMAIL>`
- **Phone(s):** `<PHONE_1>`, `<PHONE_2>`
- **Address:** `<ADDRESS>`
- **Timezone:** `<TIME_ZONE>`
- **Social:** `<TELEGRAM>`, `<INSTAGRAM>`, `<OTHER>`

---

## Changelog

The project appends dated entries below this heading as work lands.
