"use client";

import { useState } from "react";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
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

interface ForgotPasswordValues {
  email: string;
}

export default function ForgotPasswordForm() {
  const [values, setValues] = useState<ForgotPasswordValues>({ email: "" });
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
  } = useFormValidation<ForgotPasswordValues>({
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
        portal: "candidate",
      });
      setSubmittedEmail(cleanEmail);
      toast.success(
        res.message ||
          "Nếu email tồn tại trên hệ thống, hướng dẫn khôi phục sẽ được gửi tới hộp thư của bạn.",
      );
    } catch (err) {
      applyServerError(err, {
        fallbackMessage: "Không thể gửi yêu cầu khôi phục mật khẩu.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-8"
      >
        <FiArrowLeft size={16} /> Quay lại đăng nhập
      </Link>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Quên mật khẩu?
        </h1>
        <p className="text-text-muted text-sm leading-relaxed">
          Nhập địa chỉ email liên kết với tài khoản của bạn để nhận hướng dẫn
          đặt lại mật khẩu.
        </p>
      </div>

      {submittedEmail ? (
        <div
          className="rounded-2xl border border-success-border bg-success-light/60 p-6 space-y-4"
          data-testid="forgot-password-success"
        >
          <div className="flex items-start gap-3">
            <FiCheckCircle
              size={22}
              className="text-success-text shrink-0 mt-0.5"
            />
            <div className="space-y-1.5">
              <h2 className="font-bold text-text-primary text-base">
                Đã ghi nhận yêu cầu khôi phục
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Nếu email{" "}
                <strong className="text-text-primary">{submittedEmail}</strong>{" "}
                tồn tại trên hệ thống, chúng tôi đã gửi hướng dẫn tới hộp thư
                của bạn (liên kết có hiệu lực trong <strong>15 phút</strong>).
                Vui lòng kiểm tra thêm thư mục Spam / Quảng cáo.
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
              Gửi lại bằng email khác
            </Button>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Về trang đăng nhập
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormBannerError message={formError} />

          <div>
            <FormLabel htmlFor="email" required>
              Email của bạn
            </FormLabel>
            <div className="relative">
              <FiMail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                size={18}
              />
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
                placeholder="Ví dụ: cuong.le@gmail.com"
                className={getInputClassName({
                  hasError: Boolean(errors.email),
                  className: "pl-10 pr-4",
                })}
                {...getFieldA11yProps("email", errors.email)}
              />
            </div>
            <FieldError id="email-error" message={errors.email} />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isPending}
            loadingText="Đang gửi yêu cầu..."
          >
            Gửi liên kết khôi phục
          </Button>
        </form>
      )}

      <div className="mt-8 p-4 bg-surface-muted border border-border-default rounded-xl text-sm text-center">
        <p className="text-text-secondary">Cần hỗ trợ thêm?</p>
        <a
          href="mailto:support@viecngon.vn"
          className="text-primary font-semibold hover:underline"
        >
          Liên hệ support@viecngon.vn
        </a>
      </div>
    </div>
  );
}
