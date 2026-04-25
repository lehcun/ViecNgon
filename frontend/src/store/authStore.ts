import { create } from "zustand";

// 1. Định nghĩa kiểu dữ liệu User dựa trên thông tin Backend (NestJS) trả về từ JWT
interface User {
  sub: string; // Mã tài khoản
  email: string;
  role: string; // Vai trò (UNGVIEN, NHATUYENDUNG, ADMIN)
}

// 2. Định nghĩa cấu trúc của Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

// 3. Khởi tạo Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Trạng thái ban đầu: chưa có thông tin user
  isAuthenticated: false, // Trạng thái ban đầu: chưa đăng nhập

  // Hàm này được gọi khi đăng nhập thành công hoặc check token (useUser) thành công
  setUser: (user: any) =>
    set({
      user: user,
      isAuthenticated: !!user, // Nếu user có dữ liệu thì ép kiểu thành true, ngược lại là false
    }),

  // Hàm này được gọi khi user bấm Đăng xuất (useLogout) hoặc token hết hạn
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
