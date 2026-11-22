import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

class AuthExpiredError extends Error {}

// 1. Tách riêng Data Fetching (Không dính dáng đến React)
const fetchAuthMe = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    throw new AuthExpiredError("Chưa đăng nhập hoặc phiên làm việc hết hạn");
  }

  if (!response.ok) {
    throw new Error("Không thể kiểm tra phiên làm việc lúc này");
  }

  return response.json();
};

// 2. Custom Hook: Kết nối giữa Server State (React Query) và Global State (Zustand)
export const useUser = () => {
  // Lấy cả 2 hàm từ Store để xử lý đồng bộ
  const { setUser, clearAuth } = useAuthStore();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const userData = await fetchAuthMe();

        // Data Layer: Nếu thành công, cất ngay vào kho Zustand để Navbar tự động hiện tên
        setUser(userData);
        return userData;
      } catch (error) {
        // Chỉ clearAuth khi backend xác nhận token hết hạn / không hợp lệ (401/403)
        // Tránh đánh dấu unauthenticated khi backend tạm tắt hoặc lỗi mạng khiến AuthProvider redirect vòng
        if (error instanceof AuthExpiredError) {
          clearAuth();
        }
        return null;
      }
    },
    retry: false, // Chỉ check 1 lần lúc tải trang
    refetchOnWindowFocus: false, // Tránh gọi API liên tục khi user chuyển tab qua lại
  });

  // Chỉ expose những thứ thật sự cần thiết ra ngoài
  return {
    user: query.data,
    isCheckingAuth: query.isLoading,
    error: query.error,
  };
};
