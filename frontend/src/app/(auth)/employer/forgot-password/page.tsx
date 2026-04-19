import type { Metadata } from "next";
import EmployerForgotPasswordForm from "@/components/auth/EmployerForgotPasswordForm";
import EmployerLoginBanner from "@/components/auth/EmployerLoginBanner"; // Tái sử dụng Banner cũ

export const metadata: Metadata = {
  title: "Quên mật khẩu Nhà tuyển dụng | ViecNgon",
};

export default function EmployerForgotPasswordPage() {
  return (
    <main className="min-h-screen flex bg-white">
      {/* Cột trái (Banner) - Ẩn trên mobile, chiếm 1/2 trên desktop */}
      <div className="hidden md:block md:w-1/2">
        <EmployerLoginBanner />
      </div>

      {/* Cột phải (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        {/* Nút chuyển đổi ngôn ngữ (EN | VI) đặt góc phải trên */}
        <div className="absolute top-8 right-8 flex items-center gap-2 text-sm font-bold text-slate-400">
          <button className="hover:text-primary transition-colors">EN</button>
          <span>|</span>
          <button className="text-slate-800">VI</button>
        </div>

        <EmployerForgotPasswordForm />
      </div>
    </main>
  );
}
