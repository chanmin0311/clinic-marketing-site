# Phase 0 Research: Aesthetic Dermatology Clinic Marketing Website

All Technical Context fields in [plan.md](./plan.md) resolved without an open
NEEDS CLARIFICATION — the one item still marked as such in spec.md's Key Entities
(KakaoTalk channel ID / staffing confirmation) is resolved for this build by the
demo posture: a fabricated placeholder channel ID is used (see "KakaoTalk channel
handoff" below), and the real client-supplied ID is a content-file edit at production
cutover, not a code or architecture change.

## 1. Next.js static export configuration

- **Decision**: `next.config.ts` sets `output: 'export'` and `images.unoptimized: true`.
  App Router only; every route is a Server Component rendered fully at build time. No
  `route.ts` handlers, no middleware, no `dynamic = 'force-dynamic'` anywhere in the
  tree — any of these would silently break static export or reintroduce a server
  runtime the constitution and the Azure SWA Static deployment model both reject.
- **Rationale**: Matches the explicit stakeholder rejection of the Hybrid/SSR SWA
  deployment model (still preview, no SWA CLI local emulation, partial
  `staticwebapp.config.json` support) and the spec's "crawlable without JS" /
  no-server-runtime requirements.
- **Alternatives considered**: Hybrid (SSR) SWA deployment — rejected per stated
  constraint. Plain `next start` on a VM/App Service — rejected, adds hosting
  complexity with no corresponding requirement (Principle XI).

## 2. Korean webfont strategy (Principle IX's largest named LCP risk)

- **Decision**: Self-host **Pretendard Variable** (OFL-licensed) via `next/font/local`.
  Subset to a Korean + Latin + punctuation charset using `pretendard`'s published
  subsetting tool (or `glyphhanger`/`fonttools subset` against the actual copy used on
  the four pages) rather than shipping the full multi-thousand-glyph font. Serve
  **woff2 only** (near-universal support for the target mobile browsers). Use a single
  variable-weight file rather than separate static weight files. `font-display: swap`.
  Preload only the body/heading variable font file referenced above the fold on each
  page; do not preload weights only used below the fold.
- **Rationale**: Full Korean webfonts routinely run 2–5 MB unsubset; the ≤120 KB/page
  budget in plan.md is only achievable by subsetting to the glyphs the site's actual
  Korean copy uses, which a build-time content-derived subset makes safe (any new
  glyph introduced by future content edits needs a subset regeneration step, documented
  in quickstart.md).
- **Alternatives considered**: Noto Sans KR (OFL, also viable, but larger default
  metrics and no variable-weight build as broadly adopted as Pretendard's) — kept as
  the documented fallback if Pretendard licensing/availability changes. Google Fonts
  CDN-hosted Noto Sans KR — rejected: adds a third-party network dependency at render
  time, works against the LCP budget and against self-hosting good practice for a
  performance-budgeted site.

## 3. KakaoTalk channel handoff (FR-001, FR-003, SC-002)

- **Decision**: Render the primary CTA as a plain anchor:
  `<a href="https://pf.kakao.com/_{channelId}/chat" target="_blank" rel="noopener noreferrer">`.
  This is Kakao's own public channel-chat URL format: on a mobile device with
  KakaoTalk installed it opens the chat directly in-app; on a device without the app,
  or on desktop, Kakao's own landing page provides the web-based fallback (add-channel
  / QR / app-install prompt) — satisfying FR-003 with zero custom JS. `channelId` comes
  from `infrastructure/content/site-config.ts` (a demo placeholder value per MOCK DATA
  in the brief).
- **Rationale**: No Kakao JavaScript SDK dependency is needed (explicitly rejected in
  the brief); the fallback behavior is Kakao's own product behavior, not something this
  codebase has to implement or maintain. A plain `<a>` with a stable `href` is also
  exactly what the spec's E2E note asks for — asserting `href`/`target`/`rel` rather
  than trying to follow an app handoff in a browser test.
- **Alternatives considered**: `kakaotalk://` custom scheme with a JS timeout-based
  web fallback — rejected: adds client JS for no behavior gain over Kakao's own URL,
  is harder to test (no longer a static href), and risks a visible failed-scheme flash
  on desktop.

## 4. Naver Map / Kakao Map directions links (FR-022, SC-003)

- **Decision**: Render both as plain anchors using each provider's own https
  "universal link" URL format (not a custom `nmap://`/`kakaomap://` scheme):
  - Kakao Map: `https://map.kakao.com/link/to/{name},{lat},{lng}`
  - Naver Map: `https://map.naver.com/p/directions/-/-/-/walk?c={lng},{lat},15,0,0,0,dh&destination={name}`
    (an https, no-API-key URL; exact query shape finalized in `infrastructure/maps/naver-directions-url.ts` against Naver's published web-map URL scheme)
  Both open the native app via OS-level Universal Links/App Links when installed, and
  degrade to the provider's mobile-web or desktop-web map otherwise — no JS required,
  same testability property as the Kakao channel link above.
- **Rationale**: Matches the resolved clarification (separate Naver/Kakao deep-link
  buttons alongside the Google Maps display embed) and keeps the CTA testable via
  static `href` assertion per the spec's own E2E guidance, with zero added dependency.
- **Alternatives considered**: Custom URL-scheme + JS-timeout fallback pattern (the
  common "try app scheme, redirect to web after N ms" trick) — rejected for the same
  reasons as the Kakao chat case: untestable without simulating real app installs,
  adds client JS to a page whose core content must work with none, and both providers'
  own https links already provide the desired native-app-first behavior.

## 5. Google Maps display embed (FR-021)

- **Decision**: Use the keyless "Share → Embed a map" iframe
  (`https://www.google.com/maps/embed?pb=...`), generated once for the clinic's demo
  placeholder coordinates and stored as a constant in
  `infrastructure/maps/google-embed.ts`. `loading="lazy"`, explicit `width`/`height` (or
  `aspect-ratio` via CSS) to avoid CLS, and a descriptive `title` attribute (e.g.,
  "클리닉 위치 지도" in production copy) for accessibility.
- **Rationale**: Avoids any Google Cloud billing/API-key dependency for the demo,
  consistent with the brief's explicit rejection of the Maps Embed API. Directly
  resolves the spec Assumption flagging Google Maps API billing ownership as
  unresolved — the keyless iframe makes that assumption moot for this build.
- **Alternatives considered**: Maps Embed API (JS, API-key-gated) — rejected per brief.
  Static map image (Static Maps API) — also API-key-gated; rejected for the same reason
  and because it loses the pan/zoom affordance a visitor planning a visit benefits from.

## 6. Opening-status domain logic

- **Decision**: `domain/clinic-hours/opening-status.ts` exports
  `getOpeningStatus(now: Date, hours: WeeklyHours): 'open' | 'lunch-break' | 'closed'`,
  a pure function over a `WeeklyHours` value (per-weekday open/close ranges, one
  optional lunch-break range, a set of named closed weekdays) and the current instant.
  All comparisons are done in `Asia/Seoul` wall-clock time regardless of visitor
  timezone (the clinic's hours are meaningless in any other timezone), using the
  platform `Intl`/`Temporal`-free approach of formatting `now` via
  `Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', ... })` to avoid adding a
  date library.
- **Rationale**: Keeps the logic pure/dependency-free (Principle III, XII) and unit
  testable without mocking the system clock's timezone. Satisfies the Edge Case
  requirement that closed/open status be legible without visitor date math.
- **Alternatives considered**: `date-fns-tz`/`luxon` — rejected; the single timezone
  conversion needed is well within what `Intl.DateTimeFormat` does natively, so a
  library would be an unjustified dependency under Principle XII.

## 7. Azure Static Web Apps configuration

- **Decision**: `staticwebapp.config.json` at repo root defines: `navigationFallback`
  pointing 404s at the statically generated `404.html` (from `app/not-found.tsx`) with
  `_next/*`/asset paths excluded so real static assets 404 correctly instead of being
  rewritten; a `globalHeaders` block setting `Content-Security-Policy` (allow-listing
  `frame-src` for the Google Maps embed host), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`; and `mimeTypes`/cache-control only
  if Next's own export output needs an override (verified during Phase 1 build, not
  assumed here). Route-level rewrites/redirects stay out of this file and live in
  `next.config.ts` where App Router already owns routing.
- **Rationale**: Matches the brief's explicit split (`staticwebapp.config.json` for
  404/headers/cache only, routing stays in `next.config`) and the stated reason the
  Static (not Hybrid) SWA deployment model was chosen — full `staticwebapp.config.json`
  support.
- **Alternatives considered**: none — this is prescribed directly in the brief.

## 8. Breakpoints and responsive verification (Principle VI)

- **Decision**: Tailwind's default breakpoints are the project's fixed set — `sm`
  (640px), `md` (768px), `lg` (1024px), `xl` (1280px) — with the constitution's
  required minimum of mobile/tablet/desktop verified at **375px** (common small-phone
  viewport), **768px** (tablet/`md`), and **1280px** (desktop/`xl`) before any UI task
  is marked done, per Principle VI and SC-007.
- **Rationale**: Using Tailwind's stock scale avoids inventing a bespoke breakpoint set
  with no corresponding design requirement (Principle XI); 375/768/1280 are the
  standard representative widths for phone/tablet/desktop testing.
- **Alternatives considered**: Custom clinic-brand-specific breakpoints — rejected,
  no requirement in the spec calls for anything Tailwind's defaults don't already
  cover.

## 9. Accessibility contrast verification

- **Decision**: The restrained light palette (background, ink/text, one muted accent)
  is fixed in `tailwind.config.ts` as named tokens and every text/background pairing
  used in components is checked against WCAG 2.1 AA (4.5:1 body text, 3:1 large
  text/UI) using the same `@axe-core/playwright` run already required for E2E, plus a
  one-time manual contrast check of the fixed palette during Phase 1 component build
  (not deferred to a separate tool/dependency).
- **Rationale**: Reuses the accessibility tooling already mandated by Principle V
  instead of adding a dedicated contrast-checking dependency.
- **Alternatives considered**: A standalone contrast-linting package — rejected as
  redundant with axe's own color-contrast rule.

## 10. Side-effect copy register (FR-017)

- **Decision**: For this demo build, side-effect copy per treatment is written in
  calm, factual, non-alarming Korean (e.g., "일시적인 붓기, 발적이 있을 수 있습니다")
  as fabricated placeholder text consistent with the MOCK DATA constraint — not
  claimed as final, client-approved medical-advertising copy. This matches spec.md's
  own Assumption that final wording is a client legal/의료광고 sign-off dependency
  prior to any real launch, which is unchanged and unaffected by this plan.
- **Rationale**: Unblocks implementation of the required UI structure (every
  treatment entry has a side-effect section, per FR-017) without the plan overstating
  legal sign-off that is explicitly out of a developer's authority to grant.
- **Alternatives considered**: Omitting side-effect copy until legal sign-off —
  rejected, FR-017 requires the section to exist and this is a demo, not the
  production launch the legal review gates.
