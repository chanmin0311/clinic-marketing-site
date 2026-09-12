// Plain TypeScript only — no react/next import (contexts/architecture.md §2).

/** A person who performs treatments at the clinic. */
export interface Practitioner {
  readonly id: string;
  /** Fabricated placeholder name for the demo (MOCK DATA constraint). */
  readonly name: string;
  /** Abstract/silhouette placeholder — never a real person's photograph. */
  readonly portraitSrc: string;
  /** Non-realistic-format only — no real medical licence/registration numbers. */
  readonly credentials: readonly string[];
  readonly specialty: string;
  /** Medical society memberships, fabricated placeholders. */
  readonly memberships: readonly string[];
  readonly statement: string;
}
