"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  LayoutTemplate,
  CheckCircle2,
  Eye,
  Download,
  Save,
  Lock,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import {
  calculateProfileCompletion,
  MIN_PROFILE_COMPLETION_FOR_CV,
} from "@/lib/candidate-completion";

import CVTemplate from "@/components/candidate/cv-template/CVTemplate";
import CVTemplateFormat from "@/components/candidate/cv-template/CVTemplateFormat";
import CVTemplateMinimal from "@/components/candidate/cv-template/CVTemplateMinimal";
import toast from "react-hot-toast";
import { useUploadGeneratedCv } from "@/hooks/candidate/useUploadGeneratedCv";

// Danh sách các mẫu CV để render ra thanh Sidebar bên trái
const CV_TEMPLATES = [
  {
    id: "truyen_thong",
    name: "Truyền thống",
    color: "text-blue-600",
    image: "https://placehold.co/300x420/2563eb/ffffff?text=Truyen+Thong",
    component: CVTemplate,
  },
  {
    id: "hien_dai",
    name: "Hiện đại",
    color: "text-teal-600",
    image: "https://placehold.co/300x420/0f766e/ffffff?text=Hien+Dai",
    component: CVTemplateFormat,
  },
  {
    id: "toi_gian",
    name: "Tối giản",
    color: "text-slate-800",
    image: "https://placehold.co/300x420/1e293b/ffffff?text=Toi+Gian",
    component: CVTemplateMinimal,
  },
];

export default function CandidateCVTemplatePage() {
  const { candidateProfile: profile, isLoading } = useCandidateProfile();
  const { mutateAsync: uploadCv, isPending: isUploading } =
    useUploadGeneratedCv();

  // States
  const [isMounted, setIsMounted] = useState(false);
  const [activeTemplateId, setActiveTemplateId] =
    useState<string>("truyen_thong");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const profileCompletion = calculateProfileCompletion(profile);
  const isEligibleForCv =
    profileCompletion >= MIN_PROFILE_COMPLETION_FOR_CV;

  const handleSetDefault = async () => {
    if (!isEligibleForCv) {
      toast.error(
        `Hồ sơ hiện đạt ${profileCompletion}%. Cần hoàn thiện tối thiểu ${MIN_PROFILE_COMPLETION_FOR_CV}% để tạo và lưu CV.`,
      );
      return;
    }

    try {
      // 1. TẠO FILE PDF NGẦM NGAY KHI BẤM NÚT
      const doc = <ActiveCVComponent data={profile ?? null} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();

      // 2. CHUYỂN ĐỔI THÀNH ĐỐI TƯỢNG FILE
      const fileName = `CV_ViecNgon_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      // 3. GÓI VÀO FORMDATA (Lúc này biến "file" đã tồn tại)
      const formData = new FormData();
      formData.append("file", file);

      // 4. BẮN API QUA HOOK
      await uploadCv(formData);

      toast.success("🎉 Đã lưu CV làm mặc định thành công!");
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Không thể lưu CV. Vui lòng thử lại.";
      toast.error(msg);
    }
  };

  // Tránh lỗi Hydration trên Next.js SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lấy ra Template đang được chọn
  const activeTemplateObj =
    CV_TEMPLATES.find((t) => t.id === activeTemplateId) || CV_TEMPLATES[0];
  const ActiveCVComponent = activeTemplateObj.component;

  // ==========================================
  // EFFECT: TỰ ĐỘNG TẠO FILE PDF (BLOB) KHI CHỌN MẪU
  // ==========================================
  useEffect(() => {
    // Chỉ chạy khi đã có dữ liệu profile >= 70% và render trên Client
    if (!profile || !isMounted || !isEligibleForCv) return;

    let isCancelled = false;
    let objectUrl: string | null = null;

    const generatePreview = async () => {
      setIsPreviewLoading(true);
      try {
        // Dùng react-pdf render component thành dữ liệu nhị phân (Blob)
        const doc = <ActiveCVComponent data={profile} />;
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();

        if (!isCancelled) {
          objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
        }
      } catch (error) {
        console.error("Lỗi khi tạo bản xem trước PDF:", error);
      } finally {
        if (!isCancelled) setIsPreviewLoading(false);
      }
    };

    void generatePreview();

    // Dọn dẹp bộ nhớ (Thu hồi URL) khi component unmount hoặc đổi mẫu khác
    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profile, activeTemplateId, isMounted, isEligibleForCv, ActiveCVComponent]);

  const effectivePreviewUrl = isEligibleForCv ? previewUrl : null;

  // ==========================================
  // HÀM XỬ LÝ: MỞ TAB MỚI / TẢI XUỐNG
  // ==========================================
  const handlePdfAction = (action: "preview" | "download") => {
    if (!isEligibleForCv || !effectivePreviewUrl) return;

    if (action === "preview") {
      window.open(effectivePreviewUrl, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = effectivePreviewUrl;
      link.download = `CV_${activeTemplateObj.name}_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Màn hình Skeleton Loading khi đang fetch dữ liệu Profile
  if (isLoading || !isMounted) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-page min-h-screen animate-pulse">
        <div className="mb-6 border-b border-border-default pb-6 space-y-3">
          <div className="h-4 w-32 bg-surface-subtle rounded" />
          <div className="h-8 w-72 bg-surface-subtle rounded" />
          <div className="h-4 w-96 max-w-full bg-surface-subtle rounded" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-80 shrink-0 bg-surface-card p-5 rounded-xl border border-border-default space-y-4">
            <div className="h-6 w-40 bg-surface-subtle rounded" />
            <div className="h-56 bg-surface-subtle rounded-xl" />
            <div className="h-56 bg-surface-subtle rounded-xl" />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="h-20 bg-surface-card rounded-xl border border-border-default" />
            <div className="min-h-150 bg-surface-card rounded-xl border border-border-default" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface-page min-h-screen">
      {/* HEADER & BREADCRUMB */}
      <div className="mb-6 border-b border-border-default pb-6">
        <Link
          href="/cv-profile"
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Quay lại Hồ sơ
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          Trình tạo CV chuẩn ATS
        </h1>
        <p className="text-text-secondary mt-1">
          Lựa chọn mẫu CV phù hợp với phong cách của bạn. Dữ liệu đã được tự
          động đồng bộ từ hồ sơ trực tuyến.
        </p>
      </div>

      {/* KHU VỰC STUDIO */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* CỘT TRÁI: DANH SÁCH MẪU CV */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <div className="bg-surface-card p-5 rounded-xl border border-border-default shadow-xs h-full">
            <div className="flex items-center gap-2 mb-4 text-base font-bold text-text-main border-b border-border-subtle pb-3">
              <LayoutTemplate size={20} className="text-primary" />
              <span>Thư viện Mẫu CV</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto max-h-175 pr-1 pb-4">
              {CV_TEMPLATES.map((template) => {
                const isActive = activeTemplateId === template.id;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setActiveTemplateId(template.id)}
                    className={`group relative text-left rounded-xl transition-all duration-200 overflow-hidden outline-none ${
                      isActive
                        ? "ring-2 ring-primary ring-offset-2 shadow-md bg-primary-light/50"
                        : "border border-border-default hover:border-primary/50 hover:shadow-xs bg-surface-card"
                    }`}
                  >
                    <div className="aspect-[1/1.4] w-full bg-surface-muted relative overflow-hidden border-b border-border-subtle">
                      <Image
                        src={template.image}
                        alt={template.name}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 50vw, 320px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-surface-card rounded-full text-primary shadow-xs">
                          <CheckCircle2 size={20} className="fill-surface-card" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p
                        className={`font-semibold text-sm ${isActive ? "text-primary" : "text-text-secondary"}`}
                      >
                        {template.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full bg-current ${template.color}`}
                        ></div>
                        <span className="text-xs text-text-muted">
                          Giao diện chuẩn ATS
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG THAO TÁC & PREVIEW IFRAME */}
        <div className="w-full flex-1 flex flex-col gap-6">
          {/* Thanh công cụ hành động */}
          <div className="bg-surface-card p-5 rounded-xl border border-border-default shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-text-muted">Mẫu đang chọn</p>
              <h3 className="font-bold text-xl text-text-main">
                {activeTemplateObj.name}
              </h3>
            </div>

            {/* 3 Nút Bấm Action */}
            <div className="flex w-full sm:w-auto gap-3">
              <button
                type="button"
                onClick={() => handleSetDefault()}
                disabled={
                  !isEligibleForCv ||
                  isPreviewLoading ||
                  !effectivePreviewUrl ||
                  isUploading
                }
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-card text-primary border border-primary hover:bg-primary-light rounded-xl font-medium transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                Chọn mẫu này
              </button>
              <button
                type="button"
                onClick={() => handlePdfAction("preview")}
                disabled={
                  !isEligibleForCv ||
                  isPreviewLoading ||
                  !effectivePreviewUrl ||
                  isUploading
                }
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-card text-primary border border-primary hover:bg-primary-light rounded-xl font-medium transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={18} />
                Phóng to
              </button>

              <button
                type="button"
                onClick={() => handlePdfAction("download")}
                disabled={
                  !isEligibleForCv ||
                  isPreviewLoading ||
                  !effectivePreviewUrl ||
                  isUploading
                }
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Tải xuống
              </button>
            </div>
          </div>

          {/* Vùng hiển thị LIVE PREVIEW hoặc Khóa khi dưới 70% */}
          <div className="w-full bg-surface-subtle/60 rounded-xl flex items-center justify-center border border-border-default shadow-inner relative overflow-hidden min-h-150 h-[calc(100vh-200px)]">
            {!isEligibleForCv ? (
              <div className="max-w-md mx-4 bg-surface-card border border-warning-border rounded-2xl p-6 sm:p-8 text-center shadow-sm space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-warning-light text-warning-text border border-warning-border flex items-center justify-center">
                  <Lock size={26} />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-warning-light text-warning-text border border-warning-border tabular-nums">
                    Hồ sơ hiện đạt {profileCompletion}% / {MIN_PROFILE_COMPLETION_FOR_CV}%
                  </span>
                  <h2 className="text-lg font-bold text-text-main">
                    Cần hoàn thiện tối thiểu {MIN_PROFILE_COMPLETION_FOR_CV}% hồ
                    sơ để tạo và xem CV
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Hãy bổ sung thêm thông tin cá nhân, giới thiệu bản thân, học
                    vấn, kinh nghiệm hoặc kỹ năng để mở khóa xem trước, tải xuống
                    và sử dụng CV mẫu này khi ứng tuyển.
                  </p>
                </div>
                <div className="w-full h-2.5 bg-surface-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((profileCompletion / MIN_PROFILE_COMPLETION_FOR_CV) * 100))}%`,
                    }}
                  />
                </div>
                <Link
                  href="/cv-profile"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
                >
                  Hoàn thiện hồ sơ ngay
                </Link>
              </div>
            ) : isPreviewLoading ? (
              <div className="flex flex-col items-center text-text-muted">
                <Loader2 size={36} className="animate-spin mb-4 text-primary" />
                <p className="font-medium">Đang tạo bản xem trước PDF...</p>
              </div>
            ) : effectivePreviewUrl ? (
              <iframe
                src={`${effectivePreviewUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none rounded-xl bg-slate-500"
                title="CV Preview"
              />
            ) : (
              <div className="text-text-muted">Không thể tải bản xem trước</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
