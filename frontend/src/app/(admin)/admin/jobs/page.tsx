"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AdminJobListItem, AdminJobStatus } from "@viecngon/types";
import {
  useAdminJobs,
  useDeleteAdminJob,
  useModerateAdminJob,
} from "@/hooks/admin/useAdminJobs";
import AdminJobsTable from "@/components/admin/jobs/AdminJobsTable";
import AdminJobDetailDrawer from "@/components/admin/jobs/AdminJobDetailDrawer";
import AdminJobActionModal, {
  type AdminJobModalMode,
} from "@/components/admin/jobs/AdminJobActionModal";

function parseInitialStatus(raw: string | null): AdminJobStatus | "ALL" {
  if (
    raw === "CHO_DUYET" ||
    raw === "DA_DUYET" ||
    raw === "TU_CHOI" ||
    raw === "DA_AN" ||
    raw === "HET_HAN"
  ) {
    return raw;
  }
  return "ALL";
}

function AdminJobsWorkspace() {
  const searchParams = useSearchParams();
  const initialStatus = parseInitialStatus(searchParams.get("status"));

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminJobStatus | "ALL">(
    initialStatus,
  );
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    mode: AdminJobModalMode;
    job: AdminJobListItem;
  } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminJobs(
    {
      q: debouncedSearch || undefined,
      status: statusFilter,
      city: cityFilter,
      page,
      limit: 12,
      sortBy: "ngayDang",
      sortOrder: "desc",
    },
  );

  const moderateMutation = useModerateAdminJob();
  const deleteMutation = useDeleteAdminJob();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: AdminJobStatus | "ALL") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCityFilterChange = (value: string) => {
    setCityFilter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setCityFilter("ALL");
    setPage(1);
  };

  const handleConfirmApprove = () => {
    if (!modalState) return;
    moderateMutation.mutate(
      {
        jobId: modalState.job.maCongViec,
        payload: { action: "APPROVE" },
      },
      { onSuccess: () => setModalState(null) },
    );
  };

  const handleConfirmReject = (reason: string) => {
    if (!modalState) return;
    moderateMutation.mutate(
      {
        jobId: modalState.job.maCongViec,
        payload: { action: "REJECT", reason },
      },
      { onSuccess: () => setModalState(null) },
    );
  };

  const handleConfirmHide = (reason: string) => {
    if (!modalState) return;
    moderateMutation.mutate(
      {
        jobId: modalState.job.maCongViec,
        payload: { action: "HIDE", reason: reason || undefined },
      },
      { onSuccess: () => setModalState(null) },
    );
  };

  const handleConfirmDelete = (reason: string) => {
    if (!modalState) return;
    const deletedId = modalState.job.maCongViec;
    deleteMutation.mutate(
      {
        jobId: deletedId,
        payload: reason ? { reason } : undefined,
      },
      {
        onSuccess: () => {
          setModalState(null);
          if (selectedJobId === deletedId) {
            setSelectedJobId(null);
          }
        },
      },
    );
  };

  return (
    <div className="pb-8">
      <AdminJobsTable
        items={data?.items ?? []}
        summary={data?.summary}
        pagination={data?.pagination}
        searchText={searchInput}
        statusFilter={statusFilter}
        cityFilter={cityFilter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onCityFilterChange={handleCityFilterChange}
        onResetFilters={handleResetFilters}
        onPageChange={setPage}
        onRetry={() => refetch()}
        onViewDetail={(job) => setSelectedJobId(job.maCongViec)}
        onRequestApprove={(job) => setModalState({ mode: "approve", job })}
        onRequestReject={(job) => setModalState({ mode: "reject", job })}
        onRequestHide={(job) => setModalState({ mode: "hide", job })}
        onRequestDelete={(job) => setModalState({ mode: "delete", job })}
      />

      <AdminJobDetailDrawer
        jobId={selectedJobId}
        onClose={() => setSelectedJobId(null)}
        onRequestApprove={(job) => setModalState({ mode: "approve", job })}
        onRequestReject={(job) => setModalState({ mode: "reject", job })}
        onRequestHide={(job) => setModalState({ mode: "hide", job })}
        onRequestDelete={(job) => setModalState({ mode: "delete", job })}
      />

      {modalState && (
        <AdminJobActionModal
          key={`${modalState.mode}-${modalState.job.maCongViec}`}
          mode={modalState.mode}
          job={modalState.job}
          isSubmitting={moderateMutation.isPending || deleteMutation.isPending}
          onClose={() => setModalState(null)}
          onConfirmApprove={handleConfirmApprove}
          onConfirmReject={handleConfirmReject}
          onConfirmHide={handleConfirmHide}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default function AdminJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-card border border-border-default rounded-xl p-6 animate-pulse h-96" />
      }
    >
      <AdminJobsWorkspace />
    </Suspense>
  );
}
