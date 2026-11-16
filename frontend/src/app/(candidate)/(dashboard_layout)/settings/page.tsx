"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateConfirmPassword, validatePassword } from "@/lib/validation";

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsTab() {
  const { user } = useAuthStore();
  const [isCvVisible, setIsCvVisible] = useState(true);

  const { mutate: changePassword, isPending } = useChangePassword();

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormValues>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isGoogleAccount =
    Boolean(
      (user as { provider?: string; googleId?: string } | null)?.provider ===
      "GOOGLE",
    ) || Boolean((user as { googleId?: string } | null)?.googleId);

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
    clearErrors,
  } = useFormValidation<PasswordFormValues>({
    fieldOrder: ["oldPassword", "newPassword", "confirmPassword"],
    validators: {
      oldPassword: (val) => (val ? "" : "Vui lòng nhập mật khẩu hiện tại."),
      newPassword: (val, all) => {
        const msg = validatePassword(val, {
          minLength: 8,
          label: "mật khẩu mới",
        });
        if (msg) return msg;
        if (all.oldPassword && val === all.oldPassword) {
          return "Mật khẩu mới phải khác mật khẩu hiện tại.";
        }
        return "";
      },
      confirmPassword: (val, all) =>
        validateConfirmPassword(all.newPassword, val, "xác nhận mật khẩu mới"),
    },
  });

  const updatePasswordField = (
    field: keyof PasswordFormValues,
    value: string,
  ) => {
    const next = { ...passwordForm, [field]: value };
    setPasswordForm(next);
    handleFieldChange(field, value, next);
    if (field === "newPassword" && next.confirmPassword) {
      handleFieldChange("confirmPassword", next.confirmPassword, next);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(passwordForm)) {
      return;
    }

    changePassword(
      {
        matKhauCu: passwordForm.oldPassword,
        matKhauMoi: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          clearErrors();
        },
        onError: (err) => {
          applyServerError(err, {
            fallbackMessage: "Đổi mật khẩu thất bại.",
            fieldAliases: {
              matKhauCu: "oldPassword",
              matKhauMoi: "newPassword",
            },
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-primary mb-5">
          Thông tin tài khoản
        </h2>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-border-default pb-4">
            <div className="text-sm font-semibold text-text-secondary">
              Email:
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-primary mb-1">
                {user?.email || "Chưa cập nhật"}
              </p>
              <p className="text-xs text-text-muted flex items-start gap-1.5">
                <Info size={15} className="text-primary shrink-0 mt-0.5" />
                Bạn không thể thay đổi email tài khoản.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-sm font-semibold text-text-secondary">
              Họ và tên:
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-primary mb-1">
                {user?.name || "Chưa cập nhật"}
              </p>
              <p className="text-xs text-text-muted flex items-start gap-1.5 mb-2">
                <Info size={15} className="text-primary shrink-0 mt-0.5" />
                Tên tài khoản được đồng bộ với thông tin hồ sơ của bạn.
              </p>
              <Link
                href="/cv-profile"
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 w-fit"
              >
                Cập nhật thông tin hồ sơ <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-primary mb-4">Mật khẩu</h2>

        {isGoogleAccount ? (
          <div className="bg-primary-light p-4 rounded-xl border border-primary/20">
            <p className="text-sm text-text-primary flex items-start gap-2">
              <Info size={17} className="text-primary shrink-0 mt-0.5" />
              <span>
                Bạn đã đăng nhập bằng <strong>Google</strong>, vì vậy tài khoản
                không dùng mật khẩu riêng. Hãy tiếp tục chọn Đăng nhập bằng
                Google ở các lần sau.
              </span>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handlePasswordChange}
            noValidate
            className="max-w-md space-y-4"
          >
            <FormBannerError message={formError} />

            <div>
              <FormLabel htmlFor="oldPassword" required>
                Mật khẩu hiện tại
              </FormLabel>
              <div className="relative">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type={showPassword.old ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    updatePasswordField("oldPassword", e.target.value)
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      "oldPassword",
                      passwordForm.oldPassword,
                      passwordForm,
                    )
                  }
                  className={getInputClassName({
                    hasError: Boolean(errors.oldPassword),
                    className: "h-10 px-3.5 pr-10",
                  })}
                  {...getFieldA11yProps("oldPassword", errors.oldPassword)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, old: !showPassword.old })
                  }
                  aria-label={
                    showPassword.old ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword.old ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <FieldError id="oldPassword-error" message={errors.oldPassword} />
            </div>

            <div>
              <FormLabel htmlFor="newPassword" required>
                Mật khẩu mới
              </FormLabel>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    updatePasswordField("newPassword", e.target.value)
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      "newPassword",
                      passwordForm.newPassword,
                      passwordForm,
                    )
                  }
                  className={getInputClassName({
                    hasError: Boolean(errors.newPassword),
                    className: "h-10 px-3.5 pr-10",
                  })}
                  {...getFieldA11yProps("newPassword", errors.newPassword)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, new: !showPassword.new })
                  }
                  aria-label={
                    showPassword.new ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword.new ? <EyeOff size={17} /> : <Eye size={17} />}
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
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    updatePasswordField("confirmPassword", e.target.value)
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      "confirmPassword",
                      passwordForm.confirmPassword,
                      passwordForm,
                    )
                  }
                  className={getInputClassName({
                    hasError: Boolean(errors.confirmPassword),
                    className: "h-10 px-3.5 pr-10",
                  })}
                  {...getFieldA11yProps(
                    "confirmPassword",
                    errors.confirmPassword,
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirm: !showPassword.confirm,
                    })
                  }
                  aria-label={
                    showPassword.confirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
              <FieldError
                id="confirmPassword-error"
                message={errors.confirmPassword}
              />
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              loadingText="Đang xử lý..."
              className="mt-2"
            >
              Đổi mật khẩu
            </Button>
          </form>
        )}
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Hiển thị CV của bạn
        </h2>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Cho phép các nhà tuyển dụng tìm thấy CV của bạn trên ViecNgon và
            liên hệ trao đổi cơ hội việc làm phù hợp.
          </p>

          <button
            type="button"
            onClick={() => setIsCvVisible(!isCvVisible)}
            className="flex items-center gap-3 shrink-0 focus:outline-none cursor-pointer"
          >
            <div
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
                isCvVisible
                  ? "bg-primary"
                  : "bg-surface-subtle border border-border-default"
              }`}
            >
              <div
                className={`absolute w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300 ${
                  isCvVisible ? "left-[26px]" : "left-1"
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-text-primary min-w-8 text-left">
              {isCvVisible ? "Bật" : "Tắt"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
