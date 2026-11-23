"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EmployerNotificationDropdown from "./EmployerNotificationDropdown";
import LogoViecNgon from "../LogoViecNgon";
import EmployerDashboardDropdown from "./EmployerDashboardDropdown";

export default function EmployerNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Bảng tin", path: "/employer-dashboard" },
    { name: "Quản lý tin", path: "/employer-jobs" },
    { name: "Ứng viên", path: "/applications" },
    { name: "Gói dịch vụ", path: "/pricing" },
  ];

  return (
    <header className="h-16 bg-surface-card border-b border-border-default px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
      <div className="flex items-center gap-6 min-w-0">
        {/* Hiện logo trên mobile/tablet khi sidebar bị ẩn */}
        <div className="lg:hidden shrink-0">
          <LogoViecNgon
            role="employer"
            logoTextColor="text-text-primary"
            href="/employer-dashboard"
          />
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.path || pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-secondary hover:text-primary font-medium"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="text-text-secondary hover:text-primary transition-colors">
          <EmployerNotificationDropdown />
        </div>

        <div className="h-6 w-px bg-border-default hidden md:block" />

        <EmployerDashboardDropdown />
      </div>
    </header>
  );
}
