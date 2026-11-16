"use client";

import { useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
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

interface ForgotPasswordValues {
  email: string;
}

export default function ForgotPasswordForm() {
  const [values, setValues] = useState<ForgotPasswordValues>({ email: "" });

  const { errors, handleFieldBlur, handleFieldChange, validateAll } =
    useFormValidation<ForgotPasswordValues>({
      fieldOrder: ["email"],
      validators: {
        email: (val) => validateEmail(val, true),
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll(values)) return;

    toast.success(
      "Nếu email tồn tại trên hệ thống, hướng dẫn khôi phục sẽ được gửi tới hộp thư của bạn.",
    );
  };

  return (
    <div className="max-w-md mx-auto">
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

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

        <Button type="submit" size="lg" className="w-full">
          Gửi liên kết khôi phục
        </Button>
      </form>

      <div className="mt-8 p-4 bg-surface-muted border border-border-default rounded-xl text-sm text-center">
        <p className="text-text-secondary">Cần hỗ trợ thêm?</p>
        <a
          href="mailto:love@viecngon.vn"
          className="text-primary font-semibold hover:underline mt-1 inline-block"
        >
          Liên hệ love@viecngon.vn
        </a>
      </div>
    </div>
  );
}
