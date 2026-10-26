"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";
import GoogleButton from "@/components/auth/GoogleButton";

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
        onSuccess: (data: any) => {
          toast.success("Đăng nhập thành công!");
          // Điều hướng linh hoạt theo vai trò của tài khoản
          if (data?.user?.role === "NHATUYENDUNG") {
            router.push("/employer-dashboard");
          } else {
            router.push("/dashboard");
          }
        },

        // ===================================================================
        // XỬ LÝ CÁC NHÁNH LỖI (onError)
        // ===================================================================
        onError: (err: any) => {
          const rawMessage = err?.message || "Đăng nhập thất bại!";

          // TRƯỜNG HỢP 1: Tài khoản đăng ký qua Google
          if (
            rawMessage.includes("này đã được dùng để đăng ký bằng google") ||
            rawMessage.includes("liên kết với Google")
          ) {
            setIsGoogleAccount(true);
            setErrorMessage(
              "Tài khoản này đã được tạo bằng Google. Vui lòng bấm vào nút 'Đăng nhập với Google' ở phía trên!",
            );
            toast.error(
              "Tài khoản Google! Vui lòng chọn đăng nhập bằng Google.",
              { duration: 5000, icon: "⚠️" },
            );
            return;
          }

          // TRƯỜNG HỢP 2: Email chưa tồn tại trong hệ thống
          if (
            rawMessage.includes("Email chưa tồn tại") ||
            rawMessage.includes("chưa đăng ký")
          ) {
            setErrorMessage(
              "Email này chưa được đăng ký tài khoản trên ViecNgon.",
            );
            toast.error("Email chưa tồn tại. Vui lòng đăng ký tài khoản!", {
              duration: 4000,
            });
            return;
          }

          // TRƯỜNG HỢP 3: Sai mật khẩu hoặc lỗi khác
          setErrorMessage(rawMessage);
          toast.error(rawMessage);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col font-sans">
      {/* --- HEADER --- */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mb-3 tracking-tight">
        Chào mừng đến với <span className="text-primary">ViecNgon</span>
      </h1>
      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        Bằng việc đăng nhập, bạn đồng ý với{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Điều khoản sử dụng
        </Link>{" "}
        và{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Chính sách bảo mật
        </Link>{" "}
        của ViecNgon.
      </p>

      {/* --- HỘP GỢI Ý ĐẶC BIỆT KHI PHÁT HIỆN TÀI KHOẢN GOOGLE --- */}
      {isGoogleAccount && (
        <div className="mb-5 p-4 bg-blue-50 border border-primary/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <span className="text-2xl select-none">💡</span>
          <div className="text-xs text-slate-800 leading-relaxed">
            <p className="font-bold text-primary text-sm mb-1">
              Phát hiện tài khoản Google!
            </p>
            Email <strong>{email}</strong> được đăng ký thông qua Google OAuth.
            Vui lòng nhấn nút <strong>&quot;Đăng nhập với Google&quot;</strong>{" "}
            ngay bên dưới để tiếp tục.
          </div>
        </div>
      )}

      {/* --- NÚT ĐĂNG NHẬP GOOGLE --- */}
      <div
        className={`transition-all duration-300 rounded-xl ${
          isGoogleAccount
            ? "ring-4 ring-primary/30 scale-[1.02] shadow-lg shadow-primary/20"
            : ""
        }`}
      >
        <GoogleButton mode="login" />
      </div>

      {/* --- DÒNG KẺ HOẶC --- */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm text-slate-500 font-medium px-2">hoặc</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      {/* --- FORM ĐĂNG NHẬP TRUYỀN THỐNG --- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Input Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-primary-dark mb-1.5"
          >
            Email <span className="text-rose-500">*</span>
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
            className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 ${
              errorMessage && !isGoogleAccount
                ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                : "border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-slate-300"
            }`}
            required
          />
        </div>

        {/* Input Mật khẩu */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-primary-dark"
            >
              Mật khẩu <span className="text-rose-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
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
              className="w-full border border-slate-200 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
              required
            />
            {/* Nút ẩn/hiện mật khẩu */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* KHỐI HIỂN THỊ LỖI NỘI BỘ (Inline Error Banner) */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-600 text-xs animate-in fade-in duration-200">
            <FiAlertCircle
              size={16}
              className="shrink-0 mt-0.5 text-rose-500"
            />
            <div>
              <span>{errorMessage}</span>
              {/* Nếu là lỗi email chưa tồn tại, hiện thêm link Đăng ký nhanh */}
              {errorMessage.includes("chưa được đăng ký") && (
                <Link
                  href="/register"
                  className="block mt-1 font-bold text-primary hover:underline"
                >
                  👉 Bấm vào đây để đăng ký tài khoản ngay
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full mt-2 font-bold py-3.5 rounded-lg transition-all ${
            isPending
              ? "bg-slate-400 cursor-not-allowed text-white"
              : "bg-primary hover:bg-primary-hover text-white active:scale-95 shadow-md shadow-primary/20"
          }`}
        >
          {isPending ? "Đang kiểm tra..." : "Đăng nhập bằng email"}
        </button>
      </form>

      {/* --- FOOTER CHUYỂN TRANG ĐĂNG KÝ --- */}
      <p className="text-center text-sm text-slate-600 mt-8">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-primary font-bold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
