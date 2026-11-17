"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { EducationItem } from "@viecngon/types";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateDateOrder, validateRequiredText } from "@/lib/validation";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EducationItem | null;
}

interface EducationFormValues {
  schoolName: string;
  major: string;
  startMonth: string;
  endMonth: string;
  isStudying: boolean;
  gpa: string;
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

  const [values, setValues] = useState<EducationFormValues>({
    schoolName: initialData?.schoolName || "",
    major: initialData?.major || "",
    startMonth: toInputMonth(initialData?.startDate),
    endMonth: toInputMonth(initialData?.endDate),
    isStudying: isEditing ? !initialData?.endDate : false,
    gpa: initialData?.gpa || "",
  });

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<EducationFormValues>({
    fieldOrder: ["schoolName", "major", "startMonth", "endMonth", "gpa"],
    validators: {
      schoolName: (val) =>
        validateRequiredText(val, "tên trường học", { maxLength: 150 }),
      major: (val) =>
        validateRequiredText(val, "chuyên ngành học", { maxLength: 100 }),
      startMonth: (val) => (val ? "" : "Vui lòng chọn thời gian bắt đầu."),
      endMonth: (val, all) =>
        all.isStudying
          ? ""
          : validateDateOrder(
              all.startMonth,
              val,
              "Thời gian tốt nghiệp không được trước thời gian bắt đầu.",
            ),
      gpa: (val) =>
        val.trim().length > 10
          ? "Điểm GPA không được vượt quá 10 ký tự."
          : "",
    },
  });

  const updateField = <K extends keyof EducationFormValues>(
    field: K,
    nextVal: EducationFormValues[K],
  ) => {
    const next = { ...values, [field]: nextVal };
    if (field === "isStudying" && nextVal === true) {
      next.endMonth = "";
    }
    setValues(next);
    handleFieldChange(field, nextVal, next);
    if (field === "startMonth" || field === "isStudying") {
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
      schoolName: values.schoolName.trim(),
      major: values.major.trim(),
      startDate: toIsoDate(values.startMonth),
      endDate: values.isStudying
        ? null
        : values.endMonth
          ? toIsoDate(values.endMonth)
          : null,
      gpa: values.gpa.trim() || null,
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
      const applied = applyServerError(error, {
        fallbackMessage: "Có lỗi xảy ra, vui lòng thử lại.",
      });
      toast.error(applied.message);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? "Chỉnh sửa học vấn" : "Thêm thông tin học vấn"}
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
            <FormLabel htmlFor="schoolName" required>
              Trường học / Cơ sở đào tạo
            </FormLabel>
            <input
              id="schoolName"
              name="schoolName"
              type="text"
              value={values.schoolName}
              onChange={(e) => updateField("schoolName", e.target.value)}
              onBlur={() =>
                handleFieldBlur("schoolName", values.schoolName, values)
              }
              placeholder="VD: Đại học Bách Khoa - ĐHQG TP.HCM"
              className={getInputClassName({
                hasError: Boolean(errors.schoolName),
                className: "h-10",
              })}
              {...getFieldA11yProps("schoolName", errors.schoolName)}
            />
            <FieldError id="schoolName-error" message={errors.schoolName} />
          </div>

          <div>
            <FormLabel htmlFor="major" required>
              Chuyên ngành / Ngành học
            </FormLabel>
            <input
              id="major"
              name="major"
              type="text"
              value={values.major}
              onChange={(e) => updateField("major", e.target.value)}
              onBlur={() => handleFieldBlur("major", values.major, values)}
              placeholder="VD: Khoa học máy tính / Công nghệ phần mềm"
              className={getInputClassName({
                hasError: Boolean(errors.major),
                className: "h-10",
              })}
              {...getFieldA11yProps("major", errors.major)}
            />
            <FieldError id="major-error" message={errors.major} />
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
              <FormLabel htmlFor="endMonth">Đến tháng (Tốt nghiệp)</FormLabel>
              <input
                id="endMonth"
                name="endMonth"
                type="month"
                disabled={values.isStudying}
                value={values.isStudying ? "" : values.endMonth}
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
              id="isStudyingCheck"
              checked={values.isStudying}
              onChange={(e) => updateField("isStudying", e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="isStudyingCheck"
              className="text-sm text-slate-700 cursor-pointer select-none font-medium"
            >
              Tôi hiện đang theo học tại đây
            </label>
          </div>

          <div>
            <FormLabel htmlFor="gpa">
              Điểm trung bình (GPA){" "}
              <span className="text-slate-400 font-normal">(Tuỳ chọn)</span>
            </FormLabel>
            <input
              id="gpa"
              name="gpa"
              type="text"
              value={values.gpa}
              onChange={(e) => updateField("gpa", e.target.value)}
              onBlur={() => handleFieldBlur("gpa", values.gpa, values)}
              placeholder="VD: 3.6/4.0 hoặc 8.5/10"
              className={getInputClassName({
                hasError: Boolean(errors.gpa),
                className: "h-10",
              })}
              {...getFieldA11yProps("gpa", errors.gpa)}
            />
            <FieldError id="gpa-error" message={errors.gpa} />
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
