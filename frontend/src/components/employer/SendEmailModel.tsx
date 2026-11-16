"use client";

import React, { useState } from "react";
import { X, Send, Loader2, Mail } from "lucide-react";
import { useSendEmail } from "@/hooks/recruiter/useSendEmail";
import toast from "react-hot-toast";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateRequiredText } from "@/lib/validation";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateEmail: string;
  jobTitle: string;
  applicationId: string;
}

interface SendEmailValues {
  subject: string;
  content: string;
}

interface SendEmailFormProps {
  onClose: () => void;
  candidateEmail: string;
  jobTitle: string;
  applicationId: string;
  isPending: boolean;
  onSend: (
    payload: { applicationId: string; subject: string; content: string },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void },
  ) => void;
}

function SendEmailForm({
  onClose,
  candidateEmail,
  jobTitle,
  applicationId,
  isPending,
  onSend,
}: SendEmailFormProps) {
  const [values, setValues] = useState<SendEmailValues>({
    subject: `[ViecNgon] - Trao đổi về vị trí ${jobTitle || ""}`,
    content: "",
  });

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<SendEmailValues>({
    fieldOrder: ["subject", "content"],
    validators: {
      subject: (val) =>
        validateRequiredText(val, "tiêu đề email", { maxLength: 200 }),
      content: (val) => validateRequiredText(val, "nội dung email"),
    },
  });

  const updateField = (field: keyof SendEmailValues, nextVal: string) => {
    const next = { ...values, [field]: nextVal };
    setValues(next);
    handleFieldChange(field, nextVal, next);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll(values)) {
      return;
    }

    onSend(
      {
        applicationId,
        subject: values.subject.trim(),
        content: values.content.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Đã gửi email thành công tới ứng viên!");
          onClose();
        },
        onError: (error: Error) => {
          const applied = applyServerError(error, {
            fallbackMessage: "Không thể gửi email. Vui lòng thử lại.",
          });
          toast.error(applied.message);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSend}
      noValidate
      className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          Gửi Email cho Ứng viên
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <FormBannerError message={formError} />

        <div>
          <span className="block text-xs font-semibold text-slate-500 mb-1">
            Người nhận (To)
          </span>
          <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
            {candidateEmail || "Chưa có email"}
          </div>
        </div>

        <div>
          <FormLabel htmlFor="subject" required>
            Tiêu đề (Subject)
          </FormLabel>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            onBlur={() => handleFieldBlur("subject", values.subject, values)}
            className={getInputClassName({
              hasError: Boolean(errors.subject),
              className: "h-10",
            })}
            {...getFieldA11yProps("subject", errors.subject)}
          />
          <FieldError id="subject-error" message={errors.subject} />
        </div>

        <div>
          <FormLabel htmlFor="content" required>
            Nội dung Email
          </FormLabel>
          <textarea
            id="content"
            name="content"
            rows={8}
            value={values.content}
            onChange={(e) => updateField("content", e.target.value)}
            onBlur={() => handleFieldBlur("content", values.content, values)}
            placeholder="Xin chào bạn, chúng tôi nhận thấy hồ sơ của bạn rất ấn tượng..."
            className={getInputClassName({
              hasError: Boolean(errors.content),
              className: "h-auto p-4 resize-none",
            })}
            {...getFieldA11yProps("content", errors.content)}
          />
          <FieldError id="content-error" message={errors.content} />
          <p className="text-[11px] text-slate-400 mt-1 italic">
            Email sẽ được gửi trực tiếp từ hệ thống nội bộ của ViecNgon.
          </p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {isPending ? "Đang gửi..." : "Gửi Email"}
        </button>
      </div>
    </form>
  );
}

export default function SendEmailModal({
  isOpen,
  onClose,
  candidateEmail,
  jobTitle,
  applicationId,
}: SendEmailModalProps) {
  const { mutate: sendEmail, isPending } = useSendEmail();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <SendEmailForm
        key={`${applicationId}-${jobTitle}`}
        onClose={onClose}
        candidateEmail={candidateEmail}
        jobTitle={jobTitle}
        applicationId={applicationId}
        isPending={isPending}
        onSend={sendEmail}
      />
    </div>
  );
}
