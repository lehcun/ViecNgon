"use client";

import { useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(
      "Nếu email tồn tại trên hệ thống, hướng dẫn khôi phục sẽ được gửi tới hộp thư của bạn.",
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-8"
      >
        <FiArrowLeft size={16} /> Quay lại đăng nhập
      </Link>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-bold text-text-main mb-2">
          Quên mật khẩu?
        </h1>
        <p className="text-text-muted text-sm leading-relaxed">
          Nhập địa chỉ email liên kết với tài khoản của bạn để nhận hướng dẫn
          đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-text-main mb-1.5">
            Email của bạn
          </label>
          <div className="relative">
            <FiMail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ví dụ: cuong.le@gmail.com"
              className="w-full h-11 pl-10 pr-4 border border-border-default rounded-lg outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all text-sm bg-surface-card"
              required
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Gửi liên kết khôi phục
        </Button>
      </form>

      <div className="mt-8 p-4 bg-surface-subtle border border-border-default rounded-xl text-sm text-center">
        <p className="text-text-secondary">Cần hỗ trợ thêm?</p>
        <a
          href="mailto:love@viecngon.vn"
          className="text-primary font-semibold hover:underline mt-1 inline-block"
        >
          Liên hệ love@viecngon.vn
        </a>
      </div>
    </div>
  );
}
