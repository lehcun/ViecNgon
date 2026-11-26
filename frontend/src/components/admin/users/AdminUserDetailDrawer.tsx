"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import type { AdminUserListItem } from "@viecngon/types";
import { useAdminUserDetail } from "@/hooks/admin/useAdminUsers";
import { ROLE_META, STATUS_META } from "./AdminUsersTable";

interface AdminUserDetailDrawerProps {
  userId: string | null;
  currentAdminId?: string;
  onClose: () => void;
  onRequestLock: (user: AdminUserListItem) => void;
  onRequestActivate: (user: AdminUserListItem) => void;
  onRequestChangeRole: (user: AdminUserListItem) => void;
  onRequestDelete: (user: AdminUserListItem) => void;
}

function formatDateTimeVi(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isValidImageSrc(url: string | null | undefined): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  );
}

export default function AdminUserDetailDrawer({
  userId,
  currentAdminId,
  onClose,
  onRequestLock,
  onRequestActivate,
  onRequestChangeRole,
  onRequestDelete,
}: AdminUserDetailDrawerProps) {
  const { data: detail, isLoading, isError, refetch } =
    useAdminUserDetail(userId);

  if (!userId) return null;

  const isSelf = currentAdminId === userId;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết tài khoản người dùng"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-lg bg-surface-card h-full shadow-2xl border-l border-border-default flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Chi tiết tài khoản
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Tra cứu hồ sơ và thực hiện thao tác quản trị
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-subtle shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-44 bg-surface-subtle rounded" />
                  <div className="h-3.5 w-56 bg-surface-muted rounded" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-6 w-24 bg-surface-subtle rounded-full" />
                    <div className="h-6 w-24 bg-surface-subtle rounded-full" />
                  </div>
                </div>
              </div>
              <div className="h-32 bg-surface-muted rounded-xl" />
              <div className="h-36 bg-surface-muted rounded-xl" />
            </div>
          ) : isError || !detail ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-danger-text">
                Không thể tải thông tin chi tiết tài khoản.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              {/* Identity Block */}
              <div className="flex items-start gap-4">
                {isValidImageSrc(detail.avatarUrl) ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border-default shrink-0 bg-surface-muted">
                    <Image
                      src={detail.avatarUrl}
                      alt={detail.tenNguoiDung}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-light text-primary font-bold text-lg flex items-center justify-center shrink-0 border border-primary-subtle">
                    {(detail.tenNguoiDung || detail.email)
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-text-primary truncate">
                    {detail.tenNguoiDung}
                  </h3>
                  <p className="text-sm text-text-muted truncate">
                    {detail.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_META[detail.vaiTro].badgeClass}`}
                    >
                      {ROLE_META[detail.vaiTro].label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_META[detail.trangThai].badgeClass}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_META[detail.trangThai].dotClass}`}
                      />
                      {STATUS_META[detail.trangThai].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="bg-surface-page border border-border-default rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Thông tin tài khoản
                </h4>
                <div className="grid grid-cols-1 gap-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-text-secondary">
                    <Mail size={15} className="text-text-muted shrink-0" />
                    <span className="truncate">{detail.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-text-secondary">
                    <Phone size={15} className="text-text-muted shrink-0" />
                    <span>{detail.sdt || "Chưa cập nhật số điện thoại"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-text-secondary">
                    <Calendar size={15} className="text-text-muted shrink-0" />
                    <span>
                      Đăng ký: {formatDateTimeVi(detail.ngayTao)} · Phương thức:{" "}
                      <strong className="text-text-primary">
                        {detail.provider === "GOOGLE" ? "Google" : "Email"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Hồ sơ Ứng viên */}
              {detail.candidateProfile && (
                <div className="bg-surface-card border border-border-default rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <Briefcase size={14} className="text-primary" />
                    <span>Hồ sơ Ứng viên</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-text-secondary">
                    <p>
                      <span className="text-text-muted">Chuyên môn:</span>{" "}
                      <strong className="text-text-primary">
                        {detail.candidateProfile.chuyenMon || "Chưa cập nhật"}
                      </strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-text-muted shrink-0" />
                      <span>
                        {detail.candidateProfile.diaChi || "Chưa cập nhật địa chỉ"}
                      </span>
                    </p>
                    <p>
                      <span className="text-text-muted">Kinh nghiệm:</span>{" "}
                      {detail.candidateProfile.soNamKinhNghiem !== null
                        ? `${detail.candidateProfile.soNamKinhNghiem} năm`
                        : "Chưa cập nhật"}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">Trạng thái CV:</span>
                        {detail.candidateProfile.cvUrl ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success-soft text-success-text border border-success-border">
                            Đã tải CV PDF
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-text-muted border border-border-default">
                            Chưa có CV
                          </span>
                        )}
                      </div>
                      {detail.candidateProfile.cvUrl && (
                        <a
                          href={detail.candidateProfile.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Xem CV kiểm duyệt
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-surface-page rounded-lg p-2.5 text-center border border-border-default">
                      <p className="text-lg font-bold text-text-primary tabular-nums">
                        {detail.candidateProfile.applicationsCount}
                      </p>
                      <p className="text-[11px] text-text-muted">Đơn ứng tuyển</p>
                    </div>
                    <div className="bg-surface-page rounded-lg p-2.5 text-center border border-border-default">
                      <p className="text-lg font-bold text-text-primary tabular-nums">
                        {detail.candidateProfile.savedJobsCount}
                      </p>
                      <p className="text-[11px] text-text-muted">Việc đã lưu</p>
                    </div>
                    <div className="bg-surface-page rounded-lg p-2.5 text-center border border-border-default">
                      <p className="text-lg font-bold text-text-primary tabular-nums">
                        {detail.candidateProfile.skillsCount}
                      </p>
                      <p className="text-[11px] text-text-muted">Kỹ năng</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hồ sơ Nhà tuyển dụng */}
              {detail.recruiterProfile && (
                <div className="bg-surface-card border border-border-default rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <Building2 size={14} className="text-primary" />
                    <span>Thông tin Doanh nghiệp</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-text-secondary">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/company/${detail.recruiterProfile.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-text-primary hover:text-primary transition-colors"
                      >
                        <span>{detail.recruiterProfile.tenCongTy}</span>
                        <ExternalLink size={13} className="shrink-0 text-primary" />
                      </Link>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-light text-primary border border-primary-subtle">
                        {detail.recruiterProfile.vaiTroTrongCongTy}
                      </span>
                    </div>
                    <p>
                      <span className="text-text-muted">Chức vụ:</span>{" "}
                      {detail.recruiterProfile.chucVu ||
                        detail.recruiterProfile.vaiTroTrongCongTy}
                    </p>
                    {detail.recruiterProfile.soDienThoai && (
                      <p>
                        <span className="text-text-muted">SĐT liên hệ HR:</span>{" "}
                        {detail.recruiterProfile.soDienThoai}
                      </p>
                    )}
                    <p>
                      <span className="text-text-muted">Khu vực:</span>{" "}
                      {detail.recruiterProfile.thanhPho || "Chưa cập nhật"}
                      {detail.recruiterProfile.diaChi
                        ? ` · ${detail.recruiterProfile.diaChi}`
                        : ""}
                    </p>
                    {detail.recruiterProfile.website && (
                      <p className="truncate">
                        <span className="text-text-muted">Website:</span>{" "}
                        <a
                          href={detail.recruiterProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {detail.recruiterProfile.website}
                        </a>
                      </p>
                    )}
                    {(detail.recruiterProfile.moHinhCongTy ||
                      detail.recruiterProfile.quyMo) && (
                      <p>
                        <span className="text-text-muted">Mô hình / Quy mô:</span>{" "}
                        {[
                          detail.recruiterProfile.moHinhCongTy,
                          detail.recruiterProfile.quyMo,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <FileText size={14} className="text-text-muted" />
                      <span>
                        Tổng tin tuyển dụng:{" "}
                        <strong className="text-text-primary">
                          {detail.recruiterProfile.jobsCount}
                        </strong>
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Thông báo hệ thống gần nhất */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  <Bell size={14} />
                  <span>Thông báo gần đây ({detail.recentNotifications.length})</span>
                </div>
                {detail.recentNotifications.length === 0 ? (
                  <p className="text-xs text-text-muted bg-surface-page border border-border-default rounded-lg p-3">
                    Chưa có lịch sử thông báo nào cho tài khoản này.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {detail.recentNotifications.map((item) => (
                      <div
                        key={item.maThongBao}
                        className="bg-surface-page border border-border-default rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-text-primary">
                            {item.tieuDe}
                          </p>
                          <span className="text-[11px] text-text-muted shrink-0">
                            {formatDateTimeVi(item.ngayTao)}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                          {item.noiDung}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {detail && (
          <div className="px-6 py-4 border-t border-border-default bg-surface-page flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              disabled={isSelf}
              onClick={() => onRequestDelete(detail)}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-danger-border bg-danger-soft hover:bg-danger-light text-sm font-semibold text-danger-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={15} />
              Xóa
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              {detail.vaiTro === "NHATUYENDUNG" && (
                <button
                  type="button"
                  onClick={() => onRequestChangeRole(detail)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-primary transition-colors"
                >
                  <Shield size={15} className="text-ai" />
                  Đổi Owner / HR
                </button>
              )}

              {detail.trangThai === "HOATDONG" ? (
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => onRequestLock(detail)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-danger hover:bg-danger-hover text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Lock size={15} />
                  Khóa tài khoản
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequestActivate(detail)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-success hover:bg-success-hover text-white text-sm font-semibold transition-colors"
                >
                  <Unlock size={15} />
                  Kích hoạt
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
