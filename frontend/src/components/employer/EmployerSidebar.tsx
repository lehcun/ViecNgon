"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  Building2,
  CreditCard,
  Settings,
} from "lucide-react";

export default function EmployerSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // Cấu hình các menu item theo đúng thứ tự trong ảnh
  const menuItems = [
    { name: "Tổng quan", path: "/employer-dashboard", icon: LayoutDashboard },
    { name: "Đăng tin tuyển dụng", path: "/post-job", icon: PlusCircle },
    { name: "Quản lý đăng tin", path: "/jobs", icon: Briefcase },
    { name: "Quản lý ứng viên", path: "/applications", icon: Users },
    {
      name: "Hồ sơ công ty",
      path: "/employer/company-profile",
      icon: Building2,
    },
    {
      name: "Gói dịch vụ & Hóa đơn",
      path: "/campaigns",
      icon: CreditCard,
    },
    { name: "Cài đặt tài khoản", path: "/employer/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col bg-white h-full justify-between pb-6">
      {/* --- MENU NAVIGATION --- */}
      <div className="py-6 px-4">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {/* Thanh vạch dọc màu xanh ở sát lề bên trái khi Active */}
                {active && (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-md"></div>
                )}

                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? "text-blue-600" : "text-slate-400"}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- BOX HỖ TRỢ (DƯỚI CÙNG) --- */}
      <div className="p-4 mx-4 bg-slate-50 rounded-xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-2">Cần hỗ trợ?</h4>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Liên hệ nhân viên chăm sóc tài khoản của bạn để được hỗ trợ đăng tin
          tốt nhất.
        </p>
        <p className="text-sm font-bold text-blue-600">Hotline: 1900 1234</p>
      </div>
    </div>
  );
}
