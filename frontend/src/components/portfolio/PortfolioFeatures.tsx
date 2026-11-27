"use client";

import React from "react";
import {
  Sparkles,
  FileUp,
  ShieldCheck,
  Download,
  ArrowRight,
  Check,
} from "lucide-react";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

export default function PortfolioFeatures() {
  return (
    <section
      id="features"
      className="py-20 sm:py-24 bg-primary-dark border-b border-white/8 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Thiết kế riêng cho kỹ sư phần mềm
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vì sao lập trình viên chọn tạo CV & Portfolio trên ViecNgon?
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Không chỉ là mẫu CV đẹp — toàn bộ hồ sơ kết nối trực tiếp với hệ
            thống AI Match Score khi ứng tuyển.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Nhập CV bằng AI */}
          <Reveal index={0} className="h-full">
            <div className="h-full p-6 rounded-2xl bg-slate-900/75 border border-white/10 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
                  <FileUp size={12} />
                  <span>Nhập CV bằng AI (PDF)</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Tải CV cũ lên — điền sẵn toàn bộ hồ sơ trong 5 giây
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AI tự động bóc tách thông tin cá nhân, kinh nghiệm, học vấn,
                  chứng chỉ và Tech Stack từ file PDF có sẵn để bạn chỉ việc rà
                  soát.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 font-mono font-semibold text-slate-300 truncate">
                  My_Resume_2026.pdf
                </span>
                <ArrowRight
                  size={15}
                  className="emp-scan-arrow text-blue-400 shrink-0"
                />
                <div className="flex flex-wrap gap-1 justify-end">
                  <span className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold">
                    Kỹ năng
                  </span>
                  <span className="px-2 py-1 rounded-md bg-primary/20 text-blue-300 font-semibold">
                    Kinh nghiệm
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 2. AI Match Score */}
          <Reveal index={1} className="h-full">
            <div className="h-full p-6 rounded-2xl bg-slate-900/75 border border-white/10 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                  <Sparkles size={12} />
                  <span>AI Match Score</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Biết trước độ phù hợp của CV với từng JD IT
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Hệ thống đối chiếu hồ sơ Hybrid CV với yêu cầu của từng tin
                  tuyển dụng, gợi ý điểm mạnh và kỹ năng còn thiếu trước khi
                  bấm nộp đơn.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Mức độ khớp vị trí Senior Fullstack
                  </span>
                  <span className="font-extrabold text-emerald-400 tabular-nums">
                    91%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="emp-bar-fill h-full w-[91%] rounded-full bg-linear-to-r from-ai to-emerald-400" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* 3. Chuẩn ATS & Gu Tech Lead */}
          <Reveal index={2} className="h-full">
            <div className="h-full p-6 rounded-2xl bg-slate-900/75 border border-white/10 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/35 text-blue-300 text-[11px] font-bold">
                  <ShieldCheck size={12} />
                  <span>Chuẩn ATS 100%</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Bố cục quét nhanh, tối ưu cho cả máy lọc lẫn Tech Lead
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Phân cấp tiêu đề khoa học, làm nổi bật Tech Stack, đường dẫn
                  GitHub/Demo và thành tựu định lượng — không thừa đồ họa gây
                  nhiễu.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex flex-wrap gap-2 text-xs">
                {[
                  "Vector Text PDF",
                  "Hỗ trợ dấu tiếng Việt",
                  "Phân nhóm Tech Stack",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 font-semibold"
                  >
                    <Check size={12} />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 4. Xuất PDF & Ứng tuyển 1 chạm */}
          <Reveal index={3} className="h-full">
            <div className="h-full p-6 rounded-2xl bg-slate-900/75 border border-white/10 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-bold">
                  <Download size={12} />
                  <span>Xuất PDF & Đồng bộ</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Tải PDF sắc nét hoặc đặt làm CV mặc định ứng tuyển ngay
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Lưu bản CV vừa tạo trực tiếp lên hệ thống ViecNgon để ứng
                  tuyển hàng loạt vị trí IT chất lượng chỉ với 1 lần nhấn.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-3 text-xs">
                <span className="font-mono font-semibold text-slate-200 truncate">
                  CV_ViecNgon_ChuanATS.pdf
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 text-blue-300 font-bold shrink-0">
                  Sẵn sàng ứng tuyển
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
