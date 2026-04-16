import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import LoginBanner from "@/components/auth/LoginBanner";

export const metadata: Metadata = {
  title: "Quên mật khẩu | ViecNgon",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <ForgotPasswordForm />
      </div>
      <div className="w-full md:w-2/5 min-h-75 md:min-h-screen bg-primary-dark text-white hidden md:block">
        <LoginBanner />
      </div>
    </main>
  );
}
