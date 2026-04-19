"use client";

import Link from "next/link";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  User,
  Briefcase,
  Mail,
  Settings,
  Bell,
} from "lucide-react";

export default function ProfileDropdown() {
  return (
    <div className="relative group cursor-pointer">
      {/* Vùng hiển thị Avatar trên thanh Nav */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-all">
          C
        </div>
      </div>

      {/* Cây cầu tàng hình giúp giữ trạng thái hover khi di chuột xuống menu */}
      <div className="absolute top-full right-0 w-full h-4 bg-transparent"></div>

      {/* Khối Dropdown Menu */}
      <div className="absolute top-[calc(100%+12px)] right-0 w-72 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
        {/* Header của Dropdown (Thông tin User) */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
            C
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-slate-800 truncate">Lê Hùng Cường</p>
            <p className="text-xs text-slate-500 truncate">
              lehcuong2907@gmail.com
            </p>
          </div>
        </div>

        {/* Danh sách Menu */}
        <div className="p-2 flex flex-col">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <LayoutDashboard size={18} className="text-slate-400" /> Tổng quan
          </Link>
          <Link
            href="/dashboard/cv"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <FileText size={18} className="text-slate-400" /> Hồ sơ đính kèm
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <User size={18} className="text-slate-400" /> Hồ sơ ViecNgon
          </Link>
          <Link
            href="/dashboard/my-jobs"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Briefcase size={18} className="text-slate-400" /> Việc làm của tôi
          </Link>

          <div className="my-1 h-px bg-slate-100 mx-2"></div>

          <Link
            href="/dashboard/invitations"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Mail size={18} className="text-slate-400" /> Lời mời công việc
          </Link>
          <Link
            href="/dashboard/subscribe"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Mail size={18} className="text-slate-400" /> Đăng ký nhận email
          </Link>
          <Link
            href="/dashboard/notifications"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Bell size={18} className="text-slate-400" /> Thông báo
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Settings size={18} className="text-slate-400" /> Cài đặt
          </Link>

          <div className="my-1 h-px bg-slate-100 mx-2"></div>

          <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors w-full text-left">
            <LogOut size={18} className="text-rose-500" /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
