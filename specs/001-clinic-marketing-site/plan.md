# Implementation Plan: Aesthetic Dermatology Clinic Marketing Website

**Branch**: `001-clinic-marketing-site` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-clinic-marketing-site/spec.md`

## Summary

A four-page (Home, Treatments, Practitioners, Location), Korean-only, statically
exported Next.js marketing site for a single-location Gangnam aesthetic dermatology
clinic. Primary conversion is a KakaoTalk channel CTA reachable from every page;
Location additionally offers a keyless Google Maps display embed plus Naver Map /
Kakao Map directions links. All content (treatments with priced variants, practitioner
profile, hours/address, legal disclosures) is single-sourced, typed TypeScript content
consumed at build time — no CMS, no runtime data fetching, no server runtime. The site
is a client demo: all identifiers, imagery, and the KakaoTalk channel ID are fabricated
placeholders, and the deployment ships `noindex`. Technical approach: domain layer
holds pricing/variant/opening-hours business rules as pure TypeScript; infrastructure
layer holds content modules and the Kakao/Naver/Kakao-Map/Google-Maps adapters;
app/components stay presentation-only. Deployed to Azure Static Web Apps (Static
deployment model) via `next export`.

## Technical Context

**Language/Version**: TypeScript 5.x, `strict: true`. Node.js 20 LTS for build tooling.

**Primary Dependencies**: Next.js 14+ (App Router, `output: 'export'`), React 18,
Tailwind CSS 3, shadcn/ui (components added individually via CLI — pulls in the
specific `@radix-ui/react-*` primitives each component needs, plus `clsx`,
`tailwind-merge`, `class-variance-authority`), `lucide-react` for icons, `next/font/local`
for self-hosted Pretendard Variable.

**Storage**: N/A — no database, no CMS. Content is typed TypeScript modules under
`infrastructure/content/`, compiled into the static build.

**Testing**: Vitest (domain-layer unit tests), Playwright (E2E critical flows) +
`@axe-core/playwright` (accessibility assertions in E2E), ESLint (`eslint-config-next`
+ `eslint-plugin-jsx-a11y`) + Prettier (lint-time a11y and formatting checks).

**Target Platform**: Static web output served by Azure Static Web Apps (Static
deployment model — no linked Azure Functions backend). Primary client runtime is
mobile Safari/Chrome and the in-app browser inside KakaoTalk; secondary is desktop
Chrome/Edge/Safari.

**Project Type**: Web — single Next.js project, statically exported. No separate
backend project exists or is needed.

**Performance Goals**: Core Web Vitals "Good" thresholds on every route — LCP ≤ 2.5s,
INP ≤ 200ms, CLS ≤ 0.1 — measured via Lighthouse mobile emulation (Moto G Power /
"Mobile" device preset, simulated slow 4G, CPU 4x slowdown) against the deployed Azure
SWA static build, not `next dev`. Measured pre-merge for every UI task per Principle IX.

**Constraints**:
- Initial JS transferred per route ≤ 150 KB gzipped (Next.js framework chunk +
  route-specific code combined), excluding cached shared chunks on repeat navigation.
- Self-hosted font payload ≤ 120 KB woff2 total per page (Korean+Latin subset, variable
  weight — see research.md).
- Largest above-the-fold image ≤ 200 KB, served pre-optimized (`images.unoptimized =
  true` under static export — no on-demand optimization is available).
- Google Maps embed iframe is `loading="lazy"` and MUST NOT be the LCP element on the
  Location page (a heading/text block above it is).
- Zero client-side JS required for any primary content (treatment data, prices,
  practitioner profile, address, hours) to be present in initial HTML (Principle X /
  FR-007). JS is permitted only for interactive affordances (copy-to-clipboard,
  accordion expand/collapse, mobile nav toggle).

**Scale/Scope**: 4 routes (`/`, `/treatments`, `/practitioners`, `/location`) + a
custom 404. Demo catalogue: ~12–18 treatments across 4–5 concern categories, 1
practitioner. No pagination, no search, no filtering beyond category grouping.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — see
"Post-Design Re-check" below.*

| Principle | Check | Status |
|---|---|---|
| I. Spec-Driven Development | Every FR/SC in spec.md traces to a page/component in this plan; no feature here is un-derived from the spec. | PASS |
| II. TypeScript-First | `strict: true` project-wide; only `next.config.js`/`tailwind.config.js`/`postcss.config.js` (tooling configs Next.js/Tailwind require as plain JS) are exempt. | PASS |
| III. Layered Architecture | See "Layer mapping" below — explicit boundary rules defined. | PASS (rules defined below) |
| IV. Reusable, Composable Components | `TreatmentEntry`, `PriceDisplay`, `VariantList`, `DirectionsButtons`, `CopyableField` are each single-responsibility and reused across Home/Treatments/Location rather than duplicated per page. | PASS |
| V. Accessibility (WCAG 2.1 AA) | `eslint-plugin-jsx-a11y` in lint, `@axe-core/playwright` in E2E, both block CI/merge. Contrast verified against the fixed palette in research.md. | PASS |
| VI. Responsive Design | Breakpoints fixed in research.md (mobile/tablet/desktop = Tailwind default `sm/md/lg`); every UI task verified at all three before done. | PASS |
| VII. Automated Testing | Every domain module (price formatting, variant derivation, opening-hours) gets Vitest unit tests; KakaoTalk CTA, directions CTAs, and the two-interaction treatment-price flow get Playwright E2E. | PASS |
| VIII. Security by Default | No user input is ever accepted (no forms, no query-driven rendering) — the OWASP-input-validation surface is empty by design. No secrets in repo (Kakao channel ID is a public, non-secret identifier by Kakao's own design). `npm audit` gate in CI. | PASS |
| IX. Performance Budgets | Numeric budget and measurement method fixed above; Korean webfont and map iframe named as the two LCP risks with mitigations in research.md. | PASS |
| X. SEO Foundations | Demo posture (`noindex`, disallow-all `robots.txt`) is a deliberate, temporary content-level override, not an abandonment of the principle — see "Demo vs. production SEO posture" below. Semantic HTML/heading hierarchy/metadata are still built correctly so the switch to indexable at cutover is a config flip, not a rebuild. | PASS (justified below) |
| XI. Maintainability & Simplicity | No state management library, no CMS, no schema-validation library (compiler is the validator per spec) — each omission matches a real absence of need, not premature optimization in reverse. | PASS |
| XII. Minimal Dependencies | Full dependency list and justification below. | PASS |

No unresolved violations. Complexity Tracking table at the end of this document is
empty.

### Layer mapping (Principle III enforcement in this codebase)

- **`domain/`** — `Treatment`/`PriceVariant` types, `formatPrice` (VAT-inclusive KRW
  formatting + indicative-pricing label text), `deriveListPrice` (lowest-variant "from"
  price vs. single-variant plain price), `OpeningHours` type and `getOpeningStatus(now)`.
  Plain TypeScript/TS types only. **Violation** = any `import` of `react`, `next/*`, or a
  fetch/fs call inside `domain/`.
- **`infrastructure/`** — `content/treatments.ts`, `content/practitioners.ts`,
  `content/site-config.ts` (typed data, satisfies domain-declared shapes),
  `kakao/channel-url.ts`, `maps/google-embed.ts`, `maps/naver-directions-url.ts`,
  `maps/kakao-directions-url.ts`. **Violation** = a component importing from
  `infrastructure/` for anything other than the typed content/URL values it needs to
  render — no component re-implements a URL-building rule that belongs here.
- **`app/` + `components/`** — routes, layout, and presentation. Components receive
  `Treatment`, `PriceVariant`, `OpeningStatus`, and pre-built URLs as props/imports;
  they format nothing price- or hours-related themselves. **Violation** = a component
  computing a price string, an opening/closed label, or a directions URL inline instead
  of calling the domain/infrastructure function.
- Next.js specifics: every route under `app/` is a React Server Component by default
  (static export renders them at build time — no server runtime exists after export).
  `'use client'` is added only to the small interactive leaves (`CopyableField`,
  mobile nav toggle, accordion trigger) — these remain presentation-layer; they still
  must not import `infrastructure/` directly beyond receiving already-built props.

### Demo vs. production SEO posture (Principle X reconciliation)

The demo ships `<meta name="robots" content="noindex, nofollow">` (via root
`layout.tsx` metadata) and a disallow-all `robots.txt`, both gated by a single build-time
flag (`NEXT_PUBLIC_SITE_ENV=demo|production`, read only in `app/robots.ts` and the root
metadata export). This does not relax Principle X during the demo build: semantic HTML,
heading hierarchy, per-page `<title>`/description metadata, and a real `sitemap.xml`
generator are all built now, correct now, and simply not advertised to crawlers yet.
Cutover to production indexability is therefore a one-line environment-variable change
and redeploy — a content/config switch, not a code change — recorded as such per the
spec's Assumptions.

### Dependency list (Principle XII)

| Dependency | Type | Justification |
|---|---|---|
| `next`, `react`, `react-dom` | runtime | Required framework; static export satisfies "no server runtime" constraint with zero extra infra. |
| `tailwindcss`, `postcss`, `autoprefixer` | build-time (no shipped runtime JS) | Utility CSS compiled to static stylesheet; no client JS cost. |
| `clsx`, `tailwind-merge`, `class-variance-authority` | runtime (small, no transitive bloat) | Brought in by shadcn/ui's generated `cn()` utility and variant-based components; standard, not swappable without forking shadcn output. |
| `@radix-ui/react-accordion` | runtime | Backs the shadcn Accordion used for per-treatment variant breakdown (keyboard/ARIA-correct disclosure widget) — avoids hand-rolling a11y-correct expand/collapse (Principle V). |
| `@radix-ui/react-navigation-menu` (or `react-dialog` for a mobile sheet — confirmed in research.md) | runtime | Backs the shadcn primitive used for the mobile nav; avoids hand-rolling focus-trapped, ARIA-correct menu semantics. |
| `lucide-react` | runtime, tree-shaken | ISC-licensed icon set already bundled with shadcn/ui; ships only the ~6–8 icons actually imported (phone, map pin, chevron, copy, external-link, menu). |
| `typescript`, `eslint` + `eslint-config-next` + `eslint-plugin-jsx-a11y`, `prettier`, `vitest`, `@vitejs/plugin-react`, `playwright`/`@playwright/test`, `@axe-core/playwright` | devDependency | Mandated by Principles V/VII/XI; explicitly outside the minimal-dependency rule's scope per the constitution. |

No CMS SDK, no schema-validation library (Zod etc. — compiler validates content shape
per spec), no state-management library, no analytics library, no Kakao JS SDK, no
Google Maps JS/Embed API client (keyless iframe only) are added, because none is
required by any FR/SC in the spec.

## Project Structure

### Documentation (this feature)

```text
specs/001-clinic-marketing-site/
├── plan.md              # This file
├── research.md           # Phase 0 output
├── data-model.md          # Phase 1 output
├── quickstart.md           # Phase 1 output
├── contracts/               # Phase 1 output
│   ├── domain-interfaces.md
│   ├── kakao-channel-adapter.md
│   ├── maps-adapters.md
│   └── content-repository.md
└── tasks.md               # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                 # root layout: lang="ko", fonts, Header, MobileCTA, Footer
├── page.tsx                    # Home
├── not-found.tsx                 # custom 404 (also wired into staticwebapp.config.json)
├── robots.ts                      # env-gated robots.txt (demo: disallow-all)
├── sitemap.ts                      # real sitemap, only referenced once production-indexable
├── treatments/
│   └── page.tsx                     # Treatments (list + inline variant breakdown)
├── practitioners/
│   └── page.tsx                      # Practitioners
└── location/
    └── page.tsx                       # Location

components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx                      # legal disclosure set (FR-024)
│   ├── MobileNav.tsx                    # 'use client' — shadcn primitive
│   └── PrimaryCtaBar.tsx                 # sticky KakaoTalk + phone, every page
├── treatments/
│   ├── TreatmentCard.tsx                  # Home's featured-treatment card
│   ├── TreatmentEntry.tsx                  # full entry: name/effect/side-effects/variants
│   ├── VariantList.tsx                      # 'use client' — shadcn Accordion
│   └── PriceDisplay.tsx                      # "from ₩X" / single-variant price + VAT note
├── practitioners/
│   └── PractitionerProfile.tsx
├── location/
│   ├── GoogleMapEmbed.tsx
│   ├── DirectionsButtons.tsx                    # Naver Map + Kakao Map links
│   ├── HoursTable.tsx
│   └── OpeningStatusBadge.tsx
├── shared/
│   └── CopyableField.tsx                          # 'use client' — address/phone copy
└── ui/                                              # shadcn-generated primitives only

domain/
├── treatment/
│   ├── types.ts                                       # Treatment, PriceVariant
│   ├── price.ts                                        # formatPrice, deriveListPrice
│   └── grouping.ts                                      # group-by-category helper
├── clinic-hours/
│   ├── types.ts                                          # WeeklyHours, ClosedDay
│   └── opening-status.ts                                  # getOpeningStatus(now, hours)
└── practitioner/
    └── types.ts

infrastructure/
├── content/
│   ├── treatments.ts                                       # typed demo catalogue
│   ├── practitioners.ts
│   └── site-config.ts                                       # address/phone/hours/kakaoChannelId
├── kakao/
│   └── channel-url.ts                                        # buildKakaoChatUrl(channelId)
└── maps/
    ├── google-embed.ts                                        # buildGoogleMapEmbedSrc(query)
    ├── naver-directions-url.ts                                 # buildNaverDirectionsUrl(place)
    └── kakao-directions-url.ts                                  # buildKakaoDirectionsUrl(place)

tests/
├── unit/
│   └── domain/
│       ├── price.test.ts
│       ├── grouping.test.ts
│       └── opening-status.test.ts
└── e2e/
    ├── treatment-price-flow.spec.ts     # SC-001, two-interaction budget
    ├── kakao-cta.spec.ts                  # SC-002, FR-001/003, href/target/rel assertions
    ├── directions-cta.spec.ts               # SC-003, FR-022, href/target/rel assertions
    ├── copy-to-clipboard.spec.ts              # FR-004
    └── a11y.spec.ts                             # axe scan, all 4 routes

next.config.ts                # output:'export', images.unoptimized:true
tailwind.config.ts
staticwebapp.config.json         # 404 route, security headers, cache-control
playwright.config.ts
vitest.config.ts
.github/workflows/
└── azure-static-web-apps.yml         # typecheck, lint, unit, e2e+axe, npm audit, deploy
```

**Structure Decision**: Single Next.js App Router project at the repository root (no
`frontend/`/`backend/` split — there is no backend). Three-layer separation is enforced
by directory (`domain/`, `infrastructure/`, `app/`+`components/`) rather than by
package boundary, which is sufficient at this scale and avoids a monorepo/workspace
tool that Principle XI (YAGNI) and Principle XII (minimal dependencies) would both
reject as unjustified for a 4-page static site.

## Post-Design Re-check

Re-evaluated after Phase 1 (data-model.md, contracts/, quickstart.md — see below):
no new dependency, integration, or architectural decision introduced during design
contradicts the Constitution Check above. The `OpeningHours`/`getOpeningStatus` domain
logic and the three infrastructure URL-builder adapters are the only additions beyond
what was already anticipated in Technical Context, and both stay inside their assigned
layer. **PASS, unchanged.**

## Complexity Tracking

*No entries — Constitution Check has no unresolved violations.*
