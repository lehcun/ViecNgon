"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Building2,
  Plus,
  Briefcase,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/auth/useLogout";

export default function PublicEmployerDropdown() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const displayName = user?.name || "Minh Anh • TalentHub";
  const displayEmail = user?.email || "minh.anh@talenthub.vn";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const remainingCredits = (user as any)?.soLuotDangTin ?? 5;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ================= NÚT TRIGGER ================= */}
      <div
        className={`flex items-center gap-3 cursor-pointer select-none group border rounded-full px-1.5 py-1.5 pr-4 transition-all duration-200 ${
          isOpen
            ? "border-slate-200 bg-white shadow-sm"
            : "border-transparent bg-slate-200 hover:bg-slate-50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Employer Avatar"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-primary text-white font-bold flex items-center justify-center text-sm">
              {avatarLetter}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-slate-800 leading-tight line-clamp-1 max-w-[160px]">
              {displayName}
            </span>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-semibold text-primary tracking-wide">
              Nhà tuyển dụng
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
          </div>
        </div>
      </div>

      {/* ================= DROPDOWN MENU ================= */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-slate-50 rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Doanh nghiệp
              </p>
              <span className="text-xs font-semibold text-primary border border-primary bg-white px-2.5 py-1 rounded-full">
                {remainingCredits} lượt đăng
              </span>
            </div>
            <p className="font-bold text-slate-900 text-base line-clamp-1 mb-0.5">
              {displayName}
            </p>
            <p className="text-sm text-slate-500 truncate">{displayEmail}</p>
          </div>

          <div className="flex flex-col bg-white">
            <div className="px-3 pt-3 pb-2 space-y-2">
              <Link
                href="/employer-dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors group shadow-sm"
              >
                <div className="flex items-center gap-3 font-semibold text-sm">
                  <Building2 size={18} />
                  Trang quản trị NTD
                </div>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/employer-dashboard/jobs/create"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-primary-light hover:bg-primary-light/80 text-primary font-semibold text-sm rounded-xl transition-colors"
              >
                <Plus size={18} />
                Đăng tin tuyển dụng mới
              </Link>
            </div>

            <div className="px-2 py-2">
              <Link
                href="/employer-dashboard/jobs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Briefcase size={18} className="text-slate-400" />
                Quản lý tin đăng
              </Link>

              <Link
                href="/employer-dashboard/candidates"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Users size={18} className="text-slate-400" />
                Quản lý hồ sơ ứng viên
              </Link>

              <Link
                href="/employer-dashboard/billing"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <CreditCard size={18} className="text-slate-400" />
                Mua gói tin / Quảng cáo
              </Link>

              <Link
                href="/employer-dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Settings size={18} className="text-slate-400" />
                Cài đặt công ty
              </Link>
            </div>

            <div className="border-t border-slate-100 p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors w-full text-left"
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
