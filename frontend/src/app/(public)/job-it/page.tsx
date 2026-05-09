"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  DollarSign,
  Heart,
  Filter,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobFilter } from "@/hooks/job/useJobFilter";
import { JobDetailResponse } from "@viecngon/types";

export default function ITJobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. LẤY FILTER HIỆN TẠI TỪ URL ĐỂ ĐƯA VÀO HOOK
  const currentFilters = {
    thanhPho: searchParams.get("thanhPho") || undefined,
    loaiHinh: searchParams.get("loaiHinh") || undefined,
    hinhThucLamViec: searchParams.get("hinhThucLamViec") || undefined,
    mucLuong: searchParams.get("mucLuong") || undefined,
    page: searchParams.get("page") || "1",
  };

  // 2. GỌI HOOK FETCH DATA (Nó sẽ tự động chạy lại mỗi khi URL thay đổi)
  const { data: jobData, isLoading, isError } = useJobFilter(currentFilters);

  // Quản lý việc làm đang được chọn để hiển thị ở cột phải
  const [activeJob, setActiveJob] = useState<JobDetailResponse | null>(null);

  // Tự động chọn Job đầu tiên khi dữ liệu trả về thành công
  useEffect(() => {
    if (jobData?.data && jobData.data.length > 0) {
      setActiveJob(jobData.data[0]);
    } else {
      setActiveJob(null);
    }
  }, [jobData]);

  // 3. HÀM CẬP NHẬT URL KHI NGƯỜI DÙNG CHỌN BỘ LỌC
  const handleFilterChange = (key: string, value: string) => {
    // Lấy toàn bộ param hiện tại
    const params = new URLSearchParams(searchParams.toString());

    // Nếu có giá trị thì set, nếu rỗng thì xóa khỏi URL cho gọn
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset về trang 1 mỗi khi đổi bộ lọc
    params.set("page", "1");

    // Đẩy URL mới lên thanh địa chỉ (không refresh nguyên trang)
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Thanh tìm kiếm (Header Search) */}
      <div className="bg-primary-dark pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-md">
            {/* Input Địa điểm */}
            <div className="relative shrink-0 md:w-64">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <select
                onChange={(e) => handleFilterChange("thanhPho", e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white rounded-lg outline-none text-slate-700 font-medium appearance-none cursor-pointer"
              >
                <option value="">Tất cả thành phố</option>
                <option value="HCM">Hồ Chí Minh</option>
                <option value="HN">Hà Nội</option>
                <option value="DN">Đà Nẵng</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>

            {/* Input Từ khóa */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập từ khoá theo kỹ năng, chức vụ, công ty..."
                className="w-full h-12 pl-4 pr-4 bg-white rounded-lg outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Nút Tìm kiếm */}
            <button className="h-12 px-8 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0">
              <Search size={20} /> Tìm Kiếm
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 -mt-20">
        {/* 2. Banner Nhà Tuyển Dụng Nổi Bật (Đã nâng cấp UI) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 flex flex-col md:flex-row h-auto md:h-40 hover:shadow-md transition-shadow">
          {/* Khối 1: Ảnh bìa & Nhãn nổi bật (Chiếm ~30%) */}
          <div className="w-full md:w-[30%] relative h-36 md:h-full shrink-0">
            {/* Nhãn "Nhà Tuyển Dụng Nổi Bật" màu cam */}
            <div className="absolute top-0 left-0 bg-[#f97316] text-white text-[11px] font-bold px-3 py-1.5 rounded-br-xl z-10 shadow-sm flex items-center gap-1">
              <span className="text-yellow-200">★</span> Nhà Tuyển Dụng Nổi Bật
            </div>
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
              alt="MB Bank Building"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Khối 2: Thông tin Công ty (Chiếm ~35%) */}
          <div className="w-full md:w-[35%] p-4 md:p-5 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
            <div className="w-16 h-16 md:w-20 md:h-20 border border-slate-100 rounded-xl shrink-0 shadow-sm flex items-center justify-center">
              {/* Thay bằng Logo thực tế của công ty */}
              <Image
                src="https://res.cloudinary.com/dbvlsf9bi/image/upload/v1778235583/mbbanklogo_ppxprh.jpg"
                alt="MB Bank"
                height={100}
                width={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-base md:text-lg font-bold text-slate-800 leading-tight mb-1">
                MB Bank
              </h3>
              <p className="text-[13px] text-slate-500 mb-1 flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" /> Hà Nội
              </p>
              <p className="text-[13px] font-medium text-slate-600 mb-2 line-clamp-1">
                Ngân hàng TMCP Quân Đội (MB)
              </p>
              <Link
                href="#"
                className="text-[13px] font-bold text-primary hover:text-primary-hover transition-colors"
              >
                Xem 2 việc làm &rsaquo;
              </Link>
            </div>
          </div>

          {/* Khối 3: Danh sách việc làm nổi bật (Chiếm ~35%) */}
          <div className="w-full md:w-[35%] p-4 md:p-5 flex flex-col justify-center gap-2.5 bg-slate-50/50">
            <Link href="#" className="flex items-start gap-2 group">
              {/* Icon Target màu đỏ */}
              <div className="mt-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-rose-100 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
              </div>
              <span className="text-[13px] font-medium text-slate-700 group-hover:text-primary transition-colors line-clamp-1">
                Data Scientist - Data Division
              </span>
            </Link>

            <Link href="#" className="flex items-start gap-2 group">
              <div className="mt-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-rose-100 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
              </div>
              <span className="text-[13px] font-medium text-slate-700 group-hover:text-primary transition-colors line-clamp-1">
                Chuyên viên Quản lý dự án - Project Manager (PM)
              </span>
            </Link>

            <Link href="#" className="flex items-start gap-2 group">
              <div className="mt-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-rose-100 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
              </div>
              <span className="text-[13px] font-medium text-slate-700 group-hover:text-primary transition-colors line-clamp-1">
                Senior Data Security - Data Division
              </span>
            </Link>
          </div>
        </div>

        {/* 3. Header & Bộ lọc (Filters) */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            {isLoading
              ? "Đang tìm kiếm..."
              : `${jobData?.total || 0} việc làm IT tại Việt Nam`}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                value={currentFilters.thanhPho || ""}
                onChange={(e) => handleFilterChange("thanhPho", e.target.value)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-600 outline-none cursor-pointer hover:border-primary hover:text-primary transition-colors"
              >
                <option value="">Tất cả thành phố</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
              <select
                value={currentFilters.hinhThucLamViec || ""}
                onChange={(e) =>
                  handleFilterChange("hinhThucLamViec", e.target.value)
                }
                className="px-4 py-2 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-600 outline-none cursor-pointer hover:border-primary"
              >
                <option value="">Mọi hình thức</option>
                <option value="TaiVanPhong">Tại văn phòng</option>
                <option value="Remote">Từ xa (Remote)</option>
                <option value="Hybrid">Linh hoạt (Hybrid)</option>
              </select>

              {/* Filter Mức Lương */}
              <select
                value={currentFilters.mucLuong || ""}
                onChange={(e) => handleFilterChange("mucLuong", e.target.value)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-600 outline-none cursor-pointer hover:border-primary"
              >
                <option value="">Mọi mức lương</option>
                <option value="500">Trên 500$</option>
                <option value="1000">Trên 1000$</option>
                <option value="2000">Trên 2000$</option>
              </select>
            </div>

            <button className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Filter size={16} /> Bộ lọc
            </button>
          </div>
        </div>

        {/* 4. Vùng Layout 2 cột: List & Preview */}
        <div className="flex flex-col lg:flex-row gap-6 pb-20 relative">
          {/* CỘT TRÁI: Danh sách việc làm (Scrollable) */}
          <div className="w-full lg:w-[45%] flex flex-col gap-4">
            {/* Trạng thái Đang tải */}
            {isLoading && (
              <div className="flex justify-center items-center p-12 bg-white rounded-xl border border-slate-200">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Trạng thái Lỗi */}
            {isError && (
              <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                Có lỗi xảy ra khi tải dữ liệu!
              </div>
            )}

            {/* Hiển thị Dữ liệu thực tế */}
            {!isLoading && !isError && jobData?.data.length === 0 && (
              <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                Không tìm thấy việc làm nào phù hợp với bộ lọc.
              </div>
            )}

            {/* Render Map Data thật */}
            {!isLoading &&
              jobData?.data.map((job: JobDetailResponse) => (
                <div
                  key={job.id}
                  onClick={() => setActiveJob(job)}
                  className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 relative overflow-hidden flex flex-col ${
                    activeJob?.id === job.id
                      ? "border-primary shadow-md"
                      : "border-slate-200 hover:border-primary/50"
                  }`}
                >
                  {/* Label SUPER HOT (Giả lập điều kiện: Nếu tin có > 50 lượt xem thì cho HOT) */}
                  {job.views > 100 && (
                    <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg">
                      🔥 SUPER HOT
                    </div>
                  )}

                  {/* Hiển thị ngày đăng */}
                  <p className="text-xs text-slate-400 mb-1">
                    Đăng ngày:{" "}
                    {new Date(job.postedAt).toLocaleDateString("vi-VN")}
                  </p>

                  {/* Tiêu đề công việc */}
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight pr-16 line-clamp-2">
                    {job.title}
                  </h3>

                  {/* Thông tin công ty */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 border border-slate-100 rounded bg-white flex items-center justify-center p-0.5 shrink-0">
                      <img
                        // Nếu công ty chưa có logo thì dùng ảnh mặc định
                        src={
                          job.company?.logo ||
                          "https://ui-avatars.com/api/?name=Company&background=f1f5f9&color=94a3b8"
                        }
                        alt="logo"
                        className="w-full h-full object-contain rounded-sm"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 line-clamp-1">
                      {job.company?.name || "Công ty bảo mật"}
                    </span>
                  </div>

                  {/* Mức lương (Lấy trực tiếp salaryDisplay từ Backend đã format) */}
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold mb-3 bg-emerald-50 w-max px-2 py-1 rounded">
                    <DollarSign size={16} /> {job.salaryDisplay}
                  </div>

                  <div className="h-px bg-slate-100 my-3"></div>

                  {/* Địa điểm & Hình thức */}
                  <div className="text-xs text-slate-500 mb-3 space-y-1.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />{" "}
                      {job.location || "Chưa cập nhật"}
                    </p>
                    <p className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                      {job.workModel}
                    </p>
                  </div>

                  {/* Danh sách kỹ năng (Skills) - Hiển thị tối đa 4 kỹ năng cho gọn thẻ card */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] font-medium rounded border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[11px] font-medium rounded border border-slate-100">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Phúc lợi (Vì lưu dạng Tiptap HTML, ta dùng dangerouslySetInnerHTML và cắt 2 dòng) */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mt-auto">
                      <div
                        className="text-xs text-slate-600 line-clamp-6 prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 prose-li:marker:text-rose-500"
                        dangerouslySetInnerHTML={{
                          __html: job.benefits,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* CỘT PHẢI: Xem trước chi tiết (Sticky) - Ẩn trên Mobile */}
          <div className="hidden lg:block w-[55%]">
            {/* Sử dụng sticky để ghim khối này lại khi cuộn cột trái */}
            {activeJob && (
              <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-lg p-6 h-[calc(100vh-8rem)] flex flex-col">
                {/* Header Preview */}
                <div className="flex items-start gap-4 mb-4 shrink-0">
                  <div className="w-20 h-20 border border-slate-200 rounded-xl p-2 bg-white shadow-sm shrink-0">
                    <img
                      src={activeJob.company.logo || ""}
                      alt={activeJob.company.slug}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    {/* Cho phép bấm vào Tiêu đề để xem trang chi tiết */}
                    <Link
                      href={`/jobs/${activeJob.id}`}
                      className="text-xl font-bold text-slate-800 mb-1 hover:text-primary transition-colors flex items-center gap-2 group line-clamp-2"
                    >
                      {activeJob.title}
                      <ExternalLink
                        size={16}
                        className="text-slate-400 group-hover:text-primary transition-colors shrink-0"
                      />
                    </Link>
                    <p className="text-slate-600 font-medium mb-2">
                      {activeJob.company.name}
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 w-max px-2.5 py-1 rounded-md">
                      <DollarSign size={16} /> {activeJob?.salaryDisplay}
                    </div>
                  </div>
                </div>

                {/* Nút Hành động */}
                <div className="flex items-center gap-4 mb-6 shrink-0 border-b border-slate-100 pb-6">
                  <Link
                    href={`/job-it/${activeJob.slug}/job_applications`}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95 text-center"
                  >
                    Ứng tuyển ngay
                  </Link>
                  {/* Nút thả tim thêm hiệu ứng hover màu đỏ (rose) */}
                  <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-200 rounded-lg text-slate-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all bg-white shrink-0">
                    <Heart size={22} />
                  </button>
                </div>

                {/* Khu vực cuộn bên trong Preview */}
                <div className="flex-1 overflow-y-auto pr-3 -mr-3 custom-scrollbar">
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p className="flex items-start gap-2">
                      <MapPin
                        size={18}
                        className="text-slate-400 shrink-0 mt-0.5"
                      />
                      {activeJob.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2
                        size={18}
                        className="text-slate-400 shrink-0"
                      />
                      Linh hoạt (Tại văn phòng hoặc làm từ xa)
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                      <span className="text-sm font-semibold text-slate-700 mt-1.5">
                        Kỹ năng:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeJob.skills &&
                          activeJob.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Bổ sung Chuyên môn & Lĩnh vực theo chuẩn UI */}
                    <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                      <span className="text-sm font-semibold text-slate-700">
                        Chuyên môn:
                      </span>
                      <span className="text-sm text-slate-600 font-medium">
                        Software Development
                      </span>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                      <span className="text-sm font-semibold text-slate-700">
                        Lĩnh vực:
                      </span>
                      <span className="text-sm text-slate-600 font-medium">
                        IT - Phần mềm
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    3 Lý do để gia nhập công ty
                  </h3>
                  <div
                    className="text-xs text-slate-600 line-clamp-6 prose prose-sm prose-p:my-0 prose-ul:my-0 prose-li:my-0 prose-li:marker:text-rose-500"
                    dangerouslySetInnerHTML={{
                      __html: activeJob.benefits,
                    }}
                  />

                  <h3 className="text-lg font-bold text-slate-800 mb-3">
                    Mô tả công việc
                  </h3>
                  <div
                    className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: activeJob.description || "",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
