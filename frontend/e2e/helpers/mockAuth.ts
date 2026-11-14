import type { Page } from "@playwright/test";

export type MockRole = "UNGVIEN" | "NHATUYENDUNG" | "ADMIN";

export interface MockAuthUser {
  id: string;
  name: string;
  email: string;
  role: MockRole;
}

/**
 * Tạo JWT giả lập hợp lệ để Edge Middleware đọc `access_token` cookie (role + exp).
 */
export function createMockJwt(role: MockRole): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      sub: `mock-${role.toLowerCase()}`,
      role,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url");
  return `${header}.${payload}.mock-signature`;
}

/**
 * Gắn cookie `access_token` cho trình duyệt và stub endpoint `/auth/me`.
 */
export async function mockAuthSession(page: Page, user: MockAuthUser) {
  const token = createMockJwt(user.role);
  await page.context().addCookies([
    {
      name: "access_token",
      value: token,
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.route("**/auth/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(user),
    }),
  );
}
