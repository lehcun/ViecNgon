"use client";

import React, { useState, Suspense } from "react";
import { SearchX, RotateCcw } from "lucide-react";
import JobSearchBanner from "@/components/job/JobSearchBanner";
import JobFilterPanel from "@/components/job/JobFilterPanel";
import JobCard from "@/components/job/JobCard";
import JobDetailPreviewPane from "@/components/job/JobDetailPreviewPane";
import JobPagination from "@/components/job/JobPagination";
import { useJobSearch } from "@/hooks/job/useJobSearch";
import { JobDetailResponse } from "@viecngon/types";

function JobsPageContent() {
  const {
    jobs,
    total,
    page,
    totalPages,
    currentFilters,
    activeFilterCount,
    isLoading,
    isFetching,
    updateFilter,
    updateMultipleFilters,
    clearAllFilters,
    setPage,
  } = useJobSearch();

  // State lưu trữ công việc đang được chọn để xem nhanh (Preview)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Tự động chọn công việc đầu tiên trong danh sách khi load xong hoặc khi đổi filter
  const activeJob: JobDetailResponse | null =
    jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;

  const handleSearchBanner = (keyword: string, location: string) => {
    updateMultipleFilters({
      keyword,
      thanhPho: location,
      page: "1",
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col pb-16">
      {/* KHỐI 1: THANH TÌM KIẾM NỔI BẬT (HEADER SEARCH BANNER) */}
      <JobSearchBanner
        initialKeyword={currentFilters.keyword || ""}
        initialLocation={currentFilters.thanhPho || ""}
        onSearch={handleSearchBanner}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* KHỐI 2: THANH / SIDEBAR BỘ LỌC CHI TIẾT */}
        <JobFilterPanel
          filters={currentFilters}
          activeCount={activeFilterCount}
          totalResults={total}
          onFilterChange={updateFilter}
          onClearAll={clearAllFilters}
        />

        {/* KHỐI 3: DANH SÁCH & SPLIT PREVIEW */}
        {isLoading ? (
          /* Trạng thái Loading Skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Cột Trái: Danh sách Job Cards Skeleton (5/12) */}
            <div className="lg:col-span-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse flex items-start gap-4"
                >
                  <div className="w-14 h-14 bg-slate-200 rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-5 w-16 bg-slate-100 rounded"></div>
                      <div className="h-5 w-20 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột Phải: Khung Xem Nhanh Preview Skeleton (7/12) */}
            <div className="hidden lg:block lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 h-[600px] animate-pulse"></div>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          /* Empty State khi không tìm thấy việc làm */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs my-8">
            <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Không tìm thấy việc làm phù hợp
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Hãy thử tìm kiếm với từ khóa khác, mở rộng mức lương hoặc xóa bớt các tiêu chí lọc để tiếp cận nhiều cơ hội hơn.
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md shadow-primary/25 hover:bg-primary-hover transition-all cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Đặt lại tất cả bộ lọc</span>
              </button>
            )}
          </div>
        ) : (
          /* Danh sách việc làm + Preview Split (5 cột Trái - 7 cột Phải để mở rộng diện tích preview) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
            {/* Cột Trái: Danh sách Job Cards + Phân trang (5/12) */}
            <div className="lg:col-span-5 space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={activeJob?.id === job.id}
                  onSelect={() => setSelectedJobId(job.id)}
                />
              ))}

              {/* KHỐI 4: PHÂN TRANG */}
              <JobPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>

            {/* Cột Phải: Khung Xem Nhanh Job Preview (Mở rộng 7/12 - Sticky trên Desktop) */}
            <div className="hidden lg:block lg:col-span-7">
              <JobDetailPreviewPane job={activeJob} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
