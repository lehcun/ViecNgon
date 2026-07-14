"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Eye,
  UploadCloud,
  Info,
  Edit3,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useJobDetail } from "@/hooks/job/useJobDetail";
import { useApplyJob } from "@/hooks/job_application/useApplyJob";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";

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
  const { mutate, isPending } = useApplyJob();

  // States
  const [cvOption, setCvOption] = useState<"existing" | "new">("existing");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState(""); // Dành cho trường hợp chọn Tải CV mới (Tích hợp upload sau)

  // Xử lý dữ liệu CV mặc định từ Profile Backend
  const defaultCv = profile?.defaultCvFile;
  const existingCvName =
    defaultCv?.fileName ||
    profile?.cvUrl?.split("/").pop() ||
    `CV_ViecNgon_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
  const existingCvUrl = defaultCv?.fileUrl || profile?.cvUrl;
  const existingCvDate = formatDateToLocal(defaultCv?.uploadedAt);
  const hasExistingCv = !!existingCvUrl;

  // Nếu người dùng chưa có CV nào, tự động chuyển option sang "new" (Tải mới)
  useEffect(() => {
    if (profile && !hasExistingCv) {
      setCvOption("new");
    }
  }, [profile, hasExistingCv]);

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
    const finalCvUrl = cvOption === "existing" ? existingCvUrl : cvUrl;

    if (!finalCvUrl) {
      alert("Vui lòng cung cấp CV để ứng tuyển!");
      return;
    }

    // Gọi API Nộp Đơn
    mutate(
      {
        maCongViec: job.id,
        chiTiet: coverLetter,
        fileCvUrl: finalCvUrl,
      },
      {
        onSuccess: () => {
          alert("🎉 Chúc mừng! Bạn đã nộp CV thành công.");
          router.push("/candidate/dashboard"); // Chuyển về Dashboard của ứng viên
        },
        onError: (error: any) => {
          alert(`❌ Thất bại: ${error.message}`);
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">
            {job.title} tại{" "}
            <span className="text-primary">
              {job.company?.name || "Công ty"}
            </span>
          </h1>

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
                      onChange={() => setCvOption("existing")}
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
                          className="text-sm font-medium text-primary hover:underline text-left truncate max-w-[250px] sm:max-w-xs"
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

                {/* Lựa chọn 2: Tải lên CV mới */}
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
                      onChange={() => setCvOption("new")}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    />
                    <span className="font-semibold text-slate-800 text-sm">
                      Tải lên CV khác
                    </span>
                  </div>

                  {cvOption === "new" && (
                    <div className="ml-7 mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            alert("Gắn component Upload của bạn vào đây nhé!")
                          }
                          className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary-light px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          <UploadCloud size={16} /> Chọn file
                        </button>
                        <span className="text-sm text-slate-500 truncate">
                          {cvUrl
                            ? "Đã đính kèm file mới"
                            : "Chưa có file nào được chọn"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Hỗ trợ định dạng .pdf, dưới 3MB và không chứa mật khẩu
                        bảo vệ.
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
                  onClick={() => router.push("/candidate/profile")}
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
        </div>
      </main>
    </div>
  );
}
