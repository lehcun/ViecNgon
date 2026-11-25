"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  ThumbsUp,
  Building2,
  Users,
  Clock,
  Globe,
  Award,
  ExternalLink,
  Mail,
  Bell,
  Check,
  Briefcase,
  FileText,
  MessageSquareText,
  ChevronRight,
  Images,
  X,
  CircleDollarSign,
  CheckCircle2,
  Crown,
  Flame,
  Heart,
} from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  useCompanyDetail,
  useCompanyFollow,
  useToggleCompanyFollow,
} from "@/hooks/company/useCompanyDetail";
import { useAuthStore } from "@/store/authStore";
import CompanyJobLists from "./CompanyJobLists";
import CompanyBranchesMap from "./CompanyBranchesMap";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import {
  DetailPaneSkeleton,
  EmptyState,
  ErrorState,
  JobCardSkeleton,
} from "@/components/ui/StateViews";
import { formatDateVN, formatRelativeTimeVN, stripHtmlTags } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type CompanyDetailTab = "about" | "jobs" | "reviews" | "posts";

function CountryFlagIcon({ country }: { country?: string | null }) {
  const normalized = (country || "").toLowerCase();

  if (
    normalized.includes("việt nam") ||
    normalized.includes("vietnam") ||
    normalized.includes("viet nam") ||
    !country
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 rounded-full shrink-0 border border-border-default"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#da251d" />
        <polygon
          points="12,5.5 13.7,10.2 18.6,10.2 14.6,13.1 16.1,17.8 12,14.9 7.9,17.8 9.4,13.1 5.4,10.2 10.3,10.2"
          fill="#ffff00"
        />
      </svg>
    );
  }

  if (
    normalized.includes("hàn") ||
    normalized.includes("korea") ||
    normalized.includes("han quoc")
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 rounded-full shrink-0 border border-border-default"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#ffffff" />
        <path d="M12 7a5 5 0 0 1 0 10 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 0 0-5z" fill="#cd2e3a" />
        <path d="M12 17a5 5 0 0 1 0-10 2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 0 0 5z" fill="#0047a0" />
      </svg>
    );
  }

  if (normalized.includes("nhật") || normalized.includes("japan")) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 rounded-full shrink-0 border border-border-default"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#ffffff" />
        <circle cx="12" cy="12" r="5" fill="#bc002d" />
      </svg>
    );
  }

  if (normalized.includes("singapore")) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 rounded-full shrink-0 border border-border-default"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#ffffff" />
        <path d="M0 12a12 12 0 0 1 24 0z" fill="#ef3340" />
        <circle cx="8" cy="7.5" r="2.5" fill="#ffffff" />
      </svg>
    );
  }

  return <Globe size={15} className="text-primary shrink-0" />;
}

function formatMonthYearVN(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "Gần đây";
  return `Tháng ${d.getMonth() + 1} ${d.getFullYear()}`;
}

export default function CompanyDetailModel() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string);

  const [activeTab, setActiveTab] = useState<CompanyDetailTab>("about");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(() => new Set());

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        toast("Đã bỏ lưu việc làm");
      } else {
        next.add(jobId);
        toast.success("Đã lưu việc làm!");
      }
      return next;
    });
  };

  const { user, isAuthenticated } = useAuthStore();
  const isCandidate = isAuthenticated && user?.role === "UNGVIEN";

  const { company, isLoading, isError, refetch } = useCompanyDetail(slug);
  const { data: followStatus } = useCompanyFollow(company?.id, isCandidate);
  const { mutate: toggleFollow, isPending: isTogglingFollow } =
    useToggleCompanyFollow(company?.id ?? "", slug);

  const isFollowing = followStatus?.isFollowing ?? company?.isFollowing ?? false;
  const followerCount =
    followStatus?.followerCount ?? company?.followerCount ?? 0;

  const handleToggleFollow = () => {
    if (!company?.id) return;
    if (!isAuthenticated) {
      toast("Vui lòng đăng nhập tài khoản Ứng viên để theo dõi công ty.", {
        icon: "🔐",
      });
      return;
    }
    if (user?.role !== "UNGVIEN") {
      toast("Tính năng Theo dõi công ty chỉ dành cho tài khoản Ứng viên.");
      return;
    }
    toggleFollow();
  };

  const handleWriteReview = () => {
    setActiveTab("reviews");
    toast("Chuyển đến mục Đánh giá — tính năng gửi đánh giá mới sẽ sớm mở!");
  };

  if (isLoading) {
    return (
      <div className="bg-surface-page pb-16">
        <div className="bg-primary-dark pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 animate-pulse">
            <div className="w-20 h-20 rounded-xl bg-white/10 shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-8 bg-white/15 rounded w-64" />
              <div className="h-4 bg-white/10 rounded w-48" />
            </div>
          </div>
        </div>
        <div className="bg-surface-card border-b border-border-default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6 animate-pulse">
            <div className="h-4 bg-surface-subtle rounded w-20" />
            <div className="h-4 bg-surface-subtle rounded w-24" />
            <div className="h-4 bg-surface-subtle rounded w-24" />
            <div className="h-4 bg-surface-subtle rounded w-20" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <DetailPaneSkeleton />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28">
        <ErrorState
          title="Không tìm thấy thông tin công ty"
          message="Hồ sơ công ty này hiện không khả dụng hoặc đường dẫn không tồn tại."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const averageRating = company.reviewSummary?.averageRating ?? 4.8;
  const recommendPercent = company.reviewSummary?.recommendPercent ?? 97;
  const totalReviews = company.reviewSummary?.totalReviews ?? 0;
  const latestReview = company.reviewSummary?.latestReview ?? null;
  const totalPosts = company.totalPosts ?? 0;
  const awards = company.awards ?? [];
  const introImages = company.sectionImages?.introImages ?? [];
  const cultureImages = company.sectionImages?.cultureImages ?? [];
  const branches = company.branches ?? [];

  const headerCitiesText =
    company.citiesDisplay || company.city || "Việt Nam";

  const tabs: Array<{
    key: CompanyDetailTab;
    label: string;
    count?: number;
  }> = [
    { key: "about", label: "Giới thiệu" },
    { key: "jobs", label: "Việc làm", count: company.totalJobs },
    { key: "reviews", label: "Đánh giá", count: totalReviews },
    { key: "posts", label: "Bài viết", count: totalPosts },
  ];

  const renderFollowNotificationCard = () => (
    <div className="rounded-xl border border-primary-subtle bg-linear-to-br from-primary-light/85 via-surface-card to-primary-light/40 p-6 shadow-2xs">
      <h3 className="text-base font-bold text-text-primary leading-snug mb-2">
        Nhận thông báo việc làm qua email từ{" "}
        <span className="text-primary">{company.name}</span>
      </h3>
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
        Nhận thông báo qua email khi công ty này đăng việc làm mới phù hợp với
        hồ sơ của bạn.
      </p>
      <button
        type="button"
        onClick={handleToggleFollow}
        disabled={isTogglingFollow}
        className={cn(
          "w-full h-10 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors border",
          isFollowing
            ? "bg-primary text-white border-primary hover:bg-primary-hover"
            : "bg-surface-card text-primary border-primary hover:bg-primary hover:text-white",
        )}
      >
        {isFollowing ? <Check size={16} /> : <Mail size={16} />}
        <span>{isFollowing ? "Đang theo dõi" : "Theo dõi"}</span>
      </button>
      {followerCount > 0 && (
        <p className="mt-2.5 text-center text-xs text-text-muted tabular-nums">
          {followerCount.toLocaleString("vi-VN")} người đang theo dõi
        </p>
      )}
    </div>
  );

  const renderLatestReviewCard = () => (
    <div className="bg-surface-card rounded-xl border border-border-default p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-bold text-text-primary">
          Đánh giá mới nhất
        </h3>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>Xem tất cả</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {latestReview ? (
        <div className="bg-surface-page rounded-xl border border-border-default p-4 space-y-2.5">
          <p className="text-xs text-text-muted italic">
            {formatMonthYearVN(latestReview.createdAt)}
          </p>
          <p className="text-sm font-semibold text-text-primary line-clamp-2">
            {latestReview.title}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={14}
                  fill={
                    idx < Math.round(latestReview.rating)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    idx < Math.round(latestReview.rating)
                      ? "text-amber-400"
                      : "text-border-strong"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-bold text-text-primary tabular-nums">
              {latestReview.rating}
            </span>
          </div>
          {latestReview.recommend && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-success-text pt-0.5">
              <ThumbsUp size={13} />
              <span>Khuyến khích</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface-page rounded-xl border border-dashed border-border-default p-4 text-center space-y-2">
          <MessageSquareText
            size={20}
            className="mx-auto text-text-placeholder"
          />
          <p className="text-sm font-semibold text-text-primary">
            Chưa có đánh giá công khai
          </p>
          <p className="text-xs text-text-muted">
            Hãy là người đầu tiên chia sẻ trải nghiệm làm việc tại {company.name}.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-surface-page pb-16">
      {/* 1. HEADER BANNER - Căn lề max-w-7xl px-4 sm:px-6 lg:px-8 đồng bộ tuyệt đối với Navbar */}
      <section className="bg-linear-to-br from-primary-dark via-[#13294b] to-primary-dark pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5 min-w-0">
            <CompanyLogo src={company.logo} name={company.name} size="xl" />
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-primary-disabled shrink-0" />
                  <span>{headerCitiesText}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2
                    size={15}
                    className="text-primary-disabled shrink-0"
                  />
                  <span className="tabular-nums">
                    {company.totalJobs} việc làm đang tuyển dụng
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("jobs")}
                  className="h-9 inline-flex items-center px-4 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Xem việc làm đang tuyển
                </button>
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={isTogglingFollow}
                  className="h-9 inline-flex items-center gap-1.5 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-sm font-semibold rounded-lg transition-colors"
                >
                  {isFollowing ? <Check size={15} /> : <Bell size={15} />}
                  <span>{isFollowing ? "Đang theo dõi" : "Theo dõi"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 flex gap-6 border border-white/15 shrink-0">
            <div className="text-center">
              <div className="flex items-end gap-1.5 justify-center">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {averageRating}
                </span>
                <div className="flex text-amber-400 pb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1">Đánh giá tích cực</p>
            </div>
            <div className="w-px bg-white/15" />
            <div className="text-center flex flex-col justify-center">
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                {recommendPercent}%
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Khuyên làm việc tại đây
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THANH 4 TABS NAVIGATION (GIỚI THIỆU / VIỆC LÀM / ĐÁNH GIÁ / BÀI VIẾT) */}
      <div className="bg-surface-card border-b border-border-default sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Điều hướng chi tiết công ty"
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative py-3.5 text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2 border-b-2 transition-colors",
                    isActive
                      ? "text-primary border-primary"
                      : "text-text-secondary border-transparent hover:text-text-primary",
                  )}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold tabular-nums",
                        isActive
                          ? "bg-primary-light text-primary"
                          : "bg-surface-muted text-text-muted",
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2.5 py-2">
            <button
              type="button"
              onClick={handleWriteReview}
              className="h-9 px-3.5 rounded-lg text-xs font-semibold border border-border-default text-text-primary hover:bg-surface-muted transition-colors"
            >
              Viết đánh giá
            </button>
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={isTogglingFollow}
              className={cn(
                "h-9 px-3.5 rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-1.5",
                isFollowing
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-card text-primary border-primary hover:bg-primary-light",
              )}
            >
              {isFollowing ? <Check size={14} /> : <Bell size={14} />}
              <span>{isFollowing ? "Đang theo dõi" : "Theo dõi"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {activeTab === "about" && (
            <>
              {/* Thông tin chung (Fix cứng 1 dòng gọn gàng + thanh dọc xanh & linear giảm dần dưới Title) */}
              <div className="bg-surface-card rounded-xl border border-border-default p-6">
                <div className="pb-3.5 mb-5 border-b border-dashed border-border-default">
                  <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                    Thông tin chung
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6 text-sm">
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Building2 size={14} /> Mô hình công ty
                    </p>
                    <p
                      className="font-semibold text-text-primary truncate"
                      title={company.companyModel || "Chưa cập nhật"}
                    >
                      {company.companyModel || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Briefcase size={14} /> Lĩnh vực công ty
                    </p>
                    <p
                      className="font-semibold text-text-primary truncate"
                      title={company.industry || "Công nghệ thông tin"}
                    >
                      {company.industry || "Công nghệ thông tin"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Users size={14} /> Quy mô công ty
                    </p>
                    <p
                      className="font-semibold text-text-primary truncate"
                      title={company.size || "Chưa cập nhật"}
                    >
                      {company.size || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Globe size={14} /> Quốc gia
                    </p>
                    <div
                      className="font-semibold text-text-primary flex items-center gap-2 min-w-0"
                      title={company.country || "Việt Nam"}
                    >
                      <CountryFlagIcon country={company.country} />
                      <span className="truncate">
                        {company.country || "Việt Nam"}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Clock size={14} /> Thời gian làm việc
                    </p>
                    <p
                      className="font-semibold text-text-primary truncate"
                      title={company.workingTime ?? "Thứ 2 - Thứ 6"}
                    >
                      {company.workingTime ?? "Thứ 2 - Thứ 6"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Clock size={14} /> Làm việc ngoài giờ
                    </p>
                    <p
                      className="font-semibold text-text-primary truncate"
                      title={company.otPolicy ?? "Không có OT"}
                    >
                      {company.otPolicy ?? "Không có OT"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Giải thưởng (Background gradient ấm sang trọng kèm watermark) */}
              <div className="relative overflow-hidden rounded-xl border border-amber-300/80 bg-linear-to-br from-amber-50/90 via-[#fffaf0] to-orange-50/75 p-6">
                {/* Họa tiết trang trí góc phải dưới */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -bottom-6 text-amber-500/12"
                >
                  <Award size={180} strokeWidth={1.2} />
                </div>

                <h2 className="relative text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
                  <Award size={20} className="text-amber-600" />
                  <span>Giải thưởng</span>
                </h2>

                <div className="relative space-y-2.5">
                  {awards.map((awardTitle, index) => (
                    <div
                      key={`${awardTitle}-${index}`}
                      className="flex items-center justify-between bg-surface-card px-4 py-3.5 rounded-lg border border-amber-100/90 shadow-2xs gap-4"
                    >
                      <div className="font-semibold text-text-primary text-sm flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                          <Award size={16} />
                        </div>
                        <span className="truncate">{awardTitle}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                        <span className="inline-flex items-center gap-1 text-text-primary tabular-nums">
                          <Star
                            size={14}
                            className="text-amber-400"
                            fill="currentColor"
                          />
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-success-text tabular-nums">
                          <ThumbsUp size={14} /> {recommendPercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="relative mt-4 text-xs text-text-secondary leading-relaxed">
                  Ghi nhận từ cộng đồng ứng viên &amp; nhân sự công nghệ về môi
                  trường làm việc nổi bật trên ViecNgon.
                </p>
              </div>

              {/* Giới thiệu công ty + Ảnh văn phòng/đội ngũ */}
              <div className="bg-surface-card rounded-xl border border-border-default p-6">
                <div className="pb-3.5 mb-5 border-b border-dashed border-border-default">
                  <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                    Giới thiệu công ty
                  </h2>
                </div>

                {company.description ? (
                  <div
                    className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: company.description }}
                  />
                ) : (
                  <p className="text-sm text-text-muted italic mb-6">
                    Chưa có mô tả chi tiết về công ty.
                  </p>
                )}

                {introImages.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Images size={14} className="text-primary" />
                      Không gian &amp; Hình ảnh công ty
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {introImages.map((imgUrl, idx) => (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          onClick={() => setLightboxImage(imgUrl)}
                          className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-surface-muted group"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Hình ảnh ${company.name} ${idx + 1}`}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, 260px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {company.website && (
                  <div className="bg-surface-page border border-border-default rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-0.5">
                        <Globe size={16} className="text-primary" /> Website
                        chính thức
                      </h3>
                      <p className="text-xs text-text-muted">
                        Tìm hiểu thêm về sản phẩm và văn hóa doanh nghiệp
                      </p>
                    </div>
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 inline-flex items-center gap-1.5 px-4 bg-surface-card border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors shrink-0"
                    >
                      <span>Truy cập website</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Chuyên môn của chúng tôi */}
              {(company.expertise || company.skills.length > 0) && (
                <div className="bg-surface-card rounded-xl border border-border-default p-6">
                  <div className="pb-3.5 mb-5 border-b border-dashed border-border-default">
                    <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                      Chuyên môn của chúng tôi
                    </h2>
                  </div>
                  {company.expertise && company.expertise.includes("<") ? (
                    <div
                      className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: company.expertise }}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {company.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-light text-primary border border-primary-subtle"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Phúc lợi & Văn hóa */}
              {(company.benefits || cultureImages.length > 0) && (
                <div className="bg-surface-card rounded-xl border border-border-default p-6">
                  <div className="pb-3.5 mb-5 border-b border-dashed border-border-default">
                    <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                      Phúc lợi &amp; Đãi ngộ
                    </h2>
                  </div>
                  {company.benefits && (
                    <div
                      className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: company.benefits }}
                    />
                  )}
                  {cultureImages.length > 0 && (
                    <div className={company.benefits ? "mt-6" : ""}>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Images size={14} className="text-primary" />
                        Hoạt động văn hóa &amp; Sự kiện
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {cultureImages.map((imgUrl, idx) => (
                          <button
                            key={`${imgUrl}-${idx}`}
                            type="button"
                            onClick={() => setLightboxImage(imgUrl)}
                            className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-surface-muted group"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Văn hóa ${company.name} ${idx + 1}`}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 50vw, 260px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Về chúng tôi */}
              {company.aboutMe && (
                <div className="bg-surface-card rounded-xl border border-border-default p-6">
                  <div className="pb-3.5 mb-5 border-b border-dashed border-border-default">
                    <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                      Văn hóa &amp; Con người
                    </h2>
                  </div>
                  <div
                    className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: company.aboutMe }}
                  />
                </div>
              )}

              {/* Địa điểm & Bản đồ chi nhánh */}
              <CompanyBranchesMap
                branches={branches}
                companyName={company.name}
              />
            </>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-4">
              {company.activeJobs.length === 0 ? (
                <div className="bg-surface-card rounded-xl border border-border-default p-6">
                  <EmptyState
                    icon={<Briefcase size={22} />}
                    title="Chưa có vị trí đang tuyển"
                    description="Hiện tại doanh nghiệp này chưa có tin tuyển dụng mở. Hãy theo dõi để nhận email khi có tin mới."
                    actionLabel="Xem việc làm khác"
                    actionHref="/jobs"
                  />
                </div>
              ) : (
                company.activeJobs.map((job) => {
                  const badge =
                    job.promotionBadge ??
                    ((job.priorityLevel ?? 0) >= 4
                      ? "DIAMOND"
                      : (job.priorityLevel ?? 0) === 3
                        ? "SUPER_HOT"
                        : (job.priorityLevel ?? 0) === 2
                          ? "HOT"
                          : null);
                  const isWarm =
                    badge === "SUPER_HOT" ||
                    badge === "DIAMOND" ||
                    badge === "HOT";
                  const highlights =
                    job.highlights && job.highlights.length > 0
                      ? job.highlights
                      : job.benefits
                        ? stripHtmlTags(job.benefits)
                            .split(/[;\n•]+/)
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .slice(0, 3)
                        : [];
                  const isSaved = savedJobIds.has(job.id);

                  return (
                    <article
                      key={job.id}
                      className={cn(
                        "relative rounded-xl border p-5 sm:p-6 transition-all hover:shadow-md hover:border-primary/50",
                        isWarm
                          ? "bg-[#FFF5EE] border-vip-border"
                          : "bg-surface-card border-border-default",
                      )}
                    >
                      {/* Ribbon góc trên bên phải */}
                      <div className="absolute top-3 -right-1.5 z-10 select-none">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-l-md rounded-tr-md text-[11px] font-bold tracking-wide uppercase shadow-xs",
                            badge === "DIAMOND"
                              ? "bg-ai text-white"
                              : badge === "SUPER_HOT"
                                ? "bg-danger text-white"
                                : badge === "HOT"
                                  ? "bg-vip text-white"
                                  : "bg-primary text-white",
                          )}
                        >
                          {badge === "DIAMOND" && <Crown size={11} />}
                          {badge === "SUPER_HOT" && (
                            <Flame size={11} className="fill-warning-light" />
                          )}
                          {badge === "HOT" && <Flame size={11} />}
                          <span>
                            {badge === "DIAMOND"
                              ? "DIAMOND"
                              : badge === "SUPER_HOT"
                                ? "SUPER HOT"
                                : badge === "HOT"
                                  ? "HOT"
                                  : "MỚI ĐĂNG"}
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "block ml-auto w-0 h-0 border-t-[6px] border-r-[6px] border-r-transparent",
                            badge === "DIAMOND"
                              ? "border-t-indigo-900"
                              : badge === "SUPER_HOT"
                                ? "border-t-danger-hover"
                                : badge === "HOT"
                                  ? "border-t-orange-800"
                                  : "border-t-primary-active",
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Nửa trái: Thời gian đăng, Tên Job, Lương, Level/Hình thức, Skills */}
                        <div
                          className={cn(
                            "min-w-0",
                            highlights.length > 0
                              ? "md:col-span-7"
                              : "md:col-span-12",
                          )}
                        >
                          <p className="text-xs text-text-muted mb-1.5 pr-28">
                            Đăng {formatRelativeTimeVN(job.postedAt)}
                          </p>

                          <Link
                            href={`/jobs/${job.slug}`}
                            className="text-lg font-bold text-text-primary hover:text-primary transition-colors line-clamp-2 leading-snug block pr-20 md:pr-4"
                          >
                            {job.title}
                          </Link>

                          <div className="mt-2.5 flex items-center gap-1.5 text-sm font-bold text-success-text tabular-nums">
                            <CircleDollarSign
                              size={16}
                              className="text-success shrink-0"
                            />
                            <span>{job.salaryDisplay || "Thỏa thuận"}</span>
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                            {job.level && (
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <Briefcase
                                  size={13}
                                  className="text-text-placeholder shrink-0"
                                />
                                <span className="underline decoration-border-strong underline-offset-2">
                                  {job.level}
                                </span>
                              </span>
                            )}
                            {job.level && job.workModel && (
                              <span className="text-text-placeholder">•</span>
                            )}
                            {job.workModel && (
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Building2
                                  size={13}
                                  className="text-text-placeholder shrink-0"
                                />
                                <span>{job.workModel}</span>
                              </span>
                            )}
                          </div>

                          {job.skills.length > 0 && (
                            <div className="mt-3.5 flex flex-wrap gap-1.5">
                              {job.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs font-medium bg-surface-card text-text-secondary border border-border-default px-2.5 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="text-xs font-medium bg-surface-card text-text-muted border border-border-default px-2 py-0.5 rounded-full">
                                  +{job.skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Nửa phải: Highlights phúc lợi nổi bật */}
                        {highlights.length > 0 && (
                          <div className="md:col-span-5 md:pt-7 md:border-l md:border-dashed md:border-border-default md:pl-5 flex flex-col justify-center gap-2">
                            {highlights.map((item, idx) => (
                              <div
                                key={`${job.id}-hl-${idx}`}
                                className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed"
                              >
                                <CheckCircle2
                                  size={14}
                                  className="text-primary shrink-0 mt-0.5"
                                />
                                <span className="line-clamp-2">{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer: Thành phố + Nút Lưu việc này */}
                      <div className="mt-4 pt-3 border-t border-border-default/80 flex items-center justify-between gap-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-text-secondary font-medium">
                          <MapPin
                            size={13}
                            className="text-text-placeholder shrink-0"
                          />
                          <span>{job.location || "Việt Nam"}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleSaveJob(job.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 font-medium transition-colors",
                            isSaved
                              ? "text-danger"
                              : "text-text-muted hover:text-danger",
                          )}
                        >
                          <span>{isSaved ? "Đã lưu" : "Lưu việc này"}</span>
                          <Heart
                            size={15}
                            fill={isSaved ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-dashed border-border-default">
                <h2 className="flex-1 min-w-0 border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                  Đánh giá từ nhân viên ({totalReviews})
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1 font-bold text-text-primary tabular-nums">
                    <Star
                      size={16}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                    {averageRating}/5
                  </span>
                  <span className="text-success-text font-semibold tabular-nums">
                    {recommendPercent}% Khuyên làm việc
                  </span>
                </div>
              </div>

              {(company.reviews?.length ?? 0) === 0 ? (
                <EmptyState
                  icon={<MessageSquareText size={22} />}
                  title="Chưa có đánh giá nào"
                  description={`Hiện chưa có bài đánh giá công khai cho ${company.name}.`}
                  actionLabel="Xem thông tin công ty"
                  onAction={() => setActiveTab("about")}
                />
              ) : (
                <div className="space-y-4">
                  {company.reviews?.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-border-default bg-surface-page p-5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-text-muted">
                          {formatMonthYearVN(review.createdAt)} ·{" "}
                          {formatDateVN(review.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                fill={
                                  i < Math.round(review.rating)
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  i < Math.round(review.rating)
                                    ? "text-amber-400"
                                    : "text-border-strong"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold tabular-nums text-text-primary">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-text-primary">
                        {review.title}
                      </h3>
                      {review.content && (
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {review.content}
                        </p>
                      )}
                      {review.pros && (
                        <p className="text-xs text-text-secondary">
                          <strong className="text-success-text">
                            Điểm cộng:
                          </strong>{" "}
                          {review.pros}
                        </p>
                      )}
                      {review.cons && (
                        <p className="text-xs text-text-secondary">
                          <strong className="text-warning-text">
                            Cần cải thiện:
                          </strong>{" "}
                          {review.cons}
                        </p>
                      )}
                      {review.recommend && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-success-text pt-1">
                          <ThumbsUp size={13} />
                          <span>Khuyên làm việc tại đây</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "posts" && (
            <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-5">
              <div className="pb-3.5 border-b border-dashed border-border-default">
                <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
                  Bài viết &amp; Tin tức ({totalPosts})
                </h2>
              </div>

              {(company.posts?.length ?? 0) === 0 ? (
                <EmptyState
                  icon={<FileText size={22} />}
                  title="Chưa có bài viết nào"
                  description={`${company.name} hiện chưa đăng bài viết chia sẻ nào.`}
                  actionLabel="Quay lại Giới thiệu"
                  onAction={() => setActiveTab("about")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.posts?.map((post) => (
                    <article
                      key={post.id}
                      className="rounded-xl border border-border-default bg-surface-page overflow-hidden flex flex-col"
                    >
                      {post.coverUrl && (
                        <div className="relative h-40 w-full bg-surface-muted">
                          <Image
                            src={post.coverUrl}
                            alt={post.title}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 380px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                        <div>
                          <p className="text-xs text-text-muted mb-1">
                            {formatDateVN(post.publishedAt)}
                          </p>
                          <h3 className="text-base font-bold text-text-primary line-clamp-2 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CỘT PHẢI (4/12): CAROUSEL VIỆC LÀM + ĐÁNH GIÁ MỚI NHẤT + THEO DÕI */}
        <div id="company-jobs" className="lg:col-span-4 min-w-0">
          <div className="sticky top-36 space-y-6">
            {activeTab === "about" && company.totalJobs > 0 && (
              <CompanyJobLists
                totalJobs={company.totalJobs}
                jobs={company.activeJobs}
              />
            )}
            {renderLatestReviewCard()}
            {renderFollowNotificationCard()}
          </div>
        </div>
      </section>

      {/* Lightbox xem ảnh lớn */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            aria-label="Đóng ảnh"
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage}
              alt="Xem ảnh công ty"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
