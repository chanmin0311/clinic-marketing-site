# Project Rules

## Read before starting any work

- `.specify/memory/constitution.md` — non-negotiable principles
- `contexts/project.md` — project purpose, demo safety rules, content constraints

## Read additionally, by type of work

- UI / styling → `contexts/frontend.md`
- New module, file placement, or any architectural judgement → `contexts/architecture.md`
- Writing or changing tests → `contexts/testing.md`

These files are the source of truth for their areas. Do not restate them here
or in a spec; link to them.

---

## Commands

```bash
npm run dev          # local inspection only — never the target for e2e
npm run build        # next build → out/
npm run typecheck    # tsc --noEmit
npm run lint         # eslint, incl. jsx-a11y and layer-boundary rules
npm run test         # vitest run
npm run test:e2e     # playwright + axe, runs against the build output
```

---

## Always applies, whatever the task

**Static export.** No middleware, no route handlers, no server actions, no
`cookies()` / `headers()`, no ISR or `revalidate`, no runtime environment
reads, no Next.js image optimization. Dynamic segments require
`generateStaticParams`.

**Content.** No device or product trademark names anywhere — content,
navigation, URLs, titles, metadata, filenames, alt text. No photographs of
real people presented as practitioners. No fabricated licence numbers or
business registration numbers. No reviews, testimonials, or star ratings.
No photographs of identifiable people as practitioners — sourced image
licences grant copyright, not likeness rights. noindex is permanent.

**Prices.** Displayed VAT-inclusive, always accompanied by a statement that
the final price may change after consultation. In the treatment catalogue,
a treatment with several variants shows its **lowest** variant price with a
"부터" prefix; full variants are revealed on the treatment's own disclosure.

**Map.** Location is shown with the keyless Google Maps share-embed iframe,
display only. There are no directions deep links and no Naver / Kakao map
integration. Do not add them.

**Boundaries.** Components never build a KakaoTalk or map URL. Those come from
the infrastructure adapters.

**E2E** runs against `out/`, never the dev server.

---

## Work rules

- Implementation must trace to an approved spec / plan / task. If no approved
  basis exists, do not implement — report what is missing.
- Do not change architectural decisions — layer boundaries, technology
  choices, data models, public interfaces — without surfacing the change for
  approval first.
- A `[NEEDS CLARIFICATION]` marker is a blocker, not a suggestion. Stop and
  report rather than inventing a plausible answer.
- If anything is uncertain, ask before proceeding. Do not assume.

---

## Before reporting completion

- [ ] `typecheck`, `lint`, `test`, `test:e2e` (incl. axe) all pass
- [ ] Layer boundaries respected
- [ ] Verified at 375 / 768 / 1280
- [ ] Keyboard-traversed once, focus visible throughout
- [ ] The change names the spec requirement it satisfies

---

## Feedback loop

If I correct the same thing twice, propose adding it to the relevant
`contexts/` file rather than only fixing the instance.
