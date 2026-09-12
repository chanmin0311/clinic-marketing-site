// Plain TypeScript only — no react/next import (contexts/architecture.md §2).

/**
 * Concern/category grouping key. Closed union so Treatments-page grouping
 * (FR-015) can never silently produce an "unsorted" bucket.
 */
export type TreatmentCategory =
  | "skin-texture"
  | "pigmentation"
  | "lifting-firming"
  | "body-contouring"
  | "hair-removal";

/**
 * One priced/duration configuration of a Treatment, distinguished by body
 * area, session count, or both.
 */
export interface PriceVariant {
  readonly id: string;
  readonly label: string;
  /** Integer KRW, VAT-inclusive (부가세 포함). Never a pre-VAT figure. */
  readonly priceKrw: number;
  readonly durationMinutes: number;
}

/**
 * A single procedure offered by the clinic, presented under a generic
 * descriptive name — never a brand/device name (FR-009).
 */
export interface Treatment {
  readonly id: string;
  readonly name: string;
  readonly category: TreatmentCategory;
  readonly effect: string;
  /** Calm/factual register (FR-017). Required — never omitted by euphemism. */
  readonly sideEffects: string;
  /** Non-empty — a single-variant treatment is this array with length 1. */
  readonly variants: readonly [PriceVariant, ...PriceVariant[]];
  readonly featured: boolean;
  readonly displayOrder: number;
}
