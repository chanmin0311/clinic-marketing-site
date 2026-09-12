// Plain TypeScript only — no react/next import (contexts/architecture.md §2).

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface DayHours {
  readonly day: Weekday;
  /** "HH:mm" */
  readonly open: string;
  /** "HH:mm" */
  readonly close: string;
  readonly closed: boolean;
}

/**
 * Single-sourced clinic hours model, consumed by both the Location page's
 * HoursTable and the OpeningStatusBadge shown site-wide.
 */
export interface ClinicHoursProfile {
  /** Length 7, Mon–Sun. */
  readonly weekday: readonly DayHours[];
  readonly lunchBreak: { readonly start: string; readonly end: string } | null;
  readonly closedDays: readonly Weekday[];
}
