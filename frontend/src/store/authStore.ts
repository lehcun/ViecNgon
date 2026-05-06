import { create } from "zustand";
import { User } from "@viecngon/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // BỔ SUNG: Cờ báo hiệu quá trình check token lần đầu đã xong
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

// 1. Khởi tạo Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false, // Mặc định là false khi trang vừa load/F5

  // Hàm này được gọi khi API /auth/me trả về kết quả
  setUser: (user: User | null) =>
    set({
      user: user,
      isAuthenticated: !!user, // Dùng trick !!user: Nếu có user thì true, nếu null thì false
      isInitialized: true, // QUAN TRỌNG: Đánh dấu là đã kiểm tra xong, bảo AuthProvider dừng xoay!
    }),

  // Hàm này được gọi khi user bấm Đăng xuất hoặc API báo lỗi token
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true, // QUAN TRỌNG: Dù bị lỗi/văng ra thì cũng phải báo là đã check xong để hết xoay
    }),
}));
