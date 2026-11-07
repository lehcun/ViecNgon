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
  FileText,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";
import { getRelativeTime } from "@/components/NotificationDropdown";
import { useAuthStore } from "@/store/authStore";
import { useApplyJob, useRelatedJobs } from "@/hooks/job/useJobDetail";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
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
  const { isAuthenticated, user } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedCvOption, setSelectedCvOption] = useState<"profile" | "manual">("profile");
  const [customCvUrl, setCustomCvUrl] = useState("");

  const { candidateProfile } = useCandidateProfile();
  const applyMutation = useApplyJob(job?.slug);
  const { relatedJobs, isLoading: isRelatedLoading } = useRelatedJobs(
    job?.slug || job?.id || "",
  );

  // 1. SKELETON LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5 shadow-xs">
          <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-10 bg-slate-200 rounded-xl w-48" />
          <div className="flex gap-4 pt-4">
            <div className="h-12 bg-slate-200 rounded-xl flex-1" />
            <div className="h-12 w-12 bg-slate-200 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
          <div className="h-4 bg-slate-100 rounded w-4/6" />
        </div>
      </div>
    );
  }

  // 2. ERROR / NOT FOUND STATE
  if (!job) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <AlertCircle size={48} className="mx-auto text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Không tìm thấy công việc
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          Công việc này có thể đã hết hạn nhận hồ sơ hoặc đã được nhà tuyển dụng gỡ xuống.
        </p>
        <Link
          href="/job-it"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md shadow-primary/25 transition-all"
        >
          <span>Khám phá việc làm khác</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  // 3. HANDLERS
  const handleOpenApplyModal = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để ứng tuyển công việc này!");
      router.push(`/login?callbackUrl=/job-it/${job.slug}`);
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    const payloadCvUrl =
      selectedCvOption === "profile"
        ? candidateProfile?.defaultCvFile?.fileUrl || candidateProfile?.cvUrl
        : customCvUrl;

    applyMutation.mutate(
      {
        maCongViec: job.id,
        coverLetter: coverLetter.trim() || undefined,
        chiTiet: coverLetter.trim() || undefined,
        maCvFile: candidateProfile?.defaultCvFile?.id || undefined,
        fileCvUrl: payloadCvUrl || undefined,
      },
      {
        onSuccess: () => {
          setIsApplyModalOpen(false);
          setCoverLetter("");
        },
      },
    );
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
    if (!dateString) return "Tuyển liên tục";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Tuyển liên tục";
      return `${`0${d.getDate()}`.slice(-2)}/${`0${d.getMonth() + 1}`.slice(-2)}/${d.getFullYear()}`;
    } catch {
      return "Tuyển liên tục";
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* ========================================================
            CARD 1: HEADER CÔNG VIỆC + NÚT ỨNG TUYỂN
        ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {job.title}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1.5 line-clamp-1">
                {job.company?.name}
              </p>
            </div>
            {job.company?.logo && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-100 bg-white p-2 shrink-0 flex items-center justify-center shadow-xs overflow-hidden">
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Mức lương nổi bật */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-base sm:text-lg">
            <DollarSign size={20} className="-ml-1 shrink-0 text-emerald-600" />
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
                onClick={handleOpenApplyModal}
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
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
                >
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : relatedJobs && relatedJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedJobs.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/job-it/${item.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-primary/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl border border-slate-100 bg-white p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            item.company?.logo ||
                            "https://placehold.co/100x100?text=Logo"
                          }
                          alt={item.company?.name || "Logo"}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://placehold.co/100x100?text=Logo";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {item.company?.name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs font-black text-emerald-600">
                      {item.salaryDisplay}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.location && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.location}
                        </span>
                      )}
                      {item.skills?.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Đăng {getRelativeTime(item.postedAt)}</span>
                    <span className="text-primary font-bold group-hover:underline">
                      Chi tiết &rsaquo;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
              Hiện chưa có việc làm tương tự nào khác.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          MODAL ỨNG TUYỂN CÔNG VIỆC TRỰC TIẾP
      ======================================================== */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Nút đóng */}
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Tiêu đề modal */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Ứng tuyển vị trí
              </h3>
              <p className="text-sm font-semibold text-primary mt-1 line-clamp-1">
                {job.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                tại {job.company?.name}
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-5">
              {/* Thông tin ứng viên */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Họ và tên:</span>
                  <span className="font-bold text-slate-800">
                    {candidateProfile?.candidateName || user?.name || "Ứng viên"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800">
                    {user?.email || "Chưa cập nhật"}
                  </span>
                </div>
              </div>

              {/* Lựa chọn CV */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chọn hồ sơ / CV để nộp:
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setSelectedCvOption("profile")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedCvOption === "profile"
                      ? "border-primary bg-primary-light/40 ring-1 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="cvOption"
                      checked={selectedCvOption === "profile"}
                      onChange={() => setSelectedCvOption("profile")}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0 text-xs sm:text-sm">
                      <p className="font-bold text-slate-800">
                        Hồ sơ trực tuyến ViecNgon
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5 truncate">
                        {candidateProfile?.defaultCvFile?.fileName ||
                          candidateProfile?.cvUrl ||
                          "Sử dụng thông tin hồ sơ và CV hiện có trong tài khoản"}
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setSelectedCvOption("manual")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedCvOption === "manual"
                      ? "border-primary bg-primary-light/40 ring-1 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="cvOption"
                      checked={selectedCvOption === "manual"}
                      onChange={() => setSelectedCvOption("manual")}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0 text-xs sm:text-sm">
                      <p className="font-bold text-slate-800">
                        Nhập liên kết CV ngoài (Google Drive / Notion / Portfolio)
                      </p>
                      {selectedCvOption === "manual" && (
                        <input
                          type="url"
                          placeholder="https://..."
                          value={customCvUrl}
                          onChange={(e) => setCustomCvUrl(e.target.value)}
                          className="mt-2 w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                          required={selectedCvOption === "manual"}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Thư giới thiệu / Cover letter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Thư giới thiệu (Không bắt buộc):
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Gửi vài lời chia sẻ tới nhà tuyển dụng về lý do bạn phù hợp với vị trí này..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Nút xác nhận nộp */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-primary/60 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {applyMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang nộp...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Xác nhận Ứng tuyển</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
