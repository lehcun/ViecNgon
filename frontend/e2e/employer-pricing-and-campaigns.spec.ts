import { test, expect } from "@playwright/test";
import { mockAuthSession } from "./helpers/mockAuth";

const EMPLOYER_USER = {
  id: "hr-fpt-1",
  name: "FPT Talent Acquisition",
  email: "talent@fpt.vn",
  role: "NHATUYENDUNG" as const,
};

const MOCK_PACKAGES = [
  {
    maGoi: "pkg-basic",
    tieuDe: "Gói Cơ Bản / Basic",
    loaiQuangCao: "STANDARD",
    gia: 0,
    thoiGianHieuLuc: 15,
    soLuotDangTin: 2,
    priorityLevel: 1,
    badgeType: "BASIC",
    description: "Phù hợp doanh nghiệp khởi đầu tuyển dụng IT.",
    features: ["Đăng 2 tin tuyển dụng tiêu chuẩn", "Hiển thị 15 ngày"],
  },
  {
    maGoi: "pkg-standard",
    tieuDe: "Gói Tiêu Chuẩn / Standard",
    loaiQuangCao: "FEATURED",
    gia: 1200000,
    thoiGianHieuLuc: 30,
    soLuotDangTin: 5,
    priorityLevel: 2,
    isPopular: true,
    badgeType: "STANDARD",
    badgeText: "Phổ biến nhất",
    description: "Tăng độ phủ tin tuyển dụng trên trang tìm việc.",
    features: ["Đăng 5 tin tuyển dụng", "Gắn nhãn Nổi bật"],
  },
  {
    maGoi: "pkg-vip",
    tieuDe: "Gói VIP Đẩy Tin / Pro",
    loaiQuangCao: "VIP_BOOST",
    gia: 2900000,
    thoiGianHieuLuc: 30,
    soLuotDangTin: 12,
    priorityLevel: 3,
    badgeType: "VIP",
    badgeText: "VIP Đẩy Tin",
    description: "Ưu tiên top đầu kết quả tìm kiếm việc làm IT.",
    features: ["12 tin tuyển dụng VIP", "Đẩy top tự động hàng tuần"],
  },
  {
    maGoi: "pkg-diamond",
    tieuDe: "Gói Kim Cương / Diamond",
    loaiQuangCao: "DIAMOND_SPOTLIGHT",
    gia: 5900000,
    thoiGianHieuLuc: 45,
    soLuotDangTin: 25,
    priorityLevel: 4,
    badgeType: "DIAMOND",
    badgeText: "Doanh nghiệp",
    description: "Độc quyền Banner Nhà tuyển dụng nổi bật tại đầu trang /jobs.",
    features: [
      "25 tin tuyển dụng ưu tiên cao nhất",
      "Tùy chỉnh Banner Spotlight & Job nổi bật",
    ],
  },
];

const MOCK_CAMPAIGNS = [
  {
    id: "camp-diamond-1",
    tieuDe: "Chiến dịch Kim Cương Q4",
    tenGoi: "Gói Kim Cương / Diamond",
    giaTaiThoiDiemMua: 5900000,
    ngayMua: "2026-11-01T00:00:00.000Z",
    ngayKetThuc: "2027-12-31T00:00:00.000Z",
    soLuotConLai: 18,
    trangThai: "DANG_CHAY",
    priorityLevel: 4,
    badgeType: "DIAMOND",
  },
  {
    id: "camp-old-1",
    tieuDe: "Chiến dịch Cơ Bản Q3",
    tenGoi: "Gói Cơ Bản / Basic",
    giaTaiThoiDiemMua: 0,
    ngayMua: "2026-08-01T00:00:00.000Z",
    ngayKetThuc: "2026-08-16T00:00:00.000Z",
    soLuotConLai: 0,
    trangThai: "DA_KET_THUC",
    priorityLevel: 1,
    badgeType: "BASIC",
  },
];

const INITIAL_BANNER_CONFIG = {
  companyId: "comp-fpt",
  companyName: "FPT Software",
  companyLogoUrl: null,
  hasDiamondAccess: true,
  bannerCoverUrl: "",
  bannerCity: "Hà Nội",
  defaultCity: "Hà Nội",
  bannerTagline: "Cùng kiến tạo nền tảng số toàn cầu",
  defaultTagline: "Công ty phần mềm hàng đầu Việt Nam",
  bannerBadgeText: "TOP HIRING",
  activeJobsCount: 4,
  selectedJobIds: ["job-1", "job-2"],
  availableJobs: [
    { id: "job-1", title: "Senior Java Spring Boot Engineer", city: "Hà Nội" },
    { id: "job-2", title: "Middle Next.js / TypeScript Dev", city: "TP.HCM" },
    { id: "job-3", title: "QA Automation Engineer", city: "Đà Nẵng" },
  ],
};

test.describe("Nhà tuyển dụng: Bảng giá 4 cấp, Chiến dịch & Banner Diamond", () => {
  test("[Đơn giản] Trang /pricing hiển thị đủ 4 gói dịch vụ tuyển dụng", async ({
    page,
  }) => {
    await mockAuthSession(page, EMPLOYER_USER);
    await page.route("**/campaigns/packages", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_PACKAGES),
      }),
    );

    await page.goto("/pricing");

    await expect(
      page.getByRole("heading", { name: "Gói Cơ Bản / Basic" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gói Tiêu Chuẩn / Standard" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gói VIP Đẩy Tin / Pro" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gói Kim Cương / Diamond" }),
    ).toBeVisible();
    await expect(page.getByText("Phổ biến nhất").first()).toBeVisible();
    await expect(page.getByText("Miễn phí")).toBeVisible();
  });

  test("[Trung bình] Mua gói Kim Cương từ /pricing và chuyển sang /campaigns xem số liệu", async ({
    page,
  }) => {
    await mockAuthSession(page, EMPLOYER_USER);
    await page.route("**/campaigns/packages", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_PACKAGES),
      }),
    );
    await page.route("**/campaigns/my-campaigns", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CAMPAIGNS),
      }),
    );

    let purchasedPackageId: string | null = null;
    await page.route("**/campaigns/purchase", async (route) => {
      const payload = route.request().postDataJSON() as { maGoi?: string };
      purchasedPackageId = payload.maGoi ?? null;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/pricing");
    await page.getByRole("button", { name: "Chọn Gói Kim Cương" }).click();

    await expect.poll(() => purchasedPackageId).toBe("pkg-diamond");
    await expect(page).toHaveURL(/\/campaigns/);
    await expect(
      page.getByRole("heading", {
        name: "Quản lý Gói dịch vụ & Chiến dịch",
      }),
    ).toBeVisible();
    await expect(page.getByText("Chiến dịch Kim Cương Q4")).toBeVisible();
  });

  test("[Phức tạp] Mở modal Tùy chỉnh Banner gói Diamond, chỉnh thông tin + chọn 0→5 job và lưu PATCH", async ({
    page,
  }) => {
    await mockAuthSession(page, EMPLOYER_USER);
    await page.route("**/campaigns/my-campaigns", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CAMPAIGNS),
      }),
    );

    let bannerState = { ...INITIAL_BANNER_CONFIG };
    await page.route("**/recruiter/spotlight-banner", async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(bannerState),
        });
      }
      if (method === "PATCH") {
        const body = route.request().postDataJSON() as {
          bannerCity?: string | null;
          bannerBadgeText?: string | null;
          bannerTagline?: string | null;
          selectedJobIds?: string[];
        };
        bannerState = {
          ...bannerState,
          bannerCity: body.bannerCity ?? "",
          bannerBadgeText: body.bannerBadgeText ?? "",
          bannerTagline: body.bannerTagline ?? "",
          selectedJobIds: body.selectedJobIds ?? [],
        };
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(bannerState),
        });
      }
      return route.continue();
    });

    await page.goto("/campaigns");

    const diamondRow = page.locator("tr", { hasText: "Chiến dịch Kim Cương Q4" });
    await expect(
      diamondRow.getByRole("button", { name: /Tùy chỉnh Banner/i }),
    ).toBeVisible();

    const endedRow = page.locator("tr", { hasText: "Chiến dịch Cơ Bản Q3" });
    await expect(
      endedRow.getByRole("button", { name: /Tùy chỉnh Banner/i }),
    ).toHaveCount(0);

    await diamondRow.getByRole("button", { name: /Tùy chỉnh Banner/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", {
        name: "Tùy chỉnh Banner Nhà Tuyển Dụng Nổi Bật",
      }),
    ).toBeVisible();

    // Chỉnh Thành phố, Nhãn nổi bật, Slogan và xem cập nhật ở Live Preview
    await dialog.locator("#banner-city-input").fill("Đà Nẵng");
    await dialog.locator("#banner-badge-input").fill("HOT TECH");
    await dialog
      .locator("#banner-tagline-input")
      .fill("Tuyển kỹ sư Cloud & AI lương hấp dẫn tại Đà Nẵng");

    await expect(dialog.getByText("HOT TECH")).toBeVisible();
    await expect(
      dialog.locator("p", {
        hasText: "Tuyển kỹ sư Cloud & AI lương hấp dẫn tại Đà Nẵng",
      }),
    ).toBeVisible();

    // Tương tác chọn 0 -> 5 việc làm
    await expect(dialog.getByText("Đã chọn: 2/5")).toBeVisible();
    await dialog.getByRole("button", { name: "Bỏ chọn hết (0 tin)" }).click();
    await expect(dialog.getByText("Đã chọn: 0/5")).toBeVisible();

    await dialog
      .getByRole("button", { name: /QA Automation Engineer/i })
      .click();
    await expect(dialog.getByText("Đã chọn: 1/5")).toBeVisible();

    await dialog.getByRole("button", { name: "Lưu cấu hình Banner" }).click();

    await expect
      .poll(() => bannerState.bannerCity)
      .toBe("Đà Nẵng");
    expect(bannerState.bannerBadgeText).toBe("HOT TECH");
    expect(bannerState.selectedJobIds).toEqual(["job-3"]);
  });
});
