"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  UploadCloud,
  ChevronRight,
  FileText,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import {
  calculateProfileCompletion,
  MIN_PROFILE_COMPLETION_FOR_CV,
} from "@/lib/candidate-completion";
import { formatDateTimeVN } from "@/lib/formatters";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

export default function CandidateCVCard() {
  const { candidateProfile: profile, isLoading } = useCandidateProfile();
  const [isHovered, setIsHovered] = useState(false);

  const profileCompletion = calculateProfileCompletion(profile);
  const isEligibleForCv =
    profileCompletion >= MIN_PROFILE_COMPLETION_FOR_CV;

  if (isLoading) {
    return (
      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs h-56 animate-pulse flex flex-col justify-center items-center">
        <div className="w-14 h-14 bg-surface-subtle rounded-full mb-3" />
        <div className="w-48 h-4 bg-surface-subtle rounded mb-2" />
        <div className="w-32 h-3 bg-surface-subtle rounded" />
      </div>
    );
  }

  const hasCV = Boolean(profile?.defaultCvFileId || profile?.cvUrl);

  if (!hasCV) {
    return (
      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-main">
            Hồ sơ đính kèm của bạn
          </h2>
        </div>

        <Link
          href="/cv/personalCV"
          className="border-2 border-dashed border-border-default bg-surface-subtle/60 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/50 hover:bg-primary-light/20 group"
        >
          <div className="w-14 h-14 bg-surface-card rounded-full flex items-center justify-center shadow-xs border border-border-subtle mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud
              size={28}
              className="text-text-subtle group-hover:text-primary transition-colors"
            />
          </div>
          <p className="text-text-secondary mb-3 max-w-sm text-sm">
            Bạn chưa đính kèm CV. Tải lên CV PDF để bóc tách thông minh bằng AI
            và ứng tuyển chỉ với 1 click.
          </p>
          <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:underline text-sm">
            Quản lý hồ sơ đính kèm <ChevronRight size={16} />
          </span>
        </Link>
      </div>
    );
  }

  const defaultCv = profile?.defaultCvFile;
  const cvName =
    defaultCv?.fileName ||
    `CV_ViecNgon_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;

  const uploadDate = formatDateTimeVN(defaultCv?.uploadedAt);
  const fileUrl = defaultCv?.fileUrl || profile?.cvUrl || "#";
  const cvType =
    profile?.defaultCvType === "ONLINE" ? "Tạo từ Website" : "Tải lên từ máy";

  const handleOpenCV = () => {
    if (!isEligibleForCv) {
      toast.error(
        `Hồ sơ hiện đạt ${profileCompletion}%. Cần hoàn thiện tối thiểu ${MIN_PROFILE_COMPLETION_FOR_CV}% để xem hoặc tải CV.`,
      );
      return;
    }
    if (fileUrl && fileUrl !== "#") {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Đường dẫn file chưa sẵn sàng!");
    }
  };

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
        <h2 className="text-lg font-bold text-text-main">
          Hồ sơ đính kèm của bạn
        </h2>
        <Link
          href="/cv/personalCV"
          className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          Quản lý CV <ChevronRight size={14} />
        </Link>
      </div>

      {!isEligibleForCv && (
        <div className="mb-4 rounded-xl border border-warning-border bg-warning-light px-4 py-3 text-xs text-warning-text flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-medium">
            <Lock size={14} className="shrink-0" />
            Hồ sơ hiện đạt {profileCompletion}%. Hoàn thiện tối thiểu{" "}
            {MIN_PROFILE_COMPLETION_FOR_CV}% để xem, tải xuống hoặc dùng CV này
            ứng tuyển.
          </span>
          <Link
            href="/cv-profile"
            className="font-semibold text-primary hover:underline shrink-0"
          >
            Hoàn thiện hồ sơ
          </Link>
        </div>
      )}

      <div
        className={`relative border rounded-xl transition-all duration-200 ${
          isHovered
            ? "border-primary/60 shadow-sm bg-primary-light/15"
            : "border-border-default bg-surface-card"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 sm:p-5 flex items-start gap-4">
          <div className="w-12 h-14 bg-danger-soft text-danger-text rounded-lg flex flex-col items-center justify-center shrink-0 border border-danger-border">
            <FileText size={22} />
            <span className="text-[9px] font-bold mt-0.5 uppercase">PDF</span>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <button
                type="button"
                onClick={handleOpenCV}
                disabled={!isEligibleForCv}
                title={cvName}
                className="font-bold text-text-main text-base truncate hover:text-primary transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:text-text-main"
              >
                {cvName}
              </button>
              <StatusBadge
                type="custom"
                tone="success"
                label="CV chính"
                icon={<CheckCircle2 size={11} />}
              />
            </div>
            <p className="text-xs text-text-muted mb-0.5">
              Cập nhật lần cuối:{" "}
              <span className="font-medium text-text-secondary">
                {uploadDate}
              </span>
            </p>
            <p className="text-xs text-text-subtle">
              Loại: <span className="font-medium">{cvType}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-2.5 bg-surface-subtle/70 border-t border-border-subtle rounded-b-xl">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpenCV}
            disabled={!isEligibleForCv}
          >
            {isEligibleForCv ? <Eye size={15} /> : <Lock size={15} />}
            Xem CV
          </Button>

          {isEligibleForCv ? (
            <a
              href={fileUrl}
              download={cvName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:bg-surface-card border border-transparent hover:border-border-default transition-colors"
            >
              <Download size={15} />
              Tải xuống
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-muted opacity-55 cursor-not-allowed"
            >
              <Lock size={14} />
              Tải xuống
            </button>
          )}

          <button
            type="button"
            onClick={() => toast("Bạn có thể thay đổi CV chính tại mục Hồ sơ ViecNgon.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-danger-text hover:bg-danger-soft transition-colors ml-auto"
          >
            <Trash2 size={15} />
            Gỡ CV
          </button>
        </div>
      </div>
    </div>
  );
}
