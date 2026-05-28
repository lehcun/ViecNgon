import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. TỐI ƯU HÓA HÀM DECODE (Sử dụng chuẩn Buffer của Edge Runtime, chống crash)
function getRoleFromToken(token: string): string | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    // Đảm bảo padding Base64 chuẩn
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");

    const parsed = JSON.parse(jsonPayload);
    return parsed?.role || null;
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null; // Token lỗi thì coi như không có quyền
  }
}

// 2. ĐỊNH NGHĨA QUY TẮC BẢO MẬT (RBAC - Role Based Access Control)
// Thêm bớt quyền hoặc route chỉ cần sửa ở mảng này, không cần đụng vào logic if/else
const routeAccessRules = [
  { prefix: "/admin", allowedRoles: ["ADMIN"], loginUrl: "/admin/login" },
  {
    prefix: "/employer-dashboard",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/post-job",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/jobs/manage",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  { prefix: "/dashboard", allowedRoles: ["UNGVIEN"], loginUrl: "/login" },
  {
    prefix: "/job_applications",
    allowedRoles: ["UNGVIEN"],
    loginUrl: "/login",
  },
];

const authRoutes = ["/login", "/employer/login", "/admin/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  // Lấy Role từ token hiện tại
  const userRole = token ? getRoleFromToken(token) : null;

  // 3. XỬ LÝ REDIRECT KHI ĐÃ LOGIN MÀ VÀO TRANG AUTH (Login/Register)
  if (token && userRole && authRoutes.includes(path)) {
    const redirectMap: Record<string, string> = {
      ADMIN: "/admin",
      NHATUYENDUNG: "/employer-dashboard",
      UNGVIEN: "/dashboard",
    };
    const redirectTo = redirectMap[userRole] || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // 4. KIỂM TRA QUYỀN TRUY CẬP (The Magic Loop)
  for (const rule of routeAccessRules) {
    // Nếu URL hiện tại bắt đầu bằng một trong các prefix được bảo vệ
    if (path.startsWith(rule.prefix)) {
      // Nếu chưa có token -> Đẩy về trang đăng nhập tương ứng, có lưu lại callbackUrl
      if (!token || !userRole) {
        const loginUrl = new URL(rule.loginUrl, request.url);
        loginUrl.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(loginUrl);
      }

      // Nếu có token nhưng ROLE không nằm trong danh sách cho phép -> Cấm truy cập
      if (!rule.allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/403-forbidden", request.url)); // Tới trang báo lỗi không có quyền (hoặc về "/")
      }

      // Vượt qua kiểm tra -> Cho phép đi tiếp
      break;
    }
  }

  return NextResponse.next();
}

// 5. MATCHER BẢO TRÌ SẠCH SẼ
export const config = {
  matcher: [
    // Bỏ qua các file tĩnh, ảnh, api nội bộ để tăng tốc hiệu năng
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
