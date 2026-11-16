import { test, expect } from "@playwright/test";
import {
  createMockNotifications,
  setupCandidateSessionWithBaseMocks,
} from "../helpers/mockCandidateData";

test.describe("Sprint 1 - Module Nhận thông báo (NTB)", () => {
  test("[GUI-NTB01..GUI-NTB05 & FUNC-NTB01, FUNC-NTB03, FUNC-NTB04] Hiển thị trang Thông báo và lọc theo tab Tất cả / Chưa đọc / Đã đọc", async ({
    page,
  }) => {
    const notifications = createMockNotifications();
    await setupCandidateSessionWithBaseMocks(page, { notifications });

    await page.goto("/notifications");

    // GUI-NTB01 & FUNC-NTB01
    await expect(
      page.getByRole("heading", { name: "Thông báo của bạn" }),
    ).toBeVisible();

    // GUI-NTB02: Tabs Tất cả, Chưa đọc, Đã đọc
    const allTab = page.getByRole("button", { name: /^Tất cả/i });
    const unreadTab = page.getByRole("button", { name: /Chưa đọc/i });
    const readTab = page.getByRole("button", { name: /Đã đọc 1/i });
    await expect(allTab).toBeVisible();
    await expect(unreadTab).toBeVisible();
    await expect(readTab).toBeVisible();

    // GUI-NTB03: Button Đã đọc tất cả
    await expect(
      page.getByRole("button", { name: /Đã đọc tất cả/i }),
    ).toBeEnabled();

    // GUI-NTB04 & GUI-NTB05: Thông báo chưa đọc & đã đọc hiển thị
    await expect(page.getByText("Thư mời phỏng vấn từ MoMo")).toBeVisible();
    await expect(
      page.getByText("Nhà tuyển dụng đã xem CV của bạn"),
    ).toBeVisible();
    await expect(page.getByText("Chào mừng đến với ViecNgon")).toBeVisible();

    // FUNC-NTB03: Lọc tab "Chưa đọc"
    await unreadTab.click();
    await expect(page.getByText("Thư mời phỏng vấn từ MoMo")).toBeVisible();
    await expect(page.getByText("Chào mừng đến với ViecNgon")).toBeHidden();

    // FUNC-NTB04: Lọc tab "Đã đọc"
    await page.getByRole("button", { name: /Đã đọc\s+1/i }).click();
    await expect(page.getByText("Chào mừng đến với ViecNgon")).toBeVisible();
    await expect(page.getByText("Thư mời phỏng vấn từ MoMo")).toBeHidden();
  });

  test("[FUNC-NTB05 & FUNC-NTB06] Đánh dấu đã đọc 1 thông báo và Đánh dấu đã đọc tất cả", async ({
    page,
  }) => {
    const notifications = createMockNotifications();
    await setupCandidateSessionWithBaseMocks(page, { notifications });

    await page.route("**/candidate/notifications/*/read", (route) => {
      const segments = new URL(route.request().url()).pathname.split("/");
      const notifId = segments[segments.length - 2];
      const target = notifications.find((n) => n.id === notifId);
      if (target) {
        target.status = "DA_DOC";
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route("**/candidate/notifications/read-all", (route) => {
      for (const n of notifications) {
        n.status = "DA_DOC";
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/notifications");

    // Ban đầu có 2 thông báo chưa đọc
    const unreadTab = page.getByRole("button", { name: /Chưa đọc/i });
    await expect(unreadTab).toContainText("2");

    // FUNC-NTB05: Nhấn vào 1 thông báo chưa đọc -> số chưa đọc giảm còn 1
    await page.getByText("Thư mời phỏng vấn từ MoMo").click();
    await expect(unreadTab).toContainText("1");

    // FUNC-NTB06: Nhấn nút "Đã đọc tất cả" -> số chưa đọc về 0 và hiện toast
    await page.getByRole("button", { name: /Đã đọc tất cả/i }).click();
    await expect(
      page.getByText("Đã đánh dấu tất cả thông báo là đã đọc!"),
    ).toBeVisible();
    await expect(unreadTab).toContainText("0");
  });

  test("[FUNC-NTB02] Nhận thông báo mới cập nhật số đếm trên chuông thông báo", async ({
    page,
  }) => {
    const notifications = createMockNotifications();
    await setupCandidateSessionWithBaseMocks(page, { notifications });

    await page.goto("/notifications");

    const bellBtn = page.getByRole("button", { name: "Thông báo" });
    await expect(bellBtn).toContainText("2");

    // Mô phỏng có thêm 1 thông báo mới từ Nhà tuyển dụng khi bấm mở chuông / refetch
    notifications.unshift({
      id: "noti-4",
      title: "FPT Software vừa gửi lời mời phỏng vấn",
      content: "Phỏng vấn vị trí Frontend Engineer lúc 14:00 ngày mai.",
      status: "CHUA_DOC",
      createdAt: new Date().toISOString(),
    });

    // Reload hoặc kích hoạt window focus refetch để cập nhật badge chuông
    await page.reload();
    await expect(bellBtn).toContainText("3");

    await bellBtn.click();
    await expect(
      page.getByText("FPT Software vừa gửi lời mời phỏng vấn").first(),
    ).toBeVisible();
  });
});
