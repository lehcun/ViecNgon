"use client";

import React from "react";
import {
  ThumbsUp,
  Clock,
  ShieldCheck,
  MessageSquareReply,
  Flag,
  Building2,
} from "lucide-react";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import {
  VERIFICATION_SOURCE_LABEL,
  type CompanyReviewItem,
} from "@/data/reviews.mock";
import { formatDateVN } from "@/lib/formatters";

interface CompanyReviewCardProps {
  review: CompanyReviewItem;
  companyName: string;
  isEmployer: boolean;
  onReply: (review: CompanyReviewItem) => void;
  onReport: (review: CompanyReviewItem) => void;
}

export default function CompanyReviewCard({
  review,
  companyName,
  isEmployer,
  onReply,
  onReport,
}: CompanyReviewCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-surface-page p-5 space-y-3">
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

        <StarRatingInput value={review.rating} readOnly size="sm" showValue />
      </div>

      <h3 className="text-base font-bold text-text-primary">{review.tieuDe}</h3>

      {review.noiDung && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {review.noiDung}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {review.noiDungUuDiem && (
          <div className="rounded-lg bg-success-soft/60 border border-success-border/70 p-3 text-xs text-text-secondary leading-relaxed">
            <p className="font-bold text-success-text mb-1">Điểm cộng</p>
            <p>{review.noiDungUuDiem}</p>
          </div>
        )}
        {review.noiDungCaiThien && (
          <div className="rounded-lg bg-warning-soft/60 border border-warning-border/70 p-3 text-xs text-text-secondary leading-relaxed">
            <p className="font-bold text-warning-text mb-1">Cần cải thiện</p>
            <p>{review.noiDungCaiThien}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-default/80 text-xs">
        <div className="flex flex-wrap items-center gap-3">
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

        {isEmployer && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => onReply(review)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-default bg-surface-card text-text-secondary hover:text-primary hover:border-primary/40 font-semibold transition-colors"
            >
              <MessageSquareReply size={13} />
              {review.phanHoiCongTy ? "Sửa phản hồi" : "Phản hồi chính thức"}
            </button>

            {review.biBaoCao ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-warning-soft text-warning-text border border-warning-border font-semibold">
                <Flag size={12} />
                Đã báo cáo Admin
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onReport(review)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-danger-border bg-danger-soft text-danger-text hover:bg-danger-light font-semibold transition-colors"
              >
                <Flag size={12} />
                Báo cáo vi phạm
              </button>
            )}
          </div>
        )}
      </div>

      {/* Phản hồi chính thức từ Nhà tuyển dụng */}
      {review.phanHoiCongTy && (
        <div className="rounded-lg bg-primary-light/50 border border-primary-subtle p-3.5 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-primary">
              <Building2 size={13} />
              Phản hồi chính thức từ {companyName}
            </span>
            {review.ngayPhanHoiCongTy && (
              <span className="text-text-muted">
                {formatDateVN(review.ngayPhanHoiCongTy)}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {review.phanHoiCongTy}
          </p>
        </div>
      )}
    </article>
  );
}
