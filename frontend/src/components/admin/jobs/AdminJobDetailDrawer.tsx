"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  MapPin,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import type { AdminJobListItem } from "@viecngon/types";
import { useAdminJobDetail } from "@/hooks/admin/useAdminJobs";
import { JOB_STATUS_META, formatSalaryRange } from "./AdminJobsTable";

interface AdminJobDetailDrawerProps {
  jobId: string | null;
  onClose: () => void;
  onRequestApprove: (job: AdminJobListItem) => void;
  onRequestReject: (job: AdminJobListItem) => void;
  onRequestHide: (job: AdminJobListItem) => void;
  onRequestDelete: (job: AdminJobListItem) => void;
}

function formatDateVi(iso?: string | null): string {
  if (!iso) return "Không giới hạn";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminJobDetailDrawer({
  jobId,
  onClose,
  onRequestApprove,
  onRequestReject,
  onRequestHide,
  onRequestDelete,
}: AdminJobDetailDrawerProps) {
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useAdminJobDetail(jobId);

  if (!jobId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết tin tuyển dụng"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-2xl bg-surface-card h-full shadow-2xl border-l border-border-default flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Chi tiết tin tuyển dụng
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Xem xét nội dung bài đăng trước khi phê duyệt hiển thị công khai
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết tin"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-3/4 bg-surface-subtle rounded" />
              <div className="h-4 w-1/2 bg-surface-muted rounded" />
              <div className="h-28 bg-surface-muted rounded-xl" />
              <div className="h-40 bg-surface-muted rounded-xl" />
            </div>
          ) : isError || !detail ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-danger-text">
                Không thể tải nội dung chi tiết tin tuyển dụng.
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
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${JOB_STATUS_META[detail.trangThai].badgeClass}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${JOB_STATUS_META[detail.trangThai].dotClass}`}
                    />
                    {JOB_STATUS_META[detail.trangThai].label}
                  </span>
                  {detail.nhanQuangCao && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-vip-light text-vip border border-vip-border">
                      {detail.nhanQuangCao}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-text-primary">
                  {detail.tenCongViec}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary">
                  <Link
                    href={`/company/${detail.company.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    <Building2 size={14} />
                    <span>{detail.company.tenCongTy}</span>
                    <ExternalLink size={12} />
                  </Link>
                  <span className="text-border-strong">•</span>
                  <span className="text-xs text-text-muted">
                    HR: {detail.recruiter.tenNguoiDung} (
                    {detail.recruiter.email})
                  </span>
                </div>

                <Link
                  href={`/jobs/${detail.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>Xem tin đăng trên trang chủ</span>
                  <ExternalLink size={16} />
                </Link>
              </div>

              {/* Tóm tắt thông số */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-page border border-border-default rounded-xl p-4 text-xs">
                <div>
                  <p className="text-text-muted">Mức lương</p>
                  <p className="font-bold text-success-text mt-1">
                    {formatSalaryRange(
                      detail.mucLuongToiThieu,
                      detail.mucLuongToiDa,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Cấp bậc / Hình thức</p>
                  <p className="font-semibold text-text-primary mt-1">
                    {detail.capBac || "Không yêu cầu"} ·{" "}
                    {detail.hinhThucLamViec || detail.loaiHinh}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Khu vực</p>
                  <p className="font-semibold text-text-primary mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-text-muted shrink-0" />
                    <span className="truncate">
                      {detail.thanhPho || "Toàn quốc"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Hạn nộp</p>
                  <p className="font-semibold text-text-primary mt-1 flex items-center gap-1">
                    <Calendar size={12} className="text-text-muted shrink-0" />
                    <span>{formatDateVi(detail.ngayHetHan)}</span>
                  </p>
                </div>
              </div>

              {detail.branch && (
                <p className="text-xs text-text-secondary bg-surface-page border border-border-default rounded-lg px-3.5 py-2.5">
                  <strong className="text-text-primary">
                    Địa chỉ làm việc:
                  </strong>{" "}
                  {detail.branch.diaChi} ({detail.branch.thanhPho})
                </p>
              )}

              {/* Kỹ năng */}
              {detail.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Kỹ năng yêu cầu
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface-muted text-text-secondary border border-border-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nội dung chi tiết */}
              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Mô tả công việc
                  </h4>
                  {detail.moTa ? (
                    <div
                      className="prose prose-sm max-w-none text-text-secondary bg-surface-page border border-border-default rounded-xl p-4"
                      dangerouslySetInnerHTML={{ __html: detail.moTa }}
                    />
                  ) : (
                    <p className="text-xs text-text-muted">Chưa có mô tả.</p>
                  )}
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Yêu cầu ứng viên
                  </h4>
                  {detail.yeuCauCongViec ? (
                    <div
                      className="prose prose-sm max-w-none text-text-secondary bg-surface-page border border-border-default rounded-xl p-4"
                      dangerouslySetInnerHTML={{
                        __html: detail.yeuCauCongViec,
                      }}
                    />
                  ) : (
                    <p className="text-xs text-text-muted">Chưa có yêu cầu.</p>
                  )}
                </section>

                {detail.phucLoi && (
                  <section className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Phúc lợi
                    </h4>
                    <div
                      className="prose prose-sm max-w-none text-text-secondary bg-surface-page border border-border-default rounded-xl p-4"
                      dangerouslySetInnerHTML={{ __html: detail.phucLoi }}
                    />
                  </section>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {detail && (
          <div className="px-6 py-4 border-t border-border-default bg-surface-page flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => onRequestDelete(detail)}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-danger-border bg-danger-soft hover:bg-danger-light text-sm font-semibold text-danger-text transition-colors"
            >
              <Trash2 size={15} />
              Xóa tin
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              {detail.trangThai === "CHO_DUYET" && (
                <button
                  type="button"
                  onClick={() => onRequestReject(detail)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-danger-border bg-surface-card hover:bg-danger-soft text-danger-text text-sm font-semibold transition-colors"
                >
                  <XCircle size={15} />
                  Từ chối
                </button>
              )}

              {detail.trangThai === "DA_DUYET" && (
                <button
                  type="button"
                  onClick={() => onRequestHide(detail)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-warning hover:bg-warning-hover text-white text-sm font-semibold transition-colors"
                >
                  <EyeOff size={15} />
                  Ẩn tin
                </button>
              )}

              {(detail.trangThai === "CHO_DUYET" ||
                detail.trangThai === "TU_CHOI" ||
                detail.trangThai === "DA_AN") && (
                <button
                  type="button"
                  onClick={() => onRequestApprove(detail)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-success hover:bg-success-hover text-white text-sm font-semibold transition-colors"
                >
                  <CheckCircle2 size={15} />
                  Duyệt hiển thị
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
