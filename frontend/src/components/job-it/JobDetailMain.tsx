"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Eye,
  Send,
  CheckCircle,
  Heart,
  Share2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";
import { formatDateVN, formatRelativeTimeVN } from "@/lib/formatters";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DetailPaneSkeleton, ErrorState } from "@/components/ui/StateViews";
import { useAuthStore } from "@/store/authStore";
import { useRelatedJobs } from "@/hooks/job/useJobDetail";
import toast from "react-hot-toast";

interface JobDetailMainProps {
  job?: JobDetailResponse;
  isLoading?: boolean;
}

export default function JobDetailMain({
  job,
  isLoading = false,
}: JobDetailMainProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);

  const { relatedJobs, isLoading: isRelatedLoading } = useRelatedJobs(
    job?.slug || job?.id || "",
  );

  // 1. SKELETON LOADING STATE
  if (isLoading) {
    return <DetailPaneSkeleton />;
  }

  // 2. ERROR / NOT FOUND STATE
  if (!job) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Không tìm thấy công việc"
          message="Công việc này có thể đã hết hạn nhận hồ sơ hoặc đã được nhà tuyển dụng gỡ xuống."
        />
        <div className="text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <span>Khám phá việc làm khác</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // 3. HANDLERS
  const handleApplyClick = () => {
    const applyPath = `/job-it/${job.slug}/job_applications`;
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để ứng tuyển công việc này!");
      router.push(`/login?callbackUrl=${encodeURIComponent(applyPath)}`);
      return;
    }
    router.push(applyPath);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    }
  };

  // Helper render content (hỗ trợ cả HTML và văn bản thuần)
  const renderFormattedContent = (content?: string | null) => {
    if (!content) {
      return (
        <p className="text-slate-400 italic text-sm">
          Chưa có thông tin chi tiết.
        </p>
      );
    }

    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content);
    if (hasHtmlTags) {
      return (
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base prose-headings:font-bold prose-a:text-primary hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return (
      <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
        {content}
      </div>
    );
  };

  // Format hạn nộp hồ sơ
  const formatDeadline = (dateString?: Date | string | null) => {
    return formatDateVN(dateString, "Tuyển liên tục");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* ========================================================
            CARD 1: HEADER CÔNG VIỆC + NÚT ỨNG TUYỂN
        ======================================================== */}
        <div className="bg-surface-card rounded-xl shadow-xs border border-border-default p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                {job.title}
              </h1>
              <p className="text-sm sm:text-base font-medium text-text-muted mt-1.5 line-clamp-1">
                {job.company?.name}
              </p>
            </div>
            <CompanyLogo
              src={job.company?.logo}
              name={job.company?.name}
              size="lg"
            />
          </div>

          {/* Mức lương nổi bật */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-success-light text-success-text border border-success-border rounded-lg font-bold text-base sm:text-lg tabular-nums">
            <DollarSign size={19} className="-ml-0.5 shrink-0" />
            <span>{job.salaryDisplay}</span>
          </div>

          {/* Nút Ứng tuyển & Lưu tin */}
          <div className="flex items-center gap-3 mt-6">
            {job.isApplied ? (
              <div className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-base border border-emerald-200">
                <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                <span>
                  Đã ứng tuyển {job.applicationStatus ? `(${job.applicationStatus})` : ""}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApplyClick}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-md shadow-primary/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Send size={18} />
                <span>Ứng tuyển ngay</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`p-3.5 border rounded-xl transition-all cursor-pointer ${isSaved
                ? "border-rose-400 bg-rose-50 text-rose-500"
                : "border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-400 bg-white"
                }`}
              title={isSaved ? "Bỏ lưu việc" : "Lưu việc làm"}
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-3.5 border border-slate-200 text-slate-400 hover:border-primary hover:text-primary rounded-xl transition-all bg-white cursor-pointer"
              title="Sao chép liên kết"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Lưới Thông số Chi tiết */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs sm:text-sm">
            {/* Địa điểm */}
            <div className="flex items-start gap-2.5 text-slate-600">
              <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Địa điểm</p>
                <p className="font-semibold text-slate-800 line-clamp-1">
                  {job.location || "Toàn quốc"}
                </p>
              </div>
            </div>

            {/* Hình thức làm việc */}
            <div className="flex items-start gap-2.5 text-slate-600">
              <Briefcase size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Hình thức</p>
                <p className="font-semibold text-slate-800">
                  {job.workModel || "Toàn thời gian"}
                </p>
              </div>
            </div>

            {/* Cấp bậc */}
            <div className="flex items-start gap-2.5 text-slate-600">
              <Award size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Cấp bậc</p>
                <p className="font-semibold text-slate-800">
                  {job.level || "Không yêu cầu"}
                </p>
              </div>
            </div>

            {/* Kinh nghiệm */}
            <div className="flex items-start gap-2.5 text-slate-600">
              <Sparkles size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Kinh nghiệm</p>
                <p className="font-semibold text-slate-800">
                  {job.experience !== null && job.experience !== undefined
                    ? `${job.experience} năm`
                    : "Không yêu cầu"}
                </p>
              </div>
            </div>

            {/* Hạn nộp */}
            <div className="flex items-start gap-2.5 text-slate-600">
              <Calendar size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Hạn nộp hồ sơ</p>
                <p className="font-semibold text-slate-800">
                  {formatDeadline(job.deadline)}
                </p>
              </div>
            </div>

            {/* Lượt xem */}
            <div className="flex items-start gap-2.5 text-slate-600">
              <Eye size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Lượt xem</p>
                <p className="font-semibold text-slate-800">
                  {job.views || 0} lượt xem
                </p>
              </div>
            </div>
          </div>

          {/* Chi nhánh làm việc cụ thể nếu có */}
          {job.branch?.address && (
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-700">Chi nhánh:</strong>{" "}
                {job.branch.address} ({job.branch.city})
              </span>
            </div>
          )}

          {/* Tags Kỹ năng */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Kỹ năng:
                </span>
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            CARD 2: PHÚC LỢI & LÝ DO GIA NHẬP CÔNG TY
        ======================================================== */}
        {job.benefits && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              <span>Phúc lợi & Lý do gia nhập</span>
            </h2>
            {renderFormattedContent(job.benefits)}
          </div>
        )}

        {/* ========================================================
            CARD 3: MÔ TẢ CÔNG VIỆC
        ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Mô tả công việc
          </h2>
          {renderFormattedContent(job.description)}
        </div>

        {/* ========================================================
            CARD 4: YÊU CẦU CÔNG VIỆC
        ======================================================== */}
        {job.requirements && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Yêu cầu ứng viên
            </h2>
            {renderFormattedContent(job.requirements)}
          </div>
        )}

        {/* ========================================================
            CARD 5: VIỆC LÀM TƯƠNG TỰ (API 2)
        ======================================================== */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Việc làm tương tự dành cho bạn
            </h2>
            <Link
              href="/job-it"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {isRelatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-surface-card rounded-xl border border-border-default p-5 space-y-3"
                >
                  <div className="h-5 bg-surface-subtle rounded w-3/4" />
                  <div className="h-4 bg-surface-muted rounded w-1/2" />
                  <div className="h-4 bg-surface-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : relatedJobs && relatedJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedJobs.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/jobs/${item.slug}`}
                  className="group bg-surface-card rounded-xl border border-border-default p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <CompanyLogo
                        src={item.company?.logo}
                        name={item.company?.name}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                          {item.company?.name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs font-bold text-success-text tabular-nums">
                      {item.salaryDisplay || "Thỏa thuận"}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.location && (
                        <span className="text-[11px] font-medium text-text-secondary bg-surface-muted px-2 py-0.5 rounded">
                          {item.location}
                        </span>
                      )}
                      {item.skills?.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-medium text-text-secondary bg-surface-page border border-border-default px-2 py-0.5 rounded"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-default text-xs text-text-muted flex items-center justify-between">
                    <span>Đăng {formatRelativeTimeVN(item.postedAt)}</span>
                    <span className="text-primary font-semibold group-hover:underline">
                      Chi tiết &rsaquo;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-surface-card rounded-xl border border-border-default p-8 text-center text-text-muted text-sm">
              Hiện chưa có việc làm tương tự nào khác.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
