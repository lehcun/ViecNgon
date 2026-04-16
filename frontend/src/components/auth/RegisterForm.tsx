"use client";

import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import Link from "next/link";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8 text-center md:text-left">
        <Link href="/">
          <span className="text-4xl font-extrabold text-primary">ViecNgon</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">
          Tạo tài khoản mới
        </h1>
        <p className="text-slate-500 text-sm">
          Gia nhập cộng đồng IT chất lượng nhất Việt Nam ngay hôm nay.
        </p>
      </div>

      <form className="space-y-5">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Họ và tên
          </label>
          <div className="relative">
            <FiUser
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <FiMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tạo mật khẩu (tối thiểu 8 ký tự)"
              className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        {/* Xác nhận Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Điều khoản */}
        <div className="flex items-start gap-2 mt-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
          />
          <label
            htmlFor="terms"
            className="text-sm text-slate-600 leading-tight"
          >
            Tôi đã đọc và đồng ý với{" "}
            <a href="#" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-primary hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của ViecNgon.
          </label>
        </div>

        {/* Nút Đăng ký */}
        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-primary-hover shadow-md shadow-primary/30 transition-all active:scale-[0.98]"
        >
          Đăng ký ngay
        </button>
      </form>

      {/* Liên kết Đăng nhập */}
      <div className="text-center mt-6 text-slate-600 text-sm">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
