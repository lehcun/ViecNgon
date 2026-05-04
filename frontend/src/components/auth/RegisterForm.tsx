"use client";

import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/auth/useSignUp";
import { RegisterResponse } from "@viecngon/types";
// Import hook đăng ký của bạn (đường dẫn có thể thay đổi tùy cấu trúc)

export default function RegisterForm() {
  const router = useRouter();
  const signupMutation = useSignup();

  // State quản lý UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State quản lý Data Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "UNGVIEN" as "UNGVIEN" | "NHATUYENDUNG",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Hàm xử lý khi gõ input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(""); // Xóa lỗi khi người dùng bắt đầu gõ lại
  };

  // Hàm xử lý Submit (Không dùng useEffect)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra rỗng
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // 2. Validate Email chuẩn thực tế bằng Regex Frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }

    // 3. Validate Mật khẩu siêu bảo mật (Giống hệt Backend)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg(
        "Mật khẩu phải từ 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt (VD: @, $, !).",
      );
      return;
    }

    // 4. Xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    // 5. Điều khoản
    if (!termsAccepted) {
      setErrorMsg("Bạn cần đồng ý với Điều khoản dịch vụ để tiếp tục.");
      return;
    }

    // 2. Gọi Hook Mutation
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
          // Chuyển hướng về trang chủ hoặc dashboard tùy role
          router.push("/");
        },
        onError: (error) => {
          setErrorMsg(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
        },
      },
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8 text-center md:text-left">
        <Link href="/">
          <span className="text-4xl font-extrabold text-primary">ViecNgon</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">
          Tạo tài khoản mới
        </h1>
        <p className="text-slate-500 text-sm">
          Gia nhập cộng đồng IT chất lượng nhất Việt Nam ngay hôm nay.
        </p>
      </div>

      {/* Hiển thị lỗi tổng */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2 border border-red-100">
          <FiAlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Lựa chọn Vai trò (Role) */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "UNGVIEN" })}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              formData.role === "UNGVIEN"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Ứng viên
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "NHATUYENDUNG" })}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              formData.role === "NHATUYENDUNG"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Nhà tuyển dụng
          </button>
        </div>

        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Họ và tên
          </label>
          <div className="relative">
            <FiUser
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={"Nhập họ và tên"}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <FiMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
              className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        {/* Xác nhận Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Điều khoản */}
        <div className="flex items-start gap-2 mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked);
              setErrorMsg("");
            }}
            className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="text-sm text-slate-600 leading-tight cursor-pointer"
          >
            Tôi đã đọc và đồng ý với
            <Link href="/terms" className="text-primary hover:underline">
              Điều khoản dịch vụ
            </Link>
            và
            <Link href="/privacy" className="text-primary hover:underline">
              Chính sách bảo mật
            </Link>
            của ViecNgon.
          </label>
        </div>

        {/* Nút Đăng ký */}
        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-primary-hover shadow-md shadow-primary/30 transition-all active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {signupMutation.isPending ? "Đang xử lý..." : "Đăng ký ngay"}
        </button>
      </form>

      {/* Liên kết Đăng nhập */}
      <div className="text-center mt-6 text-slate-600 text-sm">
        Đã có tài khoản?
        <Link href="/login" className="text-primary font-bold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
