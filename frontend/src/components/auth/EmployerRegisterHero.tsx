"use client";

import React, { useEffect, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Video,
  ShieldCheck,
} from "lucide-react";

const MATCHED_SKILLS = [
  "Next.js",
  "NestJS",
  "TypeScript",
  "SQL Server",
  "Docker",
];

export default function EmployerRegisterHero() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const rafId = requestAnimationFrame(() => {
      el.setAttribute("data-ready", "true");
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="w-full lg:w-6/12 flex flex-col gap-7">
      <div
        className="emp-hero-stagger inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold tracking-wide"
        style={{ "--l": 0 } as React.CSSProperties}
      >
        <Building2 size={14} />
        <span>Nền tảng Tuyển dụng IT chuyên biệt</span>
      </div>

      <div className="space-y-4">
        <h1
          className="emp-hero-stagger text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-text-primary leading-[1.15] tracking-tight"
          style={{ "--l": 1 } as React.CSSProperties}
        >
          Tuyển đúng kỹ sư IT —{" "}
          <span className="text-primary">
            không mất thời gian lọc CV thủ công
          </span>
        </h1>
        <p
          className="emp-hero-stagger text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl"
          style={{ "--l": 2 } as React.CSSProperties}
        >
          Đăng tin tuyển dụng, chấm điểm tương thích CV bằng AI và đặt lịch
          phỏng vấn Google Meet ngay trên một luồng làm việc duy nhất dành cho
          đội ngũ HR công nghệ.
        </p>
      </div>

      {/* Live Product UI Preview — AI Match Screening Frame */}
      <div
        className="emp-hero-stagger rounded-2xl bg-surface-card border border-border-default shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
        style={{ "--l": 3 } as React.CSSProperties}
      >
        <div className="px-4 py-2.5 bg-surface-page border-b border-border-default flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-text-primary">
              ViecNgon AI Screening
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ai-light border border-ai-border text-ai text-[11px] font-bold">
            <Sparkles size={11} />
            AI Match Score
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">
                Phạm Hải Nam · Senior Backend Engineer
              </p>
              <p className="text-xs text-text-muted">
                5 năm kinh nghiệm · TP. Hồ Chí Minh · Đã bóc tách từ CV PDF
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-success-soft border border-success-border text-success-text text-sm font-extrabold tabular-nums">
                94%
              </span>
              <p className="text-[10px] text-text-muted mt-0.5 font-medium">
                Rất phù hợp
              </p>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
            <div
              ref={barRef}
              className="emp-bar-fill h-full w-[94%] rounded-full bg-linear-to-r from-ai to-success"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {MATCHED_SKILLS.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-page border border-border-default text-[11px] font-semibold text-text-secondary transition-colors hover:border-success-border hover:bg-success-soft/60"
              >
                <CheckCircle2 size={11} className="text-success-text" />
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-border-default flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-info-text font-semibold">
              <Video size={14} />
              Sẵn sàng đặt lịch Google Meet 1 chạm
            </span>
            <span className="inline-flex items-center gap-1 text-text-muted">
              <ShieldCheck size={13} className="text-primary" />
              Hồ sơ xác thực
            </span>
          </div>
        </div>
      </div>

      <div
        className="emp-hero-stagger flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted"
        style={{ "--l": 4 } as React.CSSProperties}
      >
        <span className="inline-flex items-center gap-1.5 font-medium">
          <CheckCircle2 size={14} className="text-success-text" />
          Admin xác thực doanh nghiệp trong 24h
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <CheckCircle2 size={14} className="text-success-text" />
          Hỗ trợ doanh nghiệp: love@viecngon.vn
        </span>
      </div>
    </div>
  );
}
