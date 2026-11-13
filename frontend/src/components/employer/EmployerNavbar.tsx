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
    <header className="bg-primary-dark border-b border-slate-800 sticky top-0 z-50 w-full shadow-sm">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <LogoViecNgon
            logoTextColor="text-white"
            href="/employer-dashboard"
          />

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.path || pathname.startsWith(`${link.path}/`);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-slate-300 hover:text-white transition-colors">
            <EmployerNotificationDropdown />
          </div>

          <div className="h-6 w-px bg-slate-700 hidden md:block" />

          <EmployerDashboardDropdown />
        </div>
      </div>
    </header>
  );
}
