import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

// 1. Tách riêng Data Fetching (Không dính dáng đến React)
const fetchAuthMe = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Chưa đăng nhập hoặc phiên làm việc hết hạn");
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
        // Nếu lỗi (401), dọn dẹp kho dữ liệu để Navbar hiện nút "Đăng nhập"
        clearAuth();
        return null; // Trả về null để tránh React Query coi đây là lỗi nghiêm trọng
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
