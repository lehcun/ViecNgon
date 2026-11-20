"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Eye,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pencil,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextSectionEditorProps {
  id: string;
  title: string;
  label?: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  rows?: number;
  icon?: React.ReactNode;
  badgeText?: string;
  enableAllTools?: boolean;
  previewRenderer?: (value: string) => React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function RichTextSectionEditor({
  id,
  title,
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  icon,
  badgeText = "Hỗ trợ HTML & Xem trước",
  enableAllTools = true,
  previewRenderer,
  footerSlot,
}: RichTextSectionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const wrapSelectionWithHtml = (openTag: string, closeTag: string) => {
    const el = textareaRef.current;
    const current = value || "";
    if (!el) return;
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || "Nội dung";
    onChange(
      current.slice(0, start) +
        openTag +
        selected +
        closeTag +
        current.slice(end),
    );
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-dashed border-border-default">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <h3 className="flex-1 min-w-0 border-l-4 border-primary pl-3.5 pr-5 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base flex items-center gap-2">
            {icon}
            <span className="truncate">{title}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badgeText && (
            <span className="hidden sm:inline text-xs text-text-muted font-medium">
              {badgeText}
            </span>
          )}
          <div className="inline-flex rounded-lg border border-border-default bg-surface-page p-0.5">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition",
                mode === "edit"
                  ? "bg-surface-card text-primary shadow-2xs"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <Pencil size={12} />
              <span>Soạn thảo</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition",
                mode === "preview"
                  ? "bg-surface-card text-primary shadow-2xs"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <Eye size={12} />
              <span>Xem trước</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs sm:text-sm font-semibold text-text-secondary mb-2"
          >
            {label}
          </label>
        )}

        {mode === "edit" ? (
          <>
            <div className="border border-border-default rounded-t-lg bg-surface-page px-3 py-2 flex flex-wrap items-center gap-1">
              <button
                type="button"
                title="In đậm"
                onClick={() => wrapSelectionWithHtml("<strong>", "</strong>")}
                className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                title="In nghiêng"
                onClick={() => wrapSelectionWithHtml("<em>", "</em>")}
                className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
              >
                <Italic size={15} />
              </button>
              <button
                type="button"
                title="Gạch chân"
                onClick={() => wrapSelectionWithHtml("<u>", "</u>")}
                className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
              >
                <Underline size={15} />
              </button>

              <div className="w-px h-4 bg-border-strong mx-1" />

              <button
                type="button"
                title="Danh sách dấu chấm"
                onClick={() =>
                  wrapSelectionWithHtml("<ul>\n  <li>", "</li>\n</ul>")
                }
                className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
              >
                <List size={15} />
              </button>
              {enableAllTools && (
                <>
                  <button
                    type="button"
                    title="Danh sách số"
                    onClick={() =>
                      wrapSelectionWithHtml("<ol>\n  <li>", "</li>\n</ol>")
                    }
                    className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                  >
                    <ListOrdered size={15} />
                  </button>
                  <button
                    type="button"
                    title="Chèn liên kết"
                    onClick={() =>
                      wrapSelectionWithHtml('<a href="https://">', "</a>")
                    }
                    className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                  >
                    <LinkIcon size={15} />
                  </button>
                </>
              )}
            </div>

            <textarea
              ref={textareaRef}
              id={id}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 border border-t-0 border-border-default rounded-b-lg text-sm text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-y"
            />
          </>
        ) : (
          <div className="min-h-32 p-4 rounded-lg border border-border-default bg-surface-page">
            {!value.trim() ? (
              <p className="text-xs text-text-muted italic">
                Chưa có nội dung để xem trước.
              </p>
            ) : previewRenderer ? (
              previewRenderer(value)
            ) : (
              <div
                className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            )}
          </div>
        )}
      </div>

      {footerSlot}
    </div>
  );
}
