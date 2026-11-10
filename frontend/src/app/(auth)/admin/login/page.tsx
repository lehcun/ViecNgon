import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập Quản trị viên | ViecNgon Admin",
  description: "Cổng đăng nhập hệ thống quản trị ViecNgon Portal",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#070A12] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Hiệu ứng ánh sáng Gradient ngầm phía sau */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-90 h-90 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

      {/* Form Container */}
      <div className="w-full max-w-md relative z-10">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center text-slate-400 text-sm">
              Đang tải cổng quản trị...
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}

