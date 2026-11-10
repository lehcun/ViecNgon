"use client";

import React, { useState } from "react";
import { Search, Bell } from "lucide-react";
import AdminUserDropdown from "./AdminUserDropdown";

export default function AdminHeader() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* 1. Thanh tìm kiếm toàn hệ thống */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3.5 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search users, jobs, companies..."
            className="w-full pl-10 pr-16 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            <kbd className="text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>

      {/* 2. Cụm trạng thái hệ thống, Thông báo & Tài khoản Admin */}
      <div className="flex items-center gap-6">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Updated 2 mins ago</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden lg:block" />

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            4
          </span>
        </button>

        {/* Admin Avatar & Dropdown */}
        <AdminUserDropdown />
      </div>
    </header>
  );
}

