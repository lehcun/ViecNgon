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
  Megaphone,
} from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";

const menuItems = [
  { name: "Tổng quan", href: "/employer-dashboard", icon: LayoutDashboard },
  { name: "Đăng tin tuyển dụng", href: "/post-job", icon: PlusCircle },
  { name: "Quản lý đăng tin", href: "/employer-jobs", icon: Briefcase },
  { name: "Quản lý ứng viên", href: "/applications", icon: Users },
  { name: "Hồ sơ công ty", href: "/company-profile", icon: Building2 },
  { name: "Chiến dịch quảng cáo", href: "/campaigns", icon: Megaphone },
  { name: "Gói dịch vụ & Bảng giá", href: "/pricing", icon: CreditCard },
];

export default function EmployerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 bg-primary-dark border-r border-slate-800 flex-col h-screen shrink-0 text-slate-300 select-none">
      {/* Header / Logo có đường kẻ ngang đồng bộ với EmployerNavbar */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <LogoViecNgon
          role="employer"
          logoTextColor="text-white"
          href="/employer-dashboard"
        />
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Nhà tuyển dụng
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-white shrink-0"
                        : "text-slate-400 shrink-0"
                    }
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 mx-1 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs font-bold text-white mb-1">
            Hỗ trợ doanh nghiệp
          </p>
          <p className="text-xs text-slate-400 mb-2.5 leading-relaxed">
            Cần tư vấn đăng tin hoặc đẩy tin VIP?
          </p>
          <a
            href="mailto:love@viecngon.vn"
            className="text-xs font-semibold text-primary-disabled hover:text-white hover:underline block"
          >
            love@viecngon.vn
          </a>
        </div>
      </div>
    </aside>
  );
}
