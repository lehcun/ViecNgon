"use client";

import React, { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { useAppliedJobs } from "@/hooks/candidate/useAppliedJobs";
import AppliedJobsTabs from "@/components/candidate/appliedJobs/AppliedJobsTabs";
import AppliedJobsFilter from "@/components/candidate/appliedJobs/AppliedJobsFilter";
import AppliedJobCard from "@/components/candidate/appliedJobs/AppliedJobCard";
import {
  EmptyState,
  ErrorState,
  JobCardSkeleton,
} from "@/components/ui/StateViews";

export default function AppliedJobsPage() {
  const [activeTab, setActiveTab] = useState<"APPLIED" | "SAVED" | "VIEWED">(
    "APPLIED",
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const { appliedJobs, isLoading, isError, error, refetch } = useAppliedJobs();

  const sortedJobs = useMemo(() => {
    const list = [...appliedJobs];
    list.sort((a, b) => {
      const tA = new Date(a.appliedDate).getTime();
      const tB = new Date(b.appliedDate).getTime();
      return sortOrder === "newest" ? tB - tA : tA - tB;
    });
    return list;
  }, [appliedJobs, sortOrder]);

  const toggleExpand = (id: string) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="bg-surface-card rounded-xl shadow-xs border border-border-default p-6 space-y-4">
        <div className="h-7 w-48 bg-surface-subtle animate-pulse rounded-lg mb-4" />
        <JobCardSkeleton />
        <JobCardSkeleton />
        <JobCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error || "Đã có lỗi xảy ra khi tải dữ liệu."}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <main className="w-full bg-surface-card rounded-xl shadow-xs border border-border-default overflow-hidden">
      <header className="p-6 pb-0 border-b border-border-default">
        <div className="flex items-center gap-2.5 mb-5">
          <Briefcase size={24} className="text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Việc làm của tôi
          </h1>
        </div>
        <AppliedJobsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          appliedCount={appliedJobs.length}
        />
      </header>

      <div className="p-6 pt-5">
        <AppliedJobsFilter sortOrder={sortOrder} onSortChange={setSortOrder} />

        <div className="flex flex-col gap-4 mt-5">
          {activeTab !== "APPLIED" ? (
            <EmptyState
              icon={<Briefcase size={24} />}
              title={
                activeTab === "SAVED"
                  ? "Chưa có việc làm đã lưu"
                  : "Chưa có việc làm đã xem gần đây"
              }
              description="Khám phá thêm hàng loạt cơ hội việc làm IT hấp dẫn trên ViecNgon."
              actionLabel="Tìm việc làm ngay"
              actionHref="/jobs"
            />
          ) : sortedJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={24} />}
              title="Bạn chưa ứng tuyển công việc nào"
              description="Hoàn thiện hồ sơ ViecNgon và ứng tuyển vào vị trí IT phù hợp với bạn."
              actionLabel="Khám phá việc làm IT"
              actionHref="/jobs"
            />
          ) : (
            sortedJobs.map((item) => (
              <AppliedJobCard
                key={item.applicationId}
                item={item}
                isExpanded={expandedJobId === item.applicationId}
                onToggle={() => toggleExpand(item.applicationId)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
