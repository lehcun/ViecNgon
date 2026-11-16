"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateEmail } from "@/lib/validation";

interface EmployerForgotValues {
  email: string;
}

export default function EmployerForgotPasswordForm() {
  const [values, setValues] = useState<EmployerForgotValues>({ email: "" });

  const { errors, handleFieldBlur, handleFieldChange, validateAll } =
    useFormValidation<EmployerForgotValues>({
      fieldOrder: ["email"],
      validators: {
        email: (val) => validateEmail(val, true),
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll(values)) return;

    toast.success(
      "Yêu cầu đặt lại mật khẩu đã được ghi nhận. Vui lòng kiểm tra email doanh nghiệp.",
    );
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

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

        <Button type="submit" size="lg" className="w-full">
          Đặt lại mật khẩu
        </Button>
      </form>
    </div>
  );
}
