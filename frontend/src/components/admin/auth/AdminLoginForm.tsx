"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import LogoViecNgon from "@/components/LogoViecNgon";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/store/authStore";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const { login, isPending } = useLogin();
  const { clearAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    login(
      { email: email.trim(), password },
      {
        onSuccess: (data) => {
          if (data?.user?.role !== "ADMIN") {
            clearAuth();
            setErrorMessage(
              "Tài khoản này không có quyền truy cập cổng Quản trị viên (ADMIN)!",
            );
            toast.error("Từ chối truy cập: Bạn không phải Quản trị viên!");
            return;
          }

          toast.success("Đăng nhập Quản trị viên thành công!");
          router.replace(callbackUrl);
        },
        onError: (err) => {
          const msg =
            err?.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
          setErrorMessage(msg);
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="bg-primary-dark/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-7 md:p-8 shadow-2xl shadow-black/60">
      <div className="flex flex-col items-center text-center mb-7">
        <div className="mb-3">
          <LogoViecNgon
            logoTextColor="text-white"
            role="admin"
            href="/"
          />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Cổng Quản Trị Hệ Thống
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Đăng nhập bằng tài khoản Quản trị viên (Super Admin)
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-danger/15 border border-danger/30 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Quản trị
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@viecngon.vn"
              className="w-full h-11 pl-10 pr-4 bg-slate-900/80 border border-slate-700/80 focus:border-primary focus:bg-slate-900 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-primary/25 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-11 bg-slate-900/80 border border-slate-700/80 focus:border-primary focus:bg-slate-900 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-primary/25 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 mt-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Đang xác thực quyền...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Đăng nhập Quản trị viên</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Quay lại trang chủ ViecNgon</span>
        </Link>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Khu vực bảo mật nội bộ. Mọi hoạt động truy cập đều được ghi nhật ký.
        </p>
      </div>
    </div>
  );
}
