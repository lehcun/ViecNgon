import React from "react";
import { Briefcase, FileText, Star, TrendingUp } from "lucide-react";

export default function QuickLinks() {
  return (
    <section className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between md:justify-center gap-8 py-5 px-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer font-medium text-sm transition">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <Briefcase size={20} />
            </div>
            Tìm việc thụ động{" "}
            <span className="bg-orange-500 text-white text-[10px] px-1 rounded">
              HOT
            </span>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer font-medium text-sm transition">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <FileText size={20} />
            </div>
            Mẫu CV chuẩn IT
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer font-medium text-sm transition">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <Star size={20} />
            </div>
            Story Hub{" "}
            <span className="bg-green-600 text-white text-[10px] px-1 rounded">
              MỚI
            </span>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer font-medium text-sm transition">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <Star size={20} />
            </div>
            Review công ty
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer font-medium text-sm transition">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <TrendingUp size={20} />
            </div>
            Báo cáo lương IT
          </div>
        </div>
      </div>
    </section>
  );
}
