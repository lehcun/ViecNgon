import { test, expect } from "@playwright/test";

const MOCK_TOP_COMPANIES = [
  {
    id: "comp-fpt",
    slug: "fpt-software",
    name: "FPT Software",
    logo: null,
    location: "Hà Nội",
    jobs: 12,
  },
  {
    id: "comp-vng",
    slug: "vng-corporation",
    name: "VNG Corporation",
    logo: null,
    location: "TP. Hồ Chí Minh",
    jobs: 8,
  },
  {
    id: "comp-momo",
    slug: "momo",
    name: "MoMo",
    logo: null,
    location: "TP. Hồ Chí Minh",
    jobs: 5,
  },
  {
    id: "comp-viettel",
    slug: "viettel-solutions",
    name: "Viettel Solutions",
    logo: null,
    location: "Đà Nẵng",
    jobs: 9,
  },
];

async function mockEmptyJobsRoute(page: import("@playwright/test").Page) {
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
}

test.describe("Trang chủ & Điều hướng tìm việc IT", () => {
  test("[Đơn giản] Trang chủ hiển thị Hero, QuickLinks và Top nhà tuyển dụng", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.route("**/company/top", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_TOP_COMPANIES),
      }),
    );

    await page.goto("/");

    await expect(
      page.getByPlaceholder(/Tìm theo kỹ năng \(ReactJS, Java\.\.\.\)/i),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Tất cả việc làm IT/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nhà tuyển dụng hàng đầu" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "FPT Software" }),
    ).toBeVisible();
    await expect(page.getByText("12 việc làm")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "VNG Corporation" }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Chọn thành phố, nhập từ khóa hoặc bấm tag kỹ năng điều hướng đúng URL /jobs", async ({
    page,
  }) => {
    await page.route("**/company/top", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_TOP_COMPANIES),
      }),
    );
    await mockEmptyJobsRoute(page);

    await page.goto("/");

    // Click tag phổ biến ReactJS
    await page.getByRole("button", { name: "ReactJS", exact: true }).click();
    await expect(page).toHaveURL(/\/jobs\?keyword=ReactJS/);

    // Quay lại trang chủ test tìm kiếm theo Thành phố + Từ khóa
    await page.goto("/");
    await page.getByLabel("Chọn thành phố").selectOption("Hà Nội");
    await page
      .getByPlaceholder(/Tìm theo kỹ năng \(ReactJS, Java\.\.\.\)/i)
      .fill("NestJS");
    await page.getByRole("button", { name: "Tìm kiếm" }).click();

    await expect(page).toHaveURL(/\/jobs\?/);
    const currentUrl = new URL(page.url());
    expect(currentUrl.searchParams.get("keyword")).toBe("NestJS");
    expect(currentUrl.searchParams.get("thanhPho")).toBe("Hà Nội");
  });

  test("[Phức tạp] Hiển thị EmptyState và phục hồi từ ErrorState khi bấm Thử lại", async ({
    page,
  }) => {
    // 1. Trạng thái rỗng
    await page.route("**/company/top", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      }),
    );

    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Chưa có công ty nổi bật" }),
    ).toBeVisible();

    // 2. Trạng thái lỗi sau đó nhấn Thử lại -> thành công
    await page.unroute("**/company/top");
    let shouldFail = true;
    await page.route("**/company/top", (route) => {
      if (shouldFail) {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Server Error" }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_TOP_COMPANIES.slice(0, 2)),
      });
    });

    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Không thể tải danh sách công ty" }),
    ).toBeVisible({ timeout: 12000 });

    shouldFail = false;
    await page.getByRole("button", { name: /Thử lại/i }).click();
    await expect(
      page.getByRole("heading", { name: "FPT Software" }),
    ).toBeVisible();
  });
});
