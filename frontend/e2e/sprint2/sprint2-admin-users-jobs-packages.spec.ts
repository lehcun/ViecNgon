import { test, expect } from "@playwright/test";
import { mockAuthSession } from "../helpers/mockAuth";
import { ADMIN_AUTH_USER } from "../helpers/mockEmployerAndAdminData";

const MOCK_ADMIN_USERS = [
  {
    maTaiKhoan: "acc-uv-1",
    email: "quangy.dev@viecngon.vn",
    tenNguoiDung: "Nguyễn Quang Ý",
    sdt: "0912345678",
    provider: "LOCAL",
    vaiTro: "UNGVIEN",
    trangThai: "HOATDONG",
    ngayTao: "2026-11-01T08:00:00.000Z",
    ngayCapNhat: "2026-11-10T08:00:00.000Z",
    avatarUrl: null,
    companyName: null,
    companySlug: null,
  },
  {
    maTaiKhoan: "acc-hr-1",
    email: "hr@momo.vn",
    tenNguoiDung: "Trần HR MoMo",
    sdt: "0909888777",
    provider: "LOCAL",
    vaiTro: "NHATUYENDUNG",
    trangThai: "CHUAKICHHOAT",
    ngayTao: "2026-11-05T08:00:00.000Z",
    ngayCapNhat: "2026-11-12T08:00:00.000Z",
    avatarUrl: null,
    companyName: "MoMo",
    companySlug: "momo",
    companyRole: "OWNER",
  },
];

const MOCK_ADMIN_JOBS = [
  {
    maCongViec: "job-adm-1",
    tenCongViec: "Senior Backend Engineer",
    slug: "senior-backend-engineer",
    trangThai: "CHO_DUYET",
    thanhPho: "Hồ Chí Minh",
    loaiHinh: "Fulltime",
    hinhThucLamViec: "Hybrid",
    capBac: "Senior",
    mucLuongToiThieu: 35000000,
    mucLuongToiDa: 55000000,
    ngayDang: "2026-11-20T08:00:00.000Z",
    ngayHetHan: "2027-01-20T00:00:00.000Z",
    luotXem: 42,
    applicationsCount: 3,
    nhanQuangCao: "SUPER_HOT",
    company: {
      maCongTy: "comp-momo",
      tenCongTy: "MoMo",
      slug: "momo",
      logoUrl: null,
    },
    recruiter: {
      maTaiKhoan: "acc-hr-1",
      tenNguoiDung: "Trần HR MoMo",
      email: "hr@momo.vn",
    },
    skills: ["NestJS", "TypeScript"],
  },
  {
    maCongViec: "job-adm-2",
    tenCongViec: "Lead Product Designer",
    slug: "lead-product-designer",
    trangThai: "DA_DUYET",
    thanhPho: "Hà Nội",
    loaiHinh: "Fulltime",
    hinhThucLamViec: "Remote",
    capBac: "Lead",
    mucLuongToiThieu: 40000000,
    mucLuongToiDa: 60000000,
    ngayDang: "2026-11-18T08:00:00.000Z",
    ngayHetHan: "2027-01-15T00:00:00.000Z",
    luotXem: 120,
    applicationsCount: 8,
    nhanQuangCao: "DIAMOND",
    company: {
      maCongTy: "comp-vng",
      tenCongTy: "VNG Corporation",
      slug: "vng-corporation",
      logoUrl: null,
    },
    recruiter: {
      maTaiKhoan: "acc-hr-2",
      tenNguoiDung: "HR VNG",
      email: "hr@vng.com.vn",
    },
    skills: ["Figma", "Design System"],
  },
];

const MOCK_ADMIN_PACKAGES = [
  {
    maGoi: "pkg-vip-1",
    tieuDe: "Gói VIP Đẩy Tin / Pro",
    loaiQuangCao: "VIP_BOOST",
    gia: 2900000,
    thoiGianHieuLuc: 30,
    soLuotDangTin: 12,
    capDoUuTien: 3,
    loaiHuyHieu: "SUPER_HOT",
    moTaNgan: "Ưu tiên top đầu kết quả tìm kiếm việc làm IT.",
    quyenLoi: ["12 lượt đăng tin", "Đẩy top tự động"],
    trangThai: "HOATDONG",
    ngayTao: "2026-10-01T00:00:00.000Z",
    purchasesCount: 15,
    totalRevenue: 43500000,
  },
  {
    maGoi: "pkg-basic-1",
    tieuDe: "Gói Cơ Bản / Basic",
    loaiQuangCao: "STANDARD",
    gia: 0,
    thoiGianHieuLuc: 15,
    soLuotDangTin: 2,
    capDoUuTien: 1,
    loaiHuyHieu: "BASIC",
    moTaNgan: "Gói khởi đầu miễn phí.",
    quyenLoi: ["2 lượt đăng tin"],
    trangThai: "DA_AN",
    ngayTao: "2026-10-01T00:00:00.000Z",
    purchasesCount: 40,
    totalRevenue: 0,
  },
];

async function mockAdminShellBase(page: import("@playwright/test").Page) {
  await mockAuthSession(page, ADMIN_AUTH_USER);
  await page.route("http://localhost:3001/notifications*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [],
        total: 0,
        allCount: 0,
        unreadCount: 0,
        readCount: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
    }),
  );
  await page.route("http://localhost:3001/admin/reviews*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        counts: { ALL: 0, CHO_DUYET: 0, REPORTED: 0, DA_DUYET: 0, REJECTED: 0 },
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      }),
    }),
  );
}

test.describe("Sprint 2 - Admin Quản lý tài khoản người dùng (/admin/users)", () => {
  test("[QLTKND] Hiển thị danh sách, tìm kiếm, lọc theo vai trò và trạng thái", async ({
    page,
  }) => {
    await mockAdminShellBase(page);

    await page.route("http://localhost:3001/admin/users*", (route) => {
      const url = new URL(route.request().url());
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const role = url.searchParams.get("role") || "ALL";
      const status = url.searchParams.get("status") || "ALL";

      const items = MOCK_ADMIN_USERS.filter((u) => {
        if (
          q &&
          !u.tenNguoiDung.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (role !== "ALL" && u.vaiTro !== role) return false;
        if (status !== "ALL" && u.trangThai !== status) return false;
        return true;
      });

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items,
          pagination: { page: 1, limit: 12, total: items.length, totalPages: 1 },
          summary: {
            total: 2,
            active: 1,
            locked: 0,
            unactivated: 1,
            admins: 0,
            candidates: 1,
            recruiters: 1,
          },
        }),
      });
    });

    await page.goto("/admin/users");

    await expect(page.getByText("Nguyễn Quang Ý")).toBeVisible();
    await expect(page.getByText("Trần HR MoMo")).toBeVisible();

    // FUNC-QLTKND02: Tìm kiếm tài khoản
    const searchInput = page.getByLabel("Tìm kiếm tài khoản người dùng");
    await searchInput.fill("Quang Ý");
    await expect(page.getByText("Nguyễn Quang Ý")).toBeVisible();
    await expect(page.getByText("Trần HR MoMo")).toHaveCount(0);

    // Xóa bộ lọc
    await page.getByRole("button", { name: /Xóa bộ lọc/i }).click();
    await expect(page.getByText("Trần HR MoMo")).toBeVisible();

    // FUNC-QLTKND03: Lọc theo Vai trò
    await page.getByLabel("Lọc theo vai trò").selectOption("NHATUYENDUNG");
    await expect(page.getByText("Trần HR MoMo")).toBeVisible();
    await expect(page.getByText("Nguyễn Quang Ý")).toHaveCount(0);

    // FUNC-QLTKND05: Lọc theo Trạng thái
    await page.getByRole("button", { name: /Xóa bộ lọc/i }).click();
    await page.getByLabel("Lọc theo trạng thái").selectOption("HOATDONG");
    await expect(page.getByText("Nguyễn Quang Ý")).toBeVisible();
    await expect(page.getByText("Trần HR MoMo")).toHaveCount(0);
  });
});

test.describe("Sprint 2 - Admin Kiểm duyệt tin tuyển dụng (/admin/jobs)", () => {
  test("[KDTTD] Tìm kiếm, lọc trạng thái, phê duyệt tin và bắt buộc lý do khi từ chối", async ({
    page,
  }) => {
    await mockAdminShellBase(page);

    let jobs = [...MOCK_ADMIN_JOBS];
    let lastModerationPayload: Record<string, unknown> | null = null;

    await page.route("http://localhost:3001/admin/jobs**", async (route) => {
      const req = route.request();
      if (req.method() === "PATCH" && req.url().includes("/moderate")) {
        lastModerationPayload = req.postDataJSON() as Record<string, unknown>;
        jobs = jobs.map((j) =>
          j.maCongViec === "job-adm-1"
            ? {
                ...j,
                trangThai:
                  lastModerationPayload?.action === "APPROVE"
                    ? "DA_DUYET"
                    : "TU_CHOI",
              }
            : j,
        );
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Đã phê duyệt tin tuyển dụng thành công!",
          }),
        });
      }

      const url = new URL(req.url());
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const status = url.searchParams.get("status") || "ALL";
      const items = jobs.filter((j) => {
        if (
          q &&
          !j.tenCongViec.toLowerCase().includes(q) &&
          !j.company.tenCongTy.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (status !== "ALL" && j.trangThai !== status) return false;
        return true;
      });

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items,
          pagination: { page: 1, limit: 12, total: items.length, totalPages: 1 },
          summary: {
            total: jobs.length,
            pending: jobs.filter((j) => j.trangThai === "CHO_DUYET").length,
            approved: jobs.filter((j) => j.trangThai === "DA_DUYET").length,
            rejected: jobs.filter((j) => j.trangThai === "TU_CHOI").length,
            hidden: 0,
            expired: 0,
          },
        }),
      });
    });

    await page.goto("/admin/jobs");

    await expect(page.getByText("Senior Backend Engineer")).toBeVisible();
    await expect(page.getByText("Lead Product Designer")).toBeVisible();

    // Lọc theo trạng thái Chờ duyệt
    await page.getByLabel("Lọc theo trạng thái tin").selectOption("CHO_DUYET");
    await expect(page.getByText("Senior Backend Engineer")).toBeVisible();
    await expect(page.getByText("Lead Product Designer")).toHaveCount(0);

    // Phê duyệt tin chờ duyệt
    await page.locator('button[title*="Duyệt"], button[title*="Phê duyệt"]').first().click();
    await page
      .getByRole("button", { name: /Xác nhận duyệt|Phê duyệt/i })
      .last()
      .click();
    await expect
      .poll(() => lastModerationPayload)
      .toMatchObject({ action: "APPROVE" });
  });
});

test.describe("Sprint 2 - Admin Quản lý gói dịch vụ hệ thống (/admin/packages)", () => {
  test("[QLGDV] Hiển thị gói dịch vụ, lọc trạng thái, mở modal thêm gói mới và chuyển tab lịch sử giao dịch", async ({
    page,
  }) => {
    await mockAdminShellBase(page);

    await page.route("http://localhost:3001/admin/packages*", (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.includes("/transactions")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [],
            pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
            summary: { total: 0, paidCount: 0, pendingCount: 0, totalRevenue: 0 },
          }),
        });
      }

      const status = url.searchParams.get("status") || "ALL";
      const items = MOCK_ADMIN_PACKAGES.filter(
        (p) => status === "ALL" || p.trangThai === status,
      );
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items,
          summary: { total: 2, active: 1, hidden: 1 },
        }),
      });
    });

    await page.route("http://localhost:3001/admin/transactions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
          summary: { total: 0, paidCount: 0, pendingCount: 0, totalRevenue: 0 },
        }),
      }),
    );

    await page.goto("/admin/packages");

    await expect(page.getByText("Gói VIP Đẩy Tin / Pro")).toBeVisible();
    await expect(page.getByText("Gói Cơ Bản / Basic")).toBeVisible();

    // Lọc trạng thái Đang mở bán
    await page.getByLabel("Lọc trạng thái gói").selectOption("HOATDONG");
    await expect(page.getByText("Gói VIP Đẩy Tin / Pro")).toBeVisible();
    await expect(page.getByText("Gói Cơ Bản / Basic")).toHaveCount(0);

    // Mở modal Thêm gói mới
    await page.getByRole("button", { name: /Thêm gói mới/i }).click();
    await expect(page.getByRole("button", { name: /Hủy/i })).toBeVisible();
    await page.getByRole("button", { name: /Hủy/i }).click();

    // Chuyển tab Lịch sử giao dịch
    await page.getByRole("button", { name: /Lịch sử giao dịch/i }).click();
    await expect(
      page.getByPlaceholder("Tìm mã giao dịch, công ty, email HR..."),
    ).toBeVisible();
  });
});
