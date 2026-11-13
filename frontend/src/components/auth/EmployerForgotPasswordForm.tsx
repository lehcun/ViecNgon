"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export default function EmployerForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(
      "Yêu cầu đặt lại mật khẩu đã được ghi nhận. Vui lòng kiểm tra email doanh nghiệp.",
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-screen">
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-10">
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
        </div>

        <Link
          href="/employer/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mb-5"
        >
          <ChevronLeft size={16} /> Quay lại đăng nhập
        </Link>

        <h1 className="text-2xl font-bold text-text-main">Quên mật khẩu</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-text-main mb-1.5"
          >
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email doanh nghiệp"
            className="w-full h-11 px-4 border border-border-default rounded-lg outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all text-sm placeholder:text-text-subtle bg-surface-card"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Đặt lại mật khẩu
        </Button>
      </form>
    </div>
  );
}
