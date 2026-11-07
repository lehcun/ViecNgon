"use client";

import React from "react";
import { Filter, RotateCcw, ChevronDown, Check } from "lucide-react";
import { SearchJobsQuery } from "@viecngon/types";

interface JobFilterPanelProps {
  filters: SearchJobsQuery;
  activeCount: number;
  totalResults: number;
  onFilterChange: (key: string, value: string | undefined) => void;
  onClearAll: () => void;
}

const WORK_MODELS = [
  { label: "Tất cả", value: "" },
  { label: "Tại văn phòng", value: "Tại văn phòng" },
  { label: "Remote (Từ xa)", value: "Remote" },
  { label: "Hybrid (Linh hoạt)", value: "Hybrid" },
];

const SALARY_RANGES = [
  { label: "Tất cả mức lương", value: "" },
  { label: "Dưới 10 triệu", value: "UNDER_10" },
  { label: "10 - 20 triệu", value: "10_20" },
  { label: "20 - 30 triệu", value: "20_30" },
  { label: "Trên 30 triệu", value: "OVER_30" },
  { label: "Thỏa thuận", value: "NEGOTIABLE" },
];

const LEVELS = [
  { label: "Tất cả cấp bậc", value: "" },
  { label: "Intern / Thực tập", value: "Intern" },
  { label: "Fresher", value: "Fresher" },
  { label: "Junior", value: "Junior" },
  { label: "Senior", value: "Senior" },
  { label: "Leader / Manager", value: "Manager" },
];

const EXPERIENCES = [
  { label: "Tất cả kinh nghiệm", value: "" },
  { label: "Chưa có kinh nghiệm", value: "0" },
  { label: "1 năm trở lên", value: "1" },
  { label: "2 năm trở lên", value: "2" },
  { label: "3 năm trở lên", value: "3" },
  { label: "5+ năm kinh nghiệm", value: "5" },
];

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "NEWEST" },
  { label: "Lương cao nhất", value: "SALARY_DESC" },
  { label: "Xem nhiều nhất", value: "MOST_VIEWED" },
];

export default function JobFilterPanel({
  filters,
  activeCount,
  totalResults,
  onFilterChange,
  onClearAll,
}: JobFilterPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6">
      {/* Hàng 1: Tiêu đề + Đếm số lượng + Sắp xếp + Nút Xóa bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <Filter size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Bộ lọc nâng cao
              </h2>
              <p className="text-xs text-slate-500">
                Tìm thấy <strong className="text-primary font-bold">{totalResults}</strong> việc làm phù hợp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sắp xếp */}
            <div className="relative">
              <select
                value={filters.sortBy || "NEWEST"}
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sắp xếp: {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Nút Xóa tất cả bộ lọc (chỉ hiện khi có filter active) */}
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Xóa bộ lọc ({activeCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Hàng 2: Nhóm Pill buttons chọn Hình thức làm việc */}
        <div className="pt-4 pb-3">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Hình thức làm việc:
          </label>
          <div className="flex flex-wrap gap-2">
            {WORK_MODELS.map((item) => {
              const isSelected =
                (!filters.hinhThucLamViec && item.value === "") ||
                filters.hinhThucLamViec === item.value;

              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => onFilterChange("hinhThucLamViec", item.value)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hàng 3: Các Dropdowns (Mức lương, Cấp bậc, Kinh nghiệm) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Dropdown Mức lương */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Mức lương mong muốn
            </label>
            <div className="relative">
              <select
                value={filters.salaryRange || ""}
                onChange={(e) => onFilterChange("salaryRange", e.target.value)}
                className="w-full h-10 pl-3 pr-8 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none appearance-none cursor-pointer focus:border-primary focus:bg-white transition-all"
              >
                {SALARY_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Dropdown Cấp bậc */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Cấp bậc
            </label>
            <div className="relative">
              <select
                value={filters.capBac || ""}
                onChange={(e) => onFilterChange("capBac", e.target.value)}
                className="w-full h-10 pl-3 pr-8 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none appearance-none cursor-pointer focus:border-primary focus:bg-white transition-all"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Dropdown Kinh nghiệm */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Kinh nghiệm làm việc
            </label>
            <div className="relative">
              <select
                value={
                  filters.yeuCauKinhNghiem !== undefined
                    ? String(filters.yeuCauKinhNghiem)
                    : ""
                }
                onChange={(e) => onFilterChange("yeuCauKinhNghiem", e.target.value)}
                className="w-full h-10 pl-3 pr-8 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none appearance-none cursor-pointer focus:border-primary focus:bg-white transition-all"
              >
                {EXPERIENCES.map((exp) => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
      );
}

