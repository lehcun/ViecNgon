import { test, expect } from "@playwright/test";
import type {
  AdminJobDetailResponse,
  AdminJobListItem,
  AdminJobStatus,
} from "@viecngon/types";
import { mockAuthSession } from "./helpers/mockAuth";
import { setupAdminDashboardMocks } from "./helpers/mockEmployerAndAdminData";

function createInitialJobs(): AdminJobListItem[] {
  return [
    {
      maCongViec: "job-pending-1",
      tenCongViec: "Senior Backend Engineer (NestJS)",
      slug: "senior-backend-engineer-nestjs",
      trangThai: "CHO_DUYET",
      thanhPho: "TP. Hồ Chí Minh",
      loaiHinh: "Full-time",
      hinhThucLamViec: "Hybrid",
      capBac: "Senior",
      mucLuongToiThieu: 35_000_000,
      mucLuongToiDa: 55_000_000,
      ngayDang: "2026-04-01T08:00:00.000Z",
      ngayHetHan: "2027-04-01T08:00:00.000Z",
      luotXem: 12,
      applicationsCount: 0,
      nhanQuangCao: "HOT",
      company: {
        maCongTy: "cty-momo",
        tenCongTy: "MoMo",
        slug: "momo-m-service",
        logoUrl:
          "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png",
      },
      recruiter: {
        maTaiKhoan: "hr-1",
        tenNguoiDung: "Lê Hùng Cường",
        email: "hr@momo.vn",
      },
      skills: ["NestJS", "TypeScript", "SQL Server"],
    },
    {
      maCongViec: "job-approved-1",
      tenCongViec: "Frontend Next.js Developer",
      slug: "frontend-nextjs-developer",
      trangThai: "DA_DUYET",
      thanhPho: "Hà Nội",
      loaiHinh: "Full-time",
      hinhThucLamViec: "Remote",
      capBac: "Middle",
      mucLuongToiThieu: 25_000_000,
      mucLuongToiDa: 40_000_000,
      ngayDang: "2026-03-20T08:00:00.000Z",
      ngayHetHan: "2027-03-20T08:00:00.000Z",
      luotXem: 180,
      applicationsCount: 9,
      nhanQuangCao: null,
      company: {
        maCongTy: "cty-fpt",
        tenCongTy: "FPT Software",
        slug: "fpt-software",
        logoUrl: null,
      },
      recruiter: {
        maTaiKhoan: "hr-2",
        tenNguoiDung: "Nguyễn Phương Linh",
        email: "hr.fpt@fptsoftware.com",
      },
      skills: ["Next.js", "ReactJS"],
    },
  ];
}

async function setupAdminJobsMockApi(page: import("@playwright/test").Page) {
  await setupAdminDashboardMocks(page);
  await mockAuthSession(page, {
    id: "admin-1",
    name: "Quản trị viên",
    email: "admin@viecngon.vn",
    role: "ADMIN",
  });

  const jobs = createInitialJobs();

  const buildSummary = (list: AdminJobListItem[]) => ({
    total: list.length,
    pending: list.filter((j) => j.trangThai === "CHO_DUYET").length,
    approved: list.filter((j) => j.trangThai === "DA_DUYET").length,
    rejected: list.filter((j) => j.trangThai === "TU_CHOI").length,
    hidden: list.filter((j) => j.trangThai === "DA_AN").length,
    expired: list.filter((j) => j.trangThai === "HET_HAN").length,
  });

  await page.route("http://localhost:3001/admin/jobs*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (req.method() === "PATCH" && pathname.endsWith("/moderate")) {
      const id = pathname.split("/")[3];
      const body = JSON.parse(req.postData() || "{}") as {
        action: "APPROVE" | "REJECT" | "HIDE";
        reason?: string;
      };
      const target = jobs.find((j) => j.maCongViec === id);
      if (!target) {
        return route.fulfill({ status: 404 });
      }
      target.trangThai =
        body.action === "APPROVE"
          ? "DA_DUYET"
          : body.action === "REJECT"
            ? "TU_CHOI"
            : "DA_AN";

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            body.action === "APPROVE"
              ? `Đã duyệt hiển thị công khai tin "${target.tenCongViec}".`
              : body.action === "REJECT"
                ? `Đã từ chối tin "${target.tenCongViec}".`
                : `Đã ẩn tin "${target.tenCongViec}".`,
          job: target,
        }),
      });
    }

    const detailMatch = pathname.match(/^\/admin\/jobs\/([^/]+)$/);
    if (req.method() === "GET" && detailMatch) {
      const target = jobs.find((j) => j.maCongViec === detailMatch[1]);
      if (!target) return route.fulfill({ status: 404 });

      const detail: AdminJobDetailResponse = {
        ...target,
        moTa: "<p>Phát triển hệ thống Backend hiệu năng cao với NestJS.</p>",
        yeuCauCongViec: "<p>Ít nhất 3 năm kinh nghiệm Node.js / TypeScript.</p>",
        phucLoi: "<p>Lương tháng 13, bảo hiểm sức khỏe toàn diện.</p>",
        yeuCauKinhNghiem: 3,
        branch: {
          thanhPho: "TP. Hồ Chí Minh",
          diaChi: "Quận 7, TP. Hồ Chí Minh",
        },
      };

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(detail),
      });
    }

    const status = url.searchParams.get("status") as AdminJobStatus | null;
    const filtered = jobs.filter((j) => (!status ? true : j.trangThai === status));

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

test.describe("Admin - Kiểm duyệt tin tuyển dụng (/admin/jobs)", () => {
  test("[Đơn giản] Tải trang /admin/jobs, hiển thị bảng cố định và thống kê dưới bảng", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupAdminJobsMockApi(page);
    await page.goto("/admin/jobs");

    await expect(
      page.getByText("Senior Backend Engineer (NestJS)"),
    ).toBeVisible();
    await expect(page.getByText("Frontend Next.js Developer")).toBeVisible();
    await expect(page.getByText(/Tổng cộng:.*2.*tin/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Xóa bộ lọc" }),
    ).toBeDisabled();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Lọc theo trạng thái Chờ duyệt và mở Drawer xem chi tiết nội dung tin", async ({
    page,
  }) => {
    await setupAdminJobsMockApi(page);
    await page.goto("/admin/jobs");

    await page.getByLabel("Lọc theo trạng thái tin").selectOption("CHO_DUYET");
    await expect(
      page.getByText("Senior Backend Engineer (NestJS)"),
    ).toBeVisible();
    await expect(page.getByText("Frontend Next.js Developer")).toBeHidden();

    await page
      .getByRole("button", {
        name: "Xem chi tiết Senior Backend Engineer (NestJS)",
      })
      .click();
    const drawer = page.getByRole("dialog", { name: "Chi tiết tin tuyển dụng" });
    await expect(drawer).toBeVisible();
    await expect(
      drawer.getByText("Phát triển hệ thống Backend hiệu năng cao với NestJS."),
    ).toBeVisible();
  });

  test("[Phức tạp] Duyệt tin chờ duyệt và kiểm tra bắt buộc nhập lý do khi từ chối", async ({
    page,
  }) => {
    await setupAdminJobsMockApi(page);
    await page.goto("/admin/jobs");

    // Kiểm tra nút Xác nhận từ chối bị khóa khi chưa nhập lý do
    await page
      .getByRole("button", {
        name: "Từ chối tin Senior Backend Engineer (NestJS)",
      })
      .click();
    const rejectModal = page.getByRole("dialog", {
      name: "Từ chối tin tuyển dụng",
    });
    await expect(
      rejectModal.getByRole("button", { name: "Xác nhận từ chối" }),
    ).toBeDisabled();
    await rejectModal.getByRole("button", { name: "Hủy" }).click();

    // Duyệt tin thành công
    await page
      .getByRole("button", {
        name: "Duyệt tin Senior Backend Engineer (NestJS)",
      })
      .click();
    const approveModal = page.getByRole("dialog", {
      name: "Duyệt tin tuyển dụng",
    });
    await approveModal.getByRole("button", { name: "Xác nhận duyệt" }).click();
    await expect(
      page.getByText(
        'Đã duyệt hiển thị công khai tin "Senior Backend Engineer (NestJS)".',
      ),
    ).toBeVisible();
  });
});
