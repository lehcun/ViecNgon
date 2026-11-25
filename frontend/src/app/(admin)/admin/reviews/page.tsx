"use client";

import React, { useMemo, useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import toast from "react-hot-toast";
import { EmptyState } from "@/components/ui/StateViews";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import AdminReviewsKpiBar from "@/components/admin/reviews/AdminReviewsKpiBar";
import AdminReviewsFilterBar, {
  type AdminReviewFilterTab,
  type AdminReviewsFiltersState,
} from "@/components/admin/reviews/AdminReviewsFilterBar";
import AdminReviewCard from "@/components/admin/reviews/AdminReviewCard";
import {
  AdminReviewDetailModal,
  AdminReviewRejectModal,
} from "@/components/admin/reviews/AdminReviewModals";
import {
  MOCK_ADMIN_REVIEWS,
  type AdminKpiPeriod,
} from "@/data/admin-reviews.mock";
import type { CompanyReviewItem } from "@/data/reviews.mock";

const DEFAULT_FILTERS: AdminReviewsFiltersState = {
  searchQuery: "",
  starFilter: "ALL",
  datePreset: "LAST_7_DAYS",
  dateFrom: "",
  dateTo: "",
  verifiedFilter: "ALL",
};

function matchesDateFilter(
  isoDate: string,
  filters: AdminReviewsFiltersState,
): boolean {
  if (filters.datePreset === "ALL") return true;
  const created = new Date(isoDate);
  if (Number.isNaN(created.getTime())) return false;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (filters.datePreset === "TODAY") {
    return created >= startOfToday;
  }
  if (filters.datePreset === "LAST_7_DAYS") {
    const cutoff = new Date(startOfToday.getTime() - 6 * 86400000);
    return created >= cutoff;
  }
  if (filters.datePreset === "LAST_30_DAYS") {
    const cutoff = new Date(startOfToday.getTime() - 29 * 86400000);
    return created >= cutoff;
  }
  if (filters.datePreset === "THIS_MONTH") {
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth()
    );
  }
  if (filters.datePreset === "CUSTOM") {
    if (filters.dateFrom) {
      const from = new Date(`${filters.dateFrom}T00:00:00`);
      if (created < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(`${filters.dateTo}T23:59:59`);
      if (created > to) return false;
    }
  }
  return true;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] =
    useState<CompanyReviewItem[]>(MOCK_ADMIN_REVIEWS);
  const [kpiPeriod, setKpiPeriod] = useState<AdminKpiPeriod>("today");
  const [activeTab, setActiveTab] = useState<AdminReviewFilterTab>("ALL");
  const [filters, setFilters] =
    useState<AdminReviewsFiltersState>(DEFAULT_FILTERS);
  const [detailTarget, setDetailTarget] = useState<CompanyReviewItem | null>(
    null,
  );
  const [approveTarget, setApproveTarget] = useState<CompanyReviewItem | null>(
    null,
  );
  const [rejectState, setRejectState] = useState<{
    review: CompanyReviewItem;
    mode: "TU_CHOI" | "DA_AN";
  } | null>(null);

  const counts = useMemo(
    () => ({
      total: reviews.length,
      pending: reviews.filter((r) => r.trangThai === "CHO_DUYET").length,
      reported: reviews.filter((r) => r.biBaoCao).length,
      approved: reviews.filter((r) => r.trangThai === "DA_DUYET").length,
      rejected: reviews.filter(
        (r) => r.trangThai === "TU_CHOI" || r.trangThai === "DA_AN",
      ).length,
    }),
    [reviews],
  );

  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.starFilter !== "ALL" ||
    filters.datePreset !== "LAST_7_DAYS" ||
    filters.verifiedFilter !== "ALL";

  const filteredReviews = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    return reviews.filter((item) => {
      const matchTab =
        activeTab === "ALL"
          ? true
          : activeTab === "CHO_DUYET"
            ? item.trangThai === "CHO_DUYET"
            : activeTab === "REPORTED"
              ? Boolean(item.biBaoCao)
              : activeTab === "DA_DUYET"
                ? item.trangThai === "DA_DUYET"
                : item.trangThai === "TU_CHOI" || item.trangThai === "DA_AN";

      const matchQuery =
        !q ||
        (item.companyName || "").toLowerCase().includes(q) ||
        item.tieuDe.toLowerCase().includes(q) ||
        item.noiDung.toLowerCase().includes(q);

      const matchStar =
        filters.starFilter === "ALL" ||
        Math.round(item.rating) === Number(filters.starFilter);

      const matchVerified =
        filters.verifiedFilter === "ALL"
          ? true
          : filters.verifiedFilter === "VERIFIED"
            ? item.daXacThuc
            : !item.daXacThuc;

      const matchDate = matchesDateFilter(item.createdAt, filters);

      return matchTab && matchQuery && matchStar && matchVerified && matchDate;
    });
  }, [reviews, activeTab, filters]);

  const handleConfirmApprove = () => {
    if (!approveTarget) return;
    setReviews((prev) =>
      prev.map((item) =>
        item.id === approveTarget.id
          ? { ...item, trangThai: "DA_DUYET", biBaoCao: false }
          : item,
      ),
    );
    toast.success(
      `Đã duyệt hiển thị bài đánh giá cho ${approveTarget.companyName || "công ty"}!`,
    );
    setApproveTarget(null);
    setDetailTarget(null);
  };

  const handleConfirmRejectOrHide = (reason: string) => {
    if (!rejectState) return;
    const { review, mode } = rejectState;
    setReviews((prev) =>
      prev.map((item) =>
        item.id === review.id
          ? { ...item, trangThai: mode, lyDoTuChoi: reason, biBaoCao: false }
          : item,
      ),
    );
    toast.success(
      mode === "DA_AN"
        ? "Đã ẩn bài đánh giá vi phạm khỏi trang công khai."
        : "Đã từ chối bài đánh giá và ghi nhận lý do gửi ứng viên.",
    );
    setRejectState(null);
    setDetailTarget(null);
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
          phạm từ Nhà tuyển dụng (chế độ Mock UI).
        </p>
      </div>

      {/* KPI Cards + Switch Hôm nay / Tháng này */}
      <AdminReviewsKpiBar
        counts={counts}
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

        {filteredReviews.length === 0 ? (
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
            {filteredReviews.map((item) => (
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
        onClose={() => setRejectState(null)}
        onConfirm={handleConfirmRejectOrHide}
      />
    </div>
  );
}
