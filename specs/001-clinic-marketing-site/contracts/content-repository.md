# Contract: Content Repository (infrastructure/content)

There is no runtime content-loading API — "loading content" means importing a typed
TypeScript module, resolved entirely at build time. The contract here is the shape
each content module must export, which `domain/` types define and `app/`/`components/`
consume without re-shaping.

```ts
// infrastructure/content/treatments.ts
export const treatments: Treatment[]; // satisfies domain/treatment/types.ts

// infrastructure/content/practitioners.ts
export const practitioners: Practitioner[]; // satisfies domain/practitioner/types.ts

// infrastructure/content/site-config.ts
export const siteConfig: {
  hours: ClinicHoursProfile;
  location: ClinicLocationProfile;
  kakaoChannelReference: KakaoChannelReference;
  legalDisclosure: LegalDisclosureProfile;
};
```

## Editing contract (FR-005, FR-006, SC-005)

- Adding, repricing, or retiring a treatment is exactly one edit to the `treatments`
  array in `infrastructure/content/treatments.ts` — no change to any file under
  `app/`, `components/`, or `domain/` is required or permitted for that edit alone.
- Changing hours, address, phone, or the Kakao channel ID is exactly one edit to
  `infrastructure/content/site-config.ts` — every page that displays that value
  re-derives it from the same import, so there is no second place to update.
- A content edit that requires touching a component or domain file is, by definition,
  not a pure content edit and signals that the content's shape has outgrown the
  current `Treatment`/`PriceVariant`/etc. types — that is a type-and-plan change, not
  a routine content update, and should go back through `/speckit-clarify` or
  `/speckit-specify` per the constitution's traceability rule rather than being made
  silently.

## Validation contract

Since no schema-validation library is used, `tests/unit/domain/*.test.ts` includes a
content-lint pass that imports the real `treatments`/`practitioners`/`siteConfig`
modules and asserts the invariants listed in data-model.md's "Validation rules" for
each entity (non-empty variants, positive prices/durations, no denylisted brand terms,
chronologically sane hours). This is the enforcement mechanism referenced by spec.md's
"the compiler is the validation mechanism" decision — the compiler enforces shape,
this Vitest suite enforces the value-level invariants the compiler cannot express, and
both run in CI and block merge on failure (Principle VII).
