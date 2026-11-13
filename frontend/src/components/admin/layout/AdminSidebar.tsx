"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  Code2,
  ShieldAlert,
  Settings,
  HelpCircle,
} from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";
import { useAdminMetrics } from "@/hooks/admin/useAdminDashboard";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badgeVariant?: "default" | "danger";
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Tổng quan",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Quản lý người dùng",
    href: "/admin/users",
    icon: Users,
    badgeVariant: "default",
  },
  {
    label: "Kiểm duyệt tin đăng",
    href: "/admin/jobs",
    icon: Briefcase,
    badgeVariant: "danger",
  },
  {
    label: "Gói dịch vụ & Giá",
    href: "/admin/packages",
    icon: Package,
  },
  {
    label: "Từ điển kỹ năng",
    href: "/admin/skills",
    icon: Code2,
  },
  {
    label: "Báo cáo & Vi phạm",
    href: "/admin/reports",
    icon: ShieldAlert,
  },
  {
    label: "Cài đặt hệ thống",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: metrics } = useAdminMetrics();

  const getDynamicBadge = (item: NavItem): string | number | undefined => {
    if (item.href === "/admin/users") {
      return metrics?.totalUsers?.count !== undefined
        ? metrics.totalUsers.count.toLocaleString("vi-VN")
        : undefined;
    }
    if (item.href === "/admin/jobs") {
      return metrics?.pendingJobs?.count && metrics.pendingJobs.count > 0
        ? metrics.pendingJobs.count
        : undefined;
    }
    return undefined;
  };

  return (
    <aside className="hidden lg:flex w-64 bg-primary-dark border-r border-slate-800 flex-col h-screen shrink-0 text-slate-300 select-none">
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <LogoViecNgon
          logoTextColor="text-white"
          role="admin"
          href="/admin/dashboard"
        />
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Quản trị hệ thống
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard" || pathname === "/admin"
                  : pathname.startsWith(item.href);

              const badgeText = getDynamicBadge(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-white shrink-0"
                          : "text-slate-400 shrink-0"
                      }
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {badgeText !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        item.badgeVariant === "danger"
                          ? "bg-danger text-white"
                          : "bg-white/15 text-slate-100"
                      }`}
                    >
                      {badgeText}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Môi trường vận hành */}
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Môi trường vận hành
          </div>
          <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">
                Production
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Khu vực Việt Nam
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-800 shrink-0 space-y-2">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <HelpCircle size={16} />
          <span>Tài liệu & Cấu hình</span>
        </Link>

        <div className="text-[11px] text-slate-400 text-center font-mono">
          ViecNgon Admin · Portal
        </div>
      </div>
    </aside>
  );
}
