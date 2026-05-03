import React from "react";
import { JobDetailResponse } from "@viecngon/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CompanyInfoAside = ({
  company,
}: {
  company?: JobDetailResponse["company"];
}) => {
  if (!company) return <h2>loading...</h2>;

  return (
    <div className="sticky top-24 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {/* Logo & Name */}
        <div className="flex items-start gap-4 mb-4">
          <Link
            href={`/company/${company.slug}`}
            className="w-20 h-20 border border-slate-200 rounded-xl p-2 bg-white shadow-sm shrink-0"
          >
            <Image
              src={company.logo || "/logo.png"}
              alt={company.slug || "not found"}
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-xl"
            />
          </Link>
          <div>
            <Link
              href={`/company/${company.slug}`}
              className="text-lg font-bold text-slate-800 line-clamp-2 hover:text-primary transition-colors"
            >
              {company.name}
            </Link>
            <div className="flex items-center gap-1 mt-1 text-amber-500">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" className="text-slate-300" />
              <span className="text-sm font-bold text-slate-800 ml-1">4.5</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 italic mb-6">
          &quot;Driving Southeast Asia Forward Together&quot;
        </p>

        {/* Info List */}
        <div className="space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 w-32 shrink-0">
              Mô hình công ty
            </span>
            <span className="text-sm font-semibold text-slate-800 text-right">
              {company.companyModel}
            </span>
          </div>
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 w-32 shrink-0">
              Lĩnh vực
            </span>
            <span className="text-sm font-semibold text-slate-800 text-right">
              {company.industry}
            </span>
          </div>
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 w-32 shrink-0">Quy mô</span>
            <span className="text-sm font-semibold text-slate-800 text-right">
              {company.size}
            </span>
          </div>
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 w-32 shrink-0">
              Quốc gia
            </span>
            <span className="text-sm font-semibold text-slate-800 text-right flex items-center gap-1 justify-end">
              {company.country}
            </span>
          </div>
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 w-32 shrink-0">
              Thời gian làm việc
            </span>
            <span className="text-sm font-semibold text-slate-800 text-right">
              {company.workingTime}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500 w-32 shrink-0">
              Làm việc ngoài giờ
            </span>
            <span className="text-sm font-semibold text-slate-800 text-right">
              {company.otPolicy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoAside;
