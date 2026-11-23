import type { Metadata } from "next";
import EmployerLoginForm from "@/components/auth/EmployerLoginForm";
import EmployerLoginBanner from "@/components/auth/EmployerLoginBanner";

export const metadata: Metadata = {
  title: "Đăng nhập Nhà tuyển dụng | ViecNgon",
};

export default function EmployerLoginPage() {
  return (
    <main className="min-h-screen flex bg-surface-card">
      <div className="hidden md:block md:w-1/2">
        <EmployerLoginBanner />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <EmployerLoginForm />
      </div>
    </main>
  );
}
