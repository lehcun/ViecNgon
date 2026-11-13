"use client";

import React, { useState } from "react";
import { Search, Bell } from "lucide-react";
import AdminUserDropdown from "./AdminUserDropdown";

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-surface-card border-b border-border-default px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
      {/* Thanh tìm kiếm */}
      <div className="flex-1 max-w-md relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm người dùng, tin đăng, công ty..."
          aria-label="Tìm kiếm trong hệ thống quản trị"
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-page border border-border-default text-sm text-text-primary placeholder:text-text-muted outline-none focus:bg-surface-card focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
        />
      </div>

      {/* Nhóm trạng thái & Tài khoản Admin */}
      <div className="flex items-center gap-3">
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-light border border-success-border text-xs font-semibold text-success-text">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Hệ thống hoạt động ổn định</span>
        </div>

        <button
          type="button"
          aria-label="Thông báo quản trị"
          className="w-10 h-10 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary flex items-center justify-center transition-colors"
        >
          <Bell size={18} />
        </button>

        <AdminUserDropdown />
      </div>
    </header>
  );
}
