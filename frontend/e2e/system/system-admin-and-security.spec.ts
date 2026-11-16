import { test, expect } from "@playwright/test";
import { createMockJwt, mockAuthSession } from "../helpers/mockAuth";
import { setupAdminDashboardMocks } from "../helpers/mockEmployerAndAdminData";

test.describe("System - Cổng Quản trị viên (Admin Dashboard) & Xuất báo cáo", () => {
  test("[Admin Portal] Hiển thị 4 KPI tổng quan, đổi kỳ biểu đồ, bảng giao dịch và xuất CSV", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupAdminDashboardMocks(page);

    await page.goto("/admin/dashboard");

    await expect(
      page.getByRole("heading", { name: "Xin chào, Quản trị viên hệ thống" }),
    ).toBeVisible();

    // 4 KPI Cards
    await expect(page.getByText("Tổng người dùng")).toBeVisible();
    await expect(page.getByText("Tin chờ kiểm duyệt")).toBeVisible();
    await expect(page.getByText("Tổng hồ sơ ứng tuyển")).toBeVisible();
    await expect(page.getByText("Doanh thu nền tảng", { exact: true })).toBeVisible();
    await expect(page.getByText("125.000.000 ₫").first()).toBeVisible();

    // Biểu đồ tăng trưởng & chuyển kỳ Theo quý -> Theo năm
    await expect(
      page.getByRole("heading", { name: "Tăng trưởng & Đăng ký người dùng" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Theo quý" }).click();
    await expect(page.getByText("890")).toBeVisible();
    await page.getByRole("button", { name: "Theo năm" }).click();
    await expect(page.getByText("1.540").first()).toBeVisible();

    // Giao dịch gần đây & Cơ cấu doanh thu
    await expect(
      page.getByRole("heading", { name: "Giao dịch gần đây" }),
    ).toBeVisible();
    await expect(page.getByText("VN-PAY-20261115")).toBeVisible();

    // Xuất báo cáo tháng (.csv)
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /Xuất báo cáo tháng/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^viecngon-bao-cao-.*\.csv$/);
    await expect(
      page.getByText("Đã xuất báo cáo tổng quan (CSV)!"),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});

test.describe("System - Bảo mật RBAC, Token hết hạn & Phục hồi lỗi", () => {
  test("[Security RBAC] Token hết hạn bị redirect login và chặn truy cập chéo giữa 3 vai trò", async ({
    page,
  }) => {
    // 1. Token đã hết hạn (exp trong quá khứ) truy cập /dashboard -> redirect /login
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" }),
    ).toString("base64url");
    const expiredPayload = Buffer.from(
      JSON.stringify({
        sub: "uv-expired",
        role: "UNGVIEN",
        exp: Math.floor(Date.now() / 1000) - 300,
      }),
    ).toString("base64url");
    await page.context().addCookies([
      {
        name: "access_token",
        value: `${header}.${expiredPayload}.sig`,
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fdashboard/);

    // 2. Role NHATUYENDUNG truy cập /admin/dashboard hoặc /dashboard -> redirect /employer-dashboard
    await page.context().clearCookies();
    await mockAuthSession(page, {
      id: "hr-rbac-1",
      name: "HR RBAC",
      email: "hr.rbac@viecngon.vn",
      role: "NHATUYENDUNG",
    });
    await page.route("http://localhost:3001/recruiter/profile", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          recruiterId: "rec-1",
          accountId: "hr-rbac-1",
          companyId: "comp-1",
          account: { email: "hr.rbac@viecngon.vn", userName: "HR RBAC", phoneNumber: null },
          company: { name: "ViecNgon Partner", legalName: null, slug: "partner", description: null, logo: null, website: null, address: null, city: null, industry: null, size: null },
          statistics: { totalJobs: 0, totalViews: 0, totalApplications: 0 },
          recentApplicants: [],
          jobs: { count: 0, list: [] },
        }),
      }),
    );
    await page.route("http://localhost:3001/recruiter/job/metrics", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          totalJobs: { count: 0, changeThisMonth: 0 },
          activeJobs: { count: 0 },
          pendingJobs: { count: 0, avgReviewTimeText: "~2h" },
          totalApplications: { count: 0, percentChangeThisWeek: 0 },
          averageResponseRate: 0,
        }),
      }),
    );

    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/employer-dashboard/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/employer-dashboard/);

    // 3. Role ADMIN vào /login -> tự động điều hướng về /admin/dashboard
    await page.context().clearCookies();
    await setupAdminDashboardMocks(page);
    await page.context().addCookies([
      {
        name: "access_token",
        value: createMockJwt("ADMIN"),
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/login");
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test("[Resilience] Trang Admin Dashboard hiển thị ErrorState khi API lỗi 500 và phục hồi khi bấm Thử lại", async ({
    page,
  }) => {
    await setupAdminDashboardMocks(page);

    let failMetrics = true;
    await page.unroute("http://localhost:3001/admin/dashboard/metrics");
    await page.route("http://localhost:3001/admin/dashboard/metrics", (route) => {
      if (failMetrics) {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Database temporarily unavailable" }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          totalUsers: { count: 99, candidatesCount: 80, employersCount: 19, growthPercent: 5 },
          pendingJobs: { count: 2, requiresImmediateReview: false },
          totalApplications: { count: 210, growthPercent: 8 },
          platformRevenue: { totalAmount: 15000000, formattedAmount: "15.000.000 ₫", growthPercent: 10 },
        }),
      });
    });

    await page.goto("/admin/dashboard");
    await expect(
      page.getByRole("heading", { name: "Không thể tải các chỉ số tổng quan" }),
    ).toBeVisible();

    failMetrics = false;
    await page.getByRole("button", { name: /Thử lại/i }).first().click();
    await expect(page.getByText("Tổng người dùng")).toBeVisible();
    await expect(page.getByText("15.000.000 ₫")).toBeVisible();
  });
});
