import type {
  ClinicHoursProfile,
  DayHours,
  Weekday,
} from "@/domain/clinic-hours/types";
import type { SiteConfig } from "@/domain/site-config/types";

// MOCK DATA — every value below is fabricated for this portfolio demo and
// does not correspond to a real clinic, person, address, or phone number
// (contexts/project.md §5).

const WEEKDAY_ORDER: readonly Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

const closedDays: readonly Weekday[] = ["sun"];

// data-model.md's single-source-of-truth decision: DayHours.closed is
// computed from closedDays here, never hand-authored twice.
const weekday: readonly DayHours[] = WEEKDAY_ORDER.map((day) => ({
  day,
  open: "10:00",
  close: "19:00",
  closed: closedDays.includes(day),
}));

const hours: ClinicHoursProfile = {
  weekday,
  lunchBreak: { start: "13:00", end: "14:00" },
  closedDays,
};

const address =
  "서울특별시 강남구 가상로 123-45 (포트폴리오 데모용 가상 주소 · 실제 위치가 아닙니다)";
const phone = "02-000-0000";

export const siteConfig: SiteConfig = {
  hours,
  location: {
    address,
    buildingFloorSuite: "가상빌딩 5층 501호",
    nearestSubway: { station: "강남역", exit: 3, walkMinutes: 5 },
    parking:
      "건물 내 주차 2대 가능 · 만차 시 인근 공영 주차장 이용 안내(데모 문구)",
    phone,
    directionsPlaceName: "봄빛 피부과의원(데모)",
    coordinates: { lat: 37.4979, lng: 127.0276 },
  },
  kakaoChannelReference: {
    channelId: "_xdEmoK",
  },
  legalDisclosure: {
    // Deliberately invalid checksum — cannot be mistaken for a real 사업자등록번호.
    businessRegistrationNumber: "000-00-00001",
    institutionName: "봄빛 피부과의원",
    directorName: "김데모",
    address,
    phone,
    privacyPolicyHref: "/#privacy-policy",
    demoNoticeText:
      "이 사이트는 데모입니다. 실제 병원이 아닌 포트폴리오 목적의 가상 콘텐츠이며, 표시된 정보는 모두 가상입니다.",
  },
};
