import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  role: string;
  isExpired: boolean;
}

/**
 * Bản đồ chuyển hướng về Dashboard chính thức theo từng vai trò người dùng
 */
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  ADMIN: "/admin",
  NHATUYENDUNG: "/employer-dashboard",
  UNGVIEN: "/dashboard",
};

/**
 * Giải mã JWT an toàn trong Edge Runtime
 * Kiểm tra cả tính hợp lệ của Payload và thời hạn hết hạn (exp)
 */
function decodeToken(token: string): DecodedToken | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    const parsed = JSON.parse(jsonPayload);

    if (!parsed?.role) return null;

    // Kiểm tra thời hạn exp (exp tính bằng giây, Date.now() tính bằng ms)
    const isExpired =
      typeof parsed.exp === "number" ? parsed.exp * 1000 < Date.now() : false;

    return {
      role: parsed.role,
      isExpired,
    };
  } catch (error) {
    console.error("JWT Decode Error in Middleware:", error);
    return null;
  }
}

/**
 * Danh sách các đường dẫn Xác thực & Công khai không yêu cầu đăng nhập
 */
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/employer", // Trang giới thiệu & đăng ký tuyển dụng của NTD
  "/employer/login",
  "/employer/forgot-password",
  "/admin/login",
];

// Định nghĩa quy tắc bảo mật theo vai trò (RBAC) cho các route được bảo vệ
const routeAccessRules = [
  { prefix: "/admin", allowedRoles: ["ADMIN"], loginUrl: "/admin/login" },
  {
    prefix: "/employer-dashboard",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/employer/company-profile",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/employer/jobs",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/employer/applications",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/employer/campaigns",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/employer/pricing",
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
  {
    prefix: "/jobs",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/applications",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/campaigns",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/company-profile",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  {
    prefix: "/pricing",
    allowedRoles: ["NHATUYENDUNG"],
    loginUrl: "/employer/login",
  },
  { prefix: "/dashboard", allowedRoles: ["UNGVIEN"], loginUrl: "/login" },
  { prefix: "/my-jobs", allowedRoles: ["UNGVIEN"], loginUrl: "/login" },
  { prefix: "/cv-profile", allowedRoles: ["UNGVIEN"], loginUrl: "/login" },
  {
    prefix: "/job_applications",
    allowedRoles: ["UNGVIEN"],
    loginUrl: "/login",
  },
  {
    regex: /^\/job-it\/.*\/job_applications/,
    allowedRoles: ["UNGVIEN"],
    loginUrl: "/login",
  },
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;
  // Chuẩn hóa path loại bỏ trailing slash nếu có
  const normalizedPath =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  const decoded = token ? decodeToken(token) : null;
  const isTokenValid = Boolean(decoded && !decoded.isExpired);
  const userRole = isTokenValid && decoded ? decoded.role : null;

  // 1. NẾU LÀ TRANG AUTH CÔNG KHAI (Login, Register, Forgot Password...)
  const isAuthPage = authRoutes.some(
    (authPath) =>
      normalizedPath === authPath || normalizedPath.startsWith(`${authPath}/`),
  );

  if (isAuthPage) {
    // 1.1. Nếu người dùng ĐÃ ĐĂNG NHẬP VỚI TOKEN HỢP LỆ -> Chuyển hướng về Dashboard tương ứng
    if (isTokenValid && userRole) {
      const redirectTo = ROLE_DASHBOARD_MAP[userRole] || "/";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // 1.2. Nếu CHƯA ĐĂNG NHẬP hoặc TOKEN ĐÃ HẾT HẠN:
    // Cho phép xem trang auth bình thường! (nếu token hết hạn thì xóa cookie để dọn dẹp)
    const response = NextResponse.next();
    if (token && decoded?.isExpired) {
      response.cookies.delete("access_token");
    }
    return response;
  }

  // 2. NẾU TOKEN ĐÃ HẾT HẠN (Expired) KHI VÀO TRANG BẢO VỆ:
  // Xóa sạch cookie rác và bắt buộc đăng nhập lại
  if (token && decoded?.isExpired) {
    for (const rule of routeAccessRules) {
      if (normalizedPath === rule.loginUrl) continue;

      const isMatch = rule.prefix
        ? normalizedPath.startsWith(rule.prefix)
        : rule.regex && rule.regex.test(normalizedPath);

      if (isMatch) {
        const loginUrl = new URL(rule.loginUrl, request.url);
        loginUrl.searchParams.set("callbackUrl", path);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("access_token");
        return response;
      }
    }
  }

  // 3. KIỂM TRA QUYỀN TRUY CẬP (RBAC Access Control)
  for (const rule of routeAccessRules) {
    // Tuyệt đối không áp dụng quy tắc nếu đang ở chính trang loginUrl của rule
    if (normalizedPath === rule.loginUrl) continue;

    const isMatch = rule.prefix
      ? normalizedPath.startsWith(rule.prefix)
      : rule.regex && rule.regex.test(normalizedPath);

    if (isMatch) {
      // 3.1. Nếu chưa có token hợp lệ -> Chuyển hướng về trang đăng nhập tương ứng
      if (!isTokenValid || !userRole) {
        const loginUrl = new URL(rule.loginUrl, request.url);
        loginUrl.searchParams.set("callbackUrl", path);
        const response = NextResponse.redirect(loginUrl);
        if (token) {
          response.cookies.delete("access_token");
        }
        return response;
      }

      // 3.2. Nếu có token nhưng ROLE KHÔNG ĐƯỢC PHÉP truy cập trang này
      // (Ví dụ: Nhà tuyển dụng cố vào /dashboard của Ứng viên, hoặc Ứng viên cố vào /employer-dashboard)
      // -> Thay vì báo lỗi 403-forbidden, tự động chuyển hướng người dùng về Dashboard tương ứng của họ
      if (!rule.allowedRoles.includes(userRole)) {
        const targetDashboard = ROLE_DASHBOARD_MAP[userRole] || "/";

        // Tránh vòng lặp nếu đường dẫn hiện tại chính là đích đến
        if (normalizedPath !== targetDashboard) {
          return NextResponse.redirect(new URL(targetDashboard, request.url));
        }

        return NextResponse.redirect(new URL("/", request.url));
      }

      // Hợp lệ -> Cho phép đi tiếp
      break;
    }
  }

  return NextResponse.next();
}

// Bỏ qua các file tĩnh, ảnh, api nội bộ để tối ưu hiệu năng
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
