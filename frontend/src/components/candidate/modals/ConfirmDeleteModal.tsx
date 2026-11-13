"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isPending?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xoá",
  message = "Bạn có chắc chắn muốn xoá mục này không? Hành động này không thể hoàn tác.",
  isPending = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-dark/50 backdrop-blur-xs">
      <div
        className="bg-surface-card rounded-2xl w-full max-w-md shadow-xl border border-border-default p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-danger-soft text-danger-text border border-danger-border flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-text-main mb-1">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-text-subtle hover:text-text-main p-1 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Huỷ
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isPending}
            loadingText="Đang xoá..."
          >
            Xác nhận xoá
          </Button>
        </div>
      </div>
    </div>
  );
}
