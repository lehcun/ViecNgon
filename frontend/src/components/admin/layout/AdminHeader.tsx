"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import AdminUserDropdown from "./AdminUserDropdown";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: pendingEmployers } = useAdminUsers({
    role: "NHATUYENDUNG",
    status: "CHUAKICHHOAT",
    limit: 1,
  });

  const pendingCount = pendingEmployers?.pagination?.total ?? 0;

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

        <Link
          href={
            pendingCount > 0
              ? "/admin/users?status=CHUAKICHHOAT"
              : "/admin/users"
          }
          title={
            pendingCount > 0
              ? `Có ${pendingCount} tài khoản Nhà tuyển dụng đang chờ kích hoạt`
              : "Thông báo quản trị"
          }
          aria-label="Thông báo quản trị"
          className="relative w-10 h-10 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary flex items-center justify-center transition-colors"
        >
          <Bell size={18} />
          {pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </Link>

        <AdminUserDropdown />
      </div>
    </header>
  );
}
