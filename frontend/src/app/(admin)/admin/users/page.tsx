"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type {
  AdminUserListItem,
  AdminUserProvider,
  AdminUserRole,
  AdminUserStatus,
} from "@viecngon/types";
import { useAuthStore } from "@/store/authStore";
import {
  useAdminUsers,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "@/hooks/admin/useAdminUsers";
import AdminUserStatsBar from "@/components/admin/users/AdminUserStatsBar";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import AdminUserDetailDrawer from "@/components/admin/users/AdminUserDetailDrawer";
import AdminUserActionModal, {
  type AdminUserModalMode,
} from "@/components/admin/users/AdminUserActionModal";

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const currentAdminId = currentUser?.id ?? currentUser?.sub;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "ALL">(
    "ALL",
  );
  const [providerFilter, setProviderFilter] = useState<
    AdminUserProvider | "ALL"
  >("ALL");
  const [page, setPage] = useState(1);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    mode: AdminUserModalMode;
    user: AdminUserListItem;
  } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminUsers({
    q: debouncedSearch || undefined,
    role: roleFilter,
    status: statusFilter,
    provider: providerFilter,
    page,
    limit: 12,
    sortBy: "ngayTao",
    sortOrder: "desc",
  });

  const updateStatusMutation = useUpdateAdminUserStatus();
  const updateRoleMutation = useUpdateAdminUserRole();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleRoleFilterChange = (value: AdminUserRole | "ALL") => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: AdminUserStatus | "ALL") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleProviderFilterChange = (value: AdminUserProvider | "ALL") => {
    setProviderFilter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setProviderFilter("ALL");
    setPage(1);
  };

  const handleConfirmLock = (reason: string) => {
    if (!modalState) return;
    updateStatusMutation.mutate(
      {
        userId: modalState.user.maTaiKhoan,
        payload: {
          trangThai: "KHOA",
          reason: reason || undefined,
        },
      },
      {
        onSuccess: () => setModalState(null),
      },
    );
  };

  const handleConfirmActivate = () => {
    if (!modalState) return;
    updateStatusMutation.mutate(
      {
        userId: modalState.user.maTaiKhoan,
        payload: { trangThai: "HOATDONG" },
      },
      {
        onSuccess: () => setModalState(null),
      },
    );
  };

  const handleConfirmRole = (nextRole: AdminUserRole) => {
    if (!modalState) return;
    updateRoleMutation.mutate(
      {
        userId: modalState.user.maTaiKhoan,
        payload: { vaiTro: nextRole },
      },
      {
        onSuccess: () => setModalState(null),
      },
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-card p-6 rounded-xl border border-border-default shadow-xs">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            Quản trị hệ thống
          </p>
          <h1 className="text-2xl font-bold text-text-primary">
            Quản lý tài khoản người dùng
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Tra cứu danh sách người dùng, xem chi tiết hồ sơ, kích hoạt tài
            khoản, phân quyền quản trị hoặc khóa tài khoản vi phạm chính sách.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-primary shrink-0 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* 4 Thẻ thống kê tổng quan */}
      <AdminUserStatsBar summary={data?.summary} isLoading={isLoading} />

      {/* Bảng danh sách & Bộ lọc */}
      <AdminUsersTable
        items={data?.items ?? []}
        pagination={data?.pagination}
        currentAdminId={currentAdminId}
        searchText={searchInput}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        providerFilter={providerFilter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onSearchChange={handleSearchChange}
        onRoleFilterChange={handleRoleFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
        onProviderFilterChange={handleProviderFilterChange}
        onResetFilters={handleResetFilters}
        onPageChange={setPage}
        onRetry={() => refetch()}
        onViewDetail={(user) => setSelectedUserId(user.maTaiKhoan)}
        onRequestLock={(user) => setModalState({ mode: "lock", user })}
        onRequestActivate={(user) => setModalState({ mode: "activate", user })}
        onRequestChangeRole={(user) => setModalState({ mode: "role", user })}
      />

      {/* Ngăn trượt chi tiết tài khoản */}
      <AdminUserDetailDrawer
        userId={selectedUserId}
        currentAdminId={currentAdminId}
        onClose={() => setSelectedUserId(null)}
        onRequestLock={(user) => setModalState({ mode: "lock", user })}
        onRequestActivate={(user) => setModalState({ mode: "activate", user })}
        onRequestChangeRole={(user) => setModalState({ mode: "role", user })}
      />

      {/* Modal xác nhận Khóa / Kích hoạt / Phân quyền */}
      {modalState && (
        <AdminUserActionModal
          key={`${modalState.mode}-${modalState.user.maTaiKhoan}`}
          mode={modalState.mode}
          user={modalState.user}
          isSubmitting={
            updateStatusMutation.isPending || updateRoleMutation.isPending
          }
          onClose={() => setModalState(null)}
          onConfirmLock={handleConfirmLock}
          onConfirmActivate={handleConfirmActivate}
          onConfirmRole={handleConfirmRole}
        />
      )}
    </div>
  );
}
