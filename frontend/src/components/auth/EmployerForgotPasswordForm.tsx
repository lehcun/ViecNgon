"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { validateEmail } from "@/lib/validation";

interface EmployerForgotValues {
  email: string;
}

export default function EmployerForgotPasswordForm() {
  const [values, setValues] = useState<EmployerForgotValues>({ email: "" });
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { sendResetLink, isPending } = useForgotPassword();

  const {
    errors,
    formError,
    setFormError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<EmployerForgotValues>({
    fieldOrder: ["email"],
    validators: {
      email: (val) => validateEmail(val, true),
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validateAll(values)) return;

    const cleanEmail = values.email.trim();
    try {
      const res = await sendResetLink({
        email: cleanEmail,
        portal: "employer",
      });
      setSubmittedEmail(cleanEmail);
      toast.success(
        res.message ||
          "Yêu cầu đặt lại mật khẩu đã được ghi nhận. Vui lòng kiểm tra email doanh nghiệp.",
      );
    } catch (err) {
      applyServerError(err, {
        fallbackMessage: "Không thể gửi yêu cầu khôi phục mật khẩu.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-screen">
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-10">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">
              V
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              iecNgon
            </span>
          </div>
          <div className="h-4 w-px bg-border-default" />
          <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">
            Employer Portal
          </span>
        </div>

        <Link
          href="/employer/login"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mb-5"
        >
          <ChevronLeft size={16} /> Quay lại đăng nhập
        </Link>

        <h1 className="text-2xl font-bold text-text-primary">Quên mật khẩu</h1>
      </div>

      {submittedEmail ? (
        <div
          className="rounded-2xl border border-success-border bg-success-light/60 p-6 space-y-4"
          data-testid="employer-forgot-password-success"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={22}
              className="text-success-text shrink-0 mt-0.5"
            />
            <div className="space-y-1.5">
              <h2 className="font-bold text-text-primary text-base">
                Kiểm tra hộp thư doanh nghiệp
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Nếu tài khoản{" "}
                <strong className="text-text-primary">{submittedEmail}</strong>{" "}
                tồn tại trên hệ thống, liên kết đặt lại mật khẩu (hiệu lực{" "}
                <strong>15 phút</strong>) đã được gửi tới email của bạn.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSubmittedEmail(null)}
            >
              Thử email khác
            </Button>
            <Link
              href="/employer/login"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Về trang đăng nhập HR
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormBannerError message={formError} />

          <div>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => {
                const next = { email: e.target.value };
                setValues(next);
                handleFieldChange("email", e.target.value, next);
              }}
              onBlur={() => handleFieldBlur("email", values.email, values)}
              placeholder="Nhập email doanh nghiệp"
              className={getInputClassName({ hasError: Boolean(errors.email) })}
              {...getFieldA11yProps("email", errors.email)}
            />
            <FieldError id="email-error" message={errors.email} />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isPending}
            loadingText="Đang gửi yêu cầu..."
          >
            Đặt lại mật khẩu
          </Button>
        </form>
      )}
    </div>
  );
}
