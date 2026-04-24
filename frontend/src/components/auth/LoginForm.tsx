"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  //Gọi hook login
  const { login, isError, error, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt tự động reload trang khi submit form

    // Thực thi hàm login (truyền biến 'credentials' vào useLogin)
    login(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("Thông tin user:", data.user);
          alert("Đăng nhập thành công!");
          router.push("/dashboard");
        },
        onError: (err) => {
          console.error("Chi tiết lỗi:", err);
        },
      },
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-10 text-center md:text-left">
        <Link href="/">
          <span className="text-4xl font-extrabold text-primary tracking-tight">
            ViecNgon
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">
          Chào mừng bạn đã quay trở lại
        </h1>
        <p className="text-slate-500">
          Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý
          tưởng
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <FiMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              id="email"
              placeholder="Nhập email của bạn"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-primary font-medium hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>
        {/* Hiển thị lỗi nếu đăng nhập thất bại */}
        {isError && (
          <p className="text-red-500 text-sm font-medium">{error.message}</p>
        )}

        {/* Nút Đăng nhập */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-hover active:scale-[0.98]"
          }  text-white font-semibold py-3 px-4 rounded-md shadow-md shadow-primary/30 transition-all `}
        >
          {isPending ? "Đang kiểm tra..." : "Đăng nhập"}
        </button>
      </form>

      {/* Dòng chữ "Hoặc đăng nhập bằng" */}
      <div className="relative my-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-white px-3 text-sm text-gray-500">
          Hoặc đăng nhập bằng
        </span>
      </div>

      {/* Nút xã hội */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
          <FaGoogle className="text-red-600" size={20} /> Google
        </button>
        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
          <FaFacebook className="text-blue-600" size={20} /> Facebook
        </button>
      </div>

      {/* Liên kết đăng ký */}
      <div className="text-center mt-8 text-slate-600 text-sm">
        Bạn chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-primary font-bold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
