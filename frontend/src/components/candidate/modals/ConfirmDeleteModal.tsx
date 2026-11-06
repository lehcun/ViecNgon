"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{message}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all active:scale-95 disabled:bg-rose-400 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Đang xoá..." : "Xác nhận xoá"}
          </button>
        </div>
      </div>
    </div>
  );
}

