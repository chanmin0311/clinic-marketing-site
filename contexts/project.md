# Project Context

Read this first, in every session, before any other context file.

Scope: what this project actually is, who it is for, what the content may and
may not say, and how fabricated data and sourced assets must behave.

This file is **subordinate to** `.specify/memory/constitution.md`.

Not covered here:

- Folder layout, layer rules, type shapes → `contexts/architecture.md`
- Tokens, typography, component policy → `contexts/frontend.md`
- Test policy → `contexts/testing.md`

---

## 1. What this is — read this carefully

**This is a self-directed portfolio piece, not a client engagement.**

There is no clinic. There is no client. Nobody commissioned this, nobody is
paying for it, and nobody will review the content for accuracy. The subject —
an aesthetic dermatology clinic in Gangnam, Seoul — is a realistic brief
chosen to demonstrate capability to prospective clients.

Every consequence below follows from that sentence:

- All content, imagery, pricing, hours, and people are **fabricated**. There
  is no source of truth to check against, so plausibility is the only bar —
  and plausibility must never tip into impersonating a real business.
- There is no client to ask when something is ambiguous. Unresolved questions
  are handled per §7 — not by guessing, and not by stalling.
- **There is no production cutover.** The demo posture in §5 is permanent, not
  a phase.

The constitution is written in the voice of a client engagement ("the spec is
the contract between developer and client"). That framing is aspirational
here. The principles still bind — practising them is part of what this piece
demonstrates — but no clause should be read as implying an actual client
relationship exists.

---

## 2. Two audiences

|               | Who                                                                                             | What they need                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Real**      | A prospective client — a clinic owner or marketer evaluating whether to hire the developer      | Evidence of judgement: that the site is fast, accessible, legally aware, maintainable |
| **Simulated** | Korean-speaking visitors, 20–40, Seoul metro, mobile-first, comparison-shopping between clinics | The site must convincingly serve this persona, because that is the demonstration      |

Design and build for the simulated audience. But where a decision trades off
between "looks impressive in a screenshot" and "is defensibly correct," choose
correct — the real audience is evaluating judgement, and the correct choice is
the thing being sold.

---

## 3. Pages

Four routes. There is no fifth.

| Route            | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `/`              | Brand statement, featured treatments, director intro, location summary |
| `/treatments`    | Full catalogue: name, price, duration, effect, side effects            |
| `/practitioners` | Who performs the treatments and why they are qualified                 |
| `/location`      | Address, map, transit, parking, hours                                  |

**There is no reviews page.** It was cut because 의료법 제56조 restricts
patient treatment-experience testimonials in medical advertising. Do not add
one, do not add a testimonials section to the home page, and do not add review
quotes or star ratings anywhere. If a design calls for social proof, raise it
— do not solve it.

The absence is deliberate and is itself part of what the piece demonstrates.

There is no FAQ, blog, contact form, booking system, before/after gallery, or
language switcher.

---

## 4. Tone

- Copy is understated and factual, not promotional. No urgency banners, no
  countdown offers, no superlatives.
- Brand character: clean, calm, minimal — hygienic without reading cold.
  Visual realisation is in `contexts/frontend.md`.
- All content in Korean. `<html lang="ko">`.
- CTA wording is **"예약" (booking)**, per the spec clarification of
  2026-09-11. The CTA tells the visitor they are booking an appointment
  through the KakaoTalk channel. The site itself takes no bookings — it hands
  off — so the copy promises the handoff, not an on-site reservation flow.
  Do not soften this to "상담"; the wording is a recorded decision.

---

## 5. Fabricated data rules

Recorded in the spec as FR-025 (permanent `noindex`), FR-026 (visible demo
notice), and FR-027 (nothing corresponding to a real entity). This section is
the working detail behind them.

Content must read as plausible without being mistakable for a real business or
a real person. These rules matter _more_ here than on a real engagement: a
convincing clinic site with no clinic behind it is the one thing in this
project that could actually cause harm.

**Never generate:**

- The name of an actual clinic, hospital, or practising doctor. Invent a name
  and confirm it does not match a real Gangnam practice.
- Medical licence numbers, business registration numbers (사업자등록번호), or
  any other regulated identifier — not even a "clearly fake" one. Formats
  collide with real records.
- A real street address or building name. Use a plausible district-level
  location without a specific real address.
- A phone number in a routable range.
- Any claim that could be read as a real medical promise, even in fabricated
  copy.

**Always:**

- A visible, unambiguous demo notice in the footer, in Korean, stating this is
  a portfolio demonstration and not a real clinic.
- `noindex` and a disallow-all `robots.txt`, **permanently**. A fabricated
  clinic must never appear in search results. Structured data (schema.org
  `MedicalClinic`) is out for the same reason — it exists to tell a search
  engine, machine-readably, that this business is real.
- The repository README says the same thing. A prospective client will see the
  repo as often as the site.

Principle X (SEO foundations) is satisfied here as **demonstrated technique,
not live behaviour**: semantic structure, correct heading hierarchy, unique
titles and descriptions, and statically rendered crawlable content are all
built correctly, then deliberately gated behind `noindex`. Say so in the
README, so the choice reads as a decision rather than an omission.

---

## 6. Assets and licensing

No commissioned photography exists. Everything is sourced.

**Images.** CC0 / public-domain-equivalent sources only (Unsplash, Pexels,
Pixabay, Wikimedia PD). Two limits these licences do **not** cover:

- They grant the photographer's copyright, not the subject's likeness rights.
  There is no model release. **Never use a photograph of an identifiable
  person as a practitioner** — presenting a stranger's face as a doctor at a
  fabricated clinic implies an endorsement nobody gave.
- Nor is there a property release. Avoid photographs of identifiable real
  clinic or shop interiors; those belong to an actual business.

Use instead: interiors without people, materials and textures, cropped detail
shots (hands, skincare objects) without faces, and abstract or silhouette
placeholders in practitioner slots. The constraint reinforces the minimal
brand direction rather than fighting it.

**Fonts.** OFL-licensed only, self-hosted and subset. See
`contexts/frontend.md` §6.

**Icons.** Lucide (ISC), which ships with shadcn/ui.

**Record provenance.** Keep `public/images/CREDITS.md` listing every asset,
its source URL, and its licence. Most of these licences do not require
attribution, but a prospective client asking "can I use these?" deserves an
answer — and the answer is "no, they are demo placeholders; here is exactly
what they are."

---

## 7. Questions with no client to answer them

Several spec items were left open pending client input. There is no client, so
they resolve as **documented demo defaults**:

| Question                  | Demo default                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| Final side-effect wording | Neutral, generic placeholder copy. Structure is demonstrated; content is not clinically meaningful. |
| Footer legal disclosures  | Layout and slots built, filled with `[고객 정보]` placeholders.                                     |
| Analytics                 | None. Nothing to measure on a noindex demo.                                                         |
| Performance budget        | Core Web Vitals "Good" thresholds, verified at build.                                               |

**Do not silently fill these.** Each gets a placeholder that is visibly a
placeholder, and each is listed in the README under "questions I would ask a
real client before building this."

That list is an asset, not an admission. It shows a prospective client that
the developer knows 의료법 제45조 (비급여 진료비용 고지), 제56조 (의료광고
제한), and 의료광고 사전심의 exist, and would raise them before writing a line
of code. Most competing portfolio pieces in this category do not.

Nothing in this repository is legal advice, and none of it substitutes for a
real client obtaining a real legal review.

---

## 8. Content constraints

Self-imposed, to keep the demo defensible and to demonstrate domain awareness.
Not style preferences — do not relax them to make copy read better.

**No trademarks.** Device and product brand names must not appear anywhere —
content, navigation, URLs, titles, metadata, image filenames, alt text. Every
treatment uses a generic descriptive name.

**Prices are VAT-inclusive** (부가세 포함) and the display makes that basis
explicit.

**Prices are indicative.** Every displayed price carries a statement that the
final price may change after consultation. In the catalogue, a treatment with
several variants shows its **lowest** variant price with a "부터" prefix; full
variants are revealed on the treatment's own disclosure.

**Side effects are in scope.** Each treatment presents side-effect information
in a calm, factual register. Reducing substance to make it less alarming is
not acceptable — the requirement is neutral _tone_, not less information.

---

## 9. Single sources of truth

Never hard-code these in a component or duplicate them across pages:

| Fact                                                       | Lives in                    |
| ---------------------------------------------------------- | --------------------------- |
| Address, phone, hours, KakaoTalk channel ID, map embed URL | site config module          |
| Treatments, variants, prices, durations, side effects      | treatment content modules   |
| Practitioner profiles                                      | practitioner content module |

Exact paths are in `contexts/architecture.md`.

---

## 10. Korean domain vocabulary

Fix these mappings so naming does not drift.

| Korean    | Identifier     | Notes                                         |
| --------- | -------------- | --------------------------------------------- |
| 시술      | `treatment`    | Never `procedure` or `service`                |
| 시술 옵션 | `variant`      | A treatment has one or more                   |
| 부위      | `area`         | Body area a variant applies to                |
| 회차      | `sessions`     | Session count for a variant                   |
| 효과      | `effect`       | What concern it addresses                     |
| 부작용    | `sideEffects`  | Array of strings                              |
| 원장      | `director`     | The lead practitioner                         |
| 진료 시간 | `openingHours` |                                               |
| 휴진      | `closedDays`   |                                               |
| 예약      | `booking`      | The KakaoTalk CTA action. Not `consultation`. |
