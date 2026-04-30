"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLogin } from "@/hooks/auth/useLogin";
import { useLogout } from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";

export default function EmployerLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleError, setRoleError] = useState(""); // State chứa thông báo lỗi sai vai trò

  const router = useRouter();
  const { login, isPending, isError, error } = useLogin();
  // Đăng xuất ngầm
  const { mutate: silentLogout } = useLogout({ redirectTo: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleError(""); // Xóa lỗi cũ khi thử lại

    login(
      { email, password },
      {
        onSuccess: (data) => {
          // Kiểm tra role của tài khoản đã đũng là nhatuyendung chưa
          if (data.user.vaiTro !== "NHATUYENDUNG") {
            // 1. Nếu là Ứng viên đi lạc, hiện thông báo lỗi
            setRoleError(
              "Tài khoản này không có quyền truy cập cổng Nhà tuyển dụng!",
            );

            // 2. LẬP TỨC XÓA COOKIE: Vì API login đã trót cấp cookie, ta phải gọi logout để hủy nó ngay
            silentLogout();
            return;
          }

          // Đúng là HR -> Cho phép vào trang quản trị
          router.push("/employer-dashboard");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-120 mx-auto px-6 py-12 flex flex-col justify-center min-h-screen">
      {/* Header: Logo & Title */}
      <div className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              V
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              iecNgon
            </span>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <span className="text-sm font-black tracking-widest text-slate-800 uppercase">
            Customer Admin Site
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Đăng nhập ViecNgon Customer
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-slate-400"
            required
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-slate-400"
            required
          />

          {/* Hiển thị lỗi từ API (Sai mật khẩu, email...) */}
          {isError && (
            <p className="text-red-500 text-sm font-medium">{error.message}</p>
          )}

          {/* Hiển thị lỗi Phân quyền (Sai role) */}
          {roleError && (
            <p className="text-red-500 text-sm font-medium">{roleError}</p>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Ghi nhớ & Quên mật khẩu */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
              Ghi nhớ đăng nhập
            </span>
          </label>
          <Link
            href="/employer/forgot-password"
            className="text-primary font-semibold hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Policy Text */}
        <p className="text-[13px] text-slate-500 leading-relaxed py-2">
          Bằng việc đăng nhập, bạn đồng ý với các
          <a href="#" className="text-primary hover:underline">
            Điều khoản dịch vụ
          </a>
          và
          <a href="#" className="text-primary hover:underline">
            Chính sách quyền riêng tư
          </a>
          của ViecNgon liên quan đến thông tin riêng tư của bạn.
        </p>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full font-bold py-3.5 rounded-md shadow-md shadow-primary/20 transition-all active:scale-[0.98] ${
            isPending
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
          }`}
        >
          {isPending ? "Đang xác thực..." : "Đăng nhập hệ thống"}
        </button>
      </form>

      {/* Footer Support Info */}
      <div className="mt-12 pt-8 border-t border-slate-100 text-[13px] text-slate-600 space-y-2">
        <p className="font-semibold text-slate-800 mb-3">
          Bạn chưa có tài khoản khách hàng? Liên hệ chúng tôi:
        </p>
        <p className="flex items-center gap-2">
          📞 Hồ Chí Minh: (+84) 123 456 789
        </p>
        <p className="flex items-center gap-2">📞 Đà nẵng: (+84) 983 333 333</p>
        <p className="flex items-center gap-2">✉️ Email: love@viecngon.vn</p>
      </div>
    </div>
  );
}
