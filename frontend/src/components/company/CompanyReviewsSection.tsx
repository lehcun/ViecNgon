"use client";

import React, { useMemo, useState } from "react";
import { Clock, MessageSquareText, Filter } from "lucide-react";
import { EmptyState } from "@/components/ui/StateViews";
import CompanyReviewsSummaryCard from "./CompanyReviewsSummaryCard";
import CompanyReviewCtaCard from "./CompanyReviewCtaCard";
import CompanyReviewFormModal from "./CompanyReviewFormModal";
import { ReportReviewModal } from "./CompanyReviewModals";
import CompanyReviewCard from "./CompanyReviewCard";
import { useAuthStore } from "@/store/authStore";
import {
  MOCK_COMPANY_REVIEWS,
  type CompanyReviewItem,
} from "@/data/reviews.mock";
import { cn } from "@/lib/utils";

interface CompanyReviewsSectionProps {
  companyName: string;
  currentUserName?: string;
  isLoading?: boolean;
}

export function CompanyReviewsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-4">
        <div className="h-7 w-48 bg-surface-subtle rounded-lg" />
        <div className="h-36 bg-surface-muted rounded-xl" />
      </div>
      <div className="bg-surface-card rounded-xl border border-border-default p-6 h-28" />
      <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-4">
        <div className="h-32 bg-surface-muted rounded-xl" />
        <div className="h-32 bg-surface-muted rounded-xl" />
      </div>
    </div>
  );
}

export default function CompanyReviewsSection({
  companyName,
  currentUserName,
  isLoading = false,
}: CompanyReviewsSectionProps) {
  const { user } = useAuthStore();
  const isEmployer = user?.role === "NHATUYENDUNG";

  const [reviews, setReviews] = useState<CompanyReviewItem[]>(
    MOCK_COMPANY_REVIEWS,
  );
  const [starFilter, setStarFilter] = useState<number | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialRating, setModalInitialRating] = useState(5);
  const [modalKey, setModalKey] = useState(0);
  const [reportTarget, setReportTarget] = useState<CompanyReviewItem | null>(
    null,
  );

  const publishedReviews = useMemo(
    () => reviews.filter((r) => r.trangThai === "DA_DUYET"),
    [reviews],
  );
  const pendingUserReviews = useMemo(
    () => reviews.filter((r) => r.trangThai === "CHO_DUYET"),
    [reviews],
  );

  const filteredReviews = useMemo(() => {
    return publishedReviews.filter(
      (r) => starFilter === "ALL" || Math.round(r.rating) === starFilter,
    );
  }, [publishedReviews, starFilter]);

  if (isLoading) return <CompanyReviewsSkeleton />;

  const handleStartReview = (rating: number) => {
    setModalInitialRating(rating);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* 1. Khối Đánh giá chung (tông vàng + Xem thêm đổ xuống 5 tiêu chí) */}
      <CompanyReviewsSummaryCard reviews={publishedReviews} />

      {/* 2. Section mời viết đánh giá (5 sao rỗng tương tác) */}
      <CompanyReviewCtaCard
        companyName={companyName}
        onStartReview={handleStartReview}
      />

      {/* 3. Danh sách bài đánh giá */}
      <section className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-dashed border-border-default">
          <h2 className="text-lg font-bold text-text-primary">
            {publishedReviews.length} đánh giá về {companyName}
          </h2>

          {/* Bộ lọc số sao */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted mr-1">
              <Filter size={13} />
              Lọc:
            </span>
            {(["ALL", 5, 4, 3, 2, 1] as const).map((val) => {
              const active = starFilter === val;
              return (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setStarFilter(val)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                    active
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-surface-page text-text-secondary border-border-default hover:border-amber-400 hover:text-amber-600",
                  )}
                >
                  {val === "ALL" ? "Tất cả" : `${val} ★`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bài đánh giá ứng viên vừa gửi — Đang chờ Admin duyệt */}
        {pendingUserReviews.length > 0 && (
          <div className="rounded-xl border border-warning-border bg-warning-soft p-4 space-y-2">
            <p className="text-xs font-bold text-warning-text flex items-center gap-1.5">
              <Clock size={14} />
              Đánh giá bạn vừa gửi đang chờ Quản trị viên kiểm duyệt (
              {pendingUserReviews.length})
            </p>
            {pendingUserReviews.map((item) => (
              <div
                key={item.id}
                className="rounded-lg bg-surface-card border border-warning-border/70 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <span className="font-semibold text-text-primary">
                  {item.tieuDe}
                </span>
                <span className="px-2 py-0.5 rounded-full font-semibold bg-warning-light text-warning-text border border-warning-border">
                  Chờ duyệt
                </span>
              </div>
            ))}
          </div>
        )}

        {filteredReviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText size={22} />}
            title="Không có đánh giá phù hợp bộ lọc"
            description={`Chưa có bài đánh giá nào khớp số sao bạn chọn cho ${companyName}.`}
            actionLabel="Xem tất cả đánh giá"
            onAction={() => setStarFilter("ALL")}
          />
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <CompanyReviewCard
                key={review.id}
                review={review}
                isEmployer={isEmployer}
                onReport={setReportTarget}
              />
            ))}
          </div>
        )}
      </section>

      <CompanyReviewFormModal
        key={modalKey}
        isOpen={isModalOpen}
        companyName={companyName}
        authorName={currentUserName}
        initialRating={modalInitialRating}
        onClose={() => setIsModalOpen(false)}
        onSubmitMock={(newReview) => setReviews((prev) => [newReview, ...prev])}
      />

      <ReportReviewModal
        key={reportTarget?.id || "report-closed"}
        isOpen={Boolean(reportTarget)}
        reviewTitle={reportTarget?.tieuDe || ""}
        onClose={() => setReportTarget(null)}
        onSubmitReport={(reason) => {
          if (!reportTarget) return;
          setReviews((prev) =>
            prev.map((item) =>
              item.id === reportTarget.id
                ? {
                    ...item,
                    biBaoCao: true,
                    lyDoBaoCao: reason,
                    ngayBaoCao: new Date().toISOString(),
                  }
                : item,
            ),
          );
        }}
      />
    </div>
  );
}
