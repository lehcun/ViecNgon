"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { validateConfirmPassword, validatePassword } from "@/lib/validation";

interface ResetPasswordFormProps {
  portal: "candidate" | "employer";
}

interface ResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordForm({ portal }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";

  const [values, setValues] = useState<ResetPasswordValues>({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { resetPassword, isPending } = useResetPassword();

  const loginHref = portal === "employer" ? "/employer/login" : "/login";
  const forgotHref =
    portal === "employer" ? "/employer/forgot-password" : "/forgot-password";

  const {
    errors,
    formError,
    setFormError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<ResetPasswordValues>({
    fieldOrder: ["newPassword", "confirmPassword"],
    validators: {
      newPassword: (val) => validatePassword(val, { minLength: 8 }),
      confirmPassword: (val, all) =>
        validateConfirmPassword(val, all.newPassword),
    },
  });

  const handleChange = (field: keyof ResetPasswordValues, nextVal: string) => {
    const nextValues = { ...values, [field]: nextVal };
    setValues(nextValues);
    handleFieldChange(field, nextVal, nextValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!token) {
      setFormError("Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu mã.");
      return;
    }
    if (!validateAll(values)) return;

    try {
      const res = await resetPassword({
        token,
        newPassword: values.newPassword,
      });
      toast.success(res.message || "Đặt lại mật khẩu thành công!");
      setIsCompleted(true);
      setTimeout(() => {
        router.push(loginHref);
      }, 1500);
    } catch (err) {
      applyServerError(err, {
        fallbackMessage:
          "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {portal === "employer" && (
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-8">
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
      )}

      <div className="mb-7 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-light text-primary mb-4">
          <Lock size={20} />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Đặt lại mật khẩu mới
        </h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Nhập mật khẩu mới tối thiểu 8 ký tự cho tài khoản{" "}
          {portal === "employer" ? "Nhà tuyển dụng" : "Ứng viên"} của bạn.
        </p>
      </div>

      {!token ? (
        <div
          className="rounded-2xl border border-warning-border bg-warning-light/60 p-6 space-y-4"
          data-testid="reset-password-missing-token"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={22}
              className="text-warning-text shrink-0 mt-0.5"
            />
            <div className="space-y-1.5">
              <h2 className="font-bold text-text-primary text-base">
                Liên kết không hợp lệ hoặc thiếu mã khôi phục
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Vui lòng yêu cầu gửi lại liên kết đặt lại mật khẩu mới qua email.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={forgotHref}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
            >
              Gửi lại yêu cầu mới
            </Link>
            <Link
              href={loginHref}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      ) : isCompleted ? (
        <div
          className="rounded-2xl border border-success-border bg-success-light/60 p-6 space-y-4"
          data-testid="reset-password-success"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={22}
              className="text-success-text shrink-0 mt-0.5"
            />
            <div className="space-y-1.5">
              <h2 className="font-bold text-text-primary text-base">
                Đặt lại mật khẩu thành công!
              </h2>
              <p className="text-sm text-text-secondary">
                Đang chuyển bạn về trang đăng nhập để sử dụng mật khẩu mới...
              </p>
            </div>
          </div>
          <Link
            href={loginHref}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormBannerError message={formError} />

          <div>
            <FormLabel htmlFor="newPassword" required>
              Mật khẩu mới
            </FormLabel>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                value={values.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                onBlur={() =>
                  handleFieldBlur("newPassword", values.newPassword, values)
                }
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                className={getInputClassName({
                  hasError: Boolean(errors.newPassword),
                  className: "pr-11",
                })}
                {...getFieldA11yProps("newPassword", errors.newPassword)}
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                aria-label={showNew ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
              >
                {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <FieldError id="newPassword-error" message={errors.newPassword} />
          </div>

          <div>
            <FormLabel htmlFor="confirmPassword" required>
              Xác nhận mật khẩu mới
            </FormLabel>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() =>
                  handleFieldBlur(
                    "confirmPassword",
                    values.confirmPassword,
                    values,
                  )
                }
                placeholder="Nhập lại mật khẩu mới"
                className={getInputClassName({
                  hasError: Boolean(errors.confirmPassword),
                  className: "pr-11",
                })}
                {...getFieldA11yProps(
                  "confirmPassword",
                  errors.confirmPassword,
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                aria-label={
                  showConfirm ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"
                }
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <FieldError
              id="confirmPassword-error"
              message={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isPending}
            loadingText="Đang cập nhật mật khẩu..."
          >
            Xác nhận đặt lại mật khẩu
          </Button>

          <div className="text-center pt-1">
            <Link
              href={forgotHref}
              className="text-xs font-semibold text-text-muted hover:text-primary hover:underline"
            >
              Liên kết hết hạn? Gửi lại email khôi phục
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
