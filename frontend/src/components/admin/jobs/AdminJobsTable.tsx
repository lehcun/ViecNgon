"use client";

import React from "react";
import Image from "next/image";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import type {
  AdminJobListItem,
  AdminJobStatus,
  AdminJobSummaryStats,
} from "@viecngon/types";

export const JOB_STATUS_META: Record<
  AdminJobStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  CHO_DUYET: {
    label: "Chờ duyệt",
    dotClass: "bg-warning",
    badgeClass:
      "bg-warning-soft text-warning-text border border-warning-border",
  },
  DA_DUYET: {
    label: "Đang tuyển",
    dotClass: "bg-success",
    badgeClass:
      "bg-success-soft text-success-text border border-success-border",
  },
  TU_CHOI: {
    label: "Từ chối",
    dotClass: "bg-danger",
    badgeClass: "bg-danger-soft text-danger-text border border-danger-border",
  },
  DA_AN: {
    label: "Đã ẩn",
    dotClass: "bg-text-muted",
    badgeClass:
      "bg-surface-muted text-text-secondary border border-border-default",
  },
  HET_HAN: {
    label: "Hết hạn",
    dotClass: "bg-text-placeholder",
    badgeClass:
      "bg-surface-muted text-text-muted border border-border-default",
  },
};

export function formatSalaryRange(
  min: number | null,
  max: number | null,
): string {
  const fmt = (val: number) => {
    if (val >= 1_000_000) {
      const tr = val / 1_000_000;
      return `${Number.isInteger(tr) ? tr : tr.toFixed(1)} tr`;
    }
    return `${val.toLocaleString("vi-VN")} đ`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `Từ ${fmt(min)}`;
  if (max) return `Đến ${fmt(max)}`;
  return "Thỏa thuận";
}

function formatDateVi(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isValidImageSrc(url: string | null | undefined): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  );
}

function FixedJobsColGroup() {
  return (
    <colgroup>
      <col className="w-[34%]" />
      <col className="w-[15%]" />
      <col className="w-[13%]" />
      <col className="w-[12%]" />
      <col className="w-[10%]" />
      <col className="w-[16%]" />
    </colgroup>
  );
}

interface AdminJobsTableProps {
  items: AdminJobListItem[];
  summary?: AdminJobSummaryStats;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchText: string;
  statusFilter: AdminJobStatus | "ALL";
  cityFilter: string;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: AdminJobStatus | "ALL") => void;
  onCityFilterChange: (value: string) => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
  onViewDetail: (job: AdminJobListItem) => void;
  onRequestApprove: (job: AdminJobListItem) => void;
  onRequestReject: (job: AdminJobListItem) => void;
  onRequestHide: (job: AdminJobListItem) => void;
  onRequestDelete: (job: AdminJobListItem) => void;
}

export default function AdminJobsTable({
  items,
  summary,
  pagination,
  searchText,
  statusFilter,
  cityFilter,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onSearchChange,
  onStatusFilterChange,
  onCityFilterChange,
  onResetFilters,
  onPageChange,
  onRetry,
  onViewDetail,
  onRequestApprove,
  onRequestReject,
  onRequestHide,
  onRequestDelete,
}: AdminJobsTableProps) {
  const hasActiveFilters =
    Boolean(searchText.trim()) ||
    statusFilter !== "ALL" ||
    cityFilter !== "ALL";

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;

  return (
    <div className="bg-surface-card border border-border-default rounded-xl shadow-xs overflow-hidden">
      {/* Toolbar tìm kiếm & bộ lọc cố định chống nhảy layout */}
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
            placeholder="Tìm theo tên vị trí, công ty hoặc email HR..."
            aria-label="Tìm kiếm tin tuyển dụng"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            title="Xóa toàn bộ bộ lọc hiện tại"
            className="inline-flex items-center justify-center gap-1.5 h-10 w-[112px] rounded-lg border border-border-default bg-surface-muted hover:bg-surface-subtle text-xs font-semibold text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <RotateCcw size={14} />
            Xóa bộ lọc
          </button>

          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as AdminJobStatus | "ALL")
            }
            aria-label="Lọc theo trạng thái tin"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DA_DUYET">Đang tuyển</option>
            <option value="TU_CHOI">Từ chối</option>
            <option value="DA_AN">Đã ẩn</option>
            <option value="HET_HAN">Hết hạn</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            aria-label="Lọc theo khu vực"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả khu vực</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>

          <button
            type="button"
            onClick={onRetry}
            disabled={isFetching}
            title="Tải lại danh sách"
            aria-label="Tải lại danh sách"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-text-primary disabled:opacity-50 transition-colors shrink-0"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Trạng thái Error */}
      {isError ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-danger-soft text-danger-text flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không thể tải danh sách tin tuyển dụng
          </h3>
          <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
            {errorMessage || "Vui lòng kiểm tra kết nối và thử lại."}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            <RefreshCw size={15} />
            Thử lại
          </button>
        </div>
      ) : isLoading ? (
        /* Skeleton Loading cố định cột giống hệt bảng thật */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left border-collapse">
            <FixedJobsColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Tin tuyển dụng &amp; Công ty</th>
                <th className="py-3.5 px-4">Mức lương</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Khu vực</th>
                <th className="py-3.5 px-4">Ngày đăng</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="h-[74px] animate-pulse">
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-subtle shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-48 bg-surface-subtle rounded" />
                        <div className="h-3 w-36 bg-surface-muted rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-24 bg-surface-subtle rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-6 w-24 bg-surface-subtle rounded-full" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-20 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-20 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="flex justify-end gap-1.5">
                      <div className="h-8 w-8 bg-surface-muted rounded-lg" />
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
        /* Trạng thái Empty */
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-muted text-text-muted flex items-center justify-center mx-auto mb-3">
            <Briefcase size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không có tin tuyển dụng nào phù hợp
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Thử đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc trạng thái, khu vực.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-primary transition-colors"
            >
              <RotateCcw size={15} />
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      ) : (
        /* Bảng dữ liệu cố định */
        <div
          className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-75" : "opacity-100"}`}
        >
          <table className="w-full min-w-[980px] table-fixed text-left border-collapse">
            <FixedJobsColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Tin tuyển dụng &amp; Công ty</th>
                <th className="py-3.5 px-4">Mức lương</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Khu vực</th>
                <th className="py-3.5 px-4">Ngày đăng</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-sm">
              {items.map((job) => {
                const statusInfo = JOB_STATUS_META[job.trangThai];
                const canApprove =
                  job.trangThai === "CHO_DUYET" ||
                  job.trangThai === "TU_CHOI" ||
                  job.trangThai === "DA_AN";
                const canReject = job.trangThai === "CHO_DUYET";
                const canHide = job.trangThai === "DA_DUYET";

                return (
                  <tr
                    key={job.maCongViec}
                    className="h-[74px] hover:bg-surface-page/80 transition-colors"
                  >
                    <td className="px-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {isValidImageSrc(job.company.logoUrl) ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border-default shrink-0 bg-surface-card">
                            <Image
                              src={job.company.logoUrl}
                              alt={job.company.tenCongTy}
                              fill
                              unoptimized
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">
                            {job.company.tenCongTy.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => onViewDetail(job)}
                            title={job.tenCongViec}
                            className="font-semibold text-text-primary hover:text-primary truncate block max-w-full text-left transition-colors"
                          >
                            {job.tenCongViec}
                          </button>
                          <p
                            className="text-xs text-text-muted truncate"
                            title={`${job.company.tenCongTy} · ${job.recruiter.email}`}
                          >
                            {job.company.tenCongTy} · {job.recruiter.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-success-text tabular-nums">
                        {formatSalaryRange(
                          job.mucLuongToiThieu,
                          job.mucLuongToiDa,
                        )}
                      </span>
                      <p className="text-[11px] text-text-muted truncate">
                        {job.capBac || job.loaiHinh}
                      </p>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                        />
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span className="text-xs text-text-secondary truncate block">
                        {job.thanhPho || "Toàn quốc"}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {job.hinhThucLamViec || job.loaiHinh}
                      </span>
                    </td>

                    <td className="px-4 whitespace-nowrap text-xs text-text-muted tabular-nums">
                      {formatDateVi(job.ngayDang)}
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(job)}
                          title="Xem chi tiết tin"
                          aria-label={`Xem chi tiết ${job.tenCongViec}`}
                          className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {canApprove && (
                          <button
                            type="button"
                            onClick={() => onRequestApprove(job)}
                            title="Duyệt hiển thị công khai"
                            aria-label={`Duyệt tin ${job.tenCongViec}`}
                            className="p-2 rounded-lg border border-success-border bg-success-soft hover:bg-success-light text-success-text transition-colors"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}

                        {canReject && (
                          <button
                            type="button"
                            onClick={() => onRequestReject(job)}
                            title="Từ chối tin"
                            aria-label={`Từ chối tin ${job.tenCongViec}`}
                            className="p-2 rounded-lg border border-danger-border bg-danger-soft hover:bg-danger-light text-danger-text transition-colors"
                          >
                            <XCircle size={15} />
                          </button>
                        )}

                        {canHide && (
                          <button
                            type="button"
                            onClick={() => onRequestHide(job)}
                            title="Ẩn tin khỏi công khai"
                            aria-label={`Ẩn tin ${job.tenCongViec}`}
                            className="p-2 rounded-lg border border-warning-border bg-warning-soft hover:bg-warning-light text-warning-text transition-colors"
                          >
                            <EyeOff size={15} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onRequestDelete(job)}
                          title="Xóa tin tuyển dụng"
                          aria-label={`Xóa tin ${job.tenCongViec}`}
                          className="p-2 rounded-lg border border-danger-border bg-surface-card hover:bg-danger-soft text-danger-text transition-colors"
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

      {/* Footer thống kê nhỏ gọn theo danh sách hiện tại + Phân trang */}
      <div className="px-4 py-3 border-t border-border-default bg-surface-page/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs text-text-muted">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {hasActiveFilters ? "Kết quả lọc:" : "Tổng cộng:"}{" "}
            <strong className="text-text-primary tabular-nums">
              {totalItems.toLocaleString("vi-VN")}
            </strong>{" "}
            tin
          </span>
          {summary && (
            <>
              <span className="text-border-strong">•</span>
              <span className="tabular-nums">
                Chờ duyệt:{" "}
                <strong className="text-warning-text">{summary.pending}</strong>
              </span>
              <span className="tabular-nums">
                Đang tuyển:{" "}
                <strong className="text-success-text">
                  {summary.approved}
                </strong>
              </span>
              <span className="tabular-nums">
                Từ chối:{" "}
                <strong className="text-danger-text">{summary.rejected}</strong>
              </span>
              <span className="tabular-nums">
                Đã ẩn:{" "}
                <strong className="text-text-secondary">{summary.hidden}</strong>
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
