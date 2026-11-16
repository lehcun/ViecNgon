"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { ExperienceItem } from "@viecngon/types";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateDateOrder, validateRequiredText } from "@/lib/validation";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExperienceItem | null;
}

interface ExperienceFormValues {
  position: string;
  companyName: string;
  startMonth: string;
  endMonth: string;
  isCurrent: boolean;
  description: string;
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

  const [values, setValues] = useState<ExperienceFormValues>({
    position: initialData?.position || "",
    companyName: initialData?.companyName || "",
    startMonth: toInputMonth(initialData?.startDate),
    endMonth: toInputMonth(initialData?.endDate),
    isCurrent: isEditing ? !initialData?.endDate : false,
    description: initialData?.description || "",
  });

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<ExperienceFormValues>({
    fieldOrder: ["position", "companyName", "startMonth", "endMonth"],
    validators: {
      position: (val) =>
        validateRequiredText(val, "vị trí công việc", { maxLength: 100 }),
      companyName: (val) =>
        validateRequiredText(val, "tên công ty", { maxLength: 150 }),
      startMonth: (val) => (val ? "" : "Vui lòng chọn thời gian bắt đầu."),
      endMonth: (val, all) =>
        all.isCurrent
          ? ""
          : validateDateOrder(
              all.startMonth,
              val,
              "Thời gian kết thúc không được trước thời gian bắt đầu.",
            ),
    },
  });

  const updateField = <K extends keyof ExperienceFormValues>(
    field: K,
    nextVal: ExperienceFormValues[K],
  ) => {
    const next = { ...values, [field]: nextVal };
    if (field === "isCurrent" && nextVal === true) {
      next.endMonth = "";
    }
    setValues(next);
    handleFieldChange(field, nextVal, next);
    if (field === "startMonth" || field === "isCurrent") {
      handleFieldChange("endMonth", next.endMonth, next);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(values)) {
      return;
    }

    const payload = {
      position: values.position.trim(),
      companyName: values.companyName.trim(),
      startDate: toIsoDate(values.startMonth),
      endDate: values.isCurrent
        ? null
        : values.endMonth
          ? toIsoDate(values.endMonth)
          : null,
      description: values.description.trim() || null,
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
      const applied = applyServerError(error, {
        fallbackMessage: "Có lỗi xảy ra, vui lòng thử lại.",
        fieldAliases: {
          viTri: "position",
          tenCongTy: "companyName",
          ngayBatDau: "startMonth",
          ngayKetThuc: "endMonth",
        },
      });
      toast.error(applied.message);
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
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5"
        >
          <FormBannerError message={formError} />

          <div>
            <FormLabel htmlFor="position" required>
              Vị trí / Chức danh
            </FormLabel>
            <input
              id="position"
              name="position"
              type="text"
              value={values.position}
              onChange={(e) => updateField("position", e.target.value)}
              onBlur={() =>
                handleFieldBlur("position", values.position, values)
              }
              placeholder="VD: Senior Frontend Developer"
              className={getInputClassName({
                hasError: Boolean(errors.position),
                className: "h-10",
              })}
              {...getFieldA11yProps("position", errors.position)}
            />
            <FieldError id="position-error" message={errors.position} />
          </div>

          <div>
            <FormLabel htmlFor="companyName" required>
              Tên công ty / Doanh nghiệp
            </FormLabel>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={values.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              onBlur={() =>
                handleFieldBlur("companyName", values.companyName, values)
              }
              placeholder="VD: VNG Corporation"
              className={getInputClassName({
                hasError: Boolean(errors.companyName),
                className: "h-10",
              })}
              {...getFieldA11yProps("companyName", errors.companyName)}
            />
            <FieldError id="companyName-error" message={errors.companyName} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="startMonth" required>
                Bắt đầu từ
              </FormLabel>
              <input
                id="startMonth"
                name="startMonth"
                type="month"
                value={values.startMonth}
                onChange={(e) => updateField("startMonth", e.target.value)}
                onBlur={() =>
                  handleFieldBlur("startMonth", values.startMonth, values)
                }
                className={getInputClassName({
                  hasError: Boolean(errors.startMonth),
                  className: "h-10",
                })}
                {...getFieldA11yProps("startMonth", errors.startMonth)}
              />
              <FieldError id="startMonth-error" message={errors.startMonth} />
            </div>

            <div>
              <FormLabel htmlFor="endMonth">Đến tháng</FormLabel>
              <input
                id="endMonth"
                name="endMonth"
                type="month"
                disabled={values.isCurrent}
                value={values.isCurrent ? "" : values.endMonth}
                onChange={(e) => updateField("endMonth", e.target.value)}
                onBlur={() =>
                  handleFieldBlur("endMonth", values.endMonth, values)
                }
                className={getInputClassName({
                  hasError: Boolean(errors.endMonth),
                  className:
                    "h-10 disabled:bg-slate-100 disabled:cursor-not-allowed",
                })}
                {...getFieldA11yProps("endMonth", errors.endMonth)}
              />
              <FieldError id="endMonth-error" message={errors.endMonth} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrentWork"
              checked={values.isCurrent}
              onChange={(e) => updateField("isCurrent", e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="isCurrentWork"
              className="text-sm text-slate-700 cursor-pointer select-none font-medium"
            >
              Tôi hiện đang làm việc tại đây
            </label>
          </div>

          <div>
            <FormLabel htmlFor="description">
              Mô tả chi tiết công việc, dự án hoặc thành tích đạt được
            </FormLabel>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="- Phụ trách phát triển tính năng web...&#10;- Tối ưu hiệu suất và tốc độ tải trang..."
              className="w-full px-4 py-2.5 text-sm border border-border-default rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
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
