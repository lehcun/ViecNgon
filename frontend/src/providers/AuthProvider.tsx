"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/employer-dashboard",
  "/employer",
  "/post-job",
  "/jobs",
  "/applications",
  "/campaigns",
  "/my-jobs",
  "/cv-profile",
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // BẮT BUỘC: Gửi kèm HttpOnly Cookie
        });

        if (!res.ok) {
          throw new Error("Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập");
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        setUser(null);

        // Nếu người dùng đang cố truy cập trực tiếp các trang Dashboard bảo vệ
        // mà token đã chết hoặc hết hạn -> Tự động chuyển hướng về trang đăng nhập
        const isProtected = PROTECTED_PREFIXES.some((prefix) =>
          pathname.startsWith(prefix),
        );

        if (isProtected) {
          const isEmployerRoute =
            pathname.startsWith("/employer") ||
            pathname.startsWith("/post-job") ||
            pathname.startsWith("/jobs") ||
            pathname.startsWith("/applications") ||
            pathname.startsWith("/campaigns");

          const loginUrl = isEmployerRoute ? "/employer/login" : "/login";
          router.replace(`${loginUrl}?callbackUrl=${encodeURIComponent(pathname)}`);
        }
      }
    };

    fetchUser();
  }, [setUser, isInitialized, pathname, router]);

  // ⛔ CHẶN UI: Khi chưa gọi xong API xác thực lần đầu, hiển thị loading đồng bộ
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">
            Đang đồng bộ dữ liệu người dùng...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
