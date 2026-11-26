"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Mail, ArrowRight, Home } from "lucide-react";

interface EmployerRegisterSuccessProps {
  companyName: string;
  email: string;
}

export default function EmployerRegisterSuccess({
  companyName,
  email,
}: EmployerRegisterSuccessProps) {
  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-success-soft border border-success-border text-success-text flex items-center justify-center">
          <CheckCircle2 size={30} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          Đăng ký hồ sơ doanh nghiệp thành công!
        </h2>
        <p className="text-sm text-text-secondary max-w-md leading-relaxed">
          Hồ sơ của <strong className="text-text-primary">{companyName}</strong>{" "}
          đã được tiếp nhận và chuyển tới Quản trị viên ViecNgon để xác thực.
        </p>
      </div>

      <div className="rounded-xl bg-surface-page border border-border-default p-4 space-y-3 text-xs text-text-secondary">
        <div className="flex items-start gap-2.5">
          <Clock size={16} className="text-warning-text shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-text-primary">
              Trạng thái: Đang chờ Quản trị viên xét duyệt
            </p>
            <p className="mt-0.5">
              Thời gian xác minh dự kiến trong vòng 24 giờ làm việc.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Mail size={16} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-text-primary">
              Thông báo qua email: {email}
            </p>
            <p className="mt-0.5">
              Ngay khi tài khoản được kích hoạt, ViecNgon sẽ gửi email để bạn
              đăng nhập và bắt đầu đăng tin tuyển dụng.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/employer/login"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
        >
          <span>Đến trang Đăng nhập NTD</span>
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary text-sm font-semibold transition-colors"
        >
          <Home size={15} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
