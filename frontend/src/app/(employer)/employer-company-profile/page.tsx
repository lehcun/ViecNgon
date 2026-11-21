"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Award,
  Bell,
  Briefcase,
  Building2,
  Camera,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Images,
  Info,
  Lightbulb,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
  useUploadCompanyImage,
} from "@/hooks/recruiter/useEmployerProfile";
import type {
  CompanyInfo,
  CompanyProfileCompletionField,
  CompanyProfileResponse,
  CompanySectionImages,
  UpdateCompanyProfilePayload,
  UpsertCompanyBranchPayload,
} from "@viecngon/types";
import { RichTextSectionEditor } from "@/components/employer/company-profile/RichTextSectionEditor";
import { SectionMediaPanel } from "@/components/employer/company-profile/SectionMediaPanel";
import { CompanyPostsManager } from "@/components/employer/company-profile/CompanyPostsManager";
import { CompanyReviewsSummaryTab } from "@/components/employer/company-profile/CompanyReviewsSummaryTab";
import {
  buildCitiesBannerPreview,
  CITY_DEFAULT_COORDS,
  CITY_OPTIONS,
  CompanyBranchesManager,
  type BranchFormItem,
} from "@/components/employer/company-profile/CompanyBranchesManager";
import {
  ImageCropperModal,
  validateAvatarImageFile,
} from "@/components/ui/ImageCropperModal";
import { cn } from "@/lib/utils";

type ProfileTab =
  | "general"
  | "culture"
  | "media"
  | "branches"
  | "posts"
  | "reviews";

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

const MISSING_FIELD_META: Record<
  CompanyProfileCompletionField,
  { label: string; tab: ProfileTab }
> = {
  tenCongTy: { label: "Tên công ty", tab: "general" },
  logoUrl: { label: "Logo doanh nghiệp", tab: "general" },
  aboutMe: { label: "Văn hóa & Con người", tab: "culture" },
  moTa: { label: "Mô tả chi tiết công ty", tab: "general" },
  phucLoi: { label: "Phúc lợi & Đãi ngộ", tab: "culture" },
  linhVuc: { label: "Lĩnh vực hoạt động", tab: "general" },
  website: { label: "Website chính thức", tab: "general" },
  thanhPho: { label: "Thành phố", tab: "general" },
  diaChi: { label: "Địa chỉ trụ sở chính", tab: "general" },
  quyMo: { label: "Quy mô nhân sự", tab: "general" },
  quocGia: { label: "Quốc gia", tab: "general" },
  moHinhCongTy: { label: "Mô hình công ty", tab: "general" },
  thoiGianLamViec: { label: "Thời gian làm việc", tab: "general" },
  chiNhanhs: { label: "Danh sách chi nhánh", tab: "branches" },
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

function parseAwardsList(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createInitialFormState(profileData: CompanyProfileResponse): {
  companyForm: Partial<CompanyInfo>;
  sectors: string[];
  awardsList: string[];
  sectionImages: CompanySectionImages;
  branchesList: BranchFormItem[];
} {
  return {
    companyForm: {
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
    },
    sectors: profileData.company.linhVuc ?? [],
    awardsList: parseAwardsList(profileData.company.giaiThuong),
    sectionImages: {
      introImages: profileData.company.sectionImages?.introImages ?? [],
      cultureImages: profileData.company.sectionImages?.cultureImages ?? [],
    },
    branchesList: (profileData.branches ?? []).map((b) => ({
      localKey: b.maChiNhanh,
      maChiNhanh: b.maChiNhanh,
      thanhPho: b.thanhPho,
      diaChi: b.diaChi,
      mapUrl: b.mapUrl || "",
      viDo: b.viDo !== null && b.viDo !== undefined ? String(b.viDo) : "",
      kinhDo:
        b.kinhDo !== null && b.kinhDo !== undefined ? String(b.kinhDo) : "",
    })),
  };
}

function serializeSnapshot(state: {
  companyForm: Partial<CompanyInfo>;
  sectors: string[];
  awardsList: string[];
  sectionImages: CompanySectionImages;
  branchesList: BranchFormItem[];
}): string {
  return JSON.stringify({
    tenCongTy: state.companyForm.tenCongTy || "",
    tenPhapLy: state.companyForm.tenPhapLy || "",
    moTa: state.companyForm.moTa || "",
    phucLoi: state.companyForm.phucLoi || "",
    chuyenMon: state.companyForm.chuyenMon || "",
    aboutMe: state.companyForm.aboutMe || "",
    logoUrl: state.companyForm.logoUrl || "",
    website: state.companyForm.website || "",
    thanhPho: state.companyForm.thanhPho || "",
    diaChi: state.companyForm.diaChi || "",
    moHinhCongTy: state.companyForm.moHinhCongTy || "",
    quyMo: state.companyForm.quyMo || "",
    quocGia: state.companyForm.quocGia || "",
    thoiGianLamViec: state.companyForm.thoiGianLamViec || "",
    chinhSachOT: state.companyForm.chinhSachOT || "",
    giaiThuong: state.awardsList.join("; "),
    sectors: state.sectors,
    sectionImages: state.sectionImages,
    branches: state.branchesList.map((b) => ({
      maChiNhanh: b.maChiNhanh || "",
      thanhPho: b.thanhPho,
      diaChi: b.diaChi,
      viDo: b.viDo,
      kinhDo: b.kinhDo,
    })),
  });
}

function CompanyProfileSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-4 w-36 bg-surface-subtle rounded" />
          <div className="h-8 w-72 bg-surface-subtle rounded-lg" />
          <div className="h-4 w-96 bg-surface-muted rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 bg-surface-subtle rounded-lg" />
          <div className="h-10 w-32 bg-surface-subtle rounded-lg" />
        </div>
      </div>

      <div className="h-14 bg-surface-card rounded-t-xl border border-border-default px-4 flex items-center gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-4 w-28 bg-surface-subtle rounded" />
        ))}
      </div>

      <div className="bg-surface-card rounded-2xl border border-border-default overflow-hidden p-6 bg-linear-to-br from-primary-dark/80 via-[#13294b]/80 to-primary-dark/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-xl bg-white/15 shrink-0" />
            <div className="space-y-2.5">
              <div className="h-7 w-56 bg-white/20 rounded" />
              <div className="h-4 w-72 bg-white/15 rounded" />
            </div>
          </div>
          <div className="h-20 w-56 bg-white/10 rounded-xl" />
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
            <div className="h-24 w-full bg-surface-muted rounded-xl" />
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
  const [editorResetCount, setEditorResetCount] = useState(0);

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
            type="button"
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
      key={`${profileData.company.maCongTy}-${profileData.branches.length}-${editorResetCount}`}
      profileData={profileData}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onResetFromServer={() => setEditorResetCount((c) => c + 1)}
    />
  );
}

function CompanyProfileEditor({
  profileData,
  activeTab,
  setActiveTab,
  onResetFromServer,
}: {
  profileData: CompanyProfileResponse;
  activeTab: ProfileTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ProfileTab>>;
  onResetFromServer: () => void;
}) {
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateEmployerProfile();
  const { mutateAsync: uploadCompanyImage } = useUploadCompanyImage();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const initialData = useMemo(
    () => createInitialFormState(profileData),
    [profileData],
  );
  const initialSnapshot = useMemo(
    () => serializeSnapshot(initialData),
    [initialData],
  );

  const [uploadingTarget, setUploadingTarget] = useState<
    "logo" | "intro" | "culture" | null
  >(null);
  const [cropLogoFile, setCropLogoFile] = useState<File | null>(null);
  const [geocodingKey, setGeocodingKey] = useState<string | null>(null);

  const [companyForm, setCompanyForm] = useState<Partial<CompanyInfo>>(
    () => initialData.companyForm,
  );
  const [sectors, setSectors] = useState<string[]>(() => initialData.sectors);
  const [newSectorInput, setNewSectorInput] = useState("");
  const [awardsList, setAwardsList] = useState<string[]>(
    () => initialData.awardsList,
  );
  const [newAwardInput, setNewAwardInput] = useState("");
  const [sectionImages, setSectionImages] = useState<CompanySectionImages>(
    () => initialData.sectionImages,
  );
  const [branchesList, setBranchesList] = useState<BranchFormItem[]>(
    () => initialData.branchesList,
  );
  const [selectedBranchKey, setSelectedBranchKey] = useState<string>(
    () => initialData.branchesList[0]?.localKey ?? "",
  );
  const [savedSnapshotOverride, setSavedSnapshotOverride] = useState<
    string | null
  >(null);

  const currentSnapshot = serializeSnapshot({
    companyForm,
    sectors,
    awardsList,
    sectionImages,
    branchesList,
  });
  const hasUnsavedChanges =
    currentSnapshot !== (savedSnapshotOverride ?? initialSnapshot);

  const handleSelectLogoFile = (file: File | undefined) => {
    if (!file) return;
    const validationError = validateAvatarImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setCropLogoFile(file);
  };

  const handleConfirmCroppedLogo = async (croppedFile: File) => {
    try {
      setUploadingTarget("logo");
      const { url } = await uploadCompanyImage(croppedFile);
      setCompanyForm((prev) => ({ ...prev, logoUrl: url }));
      setCropLogoFile(null);
      toast.success("Đã cắt và tải logo lên! Bấm 'Lưu thay đổi' để cập nhật.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Tải logo thất bại, thử lại sau.",
      );
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleUploadSectionFiles = async (
    files: FileList | null,
    target: "intro" | "culture",
  ) => {
    if (!files || files.length === 0) return;
    const field = target === "intro" ? "introImages" : "cultureImages";
    const sectionLabel =
      target === "intro" ? "Giới thiệu công ty" : "Phúc lợi & Văn hóa";
    const remainingSlots = 8 - sectionImages[field].length;

    if (remainingSlots <= 0) {
      toast.error(`Tối đa 8 ảnh cho section ${sectionLabel}.`);
      return;
    }

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
    const validFiles: File[] = [];
    for (const file of Array.from(files).slice(0, remainingSlots)) {
      if (!allowedTypes.has(file.type)) {
        toast.error(`Bỏ qua "${file.name}": chỉ hỗ trợ JPG, PNG, WEBP, GIF.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Bỏ qua "${file.name}": dung lượng tối đa 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setUploadingTarget(target);
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const { url } = await uploadCompanyImage(file);
        uploadedUrls.push(url);
      }

      setSectionImages((prev) => ({
        ...prev,
        [field]: [...prev[field], ...uploadedUrls].slice(0, 8),
      }));
      toast.success(
        `Đã thêm ${uploadedUrls.length} ảnh vào mục ${sectionLabel}. Nhớ bấm 'Lưu thay đổi'!`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Tải ảnh thất bại, thử lại sau.",
      );
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

  const handleAddAward = () => {
    const trimmed = newAwardInput.trim().replaceAll(";", ",");
    if (!trimmed) return;
    if (awardsList.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Giải thưởng này đã tồn tại trong danh sách.");
      return;
    }
    const nextAwards = [...awardsList, trimmed];
    if (nextAwards.join("; ").length > 255) {
      toast.error("Tổng độ dài danh sách giải thưởng tối đa 255 ký tự.");
      return;
    }
    setAwardsList(nextAwards);
    setNewAwardInput("");
  };

  const handleAddBranch = () => {
    if (branchesList.length >= 20) {
      toast.error("Tối đa 20 chi nhánh cho mỗi doanh nghiệp.");
      return;
    }
    const fallbackCity = companyForm.thanhPho?.trim() || "Hà Nội";
    const coords = CITY_DEFAULT_COORDS[fallbackCity];
    const newKey = `new-${Date.now()}-${branchesList.length}`;
    setBranchesList((prev) => [
      ...prev,
      {
        localKey: newKey,
        thanhPho: fallbackCity,
        diaChi: "",
        mapUrl: "",
        viDo: coords ? String(coords.lat) : "",
        kinhDo: coords ? String(coords.lng) : "",
      },
    ]);
    setSelectedBranchKey(newKey);
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
    setBranchesList((prev) => {
      const next = prev.filter((item) => item.localKey !== localKey);
      if (selectedBranchKey === localKey) {
        setSelectedBranchKey(next[0]?.localKey ?? "");
      }
      return next;
    });
  };

  const handleSetHeadquarters = (branch: BranchFormItem) => {
    setCompanyForm((prev) => ({
      ...prev,
      thanhPho: branch.thanhPho || prev.thanhPho,
      diaChi: branch.diaChi || prev.diaChi,
    }));
    toast.success(
      `Đã chọn chi nhánh tại ${branch.thanhPho || "địa điểm này"} làm Trụ sở chính. Bấm 'Lưu thay đổi' để xác nhận.`,
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
        toast(
          "Không định vị được số nhà cụ thể, đã điền tọa độ trung tâm TP.",
          { icon: "📍" },
        );
      } else {
        toast.error("Không tìm thấy tọa độ, vui lòng chọn trực tiếp trên bản đồ.");
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
        toast.error(
          "Không thể kết nối dịch vụ định vị, vui lòng chọn trực tiếp trên bản đồ.",
        );
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
        setSelectedBranchKey(branch.localKey);
        setActiveTab("branches");
        return;
      }

      if (branch.viDo.trim() !== "") {
        const lat = Number(branch.viDo);
        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
          toast.error("Vĩ độ (Latitude) phải nằm trong khoảng -90 đến 90.");
          setSelectedBranchKey(branch.localKey);
          setActiveTab("branches");
          return;
        }
      }
      if (branch.kinhDo.trim() !== "") {
        const lng = Number(branch.kinhDo);
        if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
          toast.error("Kinh độ (Longitude) phải nằm trong khoảng -180 đến 180.");
          setSelectedBranchKey(branch.localKey);
          setActiveTab("branches");
          return;
        }
      }
    }

    const serializedAwards = awardsList
      .map((item) => item.trim())
      .filter(Boolean)
      .join("; ");
    if (serializedAwards.length > 255) {
      toast.error("Tổng độ dài giải thưởng không được vượt quá 255 ký tự.");
      setActiveTab("culture");
      return;
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
        giaiThuong: serializedAwards || null,
        linhVuc: sectors,
        sectionImages,
      },
      branches: branchPayloads,
    };

    const snapshotAtSubmit = currentSnapshot;
    updateProfile(payload, {
      onSuccess: () => {
        setSavedSnapshotOverride(snapshotAtSubmit);
        toast.success("Cập nhật hồ sơ doanh nghiệp thành công!");
      },
      onError: (err) => {
        toast.error(err.message || "Lưu thay đổi thất bại, vui lòng thử lại.");
      },
    });
  };

  const { company, completion, stats } = profileData;
  const posts = profileData.posts ?? [];
  const reviews = profileData.reviews ?? [];
  const completionPercent = completion?.percent ?? 0;
  const missingFields = completion?.missingFields ?? [];
  const totalSectionMedia =
    sectionImages.introImages.length + sectionImages.cultureImages.length;
  const citiesPreview = buildCitiesBannerPreview(
    branchesList,
    companyForm.thanhPho,
  );
  const normalizedMainAddress = (companyForm.diaChi || "").trim().toLowerCase();
  const activeJobsCount = stats.totalActiveJobs ?? 0;
  const followerCount = stats.followerCount ?? 0;
  const serializedAwardsLength = awardsList.join("; ").length;
  const sectorsLength = sectors.join(", ").length;

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
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans text-text-primary space-y-6 pb-24">
      <input
        ref={logoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          handleSelectLogoFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <ImageCropperModal
        key={
          cropLogoFile
            ? `${cropLogoFile.name}-${cropLogoFile.size}-${cropLogoFile.lastModified}`
            : "logo-crop-closed"
        }
        isOpen={Boolean(cropLogoFile)}
        file={cropLogoFile}
        title="Cập nhật logo công ty"
        cropShape="rounded-square"
        isSubmitting={uploadingTarget === "logo"}
        onClose={() => setCropLogoFile(null)}
        onConfirm={handleConfirmCroppedLogo}
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
            Tùy chỉnh đồng bộ 100% các mục hiển thị trên trang DetailCompany
            công khai của bạn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {hasUnsavedChanges ? (
            <button
              type="button"
              onClick={onResetFromServer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-surface-card border border-border-strong text-text-secondary hover:bg-surface-muted rounded-lg text-xs md:text-sm font-semibold transition"
            >
              <RotateCcw size={15} />
              <span>Hủy thay đổi</span>
            </button>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary rounded-full text-xs font-semibold border border-primary-subtle">
              <CheckCircle2 size={14} />
              Đã đồng bộ
            </div>
          )}

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

      {/* --- 2. TABS NAVIGATION (KHỚP 1-1 VỚI DETAIL COMPANY) --- */}
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
          <MapPin size={16} />
          Chi nhánh &amp; Bản đồ
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-surface-muted text-text-secondary rounded-full font-bold tabular-nums">
            {branchesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={cn(
            "relative flex items-center gap-2 py-4 px-2 text-sm font-semibold transition border-b-2 whitespace-nowrap",
            activeTab === "posts"
              ? "text-primary border-primary"
              : "text-text-secondary border-transparent hover:text-text-primary",
          )}
        >
          <FileText size={16} />
          Bài viết
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-surface-muted text-text-secondary rounded-full font-bold tabular-nums">
            {posts.length}
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
            {stats.averageRating !== null
              ? `${stats.averageRating.toFixed(1)} ★`
              : `${stats.totalReviews}`}
          </span>
        </button>
      </div>

      {/* --- 3. BANNER PREVIEW 1-1 VỚI TRANG DETAIL COMPANY --- */}
      <div className="bg-linear-to-br from-primary-dark via-[#13294b] to-primary-dark rounded-2xl border border-primary-dark/40 p-6 sm:p-7 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5 min-w-0">
            {/* Logo tràn viền (object-cover, không khung trắng) + nút Upload */}
            <div
              className={cn(
                "relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-white/25 shadow-lg flex items-center justify-center font-extrabold text-xl sm:text-2xl shrink-0 overflow-hidden",
                companyForm.logoUrl
                  ? "bg-surface-card"
                  : "bg-primary-light text-primary",
              )}
            >
              {companyForm.logoUrl ? (
                <Image
                  src={companyForm.logoUrl}
                  alt={companyForm.tenCongTy || "Company Logo"}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                getInitials(companyForm.tenCongTy)
              )}

              {uploadingTarget === "logo" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin text-white" />
                </div>
              )}

              <button
                type="button"
                title="Đổi logo công ty"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingTarget === "logo"}
                className="absolute bottom-1 right-1 p-1.5 bg-white text-text-secondary hover:text-primary rounded-full shadow-md transition"
              >
                <Pencil size={12} />
              </button>
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {companyForm.tenCongTy || "Tên công ty"}
                </h2>
                {companyForm.tenPhapLy && (
                  <span className="px-2.5 py-0.5 bg-white/10 text-slate-200 rounded-md text-xs font-medium border border-white/15">
                    {companyForm.tenPhapLy}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary-disabled shrink-0" />
                  <span>{citiesPreview}</span>
                </span>
                <Link
                  href="/employer-jobs"
                  className="inline-flex items-center gap-1.5 hover:text-white underline-offset-2 hover:underline transition tabular-nums"
                >
                  <Briefcase
                    size={14}
                    className="text-primary-disabled shrink-0"
                  />
                  <span>{activeJobsCount} việc làm đang tuyển dụng</span>
                </Link>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Bell size={14} className="text-primary-disabled shrink-0" />
                  <span>{followerCount} người theo dõi</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl px-4 py-3 flex items-center gap-5 border border-white/15">
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-white tabular-nums flex items-center gap-1 justify-center">
                  <span>
                    {stats.averageRating !== null
                      ? stats.averageRating.toFixed(1)
                      : "Chưa có"}
                  </span>
                  <Star
                    size={14}
                    className="text-amber-400"
                    fill={stats.averageRating !== null ? "currentColor" : "none"}
                  />
                </p>
                <p className="text-[11px] text-slate-300">Đánh giá</p>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
                  {typeof stats.recommendPercent === "number"
                    ? `${stats.recommendPercent}%`
                    : "—"}
                </p>
                <p className="text-[11px] text-slate-300">Khuyên làm việc</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/95 hover:bg-white text-text-primary rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Camera size={15} />
              <span>Quản lý ảnh các Section ({totalSectionMedia})</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- 4. NỘI DUNG 2 CỘT CHÍNH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === CỘT TRÁI (2/3) === */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "general" && (
            <>
              {/* KHỐI 1: GIỚI THIỆU CÔNG TY (RICH TEXT + XEM TRƯỚC) */}
              <RichTextSectionEditor
                id="company-moTa"
                title="Giới thiệu công ty"
                label="Tóm tắt tiểu sử & Năng lực doanh nghiệp"
                value={companyForm.moTa || ""}
                onChange={(nextValue) =>
                  setCompanyForm((prev) => ({ ...prev, moTa: nextValue }))
                }
                placeholder="Nhập giới thiệu về công ty, sản phẩm chủ lực, định hướng phát triển..."
                rows={6}
                icon={<Building2 size={17} className="text-primary shrink-0" />}
                footerSlot={
                  <div className="pt-2 border-t border-border-default flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-text-secondary font-medium">
                      <Images size={14} className="text-primary" />
                      Đang gắn{" "}
                      <strong className="text-text-primary tabular-nums">
                        {sectionImages.introImages.length}/8
                      </strong>{" "}
                      ảnh không gian cho section Giới thiệu công ty
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("media")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Quản lý ảnh Giới thiệu →
                    </button>
                  </div>
                }
              />

              {/* KHỐI 2: LĨNH VỰC HOẠT ĐỘNG TRỌNG TÂM */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-border-default pb-3.5">
                  <h3 className="flex-1 min-w-0 border-l-4 border-primary pl-3.5 pr-5 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base flex items-center gap-2">
                    <Briefcase size={17} className="text-primary shrink-0" />
                    <span>Lĩnh vực hoạt động trọng tâm</span>
                  </h3>
                  <span className="text-xs text-text-muted tabular-nums">
                    {sectorsLength}/150 ký tự
                  </span>
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
                          onClick={() =>
                            setSectors(sectors.filter((_, i) => i !== idx))
                          }
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

              {/* KHỐI 3: THÔNG TIN CHUNG CHUẨN HÓA (HIỂN THỊ 1 DÒNG TRÊN DETAIL COMPANY) */}
              <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-4">
                <div className="border-b border-dashed border-border-default pb-3.5">
                  <h3 className="border-l-4 border-primary pl-3.5 pr-5 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base">
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          tenCongTy: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          tenPhapLy: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          moHinhCongTy: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          quyMo: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          quocGia: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          thoiGianLamViec: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          chinhSachOT: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          thanhPho: e.target.value,
                        }))
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
                        setCompanyForm((prev) => ({
                          ...prev,
                          diaChi: e.target.value,
                        }))
                      }
                      placeholder="Số nhà, đường, quận/huyện..."
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "culture" && (
            <>
              {/* CARD 1: GIẢI THƯỞNG (MÀU VÀNG ẤM KHỚP DETAIL COMPANY) */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-linear-to-br from-amber-50/90 via-[#fffaf0] to-orange-50/75 p-6 space-y-4">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -bottom-6 text-amber-500/10"
                >
                  <Award size={160} strokeWidth={1.2} />
                </div>

                <div className="relative flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-amber-800 flex items-center gap-2">
                    <Award size={18} className="text-amber-600" />
                    <span>Giải thưởng &amp; Ghi nhận</span>
                  </h3>
                  <span className="text-xs font-medium text-amber-800/80 tabular-nums">
                    {serializedAwardsLength}/255 ký tự
                  </span>
                </div>

                {awardsList.length === 0 ? (
                  <p className="relative text-xs text-amber-900/75 italic bg-surface-card/75 px-4 py-3 rounded-lg border border-amber-200/70">
                    Chưa có giải thưởng nào. Hãy thêm thành tựu để hiển thị khối
                    Giải thưởng nổi bật trên trang công ty.
                  </p>
                ) : (
                  <div className="relative space-y-2">
                    {awardsList.map((awardTitle, idx) => (
                      <div
                        key={`${awardTitle}-${idx}`}
                        className="flex items-center justify-between gap-3 bg-surface-card px-4 py-3 rounded-lg border border-amber-200/80 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                            <Award size={14} />
                          </div>
                          <span className="text-sm font-semibold text-text-primary truncate">
                            {awardTitle}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAwardsList(awardsList.filter((_, i) => i !== idx))
                          }
                          aria-label={`Xóa giải thưởng ${awardTitle}`}
                          className="p-1 text-text-muted hover:text-danger transition shrink-0"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newAwardInput}
                    onChange={(e) => setNewAwardInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAward();
                      }
                    }}
                    placeholder="VD: Công ty IT tốt nhất Việt Nam 2026"
                    className="flex-1 px-3.5 py-2 border border-amber-200 rounded-lg text-sm bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAward}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition shrink-0"
                  >
                    <Plus size={15} />
                    <span>Thêm giải thưởng</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: CHUYÊN MÔN CỦA CHÚNG TÔI */}
              <RichTextSectionEditor
                id="company-chuyenMon"
                title="Chuyên môn của chúng tôi"
                label="Năng lực công nghệ & Stack kỹ thuật (Nhập danh sách cách nhau bằng dấu phẩy hoặc HTML <ul><li>)"
                value={companyForm.chuyenMon || ""}
                onChange={(nextValue) =>
                  setCompanyForm((prev) => ({ ...prev, chuyenMon: nextValue }))
                }
                placeholder="Java, Microservices, ReactJS, TypeScript, Kubernetes, AWS"
                rows={4}
                previewRenderer={(rawValue) =>
                  rawValue.includes("<") ? (
                    <div
                      className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: rawValue }}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {rawValue
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-light text-primary border border-primary-subtle"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )
                }
              />

              {/* CARD 3: PHÚC LỢI & ĐÃI NGỘ */}
              <RichTextSectionEditor
                id="company-phucLoi"
                title="Phúc lợi & Đãi ngộ"
                label="Chính sách lương thưởng, bảo hiểm và đãi ngộ nhân viên"
                value={companyForm.phucLoi || ""}
                onChange={(nextValue) =>
                  setCompanyForm((prev) => ({ ...prev, phucLoi: nextValue }))
                }
                placeholder="Lương tháng 13, thưởng hiệu suất, bảo hiểm sức khỏe cao cấp, du lịch công ty..."
                rows={6}
                icon={<Sparkles size={17} className="text-primary shrink-0" />}
                footerSlot={
                  <div className="pt-2 border-t border-border-default flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-text-secondary font-medium">
                      <Images size={14} className="text-primary" />
                      Đang gắn{" "}
                      <strong className="text-text-primary tabular-nums">
                        {sectionImages.cultureImages.length}/8
                      </strong>{" "}
                      ảnh hoạt động văn hóa
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("media")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Quản lý ảnh Văn hóa →
                    </button>
                  </div>
                }
              />

              {/* CARD 4: VĂN HÓA & CON NGƯỜI (ABOUT ME RICH TEXT) */}
              <RichTextSectionEditor
                id="company-aboutMe"
                title="Văn hóa & Con người"
                label="Môi trường làm việc, con người và giá trị cốt lõi (Hiển thị tại mục Văn hóa & Con người)"
                value={companyForm.aboutMe || ""}
                onChange={(nextValue) =>
                  setCompanyForm((prev) => ({ ...prev, aboutMe: nextValue }))
                }
                placeholder="Chia sẻ môi trường kỹ sư, tinh thần teamwork và cơ hội phát triển tại công ty..."
                rows={5}
                icon={<Users size={17} className="text-primary shrink-0" />}
              />
            </>
          )}

          {activeTab === "media" && (
            <SectionMediaPanel
              sectionImages={sectionImages}
              uploadingTarget={uploadingTarget}
              onUploadFiles={handleUploadSectionFiles}
              onUpdateImages={(field, nextList) =>
                setSectionImages((prev) => ({ ...prev, [field]: nextList }))
              }
            />
          )}

          {activeTab === "branches" && (
            <CompanyBranchesManager
              branchesList={branchesList}
              selectedBranchKey={selectedBranchKey}
              mainAddress={companyForm.diaChi || ""}
              citiesPreview={citiesPreview}
              geocodingKey={geocodingKey}
              onSelectBranch={setSelectedBranchKey}
              onAddBranch={handleAddBranch}
              onUpdateBranch={handleUpdateBranch}
              onRemoveBranch={handleRemoveBranch}
              onLookupCoords={handleLookupCoords}
              onSetHeadquarters={handleSetHeadquarters}
            />
          )}

          {activeTab === "posts" && <CompanyPostsManager posts={posts} />}

          {activeTab === "reviews" && (
            <CompanyReviewsSummaryTab
              slug={companyForm.slug || company.slug}
              companyName={
                companyForm.tenCongTy || company.tenCongTy || "Công ty"
              }
              stats={stats}
              reviews={reviews}
            />
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
              <div className="space-y-2 min-w-0">
                <p className="text-xs font-bold text-text-primary">
                  {missingFields.length > 0
                    ? "Gợi ý tối ưu hồ sơ (Nhấp để bổ sung)"
                    : "Hồ sơ doanh nghiệp đã đầy đủ!"}
                </p>
                {missingFields.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {missingFields.slice(0, 5).map((field) => {
                      const meta = MISSING_FIELD_META[field];
                      return (
                        <button
                          key={field}
                          type="button"
                          onClick={() => {
                            if (field === "logoUrl") {
                              logoInputRef.current?.click();
                            } else {
                              setActiveTab(meta?.tab ?? "general");
                            }
                          }}
                          className="px-2 py-1 rounded-md bg-surface-card hover:bg-primary text-text-secondary hover:text-white border border-primary-subtle text-[11px] font-semibold transition"
                        >
                          + {meta?.label ?? field}
                        </button>
                      );
                    })}
                    {missingFields.length > 5 && (
                      <span className="text-[11px] text-text-muted self-center">
                        +{missingFields.length - 5} mục khác
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Hồ sơ công ty đạt 100% thông tin chuẩn giúp tăng uy tín với
                    ứng viên IT.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* TỔNG QUAN HIỂN THỊ TRÊN DETAIL COMPANY */}
          <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                <h3 className="font-bold text-text-primary text-base">
                  Đồng bộ trang công khai
                </h3>
              </div>
              <Link
                href={`/company/${companyForm.slug || company.slug}`}
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mở trang →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-lg bg-surface-page border border-border-default p-3">
                <p className="text-text-muted mb-0.5">Việc làm đang mở</p>
                <p className="font-bold text-text-primary text-sm tabular-nums">
                  {activeJobsCount} vị trí
                </p>
              </div>
              <div className="rounded-lg bg-surface-page border border-border-default p-3">
                <p className="text-text-muted mb-0.5">Bài viết công ty</p>
                <p className="font-bold text-text-primary text-sm tabular-nums">
                  {posts.length} bài viết
                </p>
              </div>
              <div className="rounded-lg bg-surface-page border border-border-default p-3">
                <p className="text-text-muted mb-0.5">Ảnh các Section</p>
                <p className="font-bold text-text-primary text-sm tabular-nums">
                  {totalSectionMedia}/16 ảnh
                </p>
              </div>
              <div className="rounded-lg bg-surface-page border border-border-default p-3">
                <p className="text-text-muted mb-0.5">Người theo dõi</p>
                <p className="font-bold text-primary text-sm tabular-nums">
                  {followerCount} ứng viên
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <Link
                href="/employer-jobs"
                className="text-primary font-semibold hover:underline"
              >
                Quản lý việc làm
              </Link>
              <Link
                href="/post-job"
                className="text-primary font-semibold hover:underline"
              >
                + Đăng tin tuyển dụng
              </Link>
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
                branchesList.map((branch) => {
                  const isHq =
                    normalizedMainAddress !== "" &&
                    branch.diaChi.trim().toLowerCase() ===
                      normalizedMainAddress;
                  return (
                    <button
                      key={branch.localKey}
                      type="button"
                      onClick={() => {
                        setSelectedBranchKey(branch.localKey);
                        setActiveTab("branches");
                      }}
                      className="w-full text-left p-3.5 bg-surface-page hover:border-primary/60 border border-border-default rounded-xl space-y-1 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-text-primary uppercase tracking-wide">
                          {isHq ? "TRỤ SỞ CHÍNH" : "CHI NHÁNH"} (
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
                    </button>
                  );
                })
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

      {/* Thanh nhắc thay đổi chưa lưu */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl rounded-xl border border-warning-border bg-surface-card/95 backdrop-blur-md px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium text-text-primary">
            Bạn có thay đổi chưa được lưu lên trang công khai.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onResetFromServer}
              className="px-3 py-1.5 rounded-lg border border-border-default text-xs font-semibold text-text-secondary hover:bg-surface-muted transition"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isUpdating}
              className="px-3.5 py-1.5 rounded-lg bg-primary-light hover:bg-primary-subtle text-primary border border-primary-subtle text-xs font-semibold transition"
            >
              Cập nhật ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
