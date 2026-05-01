"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import EmployerCard from "./EmployerCard";
import { useTopCompanies } from "@/hooks/employer/useTopEmployer";
import { Company } from "@viecngon/types";

export default function TopEmployers() {
  const { companies } = useTopCompanies();
  return (
    <section className="bg-[#f8fafc] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Nhà Tuyển Dụng Hàng Đầu
          </h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </div>

        {/* 1. Phần Marquee Logo */}
        <div className="mb-16">
          <Marquee
            gradient={true}
            gradientColor="#f8fafc"
            speed={40}
            pauseOnHover={true}
          >
            {companies?.concat(companies).map((emp: Company, index: number) => (
              <div
                key={index}
                className="mx-10 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 flex items-center justify-center h-12"
              >
                <Image
                  src={emp.logo}
                  alt={emp.name}
                  width={120}
                  height={48}
                  className="object-contain h-12 w-auto max-w-30"
                />
              </div>
            ))}
          </Marquee>
        </div>

        {/* 2. Phần Grid 4 cột */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companies?.map((company: Company) => (
            <EmployerCard key={company.id} company={company} />
          ))}
        </div>

        {/* Nút xem thêm */}
        <div className="mt-12 text-center">
          <button className="text-blue-600 font-bold hover:underline">
            Xem tất cả nhà tuyển dụng &rsaquo;
          </button>
        </div>
      </div>
    </section>
  );
}
