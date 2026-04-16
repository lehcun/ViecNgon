import LoginBanner from "@/components/auth/LoginBanner";
import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | ViecNgon",
  description:
    "Chào mừng bạn đến với ViecNgon - Nền tảng kết nối việc làm lý tưởng.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Cột bên trái: Form đăng nhập */}
      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col">
        <div className="grow">
          <LoginForm />
        </div>

        {/* Footer thông tin hỗ trợ */}
        <footer className="text-center text-gray-500 text-sm mt-12">
          <p className="mb-2">Bạn gặp khó khăn khi tạo tài khoản?</p>
          <p>
            Vui lòng gọi tới số{" "}
            <a
              href="tel:02466805588"
              className="text-gray-700 font-semibold hover:underline"
            >
              (024) 6680 5588
            </a>{" "}
            (giờ hành chính).
          </p>
          <p className="mt-8">
            © 2026 ViecNgon Vietnam Vietnam JSC. All Rights Reserved.
          </p>
        </footer>
      </div>

      {/* Cột bên phải: Banner đồ họa */}
      <div className="w-full md:w-2/5 min-h-75 md:min-h-screen bg-primary text-white">
        <LoginBanner />
      </div>
    </main>
  );
}
