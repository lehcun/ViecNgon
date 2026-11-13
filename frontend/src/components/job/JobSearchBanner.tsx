"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";

interface JobSearchBannerProps {
  initialKeyword?: string;
  initialLocation?: string;
  onSearch: (keyword: string, location: string) => void;
}

const POPULAR_LOCATIONS = [
  { value: "", label: "Tất cả thành phố" },
  { value: "TP.HCM", label: "TP.HCM" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
];

const POPULAR_TAGS = [
  "ReactJS",
  "Next.js",
  "Java",
  "Spring Boot",
  "Node.js",
  "NestJS",
  "Python",
  "AWS",
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
    <section className="bg-linear-to-br from-primary-dark via-[#13294b] to-primary-dark pt-24 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2.5 tracking-tight">
          Tìm việc làm IT &amp; Cơ hội nghề nghiệp hấp dẫn
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mb-7 max-w-2xl mx-auto">
          Lọc nhanh theo kỹ năng, cấp bậc, hình thức làm việc và mức lương minh bạch
        </p>

        {/* Thanh tìm kiếm */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row bg-surface-card rounded-xl p-1.5 gap-2 shadow-lg mb-5 items-stretch md:items-center text-left"
        >
          <div className="relative flex items-center px-3 w-full md:w-52 border-b md:border-b-0 md:border-r border-border-default">
            <MapPin size={18} className="mr-2 text-primary shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Chọn thành phố"
              className="w-full h-11 bg-transparent outline-none cursor-pointer text-sm appearance-none font-medium text-text-primary pr-6"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 text-text-placeholder pointer-events-none shrink-0"
            />
          </div>

          <div className="flex-1 flex items-center px-3 w-full">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập từ khóa theo kỹ năng, chức vụ, công ty..."
              className="w-full h-11 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-placeholder font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto h-11 px-7 bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shrink-0 text-sm"
          >
            <Search size={17} />
            <span>Tìm kiếm</span>
          </button>
        </form>

        {/* Tag từ khóa phổ biến */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-slate-300 text-xs font-medium mr-1">
            Gợi ý:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="border border-white/15 bg-white/5 text-slate-200 px-3 py-1 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors text-xs font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
