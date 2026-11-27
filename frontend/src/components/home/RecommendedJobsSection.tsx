"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  ChevronRight,
  CircleDollarSign,
  Flame,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { JobPromotionBadge, RecommendedJobItem } from "@viecngon/types";
import { useAuthStore } from "@/store/authStore";
import { useRecommendedJobs } from "@/hooks/job/useRecommendedJobs";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

const INITIAL_VISIBLE_COUNT = 8;

function formatPostedRelative(isoDate: string): string {
  const past = new Date(isoDate);
  if (Number.isNaN(past.getTime())) return "Mới đăng";
  const diffMs = Date.now() - past.getTime();
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffHours < 1) return "Đăng vừa xong";
  if (diffHours < 24) return `Đăng ${diffHours} giờ trước`;
  if (diffDays <= 30) return `Đăng ${diffDays} ngày trước`;
  return `Đăng ${Math.floor(diffDays / 30)} tháng trước`;
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

function getBadgeConfig(badge: JobPromotionBadge | null): {
  label: string;
  ribbonClass: string;
  showFlame?: boolean;
  highlightCard?: boolean;
} | null {
  if (!badge || badge === "BASIC") return null;

  switch (badge) {
    case "DIAMOND":
      return {
        label: "DIAMOND",
        ribbonClass: "bg-ai text-white",
        highlightCard: true,
      };
    case "SUPER_HOT":
      return {
        label: "SUPER HOT",
        ribbonClass: "bg-danger text-white",
        showFlame: true,
        highlightCard: true,
      };
    case "HOT":
      return {
        label: "HOT",
        ribbonClass: "bg-vip text-white",
        highlightCard: false,
      };
    case "HEADHUNT":
      return {
        label: "HEADHUNT",
        ribbonClass: "bg-ai text-white",
        highlightCard: false,
      };
    default:
      return null;
  }
}

function RecommendedJobCard({ job }: { job: RecommendedJobItem }) {
  const badgeConfig = getBadgeConfig(job.promotionBadge);
  const visibleSkills = job.skills.slice(0, 3);
  const extraSkillsCount = Math.max(0, job.skills.length - 3);

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        badgeConfig?.highlightCard
          ? "bg-vip-light/35 border-vip-border/80 hover:border-vip"
          : "bg-surface-card border-border-default hover:border-primary/50"
      }`}
    >
      {/* Badge góc trên phải (SUPER HOT / HOT / DIAMOND / HEADHUNT) */}
      {badgeConfig && (
        <span
          className={`absolute top-0 right-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-bl-lg rounded-tr-xl text-[10px] font-bold tracking-wide uppercase shadow-xs ${badgeConfig.ribbonClass}`}
        >
          {badgeConfig.showFlame && <Flame size={11} />}
          {badgeConfig.label}
        </span>
      )}

      <div>
        <p className="text-[11px] font-medium text-text-muted mb-2 pr-20">
          {formatPostedRelative(job.postedAt)}
        </p>

        <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 min-h-10 leading-snug">
          {job.title}
        </h3>

        {/* Logo + Tên công ty */}
        <div className="flex items-center gap-2.5 mt-3">
          {isValidImageSrc(job.company.logo) ? (
            <div className="relative w-9 h-9 rounded-lg border border-border-default bg-surface-card overflow-hidden shrink-0">
              <Image
                src={job.company.logo}
                alt={job.company.name}
                fill
                unoptimized
                sizes="36px"
                className="object-contain p-1"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg border border-primary-subtle bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">
              {job.company.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-xs font-medium text-text-secondary truncate">
            {job.company.name}
          </span>
        </div>

        {/* Mức lương */}
        <div className="mt-3 pt-3 border-t border-dashed border-border-default">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-success-text">
            <CircleDollarSign size={14} className="shrink-0" />
            <span className="truncate">{job.salaryDisplay}</span>
          </div>

          <div className="mt-2 space-y-1 text-xs text-text-muted">
            {job.level && (
              <div className="flex items-center gap-1.5">
                <Briefcase size={13} className="shrink-0 text-text-placeholder" />
                <span className="truncate">{job.level}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0 text-text-placeholder" />
              <span className="truncate">
                {[job.workModel, job.location].filter(Boolean).join(" · ") ||
                  "Toàn quốc"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill pills (tối đa 3 + +N) */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-2">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-card border border-border-default text-text-secondary max-w-28 truncate"
            >
              {skill}
            </span>
          ))}
          {extraSkillsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-muted text-text-secondary border border-border-default">
              +{extraSkillsCount}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

export default function RecommendedJobsSection() {
  const { isAuthenticated, user } = useAuthStore();
  const isCandidate = isAuthenticated && user?.role === "UNGVIEN";
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading, isError } = useRecommendedJobs(isCandidate, 12);

  // Chỉ hiển thị cho Ứng viên đang đăng nhập
  if (!isCandidate) return null;
  if (isError) return null;

  if (isLoading) {
    return (
      <section className="w-full py-12 bg-surface-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-80 bg-surface-subtle rounded-lg mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border-default bg-surface-card p-4 space-y-3 animate-pulse"
              >
                <div className="h-3 w-24 bg-surface-muted rounded" />
                <div className="h-10 w-full bg-surface-subtle rounded" />
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle shrink-0" />
                  <div className="h-3.5 w-32 bg-surface-muted rounded" />
                </div>
                <div className="h-4 w-28 bg-surface-subtle rounded pt-2" />
                <div className="flex gap-1.5 pt-2">
                  <div className="h-5 w-16 bg-surface-muted rounded-full" />
                  <div className="h-5 w-16 bg-surface-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = data?.items ?? [];
  if (items.length === 0) return null;

  const visibleItems = expanded
    ? items
    : items.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = Math.max(0, items.length - INITIAL_VISIBLE_COUNT);
  const displayName = data?.candidateName || user?.name || "bạn";

  return (
    <section
      aria-label="Việc làm IT phù hợp dành cho bạn"
      className="w-full py-12 bg-surface-card border-b border-border-default"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {items.length} Việc làm IT &ldquo;Ngon&rdquo; dành cho{" "}
            <span className="bg-linear-to-r from-primary to-ai bg-clip-text text-transparent font-extrabold">
              {displayName}
            </span>
          </h2>

          {data?.needsProfileSetup && (
            <p className="mt-2 text-xs sm:text-sm text-text-muted inline-flex items-center gap-1.5">
              <Sparkles size={14} className="text-ai" />
              <span>
                Cập nhật kỹ năng &amp; chuyên môn trong{" "}
                <Link
                  href="/cv-profile"
                  className="font-semibold text-primary hover:underline"
                >
                  Hồ sơ ứng viên
                </Link>{" "}
                để nhận gợi ý sát hơn.
              </span>
            </p>
          )}
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleItems.map((job) => (
            <RecommendedJobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {!expanded && remainingCount > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-lg border border-primary/40 bg-surface-card hover:bg-primary-light text-primary text-sm font-semibold transition-colors"
            >
              <span>Xem thêm {remainingCount} công việc khác</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-lg border border-primary/40 bg-surface-card hover:bg-primary-light text-primary text-sm font-semibold transition-colors"
            >
              <span>Xem tất cả việc làm IT</span>
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
