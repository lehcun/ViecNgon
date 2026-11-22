"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/lib/env";

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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const redirectIfProtected = () => {
      const normalized =
        pathname.length > 1 && pathname.endsWith("/")
          ? pathname.slice(0, -1)
          : pathname;

      const isAuthPage = AUTH_PAGES.some(
        (p) => normalized === p || normalized.startsWith(`${p}/`),
      );
      if (isAuthPage) {
        return;
      }

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
    };

    if (isInitialized) {
      if (!isAuthenticated) {
        redirectIfProtected();
      }
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          setUser(null);
          redirectIfProtected();
          return;
        }

        if (!res.ok) {
          // Lỗi tạm thời từ server (5xx): giữ nguyên trang hiện tại để tránh redirect loop /login <-> /dashboard
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch {
        // Lỗi mạng (ví dụ backend chưa bật hoặc mất kết nối tạm thời): không xóa session cookie hay đẩy về /login
      }
    };

    void fetchUser();
  }, [setUser, isInitialized, isAuthenticated, pathname, router]);

  return <>{children}</>;
}
