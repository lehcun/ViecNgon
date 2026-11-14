"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Save,
  Camera,
  Pencil,
  Info,
  Sparkles,
  Image as ImageIcon,
  Building,
  Star,
  Users,
  Globe,
  MapPin,
  Plus,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Lightbulb,
  Building2,
  Briefcase,
  Loader2,
} from "lucide-react";
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
} from "@/hooks/recruiter/useEmployerProfile";
import type {
  CompanyProfileResponse,
  UpdateCompanyProfilePayload,
  CompanyInfo,
  HrProfileInfo,
} from "@viecngon/types";

type ProfileTab = "general" | "culture" | "media" | "branches" | "reviews";

const DEFAULT_SECTORS = [
  "Công nghệ thông tin / Phần mềm",
  "Fintech & Ví điện tử",
  "Trò chơi trực tuyến (Game Publishing)",
  "Điện toán đám mây & AI",
];

// =====================================================================
// COMPONENT CHÍNH: QUẢN LÝ HỒ SƠ DOANH NGHIỆP
// =====================================================================

export default function CompanyProfilePage() {
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useEmployerProfile();

  const [activeTab, setActiveTab] = useState<ProfileTab>("general");

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium text-sm">
          Đang tải dữ liệu hồ sơ doanh nghiệp...
        </p>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200">
          <p className="font-semibold text-lg mb-2">
            Không thể tải thông tin hồ sơ doanh nghiệp
          </p>
          <p className="text-sm mb-4">
            Vui lòng kiểm tra lại quyền truy cập hoặc phiên đăng nhập của bạn.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
          >
            Thử tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <CompanyProfileEditor
      key={profileData.company.maCongTy}
      profileData={profileData}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

function CompanyProfileEditor({
  profileData,
  activeTab,
  setActiveTab,
}: {
  profileData: CompanyProfileResponse;
  activeTab: ProfileTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ProfileTab>>;
}) {
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateEmployerProfile();

  // State quản lý Form cục bộ (khởi tạo trực tiếp từ profileData, tránh setState trong useEffect)
  const [companyForm, setCompanyForm] = useState<Partial<CompanyInfo>>(() => ({
    tenCongTy: profileData.company.tenCongTy || "",
    tenPhapLy: profileData.company.tenPhapLy || "",
    slug: profileData.company.slug || "",
    moTa: profileData.company.moTa || "",
    phucLoi: profileData.company.phucLoi || "",
    chuyenMon: profileData.company.chuyenMon || "",
    aboutMe: profileData.company.aboutMe || "",
    logoUrl: profileData.company.logoUrl || "",
    website: profileData.company.website || "",
    thanhPho: profileData.company.thanhPho || "",
    diaChi: profileData.company.diaChi || "",
    moHinhCongTy: profileData.company.moHinhCongTy || "Product & Service",
    quyMo: profileData.company.quyMo || "1,000+ Kỹ sư",
    quocGia: profileData.company.quocGia || "Toàn cầu & SEA",
    thoiGianLamViec: profileData.company.thoiGianLamViec || "Thứ 2 - Thứ 6",
    chinhSachOT:
      profileData.company.chinhSachOT || "Không OT / Thêm lương OT",
    giaiThuong: profileData.company.giaiThuong || "",
  }));

  const [hrForm] = useState<Partial<HrProfileInfo>>(() => ({
    hoTen: profileData.hr.hoTen || "",
    chucVu: profileData.hr.chucVu || "",
    soDienThoai: profileData.hr.soDienThoai || "",
    email: profileData.hr.email || "",
  }));

  const [sectors, setSectors] = useState<string[]>(() =>
    profileData.company.linhVuc?.length
      ? profileData.company.linhVuc
      : DEFAULT_SECTORS,
  );
  const [newSectorInput, setNewSectorInput] = useState<string>("");

  // Thêm tag lĩnh vực hoạt động mới
  const handleAddSector = () => {
    const trimmed = newSectorInput.trim();
    if (!trimmed) return;
    if (sectors.includes(trimmed)) {
      toast.error("Lĩnh vực này đã tồn tại trong danh sách");
      return;
    }
    if (sectors.length >= 10) {
      toast.error("Tối đa 10 lĩnh vực hoạt động");
      return;
    }
    setSectors([...sectors, trimmed]);
    setNewSectorInput("");
  };

  // Xoá tag lĩnh vực
  const handleRemoveSector = (indexToRemove: number) => {
    setSectors(sectors.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit cập nhật hồ sơ
  const handleSaveProfile = () => {
    if (!companyForm.tenCongTy?.trim()) {
      toast.error("Tên công ty không được để trống");
      return;
    }

    const payload: UpdateCompanyProfilePayload = {
      company: {
        tenCongTy: companyForm.tenCongTy.trim(),
        tenPhapLy: companyForm.tenPhapLy?.trim() || null,
        aboutMe: companyForm.aboutMe?.trim() || null,
        logoUrl: companyForm.logoUrl?.trim() || null,
        moTa: companyForm.moTa || null,
        phucLoi: companyForm.phucLoi || null,
        chuyenMon: companyForm.chuyenMon || null,
        website: companyForm.website?.trim() || null,
        thanhPho: companyForm.thanhPho?.trim() || null,
        diaChi: companyForm.diaChi?.trim() || null,
        moHinhCongTy: companyForm.moHinhCongTy?.trim() || null,
        quyMo: companyForm.quyMo?.trim() || null,
        quocGia: companyForm.quocGia?.trim() || null,
        thoiGianLamViec: companyForm.thoiGianLamViec?.trim() || null,
        chinhSachOT: companyForm.chinhSachOT?.trim() || null,
        giaiThuong: companyForm.giaiThuong?.trim() || null,
        linhVuc: sectors,
      },
      hr: {
        hoTen: hrForm.hoTen?.trim() || null,
        chucVu: hrForm.chucVu?.trim() || null,
        soDienThoai: hrForm.soDienThoai?.trim() || null,
      },
    };

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Cập nhật hồ sơ doanh nghiệp thành công!");
      },
      onError: (err) => {
        toast.error(err.message || "Lưu thay đổi thất bại, vui lòng thử lại.");
      },
    });
  };

  const { company, branches, completion, stats } = profileData;
  const completionPercent = completion?.percent ?? 92;

  // ===================================================================
  // GIAO DIỆN CHÍNH
  // ===================================================================

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-800 space-y-6">
      {/* --- 1. HEADER TOP BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/employer-dashboard"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm text-slate-500 hover:text-blue-600 font-medium mb-1 transition"
          >
            <ArrowLeft size={16} /> Quay lại Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Quản lý hồ sơ doanh nghiệp
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Cập nhật thông tin công ty để tăng{" "}
            <span className="text-blue-600 font-semibold">85% mức độ</span> thu
            hút ứng viên tài năng.
          </p>
        </div>

        {/* Cụm nút hành động */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
            <CheckCircle2 size={14} className="text-blue-600" />
            Hồ sơ đã xác thực
          </div>

          <Link
            href={`/company/${companyForm.slug || company.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-lg text-xs md:text-sm font-semibold transition shadow-sm"
          >
            <ExternalLink size={16} className="text-slate-500" />
            Xem trang công khai
          </Link>

          <button
            onClick={handleSaveProfile}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs md:text-sm font-semibold transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={16} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- 2. TABS NAVIGATION --- */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar shadow-sm">
        <button
          onClick={() => setActiveTab("general")}
          className={`relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "general"
              ? "text-blue-600 border-blue-600"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          <Info size={16} />
          Thông tin chung
        </button>

        <button
          onClick={() => setActiveTab("culture")}
          className={`relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "culture"
              ? "text-blue-600 border-blue-600"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          <Sparkles size={16} />
          Văn hóa & Đãi ngộ
        </button>

        <button
          onClick={() => setActiveTab("media")}
          className={`relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "media"
              ? "text-blue-600 border-blue-600"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          <ImageIcon size={16} />
          Hình ảnh & Video
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-bold">
            14
          </span>
        </button>

        <button
          onClick={() => setActiveTab("branches")}
          className={`relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "branches"
              ? "text-blue-600 border-blue-600"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          <Building size={16} />
          Chi nhánh & Văn phòng
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-bold">
            {branches.length || 3}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === "reviews"
              ? "text-blue-600 border-blue-600"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          <Star size={16} />
          Đánh giá & Xếp hạng
          <span className="ml-1 px-2 py-0.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold flex items-center gap-1">
            {stats.averageRating || "4.8"} ★
          </span>
        </button>
      </div>

      {/* --- 3. BANNER PREVIEW & THÔNG TIN CÔNG TY --- */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Khối Ảnh bìa */}
        <div className="relative h-48 sm:h-64 w-full bg-linear-to-r from-slate-800 to-slate-900 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

          {/* Nút đổi ảnh bìa */}
          <button
            type="button"
            onClick={() =>
              toast("Tính năng tải ảnh bìa đang kết nối Cloudinary...", {
                icon: "📸",
              })
            }
            className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-semibold backdrop-blur-md shadow-md transition cursor-pointer"
          >
            <Camera size={15} />
            Đổi ảnh bìa (Chuẩn: 1200×350px)
          </button>
        </div>

        {/* Khối Logo & Thông tin tóm tắt */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Logo */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-blue-600 border-4 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shrink-0">
              {companyForm.logoUrl ? (
                <Image
                  src={companyForm.logoUrl}
                  alt={companyForm.tenCongTy || "Company Logo"}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                "VNG"
              )}
              <button
                type="button"
                onClick={() =>
                  toast("Tính năng đổi logo công ty...", { icon: "🎨" })
                }
                className="absolute bottom-1 right-1 p-2 bg-white text-slate-700 hover:text-blue-600 rounded-full shadow-md transition cursor-pointer"
              >
                <Pencil size={14} />
              </button>
            </div>

            {/* Tên & Slogan */}
            <div className="space-y-1.5 pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {companyForm.tenCongTy || "VNG Corporation"}
                </h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200">
                  Mã số thuế: 0303640243
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic">
                &ldquo;
                {companyForm.aboutMe ||
                  "Đón nhận thách thức - Phát triển con người - Đổi mới công nghệ"}
                &rdquo;
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 shrink-0">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  QUY MÔ
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {companyForm.quyMo || "1,000+ Kỹ sư"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  THỊ TRƯỜNG
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {companyForm.quocGia || "Toàn cầu & SEA"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. NỘI DUNG 2 CỘT CHÍNH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === CỘT TRÁI (MAIN FORM: 2 CỘT) === */}
        <div className="lg:col-span-2 space-y-6">
          {/* KHỐI 3: GIỚI THIỆU CÔNG TY (RICH TEXT) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Giới thiệu công ty
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Rich-text định dạng sẵn
              </span>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Tóm tắt tiểu sử & Năng lực kỹ thuật
              </label>

              {/* Toolbar mô phỏng Rich Text Editor */}
              <div className="border border-slate-200 rounded-t-lg bg-slate-50 px-3 py-2 flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  title="In đậm"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 font-bold"
                >
                  <Bold size={15} />
                </button>
                <button
                  type="button"
                  title="In nghiêng"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 italic"
                >
                  <Italic size={15} />
                </button>
                <button
                  type="button"
                  title="Gạch chân"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 underline"
                >
                  <Underline size={15} />
                </button>

                <div className="w-px h-4 bg-slate-300 mx-1" />

                <button
                  type="button"
                  title="Danh sách dấu chấm"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900"
                >
                  <List size={15} />
                </button>
                <button
                  type="button"
                  title="Danh sách số"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900"
                >
                  <ListOrdered size={15} />
                </button>

                <div className="w-px h-4 bg-slate-300 mx-1" />

                <button
                  type="button"
                  title="Chèn liên kết"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900"
                >
                  <LinkIcon size={15} />
                </button>
                <button
                  type="button"
                  title="Mã nguồn"
                  className="p-1.5 hover:bg-white rounded text-slate-600 hover:text-slate-900 font-mono text-xs"
                >
                  <Code size={15} />
                </button>
              </div>

              {/* Textarea nội dung */}
              <textarea
                rows={6}
                value={companyForm.moTa || ""}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, moTa: e.target.value })
                }
                placeholder="Nhập phần tóm tắt giới thiệu về công ty, văn hoá làm việc, quy mô hạ tầng..."
                className="w-full p-4 border border-t-0 border-slate-200 rounded-b-lg text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-y"
              />
            </div>
          </div>

          {/* KHỐI 4: LĨNH VỰC HOẠT ĐỘNG TRỌNG TÂM (TAGS) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Lĩnh vực hoạt động trọng tâm (Industry Sectors)
              </h3>
            </div>

            {/* Danh sách Tags */}
            <div className="flex flex-wrap gap-2.5">
              {sectors.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs md:text-sm font-medium transition hover:bg-blue-100"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSector(idx)}
                    className="text-blue-500 hover:text-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            {/* Ô thêm tag mới */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSectorInput}
                onChange={(e) => setNewSectorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSector();
                  }
                }}
                placeholder="Thêm tag lĩnh vực (Ví dụ: Blockchain, E-commerce...)"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={handleAddSector}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus size={16} /> Thêm
              </button>
            </div>
          </div>

          {/* KHỐI THÔNG TIN BỔ SUNG & CÔNG TY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Thông tin vận hành & Liên hệ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Tên công ty
                </label>
                <input
                  type="text"
                  value={companyForm.tenCongTy || ""}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      tenCongTy: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Website chính thức
                </label>
                <input
                  type="url"
                  value={companyForm.website || ""}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, website: e.target.value })
                  }
                  placeholder="https://vng.com.vn"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Mô hình công ty
                </label>
                <input
                  type="text"
                  value={companyForm.moHinhCongTy || ""}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      moHinhCongTy: e.target.value,
                    })
                  }
                  placeholder="Product & Outsource..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Thời gian làm việc
                </label>
                <input
                  type="text"
                  value={companyForm.thoiGianLamViec || ""}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      thoiGianLamViec: e.target.value,
                    })
                  }
                  placeholder="Thứ 2 - Thứ 6 (8h30 - 17h30)"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Slogan công ty (About Me)
                </label>
                <input
                  type="text"
                  value={companyForm.aboutMe || ""}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, aboutMe: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI (SIDEBAR WIDGETS: 1 CỘT) === */}
        <div className="space-y-6">
          {/* KHỐI 6: ĐỘ HOÀN THIỆN HỒ SƠ */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Độ hoàn thiện hồ sơ
              </h3>
              <span className="text-xl font-extrabold text-blue-600">
                {completionPercent}%
              </span>
            </div>

            {/* Thanh tiến độ Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {/* Card Gợi ý tối ưu hồ sơ */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex gap-3 text-slate-700">
              <Lightbulb size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">
                  Gợi ý tối ưu hồ sơ
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thêm video giới thiệu văn phòng làm việc để đạt{" "}
                  <strong className="text-blue-700">100%</strong> và được ưu
                  tiên đưa lên danh sách Nhà tuyển dụng nổi bật.
                </p>
              </div>
            </div>
          </div>

          {/* KHỐI 5: CHI NHÁNH & TRỤ SỞ */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Chi nhánh & Trụ sở
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast("Tính năng thêm mới địa điểm chi nhánh...", {
                    icon: "🏢",
                  })
                }
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
              >
                + Thêm
              </button>
            </div>

            {/* Danh sách địa điểm */}
            <div className="space-y-3">
              {branches?.length > 0 ? (
                branches.map((branch) => (
                  <div
                    key={branch.maChiNhanh}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 relative"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        {branch.laTruSoChinh ? "TRỤ SỞ CHÍNH" : "CHI NHÁNH"} (
                        {branch.thanhPho})
                      </p>
                      {branch.laTruSoChinh && (
                        <Star
                          size={14}
                          className="text-amber-500 fill-amber-500"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {branch.diaChi}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      TRỤ SỞ CHÍNH (TP.HCM)
                    </p>
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    VNG Campus, Đường số 13, KCX Tân Thuận, Phường Tân Thuận
                    Đông, Quận 7, TP. Hồ Chí Minh
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
