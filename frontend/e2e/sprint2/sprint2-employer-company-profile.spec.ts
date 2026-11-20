import { test, expect } from "@playwright/test";
import {
  createMockEmployerCompanyProfile,
  setupEmployerSessionWithBaseMocks,
} from "../helpers/mockEmployerAndAdminData";

test.describe("Sprint 2 - Module Quản lý hồ sơ doanh nghiệp (QLHS)", () => {
  test("[GUI-QLHS01..GUI-QLHS05 & FUNC-QLHS01..FUNC-QLHS05] Hiển thị hồ sơ công ty đồng bộ DetailCompany, sửa Văn hóa, Chi nhánh Bản đồ và lưu thay đổi", async ({
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
        patchPayload = route.request().postDataJSON() as Record<
          string,
          unknown
        >;
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

    // GUI-QLHS01..05: Banner không lộ thẻ HTML thô và hiển thị thành phố ghép
    await expect(
      page.getByRole("heading", { name: "Quản lý hồ sơ doanh nghiệp" }),
    ).toBeVisible();
    await expect(page.getByText("TP.HCM - Hà Nội")).toBeVisible();
    await expect(page.getByText(/<p>Build Technologies/)).toHaveCount(0);
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

    // FUNC-QLHS05: Chuyển tab Ảnh theo Section, Chi nhánh & Bản đồ (có Leaflet picker), Đánh giá & Xếp hạng
    await page.getByRole("button", { name: /Ảnh theo Section/i }).click();
    await expect(
      page.getByText(/Ảnh cho Section/i).first(),
    ).toBeVisible();

    await page.getByRole("button", { name: /Chi nhánh & Bản đồ/i }).click();
    await expect(
      page.getByRole("link", { name: /Open in Maps/i }).first(),
    ).toHaveAttribute("href", "https://www.google.com/maps?q=10.7295,106.7218");
    await expect(page.locator(".leaflet-container")).toBeVisible();

    await page.getByRole("button", { name: /Đánh giá & Xếp hạng/i }).click();
    await expect(
      page.getByText("Môi trường kỹ thuật năng động, đồng nghiệp giỏi"),
    ).toBeVisible();

    // Chỉnh sửa tab Văn hóa & Đãi ngộ (Giải thưởng + Văn hóa & Con người Rich Text)
    await page.getByRole("button", { name: /Văn hóa & Đãi ngộ/i }).click();
    await page
      .getByPlaceholder(/VD: Công ty IT tốt nhất Việt Nam 2026/i)
      .fill("Top 50 Doanh nghiệp Công nghệ 2026");
    await page.getByRole("button", { name: /Thêm giải thưởng/i }).click();

    await page
      .locator("#company-aboutMe")
      .fill("<p>Văn hóa kỹ sư tự chủ và cởi mở.</p>");

    // Quay về Thông tin chung
    await page.getByRole("button", { name: /^Thông tin chung$/i }).click();

    await page.getByLabel("Mô hình công ty").selectOption("Sản phẩm");
    await page.getByLabel("Làm việc ngoài giờ (OT)").selectOption("Không có OT");

    await page.getByPlaceholder(/Thêm lĩnh vực/i).fill("Blockchain");
    await page.getByRole("button", { name: /^Thêm$/i }).click();
    await expect(page.getByText("Blockchain")).toBeVisible();

    // FUNC-QLHS01: Cập nhật Giới thiệu công ty và bấm Lưu thay đổi
    const bioTextarea = page.getByPlaceholder(
      /Nhập giới thiệu về công ty/i,
    );
    await bioTextarea.fill(
      "VNG là hệ sinh thái công nghệ hàng đầu Đông Nam Á.",
    );
    await page.getByRole("button", { name: /Lưu thay đổi/i }).click();

    await expect
      .poll(() => patchPayload)
      .toMatchObject({
        company: {
          tenCongTy: "VNG Corporation",
          moHinhCongTy: "Sản phẩm",
          chinhSachOT: "Không có OT",
          moTa: "VNG là hệ sinh thái công nghệ hàng đầu Đông Nam Á.",
          aboutMe: "<p>Văn hóa kỹ sư tự chủ và cởi mở.</p>",
          giaiThuong:
            "Top 10 Doanh nghiệp CNTT Việt Nam; Top 50 Doanh nghiệp Công nghệ 2026",
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

  test("[FUNC-QLHS06] Truy cập /company-profile, tạo mới và xóa bài viết trên Tab Bài viết", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    const companyProfile = createMockEmployerCompanyProfile();
    const currentPosts = [...(companyProfile.posts ?? [])];
    let createdPostBody: Record<string, unknown> | null = null;
    let deletedPostId: string | null = null;

    await page.route("http://localhost:3001/employer/profile", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ...companyProfile,
            posts: currentPosts,
            stats: {
              ...companyProfile.stats,
              totalPosts: currentPosts.length,
            },
          }),
        });
      }
      return route.fallback();
    });

    await page.route(
      "http://localhost:3001/employer/profile/posts",
      async (route) => {
        if (route.request().method() === "POST") {
          createdPostBody = route.request().postDataJSON() as Record<
            string,
            unknown
          >;
          const created = {
            maBaiViet: "post-new-1",
            tieuDe: String(createdPostBody.tieuDe || ""),
            anhBiaUrl: null,
            noiDung: String(createdPostBody.noiDung || ""),
            ngayDang: "2026-11-20T10:00:00.000Z",
          };
          currentPosts.unshift(created);
          return route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify(created),
          });
        }
        return route.fallback();
      },
    );

    await page.route(
      "http://localhost:3001/employer/profile/posts/*",
      async (route) => {
        if (route.request().method() === "DELETE") {
          const url = route.request().url();
          deletedPostId = url.split("/").pop() ?? null;
          const idx = currentPosts.findIndex((p) => p.maBaiViet === deletedPostId);
          if (idx >= 0) currentPosts.splice(idx, 1);
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              message: "Đã xóa bài viết thành công.",
              deletedId: deletedPostId,
            }),
          });
        }
        return route.fallback();
      },
    );

    await page.goto("/company-profile");

    await page.getByRole("button", { name: /^Bài viết/i }).click();
    await expect(
      page.getByText("VNG Campus đón đoàn sinh viên Công nghệ thông tin"),
    ).toBeVisible();

    await page.getByRole("button", { name: /Tạo bài viết mới/i }).click();
    await page
      .locator("#company-post-title")
      .fill("Tech Talk: Scaling Microservices tại VNG");
    await page
      .locator("#company-post-content")
      .fill("Chia sẻ kinh nghiệm tối ưu hệ thống chịu tải cao.");
    await page.getByRole("button", { name: /Đăng bài viết/i }).click();

    await expect
      .poll(() => createdPostBody)
      .toMatchObject({
        tieuDe: "Tech Talk: Scaling Microservices tại VNG",
        noiDung: "Chia sẻ kinh nghiệm tối ưu hệ thống chịu tải cao.",
      });
    await expect(
      page.getByText("Tech Talk: Scaling Microservices tại VNG"),
    ).toBeVisible();

    await page.getByRole("button", { name: /^Xóa$/i }).first().click();
    await page.getByRole("button", { name: /Xác nhận xóa/i }).click();

    await expect.poll(() => deletedPostId).toBe("post-new-1");
    await expect(
      page.getByText("Đã xóa bài viết khỏi trang công ty."),
    ).toBeVisible();
  });
});
