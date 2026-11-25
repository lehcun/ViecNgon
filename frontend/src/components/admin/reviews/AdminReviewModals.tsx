"use client";

import React, { useState } from "react";
import {
  X,
  Flag,
  ThumbsUp,
  Clock,
  CheckCircle2,
  XCircle,
  EyeOff,
  Loader2,
} from "lucide-react";
import type { AdminReviewListItem } from "@viecngon/types";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import { COMPANY_CRITERIA_META } from "@/data/reviews.mock";
import { REVIEW_STATUS_META } from "@/data/admin-reviews.mock";
import { formatDateVN } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface AdminReviewDetailModalProps {
  review: AdminReviewListItem | null;
  onClose: () => void;
  onApprove: (review: AdminReviewListItem) => void;
  onReject: (review: AdminReviewListItem, mode: "TU_CHOI" | "DA_AN") => void;
}

export function AdminReviewDetailModal({
  review,
  onClose,
  onApprove,
  onReject,
}: AdminReviewDetailModalProps) {
  if (!review) return null;

  const statusMeta = REVIEW_STATUS_META[review.trangThai];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết bài đánh giá công ty"
    >
      <div className="bg-surface-card border border-border-default rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyLogo
              src={review.companyLogo}
              name={review.companyName}
              size="sm"
              className="p-1 bg-white"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-text-primary truncate">
                  {review.companyName}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                    statusMeta.badgeClass,
                  )}
                >
                  {statusMeta.label}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Gửi ngày {formatDateVN(review.createdAt)} · Đánh giá ẩn danh
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {review.biBaoCao && review.lyDoBaoCao && (
            <div className="rounded-xl bg-danger-soft border border-danger-border p-4 space-y-1">
              <p className="text-xs font-bold text-danger-text flex items-center gap-1.5">
                <Flag size={14} />
                Lý do doanh nghiệp báo cáo vi phạm
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {review.lyDoBaoCao}
              </p>
            </div>
          )}

          {review.lyDoTuChoi && (
            <div className="rounded-xl bg-warning-soft border border-warning-border p-4 space-y-1">
              <p className="text-xs font-bold text-warning-text">
                Lý do kiểm duyệt trước đó
              </p>
              <p className="text-xs text-text-secondary">{review.lyDoTuChoi}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <StarRatingInput
                value={review.rating}
                readOnly
                size="md"
                showValue
              />
              {review.khuyenLamViec && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-text">
                  <ThumbsUp size={13} /> Khuyên làm việc
                </span>
              )}
              {review.coOtTot && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-info-text">
                  <Clock size={13} /> Chính sách OT hợp lý
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-text-primary">
              {review.tieuDe}
            </h3>
            {review.noiDung && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {review.noiDung}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl bg-surface-page border border-border-default p-4">
            {COMPANY_CRITERIA_META.map((crit) => (
              <div
                key={crit.key}
                className="flex items-center justify-between text-xs gap-2"
              >
                <span className="text-text-secondary font-medium">
                  {crit.label}
                </span>
                <span className="font-bold text-text-primary tabular-nums">
                  {review[crit.key]}/5
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {review.noiDungUuDiem && (
              <div className="rounded-lg bg-success-soft/60 border border-success-border/70 p-3.5 text-xs text-text-secondary space-y-1">
                <p className="font-bold text-success-text">Điểm cộng</p>
                <p>{review.noiDungUuDiem}</p>
              </div>
            )}
            {review.noiDungCaiThien && (
              <div className="rounded-lg bg-warning-soft/60 border border-warning-border/70 p-3.5 text-xs text-text-secondary space-y-1">
                <p className="font-bold text-warning-text">Cần cải thiện</p>
                <p>{review.noiDungCaiThien}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex flex-wrap items-center justify-end gap-2.5">
          {review.trangThai !== "DA_DUYET" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApprove(review)}
            >
              <CheckCircle2 size={15} />
              Duyệt hiển thị
            </Button>
          )}
          {review.trangThai === "CHO_DUYET" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(review, "TU_CHOI")}
            >
              <XCircle size={15} />
              Từ chối
            </Button>
          )}
          {review.trangThai === "DA_DUYET" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(review, "DA_AN")}
            >
              <EyeOff size={15} />
              Ẩn bài vi phạm
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AdminReviewRejectModalProps {
  open: boolean;
  mode: "TU_CHOI" | "DA_AN";
  reviewTitle: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function AdminReviewRejectModal({
  open,
  mode,
  reviewTitle,
  isSubmitting = false,
  onClose,
  onConfirm,
}: AdminReviewRejectModalProps) {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const isHide = mode === "DA_AN";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      setErrorMsg("Vui lòng nhập lý do rõ ràng (ít nhất 10 ký tự).");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isHide ? "Ẩn bài đánh giá vi phạm" : "Từ chối bài đánh giá"}
    >
      <div className="bg-surface-card border border-border-default rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">
            {isHide ? "Ẩn bài đánh giá vi phạm" : "Từ chối bài đánh giá"}
          </h3>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <p className="text-xs text-text-secondary leading-relaxed">
            Bài viết: <strong className="text-text-primary">{reviewTitle}</strong>
          </p>
          <div>
            <label
              htmlFor="admin-review-reject-reason"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Lý do gửi thông báo cho ứng viên{" "}
              <span className="text-danger">*</span>
            </label>
            <textarea
              id="admin-review-reject-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg("");
              }}
              placeholder="VD: Nội dung chứa ngôn từ công kích cá nhân đích danh / tiết lộ dữ liệu nội bộ..."
              className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />
          </div>
          {errorMsg && (
            <p className="text-xs font-medium text-danger-text">{errorMsg}</p>
          )}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isHide ? "Xác nhận ẩn bài" : "Xác nhận từ chối"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
