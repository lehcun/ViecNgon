import { test, expect } from "@playwright/test";
import { setupEmployerSessionWithBaseMocks } from "../helpers/mockEmployerAndAdminData";

test.describe("Sprint 2 - Dashboard NTD & Quản lý sử dụng gói dịch vụ (SDGDV)", () => {
  test("[Employer Dashboard] Hiển thị 4 thẻ thống kê, tin tuyển dụng gần đây và link tạo tin", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    await page.goto("/employer-dashboard");

    await expect(
      page.getByRole("heading", { name: /Xin chào, VNG Corporation/i }),
    ).toBeVisible();
    await expect(page.getByText("Tổng số tin đăng")).toBeVisible();
    await expect(page.getByText("Đang hiển thị")).toBeVisible();
    await expect(page.getByText("Chờ kiểm duyệt")).toBeVisible();
    await expect(page.getByText("Tổng hồ sơ ứng tuyển")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Senior Next.js Engineer", exact: true }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /Tạo tin tuyển dụng mới/i })
      .click();
    await expect(page).toHaveURL(/\/post-job$/, { timeout: 15000 });
  });

  test("[GUI-SDGDV01, FUNC-TTHT01 & FUNC-TTHT04] Điều hướng từ /campaigns sang /pricing (Mua thêm gói) và /post-job (Đăng tin)", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    await page.route("http://localhost:3001/campaigns/my-campaigns", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "camp-std-1",
            tieuDe: "Chiến dịch Tuyển dụng Q4",
            tenGoi: "Gói Tiêu Chuẩn / Standard",
            giaTaiThoiDiemMua: 1200000,
            ngayMua: "2026-11-01T00:00:00.000Z",
            ngayKetThuc: "2027-12-31T00:00:00.000Z",
            soLuotConLai: 5,
            trangThai: "DANG_CHAY",
            priorityLevel: 2,
            badgeType: "STANDARD",
          },
        ]),
      }),
    );
    await page.route("http://localhost:3001/campaigns/packages", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );

    await page.goto("/campaigns");

    await expect(
      page.getByRole("heading", { name: "Quản lý Gói dịch vụ & Chiến dịch" }),
    ).toBeVisible();
    await expect(page.getByText("Chiến dịch Tuyển dụng Q4")).toBeVisible();
    await expect(page.getByText("Đang chạy")).toBeVisible();

    // FUNC-TTHT04: Bấm Đăng tin -> sang /post-job
    await page.getByRole("link", { name: "Đăng tin", exact: true }).click();
    await expect(page).toHaveURL(/\/post-job$/, { timeout: 15000 });

    // FUNC-TTHT01: Từ /campaigns bấm Mua thêm gói -> sang /pricing
    await page.goto("/campaigns");
    await page.getByRole("link", { name: /Mua thêm gói/i }).click();
    await expect(page).toHaveURL(/\/pricing$/, { timeout: 15000 });
  });
});
