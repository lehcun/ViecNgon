"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";
import { useLogout } from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateEmail, validatePassword } from "@/lib/validation";

interface EmployerLoginValues {
  email: string;
  password: string;
}

export default function EmployerLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<EmployerLoginValues>({
    email: "",
    password: "",
  });

  const router = useRouter();
  const { login, isPending } = useLogin();
  const { mutate: silentLogout } = useLogout({ redirectTo: false });

  const {
    errors,
    formError,
    setFormError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<EmployerLoginValues>({
    fieldOrder: ["email", "password"],
    validators: {
      email: (val) => validateEmail(val, true),
      password: (val) => validatePassword(val, { minLength: 6 }),
    },
  });

  const handleChange = (field: keyof EmployerLoginValues, nextVal: string) => {
    const nextValues = { ...values, [field]: nextVal };
    setValues(nextValues);
    handleFieldChange(field, nextVal, nextValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(values)) {
      return;
    }

    try {
      const data = await login({
        email: values.email.trim(),
        password: values.password,
      });

      if (data.user.role !== "NHATUYENDUNG") {
        setFormError(
          "Tài khoản này không có quyền truy cập cổng Nhà tuyển dụng!",
        );
        silentLogout();
        return;
      }

      if (data.user.status === "CHUAKICHHOAT") {
        toast(
          "Tài khoản Nhà tuyển dụng của bạn đang chờ Quản trị viên kích hoạt.",
          { icon: "⏳", duration: 5000 },
        );
        router.push("/");
        return;
      }

      toast.success("Đăng nhập Nhà tuyển dụng thành công!");
      router.push("/employer-dashboard");
    } catch (err) {
      applyServerError(err, { fallbackMessage: "Đăng nhập thất bại." });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-text-primary">
          Đăng nhập Nhà tuyển dụng
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Quản lý tin tuyển dụng IT và sàng lọc ứng viên bằng AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormBannerError message={formError} />

        <div>
          <FormLabel htmlFor="email" required>
            Email doanh nghiệp
          </FormLabel>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="hr@company.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleFieldBlur("email", values.email, values)}
            className={getInputClassName({ hasError: Boolean(errors.email) })}
            {...getFieldA11yProps("email", errors.email)}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FormLabel htmlFor="password" required className="mb-0">
              Mật khẩu
            </FormLabel>
            <Link
              href="/employer/forgot-password"
              className="text-xs text-primary font-semibold hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleFieldBlur("password", values.password, values)}
              className={getInputClassName({
                hasError: Boolean(errors.password),
                className: "pr-12",
              })}
              {...getFieldA11yProps("password", errors.password)}
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          <FieldError id="password-error" message={errors.password} />
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border-default text-primary focus:ring-primary"
            />
            <span className="text-text-secondary text-sm">
              Ghi nhớ đăng nhập
            </span>
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          loadingText="Đang xác thực..."
          className="w-full mt-2"
        >
          Đăng nhập hệ thống
        </Button>

        <p className="text-center text-sm text-text-secondary pt-2">
          Doanh nghiệp chưa có tài khoản?{" "}
          <Link
            href="/employer"
            className="font-semibold text-primary hover:underline"
          >
            Đăng ký Nhà tuyển dụng
          </Link>
        </p>
      </form>

      <div className="mt-10 pt-6 border-t border-border-default text-xs text-text-muted space-y-1.5">
        <p className="font-semibold text-text-secondary mb-2">
          Hỗ trợ doanh nghiệp:
        </p>
        <p>Hotline TP.HCM / Hà Nội / Đà Nẵng: 1900 6868</p>
        <p>Email hỗ trợ: love@viecngon.vn</p>
      </div>
    </div>
  );
}
