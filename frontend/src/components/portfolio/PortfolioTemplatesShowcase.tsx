"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutTemplate } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { PORTFOLIO_TEMPLATES } from "@/constants/portfolio-content";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

export default function PortfolioTemplatesShowcase() {
  const { isAuthenticated } = useAuthStore();
  const targetHref = isAuthenticated ? "/cv-template" : "/register";

  return (
    <section
      id="templates"
      className="py-20 sm:py-24 bg-slate-950 border-b border-white/8 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Kho mẫu CV IT chuẩn ATS
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              3 phong cách thiết kế tối ưu cho từng cấp bậc kỹ sư
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Đồng bộ dữ liệu trực tiếp từ Hồ sơ Hybrid CV — đổi mẫu ngay lập tức
            mà không phải nhập lại thông tin.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PORTFOLIO_TEMPLATES.map((tpl, idx) => (
            <Reveal key={tpl.id} index={idx} className="h-full">
              <div className="group h-full flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-white/10 hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200 overflow-hidden">
                <div>
                  {/* Dark frame cradling a crisp white mini-CV paper sheet */}
                  <div className="p-5 bg-slate-950/70 border-b border-white/8">
                    <div className="rounded-xl bg-surface-card text-text-primary border border-white/15 p-4 shadow-lg space-y-3 group-hover:scale-[1.015] transition-transform duration-200">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${tpl.accentBg} text-white text-xs font-extrabold flex items-center justify-center shrink-0`}
                          >
                            {tpl.sampleName
                              .split(" ")
                              .slice(-1)[0]
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-text-primary truncate">
                              {tpl.sampleName}
                            </p>
                            <p className="text-[10px] text-text-muted truncate">
                              {tpl.sampleRole}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold shrink-0">
                          {tpl.badge}
                        </span>
                      </div>

                      {tpl.id === "hien_dai" ? (
                        <div className="grid grid-cols-12 gap-2.5 pt-1">
                          <div className="col-span-4 space-y-1.5 pr-2 border-r border-border-default">
                            <div className="h-1.5 w-10 rounded bg-info/60" />
                            <div className="h-1.5 w-full rounded bg-surface-subtle" />
                            <div className="h-1.5 w-4/5 rounded bg-surface-muted" />
                          </div>
                          <div className="col-span-8 space-y-1.5">
                            <div className="h-1.5 w-16 rounded bg-text-primary/70" />
                            <div className="h-1.5 w-full rounded bg-surface-subtle" />
                            <div className="h-1.5 w-5/6 rounded bg-surface-muted" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          <div
                            className={`h-1.5 w-20 rounded ${
                              tpl.id === "toi_gian"
                                ? "bg-text-primary/80"
                                : "bg-primary/70"
                            }`}
                          />
                          <div className="h-1.5 w-full rounded bg-surface-subtle" />
                          <div className="h-1.5 w-5/6 rounded bg-surface-muted" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 pt-1">
                        {tpl.sampleSkills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-surface-muted text-[10px] font-medium text-text-secondary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dark card body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <LayoutTemplate size={17} className="text-blue-400" />
                        <span>Mẫu {tpl.name}</span>
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {tpl.levelFit}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {tpl.summary}
                    </p>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {tpl.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2
                            size={14}
                            className="text-emerald-400 shrink-0 mt-0.5"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    href={targetHref}
                    className={`w-full h-10 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                      tpl.id === "hien_dai"
                        ? "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/30"
                        : "bg-white/6 hover:bg-white/12 border border-white/15 text-white"
                    }`}
                  >
                    <span>Dùng mẫu {tpl.name}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
