import React from "react";
import { ChevronDown, MessageSquare, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#0a192f] text-white py-3 px-6 flex items-center justify-between border-b border-blue-900/50">
      <div className="flex items-center gap-8">
        {/* Logo ViecNgon */}
        <div className="text-2xl font-bold flex items-center gap-1 cursor-pointer">
          <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
            V
          </div>
          <span>iecNgon</span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <li className="flex items-center gap-1 hover:text-white cursor-pointer">
            Việc Làm IT <ChevronDown size={14} />
          </li>
          <li className="flex items-center gap-1 hover:text-white cursor-pointer">
            Công ty IT <ChevronDown size={14} />
          </li>
          <li className="hover:text-white cursor-pointer flex items-center gap-1">
            Blog <ChevronDown size={14} />
          </li>
          <li className="hover:text-white cursor-pointer flex items-center gap-1">
            Story Hub{" "}
            <span className="bg-blue-600 text-[10px] px-1 rounded font-bold text-white">
              MỚI
            </span>
          </li>
          <li className="hover:text-white cursor-pointer flex items-center gap-1">
            Lĩnh vực IT <ChevronDown size={14} />
          </li>
        </ul>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5 text-sm font-medium">
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-slate-300 hover:text-white cursor-pointer text-right">
            <div className="text-xs text-slate-400">Tuyển dụng</div>
            <div>Vị trí cao cấp</div>
          </div>
          <div className="text-slate-300 hover:text-white cursor-pointer text-right border-l border-slate-700 pl-4">
            <div className="text-xs text-slate-400">Dành cho</div>
            <div>Nhà Tuyển Dụng</div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          <MessageSquare
            size={20}
            className="text-slate-300 hover:text-white cursor-pointer"
          />
          <Bell
            size={20}
            className="text-slate-300 hover:text-white cursor-pointer"
          />
          <div className="text-slate-300 hover:text-white cursor-pointer flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer border border-blue-400">
              C
            </div>
            <span>Đăng Nhập</span>
          </div>
          <div className="text-slate-300 cursor-pointer border-l border-slate-700 pl-4">
            EN | VI
          </div>
        </div>
      </div>
    </nav>
  );
}
