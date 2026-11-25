"use client";

import React, { useMemo, useState } from "react";
import { Clock, MessageSquareText, Filter, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import type { PublicCompanyReviewItem } from "@viecngon/types";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";
import CompanyReviewsSummaryCard from "./CompanyReviewsSummaryCard";
import CompanyReviewCtaCard from "./CompanyReviewCtaCard";
import CompanyReviewFormModal from "./CompanyReviewFormModal";
import { ReportReviewModal } from "./CompanyReviewModals";
import CompanyReviewCard from "./CompanyReviewCard";
import { useAuthStore } from "@/store/authStore";
import {
  useCompanyReviews,
  useCreateCompanyReview,
  useReportCompanyReview,
} from "@/hooks/reviews/useCompanyReviews";
import { cn } from "@/lib/utils";

interface CompanyReviewsSectionProps {
  companyId: string;
  companyName: string;
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
  companyId,
  companyName,
}: CompanyReviewsSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const isEmployer = user?.role === "NHATUYENDUNG";
  const isCandidate = user?.role === "UNGVIEN";

  const { data, isLoading, isError, error, refetch } =
    useCompanyReviews(companyId);
  const createMutation = useCreateCompanyReview(companyId);
  const reportMutation = useReportCompanyReview(companyId);

  const [starFilter, setStarFilter] = useState<number | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialRating, setModalInitialRating] = useState(5);
  const [modalKey, setModalKey] = useState(0);
  const [reportTarget, setReportTarget] =
    useState<PublicCompanyReviewItem | null>(null);

  const publishedReviews = useMemo(() => data?.reviews ?? [], [data?.reviews]);
  const myPendingReview = data?.myPendingReview ?? null;
  const hasReviewed = Boolean(data?.hasReviewed);

  const filteredReviews = useMemo(() => {
    return publishedReviews.filter(
      (r) => starFilter === "ALL" || Math.round(r.rating) === starFilter,
    );
  }, [publishedReviews, starFilter]);

  if (isLoading) return <CompanyReviewsSkeleton />;

  if (isError) {
    return (
      <div className="bg-surface-card rounded-xl border border-border-default p-6">
        <ErrorState
          title="Không thể tải đánh giá công ty"
          message={error?.message || "Vui lòng thử lại sau."}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const handleStartReview = (rating: number) => {
    if (!isAuthenticated || !isCandidate) {
      toast.error(
        "Vui lòng đăng nhập tài khoản Ứng viên để gửi đánh giá công ty.",
      );
      return;
    }
    if (hasReviewed) {
      toast("Bạn đã gửi đánh giá cho công ty này rồi.");
      return;
    }
    setModalInitialRating(rating);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* 1. Khối Đánh giá chung */}
      <CompanyReviewsSummaryCard reviews={publishedReviews} />

      {/* 2. Section mời viết đánh giá hoặc thông báo đã đánh giá */}
      {hasReviewed ? (
        <div className="bg-surface-card rounded-xl border border-success-border p-4 flex items-center gap-3 text-sm text-success-text">
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="font-medium">
            Bạn đã gửi đánh giá ẩn danh cho {companyName}. Cảm ơn đóng góp của
            bạn cho cộng đồng kỹ sư IT!
          </span>
        </div>
      ) : (
        <CompanyReviewCtaCard
          companyName={companyName}
          onStartReview={handleStartReview}
        />
      )}

      {/* 3. Danh sách bài đánh giá */}
      <section className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-dashed border-border-default">
          <h2 className="text-lg font-bold text-text-primary">
            {publishedReviews.length} đánh giá về {companyName}
          </h2>

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
        {myPendingReview && (
          <div className="rounded-xl border border-warning-border bg-warning-soft p-4 space-y-2">
            <p className="text-xs font-bold text-warning-text flex items-center gap-1.5">
              <Clock size={14} />
              Đánh giá bạn vừa gửi đang chờ Quản trị viên kiểm duyệt
            </p>
            <div className="rounded-lg bg-surface-card border border-warning-border/70 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-text-primary">
                {myPendingReview.tieuDe}
              </span>
              <span className="px-2 py-0.5 rounded-full font-semibold bg-warning-light text-warning-text border border-warning-border">
                Chờ duyệt
              </span>
            </div>
          </div>
        )}

        {filteredReviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText size={22} />}
            title={
              publishedReviews.length === 0
                ? "Chưa có đánh giá nào"
                : "Không có đánh giá phù hợp bộ lọc"
            }
            description={
              publishedReviews.length === 0
                ? `Hãy là người đầu tiên chia sẻ trải nghiệm làm việc ẩn danh tại ${companyName}.`
                : `Chưa có bài đánh giá nào khớp số sao bạn chọn cho ${companyName}.`
            }
            actionLabel={
              publishedReviews.length > 0 ? "Xem tất cả đánh giá" : undefined
            }
            onAction={
              publishedReviews.length > 0
                ? () => setStarFilter("ALL")
                : undefined
            }
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
        initialRating={modalInitialRating}
        isSubmitting={createMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onSubmitReview={(payload) => {
          createMutation.mutate(payload, {
            onSuccess: () => setIsModalOpen(false),
          });
        }}
      />

      <ReportReviewModal
        key={reportTarget?.id || "report-closed"}
        isOpen={Boolean(reportTarget)}
        reviewTitle={reportTarget?.tieuDe || ""}
        isSubmitting={reportMutation.isPending}
        onClose={() => setReportTarget(null)}
        onSubmitReport={(reason) => {
          if (!reportTarget) return;
          reportMutation.mutate(
            {
              reviewId: reportTarget.id,
              payload: { lyDoBaoCao: reason },
            },
            {
              onSuccess: () => setReportTarget(null),
            },
          );
        }}
      />
    </div>
  );
}
