import { test, expect } from "@playwright/test";
import { createMockJwt, mockAuthSession } from "../helpers/mockAuth";

test.describe("Xác thực & Phân quyền RBAC Middleware", () => {
  test("[Đơn giản] Các trang Đăng nhập, Đăng ký và Cổng Nhà tuyển dụng render sạch lỗi", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.route("**/auth/me", (route) =>
      route.fulfill({ status: 401, body: "{}" }),
    );

    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /Chào mừng đến với ViecNgon/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Đăng nhập bằng email/i }),
    ).toBeVisible();

    await page.goto("/register");
    await expect(page.getByPlaceholder("Nhập họ và tên")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Đăng ký bằng email/i }),
    ).toBeDisabled();

    await page.goto("/employer/login");
    await expect(
      page.getByRole("heading", { name: "Đăng nhập Nhà tuyển dụng" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Đăng nhập hệ thống/i }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Form Đăng ký kiểm tra điều khoản và validation mật khẩu/email", async ({
    page,
  }) => {
    await page.route("**/auth/me", (route) =>
      route.fulfill({ status: 401, body: "{}" }),
    );

    await page.goto("/register");

    const submitBtn = page.getByRole("button", {
      name: /Đăng ký bằng email/i,
    });
    await expect(submitBtn).toBeDisabled();

    // Tick đồng ý điều khoản mới cho phép bấm Đăng ký
    await page.locator("#emailTerms").check();
    await expect(submitBtn).toBeEnabled();

    await page.locator("#name").fill("Nguyễn Văn An");
    await page.locator("#email").fill("an.nguyen@viecngon.vn");
    await page.locator("#password").fill("abc123");
    await submitBtn.click();

    await expect(
      page.getByText("Mật khẩu chưa thỏa mãn tất cả các điều kiện bảo mật."),
    ).toBeVisible();

    // Nhập mật khẩu hợp lệ đủ 5 quy tắc và mock API signup thành công
    let signupCalled = false;
    await page.route("**/auth/signup", async (route) => {
      signupCalled = true;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Đăng ký thành công" }),
      });
    });

    await page.locator("#password").fill("ViecNgon@2026");
    await submitBtn.click();

    await expect.poll(() => signupCalled).toBe(true);
  });

  test("[Phức tạp] RBAC Middleware chặn truy cập trái phép & Luồng đăng nhập theo vai trò", async ({
    page,
  }) => {
    // 1. Chưa đăng nhập truy cập trang bảo vệ -> redirect đúng cổng login kèm callbackUrl
    await page.goto("/campaigns");
    await expect(page).toHaveURL(/\/employer\/login\?callbackUrl=%2Fcampaigns/);

    await page.goto("/cv-profile");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fcv-profile/);

    // 2. Đăng nhập vai trò UNGVIEN thành công trên /login -> redirect /dashboard
    await page.route("**/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "uv-1",
          name: "Trần Minh Khoa",
          email: "khoa.dev@viecngon.vn",
          role: "UNGVIEN",
        }),
      }),
    );
    await page.route("**/candidate/profile", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candidateName: "Trần Minh Khoa",
          profession: "Frontend Engineer",
          experiences: [],
          educations: [],
          skills: [],
        }),
      }),
    );
    await page.route("**/candidate/applied-jobs", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
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
          user: {
            id: "uv-1",
            name: "Trần Minh Khoa",
            email: "khoa.dev@viecngon.vn",
            role: "UNGVIEN",
          },
        }),
      });
    });

    await page.goto("/login");
    await page.locator("#email").fill("khoa.dev@viecngon.vn");
    await page.locator("#password").fill("ViecNgon@2026");
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    // 3. Cross-role RBAC: UNGVIEN cố vào /campaigns của Nhà tuyển dụng -> bị redirect về /dashboard
    await page.goto("/campaigns");
    await expect(page).toHaveURL(/\/dashboard/);

    // 4. Đăng xuất khỏi context rồi kiểm tra /employer/login chặn tài khoản UNGVIEN
    await page.context().clearCookies();
    await page.unroute("**/auth/login");
    await page.route("**/auth/logout", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    );
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "uv-1",
            name: "Trần Minh Khoa",
            email: "khoa.dev@viecngon.vn",
            role: "UNGVIEN",
          },
        }),
      }),
    );

    await page.goto("/employer/login");
    await page.getByPlaceholder("hr@company.com").fill("khoa.dev@viecngon.vn");
    await page.getByPlaceholder("Nhập mật khẩu").fill("ViecNgon@2026");
    await page.getByRole("button", { name: /Đăng nhập hệ thống/i }).click();

    await expect(
      page.getByText(
        "Tài khoản này không có quyền truy cập cổng Nhà tuyển dụng!",
      ),
    ).toBeVisible();
  });

  test("[Phức tạp - Bonus] Tạo session NHATUYENDUNG hợp lệ không bị chặn ở /pricing", async ({
    page,
  }) => {
    await mockAuthSession(page, {
      id: "hr-1",
      name: "HR FPT Software",
      email: "hr@fpt.vn",
      role: "NHATUYENDUNG",
    });
    await page.route("**/campaigns/packages", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      }),
    );

    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing/);
  });

  test("[Phức tạp] Luồng Quên mật khẩu & Đặt lại mật khẩu qua Email cho Ứng viên và Nhà tuyển dụng", async ({
    page,
  }) => {
    await page.route("**/auth/me", (route) =>
      route.fulfill({ status: 401, body: "{}" }),
    );

    let forgotPayload: Record<string, unknown> | null = null;
    await page.route("**/auth/forgot-password", async (route) => {
      forgotPayload = route.request().postDataJSON() as Record<
        string,
        unknown
      >;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message:
            "Nếu email tồn tại trên hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi tới hộp thư của bạn.",
        }),
      });
    });

    // 1. Ứng viên gửi yêu cầu quên mật khẩu tại /forgot-password
    await page.goto("/forgot-password");
    await page.locator("#email").fill("uv@viecngon.vn");
    await page
      .getByRole("button", { name: /Gửi liên kết khôi phục/i })
      .click();
    await expect.poll(() => forgotPayload).toEqual({
      email: "uv@viecngon.vn",
      portal: "candidate",
    });
    await expect(page.getByTestId("forgot-password-success")).toBeVisible();

    // 2. Mở /reset-password khi thiếu token -> hiện thông báo liên kết không hợp lệ
    await page.goto("/reset-password");
    await expect(
      page.getByTestId("reset-password-missing-token"),
    ).toBeVisible();

    // 3. Nhà tuyển dụng đặt lại mật khẩu với token hợp lệ tại /employer/reset-password
    let resetPayload: Record<string, unknown> | null = null;
    await page.route("**/auth/reset-password", async (route) => {
      resetPayload = route.request().postDataJSON() as Record<string, unknown>;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Đặt lại mật khẩu thành công!",
          role: "NHATUYENDUNG",
        }),
      });
    });

    await page.goto("/employer/reset-password?token=valid-reset-token-123");
    await page.locator("#newPassword").fill("StrongPass@2026");
    await page.locator("#confirmPassword").fill("StrongPass@2026");
    await page
      .getByRole("button", { name: /Xác nhận đặt lại mật khẩu/i })
      .click();

    await expect.poll(() => resetPayload).toEqual({
      token: "valid-reset-token-123",
      newPassword: "StrongPass@2026",
    });
    await expect(page.getByTestId("reset-password-success")).toBeVisible();
  });
});
