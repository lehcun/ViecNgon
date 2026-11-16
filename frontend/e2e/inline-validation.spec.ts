import { expect, test } from "@playwright/test";

test.describe("Inline Form Validation (Auth & Input Fields)", () => {
  test("Smoke: Các trang Auth render sạch sẽ với form noValidate", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const routes = [
      "/login",
      "/register",
      "/employer/login",
      "/admin/login",
      "/forgot-password",
      "/employer",
    ];

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("form").first()).toHaveAttribute(
        "novalidate",
        "",
      );
    }

    expect(pageErrors).toEqual([]);
  });

  test("Login: Báo lỗi inline dưới Email & Mật khẩu khi để trống hoặc sai định dạng và tự xóa khi sửa đúng", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();

    const emailError = page.locator("#email-error");
    const passwordError = page.locator("#password-error");
    await expect(emailError).toContainText("Vui lòng nhập địa chỉ email.");
    await expect(passwordError).toContainText("Vui lòng nhập mật khẩu.");
    await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    await page.locator("#email").fill("sai-dinh-dang");
    await page.locator("#email").blur();
    await expect(emailError).toContainText("Email không đúng định dạng");

    await page.locator("#email").fill("ungvien@viecngon.vn");
    await expect(emailError).toHaveCount(0);
    await expect(page.locator("#email")).toHaveAttribute(
      "aria-invalid",
      "false",
    );

    await page.locator("#password").fill("123");
    await page.locator("#password").blur();
    await expect(passwordError).toContainText(
      "Mật khẩu phải có ít nhất 6 ký tự.",
    );

    await page.locator("#password").fill("Abc@1234");
    await expect(passwordError).toHaveCount(0);
  });

  test("Register: Hiện đủ lỗi inline dưới từng ô kể cả khi chưa tick Điều khoản", async ({
    page,
  }) => {
    await page.goto("/register");

    const submitBtn = page.getByRole("button", { name: /Đăng ký bằng email/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    await expect(page.locator("#name-error")).toContainText(
      "Vui lòng nhập họ và tên.",
    );
    await expect(page.locator("#email-error")).toContainText(
      "Vui lòng nhập địa chỉ email.",
    );
    await expect(page.locator("#password-error")).toContainText(
      "Vui lòng nhập mật khẩu.",
    );
    await expect(page.locator("#emailTerms-error")).toContainText(
      "Bạn cần đồng ý với Điều khoản dịch vụ",
    );

    await page.locator("#name").fill("Nguyễn Văn A");
    await page.locator("#email").fill("nguyenvana@gmail.com");
    await page.locator("#password").fill("Strong@123");
    await page.locator("#emailTerms").check();

    await expect(page.locator("#name-error")).toHaveCount(0);
    await expect(page.locator("#email-error")).toHaveCount(0);
    await expect(page.locator("#password-error")).toHaveCount(0);
    await expect(page.locator("#emailTerms-error")).toHaveCount(0);
  });

  test("Employer Consult Multi-step: Validate inline Bước 1 trước khi sang Bước 2 và validate Bước 2", async ({
    page,
  }) => {
    await page.goto("/employer");

    await page.getByRole("button", { name: /Tiếp tục để nhận tư vấn/i }).click();
    await expect(page.locator("#fullName-error")).toContainText(
      "Vui lòng nhập họ và tên.",
    );
    await expect(page.locator("#phone-error")).toContainText(
      "Vui lòng nhập số điện thoại.",
    );
    await expect(page.locator("#agreed-error")).toContainText(
      "Bạn cần đồng ý với Điều khoản dịch vụ",
    );

    await page.locator("#fullName").fill("Trần HR");
    await page.locator("#email").fill("hr@congty.vn");
    await page.locator("#phone").fill("0912345678");
    await page.locator("#company").fill("Công ty Công Nghệ ABC");
    await page.locator("#title").fill("HR Manager");
    await page.locator("#location").selectOption("HCM");
    await page.locator("#website").fill("not-a-url");
    await page.locator("#agreed").check();

    await page.getByRole("button", { name: /Tiếp tục để nhận tư vấn/i }).click();
    await expect(page.locator("#website-error")).toContainText(
      "không đúng định dạng URL",
    );

    await page.locator("#website").fill("https://congty.vn");
    await page.getByRole("button", { name: /Tiếp tục để nhận tư vấn/i }).click();

    await expect(
      page.getByRole("heading", { name: /Hoàn tất thông tin/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Gửi yêu cầu tư vấn/i }).click();
    await expect(page.locator("#budget-error")).toContainText(
      "Vui lòng chọn ngân sách tuyển dụng",
    );
    await expect(page.locator("#hiringDemand-error")).toContainText(
      "Vui lòng nhập số lượng nhân sự dự kiến.",
    );
  });

  test("Server fieldErrors Mapping: Map lỗi Backend xuống đúng ô Email / Mật khẩu trên Login, Register & Admin", async ({
    page,
  }) => {
    let loginAttempt = 0;
    await page.route("**/auth/login", async (route) => {
      loginAttempt += 1;
      if (loginAttempt === 1) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            statusCode: 401,
            message: "Mật khẩu không chính xác!",
            fieldErrors: {
              password: "Mật khẩu không chính xác!",
            },
          }),
        });
        return;
      }

      if (loginAttempt === 2) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            statusCode: 400,
            message: "Mail này đã được dùng để đăng ký bằng google",
            fieldErrors: {
              email: "Mail này đã được dùng để đăng ký bằng google",
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          statusCode: 401,
          message: "Email chưa tồn tại. Vui lòng đăng ký tài khoản!",
          fieldErrors: {
            email: "Email chưa tồn tại. Vui lòng đăng ký tài khoản!",
          },
        }),
      });
    });

    await page.goto("/login");
    await page.locator("#email").fill("user@viecngon.vn");
    await page.locator("#password").fill("WrongPass1!");
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();

    await expect(page.locator("#password-error")).toContainText(
      "Mật khẩu không chính xác!",
    );
    await expect(page.locator("#email-error")).toHaveCount(0);

    // 2. Login tài khoản Google -> hiện banner phát hiện Google + lỗi dưới #email-error
    await page.getByRole("button", { name: /Đăng nhập bằng email/i }).click();
    await expect(page.getByText("Phát hiện tài khoản Google")).toBeVisible();
    await expect(page.locator("#email-error")).toContainText(
      "Tài khoản này đã được tạo bằng Google",
    );

    // 3. Register trùng email -> map đúng endpoint /auth/register/candidate và hiện lỗi dưới #email-error
    await page.route("**/auth/register/candidate", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          statusCode: 400,
          message: "Email này đã được sử dụng!",
          fieldErrors: {
            email: "Email này đã được sử dụng!",
          },
        }),
      });
    });

    await page.goto("/register");
    await page.locator("#name").fill("Trần Văn B");
    await page.locator("#email").fill("exists@viecngon.vn");
    await page.locator("#password").fill("Strong@123");
    await page.locator("#emailTerms").check();
    await page.getByRole("button", { name: /Đăng ký bằng email/i }).click();

    await expect(page.locator("#email-error")).toContainText(
      "Email này đã được sử dụng!",
    );

    // 4. Admin login email chưa tồn tại -> hiện lỗi theme tối dưới #email-error
    await page.goto("/admin/login");
    await page.locator("#email").fill("missing@viecngon.vn");
    await page.locator("#password").fill("Admin@123");
    await page
      .getByRole("button", { name: /Đăng nhập Quản trị viên/i })
      .click();

    await expect(page.locator("#email-error")).toContainText(
      "Email chưa tồn tại",
    );
  });
});
