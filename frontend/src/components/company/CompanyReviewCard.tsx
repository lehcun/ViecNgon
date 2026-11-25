"use client";

import React from "react";
import { ThumbsUp, Clock, Flag, Star, ChevronDown } from "lucide-react";
import {
  COMPANY_CRITERIA_META,
  type CompanyReviewItem,
} from "@/data/reviews.mock";
import { formatDateVN } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface CompanyReviewCardProps {
  review: CompanyReviewItem;
  isEmployer: boolean;
  onReport: (review: CompanyReviewItem) => void;
}

const CRITERIA_LABELS = {
  diemLuongPhucLoi: "Lương thưởng & phúc lợi",
  diemDaoTao: "Đào tạo & học hỏi",
  diemQuanLy: "Sự quan tâm đến nhân viên",
  diemVanHoa: "Văn hóa công ty",
  diemVanPhong: "Văn phòng làm việc",
} as const;

function AmberStars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx + 1 <= Math.round(value);
        return (
          <Star
            key={idx}
            size={size}
            fill={filled ? "currentColor" : "none"}
            className={cn(
              "shrink-0",
              filled ? "text-amber-500" : "text-amber-200",
            )}
          />
        );
      })}
    </span>
  );
}

export default function CompanyReviewCard({
  review,
  isEmployer,
  onReport,
}: CompanyReviewCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-surface-page p-5 space-y-3">
      {/* Hàng trên cùng: Ngày đăng + nút Báo cáo (chỉ dành cho NTD) */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-text-muted font-medium tabular-nums">
          {formatDateVN(review.createdAt)}
        </span>

        {isEmployer && (
          <div>
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

      {/* Tiêu đề bài đánh giá */}
      <h3 className="text-base font-bold text-text-primary leading-snug">
        {review.tieuDe}
      </h3>

      {/* Hàng sao (hover xổ bảng 5 tiêu chí) ngang hàng với Khuyên làm việc & Chính sách OT */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <div className="relative group inline-flex items-center">
          <div className="inline-flex items-center gap-1.5 cursor-pointer py-0.5 select-none">
            <AmberStars value={review.rating} size={15} />
            <span className="font-bold text-text-primary tabular-nums text-sm">
              {review.rating.toFixed(1)}
            </span>
            <ChevronDown
              size={14}
              className="text-text-muted transition-transform duration-200 group-hover:rotate-180 group-hover:text-text-primary"
            />
          </div>

          {/* Popover chi tiết 5 tiêu chí khi di chuột vào */}
          <div
            role="tooltip"
            className="absolute left-0 top-full pt-1.5 z-30 w-80 sm:w-96 opacity-0 invisible translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150"
          >
            <div className="rounded-xl bg-surface-card border border-border-default shadow-lg px-4 py-2 divide-y divide-dashed divide-border-default">
              {COMPANY_CRITERIA_META.map((crit) => {
                const score = review[crit.key];
                return (
                  <div
                    key={crit.key}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <span className="text-xs sm:text-sm font-medium text-text-primary">
                      {CRITERIA_LABELS[crit.key]}
                    </span>
                    <div className="inline-flex items-center gap-2 shrink-0">
                      <AmberStars value={score} size={14} />
                      <span className="text-xs sm:text-sm font-bold text-text-primary tabular-nums w-4 text-right">
                        {score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {review.khuyenLamViec && (
          <span className="inline-flex items-center gap-1 font-semibold text-success-text">
            <ThumbsUp size={13} />
            Khuyên làm việc
          </span>
        )}

        {review.coOtTot && (
          <span className="inline-flex items-center gap-1 font-semibold text-info-text">
            <Clock size={13} />
            Chính sách OT hợp lý
          </span>
        )}
      </div>

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
    </article>
  );
}
