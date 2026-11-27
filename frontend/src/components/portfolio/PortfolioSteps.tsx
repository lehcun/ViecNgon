"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

const STEPS = [
  {
    num: "01",
    title: "Tạo tài khoản miễn phí",
    desc: "Đăng nhập nhanh bằng Email hoặc Google để mở không gian quản lý hồ sơ ứng viên IT.",
  },
  {
    num: "02",
    title: "Điền hồ sơ hoặc Nhập bằng AI",
    desc: "Tải CV PDF sẵn có để AI tự bóc tách trong vài giây, hoặc tự cập nhật kỹ năng, kinh nghiệm và dự án.",
  },
  {
    num: "03",
    title: "Chọn 1 trong 3 mẫu CV chuẩn",
    desc: "Chuyển đổi tức thì giữa Truyền thống, Hiện đại và Tối giản để xem trước bản PDF hoàn chỉnh.",
  },
  {
    num: "04",
    title: "Tải PDF & Ứng tuyển 1 chạm",
    desc: "Xuất file PDF chất lượng cao hoặc lưu làm CV mặc định để ứng tuyển ngay các việc làm IT phù hợp.",
  },
];

export default function PortfolioSteps() {
  const { isAuthenticated } = useAuthStore();
  const actionHref = isAuthenticated ? "/cv-profile" : "/register";

  return (
    <section
      id="steps"
      className="py-20 sm:py-24 bg-slate-950 border-b border-white/8 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Quy trình tinh gọn
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hoàn thiện CV & Portfolio IT chỉ với 4 bước
            </h2>
          </div>
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold self-start lg:self-auto shadow-md shadow-primary/25 transition-all active:scale-[0.98]"
          >
            <span>Bắt đầu tạo hồ sơ</span>
            <ArrowRight size={15} />
          </Link>
        </Reveal>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {STEPS.map((step, idx) => (
              <Reveal key={step.num} index={idx} className="h-full">
                <div className="group h-full p-6 sm:p-7 space-y-4 hover:bg-white/4 transition-colors relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 text-blue-300 font-extrabold text-sm tabular-nums group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                      {step.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Bước {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
