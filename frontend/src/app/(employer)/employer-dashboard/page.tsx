import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import EmployerSidebar from "@/components/employer/EmployerSidebar";

export default function EmployerDashboard() {
  return (
    <main className="px-4 md:px-8 pb-24 pt-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ================= CỘT TRÁI (SIDEBAR) ================= */}
        <EmployerSidebar />

        {/* ================= CỘT PHẢI (NỘI DUNG) ================= */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-slate-800">
              Tổng quan tuyển dụng
            </h1>
            <div className="text-sm text-slate-500">
              Cập nhật lúc: 10:15 AM, Hôm nay
            </div>
          </div>

          {/* 1. KHỐI THỐNG KÊ NHANH (Grid 3 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-primary transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Tin đang hiển thị
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-800">4</span>
                  <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                    <TrendingUp size={12} /> +1
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-primary transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Hồ sơ chờ duyệt
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-800">12</span>
                  <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1 animate-pulse">
                    Mới
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-primary transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Lượt xem tin (7 ngày)
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-800">
                    1,248
                  </span>
                  <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                    <TrendingUp size={12} /> 15%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Eye size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-2">
            {/* 2. TIN TUYỂN DỤNG GẦN ĐÂY (Chiếm 2/3 không gian) */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  Tin tuyển dụng gần đây
                </h2>
                <Link
                  href="/employer/jobs"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Job Item 1 */}
                <div className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-base">
                      [Đà Nẵng] Senior ReactJS Developer
                    </h3>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> Đà Nẵng
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> Hết hạn: 30/05/2026
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={12} /> Đang hiển thị
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-semibold text-slate-700">
                        <span className="text-primary">8</span> ứng viên
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-slate-700">
                        <span className="text-slate-900">342</span> lượt xem
                      </span>
                    </div>
                  </div>
                </div>
                {/* Job Item 2 */}
                <div className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-base">
                      [HCM] Backend Developer (NestJS)
                    </h3>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> TP. HCM
                    </span>
                    <span className="flex items-center gap-1 text-rose-500">
                      <Clock size={14} /> Hết hạn: Hôm nay
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={12} /> Đang hiển thị
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-semibold text-slate-700">
                        <span className="text-primary">24</span> ứng viên
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-slate-700">
                        <span className="text-slate-900">890</span> lượt xem
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ỨNG VIÊN MỚI NHẤT (Chiếm 1/3 không gian) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  Hồ sơ chờ duyệt{" "}
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    12
                  </span>
                </h2>
              </div>

              <div className="flex-1 p-5 flex flex-col gap-4">
                {/* Candidate 1 */}
                <div className="flex gap-3 items-start border border-slate-100 p-3 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                    N
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Nguyễn Văn A
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-1">
                      Ứng tuyển: Senior ReactJS
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> 2 giờ trước
                    </span>
                  </div>
                </div>

                {/* Candidate 2 */}
                <div className="flex gap-3 items-start border border-slate-100 p-3 rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    T
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Trần Thị B
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-1">
                      Ứng tuyển: Backend Developer
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> 5 giờ trước
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 text-center">
                  <Link
                    href="/employer/candidates"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Xem tất cả hồ sơ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
