import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

export const useUser = () => {
  const { setUser, clearAuth } = useAuthStore();

  const {
    data: user,
    isLoading: isCheckingAuth,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        clearAuth(); // Dọn dẹp kho dữ liệu nếu cookie hết hạn hoặc không hợp lệ
        return null;
      }

      const userData = await response.json();
      setUser(userData); // Lưu thông tin người dùng vào Global State
      return userData;
    },
    retry: false, // Chỉ kiểm tra 1 lần lúc load trang, không cố gọi lại nếu đã lỡ đăng xuất
    refetchOnWindowFocus: false, // Không tự động gọi lại mỗi khi chuyển tab qua lại
  });

  return { user, isCheckingAuth, error };
};
