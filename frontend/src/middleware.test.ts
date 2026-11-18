import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "./middleware";

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.sig`;
}

describe("Edge middleware", () => {
  it("chuyển hướng về /login kèm callbackUrl khi chưa có cookie ở route bảo vệ", () => {
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?callbackUrl=%2Fdashboard",
    );
  });

  it("giải mã UTF-8 Base64URL chuẩn Web API và phân quyền theo role", () => {
    const validToken = makeJwt({
      role: "NHATUYENDUNG",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const employerReq = new NextRequest("http://localhost:3000/employer-dashboard", {
      headers: { cookie: `access_token=${validToken}` },
    });
    const okRes = middleware(employerReq);
    expect(okRes.status).toBe(200);

    const wrongRoleReq = new NextRequest("http://localhost:3000/dashboard", {
      headers: { cookie: `access_token=${validToken}` },
    });
    const redirectRes = middleware(wrongRoleReq);
    expect(redirectRes.status).toBe(307);
    expect(redirectRes.headers.get("location")).toBe(
      "http://localhost:3000/employer-dashboard",
    );
  });

  it("xóa cookie hết hạn và chuyển hướng về trang đăng nhập", () => {
    const expiredToken = makeJwt({
      role: "UNGVIEN",
      exp: Math.floor(Date.now() / 1000) - 60,
    });
    const req = new NextRequest("http://localhost:3000/cv-profile", {
      headers: { cookie: `access_token=${expiredToken}` },
    });
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?callbackUrl=%2Fcv-profile",
    );
    expect(res.headers.get("set-cookie")).toContain("access_token=;");
  });
});
