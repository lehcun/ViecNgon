"use client";

import React from "react";
import {
  Search,
  Star,
  Calendar,
  RotateCcw,
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  LayoutList,
} from "lucide-react";
import type {
  AdminReviewDatePreset,
  AdminReviewFilterTab,
} from "@viecngon/types";
import { cn } from "@/lib/utils";

export interface AdminReviewsFiltersState {
  searchQuery: string;
  starFilter: string;
  datePreset: AdminReviewDatePreset;
  dateFrom: string;
  dateTo: string;
}

interface AdminReviewsFilterBarProps {
  activeTab: AdminReviewFilterTab;
  onTabChange: (tab: AdminReviewFilterTab) => void;
  counts: {
    total: number;
    pending: number;
    reported: number;
    approved: number;
    rejected: number;
  };
  filters: AdminReviewsFiltersState;
  onFilterChange: (patch: Partial<AdminReviewsFiltersState>) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export default function AdminReviewsFilterBar({
  activeTab,
  onTabChange,
  counts,
  filters,
  onFilterChange,
  hasActiveFilters,
  onResetFilters,
}: AdminReviewsFilterBarProps) {
  const tabs: {
    key: AdminReviewFilterTab;
    label: string;
    count: number;
    icon: React.ReactNode;
    activeClass: string;
    inactiveClass: string;
    activeBadgeClass: string;
    inactiveBadgeClass: string;
  }[] = [
    {
      key: "ALL",
      label: "Tất cả",
      count: counts.total,
      icon: <LayoutList size={14} />,
      activeClass: "bg-primary text-white border-primary shadow-sm",
      inactiveClass:
        "bg-surface-page text-text-secondary border-border-default hover:border-primary/40 hover:text-primary",
      activeBadgeClass: "bg-white/25 text-white",
      inactiveBadgeClass: "bg-surface-subtle text-text-primary",
    },
    {
      key: "CHO_DUYET",
      label: "Chờ duyệt",
      count: counts.pending,
      icon: <Clock size={14} />,
      activeClass: "bg-warning text-white border-warning shadow-sm",
      inactiveClass:
        "bg-warning-soft text-warning-text border-warning-border hover:bg-warning-light",
      activeBadgeClass: "bg-white/25 text-white",
      inactiveBadgeClass: "bg-warning text-white",
    },
    {
      key: "REPORTED",
      label: "Bị báo cáo",
      count: counts.reported,
      icon: <Flag size={14} />,
      activeClass: "bg-danger text-white border-danger shadow-sm",
      inactiveClass:
        "bg-danger-soft text-danger-text border-danger-border hover:bg-danger-light",
      activeBadgeClass: "bg-white/25 text-white",
      inactiveBadgeClass: "bg-danger text-white",
    },
    {
      key: "DA_DUYET",
      label: "Đã duyệt",
      count: counts.approved,
      icon: <CheckCircle2 size={14} />,
      activeClass: "bg-success text-white border-success shadow-sm",
      inactiveClass:
        "bg-success-soft text-success-text border-success-border hover:bg-success-light",
      activeBadgeClass: "bg-white/25 text-white",
      inactiveBadgeClass: "bg-success text-white",
    },
    {
      key: "REJECTED",
      label: "Từ chối / Đã ẩn",
      count: counts.rejected,
      icon: <XCircle size={14} />,
      activeClass: "bg-slate-700 text-white border-slate-700 shadow-sm",
      inactiveClass:
        "bg-surface-muted text-text-secondary border-border-strong hover:bg-surface-subtle hover:text-text-primary",
      activeBadgeClass: "bg-white/20 text-white",
      inactiveBadgeClass: "bg-slate-600 text-white",
    },
  ];

  return (
    <div className="p-4 sm:p-5 border-b border-border-default space-y-4">
      {/* Hàng 1: Tabs trạng thái nổi bật */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold border transition-all inline-flex items-center gap-2",
                isActive ? tab.activeClass : tab.inactiveClass,
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums leading-none",
                  isActive ? tab.activeBadgeClass : tab.inactiveBadgeClass,
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hàng 2: Bộ lọc chi tiết (Tìm kiếm, Số sao, Ngày) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
        <div className="relative lg:col-span-5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Tìm tên công ty, tiêu đề, nội dung..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border-default bg-surface-page text-xs text-text-primary placeholder:text-text-placeholder focus:outline-none focus:bg-surface-card focus:border-primary"
          />
        </div>

        <div className="relative lg:col-span-3">
          <Star
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none"
          />
          <select
            aria-label="Lọc theo số sao"
            value={filters.starFilter}
            onChange={(e) => onFilterChange({ starFilter: e.target.value })}
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-border-default bg-surface-page text-xs font-medium text-text-primary focus:outline-none focus:bg-surface-card focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả số sao</option>
            <option value="5">5 sao (Xuất sắc)</option>
            <option value="4">4 sao (Tốt)</option>
            <option value="3">3 sao (Trung bình)</option>
            <option value="2">2 sao (Thấp)</option>
            <option value="1">1 sao (Rất thấp)</option>
          </select>
        </div>

        <div className="relative lg:col-span-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <select
              aria-label="Lọc theo thời gian"
              value={filters.datePreset}
              onChange={(e) =>
                onFilterChange({
                  datePreset: e.target.value as AdminReviewDatePreset,
                })
              }
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-border-default bg-surface-page text-xs font-medium text-text-primary focus:outline-none focus:bg-surface-card focus:border-primary cursor-pointer"
            >
              <option value="ALL">Tất cả thời gian</option>
              <option value="TODAY">Hôm nay</option>
              <option value="LAST_7_DAYS">7 ngày gần đây</option>
              <option value="LAST_30_DAYS">30 ngày gần đây</option>
              <option value="THIS_MONTH">Trong tháng này</option>
              <option value="CUSTOM">Chọn khoảng ngày...</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Đặt lại bộ lọc"
              className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg border border-border-default bg-surface-card text-xs font-semibold text-text-secondary hover:text-danger hover:border-danger-border transition-colors shrink-0"
            >
              <RotateCcw size={13} />
              <span className="hidden xl:inline">Đặt lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Khoảng ngày tùy chọn khi chọn CUSTOM */}
      {filters.datePreset === "CUSTOM" && (
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <label className="inline-flex items-center gap-2 text-text-secondary font-medium">
            <span>Từ ngày:</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-border-default bg-surface-page text-text-primary focus:outline-none focus:border-primary"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-text-secondary font-medium">
            <span>Đến ngày:</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange({ dateTo: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-border-default bg-surface-page text-text-primary focus:outline-none focus:border-primary"
            />
          </label>
        </div>
      )}
    </div>
  );
}
