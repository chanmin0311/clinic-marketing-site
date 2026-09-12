# Contract: Map Adapters

Three adapters under `infrastructure/maps/`, all consumed only by Location-page
components (`GoogleMapEmbed`, `DirectionsButtons`) — no other page constructs a map
URL. See research.md §4/§5 for rationale.

## `google-embed.ts` — display only (FR-021)

```ts
/** Returns the fixed keyless embed iframe `src` for the clinic's placeholder
 *  coordinates. Not parameterized per-call in this codebase (one clinic, one
 *  location) — kept as a function rather than a bare constant only so a future
 *  multi-location build can parameterize it without an API change. */
export function buildGoogleMapEmbedSrc(coords: { lat: number; lng: number }): string;
```

**Rendering contract**:

```html
<iframe
  src="{buildGoogleMapEmbedSrc(siteConfig.location.coordinates)}"
  title="클리닉 위치 지도"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  style="border:0"
  width="100%"
  height="{fixed px, matches the CSS aspect-ratio box to avoid CLS}"
/>
```

Display only — this iframe is never the target of a "get directions" interaction;
`DirectionsButtons` (below) owns that.

## `naver-directions-url.ts` / `kakao-directions-url.ts` — directions (FR-022)

```ts
export function buildNaverDirectionsUrl(place: {
  name: string;
  lat: number;
  lng: number;
}): string;

export function buildKakaoDirectionsUrl(place: {
  name: string;
  lat: number;
  lng: number;
}): string;
```

## Rendering contract (enforced by Playwright)

`DirectionsButtons` renders exactly two anchors:

```html
<a href="{buildNaverDirectionsUrl(place)}" target="_blank" rel="noopener noreferrer">네이버 지도로 길찾기</a>
<a href="{buildKakaoDirectionsUrl(place)}" target="_blank" rel="noopener noreferrer">카카오맵으로 길찾기</a>
```

Same testability pattern as the Kakao channel CTA: `tests/e2e/directions-cta.spec.ts`
asserts static `href`/`target`/`rel`, never attempts to follow the resulting app
handoff. Graceful desktop/no-app fallback (Edge Cases in spec.md) is owned by each
provider's own https universal-link behavior — no custom fallback logic is
implemented in this codebase, matching the Kakao channel adapter's failure-mode
ownership model.
