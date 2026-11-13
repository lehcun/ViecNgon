"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";
import { useLogout } from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function EmployerLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleError, setRoleError] = useState("");

  const router = useRouter();
  const { login, isPending, isError, error } = useLogin();
  const { mutate: silentLogout } = useLogout({ redirectTo: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleError("");

    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.user.role !== "NHATUYENDUNG") {
            setRoleError(
              "Tài khoản này không có quyền truy cập cổng Nhà tuyển dụng!",
            );
            silentLogout();
            return;
          }

          toast.success("Đăng nhập Nhà tuyển dụng thành công!");
          router.push("/employer-dashboard");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-screen">
      <div className="mb-8 text-center sm:text-left">
        <Link
          href="/"
          className="inline-flex items-center justify-center sm:justify-start gap-3 mb-7"
        >
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">
              V
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              iecNgon
            </span>
          </div>
          <div className="h-4 w-px bg-border-default" />
          <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            Employer Portal
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-text-main">
          Đăng nhập Nhà tuyển dụng
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Quản lý tin tuyển dụng IT và sàng lọc ứng viên bằng AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-main mb-1.5">
            Email doanh nghiệp
          </label>
          <input
            type="email"
            placeholder="hr@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 border border-border-default rounded-lg outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all text-sm placeholder:text-text-subtle bg-surface-card"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-text-main">
              Mật khẩu
            </label>
            <Link
              href="/employer/forgot-password"
              className="text-xs text-primary font-semibold hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-4 pr-12 border border-border-default rounded-lg outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all text-sm placeholder:text-text-subtle bg-surface-card"
              required
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-main transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {(isError || roleError) && (
          <div className="p-3 rounded-lg bg-danger-soft border border-danger-border text-danger-text text-xs font-medium">
            {roleError || error?.message || "Đăng nhập thất bại."}
          </div>
        )}

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border-default text-primary focus:ring-primary"
            />
            <span className="text-text-secondary text-sm">
              Ghi nhớ đăng nhập
            </span>
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          loadingText="Đang xác thực..."
          className="w-full mt-2"
        >
          Đăng nhập hệ thống
        </Button>
      </form>

      <div className="mt-10 pt-6 border-t border-border-subtle text-xs text-text-muted space-y-1.5">
        <p className="font-semibold text-text-secondary mb-2">
          Hỗ trợ doanh nghiệp:
        </p>
        <p>Hotline TP.HCM / Hà Nội / Đà Nẵng: 1900 6868</p>
        <p>Email hỗ trợ: love@viecngon.vn</p>
      </div>
    </div>
  );
}
