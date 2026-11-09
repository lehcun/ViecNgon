"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/employer-dashboard",
  "/employer-jobs",
  "/employer-company-profile",
  "/employer/applications",
  "/employer/campaigns",
  "/employer/pricing",
  "/post-job",
  "/applications",
  "/campaigns",
  "/company-profile",
  "/pricing",
  "/my-jobs",
  "/cv-profile",
];

const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/employer",
  "/employer/login",
  "/employer/forgot-password",
  "/admin/login",
];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã lấy được trạng thái rồi thì không cần gọi lại API nữa
    if (isInitialized) return;

    const fetchUser = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          credentials: "include", // BẮT BUỘC: Gửi kèm HttpOnly Cookie
        });

        if (!res.ok) {
          throw new Error("Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập");
        }

        const userData = await res.json();
        setUser(userData);
      } catch {
        setUser(null);

        // Chuẩn hóa path loại bỏ trailing slash
        const normalized =
          pathname.length > 1 && pathname.endsWith("/")
            ? pathname.slice(0, -1)
            : pathname;

        // Nếu người dùng đang ở bất kỳ trang Auth/Login/Register nào, TUYỆT ĐỐI KHÔNG redirect
        const isAuthPage = AUTH_PAGES.some(
          (p) => normalized === p || normalized.startsWith(`${p}/`),
        );
        if (isAuthPage) {
          return;
        }

        // Nếu người dùng đang cố truy cập trực tiếp các trang Dashboard bảo vệ
        // mà token đã chết hoặc hết hạn -> Tự động chuyển hướng về trang đăng nhập
        const isProtected = PROTECTED_PREFIXES.some((prefix) =>
          normalized.startsWith(prefix),
        );

        if (isProtected) {
          const isEmployerRoute =
            normalized.startsWith("/employer") ||
            normalized.startsWith("/post-job") ||
            normalized.startsWith("/employer-jobs") ||
            normalized.startsWith("/applications") ||
            normalized.startsWith("/campaigns") ||
            normalized.startsWith("/company-profile");

          const loginUrl = isEmployerRoute ? "/employer/login" : "/login";
          if (normalized !== loginUrl) {
            router.replace(
              `${loginUrl}?callbackUrl=${encodeURIComponent(pathname)}`,
            );
          }
        }
      }
    };

    fetchUser();
  }, [setUser, isInitialized, pathname, router]);

  return <>{children}</>;
}
