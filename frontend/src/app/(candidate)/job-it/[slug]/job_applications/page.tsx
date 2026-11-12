"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Eye,
  Info,
  Edit3,
  Loader2,
  CheckCircle,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useApplyJob, useJobDetail } from "@/hooks/job/useJobDetail";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import toast from "react-hot-toast";
import AiMatchBadge from "@/components/job/AiMatchBadge";

// Helper format ngày ngắn gọn
const formatDateToLocal = (dateString: string | null | undefined | Date) => {
  if (!dateString) return "Không xác định";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Không xác định";
    return `${`0${d.getDate()}`.slice(-2)}/${`0${d.getMonth() + 1}`.slice(-2)}/${d.getFullYear()}`;
  } catch {
    return "Không xác định";
  }
};

export default function ApplyJobPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // Lấy dữ liệu Store và Hooks
  const { user } = useAuthStore();
  const { job, isLoading: isJobLoading } = useJobDetail(slug);
  const { candidateProfile: profile, isLoading: isProfileLoading } =
    useCandidateProfile();
  const { mutate, isPending } = useApplyJob(slug);

  // Chỉ lưu lựa chọn chủ động của user (ban đầu là null vì chưa chọn gì)
  const [manualCvOption, setManualCvOption] = useState<
    "existing" | "new" | null
  >(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  // Xử lý dữ liệu CV mặc định từ Profile Backend
  const defaultCv = profile?.defaultCvFile;
  const existingCvName =
    defaultCv?.fileName ||
    profile?.cvUrl?.split("/").pop() ||
    `CV_ViecNgon_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
  const existingCvUrl = defaultCv?.fileUrl || profile?.cvUrl;
  const existingCvDate = formatDateToLocal(defaultCv?.uploadedAt);
  const hasExistingCv = !!existingCvUrl;

  const cvOption =
    manualCvOption !== null
      ? manualCvOption
      : hasExistingCv
        ? "existing"
        : "new";

  // Render màn hình Loading chung
  if (!user || isJobLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <Loader2 size={40} className="animate-spin mb-4 text-primary" />
        <p className="font-medium text-lg">Đang tải biểu mẫu ứng tuyển...</p>
      </div>
    );
  }

  // Bắt lỗi nếu không tìm thấy Job
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-rose-500 font-bold">
        Không tìm thấy công việc này!
      </div>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    // Xác định URL CV sẽ được gửi đi
    const finalCvUrl =
      cvOption === "existing" ? existingCvUrl : cvUrl.trim();

    if (!finalCvUrl) {
      toast.error("Vui lòng cung cấp CV để ứng tuyển!");
      return;
    }

    // Gọi API Nộp Đơn
    mutate(
      {
        maCongViec: job.id,
        coverLetter: coverLetter.trim() || undefined,
        chiTiet: coverLetter.trim() || undefined,
        maCvFile:
          cvOption === "existing" ? defaultCv?.id || undefined : undefined,
        fileCvUrl: finalCvUrl,
      },
      {
        onSuccess: () => {
          router.push("/dashboard"); // Chuyển về Dashboard của ứng viên
        },
      },
    );
  };

  const handleOpenExistingCV = (e: React.MouseEvent) => {
    e.preventDefault();
    if (existingCvUrl) window.open(existingCvUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Background Banner */}
      <div className="absolute top-0 left-0 w-full h-80 bg-primary-dark overflow-hidden z-0">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
        >
          <path
            d="M0,0 C480,160 960,160 1440,0 L1440,120 L0,120 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>

      {/* Top Navigation */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-6 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 text-white font-semibold hover:text-slate-200 transition-colors"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-primary font-bold shadow-md">
            V
          </div>
          <span className="text-xl font-extrabold text-white">iecNgon</span>
        </div>
        <div className="w-24"></div>
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 pb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-10">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 leading-tight">
            {job.title} tại{" "}
            <span className="text-primary">
              {job.company?.name || "Công ty"}
            </span>
          </h1>

          <AiMatchBadge jobId={job.id} />

          {job.isApplied ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <CheckCircle size={40} className="mx-auto text-emerald-600" />
              <div>
                <h2 className="text-lg font-bold text-emerald-800">
                  Bạn đã ứng tuyển công việc này
                  {job.applicationStatus ? ` (${job.applicationStatus})` : ""}
                </h2>
                <p className="text-sm text-emerald-700 mt-1">
                  Bạn có thể theo dõi trạng thái hồ sơ trong danh sách việc làm đã ứng tuyển.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={`/job-it/${slug}`}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Xem lại tin tuyển dụng
                </Link>
                <Link
                  href="/my-jobs/applied"
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors"
                >
                  Việc làm đã ứng tuyển
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={handleApply}>
              {/* --- Phần 1: Chọn CV --- */}
              <div>
                <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-1">
                  CV ứng tuyển <span className="text-red-500">*</span>
                </h2>

                <div className="flex flex-col gap-3">
                  {/* Lựa chọn 1: Sử dụng CV hiện tại */}
                  <label
                    className={`relative flex flex-col p-4 border rounded-xl transition-all ${
                      !hasExistingCv
                        ? "opacity-50 cursor-not-allowed bg-slate-50"
                        : "cursor-pointer"
                    } ${
                      cvOption === "existing" && hasExistingCv
                        ? "border-primary bg-primary-light/10 shadow-sm"
                        : "border-slate-300 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="radio"
                        name="cvOption"
                        value="existing"
                        checked={cvOption === "existing"}
                        onChange={() => setManualCvOption("existing")}
                        disabled={!hasExistingCv}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300 mt-0.5"
                      />
                      <span className="font-semibold text-slate-800 text-sm">
                        Sử dụng CV hiện tại{" "}
                        {hasExistingCv && (
                          <span className="text-xs text-emerald-600 font-bold px-2 bg-emerald-100 rounded-full ml-2">
                            Đề xuất
                          </span>
                        )}
                      </span>
                    </div>

                    {hasExistingCv ? (
                      <div className="ml-7">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleOpenExistingCV}
                            className="text-sm font-medium text-primary hover:underline text-left truncate max-w-62.5 sm:max-w-xs"
                          >
                            {existingCvName}
                          </button>
                          <Eye size={14} className="text-primary shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Ngày cập nhật: {existingCvDate}
                        </p>
                      </div>
                    ) : (
                      <div className="ml-7">
                        <p className="text-xs text-rose-500 font-medium">
                          Bạn chưa lưu CV nào trên hệ thống.
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Lựa chọn 2: Nhập liên kết CV khác */}
                  <label
                    className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                      cvOption === "new"
                        ? "border-primary bg-primary-light/10 shadow-sm"
                        : "border-slate-300 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="cvOption"
                        value="new"
                        checked={cvOption === "new"}
                        onChange={() => setManualCvOption("new")}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="font-semibold text-slate-800 text-sm">
                        Nhập liên kết CV khác (Google Drive / Notion / Portfolio)
                      </span>
                    </div>

                    {cvOption === "new" && (
                      <div className="ml-7 mt-3">
                        <div className="relative flex items-center">
                          <Link2
                            size={16}
                            className="absolute left-3 text-slate-400 pointer-events-none"
                          />
                          <input
                            type="url"
                            placeholder="https://drive.google.com/... hoặc đường dẫn CV của bạn"
                            value={cvUrl}
                            onChange={(e) => setCvUrl(e.target.value)}
                            required={cvOption === "new"}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Vui lòng đảm bảo liên kết CV ở chế độ công khai để nhà tuyển dụng có thể xem.
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* --- Phần 2: Thông tin cơ bản (Autofill từ Profile) --- */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-slate-800">
                    Thông tin liên hệ
                  </h2>
                  <button
                    type="button"
                    onClick={() => router.push("/cv-profile")}
                    className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Edit3 size={16} /> Sửa
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Field: Họ và Tên */}
                  <div className="border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 opacity-80 cursor-not-allowed">
                    <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                      Họ và Tên
                    </label>
                    <input
                      type="text"
                      value={profile?.candidateName || ""}
                      className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                      readOnly
                    />
                  </div>

                  {/* Field: Số điện thoại */}
                  <div className="border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 opacity-80 cursor-not-allowed">
                    <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={profile?.account?.phoneNumber || "Chưa cập nhật"}
                      className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic">
                  * Thông tin liên hệ được lấy tự động từ hồ sơ trực tuyến của
                  bạn.
                </p>
              </div>

              {/* --- Phần 3: Thư giới thiệu / Câu trả lời --- */}
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-1 mb-2">
                  Thư giới thiệu / Lời nhắn{" "}
                  <Info size={14} className="text-slate-400" />
                  <span className="text-slate-400 font-normal text-sm ml-1">
                    (Không bắt buộc)
                  </span>
                </h2>

                <p className="text-sm text-slate-700 font-medium mb-3">
                  Những kỹ năng, dự án hoặc thành tựu nào khiến bạn là ứng viên
                  sáng giá cho vị trí này?
                </p>

                <div className="border border-slate-300 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden bg-white">
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    maxLength={500}
                    placeholder="Viết một đoạn giới thiệu ngắn gọn (Cover Letter) để thu hút sự chú ý của nhà tuyển dụng..."
                    className="w-full p-4 text-sm text-slate-800 outline-none resize-y"
                  ></textarea>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-1 text-right">
                  {coverLetter.length}/500 ký tự
                </p>
              </div>

              {/* --- Nút Submit --- */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    isPending || (!hasExistingCv && cvOption === "existing")
                  }
                  className={`w-full text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/30 transition-all text-base flex justify-center items-center gap-2
                  ${isPending || (!hasExistingCv && cvOption === "existing") ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-primary-hover active:scale-[0.98]"}
                `}
                >
                  {isPending && <Loader2 size={18} className="animate-spin" />}
                  {isPending ? "Đang gửi hồ sơ..." : "Nộp đơn ứng tuyển"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
