---

description: "Task list template for feature implementation"
---

# Tasks: Aesthetic Dermatology Clinic Marketing Website

**Input**: Design documents from `/specs/001-clinic-marketing-site/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md),
[research.md](./research.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included. Principle VII (Automated Testing) and plan.md's `tests/` structure
explicitly mandate Vitest unit tests for every domain module and Playwright E2E +
`@axe-core/playwright` for the critical flows — these are not optional for this feature.

**Organization**: Tasks are grouped by user story (spec.md priorities) to enable
independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Every task names an exact file path

## Path Conventions

Single Next.js App Router project at the repository root (no `frontend/`/`backend/`
split — see plan.md's Structure Decision):
`app/`, `components/`, `domain/`, `infrastructure/`, `tests/unit/`, `tests/e2e/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling — no feature code yet.

- [x] T001 Initialize Next.js 14+ App Router project with TypeScript at repo root: `package.json`, `tsconfig.json` (`strict: true` project-wide per Principle II), `next.config.ts` (`output: 'export'`, `images.unoptimized: true` per research.md §1)
- [x] T002 [P] Install and configure Tailwind CSS 4: default breakpoints (`sm`/`md`/`lg`/`xl`, research.md §8) and the fixed restrained light palette tokens (background, ink/text, one muted accent) named for WCAG 2.1 AA contrast checking later (research.md §9)
- [x] T003 [P] Initialize shadcn/ui CLI and add the Accordion primitive and the navigation-menu/dialog primitive it needs for a mobile sheet, into `components/ui/` (plan.md dependency list — pulls in `@radix-ui/react-accordion`, `@radix-ui/react-navigation-menu` or `react-dialog`, `clsx`, `tailwind-merge`, `class-variance-authority`)
- [x] T004 [P] Configure ESLint (`eslint-config-next` + `eslint-plugin-jsx-a11y`) and Prettier at repo root, wired as the lint-time a11y/formatting gate (Principle V)
- [x] T005 [P] Configure Vitest in `vitest.config.ts` + `@vitejs/plugin-react`, with `npm run test:unit` script targeting `tests/unit/`
- [x] T006 [P] Configure Playwright in `playwright.config.ts` + `@playwright/test` + `@axe-core/playwright`, with `npm run test:e2e` script targeting `tests/e2e/`
- [x] T007 [P] Self-host Pretendard Variable via `next/font/local`: subset to Korean + Latin + punctuation glyphs actually used in the four pages' copy, woff2 only, `font-display: swap`, ≤120 KB woff2 total per page budget (research.md §2)
- [x] T008 [P] Create `staticwebapp.config.json` at repo root: `navigationFallback` to the generated `404.html` with `_next/*`/asset paths excluded, `globalHeaders` (`Content-Security-Policy` allow-listing `frame-src` for the Google Maps embed host, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`) (research.md §7)
- [x] T009 [P] Create `.github/workflows/azure-static-web-apps.yml`: gate order typecheck → lint → `test:unit` → `test:e2e` (incl. axe) → `npm audit` → Azure Static Web Apps deploy action, any red step blocking deploy (quickstart.md CI gate)
- [x] T010 Scaffold the layered directory structure with placeholder `.gitkeep`/index files: `domain/treatment/`, `domain/clinic-hours/`, `domain/practitioner/`, `domain/site-config/`, `infrastructure/content/`, `infrastructure/kakao/`, `infrastructure/maps/`, `components/layout/`, `components/treatments/`, `components/practitioners/`, `components/location/`, `components/shared/`, `tests/unit/domain/`, `tests/e2e/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, single-sourced content, and page chrome that every user story
depends on — cross-cutting per FR-005 (single-sourced content) and FR-024 (footer legal
disclosures on every page), neither of which belongs to one specific user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T011 [P] Create `domain/treatment/types.ts`: `Treatment`, `PriceVariant`, `TreatmentCategory` closed union (`'skin-texture' | 'pigmentation' | 'lifting-firming' | 'body-contouring' | 'hair-removal'`) per data-model.md — plain TypeScript only, no `react`/`next/*` import (Principle III layer rule)
- [ ] T012 [P] Create `domain/practitioner/types.ts`: `Practitioner` type per data-model.md
- [ ] T013 [P] Create `domain/clinic-hours/types.ts`: `Weekday`, `DayHours` (`{ day, open, close, closed }`), `ClinicHoursProfile` (`weekday: DayHours[]` length 7, `lunchBreak: {start,end} | null`, `closedDays: Weekday[]`) per data-model.md
- [ ] T014 [P] Create `domain/site-config/types.ts`: `ClinicLocationProfile`, `KakaoChannelReference`, `LegalDisclosureProfile`, and the `SiteConfig` composition type (`{ hours, location, kakaoChannelReference, legalDisclosure }`) per data-model.md and contracts/content-repository.md
- [ ] T015 Create `infrastructure/content/site-config.ts` exporting the typed `siteConfig` object satisfying `SiteConfig` — MOCK DATA fabricated placeholders per data-model.md's constraints: non-routable Gangnam-gu address, `buildingFloorSuite`, `nearestSubway` (`station`/`exit`/`walkMinutes`), `parking` copy, `02-000-0000`-pattern `phone`, fabricated `coordinates`, `directionsPlaceName`; weekly `hours` with `open < close` every non-closed day and any `lunchBreak` inside every day's range; placeholder `kakaoChannelReference.channelId`; `legalDisclosure` with a deliberately-invalid-checksum `businessRegistrationNumber`, fabricated `institutionName`/`directorName`, `privacyPolicyHref`, and the visible `demoNoticeText` ("이 사이트는 데모입니다") — depends on T013, T014
- [ ] T016 Create `app/layout.tsx` root layout: `lang="ko"`, mounts the Pretendard font from T007, exports root metadata with `NEXT_PUBLIC_SITE_ENV`-gated `noindex, nofollow` robots meta (research.md/plan.md "Demo vs. production SEO posture"), reserves mount points for Header/Footer — depends on T007, T015
- [ ] T017 [P] Create `app/robots.ts`: env-gated disallow-all `robots.txt` for the demo build, single build-time flag shared with T016 — depends on T016
- [ ] T018 [P] Create `app/not-found.tsx` custom 404 page, matching the route staticwebapp.config.json (T008) points at
- [ ] T019 [P] Create `components/layout/Header.tsx`: site nav linking Home/Treatments/Practitioners/Location, brand wordmark
- [ ] T020 [P] Create `components/layout/MobileNav.tsx` (`'use client'`): shadcn nav/dialog primitive from T003, focus-trapped and ARIA-correct per Principle V, no `infrastructure/` import beyond received props
- [ ] T021 Create `components/layout/Footer.tsx` rendering the full `LegalDisclosureProfile` set — business registration number, medical institution name, director name, clinic address, phone number, privacy-policy link (FR-024) — depends on T015
- [ ] T022 [P] Create `components/shared/CopyableField.tsx` (`'use client'`): generic single-interaction copy-to-clipboard field (FR-004), reused later for phone (US2) and address (US4)
- [ ] T023 Wire Header (T019), MobileNav (T020), and Footer (T021) into `app/layout.tsx` — depends on T016, T019, T020, T021
- [ ] T024 Create the four route files with minimal content: `app/page.tsx` (Home) with the brand statement and one-to-two line positioning statement (FR-011), and heading-only placeholder stubs for `app/treatments/page.tsx`, `app/practitioners/page.tsx`, `app/location/page.tsx` (each story phase below replaces its own stub) — depends on T023

**Checkpoint**: All four routes render with shared chrome (nav, footer, legal
disclosures) and no horizontal-scroll/broken-layout issues. User story implementation
can now begin.

---

## Phase 3: User Story 1 - Compare treatments by concern, price, and duration (Priority: P1) 🎯 MVP

**Goal**: A visitor can scan every treatment's name/starting price/duration/effect,
grouped by concern, with multi-variant entries breaking out each variant individually.

**Independent Test**: Load the Treatments page on a mobile viewport; every entry shows
the same four base fields in the same order, entries are grouped by category, and a
multi-variant entry discloses each variant's price and duration.

### Tests for User Story 1

> Write these first; confirm they fail before implementation.

- [ ] T025 [P] [US1] Vitest unit test `tests/unit/domain/price.test.ts`: `formatPriceKrw` locale-formats KRW and throws on non-positive input; `deriveListPrice` never returns `label:'from'` for a single-variant treatment (Edge Case) and returns the lowest variant labelled `'from'` for multi-variant; `shortestDurationMinutes` returns the minimum-duration variant's minutes (contracts/domain-interfaces.md)
- [ ] T026 [P] [US1] Vitest unit test `tests/unit/domain/grouping.test.ts`: `groupByCategory` sorts each category's treatments by `displayOrder`, and a `TreatmentCategory` with zero treatments produces no map entry (contracts/domain-interfaces.md)
- [ ] T027 [P] [US1] Vitest content-lint test `tests/unit/domain/content-treatments.test.ts` importing the real `infrastructure/content/treatments.ts`: every treatment has a non-empty `variants` array, every `priceKrw > 0` and `durationMinutes > 0`, and no `name` matches a maintained denylist of known device/brand terms (FR-009, contracts/content-repository.md)
- [ ] T028 [P] [US1] Playwright E2E `tests/e2e/treatment-price-flow.spec.ts`: from the Home page, reach a specific treatment's starting price and shortest session duration within two interactions (SC-001)

### Implementation for User Story 1

- [ ] T029 [P] [US1] Implement `domain/treatment/price.ts`: `formatPriceKrw`, `deriveListPrice`, `shortestDurationMinutes` per contracts/domain-interfaces.md — depends on T011
- [ ] T030 [P] [US1] Implement `domain/treatment/grouping.ts`: `groupByCategory` per contracts/domain-interfaces.md — depends on T011
- [ ] T031 [US1] Create `infrastructure/content/treatments.ts`: typed demo catalogue of ~12–18 treatments across all 5 `TreatmentCategory` values plus the `categoryLabels` Korean-label map, each treatment with a generic non-trademark `name`, ≥1 `PriceVariant` (VAT-inclusive `priceKrw > 0`, `durationMinutes > 0`), `effect` copy, calm/factual `sideEffects` copy (FR-017), `featured` flag, `displayOrder` — depends on T011, T029
- [ ] T032 [P] [US1] Create `components/treatments/PriceDisplay.tsx`: renders `deriveListPrice` output ("from ₩X" / exact price, FR-016) plus the indicative-pricing disclosure string from `siteConfig` (FR-010) immediately adjacent — never computes a price string inline (Principle III) — depends on T029, T015
- [ ] T033 [P] [US1] Create `components/treatments/VariantList.tsx` (`'use client'`, shadcn Accordion from T003): per-variant price/duration breakdown for multi-variant treatments — depends on T029
- [ ] T034 [US1] Create `components/treatments/TreatmentEntry.tsx`: full entry — name, effect, side-effects (calm/factual register, FR-017), `VariantList`, `PriceDisplay` — depends on T032, T033
- [ ] T035 [P] [US1] Create `components/treatments/TreatmentCard.tsx`: Home's featured-treatment card — name + `deriveListPrice` output, links to the full entry on the Treatments page — depends on T029
- [ ] T036 [US1] Implement `app/treatments/page.tsx`: list every treatment grouped by category via `groupByCategory` (FR-015), each rendered via `TreatmentEntry` in the fixed four-field order name/price/duration/effect (FR-016) — depends on T030, T031, T034
- [ ] T037 [US1] Add the featured-treatments section to `app/page.tsx` (Home): render `TreatmentCard` for each `featured: true` treatment, each linking to its Treatments-page entry (FR-012, Acceptance Scenario 3) — depends on T031, T035, T024

**Checkpoint**: Treatments page and Home's featured section are fully functional and
independently testable — this is the suggested MVP slice.

---

## Phase 4: User Story 2 - Start a booking via KakaoTalk (Priority: P1)

**Goal**: The KakaoTalk booking CTA and phone action are reachable and correct from
every page.

**Independent Test**: On any page, tap the KakaoTalk CTA and confirm it opens the
clinic's channel (or a graceful web fallback); tap the phone number and confirm a call
prompt and one-interaction copy.

### Tests for User Story 2

- [ ] T038 [P] [US2] Playwright E2E `tests/e2e/kakao-cta.spec.ts`: on all four routes, the KakaoTalk anchor's `href` equals `buildKakaoChatUrl(siteConfig.kakaoChannelReference.channelId)`, with `target="_blank"` and `rel="noopener noreferrer"` (SC-002, contracts/kakao-channel-adapter.md)
- [ ] T039 [P] [US2] Playwright E2E `tests/e2e/copy-to-clipboard.spec.ts` (phone portion): on all four routes, the phone number is a `tel:` link and copyable in one interaction (FR-004, Acceptance Scenario 3)

### Implementation for User Story 2

- [ ] T040 [US2] Implement `infrastructure/kakao/channel-url.ts`: `buildKakaoChatUrl(channelId)` returning `https://pf.kakao.com/{channelId}/chat` per contracts/kakao-channel-adapter.md — depends on T015
- [ ] T041 [US2] Create `components/layout/PrimaryCtaBar.tsx`: sticky bar with the KakaoTalk anchor (`href={buildKakaoChatUrl(...)}`, `target="_blank"`, `rel="noopener noreferrer"`, copy "카카오톡 예약 상담" framing booking per the resolved clarification) plus a `tel:` phone link and `CopyableField` for the phone number, remaining reachable without scrolling past a reasonable fold — depends on T040, T022, T015
- [ ] T042 [US2] Mount `PrimaryCtaBar` in `app/layout.tsx` so it renders on all four routes (FR-001, FR-002) — depends on T023, T041

**Checkpoint**: The KakaoTalk CTA and phone action work correctly and independently on
every page, regardless of which other stories are complete.

---

## Phase 5: User Story 3 - Evaluate the practitioner before visiting (Priority: P1)

**Goal**: A visitor can read a practitioner's profile and state who would treat them
and why they'd trust that person.

**Independent Test**: Load the Practitioners page alone and confirm a visitor can state
the practitioner's name and cite a specific credential/specialty/membership.

### Tests for User Story 3

- [ ] T043 [P] [US3] Vitest content-lint test `tests/unit/domain/content-practitioners.test.ts` importing the real `infrastructure/content/practitioners.ts`: `credentials` and `memberships` arrays are non-empty for every entry (contracts/content-repository.md)

### Implementation for User Story 3

- [ ] T044 [US3] Create `infrastructure/content/practitioners.ts`: fabricated demo practitioner profile(s) — `name` (fabricated placeholder), `portraitSrc` (abstract/silhouette placeholder, never a real photograph), `credentials`, `specialty`, `memberships`, `statement` — depends on T012
- [ ] T045 [P] [US3] Create `components/practitioners/PractitionerProfile.tsx`: renders name/portrait/credentials/specialty/memberships/statement (FR-019) as an introduction, reading naturally whether the content array has length 1 or more (Edge Case, FR-020) — depends on T012
- [ ] T046 [US3] Implement `app/practitioners/page.tsx`: render `PractitionerProfile` for each entry in `practitioners` — depends on T044, T045
- [ ] T047 [US3] Add the practitioner-introduction section to `app/page.tsx` (Home): brief intro linking to the Practitioners page (FR-013, Acceptance Scenario 2) — depends on T044, T024

**Checkpoint**: Practitioners page is fully functional and independently testable.

---

## Phase 6: User Story 4 - Find full location details and plan a visit (Priority: P2)

**Goal**: A visitor can determine open/closed status, reach the suite from the nearest
subway exit, and launch directions in Naver Map or Kakao Map.

**Independent Test**: Load the Location page alone and confirm open/closed status,
subway/walking directions, and both directions buttons work without contacting the
clinic.

### Tests for User Story 4

- [ ] T048 [P] [US4] Vitest unit test `tests/unit/domain/opening-status.test.ts`: `getOpeningStatus` returns `'open'`/`'lunch-break'`/`'closed'` correctly across boundary instants, evaluated in `Asia/Seoul` wall-clock time regardless of the `Date`'s origin (contracts/domain-interfaces.md)
- [ ] T049 [P] [US4] Vitest content-lint test `tests/unit/domain/content-site-config.test.ts` importing the real `infrastructure/content/site-config.ts`: every non-closed day has `open < close`, any `lunchBreak` falls within every open day's range (data-model.md Validation rules)
- [ ] T050 [P] [US4] Playwright E2E `tests/e2e/directions-cta.spec.ts`: on the Location page, the two directions anchors resolve to `buildNaverDirectionsUrl(...)` / `buildKakaoDirectionsUrl(...)` with `target="_blank"` and `rel="noopener noreferrer"` (SC-003, contracts/maps-adapters.md)
- [ ] T051 [US4] Extend `tests/e2e/copy-to-clipboard.spec.ts` with the address-copy assertion on the Location page (FR-004, Acceptance Scenario 4) — depends on T039

### Implementation for User Story 4

- [ ] T052 [P] [US4] Implement `domain/clinic-hours/opening-status.ts`: `getOpeningStatus(now, hours)` using `Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', ... })` for wall-clock comparison, no date library (research.md §6) — depends on T013
- [ ] T053 [P] [US4] Implement `infrastructure/maps/google-embed.ts`: `buildGoogleMapEmbedSrc(coords)` returning the keyless `https://www.google.com/maps/embed?pb=...` iframe src per contracts/maps-adapters.md
- [ ] T054 [P] [US4] Implement `infrastructure/maps/naver-directions-url.ts`: `buildNaverDirectionsUrl(place)` per contracts/maps-adapters.md
- [ ] T055 [P] [US4] Implement `infrastructure/maps/kakao-directions-url.ts`: `buildKakaoDirectionsUrl(place)` returning `https://map.kakao.com/link/to/{name},{lat},{lng}` per contracts/maps-adapters.md
- [ ] T056 [P] [US4] Create `components/location/GoogleMapEmbed.tsx`: iframe with `src={buildGoogleMapEmbedSrc(siteConfig.location.coordinates)}`, `title="클리닉 위치 지도"`, `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`, fixed aspect-ratio box to avoid CLS, MUST NOT be the page's LCP element (FR-021, plan.md Constraints) — depends on T053, T015
- [ ] T057 [P] [US4] Create `components/location/DirectionsButtons.tsx`: two anchors (네이버 지도로 길찾기 / 카카오맵으로 길찾기), `target="_blank"`, `rel="noopener noreferrer"` (FR-022) — depends on T054, T055
- [ ] T058 [P] [US4] Create `components/location/HoursTable.tsx`: weekly hours, lunch break, and closed days display (FR-021) — depends on T013, T015
- [ ] T059 [US4] Create `components/location/OpeningStatusBadge.tsx`: renders `getOpeningStatus(new Date(), siteConfig.hours)` as a legible open/lunch-break/closed label without requiring visitor date math (Edge Case) — depends on T052, T015
- [ ] T060 [US4] Implement `app/location/page.tsx`: address (via `CopyableField`, Acceptance Scenario 4), `buildingFloorSuite`, `GoogleMapEmbed`, `nearestSubway` (station/exit/walkMinutes), `parking` copy, `HoursTable`, `OpeningStatusBadge`, `DirectionsButtons` (FR-021, FR-022) — depends on T056, T057, T058, T059, T022, T024
- [ ] T061 [US4] Add the location-summary section to `app/page.tsx` (Home): address/area + hours-at-a-glance, linking to the Location page (FR-014) — depends on T060

**Checkpoint**: All four user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification and finishing work spanning all completed stories.

- [ ] T062 [P] Playwright E2E `tests/e2e/a11y.spec.ts`: `@axe-core/playwright` scan on all four routes with zero violations (Principle V gate) — depends on T036, T042, T046, T060
- [ ] T063 [P] Create `app/sitemap.ts`: real sitemap generator, correct now but referenced only once the site becomes production-indexable (plan.md "Demo vs. production SEO posture")
- [ ] T064 Manual responsive verification at 375px, 768px, and 1280px on all four routes per quickstart.md: no horizontal scroll, no overlapping content, no truncated CTA text, `PrimaryCtaBar` remains reachable without excessive scrolling (SC-007, Principle VI)
- [ ] T065 Manual Lighthouse performance check (mobile emulation, simulated slow 4G, 4x CPU slowdown) against the deployed Azure SWA build for all four routes: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1; confirm the Location page's LCP element is a text/heading block, not the Google Maps iframe; confirm woff2 payload ≤ 120 KB/page (Principle IX, quickstart.md)
- [ ] T066 Content-edit smoke test (SC-005): add one `PriceVariant` to an existing treatment in `infrastructure/content/treatments.ts` only, re-run `npm run build`, confirm no edit was needed under `app/`, `components/`, or `domain/`, and that the new variant appears on the Treatments page and updates the Home "from" price if it is now the lowest
- [ ] T067 Run the full CI gate locally (typecheck → lint → `test:unit` → `test:e2e` incl. axe → `npm audit`) and confirm all steps are green before the first push per the constitution's CI gate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–6)**: All depend on Foundational completion.
    - US1, US2, US3 are equal priority (P1) and have no dependencies on each other — can
      proceed in parallel if staffed, or in spec order (US1 → US2 → US3).
    - US4 (P2) depends only on Foundational, not on US1–US3, but is lower priority.
- **Polish (Phase 7)**: Depends on all four user stories being complete (T062's axe scan
  needs every route's final content).

### User Story Dependencies

- **US1 (P1)**: Foundational only. No dependency on US2/US3/US4.
- **US2 (P1)**: Foundational only. No dependency on US1/US3/US4.
- **US3 (P1)**: Foundational only. No dependency on US1/US2/US4.
- **US4 (P2)**: Foundational only. No dependency on US1/US2/US3.

Each story adds its own section to `app/page.tsx` (Home) independently — T037 (US1),
T047 (US3), T061 (US4) touch the same file but are sequenced by story completion, not
by a cross-story code dependency; treat concurrent edits to `app/page.tsx` as a
same-file conflict to sequence, not parallelize, if multiple stories are worked at once.

### Within Each User Story

- Tests are written first and confirmed to fail before implementation.
- Domain logic before content (content-lint tests need the domain functions' invariants
  to be meaningful) before components before the page that assembles them before the
  Home-page section that links to it.

### Parallel Opportunities

- All Setup tasks marked [P] (T002–T009) can run in parallel after T001.
- All Foundational [P] tasks (T011–T014, T017–T020, T022) can run in parallel within
  their sub-groups; T015/T016/T021/T023/T024 are sequential joins.
- Once Foundational is complete, US1/US2/US3/US4 can proceed in parallel (different
  files almost entirely, per-story `app/page.tsx` edits excepted — see above).
- Within each story, all [P]-marked tests can run in parallel; all [P]-marked
  domain/adapter implementation tasks can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Tests together:
Task: "Vitest unit test tests/unit/domain/price.test.ts"
Task: "Vitest unit test tests/unit/domain/grouping.test.ts"
Task: "Vitest content-lint test tests/unit/domain/content-treatments.test.ts"
Task: "Playwright E2E tests/e2e/treatment-price-flow.spec.ts"

# Domain implementation together:
Task: "Implement domain/treatment/price.ts"
Task: "Implement domain/treatment/grouping.ts"
```

## Parallel Example: Foundational Phase

```bash
Task: "Create domain/treatment/types.ts"
Task: "Create domain/practitioner/types.ts"
Task: "Create domain/clinic-hours/types.ts"
Task: "Create domain/site-config/types.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Treatments page independently — SC-001 flow, mobile viewport,
   grouped categories, multi-variant disclosure
5. Note: a stakeholder demo of the _booking_ goal specifically also wants US2 (the
   KakaoTalk CTA) — both are P1, so a two-story MVP (US1 + US2) is a reasonable
   alternative cut if the demo's point is proving the conversion path, not just the
   catalogue.

### Incremental Delivery

1. Setup + Foundational → shared chrome and content types ready
2. Add US1 → Treatments page + Home featured section → validate independently
3. Add US2 → KakaoTalk CTA + phone, site-wide → validate independently
4. Add US3 → Practitioners page + Home intro → validate independently
5. Add US4 → Location page + Home summary → validate independently
6. Polish → a11y scan, performance, responsive, content-edit smoke test, full CI gate

### Parallel Team Strategy

With multiple developers, after Foundational is done: Developer A takes US1, Developer
B takes US2, Developer C takes US3, Developer D takes US4 — all four stories touch
almost entirely disjoint files (only `app/page.tsx`'s per-story section is a shared-file
seam to coordinate).

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- FR-009 (no trademark/brand exposure) and FR-010 (indicative-pricing disclosure) are
  enforced structurally in T027/T031/T032, not left to ad hoc review.
- Every field constraint from data-model.md (non-empty arrays, `priceKrw > 0`,
  `durationMinutes > 0`, `open < close`, lunch break within range) is quoted into its
  owning content-lint test task so it isn't left to implementation-time discretion.
- Commit after each task or logical group; stop at any checkpoint to validate a story
  independently.
- Final Treatments/side-effect copy still requires client 의료법/의료광고 심의 sign-off
  before a real launch (spec.md Assumptions) — out of scope for these tasks, which build
  the required structure with placeholder demo copy per research.md §10.
