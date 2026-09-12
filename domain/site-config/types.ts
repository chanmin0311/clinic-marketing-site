// Plain TypeScript only — no react/next import (contexts/architecture.md §2).

import type { ClinicHoursProfile } from "@/domain/clinic-hours/types";

/**
 * Where the clinic can be reached. Lives alongside ClinicHoursProfile in
 * infrastructure/content/site-config.ts, both composed into SiteConfig.
 */
export interface ClinicLocationProfile {
  /** Non-routable placeholder address (MOCK DATA constraint). */
  readonly address: string;
  readonly buildingFloorSuite: string;
  readonly nearestSubway: {
    readonly station: string;
    readonly exit: number;
    readonly walkMinutes: number;
  };
  readonly parking: string;
  /** Non-routable placeholder number (MOCK DATA constraint). */
  readonly phone: string;
  /** Name string passed to the Naver/Kakao directions URL builders. */
  readonly directionsPlaceName: string;
  /** Fabricated placeholder coordinates — a real-looking pair, not the clinic. */
  readonly coordinates: { readonly lat: number; readonly lng: number };
}

export interface KakaoChannelReference {
  /** Demo placeholder Kakao public channel ID. */
  readonly channelId: string;
}

export interface LegalDisclosureProfile {
  /** Deliberately-invalid-checksum placeholder (MOCK DATA constraint). */
  readonly businessRegistrationNumber: string;
  readonly institutionName: string;
  readonly directorName: string;
  /** Same value as ClinicLocationProfile.address (single-sourced, not duplicated). */
  readonly address: string;
  /** Same value as ClinicLocationProfile.phone. */
  readonly phone: string;
  readonly privacyPolicyHref: string;
  /** Visible "이 사이트는 데모입니다" footer copy (MOCK DATA constraint). */
  readonly demoNoticeText: string;
}

/**
 * The single module every page/component imports for cross-cutting data —
 * satisfies FR-005 (single-sourced hours/address/phone) by construction.
 */
export interface SiteConfig {
  readonly hours: ClinicHoursProfile;
  readonly location: ClinicLocationProfile;
  readonly kakaoChannelReference: KakaoChannelReference;
  readonly legalDisclosure: LegalDisclosureProfile;
}
