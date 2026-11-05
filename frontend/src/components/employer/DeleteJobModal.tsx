"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface DeleteJobModalProps {
  isOpen: boolean;
  jobId: string;
  jobTitle: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteJobModal({
  isOpen,
  jobTitle,
  isLoading,
  onClose,
  onConfirm,
}: DeleteJobModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 text-center border-b border-rose-100 bg-rose-50/50">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Xác nhận xóa tin tuyển dụng
          </h3>
          <p className="text-xs text-slate-500">
            Hành động này không thể hoàn tác sau khi thực hiện
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tin sẽ bị xóa
            </span>
            <p className="text-sm font-semibold text-slate-800 line-clamp-2">
              {jobTitle}
            </p>
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <span className="text-xs text-amber-900 font-medium">
              Tôi hiểu rằng việc xóa tin này sẽ đồng thời xóa vĩnh viễn các liên kết và dữ liệu bài đăng khỏi hệ thống.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={!isChecked || isLoading}
              onClick={onConfirm}
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md shadow-rose-600/20 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              <span>Xóa vĩnh viễn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

