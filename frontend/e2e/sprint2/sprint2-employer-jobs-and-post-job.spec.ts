import { test, expect } from "@playwright/test";
import {
  createMockEmployerJobs,
  setupEmployerSessionWithBaseMocks,
} from "../helpers/mockEmployerAndAdminData";

test.describe("Sprint 2 - Module Quản lí bài đăng tuyển dụng (TTD)", () => {
  test("[GUI-TTD01..GUI-TTD06 & FUNC-TTD01..FUNC-TTD07] Kiểm tra giao diện tạo tin, validation và đăng tin tuyển dụng thành công", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    let createdJobPayload: Record<string, unknown> | null = null;
    await page.route("http://localhost:3001/job", async (route) => {
      if (route.request().method() === "POST") {
        createdJobPayload = route.request().postDataJSON() as Record<
          string,
          unknown
        >;
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "job-new-1",
            tenCongViec: createdJobPayload.tenCongViec,
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/post-job");

    // GUI-TTD01..06: Kiểm tra đủ các thành phần chính trên form Tạo tin tuyển dụng
    const backLink = page.getByRole("link", { name: /Quay lại Dashboard/i });
    const titleInput = page.locator('input[name="tenCongViec"]');
    const levelSelect = page.locator('select[name="capBac"]');
    const jobTypeSelect = page.locator('select[name="loaiHinh"]');
    const workModelSelect = page.locator('select[name="hinhThucLamViec"]');
    const branchSelect = page.locator('select[name="maChiNhanh"]');
    const cityInput = page.locator('input[name="thanhPho"]');
    const expSelect = page.locator('select[name="yeuCauKinhNghiem"]');
    const deadlineInput = page.locator('input[name="ngayHetHan"]');
    const submitBtn = page.getByRole("button", { name: /Xác nhận đăng tin/i });

    await expect(backLink).toBeVisible();
    await expect(titleInput).toBeVisible();
    await expect(levelSelect).toBeVisible();
    await expect(jobTypeSelect).toBeVisible();
    await expect(workModelSelect).toBeVisible();
    await expect(branchSelect).toBeVisible();
    await expect(cityInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await expect(page.getByText("Next.js", { exact: true })).toBeVisible();

    // FUNC-TTD01: Để trống các trường bắt buộc -> hiển thị lỗi inline validation và không gọi API
    await submitBtn.click();
    await expect(
      page.getByText("Vui lòng nhập tiêu đề công việc."),
    ).toBeVisible();
    await expect(titleInput).toHaveAttribute("aria-invalid", "true");
    expect(createdJobPayload).toBeNull();

    // FUNC-TTD02..07: Điền đầy đủ dropdown, thành phố, kinh nghiệm, hạn nộp
    await titleInput.fill("Senior Next.js & TypeScript Engineer");
    await levelSelect.selectOption("Senior");
    await jobTypeSelect.selectOption("Fulltime");
    await workModelSelect.selectOption("Hybrid");
    await branchSelect.selectOption("br-hcm-1");
    await expSelect.selectOption("3");
    await cityInput.fill("TP.HCM");
    await deadlineInput.fill("2027-01-30");
    await page.locator('input[name="mucLuongToiThieu"]').fill("30000000");
    await page.locator('input[name="mucLuongToiDa"]').fill("45000000");

    // Chưa chọn kỹ năng chuyên môn & chưa nhập mô tả -> báo lỗi validation
    await submitBtn.click();
    await expect(
      page
        .getByText(
          "Vui lòng kiểm tra lại các trường thông tin bị thiếu hoặc chưa hợp lệ.",
        )
        .first(),
    ).toBeVisible();
    expect(createdJobPayload).toBeNull();

    // Chọn nhiều kỹ năng chuyên môn & điền Mô tả / Yêu cầu / Quyền lợi
    await page.getByText("Next.js", { exact: true }).click();
    await page.getByText("TypeScript", { exact: true }).click();
    const editors = page.locator('[contenteditable="true"]');
    await editors
      .nth(0)
      .fill("Xây dựng và tối ưu hệ thống Frontend Next.js & TypeScript.");
    await editors
      .nth(1)
      .fill("Tối thiểu 3 năm kinh nghiệm React, Next.js và TypeScript.");
    await editors
      .nth(2)
      .fill("Lương tháng 13, bảo hiểm sức khỏe cao cấp, MacBook Pro.");
    await submitBtn.click();

    await expect
      .poll(() => createdJobPayload)
      .toMatchObject({
        tenCongViec: "Senior Next.js & TypeScript Engineer",
        capBac: "Senior",
        loaiHinh: "Fulltime",
        hinhThucLamViec: "Hybrid",
        maChiNhanh: "br-hcm-1",
        thanhPho: "TP.HCM",
        yeuCauKinhNghiem: 3,
        kyNangs: ["skill-nextjs", "skill-ts"],
      });
    await expect(page.getByText("Đăng tin tuyển dụng thành công!")).toBeVisible();
    await expect(page).toHaveURL(/\/employer-dashboard$/, { timeout: 15000 });
  });

  test("[Employer Jobs] Quản lý danh sách tin đăng: lọc trạng thái, tìm kiếm, ẩn tin, gia hạn và xóa tin", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    let jobs = createMockEmployerJobs();

    await page.route("http://localhost:3001/employer/jobs?*", (route) => {
      const url = new URL(route.request().url());
      const status = url.searchParams.get("status") || "ALL";
      const search = (url.searchParams.get("search") || "").toLowerCase();

      const filtered = jobs.filter((job) => {
        if (status !== "ALL" && job.status !== status) return false;
        if (
          search &&
          !job.title.toLowerCase().includes(search) &&
          !(job.city || "").toLowerCase().includes(search)
        ) {
          return false;
        }
        return true;
      });

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: filtered,
          meta: {
            total: filtered.length,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
          countsByStatus: {
            ALL: jobs.length,
            DA_DUYET: jobs.filter((j) => j.status === "DA_DUYET").length,
            CHO_DUYET: jobs.filter((j) => j.status === "CHO_DUYET").length,
            TU_CHUOI: 0,
            NHAP: 0,
            HET_HAN: jobs.filter((j) => j.status === "HET_HAN").length,
            DA_AN: jobs.filter((j) => j.status === "DA_AN").length,
          },
        }),
      });
    });

    await page.route(
      "http://localhost:3001/employer/jobs/*/toggle-visibility",
      (route) => {
        jobs = jobs.map((j) =>
          j.id === "job-em-1" ? { ...j, status: "DA_AN" } : j,
        );
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
      },
    );

    await page.route("http://localhost:3001/employer/jobs/*/repost", (route) => {
      jobs = jobs.map((j) =>
        j.id === "job-em-3"
          ? { ...j, status: "DA_DUYET", isExpired: false }
          : j,
      );
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.route("http://localhost:3001/employer/jobs/*", (route) => {
      if (route.request().method() === "DELETE") {
        jobs = jobs.filter((j) => j.id !== "job-em-2");
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
      }
      return route.fallback();
    });

    await page.goto("/employer-jobs");

    await expect(
      page.getByRole("heading", { name: "Quản lý bài đăng tuyển dụng" }),
    ).toBeVisible();
    await expect(page.getByText("Senior Next.js Engineer")).toBeVisible();
    await expect(page.getByText("Backend NestJS Developer")).toBeVisible();

    // Lọc theo tab "Chờ duyệt"
    await page.getByRole("button", { name: /Chờ duyệt/i }).click();
    await expect(page).toHaveURL(/status=CHO_DUYET/);
    await expect(page.getByText("Backend NestJS Developer")).toBeVisible();
    await expect(page.getByText("Senior Next.js Engineer")).toHaveCount(0);

    // Quay về tab Tất cả và đăng lại tin hết hạn
    await page.getByRole("button", { name: /^Tất cả/i }).click();
    await page.getByRole("button", { name: "Đăng lại" }).first().click();
    await expect(
      page.getByRole("heading", { name: /Đăng lại \/ Gia hạn tin tuyển dụng/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Xác nhận đăng lại" }).click();
    await expect(
      page.getByText("Đăng lại và gia hạn tin tuyển dụng thành công!"),
    ).toBeVisible();

    // Tạm dừng hiển thị tin đầu tiên
    await page.locator('button[title="Tạm dừng hiển thị"]').first().click();
    await expect(
      page.getByText("Đã cập nhật trạng thái hiển thị của tin!"),
    ).toBeVisible();

    // Tìm kiếm từ khóa không tồn tại -> EmptyState
    const searchBox = page.getByPlaceholder(
      /Tìm theo tiêu đề tin, vị trí, thành phố/i,
    );
    await searchBox.fill("KhongTonTaiXYZ");
    await searchBox.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy tin tuyển dụng nào" }),
    ).toBeVisible();
  });
});
