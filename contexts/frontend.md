# Frontend Conventions

Scope: design tokens, typography, component policy, imagery, a11y patterns, and
motion rules for this project's UI layer.

This file is **subordinate to** `.specify/memory/constitution.md`. It does not
restate the constitution's MUST rules; it records how they are realised in this
codebase. Where the two disagree, the constitution wins and this file is wrong.

Not covered here:

- Content rules (trademark prohibition, VAT-inclusive pricing, mock-data
  safety) → `contexts/project.md`
- Layer boundaries and module placement → `contexts/architecture.md`
- Test policy → `contexts/testing.md`

---

## 1. Stack assumptions

|           |                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Tailwind  | v4, CSS-first config. Tokens live in `app/globals.css` under `@theme inline`. There is **no `tailwind.config.js`**.               |
| shadcn/ui | `base-vega` style (current `shadcn` CLI default at the version installed — `new-york` no longer exists as a style name), React 19, OKLCH tokens |
| Next.js   | App Router, `output: 'export'`, `images.unoptimized = true`                                                                       |
| Animation | `tw-animate-css` **only if** an installed shadcn component requires it. `tailwindcss-animate` is deprecated and must not be used. |

If any of these change, this file changes with them in the same commit.

---

## 2. Brand direction

Clean, calm, minimal — hygienic without reading as cold or clinical. Warm
neutral ground, one muted rose accent, generous whitespace, quiet type,
almost no ornament. The site should feel composed and unhurried.

Three things carry the tone, in order: whitespace, Korean line-break quality,
and photography. Everything else is subordinate to those.

**Spend boldness in one place.** One element per page may be the memorable
thing; everything around it stays quiet. If every section has a card, a
shadow, and a hover lift, nothing reads as considered.

---

## 3. Color tokens

Defined once in `app/globals.css`. Components reference semantic utilities
only.

**Strict rule:** raw hex, raw `rgb()`, raw `oklch()`, and Tailwind's built-in
palette utilities (`bg-rose-500`, `text-slate-700`, `bg-white`, `border-white/40`)
are forbidden in component code. Use `bg-background`, `text-muted-foreground`,
`bg-blush`, and so on. `bg-card` is the white surface — not `bg-white`.

```css
@import "tailwindcss";

:root {
    /* Ground */
    --background: oklch(0.985 0.005 85); /* warm off-white */
    --foreground: oklch(0.27 0.015 265); /* soft deep charcoal */
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.27 0.015 265);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.27 0.015 265);

    /* Primary: muted rose. Carries white text — must clear 4.5:1. */
    --primary: oklch(0.48 0.13 15);
    --primary-foreground: oklch(0.99 0 0);

    /* Secondary: soft sage surface */
    --secondary: oklch(0.95 0.015 155);
    --secondary-foreground: oklch(0.36 0.04 155);

    /* Muted & accent surfaces */
    --muted: oklch(0.955 0.008 85);
    --muted-foreground: oklch(0.5 0.015 265);
    --accent: oklch(0.96 0.02 40);
    --accent-foreground: oklch(0.45 0.12 15);

    --destructive: oklch(0.55 0.18 27);
    --destructive-foreground: oklch(0.99 0 0);

    --border: oklch(0.92 0.008 85);
    --input: oklch(0.92 0.008 85);
    --ring: oklch(0.48 0.13 15);

    /* Brand tints — the only custom tokens. Surfaces, never text. */
    --blush: oklch(0.965 0.018 15);
    --sage: oklch(0.72 0.05 155);

    --radius: 0.75rem;
}

@theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-destructive-foreground: var(--destructive-foreground);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-blush: var(--blush);
    --color-sage: var(--sage);
    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: 1.5rem;
    --radius-2xl: 2rem;
}
```

### Contrast is a build requirement, not a preference

Any foreground/background pair used for text must clear **4.5:1** (3:1 for
text at 24px+ or 19px+ bold). Principle V makes this blocking in CI, so a
token that cannot pass is a defect, not a style choice.

Two pairs in this palette sit close to the line and must be re-checked
whenever their values move:

- `--primary-foreground` on `--primary` (button labels)
- `--muted-foreground` on `--background` (secondary body copy)

Never introduce a lighter primary for "softness." If the rose needs to feel
lighter, lighten the _surface_ around it, not the text-bearing token.

### No dark mode

There is no `.dark` block and no theme toggle. It is not in the spec, it
doubles the contrast-verification surface, and Principle XI forbids
unrequested abstraction. If the client asks for it, it goes through
`/speckit.specify` first.

---

## 4. Spacing, layout, breakpoints

Arbitrary values (`w-[347px]`, `px-[17px]`, `gap-[13px]`) are prohibited
except for computed transforms or canvas geometry. Stay on Tailwind's scale.

| Rhythm               | Value                                              |
| -------------------- | -------------------------------------------------- |
| Section vertical     | `py-16 md:py-24`                                   |
| Container horizontal | `px-4 sm:px-6 lg:px-8`                             |
| Card grid gap        | `gap-6 lg:gap-8`                                   |
| Content max width    | `max-w-6xl` page shell, `max-w-2xl` for body prose |

**Breakpoints (Principle VI).** The defined set is mobile `< 768`, tablet
`768–1023`, desktop `≥ 1024`. Every UI change is verified at **375 / 768 /
1280** before it is considered done. Tailwind's `sm` and `xl` may be used for
fine-tuning but are not part of the verified set.

Radius and shadow encode hierarchy — they are not applied uniformly. Media and
primary surfaces get `rounded-2xl`; controls and inputs get the base radius;
most containers get neither a shadow nor a border. A page where every block is
an identically rounded, identically shadowed card reads as a template.

---

## 5. Korean typography

Line-break quality is half the brand tone.

- `<html lang="ko">` on the root.
- **`break-keep` on all prose, headings, and button labels.** Without it
  Korean breaks mid-word and the composure collapses. This is the single
  most load-bearing rule in this file.
- Headings: `leading-snug` or `leading-tight`, `tracking-tight`.
- Body: `leading-relaxed`, `tracking-tight`.
- Line length: aim for roughly 35–45 Korean characters per line. `max-w-2xl`
  at base body size lands near this; verify rather than assume.

```tsx
<h2 className="text-2xl md:text-3xl font-semibold leading-snug tracking-tight break-keep text-foreground">
  피부 상태에 맞춘 시술 계획
</h2>
<p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed tracking-tight break-keep text-muted-foreground">
  진단부터 시술, 이후 관리까지 같은 의료진이 맡습니다.
</p>
```

Avoid, in Korean and in general:

- ALL-CAPS or tracked-out eyebrow labels above headings
- Accenting one word in a headline with color, italic, or weight
- Numbered markers (01 / 02 / 03) unless the content genuinely is a sequence
- `→` appended to link and button text
- Meta strings joined with middle dots

---

## 6. Fonts

OFL-licensed only. Self-hosted. No `<link>` to a font CDN — it is
render-blocking and adds a third-party origin to the critical path.

Korean webfonts are large enough to threaten the LCP budget on their own, so
subsetting is mandatory, not optional:

- Ship a **Korean subset** build, not the full family.
- Split by `unicode-range` so Latin and Hangul load independently.
- `display: 'swap'`.
- `preload` **only** the weights that appear above the fold. Preloading
  everything defeats the purpose.
- Set an explicit `fallback` stack so the swap does not shift layout.

```ts
// app/fonts.ts
import localFont from "next/font/local";

export const pretendard = localFont({
    src: "../public/fonts/PretendardVariable.subset.woff2",
    display: "swap",
    preload: true,
    variable: "--font-pretendard",
    fallback: [
        "-apple-system",
        "BlinkMacSystemFont",
        "system-ui",
        "sans-serif",
    ],
});
```

One family. A second face is only justified if it does a job the first cannot.

---

## 7. Images under static export

`images.unoptimized = true`, so **Next.js generates no `srcset` and the
`sizes` prop does nothing.** Do not write `sizes` and assume responsive
delivery — it is inert here. Responsive art direction, if needed, is authored
by hand with `<picture>` or explicit `srcset`.

What still applies:

- Commit **pre-optimized, correctly sized** `.webp` / `.avif`. Icons and the
  logo are `.svg`.
- Always set `width` and `height`, or an explicit `aspect-[...]`, to prevent
  CLS.
- `priority` on the single above-the-fold hero image; everything else is
  lazy by default.
- Alt text in Korean, describing purpose. Decorative images take `alt=""`.

```tsx
<Image
    src="/images/hero-clinic.webp"
    alt="진료실 내부"
    width={1200}
    height={800}
    priority
    className="rounded-2xl object-cover"
/>
```

See `contexts/project.md` for what imagery may depict — in particular, no
photographs of real people presented as practitioners.

---

## 8. shadcn/ui policy

- **Never** bulk-install. Add components one at a time, via CLI, at the moment
  a component is actually needed.
- Each added component brings Radix primitives into `package.json` as real
  runtime dependencies. Under Principle XII that is a dependency decision, so
  the PR states which spec requirement needed it.
- Prefer a plain element over a shadcn component when the plain element does
  the job. A section heading does not need `<Card>`.

```bash
npx shadcn@latest add button
```

### Recurring patterns

**Primary CTA (KakaoTalk).** Always an `<a>`, never a `<button>` with an
`onClick` navigation — E2E asserts the resolved `href`. The URL comes from the
infrastructure-layer builder; never hand-write the channel URL in a component.

```tsx
<a
    href={kakaoChannelUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center rounded-full bg-primary px-6 py-3
             text-primary-foreground break-keep transition-colors
             duration-200 hover:bg-primary/90 focus-visible:outline-none
             focus-visible:ring-2 focus-visible:ring-ring
             focus-visible:ring-offset-2"
>
    카카오톡으로 상담하기
</a>
```

**Secondary action.** `rounded-full bg-secondary px-6 py-3
text-secondary-foreground hover:bg-secondary/80`.

**Ghost icon button.** `rounded-full p-2 text-primary hover:bg-blush`.

**Treatment card.** `rounded-2xl border border-border bg-card p-6`. No hover
lift, no shadow transition — the catalogue is for reading, not for play.

**Variant disclosure (accordion).** Used for a treatment's per-area or
per-session price variants, not for a FAQ — there is no FAQ page in the spec.
`border-b border-border py-4 break-keep`.

Translucent surfaces (`bg-card/70`, `backdrop-blur-md`) are not used. They
cost paint performance on mid-range mobile, and the brand direction is clean
opacity, not glass.

---

## 9. Accessibility

Beyond what axe catches automatically:

- **Never** remove a focus outline without an explicit visible replacement.
  The project standard is
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Every `<iframe>` needs a Korean `title` and `loading="lazy"`. Size it with
  an aspect ratio, not a fixed height.
- Icon-only controls need `aria-label` or an `sr-only` span; the icon itself
  gets `aria-hidden="true"`.
- Headings descend without skipping levels. One `<h1>` per page.
- Landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) on every page.
- Link text stands alone out of context — `자세히` is not acceptable.

```tsx
<iframe
    src={mapEmbedUrl}
    title="의원 위치 지도"
    loading="lazy"
    className="aspect-[4/3] w-full rounded-2xl border-0 md:aspect-[16/9]"
/>
```

```tsx
<button type="button" aria-label="메뉴 열기" className="rounded-full p-2 ...">
    <MenuIcon aria-hidden="true" className="size-5" />
</button>
```

---

## 10. Motion

Restraint is the point. Calm is a medical-trust signal.

- No scroll-triggered reveals, no fade-and-slide-up on every section, no
  parallax, no 3D transforms, no bounce. Section-entrance animations are the
  clearest tell of a generated page.
- Motion that **answers a user action** — an accordion opening, a menu
  expanding — is welcome, because it shows what changed.
- Transitions: `duration-200` or `duration-300`, standard easing, and prefer
  `transition-colors` over `transition-all`.
- At most one orchestrated non-interactive moment on the entire site, if any.

`prefers-reduced-motion` is honoured globally:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## 11. Quick prohibitions

- `tailwind.config.js` — tokens live in `globals.css`
- `tailwindcss-animate` — deprecated, use `tw-animate-css` if needed at all
- A `.dark` block or theme toggle
- Raw hex, `bg-white`, `border-white/40`, or Tailwind default palette colors
- Arbitrary sizing values
- Prose or headings without `break-keep`
- `sizes` on `<Image>` (inert under `unoptimized`)
- `<Image>` or `<img>` without `width`/`height` or an aspect ratio
- `focus:outline-none` with no visible replacement
- `<iframe>` without `title` and `loading="lazy"`
- `backdrop-blur`, translucent card surfaces
- Bulk shadcn installs
- Hand-written KakaoTalk or map URLs inside components
