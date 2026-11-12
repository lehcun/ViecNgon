"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useApplicationAiAnalysis } from "@/hooks/employer/useApplicationAiAnalysis";

interface AiCandidateScreeningCardProps {
  applicationId: string;
}

export default function AiCandidateScreeningCard({
  applicationId,
}: AiCandidateScreeningCardProps) {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useApplicationAiAnalysis(applicationId, !!applicationId);

  const score = data?.matchScore ?? 0;
  const ringColor =
    score >= 75
      ? "text-emerald-600 border-emerald-200 bg-emerald-50"
      : score >= 50
        ? "text-amber-600 border-amber-200 bg-amber-50"
        : "text-rose-600 border-rose-200 bg-rose-50";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            AI Candidate Screening
          </h3>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          title="Phân tích lại"
          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {isLoading && (
        <div className="py-6 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
          <Loader2 size={24} className="animate-spin text-primary" />
          <span>AI đang đánh giá mức độ phù hợp của ứng viên...</span>
        </div>
      )}

      {isError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs">
          {error?.message || "Không thể phân tích hồ sơ lúc này."}
        </div>
      )}

      {data && !isLoading && (
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

