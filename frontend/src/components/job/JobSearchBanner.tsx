"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Flame } from "lucide-react";

interface JobSearchBannerProps {
  initialKeyword?: string;
  initialLocation?: string;
  onSearch: (keyword: string, location: string) => void;
}

const POPULAR_LOCATIONS = [
  { value: "", label: "Tất cả thành phố" },
  { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Hải Phòng", label: "Hải Phòng" },
];

const POPULAR_TAGS = [
  "Java",
  "ReactJS",
  "NodeJS",
  "NestJS",
  "Prisma",
  "Docker",
  "SQL Server",
];

export default function JobSearchBanner({
  initialKeyword = "",
  initialLocation = "",
  onSearch,
}: JobSearchBannerProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(keyword, location);
  };

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
    onSearch(tag, location);
  };

  return (
    <div className="bg-linear-to-r from-[#020c1b] via-[#0f2a5c] to-[#0a192f] pt-28 md:pt-32 pb-14 px-6 shadow-inner">
      <div className="max-w-5xl mx-auto text-center">
        {/* Tiêu đề & phụ đề */}
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Tìm Việc Làm IT &amp; Cơ Hội Nghề Nghiệp Hấp Dẫn
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
          Hàng ngàn việc làm công nghệ thông tin từ các công ty và tập đoàn hàng đầu Việt Nam
        </p>

        {/* Khung tìm kiếm chuẩn style trang chủ */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row bg-white rounded-lg p-1.5 gap-2 shadow-2xl mb-6 items-center text-left"
        >
          {/* Chọn thành phố */}
          <div className="flex items-center px-3 w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200 text-slate-700">
            <MapPin size={18} className="mr-2 text-primary shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent outline-none cursor-pointer text-sm py-2.5 appearance-none font-medium text-slate-800"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="ml-auto text-slate-400 pointer-events-none shrink-0"
            />
          </div>

          {/* Nhập từ khoá */}
          <div className="flex-1 flex items-center px-3 w-full">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập từ khoá theo kỹ năng, chức vụ, công ty..."
              className="w-full bg-transparent outline-none text-sm py-2.5 text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          {/* Nút Tìm Kiếm */}
          <button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-md flex items-center justify-center gap-2 transition shadow-md shadow-primary/30 shrink-0 cursor-pointer text-sm active:scale-98"
          >
            <Search size={18} />
            <span>Tìm Kiếm</span>
          </button>
        </form>

        {/* Gợi ý từ khoá phổ biến */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm">
          <span className="text-slate-300 text-xs sm:text-sm">
            Mọi người đang tìm kiếm:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="border border-blue-900/60 bg-slate-900/50 text-slate-300 px-3.5 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition text-xs font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
