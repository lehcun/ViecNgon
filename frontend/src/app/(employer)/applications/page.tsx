"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users, Filter, ChevronLeft } from "lucide-react";
import { useEmployerApplication } from "@/hooks/recruiter/useEmployerCandidates";
import CandidateApplicationCard from "@/components/employer/CandidateApplicationCard";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";

export default function EmployerApplicationsPage() {
  const { applications, isLoading, isError, error } = useEmployerApplication();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredApplications = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return applications.filter((app) => {
      const matchKeyword =
        !keyword ||
        app.candidateName.toLowerCase().includes(keyword) ||
        app.jobTitle.toLowerCase().includes(keyword) ||
        (app.contactEmail && app.contactEmail.toLowerCase().includes(keyword));

      const matchStatus =
        statusFilter === "ALL" || app.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/employer-dashboard"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary mb-2 transition-colors"
          >
            <ChevronLeft size={16} /> Quay lại Tổng quan
          </Link>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <span>Hồ sơ ứng viên đã nộp</span>
            {!isLoading && !isError && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/20">
                {applications.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Sàng lọc, đánh giá độ phù hợp AI và lên lịch phỏng vấn cho từng ứng
            viên.
          </p>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="bg-surface-card border border-border-default rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên ứng viên, email hoặc vị trí tuyển dụng..."
            className="w-full h-10 pl-10 pr-4 text-sm text-text-primary bg-surface-page border border-border-default rounded-lg outline-none focus:bg-surface-card focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>

        <div className="relative sm:w-56">
          <Filter
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Lọc theo trạng thái hồ sơ"
            className="w-full h-10 pl-10 pr-4 text-sm font-medium text-text-primary bg-surface-page border border-border-default rounded-lg outline-none focus:bg-surface-card focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DANG_XEM_XET">Đang xem xét</option>
            <option value="PHONG_VAN">Phỏng vấn</option>
            <option value="DUOC_NHAN">Được nhận</option>
            <option value="BI_LOAI">Chưa phù hợp</option>
          </select>
        </div>
      </div>

      {/* Danh sách ứng viên */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-border-default rounded-xl p-5 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-surface-subtle shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-subtle rounded w-1/3" />
                  <div className="h-3.5 bg-surface-muted rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-surface-muted rounded-lg" />
                <div className="h-9 w-28 bg-surface-subtle rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-surface-card border border-border-default rounded-xl p-6">
          <ErrorState
            title="Không thể tải danh sách ứng viên"
            message={
              error instanceof Error
                ? error.message
                : "Vui lòng kiểm tra kết nối và thử lại."
            }
          />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-surface-card border border-border-default rounded-xl p-6">
          <EmptyState
            icon={<Users size={28} />}
            title={
              applications.length === 0
                ? "Chưa có hồ sơ ứng tuyển nào"
                : "Không tìm thấy ứng viên phù hợp bộ lọc"
            }
            description={
              applications.length === 0
                ? "Khi ứng viên nộp CV vào các tin tuyển dụng của công ty, danh sách hồ sơ sẽ hiển thị tại đây."
                : "Hãy thử thay đổi từ khóa tìm kiếm hoặc trạng thái lọc."
            }
            actionLabel={
              applications.length === 0 ? "Đăng tin tuyển dụng" : undefined
            }
            actionHref={applications.length === 0 ? "/post-job" : undefined}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => (
            <CandidateApplicationCard
              key={app.applicationId}
              application={app}
            />
          ))}
        </div>
      )}
    </div>
  );
}
