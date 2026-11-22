import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
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
    <div className="min-h-screen flex flex-col bg-surface-card">
      <Navbar variant="dark" />

      <div className="flex-1 pt-16 flex flex-col md:flex-row bg-surface-card">
        {/* Cột bên trái: Form đăng nhập */}
        <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
          <LoginForm />
        </div>

        {/* Cột bên phải: Banner đồ họa */}
        <div className="w-full md:w-2/5 min-h-75 bg-primary-dark text-white">
          <LoginBanner />
        </div>
      </div>

      <Footer />
    </div>
  );
}
