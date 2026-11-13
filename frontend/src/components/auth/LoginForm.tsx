"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";
import GoogleButton from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success("Đăng nhập thành công!");
          if (data?.user?.role === "NHATUYENDUNG") {
            router.push("/employer-dashboard");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err) => {
          const rawMessage = err?.message || "Đăng nhập thất bại!";

          if (
            rawMessage.includes("này đã được dùng để đăng ký bằng google") ||
            rawMessage.includes("liên kết với Google")
          ) {
            setIsGoogleAccount(true);
            setErrorMessage(
              "Tài khoản này đã được tạo bằng Google. Vui lòng bấm vào nút 'Đăng nhập với Google' ở phía trên!",
            );
            toast.error("Tài khoản Google! Vui lòng chọn đăng nhập bằng Google.");
            return;
          }

          if (
            rawMessage.includes("Email chưa tồn tại") ||
            rawMessage.includes("chưa đăng ký")
          ) {
            setErrorMessage(
              "Email này chưa được đăng ký tài khoản trên ViecNgon.",
            );
            toast.error("Email chưa tồn tại. Vui lòng đăng ký tài khoản!");
            return;
          }

          setErrorMessage(rawMessage);
          toast.error(rawMessage);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col font-sans">
      <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-3 tracking-tight">
        Chào mừng đến với <span className="text-primary">ViecNgon</span>
      </h1>
      <p className="text-sm text-text-muted mb-7 leading-relaxed">
        Đăng nhập để khám phá hàng nghìn việc làm IT chất lượng và trải nghiệm
        AI Match Score.
      </p>

      {isGoogleAccount && (
        <div className="mb-5 p-4 bg-primary-light border border-primary/25 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="text-xs text-text-main leading-relaxed">
            <p className="font-bold text-primary text-sm mb-1">
              Phát hiện tài khoản Google
            </p>
            Email <strong>{email}</strong> được đăng ký thông qua Google OAuth.
            Vui lòng nhấn nút <strong>&quot;Đăng nhập với Google&quot;</strong>{" "}
            ngay bên dưới để tiếp tục.
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
              setIsGoogleAccount(false);
            }}
            placeholder="Nhập địa chỉ email"
            className={`w-full h-11 border rounded-lg px-4 text-sm outline-none transition-all placeholder:text-text-subtle bg-surface-card ${
              errorMessage && !isGoogleAccount
                ? "border-danger focus:ring-2 focus:ring-danger/20 bg-danger-soft/20"
                : "border-border-default focus:ring-2 focus:ring-primary/15 focus:border-primary"
            }`}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-text-main"
            >
              Mật khẩu <span className="text-danger">*</span>
            </label>
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Nhập mật khẩu"
              className="w-full h-11 border border-border-default rounded-lg px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all placeholder:text-text-subtle bg-surface-card"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-main focus:outline-none transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-danger-soft border border-danger-border rounded-lg flex items-start gap-2.5 text-danger-text text-xs">
            <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span>{errorMessage}</span>
              {errorMessage.includes("chưa được đăng ký") && (
                <Link
                  href="/register"
                  className="block mt-1 font-bold text-primary hover:underline"
                >
                  Bấm vào đây để đăng ký tài khoản ngay
                </Link>
              )}
            </div>
          </div>
        )}

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
