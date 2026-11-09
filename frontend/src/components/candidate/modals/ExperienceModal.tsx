"use client";

import React, { useState } from "react";
import { X, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { ExperienceItem } from "@viecngon/types";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExperienceItem | null;
}

// Chuyển chuỗi định dạng MM/YYYY hoặc ISO thành YYYY-MM cho input date/month
function toInputMonth(dateStr?: string | null): string {
  if (!dateStr) return "";
  if (dateStr.includes("/")) {
    const [month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}`;
  }
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length >= 2) return `${parts[0]}-${parts[1].padStart(2, "0")}`;
  }
  return "";
}

function toIsoDate(monthStr: string): string {
  if (!monthStr) return "";
  return `${monthStr}-01`;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  initialData,
}: ExperienceModalProps) {
  const isEditing = !!initialData?.id;
  const {
    createExperience,
    isCreatingExperience,
    updateExperience,
    isUpdatingExperience,
  } = useManageCandidateItems();

  const isPending = isCreatingExperience || isUpdatingExperience;

  const [position, setPosition] = useState(initialData?.position || "");
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [startMonth, setStartMonth] = useState(() =>
    toInputMonth(initialData?.startDate),
  );
  const [endMonth, setEndMonth] = useState(() =>
    toInputMonth(initialData?.endDate),
  );
  const [isCurrent, setIsCurrent] = useState(
    isEditing ? !initialData?.endDate : false,
  );
  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position.trim()) {
      toast.error("Vui lòng nhập vị trí công việc");
      return;
    }
    if (!companyName.trim()) {
      toast.error("Vui lòng nhập tên công ty");
      return;
    }
    if (!startMonth) {
      toast.error("Vui lòng chọn thời gian bắt đầu");
      return;
    }
    if (!isCurrent && endMonth && endMonth < startMonth) {
      toast.error("Thời gian kết thúc không được trước thời gian bắt đầu");
      return;
    }

    const payload = {
      position: position.trim(),
      companyName: companyName.trim(),
      startDate: toIsoDate(startMonth),
      endDate: isCurrent ? null : endMonth ? toIsoDate(endMonth) : null,
      description: description.trim() || null,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateExperience({ id: initialData.id, data: payload });
        toast.success("Cập nhật kinh nghiệm thành công!");
      } else {
        await createExperience(payload);
        toast.success("Thêm kinh nghiệm thành công!");
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
            {isEditing ? "Chỉnh sửa kinh nghiệm" : "Thêm kinh nghiệm làm việc"}
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
          {/* Vị trí */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Vị trí / Chức danh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="VD: Senior Frontend Developer"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Công ty */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tên công ty / Doanh nghiệp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="VD: VNG Corporation"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Bắt đầu từ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="month"
                  required
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Đến tháng
              </label>
              <div className="relative">
                <input
                  type="month"
                  disabled={isCurrent}
                  value={isCurrent ? "" : endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Checkbox đang làm việc */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrentWork"
              checked={isCurrent}
              onChange={(e) => {
                setIsCurrent(e.target.checked);
                if (e.target.checked) setEndMonth("");
              }}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="isCurrentWork"
              className="text-sm text-slate-700 cursor-pointer select-none font-medium"
            >
              Tôi hiện đang làm việc tại đây
            </label>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Mô tả chi tiết công việc, dự án hoặc thành tích đạt được
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="- Phụ trách phát triển tính năng web...&#10;- Tối ưu hiệu suất và tốc độ tải trang..."
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

