"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  User,
  Briefcase,
  Mail,
  Bell,
  Settings,
  ToggleRight,
} from "lucide-react";

export default function CandidateSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors";
  const activeLinkClass = "bg-primary-light text-primary font-bold";
  const inactiveLinkClass =
    "text-slate-600 hover:bg-slate-50 hover:text-primary";

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
      {/* Card: Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <p className="text-slate-500 text-sm mb-1 flex items-center gap-2">
          👋 Xin chào
        </p>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Lê Hùng Cường</h2>

        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-sm font-medium text-slate-700">
            Cho phép tìm CV
          </span>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-bold text-primary">Bật</span>
            <ToggleRight size={28} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Card: Menu Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className={`${baseLinkClass} ${isActive("/dashboard") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Briefcase size={20} /> Tổng quan
          </Link>
          <Link
            href="/dashboard/cv"
            className={`${baseLinkClass} ${isActive("/dashboard/cv") ? activeLinkClass : inactiveLinkClass}`}
          >
            <FileText size={20} /> Hồ sơ đính kèm
          </Link>
          <Link
            href="/dashboard/profile"
            className={`${baseLinkClass} ${isActive("/dashboard/profile") ? activeLinkClass : inactiveLinkClass}`}
          >
            <User size={20} /> Hồ sơ ViecNgon
          </Link>
          <Link
            href="/dashboard/my-jobs"
            className={`${baseLinkClass} ${isActive("/dashboard/my-jobs") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Briefcase size={20} /> Việc làm của tôi
          </Link>
          <Link
            href="/dashboard/invitations"
            className={`${baseLinkClass} ${isActive("/dashboard/invitations") ? activeLinkClass : inactiveLinkClass} justify-between`}
          >
            <div className="flex items-center gap-3">
              <Mail size={20} /> Lời mời công việc
            </div>
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              0
            </span>
          </Link>

          <div className="h-px bg-slate-100 my-2 mx-4"></div>

          <Link
            href="/dashboard/subscribe"
            className={`${baseLinkClass} ${isActive("/dashboard/subscribe") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Mail size={20} /> Đăng ký nhận email
          </Link>
          <Link
            href="/dashboard/notifications"
            className={`${baseLinkClass} ${isActive("/dashboard/notifications") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Bell size={20} /> Thông báo
          </Link>
          <Link
            href="/dashboard/settings"
            className={`${baseLinkClass} ${isActive("/dashboard/settings") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Settings size={20} /> Cài đặt
          </Link>
        </nav>
      </div>
    </aside>
  );
}
