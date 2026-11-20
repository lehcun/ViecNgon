"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import type { CompanySectionImages } from "@viecngon/types";

interface SectionMediaPanelProps {
  sectionImages: CompanySectionImages;
  uploadingTarget: "logo" | "intro" | "culture" | null;
  onUploadFiles: (
    files: FileList | null,
    target: "intro" | "culture",
  ) => Promise<void>;
  onUpdateImages: (
    target: "introImages" | "cultureImages",
    nextList: string[],
  ) => void;
}

const MAX_IMAGES_PER_SECTION = 8;

const SECTION_CONFIG: Array<{
  target: "intro" | "culture";
  field: "introImages" | "cultureImages";
  heading: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  altPrefix: string;
}> = [
  {
    target: "intro",
    field: "introImages",
    heading: "Ảnh cho Section “Giới thiệu công ty”",
    description:
      "Hiển thị ảnh văn phòng, không gian làm việc trên trang công khai (tối đa 8 ảnh, dưới 5MB/ảnh).",
    emptyTitle: "Chưa có ảnh cho phần Giới thiệu công ty",
    emptyDescription:
      "Hãy tải lên ảnh văn phòng hoặc đội ngũ kỹ sư của bạn (có thể chọn nhiều ảnh cùng lúc).",
    altPrefix: "Ảnh giới thiệu",
  },
  {
    target: "culture",
    field: "cultureImages",
    heading: "Ảnh cho Section “Phúc lợi & Văn hóa”",
    description:
      "Hình ảnh team building, workshop, hoạt động nội bộ (tối đa 8 ảnh, dưới 5MB/ảnh).",
    emptyTitle: "Chưa có ảnh cho phần Phúc lợi & Văn hóa",
    emptyDescription:
      "Bấm “Tải ảnh lên” để bổ sung ảnh hoạt động văn hóa công ty.",
    altPrefix: "Ảnh văn hóa",
  },
];

export function SectionMediaPanel({
  sectionImages,
  uploadingTarget,
  onUploadFiles,
  onUpdateImages,
}: SectionMediaPanelProps) {
  const introInputRef = useRef<HTMLInputElement>(null);
  const cultureInputRef = useRef<HTMLInputElement>(null);

  const getInputRef = (target: "intro" | "culture") =>
    target === "intro" ? introInputRef : cultureInputRef;

  const moveImage = (
    field: "introImages" | "cultureImages",
    currentList: string[],
    fromIdx: number,
    direction: -1 | 1,
  ) => {
    const targetIdx = fromIdx + direction;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;
    const next = [...currentList];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(targetIdx, 0, moved);
    onUpdateImages(field, next);
  };

  return (
    <div className="space-y-6">
      <input
        ref={introInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void onUploadFiles(e.target.files, "intro");
          e.target.value = "";
        }}
      />
      <input
        ref={cultureInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void onUploadFiles(e.target.files, "culture");
          e.target.value = "";
        }}
      />

      {SECTION_CONFIG.map((cfg) => {
        const list = sectionImages[cfg.field];
        const isUploading = uploadingTarget === cfg.target;
        const isFull = list.length >= MAX_IMAGES_PER_SECTION;

        return (
          <div
            key={cfg.target}
            className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border-default pb-3.5">
              <div className="min-w-0 flex-1">
                <h3 className="border-l-4 border-primary pl-3.5 pr-4 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base">
                  {cfg.heading} ({list.length}/{MAX_IMAGES_PER_SECTION})
                </h3>
                <p className="text-xs text-text-muted mt-1.5">
                  {cfg.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => getInputRef(cfg.target).current?.click()}
                disabled={isUploading || isFull}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light hover:bg-primary-subtle disabled:opacity-50 text-primary border border-primary-subtle rounded-lg text-xs font-semibold transition shrink-0"
              >
                {isUploading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                <span>{isFull ? "Đã đủ 8 ảnh" : "Tải ảnh lên"}</span>
              </button>
            </div>

            {list.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border-strong bg-surface-page p-8 text-center">
                {cfg.target === "intro" ? (
                  <ImageIcon
                    size={28}
                    className="mx-auto text-text-placeholder mb-2"
                  />
                ) : (
                  <Sparkles
                    size={28}
                    className="mx-auto text-text-placeholder mb-2"
                  />
                )}
                <p className="text-sm font-semibold text-text-primary">
                  {cfg.emptyTitle}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {cfg.emptyDescription}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {list.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-surface-muted group"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${cfg.altPrefix} ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 240px"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-semibold tabular-nums">
                      #{idx + 1}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(cfg.field, list, idx, -1)}
                          title="Di chuyển lên trước"
                          aria-label="Di chuyển ảnh lên trước"
                          className="p-1.5 rounded-full bg-black/65 hover:bg-primary text-white transition"
                        >
                          <ChevronLeft size={14} />
                        </button>
                      )}
                      {idx < list.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(cfg.field, list, idx, 1)}
                          title="Di chuyển ra sau"
                          aria-label="Di chuyển ảnh ra sau"
                          className="p-1.5 rounded-full bg-black/65 hover:bg-primary text-white transition"
                        >
                          <ChevronRight size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateImages(
                            cfg.field,
                            list.filter((_, i) => i !== idx),
                          )
                        }
                        aria-label="Xóa ảnh"
                        className="p-1.5 rounded-full bg-black/65 hover:bg-danger text-white transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
