"use client";

import React, { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  Filter,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { SearchJobsQuery } from "@viecngon/types";
import { cn } from "@/lib/utils";

interface JobFilterPanelProps {
  filters: SearchJobsQuery;
  activeCount: number;
  totalResults: number;
  onFilterChange: (key: string, value: string | undefined) => void;
  onApplyMultiple: (
    newFilters: Record<string, string | undefined | null>,
  ) => void;
  onClearAll: () => void;
}

const LEVELS = [
  { label: "Intern", value: "Intern" },
  { label: "Fresher", value: "Fresher" },
  { label: "Junior", value: "Junior" },
  { label: "Middle", value: "Middle" },
  { label: "Senior", value: "Senior" },
  { label: "Lead", value: "Lead" },
  { label: "Manager", value: "Manager" },
];

const WORK_MODELS = [
  { label: "Tại văn phòng", value: "Tại văn phòng" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];

const SALARY_RANGES = [
  { label: "Dưới 10 triệu", value: "UNDER_10" },
  { label: "10 - 20 triệu", value: "10_20" },
  { label: "20 - 30 triệu", value: "20_30" },
  { label: "Trên 30 triệu", value: "OVER_30" },
  { label: "Thỏa thuận", value: "NEGOTIABLE" },
];

const EXPERIENCES = [
  { label: "Không yêu cầu", value: "0" },
  { label: "Từ 1 năm", value: "1" },
  { label: "Từ 2 năm", value: "2" },
  { label: "Từ 3 năm", value: "3" },
  { label: "Từ 5 năm", value: "5" },
];

const JOB_TYPES = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Freelance", value: "Freelance" },
];

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "NEWEST" },
  { label: "Lương cao nhất", value: "SALARY_DESC" },
  { label: "Xem nhiều nhất", value: "MOST_VIEWED" },
];

const SALARY_SLIDER_MIN = 0;
const SALARY_SLIDER_MAX = 100; // triệu VNĐ
const MILLION = 1_000_000;

interface FilterDraftState {
  capBac: string;
  hinhThucLamViec: string;
  loaiHinh: string;
  yeuCauKinhNghiem: string;
  salaryRange: string;
  minSalaryMil: number;
  maxSalaryMil: number;
  sortBy: string;
}

function createDraftFromFilters(filters: SearchJobsQuery): FilterDraftState {
  const minFromQuery = filters.mucLuongMin
    ? Math.max(
        SALARY_SLIDER_MIN,
        Math.min(
          SALARY_SLIDER_MAX,
          Math.round(Number(filters.mucLuongMin) / MILLION),
        ),
      )
    : SALARY_SLIDER_MIN;

  const maxFromQuery = filters.mucLuongMax
    ? Math.max(
        SALARY_SLIDER_MIN,
        Math.min(
          SALARY_SLIDER_MAX,
          Math.round(Number(filters.mucLuongMax) / MILLION),
        ),
      )
    : SALARY_SLIDER_MAX;

  return {
    capBac: filters.capBac || "",
    hinhThucLamViec: filters.hinhThucLamViec || "",
    loaiHinh: filters.loaiHinh || "",
    yeuCauKinhNghiem:
      filters.yeuCauKinhNghiem !== undefined
        ? String(filters.yeuCauKinhNghiem)
        : "",
    salaryRange: filters.salaryRange || "",
    minSalaryMil: minFromQuery,
    maxSalaryMil: Math.max(minFromQuery, maxFromQuery),
    sortBy: filters.sortBy || "NEWEST",
  };
}

export default function JobFilterPanel({
  filters,
  activeCount,
  totalResults,
  onFilterChange,
  onApplyMultiple,
  onClearAll,
}: JobFilterPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraftState>(() =>
    createDraftFromFilters(filters),
  );

  // Đồng bộ draft mỗi khi mở modal hoặc đóng bằng Escape
  const openModal = () => {
    setDraft(createDraftFromFilters(filters));
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const toggleDraftValue = (
    field:
      | "capBac"
      | "hinhThucLamViec"
      | "loaiHinh"
      | "yeuCauKinhNghiem",
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const toggleDraftSalaryPreset = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      salaryRange: prev.salaryRange === value ? "" : value,
      minSalaryMil: SALARY_SLIDER_MIN,
      maxSalaryMil: SALARY_SLIDER_MAX,
    }));
  };

  const handleMinSliderChange = (value: number) => {
    setDraft((prev) => ({
      ...prev,
      salaryRange: "",
      minSalaryMil: Math.min(value, prev.maxSalaryMil - 5),
    }));
  };

  const handleMaxSliderChange = (value: number) => {
    setDraft((prev) => ({
      ...prev,
      salaryRange: "",
      maxSalaryMil: Math.max(value, prev.minSalaryMil + 5),
    }));
  };

  const handleResetDraft = () => {
    setDraft({
      capBac: "",
      hinhThucLamViec: "",
      loaiHinh: "",
      yeuCauKinhNghiem: "",
      salaryRange: "",
      minSalaryMil: SALARY_SLIDER_MIN,
      maxSalaryMil: SALARY_SLIDER_MAX,
      sortBy: "NEWEST",
    });
  };

  const handleApplyModal = () => {
    const hasCustomSlider =
      !draft.salaryRange &&
      (draft.minSalaryMil > SALARY_SLIDER_MIN ||
        draft.maxSalaryMil < SALARY_SLIDER_MAX);

    onApplyMultiple({
      capBac: draft.capBac || undefined,
      hinhThucLamViec: draft.hinhThucLamViec || undefined,
      loaiHinh: draft.loaiHinh || undefined,
      yeuCauKinhNghiem: draft.yeuCauKinhNghiem || undefined,
      salaryRange: draft.salaryRange || undefined,
      mucLuongMin:
        hasCustomSlider && draft.minSalaryMil > SALARY_SLIDER_MIN
          ? String(draft.minSalaryMil * MILLION)
          : undefined,
      mucLuongMax:
        hasCustomSlider && draft.maxSalaryMil < SALARY_SLIDER_MAX
          ? String(draft.maxSalaryMil * MILLION)
          : undefined,
      sortBy: draft.sortBy || "NEWEST",
    });
    setIsModalOpen(false);
  };

  const hasCustomSalaryQuery = Boolean(
    filters.mucLuongMin || filters.mucLuongMax,
  );
  const salaryPresetLabel =
    SALARY_RANGES.find((r) => r.value === filters.salaryRange)?.label || "";
  const activeSalaryLabel =
    draft.salaryRange === "NEGOTIABLE"
      ? "Thỏa thuận"
      : draft.salaryRange
        ? SALARY_RANGES.find((r) => r.value === draft.salaryRange)?.label
        : `${draft.minSalaryMil} triệu - ${draft.maxSalaryMil}${draft.maxSalaryMil >= SALARY_SLIDER_MAX ? "+" : ""} triệu VNĐ`;

  return (
    <>
      <div className="mb-5">
        {/* Tiêu đề tổng số kết quả chuẩn bố cục ảnh mẫu */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
            {totalResults} việc làm IT{" "}
            {filters.thanhPho ? `tại ${filters.thanhPho}` : "tại Việt Nam"}
            {filters.keyword ? (
              <span className="text-primary"> • &ldquo;{filters.keyword}&rdquo;</span>
            ) : null}
          </h2>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <RotateCcw size={13} />
              <span>Xóa {activeCount} bộ lọc</span>
            </button>
          )}
        </div>

        {/* Thanh bộ lọc thu gọn (Compact horizontal bar) */}
        <div className="bg-surface-card border border-border-default rounded-xl px-3.5 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pill Cấp bậc */}
            <div className="relative">
              <select
                aria-label="Cấp bậc"
                value={filters.capBac || ""}
                onChange={(e) => onFilterChange("capBac", e.target.value)}
                className={cn(
                  "h-9 pl-3.5 pr-8 rounded-full border text-xs sm:text-sm font-medium outline-none appearance-none cursor-pointer transition-colors",
                  filters.capBac
                    ? "border-primary bg-primary-light/70 text-primary"
                    : "border-border-default bg-surface-card text-text-primary hover:border-border-strong",
                )}
              >
                <option value="">Cấp bậc</option>
                {LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>

            {/* Pill Hình thức làm việc */}
            <div className="relative">
              <select
                aria-label="Hình thức làm việc"
                value={filters.hinhThucLamViec || ""}
                onChange={(e) =>
                  onFilterChange("hinhThucLamViec", e.target.value)
                }
                className={cn(
                  "h-9 pl-3.5 pr-8 rounded-full border text-xs sm:text-sm font-medium outline-none appearance-none cursor-pointer transition-colors",
                  filters.hinhThucLamViec
                    ? "border-primary bg-primary-light/70 text-primary"
                    : "border-border-default bg-surface-card text-text-primary hover:border-border-strong",
                )}
              >
                <option value="">Hình thức</option>
                {WORK_MODELS.map((wm) => (
                  <option key={wm.value} value={wm.value}>
                    {wm.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>

            {/* Pill Mức lương */}
            <div className="relative">
              <select
                aria-label="Mức lương"
                value={filters.salaryRange || ""}
                onChange={(e) => {
                  onApplyMultiple({
                    salaryRange: e.target.value || undefined,
                    mucLuongMin: undefined,
                    mucLuongMax: undefined,
                  });
                }}
                className={cn(
                  "h-9 pl-3.5 pr-8 rounded-full border text-xs sm:text-sm font-medium outline-none appearance-none cursor-pointer transition-colors",
                  filters.salaryRange || hasCustomSalaryQuery
                    ? "border-primary bg-primary-light/70 text-primary"
                    : "border-border-default bg-surface-card text-text-primary hover:border-border-strong",
                )}
              >
                <option value="">
                  {hasCustomSalaryQuery && !salaryPresetLabel
                    ? "Mức lương (Tùy chỉnh)"
                    : "Mức lương"}
                </option>
                {SALARY_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>

            {/* Pill Kinh nghiệm */}
            <div className="relative">
              <select
                aria-label="Kinh nghiệm"
                value={
                  filters.yeuCauKinhNghiem !== undefined
                    ? String(filters.yeuCauKinhNghiem)
                    : ""
                }
                onChange={(e) =>
                  onFilterChange("yeuCauKinhNghiem", e.target.value)
                }
                className={cn(
                  "h-9 pl-3.5 pr-8 rounded-full border text-xs sm:text-sm font-medium outline-none appearance-none cursor-pointer transition-colors",
                  filters.yeuCauKinhNghiem !== undefined
                    ? "border-primary bg-primary-light/70 text-primary"
                    : "border-border-default bg-surface-card text-text-primary hover:border-border-strong",
                )}
              >
                <option value="">Kinh nghiệm</option>
                {EXPERIENCES.map((exp) => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>

            {/* Pill Sắp xếp */}
            <div className="relative">
              <select
                aria-label="Sắp xếp theo"
                value={filters.sortBy || "NEWEST"}
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
                className="h-9 pl-3.5 pr-8 rounded-full border border-border-default bg-surface-card text-text-primary hover:border-border-strong text-xs sm:text-sm font-medium outline-none appearance-none cursor-pointer transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* Nút Bộ lọc mở Modal Popup */}
          <button
            type="button"
            onClick={openModal}
            className={cn(
              "inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-xs sm:text-sm font-semibold transition-colors shrink-0",
              activeCount > 0
                ? "border-primary bg-primary-light/60 text-primary hover:bg-primary-light"
                : "border-border-default bg-surface-card text-text-primary hover:border-primary hover:text-primary",
            )}
          >
            <Filter size={15} />
            <span>Bộ lọc</span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold tabular-nums">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Modal Popup Bộ lọc chi tiết */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-filter-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px]"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-surface-card rounded-2xl border border-border-default shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-surface-card">
              <h3
                id="job-filter-modal-title"
                className="text-lg font-bold text-text-primary"
              >
                Bộ lọc
              </h3>
              <button
                type="button"
                aria-label="Đóng bộ lọc"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal có thanh cuộn */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Section 1: Cấp bậc */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">
                  Cấp bậc
                </h4>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((lvl) => {
                    const selected = draft.capBac === lvl.value;
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => toggleDraftValue("capBac", lvl.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border-default bg-surface-card text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{lvl.label}</span>
                        {selected ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Hình thức làm việc */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">
                  Hình thức làm việc
                </h4>
                <div className="flex flex-wrap gap-2">
                  {WORK_MODELS.map((wm) => {
                    const selected = draft.hinhThucLamViec === wm.value;
                    return (
                      <button
                        key={wm.value}
                        type="button"
                        onClick={() =>
                          toggleDraftValue("hinhThucLamViec", wm.value)
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border-default bg-surface-card text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{wm.label}</span>
                        {selected ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Mức lương (Slider kép + Preset chips) */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">
                  Mức lương
                </h4>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-text-primary min-w-[175px] tabular-nums">
                    {activeSalaryLabel}
                  </span>

                  {/* Thanh Dual Range Slider */}
                  <div className="relative flex-1 h-9 rounded-full border border-border-default bg-surface-page px-3 flex items-center">
                    <div className="relative w-full h-1.5 bg-border-default rounded-full">
                      <div
                        className="absolute top-0 bottom-0 rounded-full bg-success"
                        style={{
                          left: `${draft.minSalaryMil}%`,
                          right: `${100 - draft.maxSalaryMil}%`,
                        }}
                      />
                      <input
                        type="range"
                        aria-label="Mức lương tối thiểu (triệu VNĐ)"
                        min={SALARY_SLIDER_MIN}
                        max={SALARY_SLIDER_MAX}
                        step={5}
                        value={draft.minSalaryMil}
                        onChange={(e) =>
                          handleMinSliderChange(Number(e.target.value))
                        }
                        className="pointer-events-none absolute inset-0 w-full h-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-success [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <input
                        type="range"
                        aria-label="Mức lương tối đa (triệu VNĐ)"
                        min={SALARY_SLIDER_MIN}
                        max={SALARY_SLIDER_MAX}
                        step={5}
                        value={draft.maxSalaryMil}
                        onChange={(e) =>
                          handleMaxSliderChange(Number(e.target.value))
                        }
                        className="pointer-events-none absolute inset-0 w-full h-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-success [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset mức lương nhanh */}
                <div className="flex flex-wrap gap-2">
                  {SALARY_RANGES.map((range) => {
                    const selected = draft.salaryRange === range.value;
                    return (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => toggleDraftSalaryPreset(range.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border-default bg-surface-card text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{range.label}</span>
                        {selected ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Kinh nghiệm */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">
                  Kinh nghiệm
                </h4>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCES.map((exp) => {
                    const selected = draft.yeuCauKinhNghiem === exp.value;
                    return (
                      <button
                        key={exp.value}
                        type="button"
                        onClick={() =>
                          toggleDraftValue("yeuCauKinhNghiem", exp.value)
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border-default bg-surface-card text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{exp.label}</span>
                        {selected ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Loại hình công việc */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">
                  Loại hình công việc
                </h4>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((jt) => {
                    const selected = draft.loaiHinh === jt.value;
                    return (
                      <button
                        key={jt.value}
                        type="button"
                        onClick={() => toggleDraftValue("loaiHinh", jt.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border-default bg-surface-card text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{jt.label}</span>
                        {selected ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 6: Sắp xếp */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">
                  Sắp xếp theo
                </h4>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const selected = draft.sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({ ...prev, sortBy: opt.value }))
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border-default bg-surface-card text-text-secondary hover:border-border-strong",
                        )}
                      >
                        <span>{opt.label}</span>
                        {selected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-border-default bg-surface-card flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleResetDraft}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Đặt lại bộ lọc
              </button>

              <button
                type="button"
                onClick={handleApplyModal}
                className="px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-colors shadow-xs"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
