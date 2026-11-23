"use client";

import React from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import type {
  AdminPackageBadgeType,
  AdminPackageItem,
  AdminPackageStatus,
} from "@viecngon/types";

export const BADGE_META: Record<
  AdminPackageBadgeType,
  { label: string; badgeClass: string }
> = {
  BASIC: {
    label: "BASIC",
    badgeClass:
      "bg-surface-muted text-text-secondary border border-border-default",
  },
  HOT: {
    label: "HOT",
    badgeClass:
      "bg-warning-soft text-warning-text border border-warning-border",
  },
  SUPER_HOT: {
    label: "SUPER HOT",
    badgeClass: "bg-vip-light text-vip border border-vip-border",
  },
  DIAMOND: {
    label: "DIAMOND",
    badgeClass: "bg-ai-light text-ai border border-ai-border",
  },
};

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

function FixedPackagesColGroup() {
  return (
    <colgroup>
      <col className="w-[29%]" />
      <col className="w-[14%]" />
      <col className="w-[14%]" />
      <col className="w-[12%]" />
      <col className="w-[10%]" />
      <col className="w-[10%]" />
      <col className="w-[11%]" />
    </colgroup>
  );
}

interface AdminPackagesTableProps {
  items: AdminPackageItem[];
  summary?: { total: number; active: number; hidden: number };
  searchText: string;
  statusFilter: AdminPackageStatus | "ALL";
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: AdminPackageStatus | "ALL") => void;
  onResetFilters: () => void;
  onRetry: () => void;
  onCreateNew: () => void;
  onEdit: (pkg: AdminPackageItem) => void;
  onToggleStatus: (pkg: AdminPackageItem) => void;
}

export default function AdminPackagesTable({
  items,
  summary,
  searchText,
  statusFilter,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onSearchChange,
  onStatusFilterChange,
  onResetFilters,
  onRetry,
  onCreateNew,
  onEdit,
  onToggleStatus,
}: AdminPackagesTableProps) {
  const hasActiveFilters = Boolean(searchText.trim()) || statusFilter !== "ALL";

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
            placeholder="Tìm theo tên gói, mô tả..."
            aria-label="Tìm kiếm gói dịch vụ"
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
              onStatusFilterChange(e.target.value as AdminPackageStatus | "ALL")
            }
            aria-label="Lọc trạng thái gói"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="HOATDONG">Đang mở bán</option>
            <option value="DA_AN">Đã ẩn</option>
          </select>

          <button
            type="button"
            onClick={onRetry}
            disabled={isFetching}
            title="Tải lại"
            aria-label="Tải lại danh sách gói"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary disabled:opacity-50 transition-colors shrink-0"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus size={16} />
            Thêm gói mới
          </button>
        </div>
      </div>

      {isError ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-danger-soft text-danger-text flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không thể tải danh sách gói dịch vụ
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
          <table className="w-full min-w-[960px] table-fixed text-left border-collapse">
            <FixedPackagesColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Tên gói &amp; Quyền lợi</th>
                <th className="py-3.5 px-4">Giá bán</th>
                <th className="py-3.5 px-4">Định mức</th>
                <th className="py-3.5 px-4">Huy hiệu</th>
                <th className="py-3.5 px-4">Lượt mua</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="h-[74px] animate-pulse">
                  <td className="px-4">
                    <div className="h-4 w-44 bg-surface-subtle rounded mb-2" />
                    <div className="h-3 w-56 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-24 bg-surface-subtle rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-28 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-6 w-20 bg-surface-subtle rounded-full" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-12 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4">
                    <div className="h-6 w-20 bg-surface-subtle rounded-full" />
                  </td>
                  <td className="px-4">
                    <div className="flex justify-end gap-1.5">
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
            <Package size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Chưa có gói dịch vụ nào phù hợp
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Thử đổi bộ lọc hoặc bấm &ldquo;Thêm gói mới&rdquo; để khởi tạo gói
            quảng cáo.
          </p>
        </div>
      ) : (
        <div
          className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-75" : "opacity-100"}`}
        >
          <table className="w-full min-w-[960px] table-fixed text-left border-collapse">
            <FixedPackagesColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Tên gói &amp; Quyền lợi</th>
                <th className="py-3.5 px-4">Giá bán</th>
                <th className="py-3.5 px-4">Định mức</th>
                <th className="py-3.5 px-4">Huy hiệu</th>
                <th className="py-3.5 px-4">Lượt mua</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-sm">
              {items.map((pkg) => {
                const badge = pkg.loaiHuyHieu
                  ? BADGE_META[pkg.loaiHuyHieu]
                  : null;
                const isActive = pkg.trangThai === "HOATDONG";

                return (
                  <tr
                    key={pkg.maGoi}
                    className="h-[74px] hover:bg-surface-page/80 transition-colors"
                  >
                    <td className="px-4">
                      <p
                        className="font-semibold text-text-primary truncate"
                        title={pkg.tieuDe}
                      >
                        {pkg.tieuDe}
                      </p>
                      <p
                        className="text-xs text-text-muted truncate mt-0.5"
                        title={pkg.moTaNgan || ""}
                      >
                        {pkg.moTaNgan || `${pkg.quyenLoi.length} quyền lợi`}
                      </p>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span className="font-bold text-success-text tabular-nums">
                        {formatVnd(pkg.gia)}
                      </span>
                      <p className="text-[11px] text-text-muted">
                        Ưu tiên cấp {pkg.capDoUuTien}
                      </p>
                    </td>

                    <td className="px-4 whitespace-nowrap text-xs text-text-secondary">
                      <p className="font-semibold text-text-primary">
                        {pkg.soLuotDangTin} lượt đăng
                      </p>
                      <p className="text-text-muted">
                        Hiệu lực {pkg.thoiGianHieuLuc} ngày
                      </p>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      {badge ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.badgeClass}`}
                        >
                          {badge.label}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <p className="font-semibold text-text-primary tabular-nums">
                        {pkg.purchasesCount}
                      </p>
                      <p className="text-[11px] text-text-muted tabular-nums">
                        {formatVnd(pkg.totalRevenue)}
                      </p>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-success-soft text-success-text border border-success-border"
                            : "bg-surface-muted text-text-muted border border-border-default"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-success" : "bg-text-placeholder"
                          }`}
                        />
                        {isActive ? "Mở bán" : "Đã ẩn"}
                      </span>
                    </td>

                    <td className="px-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(pkg)}
                          title="Chỉnh sửa gói"
                          aria-label={`Chỉnh sửa ${pkg.tieuDe}`}
                          className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(pkg)}
                          title={
                            isActive
                              ? "Ẩn gói khỏi trang bảng giá"
                              : "Hiển thị lại gói"
                          }
                          aria-label={
                            isActive
                              ? `Ẩn gói ${pkg.tieuDe}`
                              : `Hiện gói ${pkg.tieuDe}`
                          }
                          className={`p-2 rounded-lg border transition-colors ${
                            isActive
                              ? "border-warning-border bg-warning-soft hover:bg-warning-light text-warning-text"
                              : "border-success-border bg-success-soft hover:bg-success-light text-success-text"
                          }`}
                        >
                          {isActive ? <EyeOff size={15} /> : <Eye size={15} />}
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

      {/* Footer thống kê gọn */}
      <div className="px-4 py-3 border-t border-border-default bg-surface-page/60 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
        <span>
          {hasActiveFilters ? "Kết quả lọc:" : "Tổng cộng:"}{" "}
          <strong className="text-text-primary tabular-nums">
            {summary?.total ?? items.length}
          </strong>{" "}
          gói dịch vụ
        </span>
        {summary && (
          <>
            <span className="text-border-strong">•</span>
            <span>
              Đang mở bán:{" "}
              <strong className="text-success-text">{summary.active}</strong>
            </span>
            <span>
              Đã ẩn:{" "}
              <strong className="text-text-secondary">{summary.hidden}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
