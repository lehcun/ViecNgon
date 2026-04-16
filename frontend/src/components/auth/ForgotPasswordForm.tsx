"use client";

import { FiMail, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function ForgotPasswordForm() {
  return (
    <div className="max-w-md mx-auto">
      {/* Nút quay lại */}
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-8"
      >
        <FiArrowLeft size={16} /> Quay lại đăng nhập
      </Link>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Quên mật khẩu?
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Đừng lo lắng! Vui lòng nhập địa chỉ email liên kết với tài khoản của
          bạn, chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email của bạn
          </label>
          <div className="relative">
            <FiMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Ví dụ: cuong.le@gmail.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-primary-hover shadow-md shadow-primary/30 transition-all active:scale-[0.98]"
        >
          Gửi liên kết khôi phục
        </button>
      </form>

      {/* Box Hỗ trợ */}
      <div className="mt-10 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center">
        <p className="text-slate-600">Bạn vẫn không thể truy cập?</p>
        <a
          href="#"
          className="text-primary font-medium hover:underline mt-1 inline-block"
        >
          Liên hệ bộ phận hỗ trợ
        </a>
      </div>
    </div>
  );
}
