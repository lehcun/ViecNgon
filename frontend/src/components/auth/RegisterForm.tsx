"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSignup } from "@/hooks/auth/useSignUp";
import { RegisterResponse } from "@viecngon/types";
import GoogleButton from "./GoogleButton";
import { Button } from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const signupMutation = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "UNGVIEN" as "UNGVIEN" | "NHATUYENDUNG",
  });

  const [emailTerms, setEmailTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const pwd = formData.password;
  const validations = {
    length: pwd.length >= 8,
    symbol: /[@$!%*?&#]/.test(pwd),
    number: /\d/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
  };
  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg("Mật khẩu chưa thỏa mãn tất cả các điều kiện bảo mật.");
      return;
    }

    if (!emailTerms) {
      setErrorMsg("Bạn cần đồng ý với Điều khoản dịch vụ để tiếp tục.");
      return;
    }

    signupMutation.mutate(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: (data: RegisterResponse["user"]) => {
          toast.success(`Đăng ký thành công! Chào mừng ${data.name}`);
          router.push("/dashboard");
        },
        onError: (error) => {
          setErrorMsg(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
        },
      },
    );
  };

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

  return (
    <div className="w-full max-w-md mx-auto flex flex-col font-sans">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg font-bold text-text-secondary tracking-tight">
          Chào mừng đến với
        </span>
        <span className="text-xl font-extrabold text-primary">ViecNgon</span>
      </div>
      <h1 className="text-3xl font-extrabold text-text-main mb-6">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 bg-danger-soft text-danger-text text-sm rounded-lg flex items-center gap-2 border border-danger-border">
            <FiAlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-text-main mb-1.5"
          >
            Họ và tên <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full h-11 border border-border-default rounded-lg px-4 text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all placeholder:text-text-subtle bg-surface-card"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-text-main mb-1.5"
          >
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập địa chỉ email"
            className="w-full h-11 border border-border-default rounded-lg px-4 text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all placeholder:text-text-subtle bg-surface-card"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-text-main mb-1.5"
          >
            Mật khẩu <span className="text-danger">*</span>
          </label>
          <div className="relative mb-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full h-11 border border-border-default rounded-lg px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all placeholder:text-text-subtle bg-surface-card"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-main focus:outline-none transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <ul className="text-xs space-y-1.5">
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

        <div className="flex items-start gap-3 mt-1">
          <input
            type="checkbox"
            id="emailTerms"
            checked={emailTerms}
            onChange={(e) => {
              setEmailTerms(e.target.checked);
              setErrorMsg("");
            }}
            className="mt-1 w-4 h-4 text-primary rounded border-border-default focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="emailTerms"
            className="text-xs sm:text-sm text-text-secondary leading-relaxed cursor-pointer"
          >
            Tôi đã đọc và đồng ý với điều khoản sử dụng và chính sách bảo mật
            của ViecNgon.
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!emailTerms}
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
