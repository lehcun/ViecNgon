import { test, expect } from "@playwright/test";
import {
  createMockAiAnalysis,
  createMockEmployerApplicationDetail,
  createMockEmployerApplications,
  setupEmployerSessionWithBaseMocks,
} from "../helpers/mockEmployerAndAdminData";

test.describe("Sprint 2 - Module Sàng lọc ứng viên (SLUV)", () => {
  test("[FUNC-SLUV01..04, GUI-SLUV02..03] Tìm kiếm, lọc trạng thái, xem link CV PDF và đổi trạng thái hồ sơ", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    let apps = createMockEmployerApplications();
    let updatedStatusPayload: Record<string, unknown> | null = null;

    await page.route("http://localhost:3001/applications/employer", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(apps),
      }),
    );

    await page.route(
      "http://localhost:3001/applications/employer/*/status",
      async (route) => {
        updatedStatusPayload = route.request().postDataJSON() as Record<
          string,
          unknown
        >;
        apps = apps.map((item) =>
          item.applicationId === "app-em-1"
            ? { ...item, status: String(updatedStatusPayload?.status || "DANG_XEM_XET") }
            : item,
        );
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
      },
    );

    await page.goto("/applications");

    // GUI-SLUV: Quay lại Tổng quan, tìm kiếm, dropdown trạng thái, AI badge
    await expect(
      page.getByRole("link", { name: /Quay lại Tổng quan/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Hồ sơ ứng viên đã nộp/i }),
    ).toBeVisible();
    await expect(page.getByText("AI 88%")).toBeVisible();
    await expect(page.getByRole("link", { name: "Xem CV PDF" }).first()).toHaveAttribute(
      "href",
      "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
    );

    // FUNC-SLUV01: Tìm kiếm theo tên ứng viên
    const searchInput = page.getByPlaceholder(
      /Tìm theo tên ứng viên, email hoặc vị trí tuyển dụng/i,
    );
    await searchInput.fill("Nguyễn Quang Ý");
    await expect(page.getByText("Nguyễn Quang Ý")).toBeVisible();
    await expect(page.getByText("Lê Hoàng Nam")).toHaveCount(0);
    await searchInput.fill("");

    // FUNC-SLUV03: Lọc theo trạng thái "Phỏng vấn"
    const statusFilter = page.getByLabel("Lọc theo trạng thái hồ sơ");
    await statusFilter.selectOption("PHONG_VAN");
    await expect(page.getByText("Lê Hoàng Nam")).toBeVisible();
    await expect(page.getByText("Nguyễn Quang Ý")).toHaveCount(0);

    // FUNC-SLUV04: Lọc theo trạng thái "Chưa phù hợp" (BI_LOAI)
    await statusFilter.selectOption("BI_LOAI");
    await expect(page.getByText("Phạm Minh Đức")).toBeVisible();
    await expect(page.getByText("Lê Hoàng Nam")).toHaveCount(0);

    // Đổi về Tất cả và cập nhật trạng thái inline của ứng viên đầu tiên
    await statusFilter.selectOption("ALL");
    await page
      .getByLabel("Cập nhật trạng thái hồ sơ của Nguyễn Quang Ý")
      .selectOption("DANG_XEM_XET");
    await expect
      .poll(() => updatedStatusPayload)
      .toMatchObject({ status: "DANG_XEM_XET" });
    await expect(
      page.getByText("Đã cập nhật trạng thái ứng viên!"),
    ).toBeVisible();
  });
});

test.describe("Sprint 2 - Module Lên lịch phỏng vấn (LLPV)", () => {
  test("[GUI-LLPV01..06 & FUNC-SLUV01..05] Chi tiết ứng viên, AI Screening và Lên lịch phỏng vấn Google Meet", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    const detail = createMockEmployerApplicationDetail();
    const aiResult = createMockAiAnalysis();
    let schedulePayload: Record<string, unknown> | null = null;
    let rescanCalled = false;

    await page.route(
      "http://localhost:3001/applications/employer/app-em-1",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(detail),
        }),
    );

    await page.route(
      "http://localhost:3001/employer/applications/app-em-1/ai-analysis*",
      (route) => {
        if (route.request().url().includes("refresh=true")) {
          rescanCalled = true;
        }
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(aiResult),
        });
      },
    );

    await page.route(
      "http://localhost:3001/applications/employer/app-em-1/schedule",
      async (route) => {
        schedulePayload = route.request().postDataJSON() as Record<
          string,
          unknown
        >;
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
      },
    );

    await page.goto("/applications/app-em-1");

    await expect(
      page.getByRole("heading", { name: "Nguyễn Quang Ý" }),
    ).toBeVisible();
    await expect(page.getByText("88%").first()).toBeVisible();

    // Quét lại AI
    const rescanBtn = page.getByRole("button", { name: /Quét lại AI|Phân tích lại/i });
    if (await rescanBtn.count()) {
      await rescanBtn.first().click();
      await expect.poll(() => rescanCalled).toBe(true);
    }

    // Mở Modal Lên lịch phỏng vấn
    await page.getByRole("button", { name: /Mời phỏng vấn/i }).click();
    await expect(
      page.getByRole("heading", { name: "Lên lịch phỏng vấn" }),
    ).toBeVisible();

    // GUI-LLPV01..05: Kiểm tra các thành phần trên modal
    const submitBtn = page.getByRole("button", { name: /Xác nhận tạo lịch/i });
    const cancelBtn = page.getByRole("button", { name: "Hủy bỏ" });
    const dateInput = page.locator('input[type="date"]');
    const timeInput = page.locator('input[type="time"]');
    const meetToggle = page.locator('input[type="checkbox"]');

    await expect(submitBtn).toBeVisible();
    await expect(cancelBtn).toBeVisible();
    await expect(dateInput).toBeVisible();
    await expect(timeInput).toBeVisible();
    await expect(meetToggle).toBeChecked();

    // FUNC-SLUV01/04/05: Bỏ trống Ngày & Thời gian bị chặn bởi HTML5 required
    await submitBtn.click();
    const isDateMissing = await dateInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing,
    );
    expect(isDateMissing).toBe(true);
    expect(schedulePayload).toBeNull();

    // Chỉ nhập ngày, bỏ trống giờ -> vẫn bị chặn
    await dateInput.fill("2026-11-25");
    await submitBtn.click();
    const isTimeMissing = await timeInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing,
    );
    expect(isTimeMissing).toBe(true);
    expect(schedulePayload).toBeNull();

    // FUNC-SLUV02 & FUNC-SLUV03: Điền ngày giờ và tạo lịch phỏng vấn kèm Google Meet
    await timeInput.fill("09:30");
    await submitBtn.click();

    await expect
      .poll(() => schedulePayload)
      .toMatchObject({
        tieuDe: "Phỏng vấn vị trí Senior Next.js Engineer",
        taoGoogleMeet: true,
      });
    await expect(
      page.getByText("Đã lên lịch phỏng vấn và tạo Google Meet thành công!"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Lên lịch phỏng vấn" }),
    ).toBeHidden();
  });
});
