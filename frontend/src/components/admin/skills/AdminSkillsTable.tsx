"use client";

import React from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  GitMerge,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import type {
  AdminSkillItem,
  AdminSkillSortBy,
  AdminSkillUsageFilter,
} from "@viecngon/types";

function FixedSkillsColGroup() {
  return (
    <colgroup>
      <col className="w-[34%]" />
      <col className="w-[15%]" />
      <col className="w-[15%]" />
      <col className="w-[18%]" />
      <col className="w-[18%]" />
    </colgroup>
  );
}

interface AdminSkillsTableProps {
  items: AdminSkillItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    total: number;
    inUse: number;
    unused: number;
  };
  searchText: string;
  usageFilter: AdminSkillUsageFilter;
  sortBy: AdminSkillSortBy;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onSearchChange: (value: string) => void;
  onUsageFilterChange: (value: AdminSkillUsageFilter) => void;
  onSortByChange: (value: AdminSkillSortBy) => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
  onRequestCreate: () => void;
  onRequestEdit: (skill: AdminSkillItem) => void;
  onRequestMerge: (skill: AdminSkillItem) => void;
  onRequestDelete: (skill: AdminSkillItem) => void;
}

export default function AdminSkillsTable({
  items,
  pagination,
  summary,
  searchText,
  usageFilter,
  sortBy,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onSearchChange,
  onUsageFilterChange,
  onSortByChange,
  onResetFilters,
  onPageChange,
  onRetry,
  onRequestCreate,
  onRequestEdit,
  onRequestMerge,
  onRequestDelete,
}: AdminSkillsTableProps) {
  const hasActiveFilters =
    Boolean(searchText.trim()) ||
    usageFilter !== "ALL" ||
    sortBy !== "tenKyNang";

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="bg-surface-card border border-border-default rounded-xl shadow-xs overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border-default flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="relative w-full xl:w-80 shrink-0">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kỹ năng (ReactJS, NestJS, Docker...)"
            aria-label="Tìm kiếm kỹ năng IT"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center justify-center gap-1.5 h-10 w-[112px] rounded-lg border border-border-default bg-surface-muted hover:bg-surface-subtle text-xs font-semibold text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <RotateCcw size={14} />
            Xóa bộ lọc
          </button>

          <select
            value={usageFilter}
            onChange={(e) =>
              onUsageFilterChange(e.target.value as AdminSkillUsageFilter)
            }
            aria-label="Lọc trạng thái sử dụng"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả kỹ năng</option>
            <option value="IN_USE">Đang sử dụng</option>
            <option value="UNUSED">Chưa sử dụng</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(e.target.value as AdminSkillSortBy)
            }
            aria-label="Sắp xếp danh sách kỹ năng"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="tenKyNang">Sắp xếp: Tên A-Z</option>
            <option value="jobsCount">Nhiều tin tuyển nhất</option>
            <option value="candidatesCount">Nhiều ứng viên nhất</option>
          </select>

          <button
            type="button"
            onClick={onRetry}
            disabled={isFetching}
            title="Tải lại"
            aria-label="Tải lại danh sách kỹ năng"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary disabled:opacity-50 transition-colors shrink-0"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={onRequestCreate}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus size={16} />
            Thêm kỹ năng
          </button>
        </div>
      </div>

      {isError ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-danger-soft text-danger-text flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không thể tải từ điển kỹ năng
          </h3>
          <p className="text-sm text-text-muted mt-1">
            {errorMessage || "Vui lòng thử lại sau."}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold"
          >
            <RefreshCw size={15} />
            Thử lại
          </button>
        </div>
      ) : isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] table-fixed text-left border-collapse">
            <FixedSkillsColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Tên kỹ năng</th>
                <th className="py-3.5 px-4">Tin tuyển dụng</th>
                <th className="py-3.5 px-4">Ứng viên</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="h-[60px] animate-pulse">
                  <td className="px-4">
                    <div className="h-4 w-36 bg-surface-subtle rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-12 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-12 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-6 w-24 bg-surface-subtle rounded-full" />
                  </td>
                  <td className="px-4">
                    <div className="flex justify-end gap-1.5">
                      <div className="h-8 w-8 bg-surface-muted rounded-lg" />
                      <div className="h-8 w-8 bg-surface-muted rounded-lg" />
                      <div className="h-8 w-8 bg-surface-muted rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-muted text-text-muted flex items-center justify-center mx-auto mb-3">
            <Code2 size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không có kỹ năng nào phù hợp
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Thử đổi từ khóa tìm kiếm hoặc bấm &ldquo;Thêm kỹ năng&rdquo; mới.
          </p>
        </div>
      ) : (
        <div
          className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-75" : "opacity-100"}`}
        >
          <table className="w-full min-w-[780px] table-fixed text-left border-collapse">
            <FixedSkillsColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Tên kỹ năng</th>
                <th className="py-3.5 px-4">Tin tuyển dụng</th>
                <th className="py-3.5 px-4">Ứng viên</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-sm">
              {items.map((skill) => {
                const isInUse = skill.totalUsage > 0;
                return (
                  <tr
                    key={skill.maKyNang}
                    className="h-[60px] hover:bg-surface-page/80 transition-colors"
                  >
                    <td className="px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-md bg-primary-light text-primary flex items-center justify-center shrink-0">
                          <Code2 size={14} />
                        </span>
                        <span
                          className="font-semibold text-text-primary truncate"
                          title={skill.tenKyNang}
                        >
                          {skill.tenKyNang}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 whitespace-nowrap text-xs font-semibold text-text-primary tabular-nums">
                      {skill.jobsCount} tin
                    </td>

                    <td className="px-4 whitespace-nowrap text-xs font-semibold text-text-primary tabular-nums">
                      {skill.candidatesCount} hồ sơ
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isInUse
                            ? "bg-success-soft text-success-text border border-success-border"
                            : "bg-surface-muted text-text-muted border border-border-default"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isInUse ? "bg-success" : "bg-text-placeholder"
                          }`}
                        />
                        {isInUse ? "Đang sử dụng" : "Chưa sử dụng"}
                      </span>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onRequestEdit(skill)}
                          title="Đổi tên chuẩn hóa"
                          aria-label={`Đổi tên ${skill.tenKyNang}`}
                          className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onRequestMerge(skill)}
                          title="Gộp vào kỹ năng chuẩn khác"
                          aria-label={`Gộp kỹ năng ${skill.tenKyNang}`}
                          className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-ai-light text-text-secondary hover:text-ai transition-colors"
                        >
                          <GitMerge size={15} />
                        </button>

                        <button
                          type="button"
                          disabled={isInUse}
                          onClick={() => onRequestDelete(skill)}
                          title={
                            isInUse
                              ? "Đang được gắn trên Job/Ứng viên — hãy dùng nút Gộp kỹ năng"
                              : "Xóa kỹ năng chưa sử dụng"
                          }
                          aria-label={`Xóa kỹ năng ${skill.tenKyNang}`}
                          className="p-2 rounded-lg border border-danger-border bg-surface-card hover:bg-danger-soft text-danger-text disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer thống kê gọn + Phân trang */}
      <div className="px-4 py-3 border-t border-border-default bg-surface-page/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs text-text-muted">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {hasActiveFilters ? "Kết quả lọc:" : "Tổng cộng:"}{" "}
            <strong className="text-text-primary tabular-nums">
              {summary?.total ?? 0}
            </strong>{" "}
            kỹ năng
          </span>
          {summary && (
            <>
              <span className="text-border-strong">•</span>
              <span>
                Đang sử dụng:{" "}
                <strong className="text-success-text">{summary.inUse}</strong>
              </span>
              <span>
                Chưa sử dụng:{" "}
                <strong className="text-text-secondary">
                  {summary.unused}
                </strong>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-primary font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            Trước
          </button>
          <span className="px-2 font-semibold text-text-primary tabular-nums">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-primary font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sau
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
