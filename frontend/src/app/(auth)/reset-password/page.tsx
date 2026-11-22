import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import LoginBanner from "@/components/auth/LoginBanner";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | ViecNgon",
};

function ResetPasswordSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-5 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-surface-subtle" />
      <div className="h-7 w-56 bg-surface-subtle rounded" />
      <div className="h-4 w-72 bg-surface-subtle rounded" />
      <div className="h-11 w-full bg-surface-subtle rounded-lg" />
      <div className="h-11 w-full bg-surface-subtle rounded-lg" />
      <div className="h-11 w-full bg-surface-subtle rounded-lg" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface-card">
      <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
        <Suspense fallback={<ResetPasswordSkeleton />}>
          <ResetPasswordForm portal="candidate" />
        </Suspense>
      </div>
      <div className="w-full md:w-2/5 min-h-75 md:min-h-screen bg-primary-dark text-white hidden md:block">
        <LoginBanner />
      </div>
    </main>
  );
}
