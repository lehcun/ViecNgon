"use client";

import React from "react";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";

const NAV_LINKS = [
  { href: "#why-viecngon", label: "Tổng quan" },
  { href: "#packages", label: "Bảng giá gói" },
  { href: "#features", label: "Tiện ích AI" },
  { href: "#partners", label: "Khách hàng" },
];

export default function EmployerLandingHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 bg-linear-to-r from-primary-dark from-65% via-primary-active via-88% to-primary border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <LogoViecNgon
              logoTextColor="text-white"
              role="employer"
              href="/"
            />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[11px] font-bold tracking-wider text-white uppercase">
              Nhà tuyển dụng
            </span>
          </div>

          <nav
            aria-label="Điều hướng cổng Nhà tuyển dụng"
            className="hidden lg:flex items-center gap-1"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/employer/login"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-xs sm:text-sm font-semibold text-white transition-colors"
          >
            <LogIn size={15} />
            <span>Đăng nhập</span>
          </Link>

          <a
            href="#register-form"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-surface-card hover:bg-surface-muted text-primary text-xs sm:text-sm font-bold transition-colors shadow-xs"
          >
            <span>Đăng ký ngay</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}
