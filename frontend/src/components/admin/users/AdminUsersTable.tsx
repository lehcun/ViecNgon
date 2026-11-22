"use client";

import React from "react";
import Image from "next/image";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  Unlock,
  Users,
} from "lucide-react";
import type {
  AdminUserListItem,
  AdminUserProvider,
  AdminUserRole,
  AdminUserStatus,
  AdminUserSummaryStats,
} from "@viecngon/types";

export const ROLE_META: Record<
  AdminUserRole,
  { label: string; badgeClass: string }
> = {
  ADMIN: {
    label: "Quản trị viên",
    badgeClass: "bg-ai-light text-ai border border-ai-border",
  },
  NHATUYENDUNG: {
    label: "Nhà tuyển dụng",
    badgeClass: "bg-info-soft text-info-text border border-info-border",
  },
  UNGVIEN: {
    label: "Ứng viên",
    badgeClass:
      "bg-surface-muted text-text-secondary border border-border-default",
  },
};

export const STATUS_META: Record<
  AdminUserStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  HOATDONG: {
    label: "Hoạt động",
    dotClass: "bg-success",
    badgeClass:
      "bg-success-soft text-success-text border border-success-border",
  },
  KHOA: {
    label: "Đã khóa",
    dotClass: "bg-danger",
    badgeClass: "bg-danger-soft text-danger-text border border-danger-border",
  },
  CHUAKICHHOAT: {
    label: "Chưa kích hoạt",
    dotClass: "bg-warning",
    badgeClass:
      "bg-warning-soft text-warning-text border border-warning-border",
  },
};

interface AdminUsersTableProps {
  items: AdminUserListItem[];
  summary?: AdminUserSummaryStats;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentAdminId?: string;
  searchText: string;
  roleFilter: AdminUserRole | "ALL";
  statusFilter: AdminUserStatus | "ALL";
  providerFilter: AdminUserProvider | "ALL";
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: AdminUserRole | "ALL") => void;
  onStatusFilterChange: (value: AdminUserStatus | "ALL") => void;
  onProviderFilterChange: (value: AdminUserProvider | "ALL") => void;
  onResetFilters: () => void;
  onPageChange: (nextPage: number) => void;
  onRetry: () => void;
  onViewDetail: (user: AdminUserListItem) => void;
  onRequestLock: (user: AdminUserListItem) => void;
  onRequestActivate: (user: AdminUserListItem) => void;
  onRequestChangeRole: (user: AdminUserListItem) => void;
  onRequestDelete: (user: AdminUserListItem) => void;
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

function getInitials(name: string, email: string): string {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
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

function FixedTableColGroup() {
  return (
    <colgroup>
      <col className="w-[34%]" />
      <col className="w-[13%]" />
      <col className="w-[14%]" />
      <col className="w-[11%]" />
      <col className="w-[10%]" />
      <col className="w-[18%]" />
    </colgroup>
  );
}

export default function AdminUsersTable({
  items,
  summary,
  pagination,
  currentAdminId,
  searchText,
  roleFilter,
  statusFilter,
  providerFilter,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onProviderFilterChange,
  onResetFilters,
  onPageChange,
  onRetry,
  onViewDetail,
  onRequestLock,
  onRequestActivate,
  onRequestChangeRole,
  onRequestDelete,
}: AdminUsersTableProps) {
  const hasActiveFilters =
    Boolean(searchText.trim()) ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    providerFilter !== "ALL";

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;

  return (
    <div className="bg-surface-card border border-border-default rounded-xl shadow-xs overflow-hidden">
      {/* Toolbar tìm kiếm & bộ lọc cố định vị trí để không bị nhảy layout */}
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
            placeholder="Tìm theo tên, email, SĐT hoặc công ty..."
            aria-label="Tìm kiếm tài khoản người dùng"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Nút làm mới bộ lọc cố định bên trái ô chọn vai trò để không làm nhảy giao diện */}
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
            value={roleFilter}
            onChange={(e) =>
              onRoleFilterChange(e.target.value as AdminUserRole | "ALL")
            }
            aria-label="Lọc theo vai trò"
            className="h-10 w-40 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="UNGVIEN">Ứng viên</option>
            <option value="NHATUYENDUNG">Nhà tuyển dụng</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as AdminUserStatus | "ALL")
            }
            aria-label="Lọc theo trạng thái"
            className="h-10 w-44 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="HOATDONG">Hoạt động</option>
            <option value="KHOA">Đã khóa</option>
            <option value="CHUAKICHHOAT">Chưa kích hoạt</option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) =>
              onProviderFilterChange(
                e.target.value as AdminUserProvider | "ALL",
              )
            }
            aria-label="Lọc theo phương thức đăng nhập"
            className="h-10 w-40 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary shrink-0"
          >
            <option value="ALL">Mọi phương thức</option>
            <option value="LOCAL">Email / Mật khẩu</option>
            <option value="GOOGLE">Google</option>
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
            Không thể tải danh sách người dùng
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
          <table className="w-full min-w-[960px] table-fixed text-left border-collapse">
            <FixedTableColGroup />
            <thead>
              <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3.5 px-4">Người dùng</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Phương thức</th>
                <th className="py-3.5 px-4">Ngày tạo</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="h-[70px] animate-pulse">
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-subtle shrink-0" />
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="h-4 w-36 bg-surface-subtle rounded" />
                        <div className="h-3 w-48 bg-surface-muted rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="h-6 w-24 bg-surface-subtle rounded-full" />
                  </td>
                  <td className="px-4">
                    <div className="h-6 w-24 bg-surface-subtle rounded-full" />
                  </td>
                  <td className="px-4">
                    <div className="h-5 w-16 bg-surface-muted rounded" />
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
            <Users size={22} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            Không tìm thấy tài khoản phù hợp
          </h3>
          <p className="text-sm text-text-muted mt-1">
            Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc vai trò, trạng
            thái.
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
        /* Bảng dữ liệu cố định cột (table-fixed) */
        <>
          <div
            className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-75" : "opacity-100"}`}
          >
            <table className="w-full min-w-[960px] table-fixed text-left border-collapse">
              <FixedTableColGroup />
              <thead>
                <tr className="bg-surface-page border-b border-border-default text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="py-3.5 px-4">Người dùng</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Phương thức</th>
                  <th className="py-3.5 px-4">Ngày tạo</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-sm">
                {items.map((user) => {
                  const roleInfo = ROLE_META[user.vaiTro];
                  const statusInfo = STATUS_META[user.trangThai];
                  const isSelf = currentAdminId === user.maTaiKhoan;

                  return (
                    <tr
                      key={user.maTaiKhoan}
                      className="h-[70px] hover:bg-surface-page/80 transition-colors"
                    >
                      <td className="px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {isValidImageSrc(user.avatarUrl) ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border-default shrink-0 bg-surface-muted">
                              <Image
                                src={user.avatarUrl}
                                alt={user.tenNguoiDung}
                                fill
                                unoptimized
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary-subtle">
                              {getInitials(user.tenNguoiDung, user.email)}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <button
                                type="button"
                                onClick={() => onViewDetail(user)}
                                title={user.tenNguoiDung}
                                className="font-semibold text-text-primary hover:text-primary truncate transition-colors text-left"
                              >
                                {user.tenNguoiDung}
                              </button>
                              {isSelf && (
                                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-primary-light text-primary shrink-0">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <p
                              className="text-xs text-text-muted truncate"
                              title={user.email}
                            >
                              {user.email}
                            </p>
                            {user.companyName && (
                              <p
                                className="text-xs text-text-secondary truncate"
                                title={user.companyName}
                              >
                                {user.companyName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleInfo.badgeClass}`}
                        >
                          {roleInfo.label}
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

                      <td className="px-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-text-secondary bg-surface-muted px-2 py-1 rounded-md">
                          {user.provider === "GOOGLE" ? "Google" : "Email"}
                        </span>
                      </td>

                      <td className="px-4 whitespace-nowrap text-xs text-text-muted tabular-nums">
                        {formatDateVi(user.ngayTao)}
                      </td>

                      <td className="px-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewDetail(user)}
                            title="Xem chi tiết"
                            aria-label={`Xem chi tiết ${user.email}`}
                            className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onRequestChangeRole(user)}
                            disabled={isSelf}
                            title={
                              isSelf
                                ? "Không thể tự thay đổi quyền của chính bạn"
                                : "Phân quyền quản trị"
                            }
                            aria-label={`Phân quyền ${user.email}`}
                            className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-ai-light text-text-secondary hover:text-ai disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Shield size={15} />
                          </button>

                          {user.trangThai === "HOATDONG" ? (
                            <button
                              type="button"
                              onClick={() => onRequestLock(user)}
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? "Không thể tự khóa tài khoản của bạn"
                                  : "Khóa tài khoản vi phạm"
                              }
                              aria-label={`Khóa tài khoản ${user.email}`}
                              className="p-2 rounded-lg border border-danger-border bg-danger-soft hover:bg-danger-light text-danger-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <Lock size={15} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onRequestActivate(user)}
                              title="Kích hoạt tài khoản"
                              aria-label={`Kích hoạt tài khoản ${user.email}`}
                              className="p-2 rounded-lg border border-success-border bg-success-soft hover:bg-success-light text-success-text transition-colors"
                            >
                              <Unlock size={15} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onRequestDelete(user)}
                            disabled={isSelf}
                            title={
                              isSelf
                                ? "Không thể tự xóa tài khoản của bạn"
                                : "Xóa tài khoản"
                            }
                            aria-label={`Xóa tài khoản ${user.email}`}
                            className="p-2 rounded-lg border border-danger-border bg-surface-card hover:bg-danger-soft text-danger-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        </>
      )}

      {/* Thanh footer: Thống kê nhỏ gọn theo danh sách hiện tại + Phân trang */}
      <div className="px-4 py-3 border-t border-border-default bg-surface-page/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs text-text-muted">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {hasActiveFilters ? "Kết quả lọc:" : "Tổng cộng:"}{" "}
            <strong className="text-text-primary tabular-nums">
              {totalItems.toLocaleString("vi-VN")}
            </strong>{" "}
            tài khoản
          </span>
          {summary && (
            <>
              <span className="text-border-strong">•</span>
              <span className="tabular-nums">
                Hoạt động:{" "}
                <strong className="text-success-text">{summary.active}</strong>
              </span>
              <span className="tabular-nums">
                Đã khóa:{" "}
                <strong className="text-danger-text">{summary.locked}</strong>
              </span>
              <span className="tabular-nums">
                Chưa kích hoạt:{" "}
                <strong className="text-warning-text">
                  {summary.unactivated}
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
