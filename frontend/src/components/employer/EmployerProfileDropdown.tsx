"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LogOut,
  Settings,
  Building2,
  CreditCard,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

export default function EmployerProfileDropdown() {
  return (
    <div className="relative group cursor-pointer">
      {/* Khu vực Avatar trên thanh Nav */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden shadow-sm group-hover:border-primary transition-all">
          {/* Dùng ảnh avatar thật hoặc logo công ty */}
          <Image
            src="https://ui-avatars.com/api/?name=OTS&background=2563eb&color=fff"
            alt="HR Avatar"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
        </div>
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1 text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
            Cường Lê
            <ChevronDown
              size={14}
              className="text-slate-400 group-hover:text-primary transition-colors"
            />
          </div>
          <span className="text-[10px] font-medium text-slate-500 leading-tight">
            HR Manager
          </span>
        </div>
      </div>

      {/* Cây cầu tàng hình giữ Hover */}
      <div className="absolute top-full right-0 w-full h-4 bg-transparent"></div>

      {/* Dropdown Menu (Rộng hơn bên Candidate vì chứa nhiều text hơn) */}
      <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
        {/* Header Dropdown: Xin chào HR - Công ty */}
        <div className="p-5 border-b border-slate-100 bg-linear-to-br from-slate-50 to-white">
          <p className="text-sm text-slate-500 mb-1">👋 Xin chào,</p>
          <p className="font-bold text-slate-800 text-base mb-1">
            Lê Hùng Cường
          </p>
          <div className="flex items-start gap-1.5 mt-2 bg-primary-light/50 p-2.5 rounded-lg border border-primary/10">
            <ShieldCheck size={16} className="text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Quản lý tuyển dụng tại <br />
              <span className="font-bold text-primary">
                ONE Tech Stop Vietnam
              </span>
            </p>
          </div>
        </div>

        {/* Danh sách Menu */}
        <div className="p-2 flex flex-col">
          <Link
            href="/employer/company-profile"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Building2 size={18} className="text-slate-400" />
            <div>
              <p>Hồ sơ công ty</p>
              <p className="text-[10px] text-slate-400 font-normal">
                Cập nhật logo, hình ảnh văn phòng
              </p>
            </div>
          </Link>

          {/* Tab Cài đặt tài khoản (như bạn yêu cầu) */}
          <Link
            href="/employer/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <Settings size={18} className="text-slate-400" />
            <div>
              <p>Cài đặt tài khoản</p>
              <p className="text-[10px] text-slate-400 font-normal">
                Thông tin cá nhân & Đổi mật khẩu
              </p>
            </div>
          </Link>

          <Link
            href="/employer/billing"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors"
          >
            <CreditCard size={18} className="text-slate-400" /> Quản lý Gói dịch
            vụ
          </Link>

          <div className="my-2 h-px bg-slate-100 mx-2"></div>

          {/* Switch Role */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <UserCircle size={18} className="text-slate-400" /> Chuyển sang tài
            khoản Ứng viên
          </Link>

          <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors w-full text-left mt-1">
            <LogOut size={18} className="text-rose-500" /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
