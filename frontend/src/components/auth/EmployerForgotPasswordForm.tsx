"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EmployerForgotPasswordForm() {
  return (
    <div className="w-full max-w-120 mx-auto px-6 py-12 flex flex-col justify-center min-h-screen">
      {/* Header: Logo & Title (Giữ đồng bộ với trang Login) */}
      <div className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-12">
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

        {/* Nút Quay lại */}
        <Link
          href="/employer/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Quay lại đăng nhập
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">Quên mật khẩu</h1>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            className="w-full px-4 py-3 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-slate-400"
            required
          />
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          className="w-full bg-primary text-white font-bold py-3.5 rounded-md hover:bg-primary-hover shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
        >
          Đặt lại mật khẩu
        </button>
      </form>
    </div>
  );
}
