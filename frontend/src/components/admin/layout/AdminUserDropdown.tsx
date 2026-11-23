"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/auth/useLogout";
import { ChevronDown, LogOut } from "lucide-react";

export default function AdminUserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const logoutMutation = useLogout({ redirectTo: "/", replace: true });

  const adminName = user?.name || "Quản trị viên";
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
        className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface-muted transition-colors text-left focus:outline-hidden"
      >
        <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 ring-2 ring-primary-light">
          {adminName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-semibold text-text-primary leading-tight">
            {adminName}
          </span>
          <span className="text-xs text-text-muted leading-tight">
            {adminRole}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-card shadow-xl border border-border-default py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2.5 border-b border-border-default">
            <p className="text-xs font-semibold text-text-primary">
              {adminName}
            </p>
            <p className="text-[11px] text-text-muted truncate">{adminEmail}</p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-danger-text hover:bg-danger-soft transition-colors text-left"
            >
              <LogOut size={14} className="text-danger" />
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
