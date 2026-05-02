"use client";

import React from "react";
import {
  MapPin,
  Star,
  ThumbsUp,
  Building2,
  Users,
  Clock,
  Globe,
  Award,
  ExternalLink,
} from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCompanyDetail } from "@/hooks/company/useCompanyDetail";
import CompanyJobLists from "./CompanyJobLists";

const CompanyDetailModel = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { company } = useCompanyDetail(slug);

  return (
    <>
      {/* 1. HEADER BANNER (Chuyển sang nền Xanh Đen - primary-dark) */}
      <section className="bg-linear-to-r from-primary-dark via-[#0f2a5c] to-primary-dark pt-24 pb-12 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-28 h-28 rounded-xl bg-white shadow-lg border-2 border-primary/20 shrink-0">
              <Image
                src={company?.logo ?? "/logo.png"}
                alt={company?.slug ?? "not found"}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2">
                {company?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary-light" />
                  {company?.location}
                </span>
                <span className="flex items-center gap-1.5 underline hover:text-white cursor-pointer">
                  <Building2 size={16} className="text-primary-light" />{" "}
                  {company?.totalJobs} việc làm đang tuyển dụng
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-md transition-colors shadow-lg shadow-primary/30">
                  Viết đánh giá
                </button>
                <button className="px-6 py-2 bg-transparent hover:bg-white/10 border border-slate-400 text-white font-semibold rounded-md transition-colors">
                  Theo dõi
                </button>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex gap-6 border border-white/10">
            <div className="text-center">
              <div className="flex items-end gap-2 justify-center">
                <span className="text-3xl font-black text-white">4.9</span>
                <div className="flex text-yellow-400 pb-1">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1">45 đánh giá</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center flex flex-col justify-center">
              <span className="text-2xl font-black text-emerald-400">97%</span>
              <p className="text-xs text-slate-300 mt-1">
                Khuyên làm việc tại đây
              </p>
            </div>
          </div>
        </div>
      </section>
      ;{/* 2. MAIN CONTENT (Grid 2 cột) */}
      <section className="max-w-6xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: THÔNG TIN CÔNG TY */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-2 flex">
            <button className="px-6 py-4 text-primary font-bold border-b-2 border-primary">
              Giới thiệu
            </button>
            <button className="px-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition">
              Đánh giá{" "}
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full ml-1">
                45
              </span>
            </button>
            <button className="px-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition">
              Bài viết
            </button>
          </div>

          {/* Thông tin chung */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-primary pl-3">
              Thông tin chung
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building2 size={16} /> Mô hình công ty
                </p>
                <p className="font-semibold text-slate-800">
                  {company?.companyModel}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building2 size={16} /> Lĩnh vực công ty
                </p>
                <p className="font-semibold text-slate-800">
                  {company?.industry}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                  <Users size={16} /> Quy mô công ty
                </p>
                <p className="font-semibold text-slate-800">{company?.size}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                  <Globe size={16} /> Quốc gia
                </p>
                <p className="font-semibold text-slate-800 flex items-center gap-2">
                  <img
                    src="https://flagcdn.com/w20/vn.png"
                    alt="VietNam"
                    className="w-5 h-auto rounded-sm"
                  />{" "}
                  {company?.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                  <Clock size={16} /> Thời gian làm việc
                </p>
                <p className="font-semibold text-slate-800">
                  {company?.workingTime ?? "Chưa rõ"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1.5">
                  <Clock size={16} /> Làm việc ngoài giờ
                </p>
                <p className="font-semibold text-slate-800">
                  {company?.otPolicy ?? "Chưa có chính sách OT"}
                </p>
              </div>
            </div>
          </div>

          {/* Giải thưởng (Chuyển sang nền xanh nhạt của ViecNgon) */}
          <div className="bg-primary-light/50 rounded-xl border border-primary/20 p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-primary/5">
              <Award size={150} />
            </div>
            <h2 className="text-xl font-bold text-primary mb-6 relative z-10 flex items-center gap-2">
              <Award size={24} /> Giải thưởng
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                <div className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Award size={16} />
                  </div>
                  Công ty IT tốt nhất Việt Nam 2025
                </div>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Star
                      size={14}
                      className="text-yellow-400"
                      fill="currentColor"
                    />{" "}
                    5.0
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ThumbsUp size={14} fill="currentColor" /> 100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Giới thiệu công ty & Website */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-primary pl-3">
              Giới thiệu công ty
            </h2>

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-8">
              {company?.description}
            </div>

            {/* Mục Website Công ty (Mới thêm) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <Globe size={18} className="text-primary" /> Website công ty
                </h3>
                <p className="text-sm text-slate-500">
                  Tìm hiểu thêm về sản phẩm và văn hóa của chúng tôi
                </p>
              </div>
              <a
                href={company?.website ?? "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary text-primary font-semibold rounded-md hover:bg-primary-light transition-colors"
              >
                website công ty
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH VIỆC LÀM */}
        <div className="w-full lg:w-1/3">
          <CompanyJobLists />
        </div>
      </section>
      ;
    </>
  );
};

export default CompanyDetailModel;
