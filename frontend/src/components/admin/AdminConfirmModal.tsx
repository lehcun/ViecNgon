"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

export type AdminConfirmVariant = "danger" | "warning" | "success" | "primary";

interface AdminConfirmModalProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: AdminConfirmVariant;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Hủy",
  variant = "danger",
  isSubmitting = false,
  onClose,
  onConfirm,
}: AdminConfirmModalProps) {
  if (!open) return null;

  const iconWrapClass =
    variant === "danger"
      ? "bg-danger-light text-danger-text"
      : variant === "warning"
        ? "bg-warning-light text-warning-text"
        : variant === "success"
          ? "bg-success-light text-success-text"
          : "bg-primary-light text-primary";

  const confirmBtnClass =
    variant === "danger"
      ? "bg-danger hover:bg-danger-hover"
      : variant === "warning"
        ? "bg-warning hover:bg-warning-hover"
        : variant === "success"
          ? "bg-success hover:bg-success-hover"
          : "bg-primary hover:bg-primary-hover";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-surface-card border border-border-default rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconWrapClass}`}
            >
              {variant === "danger" ? (
                <Trash2 size={16} />
              ) : variant === "warning" ? (
                <EyeOff size={16} />
              ) : variant === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
            </span>
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 text-sm text-text-secondary leading-relaxed">
          {description}
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary transition-colors"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-white text-sm font-semibold disabled:opacity-50 transition-colors ${confirmBtnClass}`}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
