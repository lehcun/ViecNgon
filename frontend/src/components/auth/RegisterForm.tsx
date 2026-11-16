"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSignup } from "@/hooks/auth/useSignUp";
import GoogleButton from "./GoogleButton";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  getPasswordCriteria,
  validateEmail,
  validatePassword,
  validateRequiredText,
} from "@/lib/validation";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  emailTerms: boolean;
}

export default function RegisterForm() {
  const router = useRouter();
  const signupMutation = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<RegisterValues>({
    name: "",
    email: "",
    password: "",
    emailTerms: false,
  });

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<RegisterValues>({
    fieldOrder: ["name", "email", "password", "emailTerms"],
    validators: {
      name: (val) =>
        validateRequiredText(val, "họ và tên", {
          minLength: 2,
          maxLength: 100,
        }),
      email: (val) => validateEmail(val, true),
      password: (val) =>
        validatePassword(val, { minLength: 8, strong: true }),
      emailTerms: (checked) =>
        checked
          ? ""
          : "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.",
    },
  });

  const updateField = <K extends keyof RegisterValues>(
    field: K,
    nextVal: RegisterValues[K],
  ) => {
    const nextValues = { ...values, [field]: nextVal };
    setValues(nextValues);
    handleFieldChange(field, nextVal, nextValues);
  };

  const validations = getPasswordCriteria(values.password);

  const validationItems = [
    { key: "length", ok: validations.length, label: "Ít nhất 8 ký tự" },
    {
      key: "symbol",
      ok: validations.symbol,
      label: "Ít nhất 1 ký tự đặc biệt (! @ # $ ...)",
    },
    { key: "number", ok: validations.number, label: "Ít nhất 1 chữ số" },
    { key: "upper", ok: validations.upper, label: "Ít nhất 1 chữ IN HOA" },
    { key: "lower", ok: validations.lower, label: "Ít nhất 1 chữ thường" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(values)) {
      return;
    }

    signupMutation.mutate(
      {
        name: values.name.trim(),
        hoTen: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "UNGVIEN",
      },
      {
        onSuccess: (res) => {
          const displayName = res?.user?.name || values.name.trim();
          toast.success(`Đăng ký thành công! Chào mừng ${displayName}`);
          router.push("/dashboard");
        },
        onError: (error) => {
          applyServerError(error, {
            fallbackMessage: "Đăng ký thất bại. Vui lòng thử lại!",
            fieldAliases: { hoTen: "name" },
          });
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col font-sans">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg font-bold text-text-secondary tracking-tight">
          Chào mừng đến với
        </span>
        <span className="text-xl font-extrabold text-primary">ViecNgon</span>
      </div>
      <h1 className="text-3xl font-extrabold text-text-primary mb-6">
        Đăng ký tài khoản
      </h1>

      <GoogleButton mode="register" />

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-border-default flex-1" />
        <span className="text-xs text-text-muted font-medium px-2 uppercase">
          hoặc
        </span>
        <div className="h-px bg-border-default flex-1" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormBannerError message={formError} />

        <div>
          <FormLabel htmlFor="name" required>
            Họ và tên
          </FormLabel>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => handleFieldBlur("name", values.name, values)}
            placeholder="Nhập họ và tên"
            className={getInputClassName({ hasError: Boolean(errors.name) })}
            {...getFieldA11yProps("name", errors.name)}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div>
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => handleFieldBlur("email", values.email, values)}
            placeholder="Nhập địa chỉ email"
            className={getInputClassName({ hasError: Boolean(errors.email) })}
            {...getFieldA11yProps("email", errors.email)}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div>
          <FormLabel htmlFor="password" required>
            Mật khẩu
          </FormLabel>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => updateField("password", e.target.value)}
              onBlur={() =>
                handleFieldBlur("password", values.password, values)
              }
              placeholder="Nhập mật khẩu"
              className={getInputClassName({
                hasError: Boolean(errors.password),
                className: "pr-12",
              })}
              {...getFieldA11yProps("password", errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          <FieldError id="password-error" message={errors.password} />

          <ul className="text-xs space-y-1.5 mt-3">
            {validationItems.map((item) => (
              <li
                key={item.key}
                className={`flex items-center gap-2 ${
                  item.ok ? "text-success-text font-medium" : "text-text-muted"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full border shrink-0 ${
                    item.ok
                      ? "border-success bg-success"
                      : "border-border-default"
                  }`}
                />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-start gap-3 mt-1">
            <input
              type="checkbox"
              id="emailTerms"
              name="emailTerms"
              checked={values.emailTerms}
              onChange={(e) => updateField("emailTerms", e.target.checked)}
              className={`mt-1 w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer ${
                errors.emailTerms ? "border-danger" : "border-border-default"
              }`}
              {...getFieldA11yProps("emailTerms", errors.emailTerms)}
            />
            <label
              htmlFor="emailTerms"
              className="text-xs sm:text-sm text-text-secondary leading-relaxed cursor-pointer"
            >
              Tôi đã đọc và đồng ý với điều khoản sử dụng và chính sách bảo mật
              của ViecNgon.
            </label>
          </div>
          <FieldError id="emailTerms-error" message={errors.emailTerms} />
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={signupMutation.isPending}
          loadingText="Đang xử lý..."
          className="w-full mt-2"
        >
          Đăng ký bằng email
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-text-secondary">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
