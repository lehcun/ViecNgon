"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Award,
  Building2,
  Code2,
  Loader2,
  CheckCircle2,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import {
  useEmployerJobDetail,
  useUpdateEmployerJob,
} from "@/hooks/recruiter/useEditJob";
import { useEmployerProfile } from "@/hooks/recruiter/useEmployerProfile";
import { useAllSkill } from "@/hooks/useGetAllSkill";
import RichTextEditor from "@/components/common/RichTextEditor";
import JobTemplateSelector from "@/components/common/JobTemplateSelector";
import {
  JOB_DESCRIPTION_TEMPLATES,
  JOB_REQUIREMENT_TEMPLATES,
  JOB_BENEFIT_TEMPLATES,
} from "@/constants/job-templates";
import toast from "react-hot-toast";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;
  const searchParams = useSearchParams();
  const isRepostMode = searchParams.get("repost") === "true";

  // 1. Fetch dữ liệu tin tuyển dụng hiện tại
  const {
    data: jobData,
    isLoading: isLoadingJob,
    isError: isJobError,
    error: jobError,
  } = useEmployerJobDetail(jobId);

  // 2. Fetch danh sách chi nhánh và danh sách kỹ năng
  const { data: employerProfile, isLoading: isProfileLoading } =
    useEmployerProfile();
  const branches = employerProfile?.branches || [];
  const { allSkill } = useAllSkill();

  // 3. Mutation cập nhật
  const { mutate: updateJob, isPending: isUpdating } =
    useUpdateEmployerJob(jobId);

  // 4. Form State
  const [formData, setFormData] = useState({
    tenCongViec: "",
    capBac: "",
    loaiHinh: "",
    hinhThucLamViec: "",
    maChiNhanh: "",
    thanhPho: "",
    yeuCauKinhNghiem: "",
    ngayHetHan: "",
    mucLuongToiThieu: "" as number | "",
    mucLuongToiDa: "" as number | "",
    negotiable: false,
    moTa: "",
    yeuCauCongViec: "",
    phucLoi: "",
    kyNangs: [] as string[],
    trangThai: "",
  });

  // Pre-fill dữ liệu khi tải thành công
  useEffect(() => {
    if (jobData) {
      const isNegotiable = !jobData.mucLuongToiThieu && !jobData.mucLuongToiDa;

      // Nếu đang ở chế độ đăng lại (repost), tự động gợi ý gia hạn thêm 30 ngày
      let deadlineValue = "";
      if (isRepostMode) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        deadlineValue = d.toISOString().split("T")[0];
      } else if (jobData.ngayHetHan) {
        deadlineValue = jobData.ngayHetHan.split("T")[0];
      }

      setFormData({
        tenCongViec: jobData.tenCongViec || "",
        capBac: jobData.capBac || "",
        loaiHinh: jobData.loaiHinh || "",
        hinhThucLamViec: jobData.hinhThucLamViec || "",
        maChiNhanh: jobData.maChiNhanh || "",
        thanhPho: jobData.thanhPho || "",
        yeuCauKinhNghiem:
          jobData.yeuCauKinhNghiem !== null ? String(jobData.yeuCauKinhNghiem) : "",
        ngayHetHan: deadlineValue,
        mucLuongToiThieu:
          jobData.mucLuongToiThieu !== null ? jobData.mucLuongToiThieu : "",
        mucLuongToiDa:
          jobData.mucLuongToiDa !== null ? jobData.mucLuongToiDa : "",
        negotiable: isNegotiable,
        moTa: jobData.moTa || "",
        yeuCauCongViec: jobData.yeuCauCongViec || "",
        phucLoi: jobData.phucLoi || "",
        kyNangs: jobData.kyNangs || [],
        trangThai: isRepostMode ? "DA_DUYET" : jobData.trangThai || "DA_DUYET",
      });
    }
  }, [jobData, isRepostMode]);

  const isRemote = formData.hinhThucLamViec === "Remote";
  const hasNoBranches = !isProfileLoading && branches.length === 0;

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        return { ...prev, [name]: checked };
      }
      if (type === "number") {
        return { ...prev, [name]: value === "" ? "" : Number(value) };
      }
      if (name === "hinhThucLamViec" && value === "Remote") {
        return { ...prev, hinhThucLamViec: value, maChiNhanh: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleRichTextChange = (field: "moTa" | "yeuCauCongViec" | "phucLoi", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleSkill = (skillId: string) => {
    setFormData((prev) => {
      const isSelected = prev.kyNangs.includes(skillId);
      if (isSelected) {
        return { ...prev, kyNangs: prev.kyNangs.filter((id) => id !== skillId) };
      } else {
        return { ...prev, kyNangs: [...prev.kyNangs, skillId] };
      }
    });
  };

  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;
    handleInputChange(e);
    if (branchId) {
      const b = branches.find((item) => item.maChiNhanh === branchId);
      if (b && (!formData.thanhPho || formData.thanhPho.trim() === "")) {
        setFormData((prev) => ({ ...prev, thanhPho: b.thanhPho }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenCongViec.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!");
      return;
    }

    if (formData.kyNangs.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 kỹ năng chuyên môn!");
      return;
    }

    const cleanBranchId =
      formData.hinhThucLamViec === "Remote" ||
      !formData.maChiNhanh ||
      formData.maChiNhanh.trim() === ""
        ? null
        : formData.maChiNhanh.trim();

    updateJob({
      tenCongViec: formData.tenCongViec.trim(),
      capBac: formData.capBac || undefined,
      loaiHinh: formData.loaiHinh || undefined,
      hinhThucLamViec: formData.hinhThucLamViec || undefined,
      maChiNhanh: cleanBranchId,
      thanhPho: formData.thanhPho.trim() || undefined,
      mucLuongToiThieu: formData.negotiable
        ? null
        : (formData.mucLuongToiThieu as number) || null,
      mucLuongToiDa: formData.negotiable
        ? null
        : (formData.mucLuongToiDa as number) || null,
      yeuCauKinhNghiem:
        formData.yeuCauKinhNghiem !== ""
          ? Number(formData.yeuCauKinhNghiem)
          : null,
      moTa: formData.moTa || undefined,
      yeuCauCongViec: formData.yeuCauCongViec || undefined,
      phucLoi: formData.phucLoi || undefined,
      ngayHetHan:
        formData.ngayHetHan && !isNaN(new Date(formData.ngayHetHan).getTime())
          ? new Date(formData.ngayHetHan).toISOString()
          : null,
      kyNangs: formData.kyNangs,
      trangThai: isRepostMode ? "DA_DUYET" : formData.trangThai || undefined,
    });
  };

  // Render Loading State
  if (isLoadingJob) {
    return (
      <div className="max-w-5xl mx-auto pb-12 pt-6 px-4 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
        <div className="h-48 bg-slate-200 rounded-xl"></div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  // Render Error State
  if (isJobError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Không thể tải thông tin tin tuyển dụng
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {jobError?.message || "Tin tuyển dụng không tồn tại hoặc bạn không có quyền chỉnh sửa."}
        </p>
        <Link
          href="/employer/jobs"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
        >
          <ChevronLeft size={16} /> Quay lại danh sách tin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 pt-4 px-4 sm:px-0">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/employer/jobs"
          className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 mb-2 transition-colors"
        >
          <ChevronLeft size={16} /> Quay lại Quản lý tin tuyển dụng
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800">
                {isRepostMode ? "Đăng lại tin tuyển dụng" : "Chỉnh sửa tin tuyển dụng"}
              </h1>
              {isRepostMode && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-200">
                  <RotateCcw size={12} /> Chế độ gia hạn
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mã tin: <span className="font-mono text-slate-700 font-semibold">{jobId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Trạng thái: {formData.trangThai}
            </span>
          </div>
        </div>
      </div>

      {/* Thông báo nếu sửa thông tin tin đã duyệt */}
      {!isRepostMode && jobData?.trangThai === "DA_DUYET" && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>Lưu ý quan trọng:</strong> Tin tuyển dụng của bạn đang ở trạng thái <em>Đã duyệt</em>. Nếu bạn chỉnh sửa các thông tin cốt lõi (Tiêu đề, Mô tả, Yêu cầu công việc), hệ thống có thể chuyển trạng thái về <strong>Chờ duyệt lại</strong> để ban quản trị kiểm tra tính chính xác.
          </div>
        </div>
      )}

      {/* Form chỉnh sửa */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>1. Thông tin vị trí & Cơ bản</span>
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
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
                    <option value="" disabled>Chọn cấp bậc</option>
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
                    <option value="" disabled>Chọn loại hình</option>
                    <option value="Fulltime">Toàn thời gian (Full-time)</option>
                    <option value="Parttime">Bán thời gian (Part-time)</option>
                    <option value="Freelance">Nghề tự do (Freelance)</option>
                  </select>
                </div>
              </div>

              {/* Hình thức làm việc */}
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
                    <option value="" disabled>Chọn hình thức</option>
                    <option value="TaiVanPhong">Tại văn phòng (In-office)</option>
                    <option value="Remote">Làm việc từ xa (Remote)</option>
                    <option value="Hybrid">Linh hoạt kết hợp (Hybrid)</option>
                  </select>
                </div>
              </div>

              {/* Chọn Chi Nhánh */}
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
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isRemote || hasNoBranches ? "text-slate-300" : "text-slate-400"
                    }`}
                    size={18}
                  />
                  <select
                    name="maChiNhanh"
                    value={formData.maChiNhanh}
                    onChange={handleBranchSelect}
                    disabled={isRemote || hasNoBranches || isProfileLoading}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all appearance-none text-sm ${
                      isRemote || hasNoBranches
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
                          <option key={branch.maChiNhanh} value={branch.maChiNhanh}>
                            {branch.diaChi} - {branch.thanhPho}{" "}
                            {branch.laTruSoChinh ? "(Trụ sở chính)" : ""}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Thành phố / Địa điểm làm việc <span className="text-red-500">*</span>
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

            {/* Kỹ năng chuyên môn */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Code2 size={18} className="text-primary" />
                Kỹ năng chuyên môn yêu cầu <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {allSkill?.map((skill) => {
                  const isSelected = formData.kyNangs.includes(skill.id);
                  return (
                    <label
                      key={skill.id}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border cursor-pointer select-none transition-all duration-200 text-sm ${
                        isSelected
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
                  * Vui lòng chọn ít nhất 1 kỹ năng chuyên môn.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Khối 2: Kinh nghiệm & Lương */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
            2. Kinh nghiệm & Quyền lợi tài chính
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
                Hạn chót nhận hồ sơ <span className="text-red-500">*</span>
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
                    placeholder="Lương tối thiểu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 text-sm"
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
                    placeholder="Lương tối đa"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 text-sm"
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
                  Mức lương thỏa thuận (Thương lượng trực tiếp trong phỏng vấn)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 3: Rich Text Editor Mô tả, Yêu cầu, Phúc lợi */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                3. Chi tiết nội dung tin đăng
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bạn có thể tự do chỉnh sửa hoặc bấm "Dùng mẫu gợi ý" để chèn nhanh khung nội dung chuẩn
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Mô tả */}
            <div>
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
                onChange={(c) => handleRichTextChange("moTa", c)}
              />
            </div>

            {/* Yêu cầu */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Yêu cầu ứng viên (Kỹ năng, bằng cấp){" "}
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
                onChange={(c) => handleRichTextChange("yeuCauCongViec", c)}
              />
            </div>

            {/* Phúc lợi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Quyền lợi & Phúc lợi (Lương thưởng, BHYT,...){" "}
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
                onChange={(c) => handleRichTextChange("phucLoi", c)}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/employer/jobs"
            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors text-sm"
          >
            Hủy thay đổi
          </Link>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-8 py-3 font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isUpdating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>
              {isUpdating
                ? "Đang lưu..."
                : isRepostMode
                ? "Lưu & Kích hoạt tin"
                : "Lưu thay đổi"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

