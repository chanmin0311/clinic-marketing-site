# Architecture Conventions

Scope: folder layout, layer boundaries, content model, and the constraints
static export imposes.

This file is **subordinate to** `.specify/memory/constitution.md`. Principle
III (layered architecture) is the rule; this file is how it looks here.

Not covered here: content rules → `contexts/project.md`; UI conventions →
`contexts/frontend.md`; tests → `contexts/testing.md`.

---

## 1. Folder layout

```
app/                    routes, layouts, metadata. Presentation only.
components/             shared UI. Presentation only.
domain/                 types, business rules, formatting. No React, no I/O.
infrastructure/         content loading, URL builders, site config.
public/                 pre-optimized images, fonts, icons.
tests/unit/             Vitest specs.
tests/e2e/              Playwright specs.
```

The project was scaffolded with `create-next-app --no-src-dir`, so there is no
`src/` directory anywhere in the tree. `domain/` and `infrastructure/` live at
the repo root, siblings of `app/` and `components/`. Content modules
(treatments, practitioners, site config) live inside `infrastructure/content/`
— there is no separate top-level `content/` folder.

---

## 2. Layer rules

Dependencies flow inward. `app/` and `components/` depend on `domain/`;
`domain/` depends on nothing project-specific; `infrastructure/` implements
interfaces that `domain/` declares.

**Allowed:**

```ts
// components/treatment-card.tsx
import type { Treatment } from "@/domain/treatment";
import { formatPriceRange } from "@/domain/pricing";
```

```ts
// app/treatments/page.tsx
import { getTreatments } from "@/infrastructure/content"; // route-level only
```

**Forbidden:**

```ts
// domain/pricing.ts
import { useState } from "react"; // ✗ framework in domain
import { getTreatments } from "@/infrastructure/content"; // ✗ inward violation
```

```ts
// components/cta-button.tsx
const url = `https://pf.kakao.com/_${channelId}`; // ✗ infra concern in UI
```

The one sanctioned crossing: **route files** (`app/**/page.tsx`) may call
infrastructure to load content, then pass domain types down. Components below
the route receive data as props and never fetch.

### Enforce it in the linter, not in review

Encode the boundary as ESLint `import/no-restricted-paths` so CI blocks it
rather than a human noticing:

```
domain/**            may not import from  react, next, @/infrastructure, @/components, @/app
components/**        may not import from  @/infrastructure
app/**/layout.tsx    may not import from  @/infrastructure   (route files may)
```

Enforced in `eslint.config.mjs` via `import/no-restricted-paths` (the
`domain`/`components`/`infrastructure` zones) and a `no-restricted-imports`
override scoped to `domain/**` (bans `react` and `next` imports outright).

If you find yourself wanting to disable this rule, the file is in the wrong
layer.

### Where does a new file go?

1. Does it express a business rule, or a shape the business cares about?
   → `domain/`
2. Does it talk to the outside world — files, URLs, third-party services?
   → `infrastructure/`
3. Does it render? → `components/` or `app/`

If it seems to be two of these, it is two files.

---

## 3. Content model

A treatment carries one or more priced variants. The single-variant case is
the degenerate case, not a separate type.

```ts
// domain/treatment.ts
export interface PriceVariant {
    readonly id: string;
    readonly label: string; // "1회", "이마", "전체 3회"
    readonly area?: string;
    readonly sessions?: number;
    readonly priceKrw: number; // VAT-inclusive, integer won
    readonly durationMinutes: number;
}

export interface Treatment {
    readonly id: string;
    readonly name: string; // generic name — no trademarks
    readonly categoryId: string;
    readonly summary: string;
    readonly effect: string;
    readonly sideEffects: readonly string[];
    readonly variants: readonly [PriceVariant, ...PriceVariant[]];
}
```

The non-empty tuple makes "at least one variant" a compile error rather than
a runtime check.

Derivations live in `domain/pricing.ts`, never in components:
`lowestPrice`, `priceRange`, `durationRange`, `formatKrw`.

**No schema-validation library.** Content is typed TypeScript modules imported
at build time, so the compiler is the validator. Adding Zod here would need a
Principle XII justification it does not have.

### Site config

One module owns address, phone, opening hours, KakaoTalk channel ID, and the
map embed URL. Every page reads from it. Changing the phone number is a
one-line edit in one file.

---

## 4. Infrastructure adapters

External surfaces are reached through adapters, never inline in components.

```ts
// domain/ports.ts
export interface ChannelLinkPort {
    consultationUrl(): string;
}
export interface MapEmbedPort {
    embedUrl(): string;
}
```

```ts
// infrastructure/kakao.ts
export const kakaoChannel: ChannelLinkPort = {
    consultationUrl: () => `https://pf.kakao.com/_${siteConfig.kakaoChannelId}`,
};
```

- **KakaoTalk**: plain URL only. No Kakao JavaScript SDK.
- **Map**: the keyless Google Maps share-embed iframe. Not the Maps Embed API
  — that needs an API key and a billed Google Cloud account, which the demo
  must not depend on.

---

## 5. Static export constraints

`output: 'export'` with `images.unoptimized = true`. These are not available
and must not be introduced:

- `middleware.ts`
- Route handlers (`app/**/route.ts`)
- Server Actions
- `cookies()`, `headers()`, `draftMode()`
- `revalidate`, ISR, `dynamic = 'force-dynamic'`
- Dynamic segments without `generateStaticParams`
- Next.js image optimization (and therefore `srcset`/`sizes` — see
  `contexts/frontend.md` §7)
- Any runtime environment variable read

Environment values are inlined at build time. Nothing secret goes in
`NEXT_PUBLIC_*`; on a static export it ships to the browser.

`staticwebapp.config.json` carries the 404 route, security headers, and cache
control. Everything else stays in `next.config`.

---

## 6. Rendering

Every route is statically generated. Components are Server Components by
default — add `'use client'` only for genuine interactivity (a disclosure
toggle, a mobile menu), and push it as far down the tree as possible.

A page whose only interactive element is a link needs no client component at
all.

Each route exports `metadata` with a unique Korean `title` and description.
Structured data, when the spec calls for it, is emitted from the route, built
from domain types — never hand-written JSON duplicating content that already
exists in a content module.

---

## 7. Conventions

- Path alias `@/` → project root.
- Files kebab-case; types and interfaces PascalCase; functions camelCase.
- Domain types are `readonly` throughout. Content is never mutated.
- Named exports everywhere except `app/` route files, where Next.js requires
  a default export.
- Currency is an integer number of won. No floats, no pre-formatted strings
  in content modules — formatting is a domain function.
- Prefer a plain function over a class. Nothing here needs instantiation.
