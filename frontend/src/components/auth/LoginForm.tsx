"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Gọi hook login
  const { login, isError, error, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Đăng nhập thành công!");
          router.push("/dashboard");
        },
        onError: (err) => {
          console.error("Chi tiết lỗi:", err);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col">
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

      {/* --- NÚT ĐĂNG NHẬP GOOGLE --- */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-2.5 border border-primary rounded-lg text-primary font-bold hover:bg-primary-light transition-all mb-6"
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
        />
        Đăng nhập với Google
      </button>

      {/* --- DÒNG KẺ HOẶC --- */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm text-slate-500 font-medium px-2">hoặc</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      {/* --- FORM ĐĂNG NHẬP --- */}
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email"
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
              required
            />
            {/* Nút ẩn/hiện mật khẩu (Con mắt) */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Thông báo lỗi */}
        {isError && (
          <p className="text-rose-500 text-sm font-medium">{error?.message}</p>
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
          {isPending ? "Đang xử lý..." : "Đăng nhập bằng email"}
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
