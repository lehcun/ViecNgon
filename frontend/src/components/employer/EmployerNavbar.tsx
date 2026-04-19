"use client";

import React from "react";
import Link from "next/link";
import { Bell, MessageSquare, Search, PlusCircle } from "lucide-react";
import EmployerProfileDropdown from "./EmployerProfileDropdown";

export default function EmployerNavbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 w-full m-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Cột trái: Logo (Thêm chữ Employer để phân biệt) */}
        <div className="flex items-center gap-8">
          <Link
            href="/employer-dashboard"
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shadow-md">
              V
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-extrabold text-slate-900 leading-none">
                iecNgon
              </span>
              <span className="text-[10px] font-black tracking-widest text-primary uppercase mt-0.5">
                Employer
              </span>
            </div>
          </Link>
        </div>

        {/* Cột giữa: Thanh tìm kiếm Ứng viên (Dành riêng cho HR) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm hồ sơ ứng viên theo kỹ năng (VD: ReactJS, Java...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Cột phải: Actions & Avatar */}
        <div className="flex items-center gap-4">
          {/* Nút Đăng tin nhanh (Primary Action) */}
          <Link
            href="/jobs/create"
            className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <PlusCircle size={18} /> Đăng tin
          </Link>

          <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

          {/* Các icon thông báo */}
          <button className="text-slate-500 hover:text-primary relative transition-colors p-2">
            <MessageSquare size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="text-slate-500 hover:text-primary relative transition-colors p-2 mr-2">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Component Dropdown Avatar */}
          <EmployerProfileDropdown />
        </div>
      </div>
    </header>
  );
}
