import { test, expect } from "@playwright/test";
import type {
  AdminPackageItem,
  AdminTransactionItem,
} from "@viecngon/types";
import { mockAuthSession } from "./helpers/mockAuth";
import { setupAdminDashboardMocks } from "./helpers/mockEmployerAndAdminData";

async function setupAdminPackagesMockApi(
  page: import("@playwright/test").Page,
) {
  await setupAdminDashboardMocks(page);
  await mockAuthSession(page, {
    id: "admin-1",
    name: "Quản trị viên",
    email: "admin@viecngon.vn",
    role: "ADMIN",
  });

  const packages: AdminPackageItem[] = [
    {
      maGoi: "pkg-vip-1",
      tieuDe: "Gói VIP Đẩy Tin",
      loaiQuangCao: "VIP",
      gia: 2_500_000,
      thoiGianHieuLuc: 30,
      soLuotDangTin: 5,
      capDoUuTien: 3,
      loaiHuyHieu: "SUPER_HOT",
      moTaNgan: "Ưu tiên hiển thị đầu trang tìm việc",
      quyenLoi: ["Nhãn SUPER HOT", "Đẩy tin tự động"],
      trangThai: "HOATDONG",
      ngayTao: "2026-01-01T00:00:00.000Z",
      purchasesCount: 2,
      totalRevenue: 5_000_000,
    },
  ];

  const transactions: AdminTransactionItem[] = [
    {
      maThanhToan: "tx-pending-1",
      maGiaoDichDoiTac: "VN-PAY-20261123",
      ngayThanhToan: "2026-04-01T09:00:00.000Z",
      soTienThanhToan: 2_500_000,
      phuongThucTT: "Chuyển khoản ngân hàng",
      trangThaiTT: "CHO_THANH_TOAN",
      rawTrangThaiTT: "Chờ thanh toán",
      ghiChu: "Thanh toán Gói VIP Đẩy Tin",
      campaign: {
        maMua: "mua-1",
        tieuDe: "Chiến dịch Q2",
        trangThai: "Chờ thanh toán",
        soLuotConLai: 5,
        ngayBatDau: "2026-04-01T00:00:00.000Z",
        ngayKetThuc: "2026-05-01T00:00:00.000Z",
      },
      package: {
        maGoi: "pkg-vip-1",
        tieuDe: "Gói VIP Đẩy Tin",
        loaiHuyHieu: "SUPER_HOT",
      },
      company: {
        maCongTy: "cty-momo",
        tenCongTy: "MoMo",
        slug: "momo-m-service",
        logoUrl: null,
      },
      recruiter: {
        maTaiKhoan: "hr-1",
        tenNguoiDung: "Lê Hùng Cường",
        email: "hr@momo.vn",
      },
    },
  ];

  await page.route("http://localhost:3001/admin/packages*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (
      req.method() === "PATCH" &&
      pathname.match(/^\/admin\/packages\/transactions\/[^/]+\/confirm$/)
    ) {
      transactions[0].trangThaiTT = "THANH_CONG";
      transactions[0].campaign.trangThai = "Đang chạy";
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã xác nhận thanh toán thành công cho giao dịch ${transactions[0].maGiaoDichDoiTac}.`,
          transaction: transactions[0],
        }),
      });
    }

    if (req.method() === "GET" && pathname === "/admin/packages/transactions") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: transactions,
          pagination: {
            page: 1,
            limit: 12,
            total: transactions.length,
            totalPages: 1,
          },
          summary: {
            totalCount: transactions.length,
            successCount: transactions.filter(
              (t) => t.trangThaiTT === "THANH_CONG",
            ).length,
            pendingCount: transactions.filter(
              (t) => t.trangThaiTT === "CHO_THANH_TOAN",
            ).length,
            failedCount: 0,
            totalSuccessRevenue: transactions
              .filter((t) => t.trangThaiTT === "THANH_CONG")
              .reduce((s, t) => s + t.soTienThanhToan, 0),
          },
        }),
      });
    }

    if (req.method() === "POST" && pathname === "/admin/packages") {
      const body = JSON.parse(req.postData() || "{}") as {
        tieuDe: string;
        gia: number;
        soLuotDangTin: number;
        thoiGianHieuLuc: number;
        capDoUuTien: number;
      };
      const created: AdminPackageItem = {
        maGoi: `pkg-${Date.now()}`,
        tieuDe: body.tieuDe,
        loaiQuangCao: "Kim Cương",
        gia: body.gia,
        thoiGianHieuLuc: body.thoiGianHieuLuc,
        soLuotDangTin: body.soLuotDangTin,
        capDoUuTien: body.capDoUuTien,
        loaiHuyHieu: "DIAMOND",
        moTaNgan: null,
        quyenLoi: [],
        trangThai: "HOATDONG",
        ngayTao: new Date().toISOString(),
        purchasesCount: 0,
        totalRevenue: 0,
      };
      packages.push(created);
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã tạo gói dịch vụ "${created.tieuDe}".`,
          package: created,
        }),
      });
    }

    if (req.method() === "PATCH" && pathname.endsWith("/status")) {
      packages[0].trangThai =
        packages[0].trangThai === "HOATDONG" ? "DA_AN" : "HOATDONG";
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã ẩn gói "${packages[0].tieuDe}" khỏi trang bảng giá.`,
          package: packages[0],
        }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: packages,
        summary: {
          total: packages.length,
          active: packages.filter((p) => p.trangThai === "HOATDONG").length,
          hidden: packages.filter((p) => p.trangThai === "DA_AN").length,
        },
      }),
    });
  });
}

test.describe("Admin - Quản lý Gói dịch vụ & Giao dịch (/admin/packages)", () => {
  test("[Đơn giản] Tải trang /admin/packages, hiển thị danh sách gói và chuyển tab Giao dịch", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupAdminPackagesMockApi(page);
    await page.goto("/admin/packages");

    await expect(page.getByText("Gói VIP Đẩy Tin")).toBeVisible();
    await expect(page.getByText("2.500.000 ₫")).toBeVisible();

    await page.getByRole("button", { name: /Lịch sử giao dịch/i }).click();
    await expect(page.getByText("VN-PAY-20261123")).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Thêm gói dịch vụ mới và ẩn gói đang mở bán", async ({
    page,
  }) => {
    await setupAdminPackagesMockApi(page);
    await page.goto("/admin/packages");

    await page.getByRole("button", { name: "Thêm gói mới" }).click();
    const modal = page.getByRole("dialog", { name: "Thêm gói dịch vụ mới" });
    await modal.getByLabel(/Tên gói dịch vụ/).fill("Gói Kim Cương Enterprise");
    await modal.getByRole("button", { name: "Tạo gói dịch vụ" }).click();
    await expect(
      page.getByText('Đã tạo gói dịch vụ "Gói Kim Cương Enterprise".'),
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Ẩn gói Gói VIP Đẩy Tin" })
      .click();
    const hideModal = page.getByRole("dialog", { name: "Ẩn gói dịch vụ" });
    await expect(hideModal).toBeVisible();
    await hideModal.getByRole("button", { name: "Xác nhận ẩn gói" }).click();
    await expect(
      page.getByText('Đã ẩn gói "Gói VIP Đẩy Tin" khỏi trang bảng giá.'),
    ).toBeVisible();
  });

  test("[Phức tạp] Xem chi tiết giao dịch chờ thanh toán và xác nhận kích hoạt gói", async ({
    page,
  }) => {
    await setupAdminPackagesMockApi(page);
    await page.goto("/admin/packages");

    await page.getByRole("button", { name: /Lịch sử giao dịch/i }).click();
    await page
      .getByRole("button", { name: "Xem chi tiết VN-PAY-20261123" })
      .click();

    const drawer = page.getByRole("dialog", {
      name: "Chi tiết giao dịch thanh toán",
    });
    await expect(drawer).toBeVisible();
    await drawer
      .getByRole("button", { name: /Xác nhận đã thanh toán/i })
      .click();

    const confirmModal = page.getByRole("dialog", {
      name: "Xác nhận thanh toán giao dịch",
    });
    await expect(confirmModal).toBeVisible();
    await confirmModal
      .getByRole("button", { name: "Xác nhận thanh toán" })
      .click();

    await expect(
      page.getByText(
        "Đã xác nhận thanh toán thành công cho giao dịch VN-PAY-20261123.",
      ),
    ).toBeVisible();
  });
});
