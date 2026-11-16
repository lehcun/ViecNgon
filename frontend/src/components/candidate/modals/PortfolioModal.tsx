"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { PortfolioItem } from "@viecngon/types";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateRequiredText, validateUrl } from "@/lib/validation";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PortfolioItem | null;
}

interface PortfolioFormValues {
  title: string;
  projectUrl: string;
  description: string;
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

  const [values, setValues] = useState<PortfolioFormValues>({
    title: initialData?.title || "",
    projectUrl: initialData?.projectUrl || "",
    description: initialData?.description || "",
  });

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<PortfolioFormValues>({
    fieldOrder: ["title", "projectUrl"],
    validators: {
      title: (val) =>
        validateRequiredText(val, "tiêu đề dự án", { maxLength: 150 }),
      projectUrl: (val) =>
        validateUrl(val, {
          required: false,
          label: "đường dẫn dự án",
          maxLength: 255,
        }),
    },
  });

  const updateField = <K extends keyof PortfolioFormValues>(
    field: K,
    nextVal: string,
  ) => {
    const next = { ...values, [field]: nextVal };
    setValues(next);
    handleFieldChange(field, nextVal, next);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(values)) {
      return;
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      projectUrl: values.projectUrl.trim() || null,
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
      const applied = applyServerError(error, {
        fallbackMessage: "Có lỗi xảy ra, vui lòng thử lại.",
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
            {isEditing ? "Chỉnh sửa dự án" : "Thêm dự án nổi bật"}
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
            <FormLabel htmlFor="title" required>
              Tên dự án nổi bật
            </FormLabel>
            <input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => handleFieldBlur("title", values.title, values)}
              placeholder="VD: Nền tảng tuyển dụng ViecNgon"
              className={getInputClassName({
                hasError: Boolean(errors.title),
                className: "h-10",
              })}
              {...getFieldA11yProps("title", errors.title)}
            />
            <FieldError id="title-error" message={errors.title} />
          </div>

          <div>
            <FormLabel htmlFor="projectUrl">
              Đường dẫn dự án (Website / GitHub / Demo)
            </FormLabel>
            <input
              id="projectUrl"
              name="projectUrl"
              type="url"
              value={values.projectUrl}
              onChange={(e) => updateField("projectUrl", e.target.value)}
              onBlur={() =>
                handleFieldBlur("projectUrl", values.projectUrl, values)
              }
              placeholder="https://github.com/my-project hoặc https://myproject.com"
              className={getInputClassName({
                hasError: Boolean(errors.projectUrl),
                className: "h-10",
              })}
              {...getFieldA11yProps("projectUrl", errors.projectUrl)}
            />
            <FieldError id="projectUrl-error" message={errors.projectUrl} />
          </div>

          <div>
            <FormLabel htmlFor="description">
              Mô tả ngắn gọn về dự án, công nghệ sử dụng và vai trò của bạn
            </FormLabel>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="- Sử dụng Next.js, NestJS, Prisma ORM và SQL Server...&#10;- Xây dựng hệ thống tuyển dụng và tạo CV tự động..."
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
