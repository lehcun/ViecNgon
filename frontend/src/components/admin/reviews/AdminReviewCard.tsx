"use client";

import React from "react";
import {
  Flag,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
  Clock,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import { REVIEW_STATUS_META } from "@/data/admin-reviews.mock";
import type {
  CompanyReviewItem,
  ReviewModerationStatus,
} from "@/data/reviews.mock";
import { cn } from "@/lib/utils";

interface AdminReviewCardProps {
  review: CompanyReviewItem;
  onViewDetail: (review: CompanyReviewItem) => void;
  onApprove: (review: CompanyReviewItem) => void;
  onRejectOrHide: (review: CompanyReviewItem, mode: "TU_CHOI" | "DA_AN") => void;
}

const STATUS_ACCENT_BORDER: Record<ReviewModerationStatus, string> = {
  CHO_DUYET: "border-l-warning",
  DA_DUYET: "border-l-success",
  TU_CHOI: "border-l-danger",
  DA_AN: "border-l-slate-400",
};

function formatDateTimeVN(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const day = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${time} · ${day}`;
}

export default function AdminReviewCard({
  review,
  onViewDetail,
  onApprove,
  onRejectOrHide,
}: AdminReviewCardProps) {
  const statusMeta = REVIEW_STATUS_META[review.trangThai];

  return (
    <div
      className={cn(
        "p-4 sm:px-6 border-l-4 hover:bg-surface-page/70 transition-colors space-y-3.5",
        STATUS_ACCENT_BORDER[review.trangThai],
      )}
    >
      {/* Hàng trên: Logo + Tên công ty + DUY NHẤT 1 tag trạng thái chính | Thời gian */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CompanyLogo
            src={review.companyLogo}
            name={review.companyName}
            size="sm"
            className="p-1 bg-white"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-text-primary text-sm truncate">
                {review.companyName || "Doanh nghiệp"}
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full font-bold text-[11px]",
                  statusMeta.badgeClass,
                )}
              >
                {statusMeta.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <StarRatingInput
                value={review.rating}
                readOnly
                size="sm"
                showValue
              />
              {review.daXacThuc && (
                <span
                  title="Đánh giá đã được xác thực nguồn gốc"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted"
                >
                  <BadgeCheck size={14} className="text-primary shrink-0" />
                  <span>Xác thực</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thời gian ngày giờ rõ ràng ở góc trên phải */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-muted border border-border-default text-xs font-semibold text-text-secondary tabular-nums shrink-0">
          <Clock size={13} className="text-primary" />
          {formatDateTimeVN(review.createdAt)}
        </span>
      </div>

      {/* Nội dung đánh giá */}
      <div className="space-y-1">
        <p className="text-sm font-bold text-text-primary line-clamp-1">
          {review.tieuDe}
        </p>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {review.noiDung}
        </p>
      </div>

      {/* Dải cảnh báo riêng khi bị doanh nghiệp báo cáo (tách hẳn khỏi tag trạng thái) */}
      {review.biBaoCao && (
        <div className="rounded-lg bg-danger-soft/75 border border-danger-border/70 px-3 py-2 flex items-start gap-2 text-xs text-danger-text">
          <Flag size={13} className="shrink-0 mt-0.5" />
          <p className="line-clamp-1">
            <strong className="font-semibold">Doanh nghiệp báo cáo:</strong>{" "}
            {review.lyDoBaoCao || "Yêu cầu Quản trị viên xem xét nội dung."}
          </p>
        </div>
      )}

      {/* Hàng dưới: Cố định 12 cột — Ô AI (9 cột) & Cụm nút (3 cột căn giữa) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-3 pt-1">
        {/* Slot cố định cho AI quét tự động */}
        <div
          className="lg:col-span-9 min-w-0 rounded-lg border border-dashed border-ai-border bg-ai-light/55 px-3.5 py-2 flex items-center justify-between gap-2"
          aria-label="Khu vực tích hợp AI quét nội dung tự động"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-md bg-ai/10 text-ai flex items-center justify-center shrink-0">
              <Sparkles size={13} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ai leading-tight truncate">
                AI Quét kiểm duyệt tự động
              </p>
              <p className="text-[11px] text-text-muted truncate">
                Khu vực chờ tích hợp Gemini AI phân tích ngôn từ, spam &amp; độ
                tin cậy
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-surface-card text-ai border border-ai-border shrink-0">
            Sắp tích hợp
          </span>
        </div>

        {/* Cụm nút hành động cố định bên phải */}
        <div className="lg:col-span-3 flex flex-wrap lg:flex-nowrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onViewDetail(review)}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-border-default bg-surface-card text-xs font-semibold text-text-secondary hover:text-primary hover:border-primary/40 transition-colors whitespace-nowrap"
          >
            <Eye size={13} /> Chi tiết
          </button>

          {review.trangThai === "CHO_DUYET" && (
            <>
              <button
                type="button"
                onClick={() => onApprove(review)}
                className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-success-light text-success-text border border-success-border hover:bg-success hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <CheckCircle2 size={13} /> Duyệt
              </button>
              <button
                type="button"
                onClick={() => onRejectOrHide(review, "TU_CHOI")}
                className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-danger-soft text-danger-text border border-danger-border hover:bg-danger hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <XCircle size={13} /> Từ chối
              </button>
            </>
          )}

          {review.trangThai === "DA_DUYET" && (
            <button
              type="button"
              onClick={() => onRejectOrHide(review, "DA_AN")}
              className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-warning-soft text-warning-text border border-warning-border hover:bg-warning hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <EyeOff size={13} /> Ẩn bài
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
