"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { PortfolioItem } from "@viecngon/types";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PortfolioItem | null;
}

export default function PortfolioModal({
  isOpen,
  onClose,
  initialData,
}: PortfolioModalProps) {
  const isEditing = !!initialData?.id;
  const {
    createPortfolio,
    isCreatingPortfolio,
    updatePortfolio,
    isUpdatingPortfolio,
  } = useManageCandidateItems();

  const isPending = isCreatingPortfolio || isUpdatingPortfolio;

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [projectUrl, setProjectUrl] = useState(
    initialData?.projectUrl || "",
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề dự án");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      projectUrl: projectUrl.trim() || null,
    };

    try {
      if (isEditing && initialData?.id) {
        await updatePortfolio({ id: initialData.id, data: payload });
        toast.success("Cập nhật dự án thành công!");
      } else {
        await createPortfolio(payload);
        toast.success("Thêm dự án nổi bật thành công!");
      }
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? "Chỉnh sửa dự án" : "Thêm dự án nổi bật"}
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
          {/* Tiêu đề */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tên dự án nổi bật <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Nền tảng tuyển dụng ViecNgon"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Link dự án */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Đường dẫn dự án (Website / GitHub / Demo)
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://github.com/my-project hoặc https://myproject.com"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Mô tả ngắn gọn về dự án, công nghệ sử dụng và vai trò của bạn
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="- Sử dụng Next.js, NestJS, Prisma ORM và SQL Server...&#10;- Xây dựng hệ thống tuyển dụng và tạo CV tự động..."
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 rounded-lg transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

