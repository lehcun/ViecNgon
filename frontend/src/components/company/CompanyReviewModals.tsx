"use client";

import React, { useState } from "react";
import { X, MessageSquareReply, Flag, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { REVIEW_REPORT_REASONS } from "@/data/admin-reviews.mock";

interface CompanyReplyModalProps {
  isOpen: boolean;
  companyName: string;
  reviewTitle: string;
  initialReply?: string;
  onClose: () => void;
  onSubmitReply: (replyText: string) => void;
}

export function CompanyReplyModal({
  isOpen,
  companyName,
  reviewTitle,
  initialReply = "",
  onClose,
  onSubmitReply,
}: CompanyReplyModalProps) {
  const [replyText, setReplyText] = useState(initialReply);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (trimmed.length < 10) {
      setErrorMsg("Nội dung phản hồi cần ít nhất 10 ký tự.");
      return;
    }
    onSubmitReply(trimmed);
    toast.success("Đã đăng phản hồi chính thức của doanh nghiệp (mock UI)!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Phản hồi đánh giá từ Nhà tuyển dụng"
    >
      <div className="bg-surface-card border border-border-default rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
              <MessageSquareReply size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-text-primary truncate">
                Phản hồi chính thức · {companyName}
              </h3>
              <p className="text-xs text-text-muted truncate">
                Trả lời bài: &ldquo;{reviewTitle}&rdquo;
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label
              htmlFor="company-reply-textarea"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Nội dung phản hồi công khai <span className="text-danger">*</span>
            </label>
            <textarea
              id="company-reply-textarea"
              rows={4}
              maxLength={600}
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Cảm ơn ứng viên đã góp ý hoặc giải thích minh bạch về quy trình, phúc lợi của doanh nghiệp..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />
            <p className="text-xs text-text-muted mt-1">
              Phản hồi sẽ hiển thị công khai ngay dưới bài đánh giá với nhãn
              &ldquo;Phản hồi từ Nhà tuyển dụng&rdquo;.
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs font-medium text-danger-text bg-danger-soft border border-danger-border rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="md">
              Đăng phản hồi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ReportReviewModalProps {
  isOpen: boolean;
  reviewTitle: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmitReport: (reason: string) => void;
}

export function ReportReviewModal({
  isOpen,
  reviewTitle,
  isSubmitting = false,
  onClose,
  onSubmitReport,
}: ReportReviewModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(
    REVIEW_REPORT_REASONS[0],
  );
  const [extraNote, setExtraNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combined = extraNote.trim()
      ? `${selectedReason} — ${extraNote.trim()}`
      : selectedReason;
    onSubmitReport(combined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Báo cáo bài đánh giá vi phạm"
    >
      <div className="bg-surface-card border border-border-default rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-danger-light text-danger-text flex items-center justify-center shrink-0">
              <Flag size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-text-primary">
                Báo cáo đánh giá vi phạm
              </h3>
              <p className="text-xs text-text-muted truncate">
                Bài viết: &ldquo;{reviewTitle}&rdquo;
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-lg bg-warning-soft border border-warning-border p-3 text-xs text-warning-text flex items-start gap-2">
            <ShieldAlert size={15} className="shrink-0 mt-0.5" />
            <span>
              Quản trị viên ViecNgon sẽ kiểm tra trung lập. Các bài đánh giá
              chấm điểm thấp nhưng góp ý lịch sự, đúng sự thật sẽ không bị gỡ.
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-primary">
              Chọn lý do báo cáo <span className="text-danger">*</span>
            </p>
            {REVIEW_REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-border-default bg-surface-page cursor-pointer hover:border-primary/40 transition-colors"
              >
                <input
                  type="radio"
                  name="report-reason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-text-primary leading-relaxed">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          <div>
            <label
              htmlFor="report-extra-note"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Mô tả thêm / Bằng chứng (không bắt buộc)
            </label>
            <textarea
              id="report-extra-note"
              rows={3}
              maxLength={400}
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              placeholder="Cung cấp thêm ngữ cảnh giúp Admin xác minh nhanh hơn..."
              className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              Gửi báo cáo lên Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
