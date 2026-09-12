# Phase 1 Data Model: Aesthetic Dermatology Clinic Marketing Website

All entities below are TypeScript types/interfaces in `domain/`, populated by typed
constant data in `infrastructure/content/`. There is no database and no runtime
validation library — the TypeScript compiler is the sole validation mechanism (per
spec.md's data-model decision), so every field below is non-optional unless explicitly
marked optional, and "validation rules" describe invariants enforced by the type shape
itself plus review at content-authoring time, not a runtime check.

## Treatment

A single procedure offered by the clinic, presented under a generic descriptive name.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable slug, e.g. `"pore-refining-laser"`. Used as anchor/list key; never a brand/device name (FR-009). |
| `name` | `string` | Generic descriptive Korean name shown to visitors. |
| `category` | `TreatmentCategory` | Concern/category grouping key (see enum below). Drives Treatments-page grouping (FR-015). |
| `effect` | `string` | Intended effect/concern-addressed copy, calm/factual register. |
| `sideEffects` | `string` | Side-effect summary, calm/factual/non-alarming (FR-017). Required — never omitted by euphemism. |
| `variants` | `PriceVariant[]` | Non-empty array (`[PriceVariant, ...PriceVariant[]]` at the type level). A single-variant treatment is this array with length 1 — not a separate type (per spec). |
| `featured` | `boolean` | Whether it appears in the Home page's curated selection (FR-012). |
| `displayOrder` | `number` | Sort key within its category on the Treatments page. |
| `internalDeviceMapping` | `string` (optional, not exported to any page-rendering module) | Internal-only note of the underlying branded procedure/device, kept out of published content per FR-009. Lives only in a comment or a field never imported by `app/`/`components/`. |

**Derived (domain logic, not stored)**:
- `listPrice(treatment): { label: 'from' | 'exact'; amount: number }` — lowest variant
  when `variants.length > 1` (labelled "from"), the single variant's price when
  `variants.length === 1` (labelled exact, no "from" prefix and no one-item range,
  per the spec's Edge Case).
- `shortestDuration(treatment): number` — minutes of the shortest-duration variant, for
  SC-001's "starting price and shortest session duration" pairing.

**Validation rules** (type-level / content-review-time):
- `variants` must be non-empty (enforced by the tuple-like type above).
- `category` must be one of the fixed `TreatmentCategory` values (closed union, not a
  free string) so grouping (FR-015) can never silently produce an "unsorted" bucket.
- `name` must not equal or contain any string in a maintained denylist of known device/
  brand terms — enforced by a Vitest content-lint test (`tests/unit/domain/...`) that
  runs over `infrastructure/content/treatments.ts`, not by the type system.

## PriceVariant

One priced/duration configuration of a Treatment, distinguished by body area, session
count, or both.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable within its parent treatment, e.g. `"full-face-1session"`. |
| `label` | `string` | Human-readable variant label, e.g. `"얼굴 전체 · 1회"`. |
| `priceKrw` | `number` | Integer KRW, VAT-inclusive (부가세 포함) per spec's resolved clarification. Never a pre-VAT figure. |
| `durationMinutes` | `number` | Session duration in minutes. |

**Derived (domain logic, not stored)**:
- `formatPrice(priceKrw): string` — locale-formatted `"₩000,000"` (or `"000,000원"`
  per final copy decision), always rendered together with the indicative-pricing
  disclosure string (FR-010) by the component layer — the disclosure text itself is a
  single-sourced constant in `infrastructure/content/site-config.ts`, not per-variant
  data, since its wording is identical everywhere it appears.

**Validation rules**:
- `priceKrw > 0`, `durationMinutes > 0` — enforced by a Vitest content-lint test over
  the content module (again: compile-time types can express "a number" but not "a
  positive number" without a branded type, which would be unjustified complexity here).

## TreatmentCategory (enum / closed union)

```ts
type TreatmentCategory =
  | 'skin-texture'      // 피부결/모공
  | 'pigmentation'        // 색소/기미
  | 'lifting-firming'       // 리프팅/탄력
  | 'body-contouring'         // 체형/바디
  | 'hair-removal';             // 제모
```

Exact Korean labels for each category are content data (`categoryLabels` map in
`infrastructure/content/treatments.ts`), not baked into the type.

## Practitioner

A person who performs treatments at the clinic.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `name` | `string` | Fabricated placeholder name for the demo (MOCK DATA constraint). |
| `portraitSrc` | `string` | Path to an abstract/silhouette placeholder image, or a reserved-slot marker — never a real person's photograph (MOCK DATA constraint). |
| `credentials` | `string[]` | e.g. `["피부과 전문의"]`. Non-realistic-format only — no real medical license/registration numbers. |
| `specialty` | `string` | |
| `memberships` | `string[]` | Medical society memberships, fabricated placeholders. |
| `statement` | `string` | Short personal statement about approach (FR-019). |

**Validation rules**: `credentials`/`memberships` arrays non-empty (content-lint test,
same pattern as Treatment). The Practitioners page renders this type directly whether
the content array has length 1 (single-practitioner launch assumption) or more, per
the spec's explicit accommodation requirement — no separate "single practitioner" type.

## WeeklyHours / ClinicHoursProfile

Single-sourced clinic hours model, consumed by both the Location page's `HoursTable`
and the `OpeningStatusBadge` shown site-wide.

| Field | Type | Notes |
|---|---|---|
| `weekday` | `DayHours[]` (length 7, Mon–Sun) | Each entry: `{ day: Weekday; open: string /* "HH:mm" */; close: string; closed: boolean }`. |
| `lunchBreak` | `{ start: string; end: string } \| null` | `null` if the clinic doesn't close for lunch. |
| `closedDays` | `Weekday[]` | Redundant with `DayHours.closed` at the type level but kept as the human-authored source (`closed: boolean` on each `DayHours` is derived from this at content-build time by a small `infrastructure` helper) — **decision**: to avoid two sources of truth, `DayHours.closed` is in fact computed by content code from `closedDays`, not authored twice; documented here so a future editor doesn't hand-edit both. |

**Derived (domain logic)**: `getOpeningStatus(now: Date, hours: ClinicHoursProfile):
'open' | 'lunch-break' | 'closed'` — see research.md §6 for the `Asia/Seoul`
timezone-handling decision.

**Validation rules**: `open < close` for every non-closed day; `lunchBreak`, if
present, falls within every day's open/close range — enforced by Vitest unit tests
against the actual content module (not just a type-level rule, since "chronological
order of two HH:mm strings" isn't expressible in TypeScript's type system without
disproportionate complexity).

## ClinicLocationProfile

The single-sourced record of where the clinic can be reached (distinct from
`ClinicHoursProfile` above only for readability; both live in the same
`site-config.ts` module and are typically imported together).

| Field | Type | Notes |
|---|---|---|
| `address` | `string` | Non-routable placeholder address (MOCK DATA constraint) — a fabricated dong/beon-ji combination in Gangnam-gu that does not resolve to a real building. |
| `buildingFloorSuite` | `string` | e.g. `"OO빌딩 5층 501호"`. |
| `nearestSubway` | `{ station: string; exit: number; walkMinutes: number }` | |
| `parking` | `string` | Parking/validation copy. |
| `phone` | `string` | Non-routable placeholder number (MOCK DATA constraint), e.g. a `02-000-0000`-pattern value reserved for fictional use. |
| `googleMapsEmbedSrc` | `string` | The keyless embed iframe `src` URL, built once in `infrastructure/maps/google-embed.ts` against fabricated placeholder coordinates. |
| `directionsPlaceName` | `string` | Name string passed to both `buildNaverDirectionsUrl` / `buildKakaoDirectionsUrl` (see contracts/maps-adapters.md). |
| `coordinates` | `{ lat: number; lng: number }` | Fabricated placeholder coordinates (still a real-looking lat/lng pair, but pointed at a location that isn't the clinic). |

## KakaoChannelReference

| Field | Type | Notes |
|---|---|---|
| `channelId` | `string` | Demo placeholder Kakao public channel ID (e.g. `"_xdEmoK"`-shaped fabricated value) — swapped for the client's real ID at production cutover as a single content-file edit. |

Consumed only by `infrastructure/kakao/channel-url.ts` (see
contracts/kakao-channel-adapter.md) — no component reads `channelId` directly.

## LegalDisclosureProfile

| Field | Type | Notes |
|---|---|---|
| `businessRegistrationNumber` | `string` | Non-realistic-format placeholder (MOCK DATA constraint) — deliberately fails the real 사업자등록번호 check-digit algorithm so it cannot be mistaken for a live registration. |
| `institutionName` | `string` | Fabricated clinic name. |
| `directorName` | `string` | Fabricated name, distinct from any `Practitioner.name` collision risk — same fabrication constraint applies. |
| `address` | `string` | Same value as `ClinicLocationProfile.address` (single-sourced import, not duplicated data). |
| `phone` | `string` | Same value as `ClinicLocationProfile.phone`. |
| `privacyPolicyHref` | `string` | Internal route or anchor to a minimal placeholder privacy-policy section/page. |
| `demoNoticeText` | `string` | The visible "이 사이트는 데모입니다" (demo notice) footer copy, required by the MOCK DATA constraint. |

## SiteConfig (composition root)

`infrastructure/content/site-config.ts` exports one object composing
`ClinicHoursProfile`, `ClinicLocationProfile`, `KakaoChannelReference`, and
`LegalDisclosureProfile` — this is the single module every page/component imports for
cross-cutting data, satisfying FR-005 (single-sourced hours/address/phone) by
construction: there is exactly one file where these values are written down.

## Entity relationships

```text
SiteConfig
├── ClinicHoursProfile        (1)  — used by: HoursTable, OpeningStatusBadge (every page)
├── ClinicLocationProfile      (1)  — used by: Location page, Footer, PrimaryCtaBar
├── KakaoChannelReference        (1)  — used by: PrimaryCtaBar (every page)
└── LegalDisclosureProfile         (1)  — used by: Footer (every page)

Treatment (N)
└── PriceVariant (1..N)  — owned inline, not a separate content file/table

Practitioner (N, N=1 at launch)  — independent content array, no FK to Treatment
```

No entity has a runtime-mutable state or a state-transition diagram — all data is
build-time-fixed content; the only "state" that changes without a redeploy is the
computed `OpeningStatus`, which is a pure function of `Date.now()` and is therefore
documented under "Derived" above rather than as a stateful entity.
