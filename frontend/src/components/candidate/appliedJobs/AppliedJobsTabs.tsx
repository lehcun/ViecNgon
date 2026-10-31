"use client";
import React from "react";

interface TabsProps {
  activeTab: "APPLIED" | "SAVED" | "VIEWED";
  setActiveTab: (tab: "APPLIED" | "SAVED" | "VIEWED") => void;
  appliedCount: number;
}

export default function AppliedJobsTabs({
  activeTab,
  setActiveTab,
  appliedCount,
}: TabsProps) {
  const tabs = [
    { id: "APPLIED", label: "Đã ứng tuyển", count: appliedCount },
    { id: "SAVED", label: "Việc làm đã lưu", count: 0 },
    { id: "VIEWED", label: "Đã xem gần đây", count: 0 },
  ] as const;

  return (
    <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3.5 px-0.5 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap focus:outline-none ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                isActive
                  ? "text-white bg-primary h-5 min-w-5"
                  : "text-slate-600 bg-slate-100"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
