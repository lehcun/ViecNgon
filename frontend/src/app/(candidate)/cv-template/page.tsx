"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  LayoutTemplate,
  CheckCircle2,
  Eye,
  Download,
  Save,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";

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

  const handleSetDefault = async () => {
    try {
      // 1. TẠO FILE PDF NGẦM NGAY KHI BẤM NÚT
      const doc = <ActiveCVComponent data={profile} />;
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
    } catch (error: any) {
      toast.error(error.message || "Không thể lưu CV. Vui lòng thử lại.");
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
    // Chỉ chạy khi đã có dữ liệu profile và render trên Client
    if (!profile || !isMounted) return;

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

    generatePreview();

    // Dọn dẹp bộ nhớ (Thu hồi URL) khi component unmount hoặc đổi mẫu khác
    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profile, activeTemplateId, isMounted]);

  // ==========================================
  // HÀM XỬ LÝ: MỞ TAB MỚI / TẢI XUỐNG
  // ==========================================
  const handlePdfAction = (action: "preview" | "download") => {
    if (!previewUrl) return;

    if (action === "preview") {
      window.open(previewUrl, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = `CV_${activeTemplateObj.name}_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Màn hình Loading khi đang fetch dữ liệu Profile
  if (isLoading || !isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Đang khởi tạo trình tạo CV...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* HEADER & BREADCRUMB */}
      <div className="mb-6 border-b border-slate-200 pb-6">
        <Link
          href="/candidate/profile"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Quay lại Hồ sơ
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Trình tạo CV chuẩn ATS
        </h1>
        <p className="text-slate-600 mt-1">
          Lựa chọn mẫu CV phù hợp với phong cách của bạn. Dữ liệu đã được tự
          động đồng bộ từ hồ sơ trực tuyến.
        </p>
      </div>

      {/* KHU VỰC STUDIO */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* CỘT TRÁI: DANH SÁCH MẪU CV */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-4 text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              <LayoutTemplate size={20} className="text-primary" />
              <span>Thư viện Mẫu CV</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto max-h-175 pr-1 pb-4">
              {CV_TEMPLATES.map((template) => {
                const isActive = activeTemplateId === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplateId(template.id)}
                    className={`group relative text-left rounded-xl transition-all duration-200 overflow-hidden outline-none ${
                      isActive
                        ? "ring-2 ring-primary ring-offset-2 shadow-md bg-blue-50/50"
                        : "border border-slate-200 hover:border-primary/50 hover:shadow-sm bg-white"
                    }`}
                  >
                    <div className="aspect-[1/1.4] w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-white rounded-full text-primary shadow-sm">
                          <CheckCircle2 size={20} className="fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p
                        className={`font-semibold text-sm ${isActive ? "text-primary" : "text-slate-700"}`}
                      >
                        {template.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full bg-current ${template.color}`}
                        ></div>
                        <span className="text-xs text-slate-500">
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
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-slate-500">Mẫu đang chọn</p>
              <h3 className="font-bold text-xl text-slate-800">
                {activeTemplateObj.name}
              </h3>
            </div>

            {/* 2 Nút Bấm Action */}
            <div className="flex w-full sm:w-auto gap-3">
              <button
                onClick={() => handleSetDefault()}
                disabled={isPreviewLoading || !previewUrl || isUploading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                Chọn mẫu này
              </button>
              <button
                onClick={() => handlePdfAction("preview")}
                disabled={isPreviewLoading || !previewUrl || isUploading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={18} />
                Phóng to
              </button>

              <button
                onClick={() => handlePdfAction("download")}
                disabled={isPreviewLoading || !previewUrl || isUploading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Tải xuống
              </button>
            </div>
          </div>

          {/* Vùng hiển thị LIVE PREVIEW bằng Iframe */}
          <div className="w-full bg-slate-200/60 rounded-xl flex items-center justify-center border border-slate-300 shadow-inner relative overflow-hidden min-h-150 h-[calc(100vh-200px)]">
            {isPreviewLoading ? (
              <div className="flex flex-col items-center text-slate-500">
                <Loader2 size={36} className="animate-spin mb-4 text-primary" />
                <p className="font-medium">Đang tạo bản xem trước PDF...</p>
              </div>
            ) : previewUrl ? (
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none rounded-xl bg-slate-500"
                title="CV Preview"
              />
            ) : (
              <div className="text-slate-400">Không thể tải bản xem trước</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
