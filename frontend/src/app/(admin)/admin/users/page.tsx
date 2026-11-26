"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  AdminUserListItem,
  AdminUserProvider,
  AdminUserRole,
  AdminUserStatus,
  EmployerCompanyRole,
} from "@viecngon/types";
import { useAuthStore } from "@/store/authStore";
import {
  useAdminUsers,
  useDeleteAdminUser,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "@/hooks/admin/useAdminUsers";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import AdminUserDetailDrawer from "@/components/admin/users/AdminUserDetailDrawer";
import AdminUserActionModal, {
  type AdminUserModalMode,
} from "@/components/admin/users/AdminUserActionModal";

function parseInitialStatus(raw: string | null): AdminUserStatus | "ALL" {
  if (raw === "HOATDONG" || raw === "KHOA" || raw === "CHUAKICHHOAT") {
    return raw;
  }
  return "ALL";
}

function parseInitialRole(raw: string | null): AdminUserRole | "ALL" {
  if (raw === "ADMIN" || raw === "NHATUYENDUNG" || raw === "UNGVIEN") {
    return raw;
  }
  return "ALL";
}

function AdminUsersWorkspace() {
  const searchParams = useSearchParams();
  const initialRole = parseInitialRole(searchParams.get("role"));
  const initialStatus = parseInitialStatus(searchParams.get("status"));

  const currentUser = useAuthStore((state) => state.user);
  const currentAdminId = currentUser?.id ?? currentUser?.sub;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "ALL">(
    initialRole,
  );
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "ALL">(
    initialStatus,
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

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminUsers({
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
  const deleteUserMutation = useDeleteAdminUser();

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

  const handleConfirmRole = (nextCompanyRole: EmployerCompanyRole) => {
    if (!modalState) return;
    updateRoleMutation.mutate(
      {
        userId: modalState.user.maTaiKhoan,
        payload: { vaiTroTrongCongTy: nextCompanyRole },
      },
      {
        onSuccess: () => setModalState(null),
      },
    );
  };

  const handleConfirmDelete = (reason: string) => {
    if (!modalState) return;
    const deletedId = modalState.user.maTaiKhoan;
    deleteUserMutation.mutate(
      {
        userId: deletedId,
        payload: reason ? { reason } : undefined,
      },
      {
        onSuccess: () => {
          setModalState(null);
          if (selectedUserId === deletedId) {
            setSelectedUserId(null);
          }
        },
      },
    );
  };

  return (
    <div className="pb-8">
      <AdminUsersTable
        items={data?.items ?? []}
        summary={data?.summary}
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
        onRequestDelete={(user) => setModalState({ mode: "delete", user })}
      />

      <AdminUserDetailDrawer
        userId={selectedUserId}
        currentAdminId={currentAdminId}
        onClose={() => setSelectedUserId(null)}
        onRequestLock={(user) => setModalState({ mode: "lock", user })}
        onRequestActivate={(user) => setModalState({ mode: "activate", user })}
        onRequestChangeRole={(user) => setModalState({ mode: "role", user })}
        onRequestDelete={(user) => setModalState({ mode: "delete", user })}
      />

      {modalState && (
        <AdminUserActionModal
          key={`${modalState.mode}-${modalState.user.maTaiKhoan}`}
          mode={modalState.mode}
          user={modalState.user}
          isSubmitting={
            updateStatusMutation.isPending ||
            updateRoleMutation.isPending ||
            deleteUserMutation.isPending
          }
          onClose={() => setModalState(null)}
          onConfirmLock={handleConfirmLock}
          onConfirmActivate={handleConfirmActivate}
          onConfirmRole={handleConfirmRole}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-card border border-border-default rounded-xl p-6 animate-pulse h-96" />
      }
    >
      <AdminUsersWorkspace />
    </Suspense>
  );
}
