"use client";

import React from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import type {
  AdminPackageItem,
  AdminTransactionItem,
  AdminTransactionStatus,
} from "@viecngon/types";
import { formatVnd } from "./AdminPackagesTable";

export const TX_STATUS_META: Record<
  AdminTransactionStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  THANH_CONG: {
    label: "Thành công",
    dotClass: "bg-success",
    badgeClass:
      "bg-success-soft text-success-text border border-success-border",
  },
  CHO_THANH_TOAN: {
    label: "Chờ thanh toán",
    dotClass: "bg-warning",
    badgeClass:
      "bg-warning-soft text-warning-text border border-warning-border",
  },
  THAT_BAI: {
    label: "Thất bại",
    dotClass: "bg-danger",
    badgeClass: "bg-danger-soft text-danger-text border border-danger-border",
  },
};

function formatDateTimeVi(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function FixedTxColGroup() {
  return (
    <colgroup>
      <col className="w-[17%]" />
      <col className="w-[24%]" />
      <col className="w-[15%]" />
      <col className="w-[13%]" />
      <col className="w-[13%]" />
      <col className="w-[10%]" />
      <col className="w-[8%]" />
    </colgroup>
  );
}

interface AdminTransactionsTableProps {
  items: AdminTransactionItem[];
  packages: AdminPackageItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary?: {
    totalCount: number;
    successCount: number;
    pendingCount: number;
    failedCount: number;
    totalSuccessRevenue: number;
  };
  searchText: string;
  statusFilter: AdminTransactionStatus | "ALL";
  packageFilter: string;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  isConfirming: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: AdminTransactionStatus | "ALL") => void;
  onPackageFilterChange: (value: string) => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
  onViewDetail: (tx: AdminTransactionItem) => void;
  onConfirmPayment: (tx: AdminTransactionItem) => void;
}

export default function AdminTransactionsTable({
  items,
  packages,
  pagination,
  summary,
  searchText,
  statusFilter,
  packageFilter,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  isConfirming,
  onSearchChange,
  onStatusFilterChange,
  onPackageFilterChange,
  onResetFilters,
  onPageChange,
  onRetry,
  onViewDetail,
  onConfirmPayment,
}: AdminTransactionsTableProps) {
  const hasActiveFilters =
    Boolean(searchText.trim()) ||
    statusFilter !== "ALL" ||
    packageFilter !== "ALL";

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
            placeholder="Tìm mã giao dịch, công ty, email HR..."
            aria-label="Tìm kiếm giao dịch thanh toán"
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
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(
                e.target.value as AdminTransactionStatus | "ALL",
              )
            }
            aria-label="Lọc trạng thái giao dịch"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="THANH_CONG">Thành công</option>
            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
            <option value="THAT_BAI">Thất bại</option>
          </select>

          <select
            value={packageFilter}
            onChange={(e) => onPackageFilterChange(e.target.value)}
            aria-label="Lọc theo gói dịch vụ"
            className="h-10 w-48 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả gói dịch vụ</option>
            {packages.map((pkg) => (
              <option key={pkg.maGoi} value={pkg.maGoi}>
                {pkg.tieuDe}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onRetry}
            disabled={isFetching}
            title="Tải lại"
            aria-label="Tải lại lịch sử giao dịch"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary disabled:opacity-50 transition-colors shrink-0"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {isError ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-danger-soft text-danger-text flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không thể tải lịch sử giao dịch
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
          <table className="w-full min-w-[980px] table-fixed text-left border-collapse">
            <FixedTxColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Mã giao dịch</th>
                <th className="py-3.5 px-4">Doanh nghiệp &amp; HR</th>
                <th className="py-3.5 px-4">Gói dịch vụ</th>
                <th className="py-3.5 px-4">Số tiền</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="h-[72px] animate-pulse">
                  <td className="px-4">
                    <div className="h-4 w-28 bg-surface-subtle rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-36 bg-surface-subtle rounded mb-2" />
                    <div className="h-3 w-44 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-28 bg-surface-subtle rounded" />
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
                    <div className="h-8 w-8 bg-surface-muted rounded-lg ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-muted text-text-muted flex items-center justify-center mx-auto mb-3">
            <Receipt size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không có giao dịch nào phù hợp
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Thử thay đổi từ khóa hoặc đặt lại bộ lọc trạng thái, gói dịch vụ.
          </p>
        </div>
      ) : (
        <div
          className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-75" : "opacity-100"}`}
        >
          <table className="w-full min-w-[980px] table-fixed text-left border-collapse">
            <FixedTxColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Mã giao dịch</th>
                <th className="py-3.5 px-4">Doanh nghiệp &amp; HR</th>
                <th className="py-3.5 px-4">Gói dịch vụ</th>
                <th className="py-3.5 px-4">Số tiền</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-sm">
              {items.map((tx) => {
                const statusInfo = TX_STATUS_META[tx.trangThaiTT];
                const isPending = tx.trangThaiTT === "CHO_THANH_TOAN";

                return (
                  <tr
                    key={tx.maThanhToan}
                    className="h-[72px] hover:bg-surface-page/80 transition-colors"
                  >
                    <td className="px-4">
                      <button
                        type="button"
                        onClick={() => onViewDetail(tx)}
                        title={tx.maGiaoDichDoiTac}
                        className="font-mono text-xs font-semibold text-primary hover:underline truncate block max-w-full text-left"
                      >
                        {tx.maGiaoDichDoiTac}
                      </button>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {tx.phuongThucTT || "Chuyển khoản"}
                      </p>
                    </td>

                    <td className="px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isValidImageSrc(tx.company?.logoUrl) ? (
                          <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border-default shrink-0 bg-surface-card">
                            <Image
                              src={tx.company.logoUrl}
                              alt={tx.company.tenCongTy}
                              fill
                              unoptimized
                              sizes="32px"
                              className="object-contain p-0.5"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-text-primary text-xs truncate">
                            {tx.company?.tenCongTy || tx.recruiter.tenNguoiDung}
                          </p>
                          <p className="text-[11px] text-text-muted truncate">
                            {tx.recruiter.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4">
                      <p
                        className="text-xs font-semibold text-text-primary truncate"
                        title={tx.package.tieuDe}
                      >
                        {tx.package.tieuDe}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        Còn {tx.campaign.soLuotConLai ?? 0} lượt đăng
                      </p>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-success-text tabular-nums">
                        {formatVnd(tx.soTienThanhToan)}
                      </span>
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

                    <td className="px-4 whitespace-nowrap text-[11px] text-text-muted tabular-nums">
                      {formatDateTimeVi(tx.ngayThanhToan)}
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(tx)}
                          title="Xem chi tiết hóa đơn"
                          aria-label={`Xem chi tiết ${tx.maGiaoDichDoiTac}`}
                          className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            disabled={isConfirming}
                            onClick={() => onConfirmPayment(tx)}
                            title="Xác nhận đã thanh toán"
                            aria-label={`Xác nhận thanh toán ${tx.maGiaoDichDoiTac}`}
                            className="p-2 rounded-lg border border-success-border bg-success-soft hover:bg-success-light text-success-text disabled:opacity-50 transition-colors"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer tổng doanh thu theo danh sách lọc + Phân trang */}
      <div className="px-4 py-3 border-t border-border-default bg-surface-page/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs text-text-muted">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {hasActiveFilters ? "Kết quả lọc:" : "Tổng cộng:"}{" "}
            <strong className="text-text-primary tabular-nums">
              {summary?.totalCount ?? 0}
            </strong>{" "}
            giao dịch
          </span>
          {summary && (
            <>
              <span className="text-border-strong">•</span>
              <span>
                Thành công:{" "}
                <strong className="text-success-text">
                  {summary.successCount}
                </strong>
              </span>
              <span>
                Chờ TT:{" "}
                <strong className="text-warning-text">
                  {summary.pendingCount}
                </strong>
              </span>
              <span className="text-border-strong">•</span>
              <span>
                Doanh thu:{" "}
                <strong className="text-success-text tabular-nums">
                  {formatVnd(summary.totalSuccessRevenue)}
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
