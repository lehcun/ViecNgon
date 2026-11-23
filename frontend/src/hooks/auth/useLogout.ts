import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

// Interface định nghĩa các tùy chọn
interface LogoutOptions {
  redirectTo?: string | false; // Có thể truyền link ('/login') hoặc truyền false để đứng im
  replace?: boolean; // Thay thế history hiện tại để không lưu lại trang trước đó
}

export const useLogout = (options?: LogoutOptions) => {
  const redirectTo =
    options?.redirectTo === undefined ? "/login" : options.redirectTo;
  const shouldReplace = options?.replace === true;
  const router = useRouter();
  const queryClient = useQueryClient();
  // Lấy hàm xóa dữ liệu từ Zustand store

  const { clearAuth } = useAuthStore();

  const navigateAfterLogout = () => {
    if (!redirectTo) return;
    if (shouldReplace && typeof window !== "undefined") {
      window.location.replace(redirectTo);
      return;
    }
    router.push(redirectTo);
  };

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Không thể kết nối với máy chủ để đăng xuất");
      }

      return response.json();
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigateAfterLogout();
    },
    onError: (error) => {
      console.error("Lỗi khi đăng xuất:", error);

      // Ngay cả khi API đăng xuất gặp lỗi (mạng yếu...), ta vẫn xóa trạng thái ở Frontend để đảm bảo an toàn.
      clearAuth();
      queryClient.clear();
      navigateAfterLogout();
    },
  });
};
