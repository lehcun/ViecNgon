"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoViecNgon from "@/components/LogoViecNgon";
import { useAdminMetrics } from "@/hooks/admin/useAdminDashboard";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  BookOpen,
  ShieldAlert,
  Settings,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
  badgeVariant?: "default" | "danger";
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    badge: "1.2k",
    badgeVariant: "default",
  },
  {
    label: "Job Moderation",
    href: "/admin/jobs",
    icon: Briefcase,
    badge: "8",
    badgeVariant: "danger",
  },
  {
    label: "Service Packages & Pricing",
    href: "/admin/packages",
    icon: CreditCard,
  },
  {
    label: "Skill Dictionary",
    href: "/admin/skills",
    icon: BookOpen,
  },
  {
    label: "Reports & Violations",
    href: "/admin/reports",
    icon: ShieldAlert,
  },
  {
    label: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: metrics } = useAdminMetrics();

  const getDynamicBadge = (item: NavItem) => {
    if (item.href === "/admin/users" && metrics) {
      const c = metrics.totalUsers.count;
      return c >= 1000 ? `${(c / 1000).toFixed(1)}k` : String(c);
    }
    if (item.href === "/admin/jobs" && metrics) {
      return String(metrics.pendingJobs.count);
    }
    return item.badge;
  };

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col h-screen shrink-0 text-slate-400 select-none">
      {/* 1. Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/60 shrink-0">
        <LogoViecNgon
          logoTextColor="text-white"
          role="admin"
          href="/admin/dashboard"
        />
      </div>

      {/* 2. Menu Navigation (Scrollable) */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Workspace
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-slate-400"}
                    />
                    <span>{item.label}</span>
                  </div>

                    { badgeText !== undefined && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${item.badgeVariant === "danger"
                          ? "bg-rose-500 text-white"
                          : "bg-slate-800 text-slate-300"
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

        {/* Platform section */}
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Platform
          </div>
          <div className="px-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 leading-tight">
                  Production
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Asia / Da Nang City
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Sidebar */}
      <div className="p-4 border-t border-slate-800/60 shrink-0">
        {/* Platform Health Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Platform health</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            99.98%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            uptime this month
          </div>
        </div>

        {/* Documentation link */}
        <Link
          href="/admin/docs"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors"
        >
          <HelpCircle size={16} />
          <span>Help & documentation</span>
        </Link>

        {/* Version */}
        <div className="text-[11px] text-slate-400 text-center mt-3 font-mono">
          ViecNgon Admin · v2.4.0
        </div>
      </div>
    </aside>
  );
}

