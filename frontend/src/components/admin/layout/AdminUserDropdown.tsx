"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/auth/useLogout";
import { ChevronDown, LogOut, KeyRound, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function AdminUserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const logoutMutation = useLogout({ redirectTo: "/admin/login" });

  const adminName = user?.name || "Minh Nguyen";
  const adminEmail = user?.email || "admin@viecngon.vn";
  const adminRole = user?.role === "ADMIN" ? "Super Admin" : "Administrator";

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logoutMutation.mutate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left focus:outline-hidden"
      >
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 ring-2 ring-blue-100">
          {adminName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-semibold text-slate-800 leading-tight">
            {adminName}
          </span>
          <span className="text-xs text-slate-500 leading-tight">
            {adminRole}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-800">{adminName}</p>
            <p className="text-[11px] text-slate-500 truncate">{adminEmail}</p>
          </div>

          <div className="py-1">
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <UserIcon size={14} className="text-slate-400" />
              <span>Hồ sơ quản trị viên</span>
            </Link>
            <Link
              href="/admin/settings/password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <KeyRound size={14} className="text-slate-400" />
              <span>Đổi mật khẩu</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut size={14} className="text-rose-500" />
              <span>
                {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

