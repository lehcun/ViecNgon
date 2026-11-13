"use client";

import React from "react";
import Link from "next/link";
import { Info, UploadCloud, Edit3, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import { formatDateTimeVN } from "@/lib/formatters";
import { ProfileHeaderSkeleton } from "@/components/ui/StateViews";

const CandidatePersonCVContent = () => {
  const { candidateProfile, isLoading } = useCandidateProfile();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <ProfileHeaderSkeleton />
        <div className="h-44 bg-surface-card rounded-xl border border-border-default animate-pulse" />
      </div>
    );
  }

  const defaultCv = candidateProfile?.defaultCvFile;
  const hasCv = Boolean(defaultCv?.fileUrl || candidateProfile?.cvUrl);
  const cvUrl = defaultCv?.fileUrl || candidateProfile?.cvUrl || "#";
  const cvName =
    defaultCv?.fileName ||
    `CV_ViecNgon_${candidateProfile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-success-light border border-success-border rounded-xl p-4 flex gap-3 shadow-xs">
        <div className="mt-0.5 shrink-0">
          <div className="w-6 h-6 rounded-full bg-surface-card flex items-center justify-center text-success-text border border-success-border">
            <Info size={14} />
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          <span className="font-bold text-success-text">Bạn nên biết: </span>
          ViecNgon luôn ưu tiên gửi CV chính gần nhất cho nhà tuyển dụng khi bạn
          ứng tuyển nhanh trên hệ thống.
        </p>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default shadow-xs p-6 sm:p-7">
        <h2 className="text-lg font-bold text-text-main mb-4">CV của bạn</h2>

        <div className="border border-border-default rounded-xl p-6 bg-surface-subtle/60">
          {hasCv ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-danger-soft text-danger-text border border-danger-border flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text-main text-sm truncate">
                    {cvName}
                  </p>
                  {defaultCv?.uploadedAt && (
                    <p className="text-xs text-text-muted mt-0.5">
                      Cập nhật: {formatDateTimeVN(defaultCv.uploadedAt)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-default bg-surface-card text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors"
                >
                  <ExternalLink size={15} />
                  Mở file
                </a>
                <Link
                  href="/cv-profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
                >
                  <UploadCloud size={15} />
                  Cập nhật bằng AI
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <FileText className="text-text-subtle" size={28} />
                <span className="text-text-muted font-medium text-sm">
                  Bạn chưa đính kèm CV nào
                </span>
              </div>

              <Link
                href="/cv-profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-primary text-primary font-semibold text-sm rounded-lg hover:bg-primary-light transition-colors w-max"
              >
                <UploadCloud size={18} />
                Tải CV PDF &amp; Bóc tách AI
              </Link>

              <p className="text-xs text-text-muted mt-3">
                Hỗ trợ định dạng PDF dưới 5MB và không chứa mật khẩu bảo vệ.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default shadow-xs p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text-main">Thông tin cơ bản</h2>
          <Link
            href="/cv-profile"
            className="text-primary hover:bg-primary-light p-2 rounded-lg transition-colors"
            title="Chỉnh sửa trong Hồ sơ ViecNgon"
          >
            <Edit3 size={18} />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-border-subtle pb-4">
            <span className="text-sm text-text-muted font-medium">
              Họ và tên
            </span>
            <span className="text-sm font-semibold text-text-main">
              {candidateProfile?.candidateName ||
                candidateProfile?.account?.userName || (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-warning-text">
                    <AlertCircle size={15} /> Chưa cập nhật
                  </span>
                )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-border-subtle pb-4">
            <span className="text-sm text-text-muted font-medium">
              Số điện thoại
            </span>
            <span className="text-sm font-semibold text-text-main">
              {candidateProfile?.account?.phoneNumber || user?.sdt || (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-warning-text">
                  <AlertCircle size={15} /> Chưa cập nhật
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 pb-1">
            <span className="text-sm text-text-muted font-medium">
              Địa chỉ hiện tại
            </span>
            <span className="text-sm font-semibold text-text-main">
              {candidateProfile?.address || (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-warning-text">
                  <AlertCircle size={15} /> Chưa cập nhật
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default shadow-xs p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text-main">Thông tin chung</h2>
          <Link
            href="/cv-profile"
            className="text-primary hover:bg-primary-light p-2 rounded-lg transition-colors"
            title="Chỉnh sửa trong Hồ sơ ViecNgon"
          >
            <Edit3 size={18} />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-border-subtle pb-4">
            <span className="text-sm text-text-muted font-medium">
              Tổng số năm kinh nghiệm
            </span>
            <span className="text-sm font-semibold text-text-main">
              {candidateProfile?.yearsOfExperience !== null &&
              candidateProfile?.yearsOfExperience !== undefined
                ? `${candidateProfile.yearsOfExperience} năm`
                : "Chưa cập nhật"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 pb-1">
            <span className="text-sm text-text-muted font-medium">
              Chuyên môn chính
            </span>
            <span className="text-sm font-semibold text-text-main">
              {candidateProfile?.profession || "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePersonCVContent;
