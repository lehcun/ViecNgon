"use client";

import React from "react";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { SearchJobsQuery } from "@viecngon/types";
import { cn } from "@/lib/utils";

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
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
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
  { label: "Intern", value: "Intern" },
  { label: "Fresher", value: "Fresher" },
  { label: "Junior", value: "Junior" },
  { label: "Middle", value: "Middle" },
  { label: "Senior", value: "Senior" },
  { label: "Lead", value: "Lead" },
];

const EXPERIENCES = [
  { label: "Tất cả kinh nghiệm", value: "" },
  { label: "Không yêu cầu", value: "0" },
  { label: "Từ 1 năm", value: "1" },
  { label: "Từ 2 năm", value: "2" },
  { label: "Từ 3 năm", value: "3" },
  { label: "Từ 5 năm", value: "5" },
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
    <div className="bg-surface-card rounded-xl border border-border-default p-5 shadow-xs mb-6">
      {/* Hàng 1: Tiêu đề + Đếm kết quả + Sắp xếp + Xóa lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-default gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Filter size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Bộ lọc tìm kiếm
            </h2>
            <p className="text-xs text-text-muted">
              Tìm thấy{" "}
              <strong className="text-primary font-semibold tabular-nums">
                {totalResults}
              </strong>{" "}
              việc làm phù hợp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select
              value={filters.sortBy || "NEWEST"}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              aria-label="Sắp xếp kết quả"
              className="h-9 pl-3 pr-8 text-xs font-medium text-text-secondary bg-surface-page border border-border-default rounded-lg outline-none cursor-pointer appearance-none hover:bg-surface-muted focus:border-primary transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sắp xếp: {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
            />
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold text-danger-text bg-danger-soft border border-danger-border hover:bg-danger-light rounded-lg transition-colors"
            >
              <RotateCcw size={13} />
              <span>Xóa bộ lọc ({activeCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Hàng 2: Chip lọc Hình thức làm việc */}
      <div className="pt-4 pb-3">
        <p className="text-xs font-medium text-text-secondary mb-2">
          Hình thức làm việc
        </p>
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
                className={cn(
                  "h-8 px-3.5 text-xs font-medium rounded-full border transition-colors",
                  isSelected
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-muted text-text-secondary border-transparent hover:border-border-strong",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hàng 3: Dropdowns (Mức lương, Cấp bậc, Kinh nghiệm) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Mức lương
          </label>
          <div className="relative">
            <select
              value={filters.salaryRange || ""}
              onChange={(e) => onFilterChange("salaryRange", e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-sm font-medium text-text-primary bg-surface-page border border-border-default rounded-lg outline-none appearance-none cursor-pointer focus:border-primary focus:bg-surface-card transition-colors"
            >
              {SALARY_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Cấp bậc
          </label>
          <div className="relative">
            <select
              value={filters.capBac || ""}
              onChange={(e) => onFilterChange("capBac", e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-sm font-medium text-text-primary bg-surface-page border border-border-default rounded-lg outline-none appearance-none cursor-pointer focus:border-primary focus:bg-surface-card transition-colors"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Kinh nghiệm
          </label>
          <div className="relative">
            <select
              value={
                filters.yeuCauKinhNghiem !== undefined
                  ? String(filters.yeuCauKinhNghiem)
                  : ""
              }
              onChange={(e) =>
                onFilterChange("yeuCauKinhNghiem", e.target.value)
              }
              className="w-full h-10 pl-3 pr-8 text-sm font-medium text-text-primary bg-surface-page border border-border-default rounded-lg outline-none appearance-none cursor-pointer focus:border-primary focus:bg-surface-card transition-colors"
            >
              {EXPERIENCES.map((exp) => (
                <option key={exp.value} value={exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
