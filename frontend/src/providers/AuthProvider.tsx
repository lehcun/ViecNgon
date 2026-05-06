"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Nếu đã lấy được trạng thái rồi thì không cần gọi lại API nữa
    if (isInitialized) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // BẮT BUỘC: Ra lệnh cho trình duyệt gửi kèm HttpOnly Cookie
        });

        if (!res.ok) {
          throw new Error("Chưa đăng nhập hoặc token hết hạn");
        }

        const userData = await res.json();

        // Gọi hàm này sẽ lưu user và tự động đổi isInitialized thành true
        setUser(userData);
      } catch (error) {
        // Nếu API lỗi (chưa đăng nhập) -> Set user thành null
        // Quan trọng: Phải chắc chắn hàm setUser(null) cũng đổi isInitialized thành true
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser, isInitialized]);

  // ⛔ CHẶN UI: Khi chưa gọi xong API, tuyệt đối không render children
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          {/* Vòng xoay loading của Tailwind */}
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">
            Đang đồng bộ dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  // ✅ CHO PHÉP CHẠY: Gọi API xong (dù có user hay ko), mới cho phép các component con render
  return <>{children}</>;
}
