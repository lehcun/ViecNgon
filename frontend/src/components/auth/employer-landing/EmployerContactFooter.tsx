"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, Clock, ArrowUp, LogIn } from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";

export default function EmployerContactFooter() {
  return (
    <footer
      id="contact"
      className="bg-linear-to-br from-primary-dark from-60% via-primary-active via-85% to-primary text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <LogoViecNgon
              logoTextColor="text-white"
              role="employer"
              href="/"
            />
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
              Tuyển dụng IT chính xác và hiệu quả cùng ViecNgon ngay hôm nay
            </h2>
            <p className="text-sm text-white/80 max-w-xl leading-relaxed">
              Đội ngũ hỗ trợ doanh nghiệp luôn sẵn sàng đồng hành từ khâu kích
              hoạt tài khoản, thiết lập gói tuyển dụng đến tối ưu hiệu quả tiếp
              cận ứng viên IT.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#register-form"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-surface-card hover:bg-surface-muted text-primary text-sm font-bold transition-colors"
              >
                <ArrowUp size={15} />
                <span>Đăng ký tài khoản doanh nghiệp</span>
              </a>

              <Link
                href="/employer/login"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
              >
                <LogIn size={15} />
                <span>Đã có tài khoản? Đăng nhập</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-1">
              <div className="flex items-center gap-2 text-xs text-white/75 font-semibold">
                <Phone size={14} />
                <span>Hotline Doanh nghiệp</span>
              </div>
              <p className="text-base font-bold tabular-nums">1900 6868</p>
              <p className="text-[11px] text-white/70">
                TP.HCM · Hà Nội · Đà Nẵng
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-1">
              <div className="flex items-center gap-2 text-xs text-white/75 font-semibold">
                <Mail size={14} />
                <span>Email Hỗ trợ</span>
              </div>
              <p className="text-base font-bold truncate">love@viecngon.vn</p>
              <p className="text-[11px] text-white/70">
                Phản hồi trong 24h làm việc
              </p>
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs text-white/75 font-semibold">
                  <Clock size={14} />
                  <span>Thời gian làm việc</span>
                </div>
                <p className="text-sm font-bold">
                  Thứ 2 – Thứ 6 · 08:30 – 17:30
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold shrink-0">
                Hỗ trợ 1-1
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p>© {new Date().getFullYear()} ViecNgon — Nền tảng Tuyển dụng IT Thông minh.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Trang ứng viên
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
