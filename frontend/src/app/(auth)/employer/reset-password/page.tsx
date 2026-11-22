import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import EmployerLoginBanner from "@/components/auth/EmployerLoginBanner";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu Nhà tuyển dụng | ViecNgon",
};

function EmployerResetSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 space-y-5 animate-pulse">
      <div className="h-8 w-44 bg-surface-subtle rounded" />
      <div className="h-7 w-56 bg-surface-subtle rounded" />
      <div className="h-11 w-full bg-surface-subtle rounded-lg" />
      <div className="h-11 w-full bg-surface-subtle rounded-lg" />
      <div className="h-11 w-full bg-surface-subtle rounded-lg" />
    </div>
  );
}

export default function EmployerResetPasswordPage() {
  return (
    <main className="min-h-screen flex bg-surface-card">
      <div className="hidden md:block md:w-1/2">
        <EmployerLoginBanner />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <Suspense fallback={<EmployerResetSkeleton />}>
          <ResetPasswordForm portal="employer" />
        </Suspense>
      </div>
    </main>
  );
}
