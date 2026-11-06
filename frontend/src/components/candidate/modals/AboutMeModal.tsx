"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateCandidateProfile } from "@/hooks/candidate/useUpdateCandidateProfile";
import RichTextEditor from "@/components/common/RichTextEditor";

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: string | null;
}

export default function AboutMeModal({
  isOpen,
  onClose,
  initialValue = "",
}: AboutMeModalProps) {
  const [content, setContent] = useState(initialValue || "");
  const { updateCandidateProfileAsync, isPending } =
    useUpdateCandidateProfile();

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await updateCandidateProfileAsync({
        aboutMe: content,
      });
      toast.success("Cập nhật giới thiệu bản thân thành công!");
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Giới thiệu bản thân
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <p className="text-sm text-slate-600 mb-3">
            Tóm tắt kỹ năng chuyên môn, kinh nghiệm nổi bật hoặc mục tiêu nghề nghiệp để gây ấn tượng với Nhà tuyển dụng:
          </p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 rounded-lg transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

