import { expect, test } from "@playwright/test";

test.describe("Employer Landing Page Motion & Polish (/employer)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/company/employer-landing", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          stats: {
            candidatesCount: 1250,
            companiesCount: 84,
            activeJobsCount: 320,
          },
          packages: [
            {
              maGoi: "pkg-basic",
              tieuDe: "Gói Cơ Bản",
              moTaNgan: "Phù hợp startup tuyển nhanh",
              gia: 990000,
              soLuotDangTin: 3,
              thoiGianHieuLuc: 30,
              capDoUuTien: 1,
              loaiHuyHieu: "BASIC",
              quyenLois: ["Đăng 3 tin tuyển dụng", "Hỗ trợ AI Match Score"],
            },
            {
              maGoi: "pkg-diamond",
              tieuDe: "Gói Kim Cương",
              moTaNgan: "Tối đa hiển thị thương hiệu tuyển dụng",
              gia: 4900000,
              soLuotDangTin: 15,
              thoiGianHieuLuc: 60,
              capDoUuTien: 4,
              loaiHuyHieu: "DIAMOND",
              quyenLois: ["Banner trang chủ", "Ưu tiên tìm kiếm", "AI Match Score"],
            },
          ],
          partners: [
            {
              maCongTy: "ct-1",
              tenCongTy: "ViecNgon Tech",
              slug: "viecngon-tech",
              logoUrl: null,
              thanhPho: "TP.HCM",
              jobsCount: 12,
            },
          ],
        }),
      });
    });
  });

  test("Smoke: Trang /employer tải sạch sẽ không lỗi JS và hiện đủ các section", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/employer");

    await expect(
      page.getByRole("heading", { name: /Tuyển đúng kỹ sư IT/i }),
    ).toBeVisible();
    await expect(page.getByText("ViecNgon AI Screening")).toBeVisible();
    await expect(page.locator("#why-viecngon")).toBeVisible();
    await expect(page.locator("#packages")).toBeVisible();
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#partners")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("Interaction: Toggle so sánh Lọc thủ công vs Với ViecNgon AI và scroll Header morph", async ({
    page,
  }) => {
    await page.goto("/employer");

    // 1. Toggle Before/After comparison in #features
    const featuresSection = page.locator("#features");
    await featuresSection.scrollIntoViewIfNeeded();
    await expect(featuresSection.getByText("~15 giây")).toBeVisible();

    await featuresSection.getByRole("button", { name: "Lọc thủ công" }).click();
    await expect(featuresSection.getByText("~3,5 giờ")).toBeVisible();

    await featuresSection
      .getByRole("button", { name: "Với ViecNgon AI" })
      .click();
    await expect(featuresSection.getByText("~15 giây")).toBeVisible();

    // 2. Scroll triggers reveal and header morph (rounded-2xl floating glass)
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator("header > div")).toHaveClass(/rounded-2xl/);

    // 3. Footer renders giant wordmark and real contact info
    const footer = page.locator("#contact");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText("1900 6868")).toBeVisible();
    await expect(footer.getByText("love@viecngon.vn")).toBeVisible();
  });

  test("Responsive: Không tràn ngang ở Desktop 1440px và Mobile 390px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/employer");
    const desktopOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(desktopOverflow).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/employer");
    const mobileOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(mobileOverflow).toBe(false);
  });
});
