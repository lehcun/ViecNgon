import { test, expect } from "@playwright/test";
import type { RecommendedJobItem } from "@viecngon/types";
import { mockAuthSession } from "./helpers/mockAuth";

function createMockRecommendedJobs(count: number): RecommendedJobItem[] {
  return Array.from({ length: count }).map((_, idx) => ({
    id: `rec-job-${idx + 1}`,
    title: `Senior Fullstack Engineer #${idx + 1} (Next.js / NestJS)`,
    slug: `senior-fullstack-engineer-${idx + 1}`,
    salaryDisplay: "25 - 45 triệu VNĐ",
    location: idx % 2 === 0 ? "TP. Hồ Chí Minh" : "Đà Nẵng",
    workModel: idx % 2 === 0 ? "Hybrid" : "Remote",
    level: "Senior",
    postedAt: new Date(Date.now() - (idx + 1) * 86_400_000).toISOString(),
    skills: ["ReactJS", "Next.js", "NestJS", "TypeScript", "SQL Server"],
    promotionBadge: idx === 0 ? "SUPER_HOT" : idx === 1 ? "HOT" : null,
    priorityLevel: idx === 0 ? 3 : 1,
    company: {
      id: `cty-${idx + 1}`,
      name: idx === 0 ? "MoMo" : `TechCorp #${idx + 1}`,
      logo: null,
      slug: `company-${idx + 1}`,
    },
  }));
}

test.describe("Homepage - Gợi ý việc làm phù hợp cho Ứng viên", () => {
  test("[Đơn giản] Ẩn hoàn toàn section gợi ý khi là khách vãng lai hoặc Nhà tuyển dụng/Admin", async ({
    page,
  }) => {
    await page.route("http://localhost:3001/auth/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ message: "Unauthorized" }) }),
    );
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Việc làm IT "Ngon" dành cho/ }),
    ).toBeHidden();

    // Đăng nhập vai trò ADMIN -> cũng phải ẩn
    await mockAuthSession(page, {
      id: "admin-1",
      name: "Admin",
      email: "admin@viecngon.vn",
      role: "ADMIN",
    });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Việc làm IT "Ngon" dành cho/ }),
    ).toBeHidden();
  });

  test("[Trung bình] Hiển thị 8 thẻ đầu cho Ứng viên và mở rộng lên 12 thẻ khi bấm Xem thêm", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await mockAuthSession(page, {
      id: "uv-1",
      name: "Lê Hùng Cường",
      email: "cuong@viecngon.vn",
      role: "UNGVIEN",
    });

    const items = createMockRecommendedJobs(12);
    await page.route("http://localhost:3001/jobs/recommended*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candidateName: "Lê Hùng Cường",
          totalMatched: 12,
          needsProfileSetup: false,
          items,
        }),
      }),
    );

    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: '12 Việc làm IT "Ngon" dành cho Lê Hùng Cường',
      }),
    ).toBeVisible();

    // Ban đầu hiện 8 thẻ, thẻ #9 ẩn
    await expect(
      page.getByText("Senior Fullstack Engineer #1 (Next.js / NestJS)"),
    ).toBeVisible();
    await expect(
      page.getByText("Senior Fullstack Engineer #9 (Next.js / NestJS)"),
    ).toBeHidden();

    // Bấm Xem thêm 4 công việc khác -> hiện thẻ #9..#12
    await page
      .getByRole("button", { name: "Xem thêm 4 công việc khác" })
      .click();
    await expect(
      page.getByText("Senior Fullstack Engineer #12 (Next.js / NestJS)"),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("[Phức tạp] Hiển thị gợi ý cập nhật hồ sơ khi ứng viên chưa có kỹ năng (Cold-Start)", async ({
    page,
  }) => {
    await mockAuthSession(page, {
      id: "uv-new",
      name: "Ứng viên Mới",
      email: "new@viecngon.vn",
      role: "UNGVIEN",
    });

    await page.route("http://localhost:3001/jobs/recommended*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candidateName: "Ứng viên Mới",
          totalMatched: 4,
          needsProfileSetup: true,
          items: createMockRecommendedJobs(4),
        }),
      }),
    );

    await page.goto("/");

    await expect(page.getByRole("link", { name: "Hồ sơ ứng viên" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Xem tất cả việc làm IT" }),
    ).toBeVisible();
  });
});
