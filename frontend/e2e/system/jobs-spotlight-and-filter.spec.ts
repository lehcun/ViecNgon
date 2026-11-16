import { test, expect } from "@playwright/test";

const MOCK_DIAMOND_COMPANIES = [
  {
    companyId: "comp-fpt",
    companyName: "FPT Software",
    slug: "fpt-software",
    logo: null,
    city: "Hà Nội",
    tagline: "Công ty phần mềm hàng đầu Việt Nam",
    bannerCoverUrl: null,
    bannerBadgeText: "TOP HIRING",
    activeJobsCount: 12,
    featuredJobs: [
      {
        id: "job-1",
        title: "Senior Java Backend Engineer",
        slug: "senior-java-backend-engineer",
      },
      {
        id: "job-2",
        title: "Middle .NET Core & Angular Developer",
        slug: "middle-dotnet-angular-developer",
      },
    ],
  },
  {
    companyId: "comp-vng",
    companyName: "VNG Corporation",
    slug: "vng-corporation",
    logo: null,
    city: "TP. Hồ Chí Minh",
    tagline: "Build Technologies and Grow People",
    bannerCoverUrl: null,
    bannerBadgeText: "DIAMOND PARTNER",
    activeJobsCount: 8,
    featuredJobs: [],
  },
];

const MOCK_JOBS = [
  {
    id: "job-101",
    slug: "senior-react-nextjs-engineer",
    title: "Senior React / Next.js Engineer",
    salaryDisplay: "40 - 60 triệu",
    level: "Senior",
    workModel: "Hybrid",
    location: "Hà Nội",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
    highlights: ["Lương tháng 13", "Bảo hiểm sức khỏe cao cấp"],
    badgeType: "SUPER_HOT",
    badgeText: "SUPER HOT",
    postedAt: new Date().toISOString(),
    company: {
      name: "FPT Software",
      slug: "fpt-software",
      logo: null,
    },
  },
  {
    id: "job-102",
    slug: "backend-nestjs-developer",
    title: "Backend NestJS Developer",
    salaryDisplay: "25 - 40 triệu",
    level: "Middle",
    workModel: "Remote",
    location: "Hồ Chí Minh",
    skills: ["NestJS", "Prisma", "SQL Server"],
    highlights: ["Làm việc từ xa 100%"],
    badgeType: "HOT",
    badgeText: "HOT",
    postedAt: new Date().toISOString(),
    company: {
      name: "VNG Corporation",
      slug: "vng-corporation",
      logo: null,
    },
  },
];

test.describe("Tìm kiếm việc làm, Banner Spotlight & Modal Bộ lọc", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/company/featured-banners", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_DIAMOND_COMPANIES),
      }),
    );

    await page.route("**/jobs?*", (route) => {
      const url = new URL(route.request().url());
      const level = url.searchParams.get("capBac");
      const filtered = level
        ? MOCK_JOBS.filter((j) => j.level === level)
        : MOCK_JOBS;

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: filtered,
          total: filtered.length,
          page: 1,
          totalPages: 1,
          meta: { total: filtered.length, page: 1, limit: 10, totalPages: 1 },
        }),
      });
    });
  });

  test("Đơn giản: Banner Nhà tuyển dụng nổi bật không dính thẻ HTML thô và xoay vòng khi F5", async ({
    page,
  }) => {
    await page.goto("/jobs");

    const spotlight = page.getByRole("region", {
      name: "Nhà tuyển dụng nổi bật",
    });
    await expect(spotlight).toBeVisible();
    await expect(spotlight.getByText("FPT Software")).toBeVisible();
    await expect(spotlight.getByText("<ul>")).toHaveCount(0);
    await expect(
      spotlight.getByText("Senior Java Backend Engineer"),
    ).toBeVisible();

    // F5 tải lại trang -> xoay vòng sang công ty gói Kim Cương thứ 2
    await page.reload();
    await expect(spotlight.getByText("VNG Corporation")).toBeVisible();
    await expect(spotlight.getByText("DIAMOND PARTNER")).toBeVisible();
  });

  test("Trung bình: Mở Modal Bộ lọc, chọn chip tiêu chí và áp dụng đồng bộ lên URL", async ({
    page,
  }) => {
    await page.goto("/jobs");

    // Mở Modal Bộ lọc
    await page.getByRole("button", { name: /Bộ lọc/i }).click();
    const dialog = page.getByRole("dialog", { name: "Bộ lọc" });
    await expect(dialog).toBeVisible();

    // Chọn Cấp bậc Senior & Hình thức Remote
    await dialog.getByRole("button", { name: /^Senior/i }).click();
    await dialog.getByRole("button", { name: /^Remote/i }).click();
    await dialog.getByRole("button", { name: "Áp dụng" }).click();

    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/capBac=Senior/);
    await expect(page).toHaveURL(/hinhThucLamViec=Remote/);
    await expect(page.getByText("Senior React / Next.js Engineer")).toBeVisible();
  });

  test("Phức tạp: Thẻ JobCard đã bỏ danh sách gạch đầu dòng phúc lợi ở đáy và chọn card hoạt động đúng", async ({
    page,
  }) => {
    await page.goto("/jobs");

    const firstCard = page
      .locator("article")
      .filter({ hasText: "Senior React / Next.js Engineer" });
    await expect(
      firstCard.getByRole("link", {
        name: "Senior React / Next.js Engineer",
      }),
    ).toBeVisible();

    // Xác minh không render danh sách highlights bullet ở dưới JobCard
    await expect(firstCard.getByText("Lương tháng 13")).toHaveCount(0);

    // Click chọn card thứ 2 và kiểm tra panel chi tiết bên phải cập nhật theo
    const secondCard = page
      .locator("article")
      .filter({ hasText: "Backend NestJS Developer" });
    await secondCard.click();

    await expect(
      page
        .getByRole("link", { name: "Backend NestJS Developer" })
        .nth(1),
    ).toBeVisible();
  });
});
