# Contract: KakaoTalk Channel Adapter

`infrastructure/kakao/channel-url.ts` — implements the URL-building side of FR-001/
FR-003. See research.md §3 for the decision rationale (plain Kakao channel-chat URL,
no JS SDK).

```ts
/** Builds the Kakao channel chat URL for the CTA anchor's `href`.
 *  Input `channelId` comes only from SiteConfig.kakaoChannelReference — no component
 *  constructs this URL itself. */
export function buildKakaoChatUrl(channelId: string): string;
// buildKakaoChatUrl("_xdEmoK") -> "https://pf.kakao.com/_xdEmoK/chat"
```

## Rendering contract (enforced by Playwright, not by this function)

Every `PrimaryCtaBar` KakaoTalk anchor across all four pages MUST render as:

```html
<a
  href="{buildKakaoChatUrl(siteConfig.kakaoChannelReference.channelId)}"
  target="_blank"
  rel="noopener noreferrer"
>
  카카오톡 예약 상담
</a>
```

- `href` is the exact string `buildKakaoChatUrl` returns — no query params, no
  JS-attached click handler that mutates navigation (this is what makes the E2E
  assertion in `tests/e2e/kakao-cta.spec.ts` meaningful: it reads the static `href`
  attribute, since an actual KakaoTalk app handoff cannot be followed in a browser
  test, per the spec's own testing note).
- `target="_blank"` + `rel="noopener noreferrer"`: opens in a new context, does not
  leak a `window.opener` reference to the external origin.
- CTA copy frames the action as booking (예약), per the resolved clarification — not
  generic "contact us" wording.

## Failure mode ownership

Falling back gracefully when KakaoTalk isn't installed (FR-003) is owned entirely by
Kakao's own `pf.kakao.com` landing behavior (research.md §3) — this codebase's
responsibility ends at producing a correct, stable `href`. No client-side "is the app
installed" detection is implemented or required.
