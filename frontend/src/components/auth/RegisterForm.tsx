"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/auth/useSignUp";
import { RegisterResponse } from "@viecngon/types";

export default function RegisterForm() {
  const router = useRouter();
  const signupMutation = useSignup();

  // State quản lý UI
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State quản lý Data Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "UNGVIEN" as "UNGVIEN" | "NHATUYENDUNG",
  });

  // ITviec có 2 ô checkbox riêng biệt cho Google và Email
  const [googleTerms, setGoogleTerms] = useState(false);
  const [emailTerms, setEmailTerms] = useState(false);

  // Hàm xử lý khi gõ input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  // Logic kiểm tra điều kiện mật khẩu (Hiển thị UI Checklist)
  const pwd = formData.password;
  const validations = {
    length: pwd.length >= 8,
    symbol: /[@$!%*?&#]/.test(pwd),
    number: /\d/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
  };
  const isPasswordValid = Object.values(validations).every(Boolean);

  // Hàm xử lý Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra rỗng
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }

    // 3. Validate Mật khẩu (Dựa trên checklist)
    if (!isPasswordValid) {
      setErrorMsg("Mật khẩu chưa thỏa mãn tất cả các điều kiện bảo mật.");
      return;
    }

    // 4. Điều khoản
    if (!emailTerms) {
      setErrorMsg("Bạn cần đồng ý với Điều khoản dịch vụ để tiếp tục.");
      return;
    }

    // 5. Gọi Hook Mutation
    signupMutation.mutate(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: (data: RegisterResponse["user"]) => {
          alert(`Đăng ký thành công! Chào mừng ${data.name}`);
          router.push("/");
        },
        onError: (error) => {
          setErrorMsg(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col font-sans">
      {/* --- HEADER --- */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl font-bold text-slate-800 tracking-tight">
          Chào mừng đến với
        </span>
        <span className="text-2xl font-black text-primary">ViecNgon</span>
      </div>
      <h1 className="text-3xl font-extrabold text-primary-dark mb-6">
        Đăng ký
      </h1>

      {/* --- ĐĂNG KÝ GOOGLE --- */}
      <div className="flex items-start gap-3 mb-4">
        <input
          type="checkbox"
          id="googleTerms"
          checked={googleTerms}
          onChange={(e) => setGoogleTerms(e.target.checked)}
          className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
        />
        <label
          htmlFor="googleTerms"
          className="text-sm text-slate-700 leading-relaxed cursor-pointer"
        >
          Bằng việc đăng ký bằng Google, tôi đồng ý với{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của ViecNgon.
        </label>
      </div>

      <button
        type="button"
        disabled={!googleTerms}
        className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
        />
        Đăng ký với Google
      </button>

      {/* --- DIVIDER --- */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm text-slate-400 font-medium px-2 uppercase">
          hoặc
        </span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      {/* --- FORM ĐĂNG KÝ EMAIL --- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Báo lỗi hệ thống */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2 border border-red-100">
            <FiAlertCircle size={18} />
            {errorMsg}
          </div>
        )}

        {/* Tên */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-primary-dark mb-1.5"
          >
            Tên của bạn <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
          />
        </div>

        {/* Email */}
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập địa chỉ email"
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-primary-dark mb-1.5"
          >
            Mật khẩu <span className="text-rose-500">*</span>
          </label>
          <div className="relative mb-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Validate Checklist */}
          <ul className="text-xs space-y-1.5">
            <li
              className={`flex items-center gap-2 ${validations.length ? "text-emerald-600 font-medium" : "text-slate-500"}`}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${validations.length ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
              ></div>
              Ít nhất 8 ký tự
            </li>
            <li
              className={`flex items-center gap-2 ${validations.symbol ? "text-emerald-600 font-medium" : "text-slate-500"}`}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${validations.symbol ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
              ></div>
              Ít nhất 1 ký tự đặc biệt (! @ # $ ...)
            </li>
            <li
              className={`flex items-center gap-2 ${validations.number ? "text-emerald-600 font-medium" : "text-slate-500"}`}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${validations.number ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
              ></div>
              Ít nhất 1 chữ số
            </li>
            <li
              className={`flex items-center gap-2 ${validations.upper ? "text-emerald-600 font-medium" : "text-slate-500"}`}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${validations.upper ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
              ></div>
              Ít nhất 1 chữ IN HOA
            </li>
            <li
              className={`flex items-center gap-2 ${validations.lower ? "text-emerald-600 font-medium" : "text-slate-500"}`}
            >
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${validations.lower ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
              ></div>
              Ít nhất 1 chữ thường
            </li>
          </ul>
        </div>

        {/* Điều khoản Email */}
        <div className="flex items-start gap-3 mt-2">
          <input
            type="checkbox"
            id="emailTerms"
            checked={emailTerms}
            onChange={(e) => {
              setEmailTerms(e.target.checked);
              setErrorMsg("");
            }}
            className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="emailTerms"
            className="text-sm text-slate-700 leading-relaxed cursor-pointer"
          >
            Tôi đã đọc và đồng ý với{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Chính sách bảo mật
            </Link>{" "}
            của ViecNgon.
          </label>
        </div>

        {/* Nút Đăng ký */}
        <button
          type="submit"
          disabled={signupMutation.isPending || !emailTerms}
          className={`w-full mt-2 font-bold py-3.5 rounded-lg transition-all ${
            signupMutation.isPending || !emailTerms
              ? "bg-[#a1a1aa] text-white cursor-not-allowed"
              : "bg-primary hover:bg-primary-hover text-white active:scale-95 shadow-md shadow-primary/20"
          }`}
        >
          {signupMutation.isPending ? "Đang xử lý..." : "Đăng ký bằng email"}
        </button>
      </form>

      {/* --- FOOTER ĐĂNG NHẬP --- */}
      <div className="text-center mt-6 text-sm text-slate-700">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Đăng nhập ngay!
        </Link>
      </div>
    </div>
  );
}
