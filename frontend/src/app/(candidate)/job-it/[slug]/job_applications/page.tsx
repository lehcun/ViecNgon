"use client";

import React, { useState } from "react";
import { ChevronLeft, Eye, UploadCloud, Info, Edit3 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useJobDetail } from "@/hooks/job/useJobDetail";
import { useApplyJob } from "@/hooks/job_application/useApplyJob";

export default function ApplyJobPage() {
  // State để quản lý việc chọn CV: 'existing' (CV đã có) hoặc 'new' (Tải lên CV mới)
  const [cvOption, setCvOption] = useState<"existing" | "new">("existing");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  const { mutate, isPending } = useApplyJob();
  const { user } = useAuthStore();

  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { job } = useJobDetail(slug);

  if (!user || !job) return <h2>loading...</h2>;

  const handleApply = () => {
    // Gọi hàm mutate để kích hoạt POST request
    mutate(
      {
        maCongViec: job.id,
        chiTiet: coverLetter,
        fileCvUrl: cvUrl || "https://link-to-cv.pdf", // Dữ liệu giả lập
      },
      {
        onSuccess: () => {
          alert("🎉 Chúc mừng! Bạn đã nộp CV thành công.");
          router.push("/dashboard");
        },
        onError: (error) => {
          alert(`❌ Thất bại: ${error.message}`);
          // error.message chính là chữ "Bạn đã nộp đơn cho công việc này rồi" từ Backend dội về
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Background Banner (Đường cong màu xanh đậm đặc trưng) */}
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
        {/* Logo trung tâm */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-primary font-bold shadow-md">
            V
          </div>
          <span className="text-xl font-extrabold text-white">iecNgon</span>
        </div>
        <div className="w-24"></div> {/* Spacer để cân bằng logo ở giữa */}
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 pb-24">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-10">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">
            {job.title} tại {job.company.name}
          </h1>

          <form className="space-y-8">
            {/* --- Phần 1: Chọn CV --- */}
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-1">
                CV ứng tuyển <span className="text-red-500">*</span>
              </h2>

              <div className="flex flex-col gap-3">
                {/* Lựa chọn 1: Sử dụng CV hiện tại */}
                <label
                  className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                    cvOption === "existing"
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
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300 mt-0.5"
                    />
                    <span className="font-semibold text-slate-800 text-sm">
                      Sử dụng CV hiện tại
                    </span>
                  </div>
                  <div className="ml-7">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary hover:underline">
                        {user.name}_cv.pdf
                      </span>
                      <Eye size={14} className="text-primary" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ngày tải lên: 03/05/2026
                    </p>
                  </div>
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
                      Tải lên CV mới
                    </span>
                  </div>

                  {cvOption === "new" && (
                    <div className="ml-7 mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary-light px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
                        >
                          <UploadCloud size={16} /> Chọn file
                        </button>
                        <span className="text-sm text-slate-500">
                          Chưa có file nào được chọn
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Hỗ trợ định dạng .doc, .docx hoặc .pdf, dưới 3MB và
                        không chứa mật khẩu bảo vệ
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* --- Phần 2: Thông tin cơ bản --- */}
            <div>
              <div className="flex justify-between items-center ">
                <h2 className="text-base font-bold text-slate-800 mb-4">
                  Thông tin cơ bản
                </h2>

                <button
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  className="text-slate-400 hover:text-primary transition-colors p-1"
                >
                  <Edit3 size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Field: Họ và Tên (Mô phỏng trạng thái hợp lệ - viền xanh lá) */}
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    defaultValue="Le Hung Cuong"
                    className="w-full text-sm font-semibold text-slate-500 outline-none bg-transparent"
                    disabled
                  />
                </div>

                {/* Field: Số điện thoại */}
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    defaultValue="0815114233"
                    className="w-full text-sm font-semibold text-slate-500 outline-none bg-transparent"
                    disabled
                  />
                </div>

                {/* Field: Nơi làm việc mong muốn */}
                <div>
                  <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                    <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                      Nơi làm việc mong muốn{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent appearance-none cursor-pointer">
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP HCM">TP. Hồ Chí Minh</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 pl-1">
                    1/3 địa điểm
                  </p>
                </div>
              </div>
            </div>

            {/* --- Phần 3: Thư giới thiệu / Câu trả lời --- */}
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-1 mb-2">
                Thư giới thiệu/Câu trả lời{" "}
                <Info size={14} className="text-slate-400" />{" "}
                <span className="text-slate-400 font-normal text-sm ml-1">
                  (Không bắt buộc)
                </span>
              </h2>

              <p className="text-sm text-slate-700 font-semibold mb-3">
                What skills, work projects or achievements make you a strong
                candidate for this position?
              </p>

              <div className="border border-slate-300 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden bg-white">
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Giới thiệu ngắn hoặc trả lời các câu hỏi của nhà tuyển dụng (nếu có)."
                  className="w-full p-4 text-sm text-slate-800 outline-none resize-y"
                ></textarea>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-1">
                Còn lại 500 trong tổng số 500 ký tự
              </p>
            </div>

            {/* --- Nút Submit --- */}
            <div className="pt-4">
              <button
                onClick={handleApply}
                type="submit"
                disabled={isPending}
                className={`w-full text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] text-base 
                  ${isPending ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-primary-hover"}
                `}
              >
                Gửi CV của tôi
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
