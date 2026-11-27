"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  CV_CHECKLIST_ITEMS,
  CV_TIP_CATEGORIES,
} from "@/constants/portfolio-content";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

export default function PortfolioTipsSection() {
  const [activeTipId, setActiveTipId] = useState(CV_TIP_CATEGORIES[0].id);

  const activeTip =
    CV_TIP_CATEGORIES.find((item) => item.id === activeTipId) ||
    CV_TIP_CATEGORIES[0];

  return (
    <section
      id="tips"
      className="py-20 sm:py-24 bg-primary-dark border-b border-white/8 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Mẹo viết CV IT ghi điểm
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-[10px] font-semibold text-slate-300">
                Cẩm nang minh họa
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              4 &ldquo;điểm vàng&rdquo; giúp CV kỹ sư vượt qua 60 giây quét đầu
              tiên
            </h2>
          </div>
          <Link
            href="/huong-dan/ho-so"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline self-start lg:self-auto"
          >
            <span>Xem hướng dẫn hoàn thiện hồ sơ</span>
            <ArrowRight size={15} />
          </Link>
        </Reveal>

        {/* Interactive 4-tab tips showcase */}
        <Reveal index={1}>
          <div className="rounded-2xl border border-white/10 bg-slate-900/75 overflow-hidden">
            {/* Dark Tabs */}
            <div className="p-2.5 bg-slate-950/75 border-b border-white/10 flex flex-wrap gap-2">
              {CV_TIP_CATEGORIES.map((tip) => {
                const isActive = tip.id === activeTipId;
                return (
                  <button
                    key={tip.id}
                    type="button"
                    onClick={() => setActiveTipId(tip.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {tip.label}
                  </button>
                );
              })}
            </div>

            {/* Active Tip Content */}
            <div
              key={activeTip.id}
              className="emp-step-enter p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-2 max-w-3xl">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {activeTip.headline}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeTip.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Good Example */}
                <div className="p-5 rounded-xl bg-emerald-950/35 border border-emerald-500/35 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 size={14} />
                    <span>Nên viết như này</span>
                  </div>
                  <p className="text-sm text-emerald-50 leading-relaxed font-medium">
                    &ldquo;{activeTip.goodExample}&rdquo;
                  </p>
                </div>

                {/* Bad Example */}
                <div className="p-5 rounded-xl bg-rose-950/35 border border-rose-500/35 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                    <XCircle size={14} />
                    <span>Nên tránh cách viết này</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    &ldquo;{activeTip.badExample}&rdquo;
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/12 border border-primary/30 flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <Lightbulb
                  size={18}
                  className="text-blue-400 shrink-0 mt-0.5"
                />
                <p className="leading-relaxed">
                  <strong className="text-blue-300">Quy tắc nhanh:</strong>{" "}
                  {activeTip.takeaway}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Checklist 6 điều cần kiểm tra trước khi gửi CV */}
        <Reveal index={2}>
          <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Checklist 6 điểm kiểm tra nhanh trước khi gửi CV IT
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CV_CHECKLIST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="p-3.5 rounded-xl bg-slate-950/75 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                >
                  <CheckCircle2
                    size={15}
                    className="text-emerald-400 shrink-0 mt-0.5"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
