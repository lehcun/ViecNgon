"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";

export interface EmployerStep1Values {
  employerName: string;
  email: string;
  phone: string;
  title: string;
  password: string;
  confirmPassword: string;
}

interface EmployerRegisterStep1Props {
  values: EmployerStep1Values;
  errors: Partial<Record<keyof EmployerStep1Values, string>>;
  formError: string;
  onChange: (field: keyof EmployerStep1Values, value: string) => void;
  onBlur: (field: keyof EmployerStep1Values) => void;
  onNext: (e: React.FormEvent) => void;
}

export default function EmployerRegisterStep1({
  values,
  errors,
  formError,
  onChange,
  onBlur,
  onNext,
}: EmployerRegisterStep1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form onSubmit={onNext} noValidate className="space-y-4">
      <FormBannerError message={formError} />

      <div>
        <FormLabel htmlFor="employerName" required>
          Họ và tên người đại diện
        </FormLabel>
        <input
          id="employerName"
          name="employerName"
          type="text"
          autoComplete="name"
          placeholder="VD: Nguyễn Minh Quân"
          value={values.employerName}
          onChange={(e) => onChange("employerName", e.target.value)}
          onBlur={() => onBlur("employerName")}
          className={getInputClassName({
            hasError: Boolean(errors.employerName),
          })}
          {...getFieldA11yProps("employerName", errors.employerName)}
        />
        <FieldError id="employerName-error" message={errors.employerName} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="email" required>
            Email công ty
          </FormLabel>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="hr@company.com"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            className={getInputClassName({ hasError: Boolean(errors.email) })}
            {...getFieldA11yProps("email", errors.email)}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div>
          <FormLabel htmlFor="phone" required>
            Số điện thoại
          </FormLabel>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="0912 345 678"
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            onBlur={() => onBlur("phone")}
            className={getInputClassName({ hasError: Boolean(errors.phone) })}
            {...getFieldA11yProps("phone", errors.phone)}
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
      </div>

      <div>
        <FormLabel htmlFor="title" required>
          Chức vụ
        </FormLabel>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="VD: HR Manager, Talent Acquisition Lead"
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
          onBlur={() => onBlur("title")}
          className={getInputClassName({ hasError: Boolean(errors.title) })}
          {...getFieldA11yProps("title", errors.title)}
        />
        <FieldError id="title-error" message={errors.title} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="password" required>
            Mật khẩu
          </FormLabel>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Tối thiểu 6 ký tự"
              value={values.password}
              onChange={(e) => onChange("password", e.target.value)}
              onBlur={() => onBlur("password")}
              className={getInputClassName({
                hasError: Boolean(errors.password),
                className: "pr-11",
              })}
              {...getFieldA11yProps("password", errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError id="password-error" message={errors.password} />
        </div>

        <div>
          <FormLabel htmlFor="confirmPassword" required>
            Xác nhận mật khẩu
          </FormLabel>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={values.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              onBlur={() => onBlur("confirmPassword")}
              className={getInputClassName({
                hasError: Boolean(errors.confirmPassword),
                className: "pr-11",
              })}
              {...getFieldA11yProps("confirmPassword", errors.confirmPassword)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError
            id="confirmPassword-error"
            message={errors.confirmPassword}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-2">
        <span>Tiếp tục — Thông tin doanh nghiệp</span>
        <ArrowRight size={16} />
      </Button>

      <p className="text-center text-xs text-text-secondary pt-1">
        Doanh nghiệp đã có tài khoản?{" "}
        <Link
          href="/employer/login"
          className="font-semibold text-primary hover:underline"
        >
          Đăng nhập Nhà tuyển dụng
        </Link>
      </p>
    </form>
  );
}
