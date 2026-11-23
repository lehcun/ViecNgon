import { test, expect } from "@playwright/test";
import type { AdminSkillItem } from "@viecngon/types";
import { mockAuthSession } from "./helpers/mockAuth";
import { setupAdminDashboardMocks } from "./helpers/mockEmployerAndAdminData";

async function setupAdminSkillsMockApi(page: import("@playwright/test").Page) {
  await setupAdminDashboardMocks(page);
  await mockAuthSession(page, {
    id: "admin-1",
    name: "Quản trị viên",
    email: "admin@viecngon.vn",
    role: "ADMIN",
  });

  const skills: AdminSkillItem[] = [
    {
      maKyNang: "sk-react",
      tenKyNang: "ReactJS",
      jobsCount: 5,
      candidatesCount: 8,
      totalUsage: 13,
    },
    {
      maKyNang: "sk-react-dup",
      tenKyNang: "React.js",
      jobsCount: 1,
      candidatesCount: 1,
      totalUsage: 2,
    },
    {
      maKyNang: "sk-unused",
      tenKyNang: "COBOL",
      jobsCount: 0,
      candidatesCount: 0,
      totalUsage: 0,
    },
  ];

  await page.route("http://localhost:3001/admin/skills*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const pathname = url.pathname;

    if (req.method() === "POST" && pathname === "/admin/skills") {
      const body = JSON.parse(req.postData() || "{}") as { tenKyNang: string };
      const created: AdminSkillItem = {
        maKyNang: `sk-${Date.now()}`,
        tenKyNang: body.tenKyNang,
        jobsCount: 0,
        candidatesCount: 0,
        totalUsage: 0,
      };
      skills.push(created);
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã thêm kỹ năng "${created.tenKyNang}" vào từ điển.`,
          skill: created,
        }),
      });
    }

    if (req.method() === "POST" && pathname.endsWith("/merge")) {
      const srcId = pathname.split("/")[3];
      const idx = skills.findIndex((s) => s.maKyNang === srcId);
      const [removed] = skills.splice(idx, 1);
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã gộp "${removed.tenKyNang}" vào "ReactJS" thành công.`,
          skill: skills[0],
        }),
      });
    }

    const delMatch = pathname.match(/^\/admin\/skills\/([^/]+)$/);
    if (req.method() === "DELETE" && delMatch) {
      const idx = skills.findIndex((s) => s.maKyNang === delMatch[1]);
      const [removed] = skills.splice(idx, 1);
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Đã xóa kỹ năng "${removed.tenKyNang}" khỏi từ điển.`,
          deletedId: removed.maKyNang,
        }),
      });
    }

    const usage = url.searchParams.get("usage");
    const filtered = skills.filter((s) => {
      if (usage === "UNUSED") return s.totalUsage === 0;
      if (usage === "IN_USE") return s.totalUsage > 0;
      return true;
    });

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: filtered,
        pagination: {
          page: 1,
          limit: 15,
          total: filtered.length,
          totalPages: 1,
        },
        summary: {
          total: filtered.length,
          inUse: filtered.filter((s) => s.totalUsage > 0).length,
          unused: filtered.filter((s) => s.totalUsage === 0).length,
        },
      }),
    });
  });
}

test.describe("Admin - Quản lý Từ điển kỹ năng IT (/admin/skills)", () => {
  test("[Đơn giản] Tải trang /admin/skills, hiển thị thống kê sử dụng và khóa nút xóa kỹ năng đang dùng", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupAdminSkillsMockApi(page);
    await page.goto("/admin/skills");

    await expect(page.getByText("ReactJS")).toBeVisible();
    await expect(page.getByText("COBOL")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Xóa kỹ năng ReactJS" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Xóa kỹ năng COBOL" }),
    ).toBeEnabled();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Thêm kỹ năng mới và lọc kỹ năng chưa sử dụng", async ({
    page,
  }) => {
    await setupAdminSkillsMockApi(page);
    await page.goto("/admin/skills");

    await page.getByRole("button", { name: "Thêm kỹ năng" }).click();
    const modal = page.getByRole("dialog", { name: "Thêm kỹ năng IT mới" });
    await modal.getByLabel(/Tên kỹ năng chuẩn/).fill("Rust");
    await modal.getByRole("button", { name: "Thêm mới" }).click();
    await expect(
      page.getByText('Đã thêm kỹ năng "Rust" vào từ điển.'),
    ).toBeVisible();

    await page.getByLabel("Lọc trạng thái sử dụng").selectOption("UNUSED");
    await expect(page.getByText("COBOL")).toBeVisible();
    await expect(page.getByText("ReactJS")).toBeHidden();
  });

  test("[Phức tạp] Gộp kỹ năng trùng lặp React.js vào ReactJS và xóa kỹ năng COBOL chưa sử dụng", async ({
    page,
  }) => {
    await setupAdminSkillsMockApi(page);
    await page.goto("/admin/skills");

    await page.getByRole("button", { name: "Gộp kỹ năng React.js" }).click();
    const mergeModal = page.getByRole("dialog", {
      name: "Gộp kỹ năng trùng lặp",
    });
    await mergeModal
      .getByLabel(/Chọn kỹ năng chuẩn đích/)
      .selectOption("sk-react");
    await mergeModal.getByRole("button", { name: "Xác nhận gộp" }).click();
    await expect(
      page.getByText('Đã gộp "React.js" vào "ReactJS" thành công.'),
    ).toBeVisible();

    await page.getByRole("button", { name: "Xóa kỹ năng COBOL" }).click();
    const delModal = page.getByRole("dialog", {
      name: "Xóa kỹ năng chưa sử dụng",
    });
    await delModal.getByRole("button", { name: "Xác nhận xóa" }).click();
    await expect(
      page.getByText('Đã xóa kỹ năng "COBOL" khỏi từ điển.'),
    ).toBeVisible();
  });
});
