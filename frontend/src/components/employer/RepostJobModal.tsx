"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  Calendar,
  X,
  Loader2,
  CheckCircle2,
  Edit3,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRepostJob } from "@/hooks/recruiter/useEmployerJobs";

interface RepostJobModalProps {
  isOpen: boolean;
  jobId: string;
  jobTitle: string;
  currentDeadline?: string | null;
  onClose: () => void;
}

export default function RepostJobModal({
  isOpen,
  jobId,
  jobTitle,
  currentDeadline,
  onClose,
}: RepostJobModalProps) {
  const router = useRouter();
  const { mutate: repostJob, isPending } = useRepostJob();

  // Mặc định gợi ý +30 ngày kể từ hôm nay
  const getDefaultExpirationDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  const [newDeadline, setNewDeadline] = useState<string>(
    getDefaultExpirationDate(),
  );
  const [option, setOption] = useState<"DIRECT" | "EDIT">("DIRECT");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (option === "EDIT") {
      onClose();
      router.push(`/employer-jobs/${jobId}/edit?repost=true`);
      return;
    }

    const isoDeadline = new Date(newDeadline).toISOString();
    repostJob(
      {
        jobId,
        payload: {
          ngayHetHanMoi: isoDeadline,
          updateContent: false,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner">
              <RotateCcw size={20} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Đăng lại / Gia hạn tin tuyển dụng
              </h3>
              <p className="text-xs text-slate-500">
                Làm mới ngày đăng và gia hạn thời gian nhận hồ sơ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tên bài đăng */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Bài đăng tuyển dụng
            </span>
            <h4 className="font-bold text-slate-800 text-sm line-clamp-2">
              {jobTitle}
            </h4>
          </div>

          {/* Chọn ngày hết hạn mới */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary" />
                Hạn nộp hồ sơ mới <span className="text-red-500">*</span>
              </span>
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <Sparkles size={12} /> Gợi ý +30 ngày
              </span>
            </label>
            <input
              type="date"
              value={newDeadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Clock size={12} />
              Ngày đăng sẽ được cập nhật thành ngày hôm nay ({new Date().toLocaleDateString("vi-VN")}).
            </p>
          </div>

          {/* Tùy chọn đăng lại */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Tùy chọn thao tác
            </span>

            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                option === "DIRECT"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="repostOption"
                checked={option === "DIRECT"}
                onChange={() => setOption("DIRECT")}
                className="mt-0.5 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Kích hoạt lại ngay với nội dung hiện có
                </span>
                <span className="text-[11px] text-slate-500">
                  Giữ nguyên mô tả, yêu cầu và phúc lợi, chỉ làm mới ngày đăng và gia hạn nhận hồ sơ.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                option === "EDIT"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="repostOption"
                checked={option === "EDIT"}
                onChange={() => setOption("EDIT")}
                className="mt-0.5 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                  <Edit3 size={13} className="text-primary" />
                  Chỉnh sửa nội dung chi tiết trước khi đăng
                </span>
                <span className="text-[11px] text-slate-500">
                  Chuyển tới trang chỉnh sửa để cập nhật lại mức lương, kỹ năng hoặc mô tả công việc.
                </span>
              </div>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              <span>{option === "EDIT" ? "Đi tới trang sửa tin" : "Xác nhận đăng lại"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

