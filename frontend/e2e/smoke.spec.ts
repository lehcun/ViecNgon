import { test, expect } from "@playwright/test";

test.describe("Smoke Tests - Các trang công khai chính", () => {
  test("Trang chủ (/) hiển thị không có lỗi runtime", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/ViecNgon/i);
    await expect(page.locator("body")).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("Trang tìm việc làm (/jobs) tải thành công thanh tìm kiếm và bộ lọc", async ({
    page,
  }) => {
    await page.route("**/company/featured-banners", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      }),
    );
    await page.route("**/jobs?*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          total: 0,
          page: 1,
          totalPages: 1,
          meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
        }),
      }),
    );

    await page.goto("/jobs");
    await expect(
      page.getByPlaceholder(/Nhập từ khóa theo kỹ năng, chức vụ, công ty/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Bộ lọc/i })).toBeVisible();
  });

  test("Trang bảng giá (/pricing) hiển thị cấu trúc gói dịch vụ", async ({
    page,
  }) => {
    await page.goto("/pricing");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
