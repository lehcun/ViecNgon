"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Search, Sparkles } from "lucide-react";

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

const POPULAR_CITIES = [
  { value: "", label: "Tất cả thành phố" },
  { value: "TP.HCM", label: "TP.HCM" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
];

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [thanhPho, setThanhPho] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }
    if (thanhPho.trim()) {
      params.set("thanhPho", thanhPho.trim());
    }
    const query = params.toString();
    router.push(query ? `/jobs?${query}` : "/jobs");
  };

  const handleTagClick = (tag: string) => {
    router.push(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="bg-linear-to-br from-primary-dark via-[#13294b] to-primary-dark pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-100 text-xs font-medium mb-4">
          <Sparkles size={14} className="text-primary-disabled" />
          <span>Kết nối kỹ sư IT với doanh nghiệp công nghệ hàng đầu</span>
        </div>

        <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Tìm kiếm việc làm IT chất lượng tại Việt Nam
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl leading-relaxed">
          Khám phá cơ hội nghề nghiệp minh bạch về mức lương, công nghệ sử dụng và đánh giá độ phù hợp bằng AI ngay trước khi ứng tuyển.
        </p>

        {/* Thanh tìm kiếm hợp nhất */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row bg-surface-card rounded-xl p-1.5 gap-2 shadow-lg mb-6 items-stretch md:items-center"
        >
          <div className="relative flex items-center px-3 w-full md:w-52 border-b md:border-b-0 md:border-r border-border-default">
            <MapPin size={18} className="mr-2 text-primary shrink-0" />
            <select
              value={thanhPho}
              onChange={(e) => setThanhPho(e.target.value)}
              aria-label="Chọn thành phố"
              className="w-full h-11 bg-transparent outline-none cursor-pointer text-sm appearance-none font-medium text-text-primary pr-6"
            >
              {POPULAR_CITIES.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
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
              placeholder="Tìm theo kỹ năng (ReactJS, Java...), chức danh hoặc công ty..."
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

        {/* Gợi ý từ khóa kỹ năng */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-300 text-xs font-medium mr-1">
            Kỹ năng phổ biến:
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
