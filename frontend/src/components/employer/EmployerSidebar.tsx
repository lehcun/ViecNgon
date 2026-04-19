"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  Briefcase,
  Users,
  Building2,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";

export default function EmployerSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors";
  const activeLinkClass = "bg-primary-light text-primary font-bold";
  const inactiveLinkClass =
    "text-slate-600 hover:bg-slate-50 hover:text-primary";

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
      {/* Card: Thông tin tài khoản HR */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center p-1">
            <img
              src="https://ui-avatars.com/api/?name=OTS&background=2563eb&color=fff"
              alt="Company Logo"
              className="rounded-md"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 line-clamp-1">
              ONE Tech Stop VN
            </h2>
            <p className="text-slate-500 text-xs">Tài khoản: HR Manager</p>
          </div>
        </div>

        {/* Khối tín dụng (Liên kết với bài toán Paywall) */}
        <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-lg p-4 text-white">
          <p className="text-xs text-slate-300 mb-1">Lượt đăng tin còn lại</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-emerald-400">3</span>
            <Link
              href="/employer/billing"
              className="text-xs font-semibold text-white hover:text-primary-light flex items-center gap-1 transition-colors"
            >
              Mua thêm <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Card: Menu Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          <Link
            href="/employer-dashboard"
            className={`${baseLinkClass} ${isActive("/employer-dashboard") ? activeLinkClass : inactiveLinkClass}`}
          >
            <LayoutDashboard size={20} /> Tổng quan
          </Link>
          <Link
            href="/jobs/create"
            className={`${baseLinkClass} ${isActive("/jobs/create") ? activeLinkClass : inactiveLinkClass} text-primary font-bold`}
          >
            <FilePlus2 size={20} /> Đăng tin tuyển dụng
          </Link>
          <Link
            href="/employer/jobs"
            className={`${baseLinkClass} ${isActive("/employer/jobs") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Briefcase size={20} /> Quản lý tin đăng
          </Link>

          <Link
            href="/employer/candidates"
            className={`${baseLinkClass} ${isActive("/employer/candidates") ? activeLinkClass : inactiveLinkClass} justify-between`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} /> Quản lý ứng viên
            </div>
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              12
            </span>
          </Link>

          <div className="h-px bg-slate-100 my-2 mx-4"></div>

          <Link
            href="/employer/company-profile"
            className={`${baseLinkClass} ${isActive("/employer/company-profile") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Building2 size={20} /> Hồ sơ công ty
          </Link>
          <Link
            href="/employer/billing"
            className={`${baseLinkClass} ${isActive("/employer/billing") ? activeLinkClass : inactiveLinkClass}`}
          >
            <CreditCard size={20} /> Gói dịch vụ & Hóa đơn
          </Link>
          <Link
            href="/employer/settings"
            className={`${baseLinkClass} ${isActive("/employer/settings") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Settings size={20} /> Cài đặt tài khoản
          </Link>
        </nav>
      </div>
    </aside>
  );
}
