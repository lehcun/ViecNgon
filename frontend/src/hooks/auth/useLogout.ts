import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

// Interface định nghĩa các tùy chọn
interface LogoutOptions {
  redirectTo?: string | false; // Có thể truyền link ('/login') hoặc truyền false để đứng im
}

export const useLogout = (
  options: LogoutOptions = { redirectTo: "/login" },
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Lấy hàm xóa dữ liệu từ Zustand store
  const clearAuth = useAuthStore((state) => state.clearAuth);

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
      // Xóa thông tin người dùng trong kho lưu trữ toàn cục (Zustand)
      clearAuth();

      // Xóa sạch bộ nhớ đệm (cache) của React Query
      queryClient.clear();

      // 3. Đưa người dùng về trang đăng nhập hoặc trang chủ
      // KIỂM TRA ĐIỀU KIỆN TRƯỚC KHI CHUYỂN TRANG
      if (options.redirectTo) {
        router.push(options.redirectTo);
      }

      // toast.success("Đã đăng xuất thành công");
    },
    onError: (error) => {
      console.error("Lỗi khi đăng xuất:", error);

      // Ngay cả khi API đăng xuất gặp lỗi (mạng yếu...), ta vẫn nên xóa trạng thái ở Frontend để đảm bảo an toàn cho người dùng.
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });
};
