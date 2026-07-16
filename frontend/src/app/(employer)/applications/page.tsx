"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Search, Filter, ChevronLeft } from "lucide-react";
import { useEmployerApplication } from "@/hooks/recruiter/useEmployerCandidates";
import CandidateCard from "@/components/employer/CandidateApplicationCard";
import Link from "next/link";

export default function ApplicationListPage() {
  const { applications, isLoading, isError } = useEmployerApplication();

  // State phục vụ Bộ lọc
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Logic Lọc dữ liệu trên Frontend (Không cần gọi lại API)
  const filteredCandidates = useMemo(() => {
    if (!applications) return [];

    return applications.filter((app) => {
      // Lọc theo trạng thái
      const matchStatus = filterStatus === "ALL" || app.status === filterStatus;

      // Lọc theo từ khóa (Tên ứng viên hoặc Tên công việc)
      const keyword = searchKeyword.toLowerCase();
      const matchKeyword =
        app.candidateName.toLowerCase().includes(keyword) ||
        app.jobTitle.toLowerCase().includes(keyword);

      return matchStatus && matchKeyword;
    });
  }, [applications, searchKeyword, filterStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2 text-primary">
          <Loader2 className="animate-spin" size={40} />
          <p className="font-medium text-slate-600">
            Đang tải danh sách hồ sơ...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-500 font-bold text-lg">
          Đã xảy ra lỗi khi tải dữ liệu!
        </p>
        <p className="text-slate-500">
          Vui lòng tải lại trang hoặc kiểm tra kết nối mạng.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:py-8">
      {/* Header & Thống kê nhanh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/employer-dashboard"
            className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 mb-2 transition-colors"
          >
            <ChevronLeft size={16} /> Quay lại Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý Hồ sơ Ứng viên
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Bạn có tổng cộng{" "}
            <span className="font-bold text-primary">
              {applications.length}
            </span>{" "}
            hồ sơ ứng tuyển.
          </p>
        </div>
      </div>

      {/* Thanh Công cụ Bộ lọc */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
        {/* Tìm kiếm */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm theo tên ứng viên hoặc tên công việc..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>

        {/* Lọc Trạng thái */}
        <div className="relative sm:w-64 shrink-0">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer font-medium text-slate-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DANG_XEM_XET">Đang xem xét</option>
            <option value="PHONG_VAN">Phỏng vấn</option>
            <option value="DUOC_NHAN">Được nhận</option>
            <option value="BI_LOAI">Bị loại</option>
          </select>
        </div>
      </div>

      {/* Danh sách Ứng viên */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-600 font-medium text-lg mb-1">
            Không tìm thấy hồ sơ nào
          </p>
          <p className="text-slate-400 text-sm">
            Thử thay đổi từ khóa hoặc bộ lọc trạng thái xem sao.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredCandidates.map((application) => (
            <CandidateCard
              key={application.applicationId}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  );
}
