"use client";

import React, { useRef, useState } from "react";
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
  Lightbulb,
  Building2,
  Briefcase,
  Loader2,
  Trash2,
  Navigation,
  Crosshair,
  Award,
  Upload,
} from "lucide-react";
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
  useUploadCompanyImage,
} from "@/hooks/recruiter/useEmployerProfile";
import type {
  CompanyProfileResponse,
  UpdateCompanyProfilePayload,
  CompanyInfo,
  CompanySectionImages,
  CompanyProfileCompletionField,
  UpsertCompanyBranchPayload,
} from "@viecngon/types";
import { cn } from "@/lib/utils";

type ProfileTab = "general" | "culture" | "media" | "branches" | "reviews";

interface BranchFormItem {
  localKey: string;
  maChiNhanh?: string;
  thanhPho: string;
  diaChi: string;
  mapUrl: string;
  viDo: string;
  kinhDo: string;
}

const COMPANY_MODEL_OPTIONS = [
  "Sản phẩm",
  "Thuê ngoài (Outsource)",
  "Sản phẩm & Dịch vụ",
  "Tư vấn giải pháp IT",
];

const COMPANY_SIZE_OPTIONS = [
  "1 - 50 nhân viên",
  "51 - 150 nhân viên",
  "151 - 300 nhân viên",
  "301 - 500 nhân viên",
  "501 - 1,000 nhân viên",
  "1,000+ nhân viên",
];

const COUNTRY_OPTIONS = [
  "Việt Nam",
  "Hàn Quốc",
  "Nhật Bản",
  "Singapore",
  "Mỹ",
  "Úc",
  "Châu Âu",
  "Đa quốc gia",
];

const WORKING_TIME_OPTIONS = [
  "Thứ 2 - Thứ 6",
  "Thứ 2 - Sáng Thứ 7",
  "Linh hoạt (Hybrid)",
];

const OT_POLICY_OPTIONS = [
  "Không có OT",
  "Thêm lương OT",
  "Nghỉ bù linh hoạt",
  "Thưởng theo dự án",
];

const CITY_OPTIONS = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
];

const CITY_DEFAULT_COORDS: Record<string, { lat: number; lng: number }> = {
  "Hà Nội": { lat: 21.0285, lng: 105.8542 },
  "TP.HCM": { lat: 10.7769, lng: 106.7009 },
  "Đà Nẵng": { lat: 16.0544, lng: 108.2022 },
  "Hải Phòng": { lat: 20.8449, lng: 106.6881 },
  "Cần Thơ": { lat: 10.0452, lng: 105.7469 },
  "Bình Dương": { lat: 10.9804, lng: 106.6519 },
};

const MISSING_FIELD_LABELS: Record<CompanyProfileCompletionField, string> = {
  tenCongTy: "Tên công ty",
  logoUrl: "Logo doanh nghiệp",
  aboutMe: "Slogan / Giới thiệu ngắn",
  moTa: "Mô tả chi tiết công ty",
  phucLoi: "Phúc lợi & Đãi ngộ",
  linhVuc: "Lĩnh vực hoạt động",
  website: "Website chính thức",
  thanhPho: "Thành phố",
  diaChi: "Địa chỉ trụ sở chính",
  quyMo: "Quy mô nhân sự",
  quocGia: "Quốc gia",
  moHinhCongTy: "Mô hình công ty",
  thoiGianLamViec: "Thời gian làm việc",
  chiNhanhs: "Danh sách chi nhánh",
};

function buildSelectOptions(presets: string[], currentValue?: string | null) {
  const trimmed = currentValue?.trim();
  if (!trimmed || presets.includes(trimmed)) return presets;
  return [trimmed, ...presets];
}

function getInitials(name?: string | null): string {
  if (!name?.trim()) return "VN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function CompanyProfileSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-4 w-36 bg-surface-subtle rounded" />
          <div className="h-8 w-72 bg-surface-subtle rounded-lg" />
          <div className="h-4 w-80 bg-surface-muted rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 bg-surface-subtle rounded-lg" />
          <div className="h-10 w-32 bg-surface-subtle rounded-lg" />
        </div>
      </div>

      <div className="h-14 bg-surface-card rounded-t-xl border border-border-default px-4 flex items-center gap-6">
        <div className="h-4 w-28 bg-surface-subtle rounded" />
        <div className="h-4 w-32 bg-surface-subtle rounded" />
        <div className="h-4 w-32 bg-surface-subtle rounded" />
        <div className="h-4 w-36 bg-surface-subtle rounded" />
        <div className="h-4 w-32 bg-surface-subtle rounded" />
      </div>

      <div className="bg-surface-card rounded-2xl border border-border-default overflow-hidden">
        <div className="h-48 sm:h-56 bg-surface-subtle" />
        <div className="px-6 pb-6 flex items-end gap-5 -mt-12">
          <div className="w-28 h-28 rounded-2xl bg-slate-300 border-4 border-white shrink-0" />
          <div className="space-y-2 flex-1 pb-2">
            <div className="h-6 w-56 bg-surface-subtle rounded" />
            <div className="h-4 w-72 bg-surface-muted rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 space-y-4">
            <div className="h-5 w-44 bg-surface-subtle rounded" />
            <div className="h-40 w-full bg-surface-muted rounded-lg" />
          </div>
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 space-y-4">
            <div className="h-5 w-52 bg-surface-subtle rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-10 bg-surface-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 space-y-4">
            <div className="h-5 w-40 bg-surface-subtle rounded" />
            <div className="h-2.5 w-full bg-surface-muted rounded-full" />
            <div className="h-20 w-full bg-surface-muted rounded-xl" />
          </div>
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 space-y-3">
            <div className="h-5 w-36 bg-surface-subtle rounded" />
            <div className="h-20 w-full bg-surface-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyProfilePage() {
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useEmployerProfile();

  const [activeTab, setActiveTab] = useState<ProfileTab>("general");

  if (isLoading) {
    return <CompanyProfileSkeleton />;
  }

  if (isError || !profileData) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-danger-soft text-danger-text p-6 rounded-2xl border border-danger-border">
          <p className="font-semibold text-lg mb-2">
            Không thể tải thông tin hồ sơ doanh nghiệp
          </p>
          <p className="text-sm mb-4">
            Vui lòng kiểm tra lại quyền truy cập hoặc phiên đăng nhập của bạn.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-danger text-white rounded-lg text-sm font-semibold hover:bg-danger-hover transition"
          >
            Thử tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <CompanyProfileEditor
      key={`${profileData.company.maCongTy}-${profileData.branches.length}`}
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
  const { mutateAsync: uploadCompanyImage } = useUploadCompanyImage();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const introImageInputRef = useRef<HTMLInputElement>(null);
  const cultureImageInputRef = useRef<HTMLInputElement>(null);
  const moTaTextareaRef = useRef<HTMLTextAreaElement>(null);
  const phucLoiTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [uploadingTarget, setUploadingTarget] = useState<
    "logo" | "intro" | "culture" | null
  >(null);
  const [geocodingKey, setGeocodingKey] = useState<string | null>(null);

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
    thanhPho: profileData.company.thanhPho || "Hà Nội",
    diaChi: profileData.company.diaChi || "",
    moHinhCongTy: profileData.company.moHinhCongTy || "Sản phẩm",
    quyMo: profileData.company.quyMo || "151 - 300 nhân viên",
    quocGia: profileData.company.quocGia || "Việt Nam",
    thoiGianLamViec: profileData.company.thoiGianLamViec || "Thứ 2 - Thứ 6",
    chinhSachOT: profileData.company.chinhSachOT || "Không có OT",
    giaiThuong: profileData.company.giaiThuong || "",
  }));

  const [sectionImages, setSectionImages] = useState<CompanySectionImages>(
    () => ({
      introImages: profileData.company.sectionImages?.introImages ?? [],
      cultureImages: profileData.company.sectionImages?.cultureImages ?? [],
    }),
  );

  const [branchesList, setBranchesList] = useState<BranchFormItem[]>(() =>
    (profileData.branches ?? []).map((b) => ({
      localKey: b.maChiNhanh,
      maChiNhanh: b.maChiNhanh,
      thanhPho: b.thanhPho,
      diaChi: b.diaChi,
      mapUrl: b.mapUrl || "",
      viDo: b.viDo !== null && b.viDo !== undefined ? String(b.viDo) : "",
      kinhDo:
        b.kinhDo !== null && b.kinhDo !== undefined ? String(b.kinhDo) : "",
    })),
  );

  const [sectors, setSectors] = useState<string[]>(
    () => profileData.company.linhVuc ?? [],
  );
  const [newSectorInput, setNewSectorInput] = useState<string>("");

  const wrapSelectionWithHtml = (
    field: "moTa" | "phucLoi",
    ref: React.RefObject<HTMLTextAreaElement | null>,
    openTag: string,
    closeTag: string,
  ) => {
    const el = ref.current;
    const current = companyForm[field] || "";
    if (!el) return;
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || "Nội dung";
    const nextValue =
      current.slice(0, start) +
      openTag +
      selected +
      closeTag +
      current.slice(end);
    setCompanyForm((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleUploadImageFile = async (
    file: File | undefined,
    target: "logo" | "intro" | "culture",
  ) => {
    if (!file) return;
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
    if (!allowedTypes.has(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh định dạng JPG, PNG, WEBP hoặc GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dung lượng ảnh tối đa là 5MB.");
      return;
    }

    if (
      target === "intro" &&
      sectionImages.introImages.length >= 8
    ) {
      toast.error("Tối đa 8 ảnh cho section Giới thiệu công ty.");
      return;
    }
    if (
      target === "culture" &&
      sectionImages.cultureImages.length >= 8
    ) {
      toast.error("Tối đa 8 ảnh cho section Văn hóa & Phúc lợi.");
      return;
    }

    try {
      setUploadingTarget(target);
      const { url } = await uploadCompanyImage(file);
      if (target === "logo") {
        setCompanyForm((prev) => ({ ...prev, logoUrl: url }));
        toast.success("Đã tải logo lên! Bấm 'Lưu thay đổi' để cập nhật.");
      } else if (target === "intro") {
        setSectionImages((prev) => ({
          ...prev,
          introImages: [...prev.introImages, url],
        }));
        toast.success("Đã thêm ảnh vào mục Giới thiệu công ty.");
      } else {
        setSectionImages((prev) => ({
          ...prev,
          cultureImages: [...prev.cultureImages, url],
        }));
        toast.success("Đã thêm ảnh vào mục Văn hóa & Phúc lợi.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Tải ảnh thất bại, thử lại sau.";
      toast.error(message);
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleAddSector = () => {
    const trimmed = newSectorInput.trim();
    if (!trimmed) return;
    if (/[,;|]/.test(trimmed)) {
      toast.error("Tag lĩnh vực không được chứa ký tự , ; hoặc |");
      return;
    }
    if (trimmed.length > 50) {
      toast.error("Mỗi tag lĩnh vực tối đa 50 ký tự");
      return;
    }
    if (sectors.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Lĩnh vực này đã tồn tại trong danh sách");
      return;
    }
    if (sectors.length >= 10) {
      toast.error("Tối đa 10 lĩnh vực hoạt động");
      return;
    }
    const nextSectors = [...sectors, trimmed];
    if (nextSectors.join(", ").length > 150) {
      toast.error("Tổng độ dài các lĩnh vực tối đa 150 ký tự");
      return;
    }
    setSectors(nextSectors);
    setNewSectorInput("");
  };

  const handleRemoveSector = (indexToRemove: number) => {
    setSectors(sectors.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddBranch = () => {
    if (branchesList.length >= 20) {
      toast.error("Tối đa 20 chi nhánh cho mỗi doanh nghiệp.");
      return;
    }
    const fallbackCity = companyForm.thanhPho?.trim() || "Hà Nội";
    const coords = CITY_DEFAULT_COORDS[fallbackCity];
    setBranchesList((prev) => [
      ...prev,
      {
        localKey: `new-${Date.now()}-${prev.length}`,
        thanhPho: fallbackCity,
        diaChi: "",
        mapUrl: "",
        viDo: coords ? String(coords.lat) : "",
        kinhDo: coords ? String(coords.lng) : "",
      },
    ]);
  };

  const handleUpdateBranch = (
    localKey: string,
    patch: Partial<BranchFormItem>,
  ) => {
    setBranchesList((prev) =>
      prev.map((item) =>
        item.localKey === localKey ? { ...item, ...patch } : item,
      ),
    );
  };

  const handleRemoveBranch = (localKey: string) => {
    setBranchesList((prev) =>
      prev.filter((item) => item.localKey !== localKey),
    );
  };

  const handleLookupCoords = async (branch: BranchFormItem) => {
    const query = [branch.diaChi, branch.thanhPho, "Việt Nam"]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");

    if (!branch.thanhPho.trim() && !branch.diaChi.trim()) {
      toast.error("Vui lòng nhập địa chỉ hoặc thành phố trước.");
      return;
    }

    setGeocodingKey(branch.localKey);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query,
        )}`,
      );
      if (response.ok) {
        const results = (await response.json()) as Array<{
          lat?: string;
          lon?: string;
        }>;
        const hit = results[0];
        if (hit?.lat && hit?.lon) {
          handleUpdateBranch(branch.localKey, {
            viDo: Number(hit.lat).toFixed(6),
            kinhDo: Number(hit.lon).toFixed(6),
          });
          toast.success("Đã lấy tọa độ chính xác từ OpenStreetMap!");
          return;
        }
      }

      const cityCoords = CITY_DEFAULT_COORDS[branch.thanhPho.trim()];
      if (cityCoords) {
        handleUpdateBranch(branch.localKey, {
          viDo: String(cityCoords.lat),
          kinhDo: String(cityCoords.lng),
        });
        toast("Không định vị được số nhà cụ thể, đã điền tọa độ trung tâm TP.", {
          icon: "📍",
        });
      } else {
        toast.error("Không tìm thấy tọa độ, vui lòng nhập thủ công.");
      }
    } catch {
      const cityCoords = CITY_DEFAULT_COORDS[branch.thanhPho.trim()];
      if (cityCoords) {
        handleUpdateBranch(branch.localKey, {
          viDo: String(cityCoords.lat),
          kinhDo: String(cityCoords.lng),
        });
        toast("Đã điền tọa độ trung tâm thành phố.", { icon: "📍" });
      } else {
        toast.error("Không thể kết nối dịch vụ định vị, vui lòng nhập thủ công.");
      }
    } finally {
      setGeocodingKey(null);
    }
  };

  const handleSaveProfile = () => {
    if (!companyForm.tenCongTy?.trim()) {
      toast.error("Tên công ty không được để trống");
      setActiveTab("general");
      return;
    }

    for (const branch of branchesList) {
      if (!branch.thanhPho.trim() || !branch.diaChi.trim()) {
        toast.error(
          "Mỗi chi nhánh phải điền đầy đủ Thành phố và Địa chỉ chi tiết.",
        );
        setActiveTab("branches");
        return;
      }

      if (branch.viDo.trim() !== "") {
        const lat = Number(branch.viDo);
        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
          toast.error("Vĩ độ (Latitude) phải nằm trong khoảng -90 đến 90.");
          setActiveTab("branches");
          return;
        }
      }
      if (branch.kinhDo.trim() !== "") {
        const lng = Number(branch.kinhDo);
        if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
          toast.error("Kinh độ (Longitude) phải nằm trong khoảng -180 đến 180.");
          setActiveTab("branches");
          return;
        }
      }
    }

    const branchPayloads: UpsertCompanyBranchPayload[] = branchesList.map(
      (b) => ({
        ...(b.maChiNhanh ? { maChiNhanh: b.maChiNhanh } : {}),
        thanhPho: b.thanhPho.trim(),
        diaChi: b.diaChi.trim(),
        mapUrl: b.mapUrl.trim() || null,
        viDo: b.viDo.trim() !== "" ? Number(b.viDo) : null,
        kinhDo: b.kinhDo.trim() !== "" ? Number(b.kinhDo) : null,
      }),
    );

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
        sectionImages,
      },
      branches: branchPayloads,
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

  const { company, completion, stats } = profileData;
  const completionPercent = completion?.percent ?? 0;
  const missingFields = completion?.missingFields ?? [];
  const totalSectionMedia =
    sectionImages.introImages.length + sectionImages.cultureImages.length;

  const modelOptions = buildSelectOptions(
    COMPANY_MODEL_OPTIONS,
    companyForm.moHinhCongTy,
  );
  const sizeOptions = buildSelectOptions(
    COMPANY_SIZE_OPTIONS,
    companyForm.quyMo,
  );
  const countryOptions = buildSelectOptions(
    COUNTRY_OPTIONS,
    companyForm.quocGia,
  );
  const workingTimeOptions = buildSelectOptions(
    WORKING_TIME_OPTIONS,
    companyForm.thoiGianLamViec,
  );
  const otPolicyOptions = buildSelectOptions(
    OT_POLICY_OPTIONS,
    companyForm.chinhSachOT,
  );
  const cityOptions = buildSelectOptions(CITY_OPTIONS, companyForm.thanhPho);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans text-text-primary space-y-6">
      {/* Hidden File Inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void handleUploadImageFile(e.target.files?.[0], "logo");
          e.target.value = "";
        }}
      />
      <input
        ref={introImageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void handleUploadImageFile(e.target.files?.[0], "intro");
          e.target.value = "";
        }}
      />
      <input
        ref={cultureImageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void handleUploadImageFile(e.target.files?.[0], "culture");
          e.target.value = "";
        }}
      />

      {/* --- 1. HEADER TOP BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/employer-dashboard"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm text-text-muted hover:text-primary font-medium mb-1 transition"
          >
            <ArrowLeft size={16} /> Quay lại Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Quản lý hồ sơ doanh nghiệp
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-1">
            Đồng bộ thông tin chung, hình ảnh từng section và tọa độ chi nhánh
            lên trang công khai của bạn.
          </p>
        </div>

        {/* Cụm nút hành động */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary rounded-full text-xs font-semibold border border-primary-subtle">
            <CheckCircle2 size={14} />
            Hồ sơ doanh nghiệp
          </div>

          <Link
            href={`/company/${companyForm.slug || company.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-card border border-border-strong text-text-secondary hover:bg-surface-muted rounded-lg text-xs md:text-sm font-semibold transition shadow-2xs"
          >
            <ExternalLink size={16} className="text-text-muted" />
            Xem trang công khai
          </Link>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary-disabled text-white rounded-lg text-xs md:text-sm font-semibold transition shadow-sm"
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
      <div className="border-b border-border-default bg-surface-card rounded-t-xl px-4 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={cn(
            "relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap",
            activeTab === "general"
              ? "text-primary border-primary"
              : "text-text-secondary border-transparent hover:text-text-primary",
          )}
        >
          <Info size={16} />
          Thông tin chung
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("culture")}
          className={cn(
            "relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap",
            activeTab === "culture"
              ? "text-primary border-primary"
              : "text-text-secondary border-transparent hover:text-text-primary",
          )}
        >
          <Sparkles size={16} />
          Văn hóa &amp; Đãi ngộ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={cn(
            "relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap",
            activeTab === "media"
              ? "text-primary border-primary"
              : "text-text-secondary border-transparent hover:text-text-primary",
          )}
        >
          <ImageIcon size={16} />
          Ảnh theo Section
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-surface-muted text-text-secondary rounded-full font-bold tabular-nums">
            {totalSectionMedia}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("branches")}
          className={cn(
            "relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap",
            activeTab === "branches"
              ? "text-primary border-primary"
              : "text-text-secondary border-transparent hover:text-text-primary",
          )}
        >
          <Building size={16} />
          Chi nhánh &amp; Bản đồ
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-surface-muted text-text-secondary rounded-full font-bold tabular-nums">
            {branchesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={cn(
            "relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap",
            activeTab === "reviews"
              ? "text-primary border-primary"
              : "text-text-secondary border-transparent hover:text-text-primary",
          )}
        >
          <Star size={16} />
          Đánh giá &amp; Xếp hạng
          <span className="ml-1 px-2 py-0.5 text-xs bg-warning-soft text-warning-text border border-warning-border rounded-full font-bold flex items-center gap-1 tabular-nums">
            {stats.averageRating ?? "4.8"} ★
          </span>
        </button>
      </div>

      {/* --- 3. BANNER PREVIEW & THÔNG TIN TÓM TẮT --- */}
      <div className="bg-surface-card rounded-2xl border border-border-default overflow-hidden shadow-2xs">
        <div className="relative h-44 sm:h-56 w-full bg-linear-to-r from-primary-dark via-[#13294b] to-primary-dark overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.28),transparent_60%)]" />
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-text-primary rounded-lg text-xs font-semibold backdrop-blur-md shadow-sm transition"
          >
            <Camera size={15} />
            Quản lý ảnh các Section ({totalSectionMedia})
          </button>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Logo */}
            <div
              className={cn(
                "relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shrink-0 overflow-hidden",
                companyForm.logoUrl ? "bg-surface-card" : "bg-primary",
              )}
            >
              {companyForm.logoUrl ? (
                <Image
                  src={companyForm.logoUrl}
                  alt={companyForm.tenCongTy || "Company Logo"}
                  fill
                  sizes="128px"
                  className="object-cover rounded-xl"
                />
              ) : (
                getInitials(companyForm.tenCongTy)
              )}

              {uploadingTarget === "logo" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-white" />
                </div>
              )}

              <button
                type="button"
                title="Đổi logo công ty"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingTarget === "logo"}
                className="absolute bottom-1.5 right-1.5 p-2 bg-white text-text-secondary hover:text-primary rounded-full shadow-md transition"
              >
                <Pencil size={14} />
              </button>
            </div>

            {/* Tên & Slogan */}
            <div className="space-y-1.5 pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                  {companyForm.tenCongTy || "Tên công ty"}
                </h2>
                {companyForm.tenPhapLy && (
                  <span className="px-2.5 py-0.5 bg-surface-muted text-text-secondary rounded-md text-xs font-medium border border-border-default">
                    {companyForm.tenPhapLy}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-text-secondary italic">
                {companyForm.aboutMe
                  ? `“${companyForm.aboutMe}”`
                  : "Chưa có slogan giới thiệu ngắn"}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-surface-page p-3 sm:p-4 rounded-xl border border-border-default shrink-0">
            <div className="flex items-center gap-3 pr-4 border-r border-border-default">
              <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                  QUY MÔ
                </p>
                <p className="text-sm font-bold text-text-primary">
                  {companyForm.quyMo || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success-light text-success-text flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                  QUỐC GIA
                </p>
                <p className="text-sm font-bold text-text-primary">
                  {companyForm.quocGia || "Việt Nam"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. NỘI DUNG 2 CỘT CHÍNH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === CỘT TRÁI (2/3) === */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "general" && (
            <>
              {/* KHỐI: GIỚI THIỆU CÔNG TY (RICH TEXT) */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border-default pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                      <Building2 size={18} />
                    </div>
                    <h3 className="font-bold text-text-primary text-base">
                      Giới thiệu công ty
                    </h3>
                  </div>
                  <span className="text-xs text-text-muted font-medium">
                    Hỗ trợ HTML cơ bản
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="company-moTa"
                    className="block text-xs sm:text-sm font-semibold text-text-secondary mb-2"
                  >
                    Tóm tắt tiểu sử &amp; Năng lực doanh nghiệp
                  </label>

                  <div className="border border-border-default rounded-t-lg bg-surface-page px-3 py-2 flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      title="In đậm"
                      onClick={() =>
                        wrapSelectionWithHtml(
                          "moTa",
                          moTaTextareaRef,
                          "<strong>",
                          "</strong>",
                        )
                      }
                      className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      title="In nghiêng"
                      onClick={() =>
                        wrapSelectionWithHtml(
                          "moTa",
                          moTaTextareaRef,
                          "<em>",
                          "</em>",
                        )
                      }
                      className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      type="button"
                      title="Gạch chân"
                      onClick={() =>
                        wrapSelectionWithHtml(
                          "moTa",
                          moTaTextareaRef,
                          "<u>",
                          "</u>",
                        )
                      }
                      className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                    >
                      <Underline size={15} />
                    </button>

                    <div className="w-px h-4 bg-border-strong mx-1" />

                    <button
                      type="button"
                      title="Danh sách dấu chấm"
                      onClick={() =>
                        wrapSelectionWithHtml(
                          "moTa",
                          moTaTextareaRef,
                          "<ul>\n  <li>",
                          "</li>\n</ul>",
                        )
                      }
                      className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                    >
                      <List size={15} />
                    </button>
                    <button
                      type="button"
                      title="Danh sách số"
                      onClick={() =>
                        wrapSelectionWithHtml(
                          "moTa",
                          moTaTextareaRef,
                          "<ol>\n  <li>",
                          "</li>\n</ol>",
                        )
                      }
                      className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                    >
                      <ListOrdered size={15} />
                    </button>
                    <button
                      type="button"
                      title="Chèn liên kết"
                      onClick={() =>
                        wrapSelectionWithHtml(
                          "moTa",
                          moTaTextareaRef,
                          '<a href="https://">',
                          "</a>",
                        )
                      }
                      className="p-1.5 hover:bg-surface-card rounded text-text-secondary hover:text-text-primary"
                    >
                      <LinkIcon size={15} />
                    </button>
                  </div>

                  <textarea
                    ref={moTaTextareaRef}
                    id="company-moTa"
                    rows={6}
                    value={companyForm.moTa || ""}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, moTa: e.target.value })
                    }
                    placeholder="Nhập giới thiệu về công ty, sản phẩm chủ lực, định hướng phát triển..."
                    className="w-full p-4 border border-t-0 border-border-default rounded-b-lg text-sm text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-y"
                  />
                </div>
              </div>

              {/* KHỐI: LĨNH VỰC HOẠT ĐỘNG TRỌNG TÂM */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border-default pb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="font-bold text-text-primary text-base">
                    Lĩnh vực hoạt động trọng tâm
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sectors.length === 0 ? (
                    <p className="text-xs text-text-muted italic">
                      Chưa có lĩnh vực nào. Hãy thêm ít nhất 1 lĩnh vực hoạt
                      động của công ty.
                    </p>
                  ) : (
                    sectors.map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary border border-primary-subtle rounded-lg text-xs md:text-sm font-medium"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSector(idx)}
                          className="text-primary hover:text-danger transition"
                          aria-label={`Xóa ${tag}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

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
                    placeholder="Thêm lĩnh vực (Ví dụ: FinTech, Cloud, AI...)"
                    className="flex-1 px-4 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddSector}
                    className="px-4 py-2 bg-surface-muted hover:bg-surface-subtle text-text-secondary rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <Plus size={16} /> Thêm
                  </button>
                </div>
              </div>

              {/* KHỐI: THÔNG TIN CHUNG CHUẨN HÓA (FIX CỨNG 1 DÒNG QUA SELECT) & LIÊN HỆ */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border-default pb-3">
                  <h3 className="font-bold text-text-primary text-base">
                    Thông tin chung &amp; Vận hành (Hiển thị 1 dòng chuẩn hóa)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="company-tenCongTy"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Tên công ty <span className="text-danger">*</span>
                    </label>
                    <input
                      id="company-tenCongTy"
                      type="text"
                      value={companyForm.tenCongTy || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          tenCongTy: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company-tenPhapLy"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Tên pháp lý / Mã doanh nghiệp
                    </label>
                    <input
                      id="company-tenPhapLy"
                      type="text"
                      value={companyForm.tenPhapLy || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          tenPhapLy: e.target.value,
                        })
                      }
                      placeholder="Công ty Cổ phần..."
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company-moHinhCongTy"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Mô hình công ty
                    </label>
                    <select
                      id="company-moHinhCongTy"
                      value={companyForm.moHinhCongTy || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          moHinhCongTy: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {modelOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="company-quyMo"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Quy mô công ty
                    </label>
                    <select
                      id="company-quyMo"
                      value={companyForm.quyMo || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          quyMo: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {sizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="company-quocGia"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Quốc gia
                    </label>
                    <select
                      id="company-quocGia"
                      value={companyForm.quocGia || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          quocGia: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {countryOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="company-thoiGianLamViec"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Thời gian làm việc
                    </label>
                    <select
                      id="company-thoiGianLamViec"
                      value={companyForm.thoiGianLamViec || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          thoiGianLamViec: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {workingTimeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="company-chinhSachOT"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Làm việc ngoài giờ (OT)
                    </label>
                    <select
                      id="company-chinhSachOT"
                      value={companyForm.chinhSachOT || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          chinhSachOT: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {otPolicyOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="company-website"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Website chính thức
                    </label>
                    <input
                      id="company-website"
                      type="url"
                      value={companyForm.website || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company-thanhPho"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Thành phố trụ sở chính
                    </label>
                    <select
                      id="company-thanhPho"
                      value={companyForm.thanhPho || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          thanhPho: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {cityOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="company-diaChi"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Địa chỉ trụ sở chính
                    </label>
                    <input
                      id="company-diaChi"
                      type="text"
                      value={companyForm.diaChi || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          diaChi: e.target.value,
                        })
                      }
                      placeholder="Số nhà, đường, quận/huyện..."
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="company-aboutMe"
                      className="block text-xs font-semibold text-text-secondary mb-1.5"
                    >
                      Slogan / Văn hóa &amp; Con người ngắn
                    </label>
                    <input
                      id="company-aboutMe"
                      type="text"
                      value={companyForm.aboutMe || ""}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          aboutMe: e.target.value,
                        })
                      }
                      placeholder="Đón nhận thách thức - Đổi mới công nghệ..."
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "culture" && (
            <>
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border-default pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                      <Sparkles size={18} />
                    </div>
                    <h3 className="font-bold text-text-primary text-base">
                      Phúc lợi &amp; Đãi ngộ
                    </h3>
                  </div>
                </div>

                <div className="border border-border-default rounded-t-lg bg-surface-page px-3 py-2 flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    title="In đậm"
                    onClick={() =>
                      wrapSelectionWithHtml(
                        "phucLoi",
                        phucLoiTextareaRef,
                        "<strong>",
                        "</strong>",
                      )
                    }
                    className="p-1.5 hover:bg-surface-card rounded text-text-secondary"
                  >
                    <Bold size={15} />
                  </button>
                  <button
                    type="button"
                    title="Danh sách"
                    onClick={() =>
                      wrapSelectionWithHtml(
                        "phucLoi",
                        phucLoiTextareaRef,
                        "<ul>\n  <li>",
                        "</li>\n</ul>",
                      )
                    }
                    className="p-1.5 hover:bg-surface-card rounded text-text-secondary"
                  >
                    <List size={15} />
                  </button>
                </div>

                <textarea
                  ref={phucLoiTextareaRef}
                  rows={6}
                  value={companyForm.phucLoi || ""}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, phucLoi: e.target.value })
                  }
                  placeholder="Lương tháng 13, thưởng hiệu suất, bảo hiểm sức khỏe cao cấp, du lịch công ty..."
                  className="w-full p-4 border border-t-0 border-border-default rounded-b-lg text-sm text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />
              </div>

              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <h3 className="font-bold text-text-primary text-base border-b border-border-default pb-3">
                  Chuyên môn kỹ thuật &amp; Giải thưởng
                </h3>

                <div>
                  <label
                    htmlFor="company-chuyenMon"
                    className="block text-xs font-semibold text-text-secondary mb-1.5"
                  >
                    Chuyên môn công nghệ (Ngăn cách bằng dấu phẩy hoặc HTML)
                  </label>
                  <textarea
                    id="company-chuyenMon"
                    rows={3}
                    value={companyForm.chuyenMon || ""}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        chuyenMon: e.target.value,
                      })
                    }
                    placeholder="Java, Microservices, ReactJS, TypeScript, Kubernetes, AWS"
                    className="w-full p-3.5 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company-giaiThuong"
                    className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5"
                  >
                    <Award size={14} className="text-amber-600" />
                    Giải thưởng doanh nghiệp (Tách nhiều giải bằng dấu chấm phẩy ;)
                  </label>
                  <input
                    id="company-giaiThuong"
                    type="text"
                    maxLength={255}
                    value={companyForm.giaiThuong || ""}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        giaiThuong: e.target.value,
                      })
                    }
                    placeholder="Công ty IT tốt nhất Việt Nam 2026; Top 10 Nơi làm việc tốt nhất"
                    className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "media" && (
            <div className="space-y-6">
              {/* Ảnh section Giới thiệu công ty */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-3">
                  <div>
                    <h3 className="font-bold text-text-primary text-base">
                      Ảnh cho Section &ldquo;Giới thiệu công ty&rdquo;
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Hiển thị ảnh văn phòng, không gian làm việc trên trang công
                      khai (tối đa 8 ảnh, dưới 5MB/ảnh).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => introImageInputRef.current?.click()}
                    disabled={uploadingTarget === "intro"}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light hover:bg-primary-subtle text-primary border border-primary-subtle rounded-lg text-xs font-semibold transition"
                  >
                    {uploadingTarget === "intro" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Upload size={15} />
                    )}
                    <span>Tải ảnh lên</span>
                  </button>
                </div>

                {sectionImages.introImages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border-strong bg-surface-page p-8 text-center">
                    <ImageIcon
                      size={28}
                      className="mx-auto text-text-placeholder mb-2"
                    />
                    <p className="text-sm font-semibold text-text-primary">
                      Chưa có ảnh cho phần Giới thiệu công ty
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Hãy tải lên ảnh văn phòng hoặc đội ngũ kỹ sư của bạn.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sectionImages.introImages.map((imgUrl, idx) => (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-surface-muted group"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Ảnh giới thiệu ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 240px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSectionImages((prev) => ({
                              ...prev,
                              introImages: prev.introImages.filter(
                                (_, i) => i !== idx,
                              ),
                            }))
                          }
                          aria-label="Xóa ảnh"
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/65 hover:bg-danger text-white transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ảnh section Văn hóa & Phúc lợi */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-3">
                  <div>
                    <h3 className="font-bold text-text-primary text-base">
                      Ảnh cho Section &ldquo;Phúc lợi &amp; Văn hóa&rdquo;
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Hình ảnh team building, workshop, hoạt động nội bộ (tối đa
                      8 ảnh).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => cultureImageInputRef.current?.click()}
                    disabled={uploadingTarget === "culture"}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light hover:bg-primary-subtle text-primary border border-primary-subtle rounded-lg text-xs font-semibold transition"
                  >
                    {uploadingTarget === "culture" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Upload size={15} />
                    )}
                    <span>Tải ảnh lên</span>
                  </button>
                </div>

                {sectionImages.cultureImages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border-strong bg-surface-page p-8 text-center">
                    <Sparkles
                      size={28}
                      className="mx-auto text-text-placeholder mb-2"
                    />
                    <p className="text-sm font-semibold text-text-primary">
                      Chưa có ảnh cho phần Phúc lợi &amp; Văn hóa
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Bấm &ldquo;Tải ảnh lên&rdquo; để bổ sung ảnh hoạt động văn
                      hóa công ty.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sectionImages.cultureImages.map((imgUrl, idx) => (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className="relative aspect-video rounded-xl overflow-hidden border border-border-default bg-surface-muted group"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Ảnh văn hóa ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 240px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSectionImages((prev) => ({
                              ...prev,
                              cultureImages: prev.cultureImages.filter(
                                (_, i) => i !== idx,
                              ),
                            }))
                          }
                          aria-label="Xóa ảnh"
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/65 hover:bg-danger text-white transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "branches" && (
            <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-3">
                <div>
                  <h3 className="font-bold text-text-primary text-base">
                    Quản lý Chi nhánh &amp; Tọa độ Bản đồ
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Nhập địa chỉ và tọa độ (Vĩ độ / Kinh độ) để hiển thị bản đồ
                    OpenStreetMap và nút &ldquo;Open in Maps&rdquo; cho ứng viên.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-light hover:bg-primary-subtle text-primary border border-primary-subtle rounded-lg text-xs font-semibold transition"
                >
                  <Plus size={15} />
                  <span>Thêm chi nhánh</span>
                </button>
              </div>

              {branchesList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-strong bg-surface-page p-8 text-center">
                  <MapPin
                    size={28}
                    className="mx-auto text-text-placeholder mb-2"
                  />
                  <p className="text-sm font-semibold text-text-primary">
                    Chưa có chi nhánh nào được khai báo
                  </p>
                  <p className="text-xs text-text-muted mt-1 mb-4">
                    Thêm các chi nhánh (VD: Hà Nội, TP.HCM) để trang công ty
                    hiển thị đầy đủ danh sách địa điểm &amp; bản đồ.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddBranch}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold transition"
                  >
                    <Plus size={15} /> Thêm chi nhánh đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {branchesList.map((branch, idx) => {
                    const hasCoords =
                      branch.viDo.trim() !== "" &&
                      branch.kinhDo.trim() !== "" &&
                      Number.isFinite(Number(branch.viDo)) &&
                      Number.isFinite(Number(branch.kinhDo));
                    const previewGoogleMapsUrl = hasCoords
                      ? `https://www.google.com/maps?q=${branch.viDo.trim()},${branch.kinhDo.trim()}`
                      : `https://www.google.com/maps?q=${encodeURIComponent(
                          `${branch.diaChi} ${branch.thanhPho}`,
                        )}`;

                    return (
                      <div
                        key={branch.localKey}
                        className="rounded-xl border border-border-default bg-surface-page p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                            Chi nhánh #{idx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void handleLookupCoords(branch)}
                              disabled={geocodingKey === branch.localKey}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-card hover:bg-primary-light text-primary border border-primary-subtle rounded-md text-xs font-semibold transition"
                            >
                              {geocodingKey === branch.localKey ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Crosshair size={13} />
                              )}
                              <span>Lấy tọa độ</span>
                            </button>

                            <a
                              href={previewGoogleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-card hover:bg-surface-muted text-text-secondary border border-border-default rounded-md text-xs font-semibold transition"
                            >
                              <Navigation size={12} />
                              <span>Open in Maps</span>
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveBranch(branch.localKey)
                              }
                              aria-label="Xóa chi nhánh"
                              className="p-1.5 text-text-muted hover:text-danger transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                              Thành phố <span className="text-danger">*</span>
                            </label>
                            <select
                              value={branch.thanhPho}
                              onChange={(e) => {
                                const city = e.target.value;
                                const defaults = CITY_DEFAULT_COORDS[city];
                                handleUpdateBranch(branch.localKey, {
                                  thanhPho: city,
                                  ...(defaults && !branch.viDo && !branch.kinhDo
                                    ? {
                                        viDo: String(defaults.lat),
                                        kinhDo: String(defaults.lng),
                                      }
                                    : {}),
                                });
                              }}
                              className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                              {buildSelectOptions(
                                CITY_OPTIONS,
                                branch.thanhPho,
                              ).map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                              Địa chỉ chi tiết{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              value={branch.diaChi}
                              onChange={(e) =>
                                handleUpdateBranch(branch.localKey, {
                                  diaChi: e.target.value,
                                })
                              }
                              placeholder="VD: Số 8 Hoàng Văn Thái, Quận 7..."
                              className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                              Vĩ độ (Latitude)
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={branch.viDo}
                              onChange={(e) =>
                                handleUpdateBranch(branch.localKey, {
                                  viDo: e.target.value,
                                })
                              }
                              placeholder="VD: 10.7295"
                              className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-1">
                              Kinh độ (Longitude)
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={branch.kinhDo}
                              onChange={(e) =>
                                handleUpdateBranch(branch.localKey, {
                                  kinhDo: e.target.value,
                                })
                              }
                              placeholder="VD: 106.7218"
                              className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <h3 className="font-bold text-text-primary text-base">
                  Thống kê Đánh giá từ ứng viên &amp; nhân viên
                </h3>
                <Link
                  href={`/company/${companyForm.slug || company.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Xem tại trang công khai</span>
                  <ExternalLink size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border-default bg-surface-page p-4">
                  <p className="text-xs text-text-muted mb-1">
                    Điểm trung bình
                  </p>
                  <p className="text-2xl font-bold text-text-primary tabular-nums flex items-center gap-1.5">
                    {stats.averageRating ?? "Chưa có"}
                    <Star
                      size={18}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                  </p>
                </div>
                <div className="rounded-xl border border-border-default bg-surface-page p-4">
                  <p className="text-xs text-text-muted mb-1">Tổng đánh giá</p>
                  <p className="text-2xl font-bold text-text-primary tabular-nums">
                    {stats.totalReviews}
                  </p>
                </div>
                <div className="rounded-xl border border-border-default bg-surface-page p-4">
                  <p className="text-xs text-text-muted mb-1">Số chi nhánh</p>
                  <p className="text-2xl font-bold text-text-primary tabular-nums">
                    {branchesList.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* === CỘT PHẢI (SIDEBAR WIDGETS: 1/3) === */}
        <div className="space-y-6">
          {/* ĐỘ HOÀN THIỆN HỒ SƠ */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary text-base">
                Độ hoàn thiện hồ sơ
              </h3>
              <span className="text-xl font-extrabold text-primary tabular-nums">
                {completionPercent}%
              </span>
            </div>

            <div className="w-full bg-surface-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="bg-primary-light/70 border border-primary-subtle rounded-xl p-4 flex gap-3 text-text-secondary">
              <Lightbulb size={20} className="text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">
                  {missingFields.length > 0
                    ? "Gợi ý tối ưu hồ sơ"
                    : "Hồ sơ doanh nghiệp đã đầy đủ!"}
                </p>
                {missingFields.length > 0 ? (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Còn thiếu:{" "}
                    {missingFields
                      .slice(0, 4)
                      .map((f) => MISSING_FIELD_LABELS[f] ?? f)
                      .join(", ")}
                    {missingFields.length > 4
                      ? ` (+${missingFields.length - 4} mục)`
                      : ""}
                    .
                  </p>
                ) : (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Hồ sơ công ty đạt 100% thông tin chuẩn giúp tăng uy tín với
                    ứng viên IT.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* TÓM TẮT CHI NHÁNH & TRỤ SỞ */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <h3 className="font-bold text-text-primary text-base">
                  Chi nhánh &amp; Trụ sở
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("branches")}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Chỉnh sửa
              </button>
            </div>

            <div className="space-y-3">
              {branchesList.length > 0 ? (
                branchesList.map((branch, idx) => (
                  <div
                    key={branch.localKey}
                    className="p-3.5 bg-surface-page border border-border-default rounded-xl space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-text-primary uppercase tracking-wide">
                        {idx === 0 ? "TRỤ SỞ / CHÍNH" : "CHI NHÁNH"} (
                        {branch.thanhPho || "Chưa chọn TP"})
                      </p>
                      {branch.viDo && branch.kinhDo && (
                        <span className="text-[11px] font-medium text-success-text">
                          Có tọa độ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {branch.diaChi || "Chưa nhập địa chỉ chi tiết"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-surface-page border border-dashed border-border-default rounded-xl text-center space-y-2">
                  <p className="text-xs text-text-muted">
                    Chưa có chi nhánh nào.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("branches");
                      handleAddBranch();
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    + Thêm chi nhánh ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
