import { test, expect } from "@playwright/test";
import { createMockJwt } from "../helpers/mockAuth";

test.describe("Sprint 1 - Module Đăng nhập (DN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );
    await page.route("**/company/top", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
  });

  test("[GUI-DN01..GUI-DN05] Kiểm tra giao diện trang Đăng nhập", async ({
    page,
  }) => {
    await page.goto("/login");

    // GUI-DN01: Label "Chào mừng đến với ViecNgon"
    await expect(
      page.getByRole("heading", { name: /Chào mừng đến với ViecNgon/i }),
    ).toBeVisible();

    // GUI-DN02: Button "Đăng nhập với Google"
    const googleBtn = page.getByRole("button", {
      name: /Đăng nhập với Google/i,
    });
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toBeEnabled();

    // GUI-DN03: Email textbox
    const emailInput = page.locator("#email");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    // GUI-DN04: Password textbox
    const passwordInput = page.locator("#password");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();

    // GUI-DN05: Button "Đăng nhập bằng email"
    const submitBtn = page.getByRole("button", {
      name: /Đăng nhập bằng email/i,
    });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test("[FUNC-DN01] Điều hướng từ Trang chủ sang trang Đăng nhập", async ({
    page,
  }) => {
    await page.route("http://localhost:3001/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );
    await page.route("http://localhost:3001/company/top", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.goto("/");
    await page.getByRole("link", { name: "Đăng nhập", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: /Chào mừng đến với ViecNgon/i }),
    ).toBeVisible();
  });

  test("[FUNC-DN02] Đăng nhập thành công bằng Email và chuyển vào Dashboard", async ({
    page,
  }) => {
    await page.unroute("**/auth/me");
    await page.route("**/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "uv-1",
          name: "Nguyễn Quang Ý",
          email: "quangy@viecngon.vn",
          role: "UNGVIEN",
        }),
      }),
    );
    await page.route("**/candidate/profile", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candidateId: "cand-1",
          accountId: "uv-1",
          candidateName: "Nguyễn Quang Ý",
          profession: "Frontend Developer",
          account: { email: "quangy@viecngon.vn", userName: "Nguyễn Quang Ý", phoneNumber: "0905123456" },
          experiences: [],
          educations: [],
          skills: [],
        }),
      }),
    );
    await page.route("**/candidate/applied-jobs", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.route("**/candidate/notifications/unread-count", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ count: 0 }) }),
    );
    await page.route("**/candidate/notifications?*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [], total: 0, allCount: 0, unreadCount: 0, readCount: 0, page: 1, limit: 50, totalPages: 1 }),
      }),
    );
    await page.route("**/auth/login", async (route) => {
      await page.context().addCookies([
        {
          name: "access_token",
          value: createMockJwt("UNGVIEN"),
          domain: "localhost",
          path: "/",
        },
      ]);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Đăng nhập thành công",
          user: {
            id: "uv-1",
            name: "Nguyễn Quang Ý",
            email: "quangy@viecngon.vn",
            role: "UNGVIEN",
          },
          access_token: createMockJwt("UNGVIEN"),
        }),
      });
    });

    await page.goto("/login");
    await page.locator("#email").fill("quangy@viecngon.vn");
    await page.locator("#password").fill("ViecNgon@2026");
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();

    await expect(page.getByText("Đăng nhập thành công!")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("[FUNC-DN04] Nhập sai Email hoặc Mật khẩu hiển thị thông báo lỗi", async ({
    page,
  }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Email hoặc mật khẩu không đúng!" }),
      }),
    );

    await page.goto("/login");
    await page.locator("#email").fill("quangy@viecngon.vn");
    await page.locator("#password").fill("SaiMatKhau123");
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();

    await expect(
      page.getByText("Email hoặc mật khẩu không đúng!").first(),
    ).toBeVisible();
  });

  test("[FUNC-DN05 & FUNC-DN06] Để trống Email hoặc Mật khẩu bị chặn submit bởi validation bắt buộc", async ({
    page,
  }) => {
    let loginApiCalled = false;
    await page.route("**/auth/login", (route) => {
      loginApiCalled = true;
      return route.fulfill({ status: 400, body: "{}" });
    });

    await page.goto("/login");

    // FUNC-DN05: Để trống Email, có Mật khẩu
    await page.locator("#password").fill("ViecNgon@2026");
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();
    const emailMissing = await page
      .locator("#email")
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    expect(emailMissing).toBe(true);
    expect(loginApiCalled).toBe(false);

    // FUNC-DN06: Có Email, để trống Mật khẩu
    await page.locator("#email").fill("quangy@viecngon.vn");
    await page.locator("#password").fill("");
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();
    const passwordMissing = await page
      .locator("#password")
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    expect(passwordMissing).toBe(true);
    expect(loginApiCalled).toBe(false);
  });
});

test.describe("Sprint 1 - Module Đăng ký tài khoản (DK)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );
  });

  test("[GUI-DK01..GUI-DK05] Kiểm tra giao diện trang Đăng ký tài khoản", async ({
    page,
  }) => {
    await page.goto("/register");

    // GUI-DK01: Button "Đăng ký với Google"
    const googleBtn = page.getByRole("button", { name: /Đăng ký với Google/i });
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toBeEnabled();

    // GUI-DK02..04: Textboxes
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#name")).toBeEnabled();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#email")).toBeEnabled();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#password")).toBeEnabled();

    // GUI-DK05: Button "Đăng ký bằng email" (bị khóa trước khi tích điều khoản, mở khi tích)
    const submitBtn = page.getByRole("button", { name: /Đăng ký bằng email/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled();
    await page.locator("#emailTerms").check();
    await expect(submitBtn).toBeEnabled();
  });

  test("[FUNC-DK01] Đăng ký tài khoản thành công bằng Email", async ({
    page,
  }) => {
    await page.route("**/auth/signup", (route) =>
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "uv-new",
          name: "Trần Quang Ý",
          email: "newuser@viecngon.vn",
          role: "UNGVIEN",
          status: "ACTIVE",
        }),
      }),
    );

    await page.goto("/register");
    await page.locator("#name").fill("Trần Quang Ý");
    await page.locator("#email").fill("newuser@viecngon.vn");
    await page.locator("#password").fill("ViecNgon@2026");
    await page.locator("#emailTerms").check();
    await page.getByRole("button", { name: /Đăng ký bằng email/i }).click();

    await expect(
      page.getByText(/Đăng ký thành công! Chào mừng Trần Quang Ý/i),
    ).toBeVisible();
  });

  test("[FUNC-DK03] Để trống trường bắt buộc báo lỗi", async ({ page }) => {
    await page.goto("/register");
    await page.locator("#emailTerms").check();
    await page.getByRole("button", { name: /Đăng ký bằng email/i }).click();

    await expect(
      page.getByText("Vui lòng điền đầy đủ thông tin."),
    ).toBeVisible();
  });

  test("[FUNC-DK04] Nhập địa chỉ Email không hợp lệ báo lỗi", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.locator("#name").fill("Trần Quang Ý");
    await page.locator("#email").fill("a@b");
    await page.locator("#password").fill("ViecNgon@2026");
    await page.locator("#emailTerms").check();
    await page.getByRole("button", { name: /Đăng ký bằng email/i }).click();

    await expect(page.getByText("Email không đúng định dạng.")).toBeVisible();
  });

  test("[FUNC-DK05] Nhập Mật khẩu không đủ 5 quy tắc báo lỗi", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.locator("#name").fill("Trần Quang Ý");
    await page.locator("#email").fill("newuser@viecngon.vn");
    await page.locator("#password").fill("weak123");
    await page.locator("#emailTerms").check();
    await page.getByRole("button", { name: /Đăng ký bằng email/i }).click();

    await expect(
      page.getByText("Mật khẩu chưa thỏa mãn tất cả các điều kiện bảo mật."),
    ).toBeVisible();
  });

  test("[FUNC-DK06] Chưa tích đồng ý Điều khoản dịch vụ thì nút Đăng ký bị khóa", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.locator("#name").fill("Trần Quang Ý");
    await page.locator("#email").fill("newuser@viecngon.vn");
    await page.locator("#password").fill("ViecNgon@2026");

    await expect(
      page.getByRole("button", { name: /Đăng ký bằng email/i }),
    ).toBeDisabled();
  });
});
