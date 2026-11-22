"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Mail,
  ChevronRight,
  Send,
  Sparkles,
  Layers,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import { useAppliedJobs } from "@/hooks/candidate/useAppliedJobs";
import {
  calculateProfileCompletion,
  MIN_PROFILE_COMPLETION_FOR_CV,
} from "@/lib/candidate-completion";
import CandidateCVCard from "./CandidateCVCard";
import ProfileCompletionGauge from "./ProfileCompletionGauge";
import {
  ErrorState,
  MetricCardSkeleton,
  ProfileHeaderSkeleton,
} from "@/components/ui/StateViews";

export { calculateProfileCompletion };

const CandidateMain = () => {
  const { candidateProfile, isLoading, isError } = useCandidateProfile();
  const { appliedJobs } = useAppliedJobs();
  const { user } = useAuthStore();

  const profileCompletion = calculateProfileCompletion(candidateProfile);
  const isEligibleForCv =
    profileCompletion >= MIN_PROFILE_COMPLETION_FOR_CV;

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <ProfileHeaderSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <div className="h-44 bg-surface-card rounded-xl border border-border-default p-6 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Không thể tải thông tin hồ sơ ứng viên. Vui lòng thử đăng nhập lại."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const displayName =
    candidateProfile?.candidateName ||
    candidateProfile?.account?.userName ||
    user?.name ||
    "Ứng viên";
  const displayProfession =
    candidateProfile?.profession || "Chưa cập nhật chuyên môn";
  const displayEmail =
    candidateProfile?.account?.email || user?.email || "Chưa cập nhật email";

  const appliedCount = appliedJobs.length;
  const skillsCount = candidateProfile?.skills?.length ?? 0;
  const experiencesCount = candidateProfile?.experiences?.length ?? 0;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="shrink-0">
          {candidateProfile?.avatarUrl ? (
            <Image
              src={candidateProfile.avatarUrl}
              alt={displayName}
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 rounded-full object-cover border border-border-default shadow-xs"
            />
          ) : (
            <div className="w-20 h-20 bg-primary text-white text-2xl font-bold flex items-center justify-center rounded-full shadow-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-2 truncate">
            {displayName}
          </h1>
          <div className="space-y-1.5 text-text-secondary text-sm">
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Briefcase size={16} className="text-text-subtle shrink-0" />
              <span className="truncate">{displayProfession}</span>
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Mail size={16} className="text-text-subtle shrink-0" />
              <span className="truncate">{displayEmail}</span>
            </p>
          </div>
          <Link
            href="/cv-profile"
            className="inline-flex items-center gap-1 text-sm text-primary font-semibold mt-4 hover:underline"
          >
            Cập nhật hồ sơ <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <CandidateCVCard />

      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <ProfileCompletionGauge
          percentage={profileCompletion}
          className="shrink-0"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-bold text-text-main mb-1.5">
            Hồ sơ ViecNgon
          </h2>
          <p className="text-text-secondary text-sm mb-3 max-w-md">
            Hoàn thiện tối thiểu{" "}
            <span className="font-bold text-primary">
              {MIN_PROFILE_COMPLETION_FOR_CV}%
            </span>{" "}
            thông tin hồ sơ để mở khóa tạo CV, xem CV, dùng CV hệ thống ứng
            tuyển và chấm điểm AI Match.
          </p>
          <Link
            href="/cv-profile"
            className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            Nâng cấp hồ sơ <ChevronRight size={16} />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isEligibleForCv ? (
            <Link
              href="/cv-template"
              className="w-28 h-32 border border-border-default rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary-light/40 transition-colors group bg-surface-subtle/50 p-3 text-center"
            >
              <div className="w-9 h-9 rounded-full border-2 border-primary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <ChevronRight size={16} className="ml-0.5" />
              </div>
              <span className="text-xs text-primary font-semibold leading-tight">
                Xem &amp; tải mẫu CV
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() =>
                toast.error(
                  `Hồ sơ hiện đạt ${profileCompletion}%. Cần tối thiểu ${MIN_PROFILE_COMPLETION_FOR_CV}% để tạo và xem CV.`,
                )
              }
              title={`Cần tối thiểu ${MIN_PROFILE_COMPLETION_FOR_CV}% hồ sơ để tạo và xem CV`}
              className="w-28 h-32 border border-border-default rounded-xl flex flex-col items-center justify-center gap-1.5 bg-surface-subtle/60 p-3 text-center opacity-70 cursor-not-allowed"
            >
              <div className="w-9 h-9 rounded-full border border-border-strong text-text-muted bg-surface-card flex items-center justify-center">
                <Lock size={15} />
              </div>
              <span className="text-xs text-text-muted font-semibold leading-tight">
                Xem &amp; tải mẫu CV
              </span>
              <span className="text-[10px] font-medium text-warning-text">
                Cần ≥ {MIN_PROFILE_COMPLETION_FOR_CV}%
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg font-bold text-text-main mb-5">
          Hoạt động của bạn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/my-jobs/applied"
            className="bg-primary-light border border-primary/15 rounded-xl p-5 relative overflow-hidden h-30 flex flex-col justify-between group hover:shadow-sm transition-shadow"
          >
            <span className="text-sm font-semibold text-text-main relative z-10 group-hover:text-primary transition-colors">
              Việc làm đã ứng tuyển
            </span>
            <span className="text-3xl font-bold text-primary relative z-10">
              {appliedCount}
            </span>
            <Send className="absolute -bottom-2 -right-2 w-14 h-14 text-primary/15 -rotate-12 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/cv-profile"
            className="bg-ai-light border border-ai-border rounded-xl p-5 relative overflow-hidden h-30 flex flex-col justify-between group hover:shadow-sm transition-shadow"
          >
            <span className="text-sm font-semibold text-text-main relative z-10 group-hover:text-ai transition-colors">
              Kỹ năng chuyên môn
            </span>
            <span className="text-3xl font-bold text-ai relative z-10">
              {skillsCount}
            </span>
            <Sparkles className="absolute -bottom-2 -right-2 w-14 h-14 text-ai/15 -rotate-12 group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/cv-profile"
            className="bg-success-light border border-success-border rounded-xl p-5 relative overflow-hidden h-30 flex flex-col justify-between group hover:shadow-sm transition-shadow"
          >
            <span className="text-sm font-semibold text-text-main relative z-10 group-hover:text-success-text transition-colors">
              Mốc kinh nghiệm
            </span>
            <span className="text-3xl font-bold text-success-text relative z-10">
              {experiencesCount}
            </span>
            <Layers className="absolute -bottom-2 -right-2 w-14 h-14 text-success/15 -rotate-12 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateMain;
