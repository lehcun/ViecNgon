import { test, expect } from "@playwright/test";
import type {
  AdminUserDetailResponse,
  AdminUserListItem,
  AdminUserRole,
  AdminUserStatus,
} from "@viecngon/types";
import { mockAuthSession } from "./helpers/mockAuth";
import { setupAdminDashboardMocks } from "./helpers/mockEmployerAndAdminData";

function createInitialUsers(): AdminUserListItem[] {
  return [
    {
      maTaiKhoan: "admin-self-1",
      email: "admin@viecngon.vn",
      tenNguoiDung: "Quản trị viên Chính",
      sdt: "0900000001",
      provider: "LOCAL",
      vaiTro: "ADMIN",
      trangThai: "HOATDONG",
      ngayTao: "2026-01-01T08:00:00.000Z",
      ngayCapNhat: "2026-01-01T08:00:00.000Z",
      avatarUrl: null,
      companyName: null,
      companySlug: null,
    },
    {
      maTaiKhoan: "uv-active-1",
      email: "an.nguyen@viecngon.vn",
      tenNguoiDung: "Nguyễn Văn An",
      sdt: "0901234567",
      provider: "GOOGLE",
      vaiTro: "UNGVIEN",
      trangThai: "HOATDONG",
      ngayTao: "2026-02-10T09:00:00.000Z",
      ngayCapNhat: "2026-02-10T09:00:00.000Z",
      avatarUrl: null,
      companyName: null,
      companySlug: null,
    },
    {
      maTaiKhoan: "hr-unactivated-1",
      email: "hr@techcorp.vn",
      tenNguoiDung: "Trần Thị HR",
      sdt: "0909876543",
      provider: "LOCAL",
      vaiTro: "NHATUYENDUNG",
      trangThai: "CHUAKICHHOAT",
      ngayTao: "2026-03-15T10:30:00.000Z",
      ngayCapNhat: "2026-03-15T10:30:00.000Z",
      avatarUrl:
        "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png",
      companyName: "TechCorp Vietnam",
      companySlug: "techcorp-vietnam",
    },
    {
      maTaiKhoan: "uv-locked-1",
      email: "spammer@viecngon.vn",
      tenNguoiDung: "Tài Khoản Vi Phạm",
      sdt: null,
      provider: "LOCAL",
      vaiTro: "UNGVIEN",
      trangThai: "KHOA",
      ngayTao: "2026-03-20T11:00:00.000Z",
      ngayCapNhat: "2026-03-21T11:00:00.000Z",
      avatarUrl: null,
      companyName: null,
      companySlug: null,
    },
  ];
}

async function setupAdminUsersMockApi(page: import("@playwright/test").Page) {
  await setupAdminDashboardMocks(page);
  await mockAuthSession(page, {
    id: "admin-self-1",
    name: "Quản trị viên Chính",
    email: "admin@viecngon.vn",
    role: "ADMIN",
  });

  const users = createInitialUsers();

  const buildSummary = (list: AdminUserListItem[]) => ({
    total: list.length,
    active: list.filter((u) => u.trangThai === "HOATDONG").length,
    locked: list.filter((u) => u.trangThai === "KHOA").length,
    unactivated: list.filter((u) => u.trangThai === "CHUAKICHHOAT").length,
    admins: list.filter((u) => u.vaiTro === "ADMIN").length,
    candidates: list.filter((u) => u.vaiTro === "UNGVIEN").length,
    recruiters: list.filter((u) => u.vaiTro === "NHATUYENDUNG").length,
  });

  await page.route("http://localhost:3001/admin/users*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    // PATCH /admin/users/:id/status
    if (req.method() === "PATCH" && pathname.endsWith("/status")) {
      const id = pathname.split("/")[3];
      const body = JSON.parse(req.postData() || "{}") as {
        trangThai: "HOATDONG" | "KHOA";
        reason?: string;
      };
      const target = users.find((u) => u.maTaiKhoan === id);
      if (!target) {
        return route.fulfill({
          status: 404,
          body: JSON.stringify({ message: "Không tìm thấy" }),
        });
      }
      target.trangThai = body.trangThai;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            body.trangThai === "KHOA"
              ? `Đã khóa tài khoản ${target.email}.`
              : `Đã kích hoạt tài khoản ${target.email}.`,
          user: target,
        }),
      });
    }

    // PATCH /admin/users/:id/role
    if (req.method() === "PATCH" && pathname.endsWith("/role")) {
      const id = pathname.split("/")[3];
      const body = JSON.parse(req.postData() || "{}") as {
        vaiTro: AdminUserRole;
      };
      const target = users.find((u) => u.maTaiKhoan === id);
      if (!target) {
        return route.fulfill({
          status: 404,
          body: JSON.stringify({ message: "Không tìm thấy" }),
        });
      }
      target.vaiTro = body.vaiTro;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã cập nhật vai trò của ${target.email}.`,
          user: target,
        }),
      });
    }

    // DELETE /admin/users/:id
    const deleteMatch = pathname.match(/^\/admin\/users\/([^/]+)$/);
    if (req.method() === "DELETE" && deleteMatch) {
      const id = deleteMatch[1];
      const idx = users.findIndex((u) => u.maTaiKhoan === id);
      if (idx === -1) {
        return route.fulfill({
          status: 404,
          body: JSON.stringify({ message: "Không tìm thấy" }),
        });
      }
      const [removed] = users.splice(idx, 1);
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã xóa tài khoản ${removed.email} khỏi hệ thống.`,
          deletedId: removed.maTaiKhoan,
        }),
      });
    }

    // GET /admin/users/:id
    const detailMatch = pathname.match(/^\/admin\/users\/([^/]+)$/);
    if (req.method() === "GET" && detailMatch) {
      const id = detailMatch[1];
      const target = users.find((u) => u.maTaiKhoan === id);
      if (!target) {
        return route.fulfill({
          status: 404,
          body: JSON.stringify({ message: "Không tìm thấy" }),
        });
      }
      const detail: AdminUserDetailResponse = {
        ...target,
        candidateProfile:
          target.vaiTro === "UNGVIEN"
            ? {
                maUngVien: "uv-profile-1",
                tenUngVien: target.tenNguoiDung,
                chuyenMon: "Senior Fullstack Engineer",
                diaChi: "TP. Hồ Chí Minh",
                soNamKinhNghiem: 4,
                cvUrl: null,
                applicationsCount: 5,
                savedJobsCount: 8,
                skillsCount: 10,
              }
            : null,
        recruiterProfile:
          target.vaiTro === "NHATUYENDUNG"
            ? {
                maNTD: "ntd-1",
                hoTen: target.tenNguoiDung,
                chucVu: "Talent Acquisition Lead",
                vaiTroTrongCongTy: "OWNER",
                maCongTy: "cty-1",
                tenCongTy: target.companyName || "TechCorp Vietnam",
                slug: target.companySlug || "techcorp-vietnam",
                logoUrl: null,
                thanhPho: "Hà Nội",
                jobsCount: 3,
              }
            : null,
        recentNotifications: [
          {
            maThongBao: "tb-1",
            tieuDe: "Chào mừng đến với ViecNgon",
            noiDung: "Tài khoản của bạn đã được khởi tạo.",
            ngayTao: "2026-02-10T09:05:00.000Z",
          },
        ],
      };

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(detail),
      });
    }

    // GET /admin/users (list + filters)
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const role = url.searchParams.get("role") as AdminUserRole | null;
    const status = url.searchParams.get("status") as AdminUserStatus | null;

    const filtered = users.filter((u) => {
      if (role && u.vaiTro !== role) return false;
      if (status && u.trangThai !== status) return false;
      if (
        q &&
        !u.email.toLowerCase().includes(q) &&
        !u.tenNguoiDung.toLowerCase().includes(q) &&
        !(u.companyName || "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: filtered,
        pagination: {
          page: 1,
          limit: 12,
          total: filtered.length,
          totalPages: 1,
        },
        summary: buildSummary(filtered),
      }),
    });
  });
}

test.describe("Admin - Quản lý tài khoản người dùng (/admin/users)", () => {
  test("[Đơn giản] Tải trang /admin/users, hiển thị bảng cố định, thống kê dưới bảng và 3 trạng thái tiếng Việt", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupAdminUsersMockApi(page);
    await page.goto("/admin/users");

    await expect(page.getByText("Nguyễn Văn An")).toBeVisible();
    await expect(page.getByText("TechCorp Vietnam")).toBeVisible();
    await expect(page.getByText("Chưa kích hoạt").first()).toBeVisible();
    await expect(page.getByText("Đã khóa").first()).toBeVisible();
    await expect(page.getByText(/Tổng cộng:.*4.*tài khoản/)).toBeVisible();

    // Nút Xóa bộ lọc luôn hiện sẵn ở trạng thái disabled khi chưa lọc
    await expect(
      page.getByRole("button", { name: "Xóa bộ lọc" }),
    ).toBeDisabled();

    // Guardrail: Không thể tự khóa / tự phân quyền / tự xóa chính mình
    await expect(
      page.getByRole("button", { name: "Khóa tài khoản admin@viecngon.vn" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Phân quyền admin@viecngon.vn" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Xóa tài khoản admin@viecngon.vn" }),
    ).toBeDisabled();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Lọc theo trạng thái cập nhật số lượng thống kê dưới bảng và mở Drawer chi tiết", async ({
    page,
  }) => {
    await setupAdminUsersMockApi(page);
    await page.goto("/admin/users");

    await expect(page.getByText("Nguyễn Văn An")).toBeVisible();

    // Lọc theo trạng thái Chưa kích hoạt -> footer đổi sang Kết quả lọc: 1 tài khoản
    await page.getByLabel("Lọc theo trạng thái").selectOption("CHUAKICHHOAT");
    await expect(page.getByText("Trần Thị HR")).toBeVisible();
    await expect(page.getByText("Nguyễn Văn An")).toBeHidden();
    await expect(page.getByText(/Kết quả lọc:.*1.*tài khoản/)).toBeVisible();

    // Xóa bộ lọc
    await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
    await expect(page.getByText("Nguyễn Văn An")).toBeVisible();
    await expect(page.getByText(/Tổng cộng:.*4.*tài khoản/)).toBeVisible();

    // Mở Drawer chi tiết ứng viên
    await page
      .getByRole("button", { name: "Xem chi tiết an.nguyen@viecngon.vn" })
      .click();
    const drawer = page.getByRole("dialog", {
      name: "Chi tiết tài khoản người dùng",
    });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Senior Fullstack Engineer")).toBeVisible();
  });

  test("[Phức tạp] Khóa, kích hoạt, phân quyền quản trị và xóa tài khoản vi phạm", async ({
    page,
  }) => {
    await setupAdminUsersMockApi(page);
    await page.goto("/admin/users");

    // 1. Khóa tài khoản vi phạm kèm lý do
    await page
      .getByRole("button", { name: "Khóa tài khoản an.nguyen@viecngon.vn" })
      .click();
    const lockDialog = page.getByRole("dialog", {
      name: "Khóa tài khoản vi phạm",
    });
    await expect(lockDialog).toBeVisible();
    await lockDialog
      .getByLabel("Lý do khóa tài khoản (khuyến nghị)")
      .fill("Spam hồ sơ vi phạm chính sách");
    await lockDialog.getByRole("button", { name: "Xác nhận khóa" }).click();
    await expect(
      page.getByText("Đã khóa tài khoản an.nguyen@viecngon.vn."),
    ).toBeVisible();

    // 2. Kích hoạt tài khoản CHUAKICHHOAT
    await page
      .getByRole("button", { name: "Kích hoạt tài khoản hr@techcorp.vn" })
      .click();
    const activateDialog = page.getByRole("dialog", {
      name: "Kích hoạt tài khoản",
    });
    await activateDialog
      .getByRole("button", { name: "Xác nhận kích hoạt" })
      .click();
    await expect(
      page.getByText("Đã kích hoạt tài khoản hr@techcorp.vn."),
    ).toBeVisible();

    // 3. Phân quyền Quản trị viên
    await page
      .getByRole("button", { name: "Phân quyền hr@techcorp.vn" })
      .click();
    const roleDialog = page.getByRole("dialog", {
      name: "Phân quyền quản trị tài khoản",
    });
    await roleDialog.getByLabel("Chọn vai trò mới").selectOption("ADMIN");
    await roleDialog.getByRole("button", { name: "Lưu phân quyền" }).click();
    await expect(
      page.getByText("Đã cập nhật vai trò của hr@techcorp.vn."),
    ).toBeVisible();

    // 4. Xóa tài khoản vi phạm
    await page
      .getByRole("button", { name: "Xóa tài khoản spammer@viecngon.vn" })
      .click();
    const deleteDialog = page.getByRole("dialog", {
      name: "Xóa tài khoản người dùng",
    });
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.getByRole("button", { name: "Xác nhận xóa" }).click();
    await expect(
      page.getByText("Đã xóa tài khoản spammer@viecngon.vn khỏi hệ thống."),
    ).toBeVisible();
    await expect(page.getByText("Tài Khoản Vi Phạm")).toBeHidden();
  });
});
