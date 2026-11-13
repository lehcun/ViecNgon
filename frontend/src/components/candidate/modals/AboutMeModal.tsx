"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateCandidateProfile } from "@/hooks/candidate/useUpdateCandidateProfile";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-dark/50 backdrop-blur-xs">
      <div
        className="bg-surface-card rounded-2xl w-full max-w-3xl shadow-xl border border-border-default flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-main">
            Giới thiệu bản thân
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-text-subtle hover:text-text-main hover:bg-surface-subtle p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-text-secondary mb-3">
            Tóm tắt kỹ năng chuyên môn, kinh nghiệm nổi bật hoặc mục tiêu nghề
            nghiệp để gây ấn tượng với Nhà tuyển dụng:
          </p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="p-5 border-t border-border-subtle flex justify-end gap-3 bg-surface-subtle/60 rounded-b-2xl">
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
            onClick={handleSave}
            isLoading={isPending}
            loadingText="Đang lưu..."
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
