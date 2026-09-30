"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import EmployerProfileDropdown from "./EmployerProfileDropdown";
import EmployerNotificationDropdown from "./EmployerNotificationDropdown";
import LogoViecNgon from "../LogoViecNgon";

export default function EmployerNavbar() {
  const pathname = usePathname();

  // Danh sách menu trên Navbar giống hệt ảnh thiết kế
  const navLinks = [
    { name: "Bảng tin", path: "/employer-dashboard" },
    { name: "Tìm ứng viên", path: "/employer/candidates" },
    { name: "Sản phẩm & Dịch vụ", path: "/employer/pricing" },
    { name: "Trợ giúp", path: "/employer/help" },
  ];

  return (
    <header className="bg-[#0b132b] border-b border-slate-800 sticky top-0 z-50 w-full shadow-md">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Cột trái: Logo & Navigation */}
        <div className="flex items-center gap-12">
          {/* Logo ViecNgon */}
          <LogoViecNgon logoTextColor="text-white" href="/employer-dashboard" />

          {/* Navigation Links (Giống hình) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cột phải: Actions & Avatar */}
        <div className="flex items-center gap-5">
          {/* Notification Dropdown */}
          <div className="text-slate-300 hover:text-white transition-colors">
            <EmployerNotificationDropdown />
          </div>

          <div className="h-6 w-px bg-slate-700 hidden md:block mx-1"></div>

          {/* Component Dropdown Avatar */}
          <EmployerProfileDropdown />
        </div>
      </div>
    </header>
  );
}
