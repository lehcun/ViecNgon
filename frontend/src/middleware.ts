import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hàm giải mã JWT Payload thủ công (Tương thích 100% với Edge Runtime của Next.js)
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Giải mã Base64 sang chuỗi JSON một cách an toàn (tránh lỗi ký tự tiếng Việt)
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  // --- LẤY ROLE TỪ TOKEN ---
  let role = null;
  if (token) {
    const payload = decodeJwt(token);
    role = payload?.role; // Theo log JWT của bạn, key này tên là 'role' ('UNGVIEN' hoặc 'NHATUYENDUNG')
  }

  // --- 1. BẢO VỆ CỔNG NHÀ TUYỂN DỤNG ---
  const isEmployerRoute =
    path.startsWith("/employer-dashboard") ||
    path.startsWith("/post-job") ||
    path.startsWith("/jobs/manage"); // (Lưu ý: Sửa lại /jobs-manage thành /jobs/manage cho đồng bộ với matcher bên dưới)

  if (isEmployerRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/employer/login", request.url));
    }
    if (role !== "NHATUYENDUNG") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // --- 2. BẢO VỆ CÁC TRANG CỦA ỨNG VIÊN ---
  // Dùng logic khéo léo để tránh nhầm lẫn giữa "/dashboard" và "/employer-dashboard"
  const isCandidateRoute =
    (path.startsWith("/dashboard") &&
      !path.startsWith("/employer-dashboard")) ||
    path.includes("/job_applications");

  if (isCandidateRoute) {
    if (!token) {
      // (Mẹo UX): Đẩy về trang login kèm return URL để user login xong được back lại trang ứng tuyển
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url),
      );
    }
    if (role !== "UNGVIEN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // --- 3. ĐÃ LOGIN THÌ KHÔNG CHO VÀO LẠI TRANG LOGIN/REGISTER NỮA ---
  const isAuthRoute =
    path === "/login" || path === "/employer/login" || path === "/register";

  if (token && isAuthRoute) {
    // Tự động điều hướng về đúng màn hình tương ứng với Role
    const redirectUrl =
      role === "NHATUYENDUNG" ? "/employer-dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

// --- 4. CẤU HÌNH MATCHER ---
export const config = {
  matcher: [
    // Các route của HR
    "/employer-dashboard/:path*",
    "/post-job/:path*",
    "/jobs/manage/:path*",

    // Các route Auth
    "/login",
    "/employer/login",
    "/register",

    // Các route của Ứng viên
    "/dashboard/:path*",
    "/job_applications/:path*",
    "/job-it/:slug/job_applications/:path*",
  ],
};
