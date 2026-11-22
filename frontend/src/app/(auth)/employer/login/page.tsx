import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import EmployerLoginForm from "@/components/auth/EmployerLoginForm";
import EmployerLoginBanner from "@/components/auth/EmployerLoginBanner";

export const metadata: Metadata = {
  title: "Đăng nhập Nhà tuyển dụng | ViecNgon",
};

export default function EmployerLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-card">
      <Navbar variant="dark" />

      <div className="flex-1 pt-16 flex bg-surface-card">
        <div className="hidden md:block md:w-1/2">
          <EmployerLoginBanner />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <EmployerLoginForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}
