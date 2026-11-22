"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  FileText,
  HelpCircle,
  Lock,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import type { CandidateProfileResponse } from "@viecngon/types";
import ProfileCompletionGauge from "./ProfileCompletionGauge";
import {
  calculateProfileCompletion,
  getProfileCompletionSuggestions,
  MIN_PROFILE_COMPLETION_FOR_CV,
  type ProfileSuggestionKey,
} from "@/lib/candidate-completion";

interface ProfileCompletionSidebarCardProps {
  profile: CandidateProfileResponse;
  onSelectSuggestion: (key: ProfileSuggestionKey) => void;
  onOpenAiCvModal: () => void;
}

export default function ProfileCompletionSidebarCard({
  profile,
  onSelectSuggestion,
  onOpenAiCvModal,
}: ProfileCompletionSidebarCardProps) {
  const profileCompletion = calculateProfileCompletion(profile);
  const clamped = Math.min(100, Math.max(0, Math.round(profileCompletion)));
  const isEligibleForCv = clamped >= MIN_PROFILE_COMPLETION_FOR_CV;
  const suggestions = getProfileCompletionSuggestions(profile);

  return (
    <div className="flex flex-col gap-5 sticky top-24">
      {/* CARD 1: ĐỘ HOÀN THIỆN HỒ SƠ */}
      <div className="relative overflow-hidden bg-surface-card rounded-xl border border-border-default shadow-xs">
        {/* Nền gradient + dot pattern ở phần đầu theo mẫu */}
        <div
          className="relative px-6 pt-6 pb-5"
          style={{
            backgroundImage:
              "radial-gradient(rgba(37, 99, 235, 0.14) 1px, transparent 1px), linear-gradient(180deg, #eff6ff 0%, rgba(239, 246, 255, 0.35) 68%, #ffffff 100%)",
            backgroundSize: "14px 14px, 100% 100%",
            backgroundPosition: "top right, top left",
          }}
        >
          <h2 className="font-bold text-text-main text-base text-center mb-4">
            Độ hoàn thiện hồ sơ
          </h2>

          {/* Thanh nửa vòng tròn với số % ở chính giữa */}
          <div className="flex justify-center mb-4">
            <ProfileCompletionGauge percentage={clamped} />
          </div>

          <p className="text-xs text-text-secondary leading-relaxed text-center">
            {clamped === 100
              ? "Hồ sơ của bạn đã hoàn thiện 100%, sẵn sàng nổi bật với nhà tuyển dụng và chấm điểm AI Match!"
              : isEligibleForCv
                ? "Hồ sơ đã đạt mốc ≥ 70%. Bạn có thể tạo, xem và sử dụng CV ngay để ứng tuyển."
                : `Hoàn thiện hồ sơ đạt tối thiểu ${MIN_PROFILE_COMPLETION_FOR_CV}% (còn thiếu ${MIN_PROFILE_COMPLETION_FOR_CV - clamped}%) để mở khóa tạo, xem và nộp CV.`}
          </p>
        </div>

        {/* Danh sách mục gợi ý cộng thêm % + CTA */}
        <div className="px-6 pb-6 pt-1 space-y-4">
          {suggestions.length > 0 && (
            <ul
              className="space-y-1.5"
              aria-label="Gợi ý hoàn thiện hồ sơ"
              data-testid="profile-completion-suggestions"
            >
              {suggestions.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onSelectSuggestion(item.key)}
                    className="w-full flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded-lg hover:bg-surface-muted/80 transition-colors text-left cursor-pointer group"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-text-main group-hover:text-primary transition-colors min-w-0">
                      <PlusCircle
                        size={16}
                        className="text-text-muted group-hover:text-primary shrink-0 transition-colors"
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-light text-success-text shrink-0 tabular-nums">
                      <ArrowUp size={11} />
                      {item.gainPercent}%
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {isEligibleForCv ? (
            <Link
              href="/cv-template"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-colors text-sm shadow-xs"
            >
              <FileText size={17} />
              Xem và tải CV mẫu
            </Link>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-surface-muted border border-border-default text-text-muted rounded-lg font-semibold text-sm opacity-70 cursor-not-allowed"
              >
                <Lock size={16} />
                Xem và tải CV mẫu
              </button>
              <p className="text-[11px] text-warning-text text-center font-medium">
                Đạt tối thiểu {MIN_PROFILE_COMPLETION_FOR_CV}% để tạo, xem và
                dùng CV ứng tuyển
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-border-subtle">
            <Link
              href="/huong-dan/ho-so"
              className="inline-flex items-center justify-between w-full text-xs font-semibold text-primary hover:underline gap-1.5"
            >
              <span className="inline-flex items-center gap-1.5">
                <HelpCircle size={14} />
                Bảng tính điểm % &amp; gợi ý đạt {MIN_PROFILE_COMPLETION_FOR_CV}%
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* CARD 2: CẬP NHẬT NHANH HỒ SƠ BẰNG AI (TÁCH RIÊNG) */}
      <div
        className="relative overflow-hidden bg-surface-card rounded-xl border border-border-default p-6 shadow-xs"
        data-testid="ai-cv-autofill-card"
      >
        <span className="absolute top-0 right-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-bl-lg bg-ai text-white text-[11px] font-bold tracking-wide shadow-xs">
          <Sparkles size={11} />
          AI
        </span>

        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0 pr-2">
            <h3 className="font-bold text-text-main text-base leading-snug mb-1.5">
              Cập nhật nhanh hồ sơ của bạn
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Điền nhanh hồ sơ bằng CV PDF của bạn chỉ trong ít phút.
            </p>
          </div>

          {/* Minh họa tài liệu CV đang được AI quét */}
          <div className="shrink-0 pt-2" aria-hidden="true">
            <svg
              width="64"
              height="68"
              viewBox="0 0 64 68"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="4"
                width="42"
                height="56"
                rx="6"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <rect
                x="16"
                y="12"
                width="12"
                height="12"
                rx="3"
                fill="#E0E7FF"
              />
              <rect
                x="32"
                y="13"
                width="14"
                height="3.5"
                rx="1.75"
                fill="#94A3B8"
              />
              <rect
                x="32"
                y="19"
                width="10"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="16"
                y="30"
                width="30"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="16"
                y="37"
                width="26"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="16"
                y="44"
                width="20"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="28"
                y="26"
                width="30"
                height="26"
                rx="4"
                fill="#EEF2FF"
                fillOpacity="0.88"
                stroke="#4F46E5"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <path
                d="M34 39H52"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M43 32V35M43 43V46"
                stroke="#4F46E5"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAiCvModal}
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-surface-card border border-ai text-ai hover:bg-ai-light rounded-lg font-semibold transition-colors text-sm cursor-pointer"
        >
          <Sparkles size={16} />
          Điền hồ sơ tự động
        </button>
      </div>
    </div>
  );
}
