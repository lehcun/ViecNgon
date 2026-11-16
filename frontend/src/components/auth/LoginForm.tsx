"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";
import GoogleButton from "@/components/auth/GoogleButton";
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
  parseApiError,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  const router = useRouter();
  const { login, isPending } = useLogin();

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
    setFieldError,
  } = useFormValidation<LoginValues>({
    fieldOrder: ["email", "password"],
    validators: {
      email: (val) => validateEmail(val, true),
      password: (val) => validatePassword(val, { minLength: 6 }),
    },
  });

  const handleChange = (field: keyof LoginValues, nextVal: string) => {
    const nextValues = { ...values, [field]: nextVal };
    setValues(nextValues);
    if (field === "email") {
      setIsGoogleAccount(false);
    }
    handleFieldChange(field, nextVal, nextValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGoogleAccount(false);

    if (!validateAll(values)) {
      return;
    }

    try {
      const data = await login({
        email: values.email.trim(),
        password: values.password,
      });
      toast.success("Đăng nhập thành công!");
      if (data?.user?.role === "NHATUYENDUNG") {
        router.push("/employer-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const { message } = parseApiError(err, "Đăng nhập thất bại!");

      if (
        message.includes("này đã được dùng để đăng ký bằng google") ||
        message.includes("liên kết với Google")
      ) {
        setIsGoogleAccount(true);
        setFieldError(
          "email",
          "Tài khoản này đã được tạo bằng Google. Vui lòng bấm 'Đăng nhập với Google' ở phía trên.",
        );
        toast.error("Tài khoản Google! Vui lòng chọn đăng nhập bằng Google.");
        return;
      }

      const applied = applyServerError(err, {
        fallbackMessage: "Đăng nhập thất bại!",
      });
      toast.error(applied.message);
    }
  };

  const showRegisterHint =
    Boolean(errors.email) &&
    (errors.email.includes("chưa tồn tại") ||
      errors.email.includes("chưa được đăng ký"));

  return (
    <div className="w-full max-w-md mx-auto flex flex-col font-sans">
      <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-3 tracking-tight">
        Chào mừng đến với <span className="text-primary">ViecNgon</span>
      </h1>
      <p className="text-sm text-text-muted mb-7 leading-relaxed">
        Đăng nhập để khám phá hàng nghìn việc làm IT chất lượng và trải nghiệm
        AI Match Score.
      </p>

      {isGoogleAccount && (
        <div className="mb-5 p-4 bg-primary-light border border-primary/25 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="text-xs text-text-primary leading-relaxed">
            <p className="font-bold text-primary text-sm mb-1">
              Phát hiện tài khoản Google
            </p>
            Email <strong>{values.email}</strong> được đăng ký thông qua Google
            OAuth. Vui lòng nhấn nút{" "}
            <strong>&quot;Đăng nhập với Google&quot;</strong> ngay bên dưới để
            tiếp tục.
          </div>
        </div>
      )}

      <div
        className={`transition-all duration-200 rounded-xl ${
          isGoogleAccount ? "ring-4 ring-primary/20" : ""
        }`}
      >
        <GoogleButton mode="login" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-border-default flex-1" />
        <span className="text-xs text-text-muted font-medium px-2 uppercase">
          hoặc
        </span>
        <div className="h-px bg-border-default flex-1" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleFieldBlur("email", values.email, values)}
            placeholder="Nhập địa chỉ email"
            className={getInputClassName({ hasError: Boolean(errors.email) })}
            {...getFieldA11yProps("email", errors.email)}
          />
          <FieldError id="email-error" message={errors.email} />
          {showRegisterHint && (
            <Link
              href="/register"
              className="inline-block mt-1 text-xs font-semibold text-primary hover:underline"
            >
              Bấm vào đây để đăng ký tài khoản ngay
            </Link>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <FormLabel htmlFor="password" required className="mb-0">
              Mật khẩu
            </FormLabel>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
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
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleFieldBlur("password", values.password, values)}
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
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          loadingText="Đang kiểm tra..."
          className="w-full mt-1"
        >
          Đăng nhập bằng email
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-7">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
