"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function JobPagination({
  currentPage,
  totalPages,
  onPageChange,
}: JobPaginationProps) {
  if (totalPages <= 1) return null;

  // Thuật toán hiển thị các số trang (rút gọn dấu ...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 py-4">
      {/* Nút Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Danh sách trang */}
      {getPageNumbers().map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-2.5 py-1.5 text-xs text-slate-400 font-semibold"
            >
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;

        return (
          <button
            type="button"
            key={`page-${p}`}
            onClick={() => onPageChange(Number(p))}
            className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isCurrent
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Nút Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

