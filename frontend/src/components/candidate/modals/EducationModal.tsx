"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";

interface EducationItem {
  id: string;
  schoolName: string;
  major: string;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EducationItem | null;
}

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

export default function EducationModal({
  isOpen,
  onClose,
  initialData,
}: EducationModalProps) {
  const isEditing = !!initialData?.id;
  const {
    createEducation,
    isCreatingEducation,
    updateEducation,
    isUpdatingEducation,
  } = useManageCandidateItems();

  const isPending = isCreatingEducation || isUpdatingEducation;

  const [schoolName, setSchoolName] = useState(initialData?.schoolName || "");
  const [major, setMajor] = useState(initialData?.major || "");
  const [startMonth, setStartMonth] = useState(() =>
    toInputMonth(initialData?.startDate),
  );
  const [endMonth, setEndMonth] = useState(() =>
    toInputMonth(initialData?.endDate),
  );
  const [isStudying, setIsStudying] = useState(
    isEditing ? !initialData?.endDate : false,
  );
  const [gpa, setGpa] = useState(initialData?.gpa || "");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolName.trim()) {
      toast.error("Vui lòng nhập tên trường học");
      return;
    }
    if (!major.trim()) {
      toast.error("Vui lòng nhập ngành học");
      return;
    }
    if (!startMonth) {
      toast.error("Vui lòng chọn thời gian bắt đầu");
      return;
    }

    const payload = {
      schoolName: schoolName.trim(),
      major: major.trim(),
      startDate: toIsoDate(startMonth),
      endDate: isStudying ? null : endMonth ? toIsoDate(endMonth) : null,
      gpa: gpa.trim() || null,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateEducation({ id: initialData.id, data: payload });
        toast.success("Cập nhật học vấn thành công!");
      } else {
        await createEducation(payload);
        toast.success("Thêm học vấn thành công!");
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
            {isEditing ? "Chỉnh sửa học vấn" : "Thêm thông tin học vấn"}
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
          {/* Tên trường */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Trường học / Cơ sở đào tạo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="VD: Đại học Bách Khoa - ĐHQG TP.HCM"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Ngành học */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Chuyên ngành / Ngành học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="VD: Khoa học máy tính / Công nghệ phần mềm"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Bắt đầu từ <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                required
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Đến tháng (Tốt nghiệp)
              </label>
              <input
                type="month"
                disabled={isStudying}
                value={isStudying ? "" : endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Checkbox đang học */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isStudyingCheck"
              checked={isStudying}
              onChange={(e) => {
                setIsStudying(e.target.checked);
                if (e.target.checked) setEndMonth("");
              }}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="isStudyingCheck"
              className="text-sm text-slate-700 cursor-pointer select-none font-medium"
            >
              Tôi hiện đang theo học tại đây
            </label>
          </div>

          {/* Điểm GPA */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Điểm trung bình (GPA) <span className="text-slate-400 font-normal">(Tuỳ chọn)</span>
            </label>
            <input
              type="text"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="VD: 3.6/4.0 hoặc 8.5/10"
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

