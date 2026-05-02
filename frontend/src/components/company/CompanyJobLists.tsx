import { CompanyDetailResponse } from "@viecngon/types";
import { CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const CompanyJobLists = ({
  totalJobs,
  jobs,
}: {
  totalJobs: number;
  jobs: CompanyDetailResponse["activeJobs"];
}) => {
  return (
    <div>
      <div className="sticky top-24">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {totalJobs} việc làm đang tuyển dụng
        </h2>

        <div className="space-y-4">
          {/* Card Việc Làm 1 */}
          <Link
            href="/jobs/1"
            className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              NEW FOR YOU
            </div>
            <p className="text-xs text-slate-500 mb-2">Đăng 1 giờ trước</p>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
              [Đà Nẵng] Full-Stack Developer (Next.js/ NestJS)
            </h3>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="font-semibold text-slate-800">
                Đăng nhập để xem mức lương
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" /> Tại văn phòng -
                Đà Nẵng
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[11px] font-medium bg-primary-light text-primary border border-primary/20 px-2 py-1 rounded">
                Next.js
              </span>
              <span className="text-[11px] font-medium bg-primary-light text-primary border border-primary/20 px-2 py-1 rounded">
                NestJS
              </span>
              <span className="text-[11px] font-medium bg-primary-light text-primary border border-primary/20 px-2 py-1 rounded">
                Docker
              </span>
            </div>

            <ul className="mt-4 space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Lương tháng 13 & Performance Bonus</li>
              <li>Cấp sẵn MacBook Pro M3</li>
            </ul>
          </Link>

          {/* Card Việc Làm 2 */}
          <Link
            href="/jobs/2"
            className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all group"
          >
            <p className="text-xs text-slate-500 mb-2">Đăng 3 ngày trước</p>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
              [TP HCM] Agile Delivery Manager
            </h3>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="font-semibold text-slate-800">
                Đăng nhập để xem mức lương
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" /> Tại văn phòng -
                TP Hồ Chí Minh
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                Project Management
              </span>
              <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                Scrum
              </span>
            </div>
          </Link>
        </div>

        <button className="w-full mt-4 py-3 text-primary font-bold hover:bg-primary-light rounded-lg transition flex items-center justify-center gap-1">
          Xem tất cả việc làm <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CompanyJobLists;
