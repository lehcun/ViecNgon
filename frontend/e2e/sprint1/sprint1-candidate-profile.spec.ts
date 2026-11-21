import { test, expect } from "@playwright/test";
import {
  createMockCandidateProfile,
  setupCandidateSessionWithBaseMocks,
} from "../helpers/mockCandidateData";

test.describe("Sprint 1 - Module Quản lý tài khoản cá nhân (TTCN)", () => {
  test("[GUI-TTCN01..GUI-TTCN05 & FUNC-TTCN01] Mở cửa sổ Thông tin cá nhân hiển thị đúng trạng thái các trường", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);

    await page.goto("/cv-profile");
    await page.getByTitle("Chỉnh sửa thông tin cơ bản").click();

    // FUNC-TTCN01: Modal hiển thị
    await expect(
      page.getByRole("heading", { name: "Thông tin cá nhân" }),
    ).toBeVisible();

    const modal = page.locator("div.bg-white.rounded-2xl").filter({
      has: page.getByRole("heading", { name: "Thông tin cá nhân" }),
    });

    // GUI-TTCN01: Họ và Tên * (enable)
    const nameInput = modal.locator('input[name="userName"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled();
    await expect(nameInput).toHaveValue("Nguyễn Quang Ý");

    // GUI-TTCN02: Chức danh * (enable)
    const professionInput = modal.locator('input[name="profession"]');
    await expect(professionInput).toBeVisible();
    await expect(professionInput).toBeEnabled();

    // GUI-TTCN03: Địa chỉ email (disable)
    const emailInput = modal.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeDisabled();
    await expect(emailInput).toHaveValue("quangy.dev@viecngon.vn");

    // GUI-TTCN04: Số điện thoại * (enable)
    const phoneInput = modal.locator('input[name="phoneNumber"]');
    await expect(phoneInput).toBeVisible();
    await expect(phoneInput).toBeEnabled();

    // GUI-TTCN05: Button Lưu & Huỷ (enable)
    await expect(modal.getByRole("button", { name: "Lưu" })).toBeEnabled();
    await expect(modal.getByRole("button", { name: "Huỷ" })).toBeEnabled();
  });

  test("[FUNC-TTCN02] Cập nhật thông tin cá nhân thành công", async ({
    page,
  }) => {
    const { profileState } = await setupCandidateSessionWithBaseMocks(page);

    let patchedBody: Record<string, unknown> | null = null;
    await page.route("**/candidate/profile", async (route) => {
      if (route.request().method() === "PATCH") {
        patchedBody = route.request().postDataJSON() as Record<string, unknown>;
        profileState.candidateName = String(patchedBody.userName || "");
        profileState.profession = String(patchedBody.profession || "");
        profileState.account.phoneNumber = String(
          patchedBody.phoneNumber || "",
        );
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(profileState),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(profileState),
      });
    });

    await page.goto("/cv-profile");
    await page.getByTitle("Chỉnh sửa thông tin cơ bản").click();

    const modal = page.locator("div.bg-white.rounded-2xl").filter({
      has: page.getByRole("heading", { name: "Thông tin cá nhân" }),
    });
    await modal
      .locator('input[name="userName"]')
      .fill("Nguyễn Quang Ý Updated");
    await modal
      .locator('input[name="profession"]')
      .fill("Senior Fullstack Engineer");
    await modal.locator('input[name="phoneNumber"]').fill("0912345678");
    await modal.locator('input[name="dateOfBirth"]').fill("2001-09-20");
    await modal.locator('select[name="city"]').selectOption("Hà Nội");

    await modal.getByRole("button", { name: "Lưu" }).click();

    await expect
      .poll(() => patchedBody)
      .toMatchObject({
        userName: "Nguyễn Quang Ý Updated",
        profession: "Senior Fullstack Engineer",
        phoneNumber: "0912345678",
        dateOfBirth: "2001-09-20",
      });

    await expect(
      page.getByText("Cập nhật thông tin thành công!"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Nguyễn Quang Ý Updated" }),
    ).toBeVisible();
  });

  test("[FUNC-TTCN06] Nhấn Huỷ đóng cửa sổ và giữ nguyên thông tin ban đầu", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);

    let patchCalled = false;
    await page.route("**/candidate/profile", (route) => {
      if (route.request().method() === "PATCH") {
        patchCalled = true;
        return route.fulfill({ status: 200, body: "{}" });
      }
      return route.fallback();
    });

    await page.goto("/cv-profile");
    await page.getByTitle("Chỉnh sửa thông tin cơ bản").click();

    const modal = page.locator("div.bg-white.rounded-2xl").filter({
      has: page.getByRole("heading", { name: "Thông tin cá nhân" }),
    });
    await modal.locator('input[name="userName"]').fill("Tên Tạm Bị Huỷ");
    await modal.getByRole("button", { name: "Huỷ" }).click();

    await expect(
      page.getByRole("heading", { name: "Thông tin cá nhân" }),
    ).toBeHidden();
    await expect(
      page.getByRole("heading", { level: 1, name: "Nguyễn Quang Ý" }),
    ).toBeVisible();
    expect(patchCalled).toBe(false);
  });
});

test.describe("Sprint 1 - Module Quản lý hồ sơ ứng viên (HSUV)", () => {
  test("[GUI-HSUV01, FUNC-HSUV01 & FUNC-HSUV02] Trang Tổng quan hồ sơ hiển thị độ hoàn thiện và bật/tắt Cho phép tìm CV", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);

    // FUNC-HSUV01: Trang Tổng quan (/dashboard)
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { level: 1, name: "Nguyễn Quang Ý" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hồ sơ ViecNgon" }),
    ).toBeVisible();
    await expect(page.getByText("100%")).toBeVisible();

    // GUI-HSUV01: Mục "Cho phép NTD tìm CV" trên Sidebar dẫn sang trang Cài đặt
    const toggleLink = page.getByRole("link", { name: /Đang bật/i });
    await expect(toggleLink).toBeVisible();
    await toggleLink.click();
    await expect(page).toHaveURL(/\/settings$/);

    // FUNC-HSUV02: Bật/Tắt trạng thái "Hiển thị CV của bạn"
    await expect(
      page.getByRole("heading", { name: "Hiển thị CV của bạn" }),
    ).toBeVisible();
    const cvToggleBtn = page.getByRole("button", { name: /^(Bật|Tắt)$/ });
    await expect(cvToggleBtn).toHaveText("Bật");
    await cvToggleBtn.click();
    await expect(cvToggleBtn).toHaveText("Tắt");
    await cvToggleBtn.click();
    await expect(cvToggleBtn).toHaveText("Bật");
  });

  test("[GUI-HSUV02..GUI-HSUV05 & FUNC-HSUV03..FUNC-HSUV05] Sửa Giới thiệu bản thân, Thêm Học vấn và Kinh nghiệm làm việc", async ({
    page,
  }) => {
    const profileState = createMockCandidateProfile({
      aboutMe: "<p>Giới thiệu ban đầu.</p>",
      educations: [],
      experiences: [],
    });
    await setupCandidateSessionWithBaseMocks(page, { profile: profileState });

    await page.route("**/candidate/profile", async (route) => {
      if (route.request().method() === "PATCH") {
        const body = route.request().postDataJSON() as Record<string, unknown>;
        if (typeof body.aboutMe === "string") {
          profileState.aboutMe = body.aboutMe;
        }
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(profileState),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(profileState),
      });
    });

    await page.route("**/candidate/educations", async (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON() as {
          schoolName: string;
          major: string;
          startDate: string;
          endDate: string | null;
          gpa: string | null;
        };
        const created = { id: "edu-new", ...body };
        profileState.educations.push(created);
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(created),
        });
      }
      return route.fallback();
    });

    await page.route("**/candidate/experiences", async (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON() as {
          position: string;
          companyName: string;
          startDate: string;
          endDate: string | null;
          description: string | null;
        };
        const created = { id: "exp-new", ...body };
        profileState.experiences.push(created);
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(created),
        });
      }
      return route.fallback();
    });

    await page.goto("/cv-profile");

    // GUI-HSUV02..05
    await expect(
      page.getByRole("heading", { name: "Giới thiệu bản thân" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Kinh nghiệm làm việc" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Học vấn" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Xem và tải CV mẫu/i }),
    ).toBeVisible();

    // FUNC-HSUV03: Cập nhật mục "Giới thiệu bản thân"
    await page.getByTitle("Chỉnh sửa giới thiệu bản thân").click();
    const editor = page.locator(".ProseMirror");
    await expect(editor).toBeVisible();
    await editor.click();
    await editor.fill("Chuyên sâu Next.js, TypeScript và kiểm thử Playwright.");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(
      page.getByText("Cập nhật giới thiệu bản thân thành công!"),
    ).toBeVisible();
    await expect(
      page.getByText("Chuyên sâu Next.js, TypeScript và kiểm thử Playwright."),
    ).toBeVisible();

    // FUNC-HSUV04: Thêm mới thông tin "Học vấn"
    const eduCard = page.locator("div.bg-surface-card").filter({
      has: page.getByRole("heading", { name: "Học vấn" }),
    });
    await eduCard.getByRole("button", { name: "Thêm mới" }).click();

    const eduModal = page.locator("div.bg-white.rounded-2xl").filter({
      has: page.getByRole("heading", { name: "Thêm thông tin học vấn" }),
    });
    await eduModal
      .getByPlaceholder(/Đại học Bách Khoa/i)
      .fill("Đại học Công nghệ Thông tin");
    await eduModal
      .getByPlaceholder(/Khoa học máy tính/i)
      .fill("Công nghệ phần mềm");
    await eduModal.locator('input[type="month"]').first().fill("2020-09");
    await eduModal.locator('input[type="month"]').nth(1).fill("2024-06");
    await eduModal.getByRole("button", { name: "Thêm mới" }).click();

    await expect(page.getByText("Thêm học vấn thành công!")).toBeVisible();
    await expect(page.getByText("Đại học Công nghệ Thông tin")).toBeVisible();

    // FUNC-HSUV05: Thêm mới "Kinh nghiệm làm việc"
    const expCard = page.locator("div.bg-surface-card").filter({
      has: page.getByRole("heading", { name: "Kinh nghiệm làm việc" }),
    });
    await expCard.getByRole("button", { name: "Thêm mới" }).click();

    const expModal = page.locator("div.bg-white.rounded-2xl").filter({
      has: page.getByRole("heading", { name: "Thêm kinh nghiệm làm việc" }),
    });
    await expModal
      .getByPlaceholder(/Senior Frontend Developer/i)
      .fill("Next.js Engineer");
    await expModal.getByPlaceholder(/VNG Corporation/i).fill("MoMo");
    await expModal.locator('input[type="month"]').first().fill("2024-07");
    await expModal.locator("#isCurrentWork").check();
    await expModal
      .locator("textarea")
      .fill("Phát triển module tìm kiếm việc làm IT.");
    await expModal.getByRole("button", { name: "Thêm mới" }).click();

    await expect(page.getByText("Thêm kinh nghiệm thành công!")).toBeVisible();
    await expect(page.getByText("Next.js Engineer")).toBeVisible();
  });

  test("[FUNC-HSUV06] Xem và tải xuống CV mẫu chuẩn A4", async ({ page }) => {
    await setupCandidateSessionWithBaseMocks(page);

    await page.goto("/cv-profile");
    await page.getByRole("link", { name: /Xem và tải CV mẫu/i }).click();
    await expect(page).toHaveURL(/\/cv-template$/, { timeout: 15000 });

    await expect(
      page.getByRole("heading", { name: "Trình tạo CV chuẩn ATS" }),
    ).toBeVisible();
    const previewIframe = page.locator('iframe[title="CV Preview"]');
    await expect(previewIframe).toBeVisible({ timeout: 20000 });

    const downloadBtn = page.getByRole("button", { name: /Tải xuống/i });
    await expect(downloadBtn).toBeEnabled();

    const downloadPromise = page.waitForEvent("download");
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });

  test("[FUNC-TTCN07] Mở Modal cắt/thu phóng ảnh đại diện Ứng viên tại /cv-profile và PersonalInfoModal", async ({
    page,
  }) => {
    const { profileState } = await setupCandidateSessionWithBaseMocks(page);

    let persistQueryValue: string | null = null;
    await page.route("**/candidate/profile/upload-avatar*", async (route) => {
      const url = new URL(route.request().url());
      persistQueryValue = url.searchParams.get("persist");
      const uploadedUrl =
        "https://res.cloudinary.com/demo/image/upload/v1/viecngon_avatars/cropped-avatar.png";
      if (persistQueryValue === "true") {
        profileState.avatarUrl = uploadedUrl;
      }
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ url: uploadedUrl }),
      });
    });

    await page.goto("/cv-profile");

    const tinyPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );

    await page.locator('input[type="file"]').first().setInputFiles({
      name: "candidate-avatar.png",
      mimeType: "image/png",
      buffer: tinyPng,
    });

    const cropDialog = page.getByRole("dialog", {
      name: "Cập nhật ảnh đại diện",
    });
    await expect(cropDialog).toBeVisible();
    const previewImg = cropDialog.locator('img[alt="Xem trước ảnh cắt"]');
    await expect(previewImg).toBeVisible();
    await expect
      .poll(() =>
        previewImg.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(cropDialog.getByText("Kéo để di chuyển")).toBeVisible();
    await cropDialog.getByRole("button", { name: "Phóng to" }).click();
    await cropDialog.getByRole("button", { name: "Cập nhật" }).click();

    await expect.poll(() => persistQueryValue).toBe("true");
    await expect(cropDialog).toBeHidden();
    await expect(
      page.getByText("Đã cập nhật ảnh đại diện!"),
    ).toBeVisible();

    // Kiểm tra thêm nút dán URL vẫn khả dụng trong PersonalInfoModal
    await page.getByTitle("Chỉnh sửa thông tin cơ bản").click();
    await page.getByRole("button", { name: /Hoặc dán URL ảnh/i }).click();
    await expect(page.locator("#avatarUrl")).toBeVisible();
  });
});
