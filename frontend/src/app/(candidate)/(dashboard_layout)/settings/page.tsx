"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Info,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useChangePassword } from "@/hooks/auth/useChangePassword";

export default function SettingsTab() {
  const { user } = useAuthStore();
  const [isCvVisible, setIsCvVisible] = useState(true);

  // Hook và State cho Form Đổi mật khẩu
  const { mutate: changePassword, isPending } = useChangePassword();

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Kiểm tra xem user đăng nhập bằng Google hay Local
  // Lưu ý: Backend cần trả về trường 'provider' hoặc 'googleId' trong API /auth/me
  const isGoogleAccount =
    (user as any)?.provider === "GOOGLE" || (user as any)?.googleId;

  // Xử lý Submit đổi mật khẩu
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    changePassword(
      {
        matKhauCu: passwordForm.oldPassword,
        matKhauMoi: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* 1. THÔNG TIN TÀI KHOẢN */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-primary-dark mb-6">
          Thông tin tài khoản
        </h2>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-sm font-bold text-slate-700">Email:</div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-800 mb-1">
                {user?.email || "email@example.com"}
              </p>
              <p className="text-[13px] text-slate-500 flex items-start gap-1.5">
                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                Bạn không thể thay đổi email tài khoản.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-sm font-bold text-slate-700">Họ và tên:</div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-800 mb-1">
                {user?.name || "Tên người dùng"}
              </p>
              <p className="text-[13px] text-slate-500 flex items-start gap-1.5 mb-2">
                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                Tên tài khoản của bạn được đồng bộ với thông tin hồ sơ.
              </p>
              <Link
                href="/dashboard/profile"
                className="text-sm font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 w-fit"
              >
                Cập nhật thông tin hồ sơ <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MẬT KHẨU (TỰ ĐỘNG PHÂN LUỒNG) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-primary-dark mb-4">Mật khẩu</h2>

        {isGoogleAccount ? (
          // UI dành cho Tài khoản Google
          <div className="bg-primary-light p-4 rounded-lg border border-primary/20">
            <p className="text-sm text-primary-dark flex items-start gap-2">
              <Info size={18} className="text-primary shrink-0 mt-0.5" />
              <span>
                Bạn đã đăng nhập bằng <strong>Google</strong>, vì vậy tài khoản
                của bạn không có mật khẩu. Hãy tiếp tục sử dụng nút Đăng nhập
                bằng Google ở các lần sau.
              </span>
            </p>
          </div>
        ) : (
          // UI Form đổi mật khẩu dành cho Tài khoản thường
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            {passwordError && (
              <p className="text-rose-600 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                {passwordError}
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showPassword.old ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, old: !showPassword.old })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, new: !showPassword.new })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirm: !showPassword.confirm,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`font-bold py-2.5 px-6 rounded-lg transition-all text-sm mt-4 w-fit flex items-center justify-center min-w-[140px] ${
                isPending
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover text-white shadow-sm"
              }`}
            >
              {isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        )}
      </div>

      {/* 3. HIỂN THỊ CV CỦA BẠN */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary-dark">
            Hiển thị CV của bạn
          </h2>
          <Link
            href="/help/cv-visibility"
            className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            Tìm hiểu thêm <ExternalLink size={14} />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100 mb-6">
          <p className="text-sm text-slate-700 max-w-xl leading-relaxed">
            Cho phép các nhà tuyển dụng tìm thấy CV ẩn danh của bạn và gửi lời
            mời làm việc qua email, SMS và Hộp thư ViecNgon.
          </p>

          <button
            type="button"
            onClick={() => setIsCvVisible(!isCvVisible)}
            className="flex items-center gap-3 shrink-0 focus:outline-none"
          >
            <div
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${isCvVisible ? "bg-primary" : "bg-slate-200"}`}
            >
              <div
                className={`absolute w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${isCvVisible ? "left-[26px]" : "left-1"}`}
              ></div>
            </div>
            <span className="text-sm font-bold text-slate-700 min-w-[30px] text-left">
              {isCvVisible ? "Bật" : "Tắt"}
            </span>
          </button>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800 mb-1">
            Không nhận lời mời từ:
          </p>
          <p className="text-[13px] text-slate-500 mb-3">
            Tối đa 5 nhà tuyển dụng
          </p>

          <div className="relative max-w-lg mb-2">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm công ty..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
            />
          </div>
          <p className="text-[13px] text-slate-400 italic">
            Chưa có công ty nào được chọn
          </p>
        </div>
      </div>

      {/* 4. XÓA TÀI KHOẢN */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-rose-600 mb-4">Xóa tài khoản</h2>
        <p className="text-sm text-slate-700 leading-relaxed mb-6">
          Việc xóa tài khoản là một hành động vĩnh viễn và không thể hoàn tác.
          Nếu bạn đang xóa tài khoản vì nhận quá nhiều thông báo qua email, bạn
          có thể{" "}
          <Link
            href="/settings/notifications"
            className="text-primary font-bold hover:underline"
          >
            hủy đăng ký nhận email tại đây
          </Link>
          .
        </p>

        <button className="px-6 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-lg text-sm hover:bg-rose-100 hover:border-rose-300 transition-colors">
          Xóa tài khoản của bạn
        </button>
      </div>
    </div>
  );
}
