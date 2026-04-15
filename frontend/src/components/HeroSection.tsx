import React from "react";
import { MapPin, ChevronDown, Search, Flame } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-[#020c1b] via-[#0f2a5c] to-[#0a192f] pt-16 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">
          863 Việc làm IT cho Cường "Chất"
        </h1>

        {/* Search Box */}
        <div className="flex flex-col md:flex-row bg-white rounded-md p-1 gap-2 shadow-lg mb-6">
          <div className="flex items-center px-3 md:w-56 border-b md:border-b-0 md:border-r border-gray-300 text-gray-600">
            <MapPin size={18} className="mr-2 text-blue-600" />
            <select className="w-full bg-transparent outline-none cursor-pointer text-sm py-3 appearance-none">
              <option>Tất cả thành phố</option>
              <option>Hồ Chí Minh</option>
              <option>Hà Nội</option>
              <option>Đà Nẵng</option>
            </select>
            <ChevronDown size={16} className="ml-auto pointer-events-none" />
          </div>

          <div className="flex-1 flex items-center px-3">
            <input
              type="text"
              placeholder="Nhập từ khoá theo kỹ năng, chức vụ, công ty..."
              className="w-full bg-transparent outline-none text-sm py-3 text-gray-800 placeholder-gray-400"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/30">
            <Search size={18} />
            Tìm Kiếm
          </button>
        </div>

        {/* Tag Suggestions */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-300">Mọi người đang tìm kiếm:</span>
          {[
            "Java",
            "ReactJS",
            "NodeJS",
            "NestJS",
            "Prisma",
            "Docker",
            "SQL Server",
          ].map((tag) => (
            <span
              key={tag}
              className="border border-blue-500/50 bg-slate-800/50 text-blue-200 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-500 transition"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Banner Promo Ticker */}
        <div className="mt-8 bg-black/30 border border-blue-800/50 rounded-md p-3 flex items-center gap-2 text-sm text-blue-100">
          <Flame className="text-blue-400" size={18} />
          <span className="font-bold">Cơ hội nhận 100K</span>
          <span>Tải lên CV & làm khảo sát trong tháng 4!</span>
        </div>
      </div>
    </section>
  );
}
