"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  User,
  Briefcase,
  Bell,
  Settings,
  LayoutDashboard,
  FileBadge2,
  ToggleRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";

export default function CandidateSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { unreadCount } = useNotifications();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const baseLinkClass =
    "flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors";
  const activeLinkClass = "bg-primary-light text-primary font-semibold";
  const inactiveLinkClass =
    "text-text-secondary hover:bg-surface-subtle hover:text-primary";

  const navItems = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/cv-profile", label: "Hồ sơ ViecNgon", icon: User },
    { href: "/cv/personalCV", label: "Hồ sơ đính kèm", icon: FileText },
    { href: "/cv-template", label: "Mẫu CV IT", icon: FileBadge2 },
    { href: "/my-jobs/applied", label: "Việc làm của tôi", icon: Briefcase },
  ];

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-5 lg:sticky lg:top-24 self-start">
      <div className="bg-surface-card rounded-xl border border-border-default p-5 shadow-xs">
        <p className="text-text-muted text-xs font-medium mb-1">Xin chào,</p>
        <h2 className="text-lg font-bold text-text-main mb-4 truncate">
          {user?.name || "Ứng viên"}
        </h2>

        <div className="flex items-center justify-between bg-surface-subtle p-3 rounded-lg border border-border-subtle">
          <span className="text-xs font-medium text-text-secondary">
            Cho phép NTD tìm CV
          </span>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Đang bật</span>
            <ToggleRight size={22} className="text-primary" />
          </Link>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default p-2.5 shadow-xs">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseLinkClass} ${isActive(item.href) ? activeLinkClass : inactiveLinkClass}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="h-px bg-border-subtle my-2 mx-2" />

          <Link
            href="/notifications"
            className={`justify-between ${baseLinkClass} ${
              isActive("/notifications") ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell size={18} />
              <span>Thông báo</span>
            </div>
            {unreadCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 flex items-center justify-center bg-danger text-white text-[11px] font-bold rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/settings"
            className={`${baseLinkClass} ${isActive("/settings") ? activeLinkClass : inactiveLinkClass}`}
          >
            <Settings size={18} />
            <span>Cài đặt tài khoản</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
