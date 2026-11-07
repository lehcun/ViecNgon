"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Search, Flame } from "lucide-react";

const POPULAR_TAGS = [
  "Java",
  "ReactJS",
  "NodeJS",
  "NestJS",
  "Prisma",
  "Docker",
  "SQL Server",
];

const POPULAR_CITIES = [
  { value: "", label: "Tất cả thành phố" },
  { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Hải Phòng", label: "Hải Phòng" },
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
    if (thanhPho && thanhPho.trim()) {
      params.set("thanhPho", thanhPho.trim());
    }

    const query = params.toString();
    router.push(query ? `/job-it?${query}` : "/job-it");
  };

  const handleTagClick = (tag: string) => {
    router.push(`/job-it?keyword=${encodeURIComponent(tag)}`);
  };

  return (
      <section className="bg-linear-to-r from-[#020c1b] via-[#0f2a5c] to-[#0a192f] pt-32 pb-14 px-6 shadow-inner">
        <div className="max-w-5xl mx-auto">
            {/* Tiêu đề */}
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-8 tracking-tight">
              15 Việc làm IT &quot;Ngon&quot;
            </h1>

                  {/* Khung tìm kiếm */}
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row bg-white rounded-lg p-1.5 gap-2 shadow-2xl mb-6 items-center"
                  >
                    {/* Chọn thành phố */}
                    <div className="flex items-center px-3 w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200 text-slate-700">
                      <MapPin size={18} className="mr-2 text-primary shrink-0" />
                      <select
                        value={thanhPho}
                        onChange={(e) => setThanhPho(e.target.value)}
                        className="w-full bg-transparent outline-none cursor-pointer text-sm py-2.5 appearance-none font-medium text-slate-800"
                      >
                        {POPULAR_CITIES.map((city) => (
                          <option key={city.value} value={city.value}>
                            {city.label}
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
        <div className="flex flex-wrap items-center gap-2.5 text-sm">
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

                    {/* Banner thông báo ưu đãi */}
                    <div className="mt-8 bg-black/40 border border-blue-900/40 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-100 backdrop-blur-xs">
                      <Flame className="text-blue-400 shrink-0" size={18} />
                      <span className="font-bold">Cơ hội nhận 100K</span>
                      <span className="text-slate-300">
                        Tải lên CV &amp; làm khảo sát trong tháng 4!
                      </span>
                    </div>
                  </div>
                </section>
                );
}
