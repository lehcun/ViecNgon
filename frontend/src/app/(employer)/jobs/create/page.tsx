"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Award,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlertCircle,
  Crown,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

export default function CreateJobPage() {
  // 1. Giả lập State quản lý số lượt đăng tin (Đổi thành > 0 để test thành công)
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // 2. Hàm xử lý khi bấm nút "Đăng tin"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingCredits <= 0) {
      setShowUpgradeModal(true); // Hiện hộp thoại nếu hết lượt
    } else {
      // Gọi API lưu vào DB bảng CONGVIEC tại đây
      alert("Đăng tin thành công!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 pt-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/employer-dashboard"
          className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 mb-2 transition-colors"
        >
          <ChevronLeft size={16} /> Quay lại Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Tạo tin tuyển dụng mới
          </h1>
          <div className="bg-primary-light text-primary font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-primary/20">
            <Briefcase size={16} /> Lượt đăng tin còn lại: {remainingCredits}
          </div>
        </div>
      </div>

      {/* Form Nhập liệu */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
            Thông tin cơ bản
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Tiêu đề công việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Senior ReactJS Developer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Cấp bậc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled selected>
                      Chọn cấp bậc
                    </option>
                    <option value="Intern">Thực tập sinh (Intern)</option>
                    <option value="Fresher">Mới tốt nghiệp (Fresher)</option>
                    <option value="Junior">Nhân viên (Junior)</option>
                    <option value="Senior">Chuyên viên (Senior)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Loại hình làm việc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled selected>
                      Chọn loại hình
                    </option>
                    <option value="Fulltime">Toàn thời gian (Full-time)</option>
                    <option value="Parttime">Bán thời gian (Part-time)</option>
                    <option value="Remote">Làm việc từ xa (Remote)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Địa điểm làm việc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Khối 2: Yêu cầu & Lương */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
            Yêu cầu & Quyền lợi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Kinh nghiệm (Năm) <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
                <option value="0">Không yêu cầu</option>
                <option value="1">Dưới 1 năm</option>
                <option value="2">1 - 2 năm</option>
                <option value="3">3 - 5 năm</option>
                <option value="5">Trên 5 năm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Hạn nộp hồ sơ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Mức lương */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Mức lương (USD/VND) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <span className="text-slate-400">-</span>
                <div className="relative flex-1">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    placeholder="Tối đa"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <label htmlFor="negotiable" className="text-sm text-slate-600">
                  Lương thỏa thuận (Thương lượng khi phỏng vấn)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 3: Rich Text Editor Mô tả */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
            Mô tả chi tiết công việc <span className="text-red-500">*</span>
          </h2>

          {/* UI Giả lập Rich Text Editor */}
          <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            {/* Toolbar */}
            <div className="bg-slate-50 border-b border-slate-300 p-2 flex flex-wrap items-center gap-1">
              <button
                type="button"
                className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <Underline size={16} />
              </button>
              <div className="w-px h-6 bg-slate-300 mx-1"></div>
              <button
                type="button"
                className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <ListOrdered size={16} />
              </button>
              <div className="w-px h-6 bg-slate-300 mx-1"></div>
              <button
                type="button"
                className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <LinkIcon size={16} />
              </button>
            </div>
            {/* Text Area */}
            <textarea
              rows={10}
              className="w-full p-4 outline-none resize-y"
              placeholder="Nhập mô tả công việc, yêu cầu kỹ năng, và phúc lợi..."
              defaultValue="Yêu cầu công việc:&#10;- Ít nhất 2 năm kinh nghiệm với ReactJS/NextJS.&#10;- Thành thạo HTML, CSS, TailwindCSS.&#10;&#10;Phúc lợi:&#10;- Lương tháng 13.&#10;- Khám sức khỏe định kỳ."
              required
            ></textarea>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Sử dụng công cụ soạn thảo để làm nổi bật các ý chính, giúp ứng viên
            dễ đọc hơn.
          </p>
        </div>

        {/* Nút Submit cố định dưới cùng */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Lưu nháp
          </button>
          <button
            type="submit"
            className="px-8 py-3 font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 rounded-lg transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={20} /> Xác nhận đăng tin
          </button>
        </div>
      </form>

      {/* ================= MODAL CẢNH BÁO HẾT LƯỢT ĐĂNG ================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Nửa trên trang trí */}
            <div className="bg-linear-to-r from-orange-50 to-rose-50 p-6 flex justify-center border-b border-orange-100">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-100">
                <AlertCircle size={40} className="text-orange-500" />
              </div>
            </div>

            {/* Nội dung Modal */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Đã hết lượt đăng tin!
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Gói dịch vụ hiện tại của công ty bạn đã sử dụng hết lượt đăng
                tin tuyển dụng. Nâng cấp gói ngay để tiếp tục tìm kiếm nhân tài.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="w-full py-3 bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Crown size={20} /> Xem các gói dịch vụ
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
