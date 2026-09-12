# Quickstart: Aesthetic Dermatology Clinic Marketing Website

Validation guide for this feature once implemented. Implementation details (model/
component bodies, full test code) live in `tasks.md` and the codebase itself, not
here — this is the runbook for proving the feature works end to end.

## Prerequisites

- Node.js 20 LTS, npm.
- No accounts, API keys, or billing setup required — the Google Maps embed is
  keyless, and there is no Kakao SDK or CMS to provision (research.md §3, §5).

## Setup

```bash
npm install
```

## Local development

```bash
npm run dev
# http://localhost:3000 — Home, /treatments, /practitioners, /location
```

Static export behaves slightly differently from `next dev` (no on-the-fly image
optimization, no server-only code paths) — always confirm final results against the
export build below before calling a UI task done, per plan.md's performance-budget
measurement condition.

## Domain unit tests

```bash
npm run test:unit         # vitest run — price formatting, grouping, opening-status,
                           # plus the content-lint checks in contracts/content-repository.md
```

Expected: all `domain/` modules and the content-lint suite pass with no `any`/
type-suppression usage anywhere in `domain/` (Principle II/III gate).

## Static export build

```bash
npm run build              # next build; with output:'export' this produces /out
npx serve out               # or any static file server, to sanity-check the real export
```

Expected: `/out` contains fully rendered HTML for `/`, `/treatments`,
`/practitioners`, `/location`, and a `404.html` — view-source on each confirms
treatment names/prices/durations/effects/side-effects, practitioner info, and
address/hours are present in the raw HTML with JavaScript disabled (validates FR-007 /
SC-006).

## E2E + accessibility

```bash
npm run test:e2e            # playwright test
```

Covers, per plan.md's `tests/e2e/`:
- `treatment-price-flow.spec.ts` — from Home, reach a treatment's starting price and
  shortest session duration within two interactions (SC-001).
- `kakao-cta.spec.ts` — on every page, the KakaoTalk CTA anchor resolves to
  `buildKakaoChatUrl(...)` with `target="_blank"` and `rel="noopener noreferrer"`
  (SC-002, contracts/kakao-channel-adapter.md).
- `directions-cta.spec.ts` — on the Location page, both directions anchors resolve to
  `buildNaverDirectionsUrl(...)` / `buildKakaoDirectionsUrl(...)` with correct
  `target`/`rel` (SC-003, contracts/maps-adapters.md).
- `copy-to-clipboard.spec.ts` — address and phone number are copyable in one
  interaction everywhere they appear (FR-004).
- `a11y.spec.ts` — `@axe-core/playwright` scan on all four routes; zero violations
  (Principle V gate).

Expected: all specs green; a red run blocks merge per the constitution's CI gate.

## Manual responsive verification (Principle VI)

At each of the three fixed breakpoints (research.md §8) — 375px, 768px, 1280px —
confirm on every route:
- No horizontal scroll, no overlapping content, no truncated CTA text (SC-007).
- The `PrimaryCtaBar` (KakaoTalk + phone) remains reachable without scrolling past a
  reasonable fold.

## Manual performance check (Principle IX)

Run Lighthouse (mobile emulation, simulated slow 4G, 4x CPU slowdown) against the
deployed Azure SWA build (not `next dev`) for all four routes:
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 on each.
- Confirm the Location page's LCP element is a text/heading block, not the Google
  Maps iframe (research.md's named LCP risk).
- Confirm total woff2 payload per page ≤ 120 KB (research.md §2).

## Deployment

```bash
git push origin 001-clinic-marketing-site   # triggers .github/workflows/azure-static-web-apps.yml
```

CI gate order: typecheck → lint (incl. jsx-a11y) → `test:unit` → `test:e2e` (incl.
axe) → `npm audit` → Azure Static Web Apps deploy action. Any red step blocks deploy
per the constitution's CI gate — there is no "deploy with failing checks" path.

After deploy, confirm the demo posture: `robots.txt` is disallow-all and page
`<head>` carries `noindex, nofollow` (plan.md "Demo vs. production SEO posture") —
this is expected and correct for the demo environment, not a bug.

## Content-edit smoke test (SC-005)

To prove FR-005/FR-006/SC-005 hold: add one new `PriceVariant` to an existing
treatment in `infrastructure/content/treatments.ts` only, then re-run `npm run build`.
Expected: the build succeeds with no edit to any file under `app/`, `components/`, or
`domain/`, and the new variant appears on the Treatments page's full entry and (if it
is now the lowest price) updates the list-view "from" price automatically.
