"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import LogoViecNgon from "@/components/LogoViecNgon";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/store/authStore";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateEmail, validatePassword } from "@/lib/validation";

interface AdminLoginValues {
  email: string;
  password: string;
}

export default function AdminLoginForm() {
  const [values, setValues] = useState<AdminLoginValues>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const { login, isPending } = useLogin();
  const { clearAuth } = useAuthStore();

  const {
    errors,
    formError,
    setFormError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<AdminLoginValues>({
    fieldOrder: ["email", "password"],
    validators: {
      email: (val) => validateEmail(val, true),
      password: (val) => validatePassword(val, { minLength: 6 }),
    },
  });

  const handleChange = (field: keyof AdminLoginValues, nextVal: string) => {
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

      if (data?.user?.role !== "ADMIN") {
        clearAuth();
        setFormError(
          "Tài khoản này không có quyền truy cập cổng Quản trị viên (ADMIN)!",
        );
        toast.error("Từ chối truy cập: Bạn không phải Quản trị viên!");
        return;
      }

      toast.success("Đăng nhập Quản trị viên thành công!");
      router.replace(callbackUrl);
    } catch (err) {
      const applied = applyServerError(err, {
        fallbackMessage:
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
      });
      toast.error(applied.message);
    }
  };

  return (
    <div className="bg-primary-dark/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-7 md:p-8 shadow-2xl shadow-black/60">
      <div className="flex flex-col items-center text-center mb-7">
        <div className="mb-3">
          <LogoViecNgon
            logoTextColor="text-white"
            role="admin"
            href="/"
          />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Cổng Quản Trị Hệ Thống
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Đăng nhập bằng tài khoản Quản trị viên (Super Admin)
        </p>
      </div>

      <FormBannerError message={formError} tone="dark" className="mb-5" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <FormLabel htmlFor="email" tone="dark" required>
            Email Quản trị
          </FormLabel>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleFieldBlur("email", values.email, values)}
              placeholder="admin@viecngon.vn"
              className={getInputClassName({
                tone: "dark",
                hasError: Boolean(errors.email),
                className: "pl-10 pr-4",
              })}
              {...getFieldA11yProps("email", errors.email)}
            />
          </div>
          <FieldError id="email-error" tone="dark" message={errors.email} />
        </div>

        <div>
          <FormLabel htmlFor="password" tone="dark" required>
            Mật khẩu
          </FormLabel>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleFieldBlur("password", values.password, values)}
              placeholder="••••••••"
              className={getInputClassName({
                tone: "dark",
                hasError: Boolean(errors.password),
                className: "pl-10 pr-11",
              })}
              {...getFieldA11yProps("password", errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError
            id="password-error"
            tone="dark"
            message={errors.password}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 mt-2 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Đang xác thực quyền...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Đăng nhập Quản trị viên</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Quay lại trang chủ ViecNgon</span>
        </Link>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Khu vực bảo mật nội bộ. Mọi hoạt động truy cập đều được ghi nhật ký.
        </p>
      </div>
    </div>
  );
}
