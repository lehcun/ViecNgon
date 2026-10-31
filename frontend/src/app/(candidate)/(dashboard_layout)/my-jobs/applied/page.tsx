"use client";

import React, { useState } from "react";
import { Briefcase } from "lucide-react";
import { useAppliedJobs } from "@/hooks/candidate/useAppliedJobs";
import AppliedJobsTabs from "@/components/candidate/appliedJobs/AppliedJobsTabs";
import AppliedJobsFilter from "@/components/candidate/appliedJobs/AppliedJobsFilter";
import AppliedJobCard from "@/components/candidate/appliedJobs/AppliedJobCard";

export default function AppliedJobsPage() {
  const [activeTab, setActiveTab] = useState<"APPLIED" | "SAVED" | "VIEWED">(
    "APPLIED",
  );
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const { appliedJobs, isLoading, isError, error } = useAppliedJobs();

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-rose-500 font-medium">
        {error || "Đã có lỗi xảy ra khi tải dữ liệu."}
      </div>
    );
  }

  return (
    <main className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-auto">
      {/* HEADER & TABS */}
      <header className="p-6 md:p-8 pb-0 border-b border-slate-200">
        <div className="flex items-center gap-2.5 mb-6">
          <Briefcase size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Việc làm của tôi
          </h1>
        </div>
        <AppliedJobsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          appliedCount={appliedJobs.length}
        />
      </header>

      {/* CONTENT */}
      <div className="p-6 md:p-8 pt-5">
        <AppliedJobsFilter />

        <div className="flex flex-col gap-4 mt-6">
          {appliedJobs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Bạn chưa ứng tuyển công việc nào.
            </div>
          ) : (
            appliedJobs.map((item) => (
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
