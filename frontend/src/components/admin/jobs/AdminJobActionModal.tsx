"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  EyeOff,
  Loader2,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import type { AdminJobListItem } from "@viecngon/types";

export type AdminJobModalMode = "approve" | "reject" | "hide" | "delete";

interface AdminJobActionModalProps {
  mode: AdminJobModalMode;
  job: AdminJobListItem;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmApprove: () => void;
  onConfirmReject: (reason: string) => void;
  onConfirmHide: (reason: string) => void;
  onConfirmDelete: (reason: string) => void;
}

export default function AdminJobActionModal({
  mode,
  job,
  isSubmitting,
  onClose,
  onConfirmApprove,
  onConfirmReject,
  onConfirmHide,
  onConfirmDelete,
}: AdminJobActionModalProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();
  const isRejectMissingReason = mode === "reject" && !trimmedReason;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRejectMissingReason) return;

    if (mode === "approve") {
      onConfirmApprove();
    } else if (mode === "reject") {
      onConfirmReject(trimmedReason);
    } else if (mode === "hide") {
      onConfirmHide(trimmedReason);
    } else {
      onConfirmDelete(trimmedReason);
    }
  };

  const title =
    mode === "approve"
      ? "Duyệt tin tuyển dụng"
      : mode === "reject"
        ? "Từ chối tin tuyển dụng"
        : mode === "hide"
          ? "Ẩn tin tuyển dụng"
          : "Xóa tin tuyển dụng";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-surface-card border border-border-default rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {mode === "approve" && (
              <span className="w-8 h-8 rounded-lg bg-success-light text-success-text flex items-center justify-center">
                <CheckCircle2 size={16} />
              </span>
            )}
            {mode === "reject" && (
              <span className="w-8 h-8 rounded-lg bg-danger-light text-danger-text flex items-center justify-center">
                <XCircle size={16} />
              </span>
            )}
            {mode === "hide" && (
              <span className="w-8 h-8 rounded-lg bg-warning-light text-warning-text flex items-center justify-center">
                <EyeOff size={16} />
              </span>
            )}
            {mode === "delete" && (
              <span className="w-8 h-8 rounded-lg bg-danger-light text-danger-text flex items-center justify-center">
                <Trash2 size={16} />
              </span>
            )}
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-surface-page border border-border-default rounded-xl p-3.5 text-sm">
            <p className="font-semibold text-text-primary line-clamp-2">
              {job.tenCongViec}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {job.company.tenCongTy} · {job.recruiter.email}
            </p>
          </div>

          {mode === "approve" ? (
            <p className="text-sm text-text-secondary">
              Tin tuyển dụng này sẽ được chuyển sang trạng thái{" "}
              <strong className="text-success-text">Đang tuyển</strong> và hiển
              thị công khai cho toàn bộ ứng viên trên ViecNgon.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                {mode === "reject"
                  ? "Vui lòng nêu rõ lý do từ chối để Nhà tuyển dụng chỉnh sửa và gửi duyệt lại."
                  : mode === "hide"
                    ? "Tin sẽ bị ẩn khỏi trang tìm việc công khai nhưng vẫn lưu trong danh sách quản lý."
                    : "Tin sẽ bị gỡ bỏ hoàn toàn khỏi hệ thống và gửi thông báo tới Nhà tuyển dụng."}
              </p>
              <label
                htmlFor="job-moderation-reason"
                className="block text-xs font-semibold text-text-primary"
              >
                {mode === "reject" ? (
                  <>
                    Lý do từ chối <span className="text-danger">*</span>
                  </>
                ) : (
                  "Lý do (khuyến nghị)"
                )}
              </label>
              <textarea
                id="job-moderation-reason"
                rows={3}
                maxLength={300}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  mode === "reject"
                    ? "VD: Nội dung mô tả công việc chưa rõ ràng hoặc mức lương không hợp lệ..."
                    : "VD: Vi phạm chính sách đăng tin của ViecNgon..."
                }
                className="w-full rounded-lg border border-border-default bg-surface-card p-3 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-[11px] text-text-muted text-right">
                {reason.length}/300 ký tự
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary transition-colors"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isRejectMissingReason}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              mode === "approve"
                ? "bg-success hover:bg-success-hover"
                : mode === "hide"
                  ? "bg-warning hover:bg-warning-hover"
                  : "bg-danger hover:bg-danger-hover"
            }`}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {mode === "approve"
              ? "Xác nhận duyệt"
              : mode === "reject"
                ? "Xác nhận từ chối"
                : mode === "hide"
                  ? "Xác nhận ẩn"
                  : "Xác nhận xóa"}
          </button>
        </div>
      </form>
    </div>
  );
}
