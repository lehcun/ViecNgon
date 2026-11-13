"use client";

import React from "react";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-page font-sans">
      {/* Sidebar Cố Định Bên Trái */}
      <AdminSidebar />

      {/* Khung Nội Dung Bên Phải */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <AdminHeader />

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer Nhỏ Gọn */}
        <footer className="px-6 py-3 border-t border-border-default bg-surface-card text-xs text-text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <span>© 2026 ViecNgon Admin Portal</span>
          <span>Hệ thống Quản trị Tuyển dụng IT ViecNgon</span>
        </footer>
      </div>
    </div>
  );
}
