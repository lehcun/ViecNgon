import { test, expect } from "@playwright/test";

function createPendingEmployerJwt(payload: {
  sub: string;
  email: string;
  name: string;
  role: "NHATUYENDUNG";
  status: "CHUAKICHHOAT";
}) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url");
  return `${header}.${body}.mock-signature`;
}

async function setupPendingEmployerSession(
  page: import("@playwright/test").Page,
) {
  const pendingUser = {
    id: "hr-pending-1",
    sub: "hr-pending-1",
    email: "pending.hr@company.vn",
    name: "HR Chờ Duyệt",
    role: "NHATUYENDUNG" as const,
    status: "CHUAKICHHOAT" as const,
  };

  const token = createPendingEmployerJwt(pendingUser);
  await page.context().addCookies([
    {
      name: "access_token",
      value: token,
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.route("http://localhost:3001/auth/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(pendingUser),
    }),
  );

  await page.route("http://localhost:3001/auth/logout", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Đăng xuất thành công" }),
    }),
  );

  return pendingUser;
}

test.describe("Employer - Tài khoản Nhà tuyển dụng chưa kích hoạt (CHUAKICHHOAT)", () => {
  test("[Đơn giản] Trang chủ hiển thị dòng chờ Admin kích hoạt + hỗ trợ + đăng xuất trên Header", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await setupPendingEmployerSession(page);
    await page.goto("/");

    await expect(
      page.getByText(/Tài khoản Nhà tuyển dụng.*đang chờ Quản trị viên kích hoạt/),
    ).toBeVisible();
    await expect(page.getByText(/Hỗ trợ: love@viecngon\.vn/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng xuất" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Nhà tuyển dụng" }),
    ).toBeHidden();

    expect(pageErrors).toEqual([]);
  });

  test("[Trung bình] Middleware chặn NTD chưa kích hoạt truy cập /employer-dashboard và /post-job", async ({
    page,
  }) => {
    await setupPendingEmployerSession(page);

    await page.goto("/employer-dashboard");
    await expect(page).toHaveURL("http://localhost:3000/");

    await page.goto("/post-job");
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("[Phức tạp] Đăng xuất trên Header hoạt động và đưa về trạng thái khách vãng lai", async ({
    page,
  }) => {
    await setupPendingEmployerSession(page);
    await page.goto("/");

    await page.route("http://localhost:3001/auth/me", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Chưa đăng nhập" }),
      }),
    );

    await page.getByRole("button", { name: "Đăng xuất" }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
  });
});
