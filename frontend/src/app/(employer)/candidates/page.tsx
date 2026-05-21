"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import Link from "next/link";

// Giả lập dữ liệu ứng viên
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Trần Thị Phương Mai",
    email: "mai.tran@gmail.com",
    jobTitle: "Fullstack ReactJS/NodeJS (Remote)",
    appliedDate: "21/05/2026",
    status: "Chờ duyệt", // Chờ duyệt, Đang xem xét, Phỏng vấn, Từ chối, Đã tuyển
    avatar: "P",
  },
  {
    id: 2,
    name: "Nguyễn Văn Nam",
    email: "nam.nv@outlook.com",
    jobTitle: "Senior Java Backend Engineer",
    appliedDate: "20/05/2026",
    status: "Phỏng vấn",
    avatar: "N",
  },
  {
    id: 3,
    name: "Lê Hoàng Long",
    email: "long.le@company.vn",
    jobTitle: "Fullstack ReactJS/NodeJS (Remote)",
    appliedDate: "19/05/2026",
    status: "Đang xem xét",
    avatar: "L",
  },
  {
    id: 4,
    name: "Phạm Minh Anh",
    email: "minhanh.p@gmail.com",
    jobTitle: "Senior Java Backend Engineer",
    appliedDate: "18/05/2026",
    status: "Từ chối",
    avatar: "A",
  },
];

export default function EmployerCandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm helper để render màu sắc trạng thái
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Chờ duyệt":
        return "bg-amber-100 text-amber-700";
      case "Đang xem xét":
        return "bg-blue-100 text-blue-700";
      case "Phỏng vấn":
        return "bg-purple-100 text-purple-700";
      case "Đã tuyển":
        return "bg-emerald-100 text-emerald-700";
      case "Từ chối":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 mx-8 my-4">
      {/* 1. Tiêu đề & Thống kê nhanh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/employer-dashboard"
            className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 mb-2 transition-colors"
          >
            <ChevronLeft size={16} /> Quay lại Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý ứng viên
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi và quản lý các hồ sơ ứng tuyển vào công ty của bạn.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={18} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* 2. Bộ lọc & Tìm kiếm */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên ứng viên, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary">
            <option value="">Tất cả tin đăng</option>
            <option value="1">Fullstack ReactJS/NodeJS</option>
            <option value="2">Senior Java Backend</option>
          </select>
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="reviewing">Đang xem xét</option>
            <option value="interview">Phỏng vấn</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors flex items-center gap-2">
            <Filter size={18} /> Lọc
          </button>
        </div>
      </div>

      {/* 3. Bảng danh sách ứng viên */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Vị trí ứng tuyển
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ngày nộp
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CANDIDATES.map((can) => (
                <tr
                  key={can.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold shadow-sm">
                        {can.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {can.name}
                        </p>
                        <p className="text-xs text-slate-500">{can.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 font-medium line-clamp-1">
                      {can.jobTitle}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock size={14} /> {can.appliedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${getStatusStyle(can.status)}`}
                    >
                      {can.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Xem hồ sơ"
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        title="Liên hệ"
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        title="Thao tác khác"
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Phân trang (Pagination) */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-800">1-4</span> trong
            số <span className="font-bold text-slate-800">12</span> hồ sơ
          </p>
          <div className="flex gap-2">
            <button
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
              disabled
            >
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
