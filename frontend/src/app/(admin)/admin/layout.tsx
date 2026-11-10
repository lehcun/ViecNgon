import React from "react";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export const metadata = {
  title: "Admin Portal - ViecNgon",
  description: "Bảng điều khiển quản trị hệ thống ViecNgon",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased">
      {/* 1. Sidebar bên trái (Dark theme, fixed height) */}
      <AdminSidebar />

      {/* 2. Cột nội dung chính bên phải */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Header trên cùng */}
        <AdminHeader />

        {/* Nội dung trang (Scrollable) */}
        <main className="flex-1 overflow-y-auto bg-slate-50/80">
          <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
            {children}
          </div>

          {/* Dòng Copyright Footer nhỏ theo đúng Figma */}
          <footer className="border-t border-slate-200/80 py-4 px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 ViecNgon.</p>
            <p>Timezone: Asia/Da_Nang (UTC+7)</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

