"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { CertificateItem } from "@viecngon/types";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateDateOrder, validateRequiredText } from "@/lib/validation";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CertificateItem | null;
}

interface CertificateFormValues {
  name: string;
  organization: string;
  issueMonth: string;
  expirationMonth: string;
  noExpiry: boolean;
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

export default function CertificateModal({
  isOpen,
  onClose,
  initialData,
}: CertificateModalProps) {
  const isEditing = !!initialData?.id;
  const {
    createCertificate,
    isCreatingCertificate,
    updateCertificate,
    isUpdatingCertificate,
  } = useManageCandidateItems();

  const isPending = isCreatingCertificate || isUpdatingCertificate;

  const [values, setValues] = useState<CertificateFormValues>({
    name: initialData?.name || "",
    organization: initialData?.organization || "",
    issueMonth: toInputMonth(initialData?.issueDate),
    expirationMonth: toInputMonth(initialData?.expirationDate),
    noExpiry: isEditing ? !initialData?.expirationDate : false,
  });

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<CertificateFormValues>({
    fieldOrder: ["name", "organization", "issueMonth", "expirationMonth"],
    validators: {
      name: (val) =>
        validateRequiredText(val, "tên chứng chỉ", { maxLength: 150 }),
      organization: (val) =>
        validateRequiredText(val, "tổ chức cấp", { maxLength: 150 }),
      issueMonth: (val) => (val ? "" : "Vui lòng chọn ngày cấp."),
      expirationMonth: (val, all) =>
        all.noExpiry
          ? ""
          : validateDateOrder(
              all.issueMonth,
              val,
              "Ngày hết hạn không được trước ngày cấp.",
            ),
    },
  });

  const updateField = <K extends keyof CertificateFormValues>(
    field: K,
    nextVal: CertificateFormValues[K],
  ) => {
    const next = { ...values, [field]: nextVal };
    if (field === "noExpiry" && nextVal === true) {
      next.expirationMonth = "";
    }
    setValues(next);
    handleFieldChange(field, nextVal, next);
    if (field === "issueMonth" || field === "noExpiry") {
      handleFieldChange("expirationMonth", next.expirationMonth, next);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(values)) {
      return;
    }

    const payload = {
      name: values.name.trim(),
      organization: values.organization.trim(),
      issueDate: toIsoDate(values.issueMonth),
      expirationDate: values.noExpiry
        ? null
        : values.expirationMonth
          ? toIsoDate(values.expirationMonth)
          : null,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateCertificate({ id: initialData.id, data: payload });
        toast.success("Cập nhật chứng chỉ thành công!");
      } else {
        await createCertificate(payload);
        toast.success("Thêm chứng chỉ thành công!");
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
            {isEditing ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới"}
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
            <FormLabel htmlFor="name" required>
              Tên chứng chỉ / Giải thưởng
            </FormLabel>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => handleFieldBlur("name", values.name, values)}
              placeholder="VD: AWS Certified Solutions Architect - Associate"
              className={getInputClassName({
                hasError: Boolean(errors.name),
                className: "h-10",
              })}
              {...getFieldA11yProps("name", errors.name)}
            />
            <FieldError id="name-error" message={errors.name} />
          </div>

          <div>
            <FormLabel htmlFor="organization" required>
              Tổ chức / Đơn vị cấp
            </FormLabel>
            <input
              id="organization"
              name="organization"
              type="text"
              value={values.organization}
              onChange={(e) => updateField("organization", e.target.value)}
              onBlur={() =>
                handleFieldBlur("organization", values.organization, values)
              }
              placeholder="VD: Amazon Web Services (AWS) hoặc Coursera"
              className={getInputClassName({
                hasError: Boolean(errors.organization),
                className: "h-10",
              })}
              {...getFieldA11yProps("organization", errors.organization)}
            />
            <FieldError id="organization-error" message={errors.organization} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="issueMonth" required>
                Ngày cấp
              </FormLabel>
              <input
                id="issueMonth"
                name="issueMonth"
                type="month"
                value={values.issueMonth}
                onChange={(e) => updateField("issueMonth", e.target.value)}
                onBlur={() =>
                  handleFieldBlur("issueMonth", values.issueMonth, values)
                }
                className={getInputClassName({
                  hasError: Boolean(errors.issueMonth),
                  className: "h-10",
                })}
                {...getFieldA11yProps("issueMonth", errors.issueMonth)}
              />
              <FieldError id="issueMonth-error" message={errors.issueMonth} />
            </div>

            <div>
              <FormLabel htmlFor="expirationMonth">Ngày hết hạn</FormLabel>
              <input
                id="expirationMonth"
                name="expirationMonth"
                type="month"
                disabled={values.noExpiry}
                value={values.noExpiry ? "" : values.expirationMonth}
                onChange={(e) => updateField("expirationMonth", e.target.value)}
                onBlur={() =>
                  handleFieldBlur(
                    "expirationMonth",
                    values.expirationMonth,
                    values,
                  )
                }
                className={getInputClassName({
                  hasError: Boolean(errors.expirationMonth),
                  className:
                    "h-10 disabled:bg-slate-100 disabled:cursor-not-allowed",
                })}
                {...getFieldA11yProps(
                  "expirationMonth",
                  errors.expirationMonth,
                )}
              />
              <FieldError
                id="expirationMonth-error"
                message={errors.expirationMonth}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noExpiryCheck"
              checked={values.noExpiry}
              onChange={(e) => updateField("noExpiry", e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="noExpiryCheck"
              className="text-sm text-slate-700 cursor-pointer select-none font-medium"
            >
              Chứng chỉ này vô thời hạn (không có ngày hết hạn)
            </label>
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
