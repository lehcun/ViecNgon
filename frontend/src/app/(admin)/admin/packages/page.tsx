"use client";

import React, { useEffect, useState } from "react";
import { Package, Receipt } from "lucide-react";
import type {
  AdminPackageItem,
  AdminPackageStatus,
  AdminTransactionItem,
  AdminTransactionStatus,
  CreateAdminPackagePayload,
} from "@viecngon/types";
import {
  useAdminPackages,
  useAdminTransactions,
  useConfirmAdminTransaction,
  useCreateAdminPackage,
  useToggleAdminPackageStatus,
  useUpdateAdminPackage,
} from "@/hooks/admin/useAdminPackages";
import AdminPackagesTable from "@/components/admin/packages/AdminPackagesTable";
import AdminPackageFormModal from "@/components/admin/packages/AdminPackageFormModal";
import AdminTransactionsTable from "@/components/admin/packages/AdminTransactionsTable";
import AdminTransactionDetailDrawer from "@/components/admin/packages/AdminTransactionDetailDrawer";

type ActiveTab = "packages" | "transactions";

export default function AdminPackagesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("packages");

  // Filter state - Tab 1: Gói dịch vụ
  const [pkgSearch, setPkgSearch] = useState("");
  const [debouncedPkgSearch, setDebouncedPkgSearch] = useState("");
  const [pkgStatus, setPkgStatus] = useState<AdminPackageStatus | "ALL">("ALL");
  const [formModal, setFormModal] = useState<{
    open: boolean;
    editing: AdminPackageItem | null;
  }>({ open: false, editing: null });

  // Filter state - Tab 2: Lịch sử giao dịch
  const [txSearch, setTxSearch] = useState("");
  const [debouncedTxSearch, setDebouncedTxSearch] = useState("");
  const [txStatus, setTxStatus] = useState<AdminTransactionStatus | "ALL">(
    "ALL",
  );
  const [txPackageId, setTxPackageId] = useState<string>("ALL");
  const [txPage, setTxPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<AdminTransactionItem | null>(
    null,
  );

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedPkgSearch(pkgSearch.trim()),
      300,
    );
    return () => window.clearTimeout(t);
  }, [pkgSearch]);

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedTxSearch(txSearch.trim()),
      300,
    );
    return () => window.clearTimeout(t);
  }, [txSearch]);

  const packagesQuery = useAdminPackages({
    q: debouncedPkgSearch || undefined,
    status: pkgStatus,
  });

  const transactionsQuery = useAdminTransactions({
    q: debouncedTxSearch || undefined,
    status: txStatus,
    packageId: txPackageId,
    page: txPage,
    limit: 12,
  });

  const createMutation = useCreateAdminPackage();
  const updateMutation = useUpdateAdminPackage();
  const toggleStatusMutation = useToggleAdminPackageStatus();
  const confirmTxMutation = useConfirmAdminTransaction();

  const handleSubmitPackage = (payload: CreateAdminPackagePayload) => {
    if (formModal.editing) {
      updateMutation.mutate(
        { packageId: formModal.editing.maGoi, payload },
        {
          onSuccess: () => setFormModal({ open: false, editing: null }),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setFormModal({ open: false, editing: null }),
      });
    }
  };

  const handleToggleStatus = (pkg: AdminPackageItem) => {
    const nextStatus: AdminPackageStatus =
      pkg.trangThai === "HOATDONG" ? "DA_AN" : "HOATDONG";
    toggleStatusMutation.mutate({
      packageId: pkg.maGoi,
      payload: { trangThai: nextStatus },
    });
  };

  const handleConfirmPayment = (tx: AdminTransactionItem) => {
    confirmTxMutation.mutate(tx.maThanhToan, {
      onSuccess: (res) => {
        if (selectedTx?.maThanhToan === tx.maThanhToan) {
          setSelectedTx(res.transaction);
        }
      },
    });
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 2 Tab gọn gàng */}
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface-card border border-border-default shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("packages")}
          className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "packages"
              ? "bg-primary text-white shadow-xs"
              : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          }`}
        >
          <Package size={15} />
          Gói dịch vụ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "transactions"
              ? "bg-primary text-white shadow-xs"
              : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          }`}
        >
          <Receipt size={15} />
          Lịch sử giao dịch
          {(transactionsQuery.data?.summary.pendingCount ?? 0) > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-warning text-white">
              {transactionsQuery.data?.summary.pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === "packages" ? (
        <AdminPackagesTable
          items={packagesQuery.data?.items ?? []}
          summary={packagesQuery.data?.summary}
          searchText={pkgSearch}
          statusFilter={pkgStatus}
          isLoading={packagesQuery.isLoading}
          isFetching={packagesQuery.isFetching}
          isError={packagesQuery.isError}
          errorMessage={
            packagesQuery.error instanceof Error
              ? packagesQuery.error.message
              : undefined
          }
          onSearchChange={setPkgSearch}
          onStatusFilterChange={setPkgStatus}
          onResetFilters={() => {
            setPkgSearch("");
            setDebouncedPkgSearch("");
            setPkgStatus("ALL");
          }}
          onRetry={() => packagesQuery.refetch()}
          onCreateNew={() => setFormModal({ open: true, editing: null })}
          onEdit={(pkg) => setFormModal({ open: true, editing: pkg })}
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        <AdminTransactionsTable
          items={transactionsQuery.data?.items ?? []}
          packages={packagesQuery.data?.items ?? []}
          pagination={transactionsQuery.data?.pagination}
          summary={transactionsQuery.data?.summary}
          searchText={txSearch}
          statusFilter={txStatus}
          packageFilter={txPackageId}
          isLoading={transactionsQuery.isLoading}
          isFetching={transactionsQuery.isFetching}
          isError={transactionsQuery.isError}
          errorMessage={
            transactionsQuery.error instanceof Error
              ? transactionsQuery.error.message
              : undefined
          }
          isConfirming={confirmTxMutation.isPending}
          onSearchChange={(val) => {
            setTxSearch(val);
            setTxPage(1);
          }}
          onStatusFilterChange={(val) => {
            setTxStatus(val);
            setTxPage(1);
          }}
          onPackageFilterChange={(val) => {
            setTxPackageId(val);
            setTxPage(1);
          }}
          onResetFilters={() => {
            setTxSearch("");
            setDebouncedTxSearch("");
            setTxStatus("ALL");
            setTxPackageId("ALL");
            setTxPage(1);
          }}
          onPageChange={setTxPage}
          onRetry={() => transactionsQuery.refetch()}
          onViewDetail={setSelectedTx}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {formModal.open && (
        <AdminPackageFormModal
          key={formModal.editing?.maGoi ?? "new"}
          editingPackage={formModal.editing}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onClose={() => setFormModal({ open: false, editing: null })}
          onSubmit={handleSubmitPackage}
        />
      )}

      <AdminTransactionDetailDrawer
        transaction={selectedTx}
        isConfirming={confirmTxMutation.isPending}
        onClose={() => setSelectedTx(null)}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
