"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LogOut,
  Settings,
  Building2,
  Receipt,
  ShieldCheck,
  User,
  Globe,
  HelpCircle,
  BadgeCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/auth/useLogout";

export default function EmployerDashboardDropdown() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout({ redirectTo: "/employer/login" });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý sự kiện Click-Outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const displayName = user?.name || "HR Manager";
  const displayEmail = user?.email || "hr@company.com";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ================= NÚT TRIGGER (AVATAR HEADER) ================= */}
      <div
        className="flex items-center gap-2.5 cursor-pointer select-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full border-2 p-0.5 overflow-hidden shadow-sm transition-all duration-300 ${isOpen ? "border-primary ring-2 ring-primary-light" : "border-primary/30 group-hover:border-primary"}`}
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="HR Avatar"
              width={50}
              height={50}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-primary-light text-primary font-bold flex items-center justify-center rounded-full text-lg">
              {avatarLetter}
            </div>
          )}
        </div>

        {/* Thông tin HR & Icon Chevron */}
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5 text-sm font-bold text-primary-light group-hover:text-primary transition-colors leading-tight">
            <span className="line-clamp-1 max-w-30">{displayName}</span>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "group-hover:text-primary"}`}
            />
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <BadgeCheck size={12} className="text-primary" />
            <span className="text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded uppercase tracking-wide">
              Đã xác thực
            </span>
          </div>
        </div>
      </div>

      {/* ================= MENU DROPDOWN ================= */}
      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-72 md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Khối Header bên trong Menu */}
          <div className="p-5 border-b border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium">
              Tài khoản Quản trị
            </p>
            <p className="font-bold text-slate-800 text-base line-clamp-1 mb-0.5">
              {displayName}
            </p>
            <p className="text-sm text-slate-500 mb-3 truncate">
              {displayEmail}
            </p>

            <div className="flex items-start gap-2 bg-primary-light/80 p-2.5 rounded-lg border border-primary-light">
              <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary-dark">
                  Gói Doanh Nghiệp
                </p>
                <p className="text-[10px] text-primary mt-0.5">
                  Đầy đủ quyền hạn đăng tin & tìm kiếm
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col py-2">
            {/* Nhóm 1: Xem giao diện công khai */}
            <div className="px-3 py-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Giao diện công khai
              </p>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <Globe size={18} className="text-slate-400" />
                Trang chủ ViecNgon
              </Link>
              <Link
                href="/companies/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <Building2 size={18} className="text-slate-400" />
                Xem trang công ty công khai
              </Link>
            </div>

            <div className="h-px bg-slate-100 mx-4 my-1"></div>

            {/* Nhóm 2: Quản lý Tài khoản & Doanh nghiệp */}
            <div className="px-3 py-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Quản lý & Cài đặt
              </p>
              <Link
                href="/employer-dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <User size={18} className="text-slate-400" />
                Thông tin cá nhân HR
              </Link>
              <Link
                href="/employer-dashboard/company"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <ShieldCheck size={18} className="text-slate-400" />
                Hồ sơ & Giấy phép công ty
              </Link>
              <Link
                href="/employer-dashboard/billing"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <Receipt size={18} className="text-slate-400" />
                Lịch sử giao dịch & Hóa đơn
              </Link>
              <Link
                href="/employer-dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <Settings size={18} className="text-slate-400" />
                Cài đặt bảo mật & Mật khẩu
              </Link>
            </div>

            <div className="h-px bg-slate-100 mx-4 my-1"></div>

            {/* Nhóm 3: Trợ giúp & Đăng xuất */}
            <div className="px-3 py-1">
              <Link
                href="/support"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                <HelpCircle size={18} className="text-slate-400" />
                Trung tâm hỗ trợ / CSKH
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors w-full text-left mt-1"
              >
                <LogOut size={18} className="text-rose-500" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
