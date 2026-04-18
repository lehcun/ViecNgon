"use client";

import Link from "next/link";
import { Bell, MessageSquare, Search, ChevronDown } from "lucide-react";

export default function CandidateNavbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 w-full m-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Cột trái: Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shadow-md">
              V
            </div>
            <span className="text-xl font-extrabold text-primary">iecNgon</span>
          </Link>

          {/* Nav Links (Tùy chọn) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/jobs" className="hover:text-primary transition-colors">
              Việc Làm IT
            </Link>
            <Link
              href="/companies"
              className="hover:text-primary transition-colors"
            >
              Công ty IT
            </Link>
            <Link
              href="/portfolio"
              className="hover:text-primary transition-colors"
            >
              Tạo Portfolio
            </Link>
          </nav>
        </div>

        {/* Cột giữa: Thanh tìm kiếm nhanh (Chỉ hiện trên Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm việc làm, kỹ năng, công ty..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Cột phải: Avatar & Actions */}
        <div className="flex items-center gap-5">
          <button className="text-slate-500 hover:text-primary relative transition-colors">
            <MessageSquare size={20} />
            {/* Chấm đỏ thông báo tin nhắn */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="text-slate-500 hover:text-primary relative transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* User Profile Menu */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-all">
              C
            </div>
            <div className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
              Cường{" "}
              <ChevronDown
                size={14}
                className="text-slate-400 group-hover:text-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
