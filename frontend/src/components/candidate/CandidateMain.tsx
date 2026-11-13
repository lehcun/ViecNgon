"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Mail,
  ChevronRight,
  Send,
  Sparkles,
  Layers,
} from "lucide-react";
import { CandidateProfileResponse } from "@viecngon/types";
import { useAuthStore } from "@/store/authStore";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import { useAppliedJobs } from "@/hooks/candidate/useAppliedJobs";
import CandidateCVCard from "./CandidateCVCard";
import {
  ErrorState,
  MetricCardSkeleton,
  ProfileHeaderSkeleton,
} from "@/components/ui/StateViews";

export function calculateProfileCompletion(
  profile?: CandidateProfileResponse | null,
): number {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.candidateName || profile.account?.userName),
    Boolean(profile.profession),
    Boolean(profile.account?.phoneNumber),
    Boolean(profile.dateOfBirth),
    Boolean(profile.address),
    Boolean(profile.aboutMe && profile.aboutMe.trim().length > 10),
    Boolean(profile.experiences && profile.experiences.length > 0),
    Boolean(profile.educations && profile.educations.length > 0),
    Boolean(profile.skills && profile.skills.length > 0),
    Boolean(profile.defaultCvFileId || profile.cvUrl),
  ];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

const CandidateMain = () => {
  const { candidateProfile, isLoading, isError } = useCandidateProfile();
  const { appliedJobs } = useAppliedJobs();
  const { user } = useAuthStore();

  const profileCompletion = calculateProfileCompletion(candidateProfile);
  const arcLength = 220;

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
            <img
              src={candidateProfile.avatarUrl}
              alt={displayName}
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
        <div className="shrink-0 relative w-40 h-24 overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-auto">
            <path
              d="M 20 90 A 70 70 0 0 1 180 90"
              fill="none"
              stroke="currentColor"
              className="text-surface-subtle"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 20 90 A 70 70 0 0 1 180 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              strokeLinecap="round"
              className="text-primary transition-all duration-700 ease-out"
              strokeDasharray={arcLength}
              strokeDashoffset={
                arcLength - arcLength * (profileCompletion / 100)
              }
            />
          </svg>
          <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
            <span className="text-2xl font-bold text-text-main leading-none">
              {profileCompletion}%
            </span>
            <span className="text-[11px] text-text-muted font-medium mt-1">
              hoàn thành
            </span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-bold text-text-main mb-1.5">
            Hồ sơ ViecNgon
          </h2>
          <p className="text-text-secondary text-sm mb-3 max-w-md">
            Hoàn thiện ít nhất{" "}
            <span className="font-bold text-primary">70%</span> thông tin hồ sơ
            để tăng độ chính xác khi AI chấm điểm tương thích công việc.
          </p>
          <Link
            href="/cv-profile"
            className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            Nâng cấp hồ sơ <ChevronRight size={16} />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
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
