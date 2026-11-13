"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  useApplicationAiAnalysis,
  useRescanApplicationAi,
} from "@/hooks/employer/useApplicationAiAnalysis";

interface AiCandidateScreeningCardProps {
  applicationId: string;
}

const formatAnalyzedAt = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  return `${hh}:${mm} ${dd}/${mo}/${d.getFullYear()}`;
};

function AiScreeningSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-full" />
          <div className="h-3.5 bg-slate-200 rounded w-5/6" />
          <div className="h-3.5 bg-slate-200 rounded w-2/3" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-100 rounded-lg p-2 space-y-2">
            <div className="h-2.5 bg-slate-200 rounded w-3/4" />
            <div className="h-1.5 bg-slate-200 rounded w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
        <div className="h-3 bg-slate-200 rounded w-4/6" />
      </div>

      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded w-2/5" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export default function AiCandidateScreeningCard({
  applicationId,
}: AiCandidateScreeningCardProps) {
  const { data, isLoading, isError, error } = useApplicationAiAnalysis(
    applicationId,
    !!applicationId,
  );
  const { mutate: rescan, isPending: isRescanning } =
    useRescanApplicationAi(applicationId);

  const isBusy = isLoading || isRescanning;
  const score = data?.matchScore ?? 0;
  const analyzedAtText = formatAnalyzedAt(data?.analyzedAt);

  const ringColor =
    score >= 75
      ? "text-emerald-600 border-emerald-200 bg-emerald-50"
      : score >= 50
        ? "text-amber-600 border-amber-200 bg-amber-50"
        : "text-rose-600 border-rose-200 bg-rose-50";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            AI Candidate Screening
          </h3>
        </div>
        <button
          type="button"
          onClick={() => rescan()}
          disabled={isBusy}
          title="Quét lại điểm phù hợp bằng AI"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-primary bg-slate-50 hover:bg-primary/5 border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw size={13} className={isRescanning ? "animate-spin" : ""} />
          <span>{isRescanning ? "Đang quét..." : "Quét lại"}</span>
        </button>
      </div>

      {isBusy && <AiScreeningSkeleton />}

      {isError && !isBusy && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs">
          {error?.message || "Không thể phân tích hồ sơ lúc này."}
        </div>
      )}

      {data && !isBusy && (
        <div className="space-y-4">
          {/* Điểm tổng quan */}
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${ringColor}`}
            >
              <span className="text-lg font-extrabold leading-none">
                {score}%
              </span>
              <span className="text-[10px] font-semibold uppercase mt-0.5">
                Match
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {data.summary}
            </p>
          </div>

          {analyzedAtText && (
            <p className="text-[11px] text-slate-400">
              Đã lưu kết quả phân tích • {analyzedAtText}
            </p>
          )}

          {/* Breakdown 4 tiêu chí */}
          {data.breakdown && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
              {[
                { label: "Kỹ năng (40%)", val: data.breakdown.skillsScore },
                {
                  label: "Kinh nghiệm (30%)",
                  val: data.breakdown.experienceScore,
                },
                { label: "Học vấn (15%)", val: data.breakdown.educationScore },
                { label: "Chuyên môn (15%)", val: data.breakdown.domainScore },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 p-2 rounded-lg">
                  <div className="flex justify-between font-medium text-slate-600 mb-1">
                    <span>{item.label}</span>
                    <span className="font-bold text-slate-800">{item.val}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ưu điểm */}
          <div>
            <h4 className="text-xs font-bold text-emerald-700 mb-1.5 flex items-center gap-1">
              <CheckCircle2 size={14} /> Ưu điểm nổi bật
            </h4>
            <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
              {data.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Điểm còn thiếu */}
          <div>
            <h4 className="text-xs font-bold text-amber-700 mb-1.5 flex items-center gap-1">
              <AlertTriangle size={14} /> Điểm còn thiếu / Cần lưu ý
            </h4>
            <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
              {data.weaknesses.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
