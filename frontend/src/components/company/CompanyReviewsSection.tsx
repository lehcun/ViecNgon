"use client";

import React, { useMemo, useState } from "react";
import {
  Star,
  ThumbsUp,
  Clock,
  ShieldCheck,
  PenLine,
  MessageSquareText,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StateViews";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import CompanyReviewFormModal from "./CompanyReviewFormModal";
import {
  COMPANY_CRITERIA_META,
  MOCK_COMPANY_REVIEWS,
  VERIFICATION_SOURCE_LABEL,
  computeCompanyReviewStats,
  type CompanyReviewItem,
} from "@/data/reviews.mock";
import { formatDateVN } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface CompanyReviewsSectionProps {
  companyName: string;
  currentUserName?: string;
  isLoading?: boolean;
}

export function CompanyReviewsSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-surface-subtle rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-4 h-44 bg-surface-muted rounded-xl" />
        <div className="md:col-span-8 h-44 bg-surface-muted rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="h-36 bg-surface-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function CompanyReviewsSection({
  companyName,
  currentUserName,
  isLoading = false,
}: CompanyReviewsSectionProps) {
  const [reviews, setReviews] = useState<CompanyReviewItem[]>(
    MOCK_COMPANY_REVIEWS,
  );
  const [starFilter, setStarFilter] = useState<number | "ALL">("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const stats = useMemo(() => computeCompanyReviewStats(reviews), [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchStar =
        starFilter === "ALL" || Math.round(r.rating) === starFilter;
      const matchVerified = !verifiedOnly || r.daXacThuc;
      return matchStar && matchVerified;
    });
  }, [reviews, starFilter, verifiedOnly]);

  if (isLoading) return <CompanyReviewsSkeleton />;

  const handleOpenModal = () => {
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-6">
      {/* Header + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-dashed border-border-default">
        <h2 className="flex-1 min-w-0 border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
          Đánh giá công ty ({reviews.length})
        </h2>
        <Button variant="primary" size="md" onClick={handleOpenModal}>
          <PenLine size={16} />
          Viết đánh giá
        </Button>
      </div>

      {/* Khối Tổng quan 5 tiêu chí & phân bố sao */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trái: Điểm trung bình & tỷ lệ khuyên làm */}
        <div className="lg:col-span-5 rounded-xl border border-border-default bg-surface-page p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center pr-4 border-r border-border-default">
              <div className="text-4xl font-extrabold text-text-primary tabular-nums leading-none">
                {stats.avg.toFixed(1)}
              </div>
              <div className="mt-1.5">
                <StarRatingInput value={stats.avg} readOnly size="sm" />
              </div>
              <p className="text-xs text-text-muted mt-1">
                {reviews.length} lượt đánh giá
              </p>
            </div>

            <div className="flex-1 space-y-1.5">
              {stats.distribution.map((row) => (
                <div key={row.star} className="flex items-center gap-2 text-xs">
                  <span className="w-7 text-text-secondary font-medium tabular-nums shrink-0">
                    {row.star} ★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-text-muted tabular-nums shrink-0">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border-default">
            <div className="rounded-lg bg-success-soft border border-success-border px-3 py-2">
              <div className="flex items-center gap-1.5 text-success-text font-bold text-sm tabular-nums">
                <ThumbsUp size={14} />
                <span>{stats.recommendPct}%</span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Khuyên làm việc
              </p>
            </div>
            <div className="rounded-lg bg-info-soft border border-info-border px-3 py-2">
              <div className="flex items-center gap-1.5 text-info-text font-bold text-sm tabular-nums">
                <Clock size={14} />
                <span>{stats.otPct}%</span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Hài lòng về OT
              </p>
            </div>
          </div>
        </div>

        {/* Phải: Điểm chi tiết 5 tiêu chí */}
        <div className="lg:col-span-7 rounded-xl border border-border-default bg-surface-page p-5 space-y-3">
          <h3 className="text-sm font-bold text-text-primary">
            Điểm đánh giá theo từng tiêu chí
          </h3>
          <div className="space-y-3">
            {COMPANY_CRITERIA_META.map((item) => {
              const score = stats.criteriaAvg[item.key];
              const pct = Math.round((score / 5) * 100);
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-text-secondary">
                      {item.label}
                    </span>
                    <span className="font-bold text-text-primary tabular-nums inline-flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-amber-400"
                        fill="currentColor"
                      />
                      {score.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bộ lọc nhanh */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
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
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-page text-text-secondary border-border-default hover:border-primary/40 hover:text-primary",
                )}
              >
                {val === "ALL" ? "Tất cả" : `${val} ★`}
              </button>
            );
          })}
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-border-strong text-primary focus:ring-primary"
          />
          <span>Chỉ hiện đánh giá đã xác thực</span>
        </label>
      </div>

      {/* Danh sách đánh giá */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquareText size={22} />}
          title="Không có đánh giá phù hợp bộ lọc"
          description={`Chưa có bài đánh giá nào khớp tiêu chí bạn chọn cho ${companyName}.`}
          actionLabel="Xóa bộ lọc"
          onAction={() => {
            setStarFilter("ALL");
            setVerifiedOnly(false);
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-border-default bg-surface-page p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-text-primary">
                    {review.anDanh ? "Nhân viên ẩn danh" : review.authorName}
                  </span>
                  <span className="text-text-muted">· {review.authorRole}</span>
                  <span className="text-text-muted">
                    · {formatDateVN(review.createdAt)}
                  </span>
                  {review.daXacThuc && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-soft text-success-text border border-success-border font-medium">
                      <ShieldCheck size={12} />
                      {VERIFICATION_SOURCE_LABEL[review.nguonXacThuc]}
                    </span>
                  )}
                </div>

                <StarRatingInput
                  value={review.rating}
                  readOnly
                  size="sm"
                  showValue
                />
              </div>

              <h3 className="text-base font-bold text-text-primary">
                {review.tieuDe}
              </h3>

              {review.noiDung && (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {review.noiDung}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {review.noiDungUuDiem && (
                  <div className="rounded-lg bg-success-soft/60 border border-success-border/70 p-3 text-xs text-text-secondary leading-relaxed">
                    <p className="font-bold text-success-text mb-1">
                      Điểm cộng
                    </p>
                    <p>{review.noiDungUuDiem}</p>
                  </div>
                )}
                {review.noiDungCaiThien && (
                  <div className="rounded-lg bg-warning-soft/60 border border-warning-border/70 p-3 text-xs text-text-secondary leading-relaxed">
                    <p className="font-bold text-warning-text mb-1">
                      Cần cải thiện
                    </p>
                    <p>{review.noiDungCaiThien}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border-default/80 text-xs">
                {review.khuyenLamViec && (
                  <span className="inline-flex items-center gap-1 font-medium text-success-text">
                    <ThumbsUp size={13} />
                    Khuyên làm việc tại đây
                  </span>
                )}
                {review.coOtTot && (
                  <span className="inline-flex items-center gap-1 font-medium text-info-text">
                    <Clock size={13} />
                    Chính sách OT hợp lý
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <CompanyReviewFormModal
        key={modalKey}
        isOpen={isModalOpen}
        companyName={companyName}
        authorName={currentUserName}
        onClose={() => setIsModalOpen(false)}
        onSubmitMock={(newReview) => setReviews((prev) => [newReview, ...prev])}
      />
    </div>
  );
}
