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
      </div>

      {/* Cột bên phải: Banner đồ họa */}
      <div className="w-full md:w-2/5 min-h-75 md:min-h-screen bg-primary text-white">
        <LoginBanner />
      </div>
    </main>
  );
}
