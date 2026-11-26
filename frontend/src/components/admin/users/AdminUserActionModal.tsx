"use client";

import React, { useState } from "react";
import { Loader2, Lock, Shield, Trash2, Unlock, X } from "lucide-react";
import type {
  AdminUserListItem,
  EmployerCompanyRole,
} from "@viecngon/types";
import { ROLE_META } from "./AdminUsersTable";

export type AdminUserModalMode = "lock" | "activate" | "role" | "delete";

interface AdminUserActionModalProps {
  mode: AdminUserModalMode;
  user: AdminUserListItem;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmLock: (reason: string) => void;
  onConfirmActivate: () => void;
  onConfirmRole: (nextCompanyRole: EmployerCompanyRole) => void;
  onConfirmDelete: (reason: string) => void;
}

export default function AdminUserActionModal({
  mode,
  user,
  isSubmitting,
  onClose,
  onConfirmLock,
  onConfirmActivate,
  onConfirmRole,
  onConfirmDelete,
}: AdminUserActionModalProps) {
  const [reason, setReason] = useState("");
  const currentCompanyRole: EmployerCompanyRole =
    user.companyRole === "OWNER" ? "OWNER" : "RECRUITER";
  const [selectedCompanyRole, setSelectedCompanyRole] =
    useState<EmployerCompanyRole>(currentCompanyRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "lock") {
      onConfirmLock(reason.trim());
    } else if (mode === "activate") {
      onConfirmActivate();
    } else if (mode === "delete") {
      onConfirmDelete(reason.trim());
    } else {
      onConfirmRole(selectedCompanyRole);
    }
  };

  const title =
    mode === "lock"
      ? "Khóa tài khoản vi phạm"
      : mode === "activate"
        ? "Kích hoạt tài khoản"
        : mode === "delete"
          ? "Xóa tài khoản người dùng"
          : "Đổi chức vụ Nhà tuyển dụng";

  const roleUnchanged =
    mode === "role" && selectedCompanyRole === currentCompanyRole;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-surface-card border border-border-default rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {mode === "lock" && (
              <span className="w-8 h-8 rounded-lg bg-danger-light text-danger-text flex items-center justify-center">
                <Lock size={16} />
              </span>
            )}
            {mode === "activate" && (
              <span className="w-8 h-8 rounded-lg bg-success-light text-success-text flex items-center justify-center">
                <Unlock size={16} />
              </span>
            )}
            {mode === "role" && (
              <span className="w-8 h-8 rounded-lg bg-ai-light text-ai flex items-center justify-center">
                <Shield size={16} />
              </span>
            )}
            {mode === "delete" && (
              <span className="w-8 h-8 rounded-lg bg-danger-light text-danger-text flex items-center justify-center">
                <Trash2 size={16} />
              </span>
            )}
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-surface-page border border-border-default rounded-xl p-3.5 text-sm">
            <p className="font-semibold text-text-primary">{user.tenNguoiDung}</p>
            <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
            <p className="text-xs text-text-secondary mt-1">
              Vai trò hiện tại:{" "}
              <strong className="text-text-primary">
                {ROLE_META[user.vaiTro].label}
              </strong>
            </p>
          </div>

          {(mode === "lock" || mode === "delete") && (
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                {mode === "lock"
                  ? "Tài khoản bị khóa sẽ bị đăng xuất khỏi hệ thống và không thể đăng nhập cho đến khi được kích hoạt lại."
                  : "Tài khoản sẽ bị vô hiệu hóa vĩnh viễn và ẩn khỏi danh sách quản lý. Người dùng không thể đăng nhập lại."}
              </p>
              <label
                htmlFor="action-reason"
                className="block text-xs font-semibold text-text-primary"
              >
                {mode === "lock"
                  ? "Lý do khóa tài khoản (khuyến nghị)"
                  : "Lý do xóa tài khoản (khuyến nghị)"}
              </label>
              <textarea
                id="action-reason"
                rows={3}
                maxLength={300}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  mode === "lock"
                    ? "VD: Đăng tin tuyển dụng giả mạo / spam hồ sơ vi phạm chính sách..."
                    : "VD: Tài khoản ảo, lừa đảo hoặc theo yêu cầu xóa dữ liệu..."
                }
                className="w-full rounded-lg border border-border-default bg-surface-card p-3 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-[11px] text-text-muted text-right">
                {reason.length}/300 ký tự
              </p>
            </div>
          )}

          {mode === "activate" && (
            <p className="text-sm text-text-secondary">
              Bạn có chắc chắn muốn kích hoạt tài khoản{" "}
              <strong className="text-text-primary">{user.email}</strong> về
              trạng thái <strong>Hoạt động</strong>? Người dùng sẽ có thể đăng
              nhập và sử dụng hệ thống ngay lập tức.
            </p>
          )}

          {mode === "role" && (
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">
                Chức vụ hiện tại tại{" "}
                <strong className="text-text-primary">
                  {user.companyName || "doanh nghiệp"}
                </strong>
                :{" "}
                <strong className="text-primary">
                  {currentCompanyRole === "OWNER"
                    ? "Quản trị viên công ty (Owner)"
                    : "Chuyên viên tuyển dụng (HR)"}
                </strong>
              </p>
              <label
                htmlFor="user-role-select"
                className="block text-xs font-semibold text-text-primary pt-1"
              >
                Chọn chức vụ trong công ty
              </label>
              <select
                id="user-role-select"
                value={selectedCompanyRole}
                onChange={(e) =>
                  setSelectedCompanyRole(e.target.value as EmployerCompanyRole)
                }
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="OWNER">Quản trị viên công ty (Owner)</option>
                <option value="RECRUITER">Chuyên viên tuyển dụng (HR)</option>
              </select>
              <p className="text-xs text-text-muted bg-surface-page border border-border-default rounded-lg p-3">
                Chỉ hỗ trợ chuyển đổi chức vụ nội bộ công ty giữa{" "}
                <strong>Owner</strong> và <strong>HR</strong> cho tài khoản Nhà
                tuyển dụng.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary transition-colors"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting || roleUnchanged}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              mode === "lock" || mode === "delete"
                ? "bg-danger hover:bg-danger-hover"
                : mode === "activate"
                  ? "bg-success hover:bg-success-hover"
                  : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {mode === "lock"
              ? "Xác nhận khóa"
              : mode === "activate"
                ? "Xác nhận kích hoạt"
                : mode === "delete"
                  ? "Xác nhận xóa"
                  : "Lưu phân quyền"}
          </button>
        </div>
      </form>
    </div>
  );
}
