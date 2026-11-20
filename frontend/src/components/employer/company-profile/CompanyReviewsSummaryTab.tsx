"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MessageSquareText,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import type {
  CompanyProfileReviewItem,
  CompanyProfileStats,
} from "@viecngon/types";
import { EmptyState } from "@/components/ui/StateViews";
import { formatDateVN } from "@/lib/formatters";

interface CompanyReviewsSummaryTabProps {
  slug: string;
  companyName: string;
  stats: CompanyProfileStats;
  reviews: CompanyProfileReviewItem[];
}

export function CompanyReviewsSummaryTab({
  slug,
  companyName,
  stats,
  reviews,
}: CompanyReviewsSummaryTabProps) {
  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border-default pb-3.5">
        <h3 className="flex-1 min-w-0 border-l-4 border-primary pl-3.5 pr-5 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base">
          Thống kê Đánh giá từ ứng viên &amp; nhân viên ({stats.totalReviews})
        </h3>
        <Link
          href={`/company/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          <span>Xem tại trang công khai</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-border-default bg-surface-page p-4">
          <p className="text-xs text-text-muted mb-1">Điểm trung bình</p>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums flex items-center gap-1.5">
            {stats.averageRating !== null
              ? stats.averageRating.toFixed(1)
              : "Chưa có"}
            <Star
              size={17}
              className="text-amber-400"
              fill={stats.averageRating !== null ? "currentColor" : "none"}
            />
          </p>
        </div>

        <div className="rounded-xl border border-border-default bg-surface-page p-4">
          <p className="text-xs text-text-muted mb-1">Khuyên làm việc</p>
          <p className="text-xl sm:text-2xl font-bold text-success-text tabular-nums flex items-center gap-1.5">
            {typeof stats.recommendPercent === "number"
              ? `${stats.recommendPercent}%`
              : "Chưa có"}
            <ThumbsUp size={16} />
          </p>
        </div>

        <div className="rounded-xl border border-border-default bg-surface-page p-4">
          <p className="text-xs text-text-muted mb-1">Tổng đánh giá</p>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {stats.totalReviews}
          </p>
        </div>

        <div className="rounded-xl border border-border-default bg-surface-page p-4">
          <p className="text-xs text-text-muted mb-1">Người theo dõi</p>
          <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums flex items-center gap-1.5">
            {stats.followerCount ?? 0}
            <Users size={16} />
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquareText size={22} />}
          title="Chưa có đánh giá công khai"
          description={`Hiện chưa có bài đánh giá nào dành cho ${companyName}. Khi ứng viên hoặc nhân viên gửi đánh giá, danh sách sẽ hiển thị tại đây.`}
        />
      ) : (
        <div className="space-y-3.5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border-default bg-surface-page p-4 sm:p-5 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-text-muted tabular-nums">
                  {formatDateVN(review.createdAt)}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={
                          i < Math.round(review.rating)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < Math.round(review.rating)
                            ? "text-amber-400"
                            : "text-border-strong"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold tabular-nums text-text-primary">
                    {review.rating}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-text-primary">
                {review.title}
              </h4>

              {review.content && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {review.content}
                </p>
              )}

              {review.pros && (
                <p className="text-xs text-text-secondary">
                  <strong className="text-success-text">Điểm cộng:</strong>{" "}
                  {review.pros}
                </p>
              )}

              {review.cons && (
                <p className="text-xs text-text-secondary">
                  <strong className="text-warning-text">Cần cải thiện:</strong>{" "}
                  {review.cons}
                </p>
              )}

              {review.recommend && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-success-text pt-0.5">
                  <ThumbsUp size={13} />
                  <span>Khuyên làm việc tại đây</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
