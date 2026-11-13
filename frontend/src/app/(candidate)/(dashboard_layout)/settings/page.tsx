"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { Button } from "@/components/ui/Button";

export default function SettingsTab() {
  const { user } = useAuthStore();
  const [isCvVisible, setIsCvVisible] = useState(true);

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

  const isGoogleAccount =
    Boolean((user as { provider?: string; googleId?: string } | null)?.provider === "GOOGLE") ||
    Boolean((user as { googleId?: string } | null)?.googleId);

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
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-main mb-5">
          Thông tin tài khoản
        </h2>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-border-subtle pb-4">
            <div className="text-sm font-semibold text-text-secondary">
              Email:
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-main mb-1">
                {user?.email || "Chưa cập nhật"}
              </p>
              <p className="text-xs text-text-muted flex items-start gap-1.5">
                <Info size={15} className="text-primary shrink-0 mt-0.5" />
                Bạn không thể thay đổi email tài khoản.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <div className="text-sm font-semibold text-text-secondary">
              Họ và tên:
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-main mb-1">
                {user?.name || "Chưa cập nhật"}
              </p>
              <p className="text-xs text-text-muted flex items-start gap-1.5 mb-2">
                <Info size={15} className="text-primary shrink-0 mt-0.5" />
                Tên tài khoản được đồng bộ với thông tin hồ sơ của bạn.
              </p>
              <Link
                href="/cv-profile"
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 w-fit"
              >
                Cập nhật thông tin hồ sơ <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-main mb-4">Mật khẩu</h2>

        {isGoogleAccount ? (
          <div className="bg-primary-light p-4 rounded-xl border border-primary/20">
            <p className="text-sm text-text-main flex items-start gap-2">
              <Info size={17} className="text-primary shrink-0 mt-0.5" />
              <span>
                Bạn đã đăng nhập bằng <strong>Google</strong>, vì vậy tài khoản
                không dùng mật khẩu riêng. Hãy tiếp tục chọn Đăng nhập bằng
                Google ở các lần sau.
              </span>
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            {passwordError && (
              <p className="text-danger-text text-sm font-medium bg-danger-soft p-3 rounded-lg border border-danger-border">
                {passwordError}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
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
                  className="w-full h-10 border border-border-default rounded-lg px-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, old: !showPassword.old })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-primary transition-colors"
                >
                  {showPassword.old ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
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
                  className="w-full h-10 border border-border-default rounded-lg px-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, new: !showPassword.new })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-primary transition-colors"
                >
                  {showPassword.new ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
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
                  className="w-full h-10 border border-border-default rounded-lg px-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-primary transition-colors"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              loadingText="Đang xử lý..."
              className="mt-2"
            >
              Đổi mật khẩu
            </Button>
          </form>
        )}
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-main mb-4">
          Hiển thị CV của bạn
        </h2>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
            Cho phép các nhà tuyển dụng tìm thấy CV của bạn trên ViecNgon và
            liên hệ trao đổi cơ hội việc làm phù hợp.
          </p>

          <button
            type="button"
            onClick={() => setIsCvVisible(!isCvVisible)}
            className="flex items-center gap-3 shrink-0 focus:outline-none cursor-pointer"
          >
            <div
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
                isCvVisible ? "bg-primary" : "bg-surface-subtle border border-border-default"
              }`}
            >
              <div
                className={`absolute w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300 ${
                  isCvVisible ? "left-[26px]" : "left-1"
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-text-main min-w-8 text-left">
              {isCvVisible ? "Bật" : "Tắt"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
