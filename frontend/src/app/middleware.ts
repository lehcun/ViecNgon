import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Lấy token/role từ cookie (Sau này khi kết nối với NestJS)
  const role = request.cookies.get("user_role")?.value;
  const path = request.nextUrl.pathname;

  // 2. Chặn route Admin nếu không phải Admin
  if (path.startsWith("/admin-dashboard") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Chặn route Nhà tuyển dụng nếu không phải Employer
  if (path.startsWith("/employer-dashboard") || path.startsWith("/post-job")) {
    if (role !== "employer") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/employer-dashboard/:path*",
    "/post-job/:path*",
    "/portfolio/:path*",
  ],
};
