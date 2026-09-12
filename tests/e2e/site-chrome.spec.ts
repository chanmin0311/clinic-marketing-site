import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/treatments", "/practitioners", "/location"];

test.describe("shared chrome", () => {
  for (const route of ROUTES) {
    test(`${route} renders header nav and footer legal disclosure`, async ({
      page,
    }) => {
      await page.goto(route);

      const nav = page.getByRole("navigation", { name: "주요 메뉴" }).first();
      await expect(nav.getByRole("link", { name: "홈" })).toHaveAttribute(
        "href",
        "/",
      );
      await expect(
        nav.getByRole("link", { name: "시술 안내" }),
      ).toHaveAttribute("href", "/treatments");
      await expect(
        nav.getByRole("link", { name: "원장 소개" }),
      ).toHaveAttribute("href", "/practitioners");
      await expect(
        nav.getByRole("link", { name: "오시는 길" }),
      ).toHaveAttribute("href", "/location");

      const footer = page.locator("footer");
      await expect(footer).toContainText("데모");
      await expect(footer).toContainText("사업자등록번호");
      await expect(
        footer.getByRole("link", { name: "개인정보처리방침" }),
      ).toBeVisible();
    });
  }

  test("mobile menu opens via keyboard and exposes all four routes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "메뉴 열기" });
    await trigger.focus();
    await trigger.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "오시는 길" })).toBeVisible();
  });

  test("an unknown route renders the custom 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" }),
    ).toBeVisible();
  });

  test("home page has no automatically detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
