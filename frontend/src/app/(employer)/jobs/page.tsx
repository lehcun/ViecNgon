"use client";

import React, { useState } from "react";
import {
  Download,
  Plus,
  Briefcase,
  ArrowUp,
  BadgeCheck,
  Hourglass,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Search,
  Code,
  Calendar,
  ListFilter,
  MapPin,
  Timer,
  Pencil,
  RefreshCw,
  EyeOff,
  Trash2,
  CalendarX,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function JobManagementPage() {
  // Quản lý trạng thái Modal xác nhận xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState("");
  const [isConfirmDeleteChecked, setIsConfirmDeleteChecked] = useState(false);

  const openDeleteModal = (jobTitle: string) => {
    setJobToDelete(jobTitle);
    setIsConfirmDeleteChecked(false);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete("");
  };

  const executeDelete = () => {
    // Gọi API xóa ở đây
    console.log("Deleting job:", jobToDelete);
    closeDeleteModal();
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col w-full gap-8">
          {/* =========================================
              1. HEADER & QUICK ACTIONS
          ========================================== */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  Quản lý tin tuyển dụng
                </h1>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                  B2B Enterprise
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1.5">
                Quản lý, chỉnh sửa và theo dõi hiệu quả các bài đăng tuyển dụng
                công nghệ của doanh nghiệp
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                <Download size={18} className="text-slate-500" />
                <span>Xuất báo cáo Excel</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-hover transition-all active:scale-95">
                <Plus size={20} />
                <span>Tạo tin tuyển dụng mới</span>
              </button>
            </div>
          </div>

          {/* =========================================
              2. METRIC OVERVIEW CARDS
          ========================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-semibold">
                  Tổng số tin đăng
                </span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    28
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    tin
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <ArrowUp size={14} />
                  <span>+4 tháng này</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-semibold">
                  Đang hiển thị
                </span>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BadgeCheck size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    16
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    vị trí
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-emerald-600 text-[11px] font-bold border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Đang hoạt động</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-orange-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-semibold">
                  Chờ kiểm duyệt
                </span>
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  <Hourglass size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    3
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    tin
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                  <Clock size={14} />
                  <span>~2h xét duyệt</span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-semibold">
                  Tổng hồ sơ ứng tuyển
                </span>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    412
                  </span>
                  <span className="text-sm text-slate-500 font-medium">CV</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <TrendingUp size={14} />
                  <span>+23% tuần này</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              3. FILTER TABS, SEARCH & ACTION BAR
          ========================================== */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-5">
            {/* Filter Tabs Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold flex items-center gap-2 shadow-sm">
                  <span>Tất cả</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    28
                  </span>
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Đang tuyển</span>
                  <span className="text-slate-400 text-xs font-bold">16</span>
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Chờ duyệt</span>
                  <span className="text-slate-400 text-xs font-bold">3</span>
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>Đã đóng</span>
                  <span className="text-slate-400 text-xs font-bold">7</span>
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Bị từ chối</span>
                  <span className="text-slate-400 text-xs font-bold">2</span>
                </button>
              </div>
              <div className="hidden xl:flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Zap size={18} className="text-orange-400 fill-orange-400" />
                <span>
                  Tỷ lệ phản hồi trung bình:{" "}
                  <strong className="text-slate-800">94.2%</strong> trong 24 giờ
                </span>
              </div>
            </div>

            {/* Inputs Row */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search
                  size={20}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Tìm theo tiêu đề công việc, kỹ năng, mã tin đăng..."
                  type="text"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Code size={18} className="text-slate-400" />
                  <span>Tech Stack / Vị trí</span>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 rotate-90"
                  />
                </button>
                <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Calendar size={18} className="text-slate-400" />
                  <span>30 ngày qua</span>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 rotate-90"
                  />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <ListFilter size={18} className="text-slate-400" />
                  <span>Mới nhất</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================
              4. JOB MANAGEMENT DATA TABLE
          ========================================== */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[960px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tiêu đề công việc & Đội ngũ
                    </th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Thời gian đăng tin
                    </th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hồ sơ ứng tuyển
                    </th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1: Active */}
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-5">
                      <div className="flex flex-col gap-2 max-w-[340px]">
                        <a
                          className="text-base font-bold text-slate-800 hover:text-primary transition-colors"
                          href="#"
                        >
                          Senior Frontend Developer (ReactJS / Next.js)
                        </a>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> FPT Software HCM
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Full-time
                          </span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Hybrid
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            React
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            TypeScript
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            Tailwind
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                        <span>Đăng: 12/05/2024</span>
                        <span className="text-slate-400">Hạn: 12/06/2024</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 mt-1 text-xs">
                          <Timer size={14} /> Còn 18 ngày
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-800">
                            48
                          </span>
                          <span className="text-sm text-slate-500 font-medium">
                            hồ sơ
                          </span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full w-max flex items-center gap-1.5 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          8 CV mới chưa đọc
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Đang tuyển
                      </span>
                    </td>
                    <td className="py-5 px-5 text-right align-top pt-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors">
                          Xem ứng viên
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Đăng lại / Làm mới"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Tạm dừng hiển thị"
                        >
                          <EyeOff size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          onClick={() =>
                            openDeleteModal(
                              "Senior Frontend Developer (ReactJS / Next.js)",
                            )
                          }
                          title="Xóa bài đăng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2: Active */}
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-5">
                      <div className="flex flex-col gap-2 max-w-[340px]">
                        <a
                          className="text-base font-bold text-slate-800 hover:text-primary transition-colors"
                          href="#"
                        >
                          Lead DevOps / Cloud Architect (AWS & K8s)
                        </a>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> Hanoi Hub
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Full-time
                          </span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            On-site
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            AWS
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            Kubernetes
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            Terraform
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                        <span>Đăng: 15/05/2024</span>
                        <span className="text-slate-400">Hạn: 30/06/2024</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 mt-1 text-xs">
                          <Timer size={14} /> Còn 24 ngày
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-800">
                            26
                          </span>
                          <span className="text-sm text-slate-500 font-medium">
                            hồ sơ
                          </span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full w-max flex items-center gap-1.5 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          5 CV mới
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Đang tuyển
                      </span>
                    </td>
                    <td className="py-5 px-5 text-right align-top pt-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors">
                          Xem ứng viên
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Đăng lại / Làm mới"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Tạm dừng hiển thị"
                        >
                          <EyeOff size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          onClick={() =>
                            openDeleteModal(
                              "Lead DevOps / Cloud Architect (AWS & K8s)",
                            )
                          }
                          title="Xóa bài đăng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Pending */}
                  <tr className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-5">
                      <div className="flex flex-col gap-2 max-w-[340px]">
                        <a
                          className="text-base font-bold text-slate-800 hover:text-primary transition-colors"
                          href="#"
                        >
                          Backend Engineer (Golang / High Scalability)
                        </a>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> Da Nang / Remote
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Full-time
                          </span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Remote
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            Golang
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            gRPC
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                            Kafka
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                        <span>Đăng: 22/05/2024</span>
                        <span className="text-slate-400">Hạn: 22/06/2024</span>
                        <span className="text-orange-500 font-bold flex items-center gap-1 mt-1 text-xs">
                          <Hourglass size={14} /> Đang duyệt nội dung
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-800">
                            14
                          </span>
                          <span className="text-sm text-slate-500 font-medium">
                            lưu tin
                          </span>
                        </div>
                        <span className="text-slate-400 text-xs font-medium">
                          Chưa nhận hồ sơ
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-bold border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Chờ duyệt
                      </span>
                    </td>
                    <td className="py-5 px-5 text-right align-top pt-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
                          Xem trước
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          onClick={() =>
                            openDeleteModal(
                              "Backend Engineer (Golang / High Scalability)",
                            )
                          }
                          title="Xóa bài đăng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4: Closed */}
                  <tr className="hover:bg-slate-50 transition-colors group opacity-70">
                    <td className="py-5 px-5">
                      <div className="flex flex-col gap-2 max-w-[340px]">
                        <a
                          className="text-base font-bold text-slate-800 hover:text-primary transition-colors"
                          href="#"
                        >
                          Senior AI / Machine Learning Specialist
                        </a>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> Hanoi
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Full-time
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                            Python
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                            PyTorch
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                            LLMs
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                        <span>Đăng: 01/04/2024</span>
                        <span className="text-slate-400">
                          Hết hạn: 01/05/2024
                        </span>
                        <span className="text-slate-400 font-bold flex items-center gap-1 mt-1 text-xs">
                          <CalendarX size={14} /> Đã hết hạn nộp
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-800">
                            92
                          </span>
                          <span className="text-sm text-slate-500 font-medium">
                            hồ sơ
                          </span>
                        </div>
                        <span className="text-slate-500 text-xs font-medium">
                          Đã tuyển 2/2 chỉ tiêu
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-bold border border-slate-200">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        Đã đóng
                      </span>
                    </td>
                    <td className="py-5 px-5 text-right align-top pt-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
                          Kho hồ sơ (92)
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                          title="Tái kích hoạt bài đăng"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          onClick={() =>
                            openDeleteModal(
                              "Senior AI / Machine Learning Specialist",
                            )
                          }
                          title="Xóa bài đăng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5: Rejected */}
                  <tr className="hover:bg-slate-50 transition-colors group bg-rose-50/40">
                    <td className="py-5 px-5">
                      <div className="flex flex-col gap-2 max-w-[340px]">
                        <a
                          className="text-base font-bold text-slate-800 hover:text-primary transition-colors"
                          href="#"
                        >
                          Junior QA / Automation Tester
                        </a>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> HCM City
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            Full-time
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                            Selenium
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                            Cypress
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-rose-600 font-medium text-xs bg-rose-100 px-2.5 py-1.5 rounded-md border border-rose-200 w-fit">
                          <AlertCircle size={14} />
                          <span>
                            Lý do: Thiếu dải lương & chi tiết phúc lợi theo
                            chuẩn ViecNgon
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                        <span>Đăng: 18/05/2024</span>
                        <span className="text-rose-600">
                          Từ chối: 19/05/2024
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-extrabold text-slate-400">
                          0
                        </span>
                        <span className="text-slate-400 text-xs font-medium">
                          Không công khai
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-5 align-top pt-6">
                      <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs px-3 py-1.5 rounded-full font-bold border border-rose-200">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Bị từ chối
                      </span>
                    </td>
                    <td className="py-5 px-5 text-right align-top pt-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors shadow-sm shadow-primary/20">
                          Sửa & Gửi lại
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          onClick={() =>
                            openDeleteModal("Junior QA / Automation Tester")
                          }
                          title="Xóa bài đăng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Footer & Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Hiển thị</span>
                <span className="font-bold text-slate-800">1 - 5</span>
                <span>
                  trên tổng số <strong className="text-slate-800">28</strong>{" "}
                  bài đăng
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-40"
                  disabled
                >
                  <ChevronLeft size={18} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-200 text-sm font-medium flex items-center justify-center transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-200 text-sm font-medium flex items-center justify-center transition-colors">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-200 text-sm font-medium flex items-center justify-center transition-colors">
                  6
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================
              BOTTOM TIP
          ========================================== */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="text-base text-slate-800 font-bold mb-1">
                  Tối ưu tin tuyển dụng với ViecNgon AI Screener
                </h4>
                <p className="text-sm text-slate-500">
                  Bài đăng có đầy đủ Tech Stack và mức lương minh bạch có tỷ lệ
                  nhận hồ sơ phù hợp cao hơn 45%.
                </p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-2.5 rounded-lg bg-white border border-slate-200 text-primary font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MODAL XÓA BÀI ĐĂNG
      ========================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
                <AlertTriangle size={26} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-slate-800">
                  Xác nhận xóa bài đăng
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Bạn có chắc chắn muốn xóa tin tuyển dụng:
                  <span className="font-bold text-slate-800 block mt-2 py-1.5 px-3 bg-slate-50 border border-slate-100 rounded-md">
                    {jobToDelete}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 flex items-start gap-3">
              <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Hành động này không thể hoàn tác. Toàn bộ thông tin CV và dữ
                liệu liên quan sẽ được chuyển vào kho lưu trữ.
              </span>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-2 select-none group">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                checked={isConfirmDeleteChecked}
                onChange={(e) => setIsConfirmDeleteChecked(e.target.checked)}
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium transition-colors">
                Tôi hiểu các rủi ro và xác nhận muốn tiếp tục
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-6">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeDelete}
                disabled={!isConfirmDeleteChecked}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  isConfirmDeleteChecked
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Trash2 size={18} />
                Xóa bài đăng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
