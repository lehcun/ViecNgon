"use client";

import React, { useState } from "react";
import { Mail, ChevronDown, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LogoViecNgon from "@/components/LogoViecNgon";
import Image from "next/image";

export default function EmployerRegistrationPage() {
  // Quản lý bước hiện tại (1 hoặc 2)
  const [step, setStep] = useState(1);

  // State quản lý toàn bộ dữ liệu form cho cả 2 bước
  const [formData, setFormData] = useState({
    // --- Bước 1 ---
    fullName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    location: "",
    website: "",
    agreed: false,
    // --- Bước 2 ---
    budget: "",
    hiringDemand: "",
    biggestChallenge: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBudgetSelect = (budgetOption: string) => {
    setFormData((prev) => ({
      ...prev,
      budget: budgetOption,
    }));
  };

  // Điều kiện kích hoạt nút bấm của từng bước
  const isStep1Valid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.company &&
    formData.title &&
    formData.location &&
    formData.agreed;

  const isStep2Valid = formData.budget && formData.hiringDemand;

  // Danh sách tùy chọn ngân sách cho Bước 2
  const budgetOptions = [
    { label: "< 50M", value: "<50M" },
    { label: "50 - 200M", value: "50-200M" },
    { label: "200 - 500M", value: "200-500M" },
    { label: "500M - 1B", value: "500M-1B" },
    { label: "> 1B", value: ">1B" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-primary-dark text-white flex justify-between items-center px-4 md:px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <LogoViecNgon logoTextColor="text-white" role={"NHATUYENDUNG"} />

          <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-300 ml-6">
            <a
              href="#"
              className="text-white hover:text-primary-light transition-colors"
            >
              Tổng quan
            </a>
            <a href="#" className="hover:text-white transition-colors">
              AI Match
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <button className="hidden md:flex items-center gap-2 border border-slate-600 rounded px-4 py-2 hover:bg-slate-800 transition-colors">
            <Mail size={16} /> Liên hệ với chúng tôi
          </button>
          <a href="#" className="hover:text-white transition-colors">
            Đăng nhập
          </a>
          <span className="border-l border-slate-600 pl-4 text-slate-400">
            EN | VI
          </span>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-8 py-12 gap-12 items-center relative overflow-hidden">
        {/* Hình elip trang trí nền theo chuẩn class Tailwind mới (w-200 = 800px) */}
        <div className="absolute right-0 bottom-0 w-200 h-125 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-0 left-[-10%] w-150 h-150 bg-primary-light/50 rounded-full blur-3xl -z-10"></div>

        {/* CỘT TRÁI: Text & Form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 z-10">
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-slate-800 uppercase">
              Giải pháp tuyển dụng
            </h2>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Tuyển dụng <br />
              <span className="text-blue-600 inline-flex items-center border-r-4 border-blue-600 pr-1 animate-pulse">
                chính xác hơn
              </span>
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-md">
              Với cơ sở dữ liệu hồ sơ chất lượng cao, ViecNgon giúp doanh nghiệp
              tuyển dụng nhân tài hiệu quả hơn thông qua các giải pháp toàn diện
              và linh hoạt.
            </p>
          </div>

          {/* Hộp chứa Form động */}
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-6 md:p-8 relative overflow-hidden transition-all duration-300">
            {/* Dải màu trang trí top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

            {/* ================= FORM BƯỚC 1 ================= */}
            {step === 1 ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">
                    Đăng ký để nhận tư vấn
                  </h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    1/2
                  </span>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Họ và tên *"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email công việc *"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Số điện thoại *"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Tên công ty *"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Chức vụ *"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-500 bg-white hover:border-slate-300"
                    >
                      <option value="">Địa điểm công ty *</option>
                      <option value="HCM">Hồ Chí Minh</option>
                      <option value="HN">Hà Nội</option>
                      <option value="DN">Đà Nẵng</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Website URL"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-start gap-3 mt-3">
                    <input
                      type="checkbox"
                      name="agreed"
                      id="terms"
                      checked={formData.agreed}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer accent-primary"
                    />
                    <label
                      htmlFor="terms"
                      className="text-[13px] text-slate-600 leading-relaxed cursor-pointer select-none"
                    >
                      Tôi đã đọc và đồng ý với{" "}
                      <a
                        href="#"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Điều khoản dịch vụ
                      </a>{" "}
                      và{" "}
                      <a
                        href="#"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Chính sách bảo mật
                      </a>{" "}
                      của ViecNgon liên quan đến thông tin cá nhân của tôi.
                    </label>
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button
                      type="button"
                      disabled={!isStep1Valid}
                      onClick={() => setStep(2)} // Chuyển state sang form 2
                      className={`w-full font-bold py-3.5 rounded-lg transition-all duration-300 ${
                        isStep1Valid
                          ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transform hover:-translate-y-0.5"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Tiếp tục để nhận tư vấn
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ================= FORM BƯỚC 2 ================= */
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    {/* Nút Quay Lại */}
                    <button
                      onClick={() => setStep(1)}
                      className="p-1 text-slate-400 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
                      title="Quay lại"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm md:text-base">
                      Hoàn tất thông tin
                    </h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    2/2
                  </span>
                </div>

                <form className="flex flex-col gap-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-[15px] font-medium text-slate-800 mb-3">
                      Ngân sách tuyển dụng hàng năm (VNĐ){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleBudgetSelect(option.value)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                            formData.budget === option.value
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hiring Demand */}
                  <div>
                    <label className="block text-[15px] font-medium text-slate-800 mb-2">
                      Nhu cầu tuyển dụng trong 6 tháng tới{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hiringDemand"
                      value={formData.hiringDemand}
                      onChange={handleChange}
                      placeholder="Nhập số lượng nhân sự dự kiến..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 hover:border-slate-300"
                    />
                  </div>

                  {/* Biggest Challenge */}
                  <div>
                    <label className="block text-[15px] font-medium text-slate-800 mb-2">
                      Thách thức lớn nhất khi tuyển dụng
                    </label>
                    <div className="relative">
                      <select
                        name="biggestChallenge"
                        value={formData.biggestChallenge}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-600 bg-white hover:border-slate-300 cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-400">
                          Chọn một lý do...
                        </option>
                        <option value="quality">
                          Chất lượng ứng viên chưa đạt
                        </option>
                        <option value="time">
                          Thời gian tuyển dụng quá lâu
                        </option>
                        <option value="cost">Chi phí tuyển dụng cao</option>
                        <option value="retention">
                          Tỷ lệ giữ chân nhân sự thấp
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ChevronDown size={18} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Widget Cloudflare Mockup */}
                  <div className="mt-2 w-fit border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-12 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={22} className="text-emerald-500" />
                      <span className="text-sm text-slate-700 font-medium">
                        Xác thực thành công!
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-[10px] font-black text-slate-700 tracking-wider">
                        CLOUDFLARE
                      </div>
                      <div className="text-[9px] text-slate-500 flex gap-1">
                        <a href="#" className="hover:underline">
                          Privacy
                        </a>{" "}
                        •{" "}
                        <a href="#" className="hover:underline">
                          Help
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={!isStep2Valid}
                      onClick={() =>
                        alert("Gửi dữ liệu thành công lên hệ thống!")
                      } // TODO: Xử lý gọi API ở đây
                      className={`w-full font-bold py-4 rounded-lg transition-all duration-300 text-sm md:text-base ${
                        isStep2Valid
                          ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transform hover:-translate-y-0.5"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Gửi yêu cầu tư vấn
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: Hình ảnh minh họa */}
        <div className="hidden lg:flex w-1/2 relative justify-center items-center z-10">
          <div className="relative w-full aspect-square max-w-lg">
            {/* Viền trang trí */}
            <div className="absolute top-10 left-10 w-full h-full border-2 border-primary-light rounded-3xl -z-10"></div>

            <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative bg-white group">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Tuyển dụng nhân sự"
                fill
                loading="lazy"
                quality={75}
                sizes="100%"
                className="group-hover:scale-105 transition-transform duration-700 object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent"></div>

              {/* Box hiển thị thay đổi theo Step */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 md:p-5 rounded-xl shadow-lg border border-white/50 transition-all duration-300">
                {step === 1 ? (
                  <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary font-black text-lg shrink-0">
                      AI
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Kết nối thông minh
                      </p>
                      <p className="text-xs text-slate-500">
                        Tìm kiếm ứng viên phù hợp nhanh chóng, chính xác.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in duration-500">
                    <p className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle size={18} className="text-emerald-500" /> Sẵn
                      sàng tối ưu hóa quy trình!
                    </p>
                    <p className="text-xs text-slate-600">
                      Đội ngũ chuyên gia của ViecNgon sẽ liên hệ và thiết kế gói
                      giải pháp dành riêng cho bạn trong vòng 24h.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
