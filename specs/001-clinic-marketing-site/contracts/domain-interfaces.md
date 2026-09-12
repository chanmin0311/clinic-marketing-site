# Contract: Domain Interfaces

The site has no external API surface (no backend, no route handlers). Its "contracts"
are the internal interface boundary between `domain/` and everything that calls it —
`infrastructure/content/*` must produce data satisfying these shapes, and
`app/`/`components/` must consume domain output only through these functions, never by
re-deriving the same logic inline (Principle III).

## `domain/treatment/price.ts`

```ts
export interface ListPrice {
  label: 'from' | 'exact';
  amount: number; // KRW, VAT-inclusive
}

/** Lowest-variant "from" price for multi-variant treatments; the single variant's
 *  exact price (no "from", no range) when there is only one. */
export function deriveListPrice(treatment: Treatment): ListPrice;

/** Locale-formatted KRW string, e.g. 150000 -> "150,000원". Does not append the
 *  indicative-pricing disclosure — callers render that separately, immediately
 *  adjacent, per FR-010. */
export function formatPriceKrw(amountKrw: number): string;

/** Minutes of the shortest-duration variant — pairs with deriveListPrice to satisfy
 *  SC-001 ("starting price and shortest session duration"). */
export function shortestDurationMinutes(treatment: Treatment): number;
```

**Contract guarantees**:
- `deriveListPrice` never returns `label: 'from'` for a treatment with exactly one
  variant (Edge Case: no unnecessary "from" prefix on single-variant entries).
- `formatPriceKrw` throws (fails a unit test, not a runtime user-facing error — content
  is build-time fixed) on a non-positive input; content authors get the failure at
  `npm run build`/`vitest run`, never a visitor.

## `domain/treatment/grouping.ts`

```ts
export function groupByCategory(
  treatments: Treatment[]
): Map<TreatmentCategory, Treatment[]>;
```

**Contract guarantee**: every `TreatmentCategory` union member that has at least one
treatment produces a map entry sorted by each treatment's `displayOrder`; categories
with zero treatments are simply absent from the map (the Treatments page never renders
an empty category heading).

## `domain/clinic-hours/opening-status.ts`

```ts
export type OpeningStatus = 'open' | 'lunch-break' | 'closed';

/** Pure function — no I/O, no ambient clock access beyond the `now` argument, so it is
 *  trivially unit-testable at arbitrary instants including DST-irrelevant Asia/Seoul
 *  edge cases (Korea does not observe DST, but the boundary-of-day and
 *  boundary-of-lunch-break instants are still tested explicitly). */
export function getOpeningStatus(
  now: Date,
  hours: ClinicHoursProfile
): OpeningStatus;
```

**Contract guarantee**: evaluation always happens in `Asia/Seoul` wall-clock time
regardless of the `now` Date's origin or the visitor's device timezone — a visitor
browsing from outside Korea sees the clinic's own local open/closed state, not their
own.
