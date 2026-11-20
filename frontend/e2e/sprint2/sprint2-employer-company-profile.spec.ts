import { test, expect } from "@playwright/test";
import {
  createMockEmployerCompanyProfile,
  setupEmployerSessionWithBaseMocks,
} from "../helpers/mockEmployerAndAdminData";

test.describe("Sprint 2 - Module Quản lý hồ sơ doanh nghiệp (QLHS)", () => {
  test("[GUI-QLHS01..GUI-QLHS05 & FUNC-QLHS01..FUNC-QLHS05] Hiển thị hồ sơ công ty, chuyển tab, thêm lĩnh vực và lưu thay đổi", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    const companyProfile = createMockEmployerCompanyProfile();
    let patchPayload: Record<string, unknown> | null = null;

    await page.route("http://localhost:3001/employer/profile", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(companyProfile),
        });
      }
      if (route.request().method() === "PATCH") {
        patchPayload = route.request().postDataJSON() as Record<string, unknown>;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Cập nhật hồ sơ doanh nghiệp thành công.",
            data: companyProfile,
          }),
        });
      }
      return route.fallback();
    });

    await page.goto("/employer-company-profile");

    // GUI-QLHS01..05
    await expect(
      page.getByRole("heading", { name: "Quản lý hồ sơ doanh nghiệp" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Quản lý ảnh các Section/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Thông tin chung$/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Lưu thay đổi/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Xem trang công khai/i }),
    ).toHaveAttribute("href", "/company/vng-corporation");

    // FUNC-QLHS05: Chuyển qua các tab danh mục mới
    await page.getByRole("button", { name: /Văn hóa & Đãi ngộ/i }).click();
    await page.getByRole("button", { name: /Ảnh theo Section/i }).click();
    await expect(
      page.getByText(/Ảnh cho Section/i).first(),
    ).toBeVisible();

    await page.getByRole("button", { name: /Chi nhánh & Bản đồ/i }).click();
    await expect(
      page.getByRole("link", { name: /Open in Maps/i }).first(),
    ).toHaveAttribute("href", "https://www.google.com/maps?q=10.7295,106.7218");

    await page.getByRole("button", { name: /^Thông tin chung$/i }).click();

    // Chọn giá trị chuẩn hóa 1 dòng từ Select
    await page.getByLabel("Mô hình công ty").selectOption("Sản phẩm");
    await page.getByLabel("Làm việc ngoài giờ (OT)").selectOption("Không có OT");

    // Thêm tag lĩnh vực hoạt động mới
    await page
      .getByPlaceholder(/Thêm lĩnh vực/i)
      .fill("Blockchain");
    await page.getByRole("button", { name: /^Thêm$/i }).click();
    await expect(page.getByText("Blockchain")).toBeVisible();

    // FUNC-QLHS01: Cập nhật Giới thiệu công ty và bấm Lưu thay đổi
    const bioTextarea = page.getByPlaceholder(
      /Nhập giới thiệu về công ty/i,
    );
    await bioTextarea.fill("VNG là hệ sinh thái công nghệ hàng đầu Đông Nam Á.");
    await page.getByRole("button", { name: /Lưu thay đổi/i }).click();

    await expect
      .poll(() => patchPayload)
      .toMatchObject({
        company: {
          tenCongTy: "VNG Corporation",
          moHinhCongTy: "Sản phẩm",
          chinhSachOT: "Không có OT",
          moTa: "VNG là hệ sinh thái công nghệ hàng đầu Đông Nam Á.",
          linhVuc: [
            "Công nghệ thông tin / Phần mềm",
            "Điện toán đám mây & AI",
            "Blockchain",
          ],
          sectionImages: {
            introImages: [],
            cultureImages: [],
          },
        },
        branches: [
          {
            maChiNhanh: "br-hcm-1",
            thanhPho: "TP.HCM",
            viDo: 10.7295,
            kinhDo: 106.7218,
          },
          {
            maChiNhanh: "br-hn-1",
            thanhPho: "Hà Nội",
            viDo: 21.0285,
            kinhDo: 105.8542,
          },
        ],
      });
    await expect(
      page.getByText("Cập nhật hồ sơ doanh nghiệp thành công!"),
    ).toBeVisible();
  });
});
