"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { PORTFOLIO_TEMPLATES } from "@/constants/portfolio-content";

export default function PortfolioHero() {
  const { isAuthenticated } = useAuthStore();
  const [activeId, setActiveId] = useState<
    "truyen_thong" | "hien_dai" | "toi_gian"
  >("hien_dai");

  const activeTemplate =
    PORTFOLIO_TEMPLATES.find((t) => t.id === activeId) || PORTFOLIO_TEMPLATES[1];
  const primaryHref = isAuthenticated ? "/cv-template" : "/register";

  return (
    <section className="relative pt-14 sm:pt-18 pb-20 sm:pb-24 overflow-hidden bg-primary-dark emp-dark-hero-backdrop text-white border-b border-white/8">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div
            className="emp-hero-stagger inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-primary-light text-xs font-bold tracking-wide"
            style={{ "--l": 0 } as React.CSSProperties}
          >
            <Sparkles size={13} className="text-primary-disabled" />
            <span>Miễn phí cho Ứng viên IT · Chuẩn ATS & AI Match</span>
          </div>

          <h1
            className="emp-hero-stagger text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] text-white"
            style={{ "--l": 1 } as React.CSSProperties}
          >
            Tạo{" "}
            <span className="text-primary-disabled">CV & Portfolio IT</span>{" "}
            chuyên nghiệp — chuẩn gu nhà tuyển dụng
          </h1>

          <p
            className="emp-hero-stagger text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            style={{ "--l": 2 } as React.CSSProperties}
          >
            Chọn từ 3 bộ mẫu CV kỹ sư chuẩn ATS, nhập dữ liệu tự động từ file CV
            PDF bằng AI và xuất bản PDF sắc nét chỉ trong vài phút.
          </p>

          <div
            className="emp-hero-stagger flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
            style={{ "--l": 3 } as React.CSSProperties}
          >
            <Link
              href={primaryHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
            >
              <span>Tạo CV & Portfolio ngay</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="#templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/12 text-white font-semibold text-sm transition-all"
            >
              <Layers size={15} />
              <span>Xem 3 mẫu CV IT</span>
            </a>
          </div>

          <div
            className="emp-hero-stagger flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-xs text-slate-400"
            style={{ "--l": 4 } as React.CSSProperties}
          >
            <a href="#templates" className="hover:text-white transition-colors">
              Kho mẫu CV
            </a>
            <span aria-hidden="true">·</span>
            <a href="#features" className="hover:text-white transition-colors">
              Nhập CV bằng AI
            </a>
            <span aria-hidden="true">·</span>
            <a href="#tips" className="hover:text-white transition-colors">
              Mẹo viết CV IT
            </a>
            <span aria-hidden="true">·</span>
            <a href="#blog" className="hover:text-white transition-colors">
              Cẩm nang & Blog
            </a>
          </div>
        </div>

        {/* Interactive Showcase — 3 mẫu CV thật của ViecNgon */}
        <div
          className="emp-hero-stagger mt-14 max-w-4xl mx-auto"
          style={{ "--l": 5 } as React.CSSProperties}
        >
          {/* Tab chọn mẫu */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {PORTFOLIO_TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === activeId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setActiveId(tpl.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-surface-card text-text-primary shadow-md"
                      : "bg-white/8 text-slate-300 border border-white/15 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <FileText size={14} />
                  <span>Mẫu {tpl.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isSelected
                        ? "bg-primary-light text-primary"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {tpl.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Khung xem trước mẫu CV đang chọn */}
          <div
            key={activeTemplate.id}
            className="emp-step-enter rounded-2xl bg-slate-900 border border-white/15 shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Top dark window bar */}
            <div className="px-5 py-3 bg-slate-950/90 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  ViecNgon_CV_{activeTemplate.name}.pdf
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                <CheckCircle2 size={11} />
                ATS Ready · {activeTemplate.levelFit}
              </span>
            </div>

            {/* Simulated real white CV sheet popping against dark frame */}
            <div className="p-4 sm:p-6 bg-slate-900/90">
              <div className="rounded-xl bg-surface-card text-text-primary p-5 sm:p-7 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl ${activeTemplate.accentBg} text-white font-extrabold text-base flex items-center justify-center shrink-0`}
                    >
                      {activeTemplate.sampleName
                        .split(" ")
                        .slice(-2)
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-extrabold text-text-primary truncate">
                        {activeTemplate.sampleName}
                      </p>
                      <p
                        className={`text-xs font-bold ${activeTemplate.accentText}`}
                      >
                        {activeTemplate.sampleRole}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {activeTemplate.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {activeTemplate.sampleSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md bg-surface-muted text-text-secondary text-[11px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-7 md:border-l md:border-border-default md:pl-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Kinh nghiệm nổi bật (Định dạng chuẩn ATS)
                    </p>
                    <div className="p-3.5 rounded-xl bg-surface-page border border-border-default space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-text-primary">
                          {activeTemplate.sampleRole}
                        </span>
                        <span className="text-text-muted tabular-nums">
                          2023 – Hiện tại
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        • Tối ưu truy vấn hệ thống giảm độ trễ API từ 1,2s xuống
                        180ms cho 50.000+ người dùng hoạt động hằng tháng.
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        • Xây dựng CI/CD Docker + GitHub Actions giúp giảm 65%
                        thời gian triển khai bản phát hành mới.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-success-text font-semibold">
                      <Sparkles size={14} className="text-ai" />
                      <span>Tương thích 95% với bộ lọc AI Match Score</span>
                    </div>
                    <Link
                      href={primaryHref}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Dùng mẫu {activeTemplate.name}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
