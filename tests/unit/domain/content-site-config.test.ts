import { describe, expect, it } from "vitest";
import { siteConfig } from "@/infrastructure/content/site-config";

describe("infrastructure/content/site-config", () => {
  it("has exactly 7 weekday entries", () => {
    expect(siteConfig.hours.weekday).toHaveLength(7);
  });

  it("has open < close for every non-closed day", () => {
    for (const day of siteConfig.hours.weekday) {
      if (day.closed) continue;
      expect(day.open < day.close).toBe(true);
    }
  });

  it("derives DayHours.closed from closedDays, not a separate source", () => {
    for (const day of siteConfig.hours.weekday) {
      expect(day.closed).toBe(siteConfig.hours.closedDays.includes(day.day));
    }
  });

  it("keeps any lunch break within every open day's range", () => {
    const { lunchBreak } = siteConfig.hours;
    if (lunchBreak === null) return;
    for (const day of siteConfig.hours.weekday) {
      if (day.closed) continue;
      expect(lunchBreak.start >= day.open).toBe(true);
      expect(lunchBreak.end <= day.close).toBe(true);
      expect(lunchBreak.start < lunchBreak.end).toBe(true);
    }
  });

  it("deliberately fails the real 사업자등록번호 checksum", () => {
    const digits =
      siteConfig.legalDisclosure.businessRegistrationNumber.replace(/-/g, "");
    expect(digits).toMatch(/^\d{10}$/);
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    const nums = digits.split("").map(Number);
    const base = nums
      .slice(0, 9)
      .reduce((sum, digit, i) => sum + digit * weights[i], 0);
    const carry = Math.floor((nums[8] * 5) / 10);
    const checkDigit = (10 - ((base + carry) % 10)) % 10;
    expect(checkDigit).not.toBe(nums[9]);
  });

  it("uses a non-routable placeholder phone number shared by location and legal disclosure", () => {
    expect(siteConfig.legalDisclosure.phone).toBe(siteConfig.location.phone);
    expect(siteConfig.legalDisclosure.phone).toMatch(/^02-000-\d{4}$/);
  });

  it("single-sources the address between location and legal disclosure", () => {
    expect(siteConfig.legalDisclosure.address).toBe(
      siteConfig.location.address,
    );
  });

  it("carries a visible Korean demo notice", () => {
    expect(siteConfig.legalDisclosure.demoNoticeText).toContain("데모");
  });
});
