# Testing Conventions

Scope: what gets tested, where, with what, and what deliberately does not.

This file is **subordinate to** `.specify/memory/constitution.md`. Principle
VII (automated testing) and Principle V (accessibility blocking in CI) are the
rules; this file is how they are satisfied here.

---

## 1. What gets which test

| Layer                   | Tool                   | Covers                                                                                |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `domain/**`             | Vitest                 | Every module. Business rules and edge cases.                                          |
| `infrastructure/**`     | Vitest                 | The contract each adapter implements — URL shape, config resolution, content loading. |
| Critical flows          | Playwright             | Flows named in the spec, run against the built static output.                         |
| Every page              | `@axe-core/playwright` | WCAG 2.1 AA violations. Blocking.                                                     |

Tests are written alongside the change that motivates them. "Merge now, add
tests later" is not available — CI blocks it.

---

## 2. Domain tests

Pure functions, pure assertions. No DOM, no mocks, no test doubles — domain
has no dependencies to double.

Priority cases, because these are where the money is:

- `formatKrw` — thousands separators, zero, large values
- `lowestPrice` / `priceRange` — single variant, many variants, identical
  prices (a "range" of one value must not render as "X~X")
- `durationRange` — same
- Opening-hours logic — lunch break, closed days, boundary minutes

Write the boundary case before the happy path. A single-variant treatment and
a many-variant treatment are different code paths in every pricing function.

---

## 3. Infrastructure tests

Assert the contract, not the implementation.

- KakaoTalk adapter: the produced URL is well-formed and contains the
  configured channel ID.
- Map adapter: the produced URL's host is the expected Google Maps embed host.
- Content loading: every treatment satisfies its invariants — at least one
  variant, non-negative integer prices, non-empty required copy.

That last one is worth real effort. It is the only automated check that
catches a malformed content edit, which is the most likely defect in a
content-driven site.

---

## 4. E2E tests

Run against the **built static output**, not `next dev`. Static export changes
what exists at runtime; testing the dev server tests a different application.

```
next build && npx serve out
```

Flows to cover:

1. Home → a treatment's price and duration, in at most two interactions
   (this is a spec success criterion, so it is a test, not a manual check).
2. The KakaoTalk CTA is present and correct on every page.
3. The Location page renders the map embed and the address.
4. Keyboard traversal of the primary navigation, including the mobile menu.

### External handoffs cannot be followed

Playwright cannot open KakaoTalk. Do not write a test that clicks the CTA and
waits for navigation — it will hang or flake.

Assert the resolved attributes instead:

```ts
const cta = page.getByRole("link", { name: /상담/ });
await expect(cta).toHaveAttribute("href", /^https:\/\/pf\.kakao\.com\/_/);
await expect(cta).toHaveAttribute("target", "_blank");
await expect(cta).toHaveAttribute("rel", /noopener/);
```

Same principle for the map: assert the `<iframe>` has a Korean `title`,
`loading="lazy"`, and a src on the expected host. **Never assert anything
about the content inside the iframe** — it is Google's, it is cross-origin,
and it changes without notice.

---

## 5. Accessibility checks

Run axe on every route as part of E2E, in both a mobile and a desktop
viewport. Violations fail the run.

- Scan the page, then exclude the map `<iframe>` by selector. Third-party
  embedded content is outside our control, and leaving it in produces
  permanent noise that trains everyone to ignore the report.
- Excluding the iframe does **not** exclude our own wrapper: the `title`
  attribute, the surrounding landmark, and the heading above it are still
  asserted.
- A violation is fixed, not waived. Waiving requires written rationale in the
  PR per Principle V.

axe catches roughly half of what AA requires. Keyboard order, focus
visibility, and whether link text makes sense out of context still need a
human pass — see the checklist in §8.

---

## 6. Fixtures

Tests read the **real content modules**. Do not build a parallel set of mock
treatments.

A separate fixture set drifts from production content, and then the tests pass
on data no visitor will ever see. Where a test needs a specific shape (a
single-variant treatment, a treatment with many variants), construct it inline
in the test file from the domain types.

---

## 7. What not to test

- **Markup snapshots.** They break on every copy edit and assert nothing about
  behaviour.
- **Tailwind class strings.** `toHaveClass('rounded-2xl')` tests the stylesheet
  author, not the product.
- **shadcn/Radix internals.** Test that your disclosure opens, not how Radix
  implements it.
- **Next.js itself.** Routing works; assert your routes exist, not that the
  router functions.
- **Domain logic through the browser.** If a price formats wrong, that is a
  Vitest failure. An E2E test that covers it is slow and points at the wrong
  place.

A test that fails only when an implementation detail changes is a maintenance
cost with no defect-catching value. Delete it.

---

## 8. Gates

CI runs, and any failure blocks merge:

```
typecheck   tsc --noEmit
lint        eslint (incl. jsx-a11y and the layer-boundary rules)
test        vitest run
e2e         playwright test (incl. axe)
audit       npm audit — no critical/high
```

All five run locally with the same commands. If it passes locally and fails in
CI, the difference is the build — run against `out/`, not `next dev`.

### A task is done when

- [ ] All five gates pass
- [ ] Layer boundaries respected (`contexts/architecture.md`)
- [ ] Verified at 375 / 768 / 1280
- [ ] Keyboard-traversed once by hand, focus visible throughout
- [ ] The PR names the spec requirement it satisfies

### Flake policy

A flaky test is a broken test. Do not paper over it with retries or `.skip`.
Either fix the race or delete the test — a skipped test in the suite is a lie
about coverage.
