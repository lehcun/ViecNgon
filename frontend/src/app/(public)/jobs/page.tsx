"use client";

import React, { useState, Suspense } from "react";
import { SearchX } from "lucide-react";
import JobSearchBanner from "@/components/job/JobSearchBanner";
import JobFilterPanel from "@/components/job/JobFilterPanel";
import JobCard from "@/components/job/JobCard";
import JobDetailPreviewPane from "@/components/job/JobDetailPreviewPane";
import JobPagination from "@/components/job/JobPagination";
import { useJobSearch } from "@/hooks/job/useJobSearch";
import { JobDetailResponse } from "@viecngon/types";
import {
  DetailPaneSkeleton,
  EmptyState,
  JobCardSkeleton,
} from "@/components/ui/StateViews";

function JobsPageContent() {
  const {
    jobs,
    total,
    page,
    totalPages,
    currentFilters,
    activeFilterCount,
    isLoading,
    updateFilter,
    updateMultipleFilters,
    clearAllFilters,
    setPage,
  } = useJobSearch();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

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
    <div className="w-full flex-1 flex flex-col bg-surface-page pb-16">
      <JobSearchBanner
        initialKeyword={currentFilters.keyword || ""}
        initialLocation={currentFilters.thanhPho || ""}
        onSearch={handleSearchBanner}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <JobFilterPanel
          filters={currentFilters}
          activeCount={activeFilterCount}
          totalResults={total}
          onFilterChange={updateFilter}
          onClearAll={clearAllFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
            <div className="hidden lg:block lg:col-span-7 sticky top-20 self-start">
              <DetailPaneSkeleton />
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="max-w-xl mx-auto my-8">
            <EmptyState
              icon={<SearchX size={26} />}
              title="Không tìm thấy việc làm phù hợp"
              description="Hãy thử tìm kiếm với từ khóa khác, mở rộng mức lương hoặc xóa bớt tiêu chí lọc để tiếp cận nhiều cơ hội hơn."
              actionLabel={
                activeFilterCount > 0 ? "Đặt lại tất cả bộ lọc" : undefined
              }
              onAction={activeFilterCount > 0 ? clearAllFilters : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
            <div className="lg:col-span-5 space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={activeJob?.id === job.id}
                  onSelect={() => setSelectedJobId(job.id)}
                />
              ))}

              <JobPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>

            <div className="hidden lg:block lg:col-span-7 sticky top-20 self-start z-30">
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
          <div className="hidden lg:block lg:col-span-7">
            <DetailPaneSkeleton />
          </div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
