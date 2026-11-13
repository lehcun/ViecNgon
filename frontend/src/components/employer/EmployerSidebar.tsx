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
    <div className="py-5 px-3 flex flex-col h-full justify-between">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-text-secondary hover:bg-surface-subtle hover:text-text-main font-medium"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-primary" : "text-text-subtle"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 mx-1 p-4 bg-primary-light/70 rounded-xl border border-primary/15">
        <p className="text-xs font-bold text-primary mb-1">
          Hỗ trợ doanh nghiệp
        </p>
        <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">
          Cần tư vấn đăng tin hoặc đẩy tin VIP?
        </p>
        <a
          href="mailto:love@viecngon.vn"
          className="text-xs font-semibold text-primary hover:underline block"
        >
          love@viecngon.vn
        </a>
      </div>
    </div>
  );
}
