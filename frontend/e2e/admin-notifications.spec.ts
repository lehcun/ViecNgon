import { test, expect } from "@playwright/test";
import type { NotificationItemResponse } from "@viecngon/types";
import { mockAuthSession } from "./helpers/mockAuth";
import { setupAdminDashboardMocks } from "./helpers/mockEmployerAndAdminData";

async function setupAdminNotificationsMockApi(
  page: import("@playwright/test").Page,
) {
  await setupAdminDashboardMocks(page);
  await mockAuthSession(page, {
    id: "admin-1",
    name: "Quản trị viên",
    email: "admin@viecngon.vn",
    role: "ADMIN",
  });

  const notifications: NotificationItemResponse[] = [
    {
      id: "noti-1",
      title: "Nhà tuyển dụng mới chờ kích hoạt: MoMo",
      content: "Tài khoản hr@momo.vn vừa đăng ký và đang chờ kích hoạt.",
      status: "CHUA_DOC",
      createdAt: new Date().toISOString(),
    },
    {
      id: "noti-2",
      title: "Tin tuyển dụng mới chờ duyệt: Senior Next.js",
      content: "FPT Software vừa đăng tin tuyển dụng mới.",
      status: "CHUA_DOC",
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
    },
    {
      id: "noti-3",
      title: "Đơn mua gói dịch vụ mới: Gói VIP",
      content: "Doanh nghiệp vừa thanh toán gói VIP.",
      status: "DA_DOC",
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
    },
  ];

  await page.route("http://localhost:3001/notifications*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (req.method() === "GET" && pathname === "/notifications/unread-count") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          count: notifications.filter((n) => n.status === "CHUA_DOC").length,
        }),
      });
    }

    if (req.method() === "PATCH" && pathname === "/notifications/read-all") {
      notifications.forEach((n) => {
        n.status = "DA_DOC";
      });
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Đã đánh dấu tất cả", updatedCount: 2 }),
      });
    }

    const readMatch = pathname.match(/^\/notifications\/([^/]+)\/read$/);
    if (req.method() === "PATCH" && readMatch) {
      const target = notifications.find((n) => n.id === readMatch[1]);
      if (target) target.status = "DA_DOC";
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Đã đánh dấu đã đọc",
          id: readMatch[1],
          status: "DA_DOC",
        }),
      });
    }

    if (req.method() === "DELETE" && pathname === "/notifications/read") {
      const before = notifications.length;
      for (let i = notifications.length - 1; i >= 0; i--) {
        if (notifications[i].status === "DA_DOC") notifications.splice(i, 1);
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã dọn ${before - notifications.length} thông báo đã đọc.`,
          deletedCount: before - notifications.length,
        }),
      });
    }

    const filter = url.searchParams.get("filter") || "ALL";
    const filtered = notifications.filter((n) => {
      if (filter === "UNREAD") return n.status === "CHUA_DOC";
      if (filter === "READ") return n.status === "DA_DOC";
      return true;
    });

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: filtered,
        total: filtered.length,
        allCount: notifications.length,
        unreadCount: notifications.filter((n) => n.status === "CHUA_DOC").length,
        readCount: notifications.filter((n) => n.status === "DA_DOC").length,
        page: 1,
        limit: 15,
        totalPages: 1,
      }),
    });
  });
}

test.describe("Admin - Hệ thống Thông báo Quản trị viên", () => {
  test("[Đơn giản] AdminHeader hiển thị badge chưa đọc và mở Dropdown thông báo", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupAdminNotificationsMockApi(page);
    await page.goto("/admin/dashboard");

    const bellBtn = page.getByRole("button", { name: "Thông báo quản trị" });
    await expect(bellBtn).toBeVisible();
    await expect(bellBtn.getByText("2")).toBeVisible();

    await bellBtn.click();
    await expect(
      page.getByText("Nhà tuyển dụng mới chờ kích hoạt: MoMo"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Xem toàn bộ thông báo" }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Trang /admin/notifications lọc Chưa đọc và đánh dấu tất cả đã đọc", async ({
    page,
  }) => {
    await setupAdminNotificationsMockApi(page);
    await page.goto("/admin/notifications");

    await expect(
      page.getByText("Nhà tuyển dụng mới chờ kích hoạt: MoMo"),
    ).toBeVisible();

    await page.getByRole("button", { name: /Chưa đọc/ }).click();
    await expect(
      page.getByText("Đơn mua gói dịch vụ mới: Gói VIP"),
    ).toBeHidden();

    await page.getByRole("button", { name: "Đã đọc tất cả" }).click();
    await expect(
      page.getByText("Đã đánh dấu tất cả thông báo là đã đọc."),
    ).toBeVisible();
  });

  test("[Phức tạp] Dọn sạch các thông báo đã đọc trên /admin/notifications", async ({
    page,
  }) => {
    await setupAdminNotificationsMockApi(page);
    await page.goto("/admin/notifications");

    await page.getByRole("button", { name: "Xóa đã đọc" }).click();
    const confirmModal = page.getByRole("dialog", {
      name: "Xóa tất cả thông báo đã đọc",
    });
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole("button", { name: "Xác nhận xóa" }).click();
    await expect(
      page.getByText("Đã dọn 1 thông báo đã đọc."),
    ).toBeVisible();
    await expect(
      page.getByText("Đơn mua gói dịch vụ mới: Gói VIP"),
    ).toBeHidden();
  });
});
