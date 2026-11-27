"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { PORTFOLIO_FAQS } from "@/constants/portfolio-content";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

export default function PortfolioFaqCta() {
  const { isAuthenticated } = useAuthStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ctaHref = isAuthenticated ? "/cv-template" : "/register";

  return (
    <section id="faq" className="bg-primary-dark scroll-mt-20">
      {/* Dark FAQ Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 space-y-10">
        <Reveal className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Câu hỏi thường gặp
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Giải đáp nhanh về CV & Portfolio ViecNgon
          </h2>
        </Reveal>

        <div className="rounded-2xl border border-white/10 bg-slate-900/75 divide-y divide-white/10 overflow-hidden">
          {PORTFOLIO_FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-white/4 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed emp-step-enter">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Atmospheric CTA Bridge into Footer */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-t border-white/10">
        <div
          aria-hidden="true"
          className="emp-footer-glow pointer-events-none absolute inset-0"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center space-y-6">
          <Reveal className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-300 text-xs font-bold">
              <Sparkles size={12} />
              <span>Miễn phí 100% cho lập trình viên</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Sẵn sàng tạo bản CV IT ấn tượng trong 5 phút?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Tải lên CV PDF cũ để AI tự động chuẩn hóa hoặc bắt đầu ngay với 3
              mẫu CV thiết kế riêng cho kỹ sư phần mềm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={ctaHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-7 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
              >
                <span>Bắt đầu tạo CV miễn phí</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/12 text-white text-sm font-semibold transition-all"
              >
                <span>Khám phá việc làm IT</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
