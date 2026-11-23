"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ShieldCheck,
  Users,
  Briefcase,
  Package,
  Code2,
  ShieldAlert,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/auth/useLogout";

export default function PublicAdminDropdown() {
  const { user } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout({
    redirectTo: "/",
    replace: true,
  });

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

  const displayName = user?.name || "Quản trị viên";
  const displayEmail = user?.email || "admin@viecngon.vn";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ================= NÚT TRIGGER ================= */}
      <button
        type="button"
        className={`flex items-center gap-3 cursor-pointer select-none group text-left border rounded-full px-1.5 py-1.5 pr-4 transition-all duration-200 ${
          isOpen
            ? "border-border-default bg-surface-card shadow-sm"
            : "border-transparent bg-surface-subtle hover:bg-surface-page"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="Admin Avatar"
              fill
              unoptimized
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary text-white font-bold flex items-center justify-center text-sm">
              {avatarLetter}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-text-primary leading-tight line-clamp-1 max-w-40">
              {displayName}
            </span>
            <ChevronDown
              size={16}
              className={`text-text-muted transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-semibold text-primary tracking-wide">
              Quản trị viên
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </button>

      {/* ================= DROPDOWN MENU ================= */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-surface-page rounded-2xl shadow-xl border border-border-default z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Quản trị hệ thống
              </p>
              <span className="text-xs font-semibold text-primary border border-primary bg-surface-card px-2.5 py-1 rounded-full">
                Super Admin
              </span>
            </div>
            <p className="font-bold text-text-primary text-base line-clamp-1 mb-0.5">
              {displayName}
            </p>
            <p className="text-sm text-text-muted truncate">{displayEmail}</p>
          </div>

          <div className="flex flex-col bg-surface-card">
            <div className="px-3 pt-3 pb-2 space-y-2">
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors group shadow-sm"
              >
                <div className="flex items-center gap-3 font-semibold text-sm">
                  <ShieldCheck size={18} />
                  Trang quản trị Admin
                </div>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/admin/users"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-primary-light hover:bg-primary-subtle text-primary font-semibold text-sm rounded-xl transition-colors"
              >
                <Users size={18} />
                Quản lý người dùng
              </Link>
            </div>

            <div className="px-2 py-2">
              <Link
                href="/admin/jobs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-page rounded-lg transition-colors"
              >
                <Briefcase size={18} className="text-text-muted" />
                Kiểm duyệt tin đăng
              </Link>

              <Link
                href="/admin/packages"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-page rounded-lg transition-colors"
              >
                <Package size={18} className="text-text-muted" />
                Gói dịch vụ &amp; Giá
              </Link>

              <Link
                href="/admin/skills"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-page rounded-lg transition-colors"
              >
                <Code2 size={18} className="text-text-muted" />
                Từ điển kỹ năng
              </Link>

              <Link
                href="/admin/reports"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-page rounded-lg transition-colors"
              >
                <ShieldAlert size={18} className="text-text-muted" />
                Báo cáo &amp; Vi phạm
              </Link>
            </div>

            <div className="border-t border-border-default p-2">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger-text hover:bg-danger-soft rounded-lg transition-colors w-full text-left disabled:opacity-50"
              >
                <LogOut size={18} className="text-danger" />
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
