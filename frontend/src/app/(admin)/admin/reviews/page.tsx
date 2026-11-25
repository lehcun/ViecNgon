"use client";

import React, { useMemo, useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import type {
  AdminReviewFilterTab,
  AdminReviewKpiPeriod,
  AdminReviewListItem,
  AdminReviewsQueryParams,
} from "@viecngon/types";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import AdminReviewsKpiBar from "@/components/admin/reviews/AdminReviewsKpiBar";
import AdminReviewsFilterBar, {
  type AdminReviewsFiltersState,
} from "@/components/admin/reviews/AdminReviewsFilterBar";
import AdminReviewCard from "@/components/admin/reviews/AdminReviewCard";
import {
  AdminReviewDetailModal,
  AdminReviewRejectModal,
} from "@/components/admin/reviews/AdminReviewModals";
import {
  useAdminReviews,
  useApproveAdminReview,
  useModerateAdminReview,
} from "@/hooks/admin/useAdminReviews";

const DEFAULT_FILTERS: AdminReviewsFiltersState = {
  searchQuery: "",
  starFilter: "ALL",
  datePreset: "LAST_7_DAYS",
  dateFrom: "",
  dateTo: "",
};

const EMPTY_COUNTS = {
  total: 0,
  pending: 0,
  reported: 0,
  approved: 0,
  rejected: 0,
};

const EMPTY_GROWTH = {
  today: { total: 0, pending: 0, reported: 0, approved: 0 },
  week: { total: 0, pending: 0, reported: 0, approved: 0 },
  month: { total: 0, pending: 0, reported: 0, approved: 0 },
};

export default function AdminReviewsPage() {
  const [kpiPeriod, setKpiPeriod] = useState<AdminReviewKpiPeriod>("today");
  const [activeTab, setActiveTab] = useState<AdminReviewFilterTab>("ALL");
  const [filters, setFilters] =
    useState<AdminReviewsFiltersState>(DEFAULT_FILTERS);
  const [detailTarget, setDetailTarget] = useState<AdminReviewListItem | null>(
    null,
  );
  const [approveTarget, setApproveTarget] =
    useState<AdminReviewListItem | null>(null);
  const [rejectState, setRejectState] = useState<{
    review: AdminReviewListItem;
    mode: "TU_CHOI" | "DA_AN";
  } | null>(null);

  const queryParams = useMemo<AdminReviewsQueryParams>(
    () => ({
      tab: activeTab,
      rating:
        filters.starFilter !== "ALL" ? Number(filters.starFilter) : undefined,
      datePreset: filters.datePreset,
      dateFrom:
        filters.datePreset === "CUSTOM" ? filters.dateFrom || undefined : undefined,
      dateTo:
        filters.datePreset === "CUSTOM" ? filters.dateTo || undefined : undefined,
      search: filters.searchQuery.trim() || undefined,
    }),
    [activeTab, filters],
  );

  const { data, isLoading, isError, error, refetch } =
    useAdminReviews(queryParams);
  const approveMutation = useApproveAdminReview();
  const moderateMutation = useModerateAdminReview();

  const items = data?.items ?? [];
  const counts = data?.counts ?? EMPTY_COUNTS;
  const growth = data?.growth ?? EMPTY_GROWTH;

  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.starFilter !== "ALL" ||
    filters.datePreset !== "LAST_7_DAYS";

  const handleConfirmApprove = () => {
    if (!approveTarget) return;
    approveMutation.mutate(approveTarget.id, {
      onSuccess: () => {
        setApproveTarget(null);
        setDetailTarget(null);
      },
    });
  };

  const handleConfirmRejectOrHide = (reason: string) => {
    if (!rejectState) return;
    moderateMutation.mutate(
      {
        reviewId: rejectState.review.id,
        payload: { trangThai: rejectState.mode, lyDoTuChoi: reason },
      },
      {
        onSuccess: () => {
          setRejectState(null);
          setDetailTarget(null);
        },
      },
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
          <MessageSquareQuote size={24} className="text-primary" />
          <span>Kiểm duyệt đánh giá công ty</span>
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Duyệt trung lập các bài đánh giá mới từ ứng viên và xử lý báo cáo vi
          phạm từ Nhà tuyển dụng.
        </p>
      </div>

      {/* KPI Cards + Switch Hôm nay / Tuần này / Tháng này */}
      <AdminReviewsKpiBar
        counts={counts}
        growth={growth}
        period={kpiPeriod}
        onPeriodChange={setKpiPeriod}
      />

      {/* Bộ lọc chi tiết + Danh sách đánh giá */}
      <div className="bg-surface-card border border-border-default rounded-xl shadow-xs overflow-hidden">
        <AdminReviewsFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          filters={filters}
          onFilterChange={(patch) =>
            setFilters((prev) => ({ ...prev, ...patch }))
          }
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => {
            setActiveTab("ALL");
            setFilters(DEFAULT_FILTERS);
          }}
        />

        {isLoading ? (
          <div className="divide-y divide-border-default animate-pulse">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-5 sm:px-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-subtle" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-44 bg-surface-subtle rounded" />
                      <div className="h-3 w-28 bg-surface-muted rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-28 bg-surface-muted rounded-lg" />
                </div>
                <div className="h-4 w-2/3 bg-surface-subtle rounded" />
                <div className="h-10 w-full bg-surface-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorState
              title="Không thể tải danh sách đánh giá"
              message={error?.message || "Vui lòng thử lại sau."}
              onRetry={() => void refetch()}
            />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<MessageSquareQuote size={24} />}
              title="Không có bài đánh giá nào"
              description="Chưa có bài đánh giá nào khớp bộ lọc hiện tại."
              actionLabel="Đặt lại bộ lọc"
              onAction={() => {
                setActiveTab("ALL");
                setFilters(DEFAULT_FILTERS);
              }}
            />
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {items.map((item) => (
              <AdminReviewCard
                key={item.id}
                review={item}
                onViewDetail={setDetailTarget}
                onApprove={setApproveTarget}
                onRejectOrHide={(rev, mode) =>
                  setRejectState({ review: rev, mode })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminReviewDetailModal
        review={detailTarget}
        onClose={() => setDetailTarget(null)}
        onApprove={(rev) => setApproveTarget(rev)}
        onReject={(rev, mode) => setRejectState({ review: rev, mode })}
      />

      <AdminConfirmModal
        open={Boolean(approveTarget)}
        variant="success"
        title="Duyệt hiển thị bài đánh giá?"
        description={
          <>
            Bài đánh giá{" "}
            <strong className="text-text-primary">
              &ldquo;{approveTarget?.tieuDe}&rdquo;
            </strong>{" "}
            sẽ được hiển thị công khai trên trang công ty{" "}
            <strong className="text-text-primary">
              {approveTarget?.companyName}
            </strong>
            .
          </>
        }
        confirmLabel="Xác nhận duyệt"
        isSubmitting={approveMutation.isPending}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleConfirmApprove}
      />

      <AdminReviewRejectModal
        key={
          rejectState ? `${rejectState.review.id}-${rejectState.mode}` : "closed"
        }
        open={Boolean(rejectState)}
        mode={rejectState?.mode || "TU_CHOI"}
        reviewTitle={rejectState?.review.tieuDe || ""}
        isSubmitting={moderateMutation.isPending}
        onClose={() => setRejectState(null)}
        onConfirm={handleConfirmRejectOrHide}
      />
    </div>
  );
}
