import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginBanner from "@/components/auth/LoginBanner";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | ViecNgon",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <RegisterForm />
      </div>
      <div className="w-full md:w-2/5 min-h-75 md:min-h-screen bg-primary-dark text-white hidden md:block">
        <LoginBanner />
      </div>
    </main>
  );
}
