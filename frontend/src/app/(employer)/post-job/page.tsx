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
  AlertCircle,
  Crown,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Building2,
  Code2,
  Info,
} from "lucide-react";
import { useCreateJob } from "@/hooks/job/useCreateJob";
import { useEmployerProfile } from "@/hooks/recruiter/useEmployerProfile";
import RichTextEditor from "@/components/common/RichTextEditor";
import JobTemplateSelector from "@/components/common/JobTemplateSelector";
import { useAllSkill } from "@/hooks/useGetAllSkill";
import {
  JOB_DESCRIPTION_TEMPLATES,
  JOB_REQUIREMENT_TEMPLATES,
  JOB_BENEFIT_TEMPLATES,
} from "@/constants/job-templates";

export default function PostJobPage() {
  const {
    formData,
    remainingCredits,
    showUpgradeModal,
    isLoading,
    handleInputChange,
    handleRichTextChange,
    handleSubmit,
    handleToggleSkill,
    setFieldValue,
    resetForm,
    closeModal,
  } = useCreateJob(1);

  // Lấy dữ liệu hồ sơ công ty và danh sách chi nhánh thực tế
  const { data: employerProfile, isLoading: isProfileLoading } =
    useEmployerProfile();
  const branches = employerProfile?.branches || [];

  // Dữ liệu Kỹ năng từ Database
  const { allSkill } = useAllSkill();

  const isRemote = formData.hinhThucLamViec === "Remote";
  const hasNoBranches = !isProfileLoading && branches.length === 0;

  // Xử lý khi chọn chi nhánh: tự động điền gợi ý thành phố nếu ô thành phố đang trống
  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranchId = e.target.value;
    handleInputChange(e);

    if (selectedBranchId) {
      const branch = branches.find((b) => b.maChiNhanh === selectedBranchId);
      if (branch && (!formData.thanhPho || formData.thanhPho.trim() === "")) {
        setFieldValue("thanhPho", branch.thanhPho);
      }
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
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Tạo tin tuyển dụng mới
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Soạn thảo thông tin công việc chuyên nghiệp và tiếp cận hàng ngàn ứng viên tiềm năng
            </p>
          </div>
          <div className="bg-primary-light text-primary font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-primary/20">
            <Briefcase size={16} /> Lượt đăng tin còn lại: {remainingCredits}
          </div>
        </div>
      </div>

      {/* Form Nhập liệu */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Thông tin cơ bản</span>
            <span className="text-xs font-normal text-slate-400">
              Các trường có dấu <span className="text-red-500">*</span> là bắt buộc
            </span>
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
                placeholder="VD: Senior ReactJS / Fullstack Developer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-sm"
                    required
                  >
                    <option value="" disabled>
                      Chọn cấp bậc
                    </option>
                    <option value="Intern">Thực tập sinh (Intern)</option>
                    <option value="Fresher">Mới tốt nghiệp (Fresher)</option>
                    <option value="Junior">Nhân viên (Junior)</option>
                    <option value="Senior">Chuyên viên (Senior)</option>
                    <option value="Lead">Trưởng nhóm (Lead / Manager)</option>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-sm"
                    required
                  >
                    <option value="" disabled>
                      Chọn loại hình
                    </option>
                    <option value="Fulltime">Toàn thời gian (Full-time)</option>
                    <option value="Parttime">Bán thời gian (Part-time)</option>
                    <option value="Freelance">Nghề tự do (Freelance)</option>
                  </select>
                </div>
              </div>

              {/* Hình thức làm việc: Remote, Tại văn phòng, Hybrid */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Hình thức làm việc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    name="hinhThucLamViec"
                    value={formData.hinhThucLamViec}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-sm"
                    required
                  >
                    <option value="" disabled>
                      Chọn hình thức
                    </option>
                    <option value="TaiVanPhong">Tại văn phòng (In-office)</option>
                    <option value="Remote">Làm việc từ xa (Remote)</option>
                    <option value="Hybrid">Linh hoạt kết hợp (Hybrid)</option>
                  </select>
                </div>
              </div>

              {/* Chọn Chi Nhánh (Lấy dữ liệu thực tế từ hồ sơ doanh nghiệp) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Chi nhánh làm việc
                  </label>
                  {isRemote && (
                    <span className="text-xs text-amber-600 font-medium">
                      Miễn chọn khi làm Remote
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${isRemote || hasNoBranches ? "text-slate-300" : "text-slate-400"
                      }`}
                    size={18}
                  />
                  <select
                    name="maChiNhanh"
                    value={formData.maChiNhanh}
                    onChange={handleBranchSelect}
                    disabled={isRemote || hasNoBranches || isProfileLoading}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all appearance-none text-sm ${isRemote || hasNoBranches
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                      }`}
                  >
                    {isProfileLoading && (
                      <option value="">Đang tải danh sách chi nhánh...</option>
                    )}

                    {!isProfileLoading && isRemote && (
                      <option value="">-- Không áp dụng cho hình thức Remote --</option>
                    )}

                    {!isProfileLoading && !isRemote && hasNoBranches && (
                      <option value="">-- Công ty chưa đăng ký chi nhánh nào --</option>
                    )}

                    {!isProfileLoading && !isRemote && !hasNoBranches && (
                      <>
                        <option value="">-- Chọn chi nhánh làm việc (Tùy chọn) --</option>
                        {branches.map((branch) => (
                          <option
                            key={branch.maChiNhanh}
                            value={branch.maChiNhanh}
                          >
                            {branch.diaChi} - {branch.thanhPho}{" "}
                            {branch.laTruSoChinh ? "(Trụ sở chính)" : ""}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                {/* Ghi chú ngữ cảnh cho Chi nhánh */}
                {isRemote ? (
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Info size={12} /> Việc làm từ xa không yêu cầu gắn liền với địa điểm chi nhánh cụ thể.
                  </p>
                ) : hasNoBranches ? (
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Info size={12} /> Doanh nghiệp chưa tạo chi nhánh. Bạn có thể bổ sung trong mục{" "}
                    <Link
                      href="/company-profile"
                      className="text-primary underline font-medium hover:text-primary-hover"
                    >
                      Hồ sơ công ty
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Thành phố / Khu vực làm việc <span className="text-red-500">*</span>
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
                  placeholder="VD: TP. Hồ Chí Minh, Hà Nội, Đà Nẵng, Toàn quốc..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Khối UI Chọn Kỹ Năng */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Code2 size={18} className="text-primary" />
                Kỹ năng chuyên môn <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {allSkill?.map((skill) => {
                  const isSelected = formData.kyNangs.includes(skill.id);
                  return (
                    <label
                      key={skill.id}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border cursor-pointer select-none transition-all duration-200 text-sm ${isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:border-primary/50 hover:bg-slate-50"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={() => handleToggleSkill(skill.id)}
                      />
                      <span>{skill.name}</span>
                    </label>
                  );
                })}
              </div>
              {formData.kyNangs.length === 0 && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  * Vui lòng chọn ít nhất 1 kỹ năng chuyên môn để ứng viên tìm kiếm được tin tuyển dụng.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Khối 2: Kinh nghiệm & Mức lương */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
            Kinh nghiệm & Quyền lợi tài chính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Kinh nghiệm yêu cầu <span className="text-red-500">*</span>
              </label>
              <select
                name="yeuCauKinhNghiem"
                value={formData.yeuCauKinhNghiem}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-sm"
              >
                <option value="0">Không yêu cầu kinh nghiệm</option>
                <option value="1">Dưới 1 năm kinh nghiệm</option>
                <option value="2">1 - 2 năm kinh nghiệm</option>
                <option value="3">3 - 5 năm kinh nghiệm</option>
                <option value="5">Trên 5 năm kinh nghiệm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Hạn chót nộp hồ sơ <span className="text-red-500">*</span>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-sm"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Mức lương (VNĐ) <span className="text-red-500">*</span>
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
                    disabled={formData.negotiable}
                    placeholder="Mức lương tối thiểu (VD: 15000000)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
                <span className="text-slate-400 font-semibold">-</span>
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
                    placeholder="Mức lương tối đa (VD: 30000000)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <input
                  type="checkbox"
                  id="negotiable"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="negotiable"
                  className="text-sm text-slate-600 cursor-pointer select-none"
                >
                  Mức lương thỏa thuận (Thương lượng trực tiếp trong quá trình phỏng vấn)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 3: Rich Text Editor Mô tả, Yêu cầu, Phúc lợi (Kèm Mẫu Gợi Ý Sẵn) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Chi tiết nội dung tin tuyển dụng
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sử dụng các mẫu gợi ý có sẵn để tạo nội dung chuẩn đẹp nhanh chóng chỉ với 1 click
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 1. Mô tả công việc */}
            <div className="bg-white">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Mô tả công việc (Nhiệm vụ, trách nhiệm){" "}
                  <span className="text-red-500">*</span>
                </label>
                <JobTemplateSelector
                  label="Mô tả công việc"
                  templates={JOB_DESCRIPTION_TEMPLATES}
                  currentContent={formData.moTa}
                  onApply={(content) => handleRichTextChange("moTa", content)}
                />
              </div>
              <RichTextEditor
                value={formData.moTa}
                onChange={(content) => handleRichTextChange("moTa", content)}
              />
            </div>

            {/* 2. Yêu cầu ứng viên */}
            <div className="bg-white">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Yêu cầu ứng viên (Kỹ năng, bằng cấp, kinh nghiệm){" "}
                  <span className="text-red-500">*</span>
                </label>
                <JobTemplateSelector
                  label="Yêu cầu công việc"
                  templates={JOB_REQUIREMENT_TEMPLATES}
                  currentContent={formData.yeuCauCongViec}
                  onApply={(content) =>
                    handleRichTextChange("yeuCauCongViec", content)
                  }
                />
              </div>
              <RichTextEditor
                value={formData.yeuCauCongViec}
                onChange={(content) =>
                  handleRichTextChange("yeuCauCongViec", content)
                }
              />
            </div>

            {/* 3. Phúc lợi & Đãi ngộ */}
            <div className="bg-white">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Quyền lợi & Đãi ngộ (Lương tháng 13, BHYT, Thiết bị,...){" "}
                  <span className="text-red-500">*</span>
                </label>
                <JobTemplateSelector
                  label="Quyền lợi & Đãi ngộ"
                  templates={JOB_BENEFIT_TEMPLATES}
                  currentContent={formData.phucLoi}
                  onApply={(content) => handleRichTextChange("phucLoi", content)}
                />
              </div>
              <RichTextEditor
                value={formData.phucLoi}
                onChange={(content) => handleRichTextChange("phucLoi", content)}
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
            <Info size={14} className="text-slate-400 shrink-0" />
            Nội dung và định dạng bạn soạn thảo tại đây sẽ được hiển thị nguyên vẹn trên trang chi tiết việc làm cho ứng viên.
          </p>
        </div>

        {/* Nút Submit & Lưu */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-sm"
          >
            Làm mới form
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {isLoading ? "Đang xử lý..." : "Xác nhận đăng tin"}
          </button>
        </div>
      </form>

      {/* ================= MODAL CẢNH BÁO HẾT LƯỢT ĐĂNG TIN ================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-6 flex justify-center border-b border-orange-100">
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
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Crown size={18} /> Xem các gói dịch vụ
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-sm"
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
