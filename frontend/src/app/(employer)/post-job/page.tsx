"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Award,
  Link as LinkIcon,
  AlertCircle,
  Crown,
  ChevronLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useCreateJob } from "@/hooks/job/useCreateJob";
import RichTextEditor from "@/components/common/RichTextEditor";

export default function PostJobPage() {
  // GỌI CUSTOM HOOK (Truyền vào 0 để test Modal, truyền > 0 để test Đăng tin)
  const {
    formData,
    remainingCredits,
    showUpgradeModal,
    isLoading,
    handleInputChange,
    handleRichTextChange,
    handleSubmit,
    closeModal,
  } = useCreateJob(1);

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
                name="tenCongViec"
                value={formData.tenCongViec}
                onChange={handleInputChange}
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
                    name="capBac"
                    value={formData.capBac}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>
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
                    name="loaiHinh"
                    value={formData.loaiHinh}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>
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
                  name="thanhPho"
                  value={formData.thanhPho}
                  onChange={handleInputChange}
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
              <select
                name="yeuCauKinhNghiem"
                value={formData.yeuCauKinhNghiem}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
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
                  name="ngayHetHan"
                  value={formData.ngayHetHan}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  required
                />
              </div>
            </div>

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
                    name="mucLuongToiThieu"
                    value={formData.mucLuongToiThieu}
                    onChange={handleInputChange}
                    disabled={formData.negotiable} // Khóa nếu chọn thỏa thuận
                    placeholder="Tối thiểu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    name="mucLuongToiDa"
                    value={formData.mucLuongToiDa}
                    onChange={handleInputChange}
                    disabled={formData.negotiable}
                    placeholder="Tối đa"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleInputChange}
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

          <div className="bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả công việc
            </label>
            <RichTextEditor
              value={formData.moTa}
              onChange={(content) => handleRichTextChange("moTa", content)}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            * Nội dung bạn định dạng ở đây sẽ được hiển thị y hệt cho ứng viên
            xem.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Lưu nháp
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <CheckCircle2 size={20} />
            )}
            {isLoading ? "Đang xử lý..." : "Xác nhận đăng tin"}
          </button>
        </div>
      </form>

      {/* ================= MODAL CẢNH BÁO ================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-linear-to-r from-orange-50 to-rose-50 p-6 flex justify-center border-b border-orange-100">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-100">
                <AlertCircle size={40} className="text-orange-500" />
              </div>
            </div>
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
                  onClick={closeModal}
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
