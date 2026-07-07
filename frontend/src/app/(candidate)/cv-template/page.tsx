"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Loader2,
  LayoutTemplate,
  CheckCircle2,
  Eye,
  Download,
} from "lucide-react";

import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import CVTemplate from "@/components/candidate/CVTemplate";

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
    component: CVTemplate,
  },
  {
    id: "toi_gian",
    name: "Tối giản",
    color: "text-slate-800",
    image: "https://placehold.co/300x420/1e293b/ffffff?text=Toi+Gian",
    component: CVTemplate,
  },
];

export default function CandidateCVTemplatePage() {
  const { candidateProfile: profile, isLoading } = useCandidateProfile();

  // State quản lý việc chọn mẫu CV và trạng thái tạo file
  const [activeTemplateId, setActiveTemplateId] =
    useState<string>("truyen_thong");
  const [isGenerating, setIsGenerating] = useState(false);

  // Màn hình Loading khi đang fetch dữ liệu Profile
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Đang tải dữ liệu hồ sơ của bạn...</p>
      </div>
    );
  }

  // Lấy ra Template đang được chọn
  const activeTemplateObj =
    CV_TEMPLATES.find((t) => t.id === activeTemplateId) || CV_TEMPLATES[0];
  const ActiveCVComponent = activeTemplateObj.component;

  // ==========================================
  // HÀM XỬ LÝ: TẠO PDF VÀ MỞ TAB MỚI / TẢI XUỐNG
  // ==========================================
  const handlePdfAction = async (action: "preview" | "download") => {
    if (!profile) return;

    try {
      setIsGenerating(true);

      // 1. Dùng hàm pdf() để render component thành file ngầm
      const doc = <ActiveCVComponent data={profile} />;
      const asPdf = pdf(doc);

      // 2. Biến file ngầm đó thành định dạng Blob (Binary Large Object)
      const blob = await asPdf.toBlob();

      // 3. Tạo một đường link ảo trên trình duyệt
      const url = URL.createObjectURL(blob);

      if (action === "preview") {
        // Mở link ảo sang tab mới (Không revoke URL để tab mới có thể đọc được file)
        window.open(url, "_blank");
      } else {
        // Tạo thẻ a ẩn để ép tải xuống
        const link = document.createElement("a");
        link.href = url;
        link.download = `CV_${activeTemplateObj.name}_${profile.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Dọn dẹp bộ nhớ sau khi tải xong
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error(
        `Lỗi khi ${action === "preview" ? "xem trước" : "tải"} PDF:`,
        error,
      );
      alert("Có lỗi xảy ra khi xử lý file PDF. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* HEADER & BREADCRUMB */}
      <div className="mb-6 border-b border-slate-200 pb-6">
        <Link
          href="/cv-profile"
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

        {/* CỘT PHẢI: KHUNG THAO TÁC & PREVIEW ẢNH */}
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
                onClick={() => handlePdfAction("preview")}
                disabled={isGenerating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Eye size={18} />
                )}
                Xem trước
              </button>

              <button
                onClick={() => handlePdfAction("download")}
                disabled={isGenerating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                Tải xuống
              </button>
            </div>
          </div>

          {/* Vùng hiển thị ảnh minh họa mẫu to */}
          <div className="w-full bg-white rounded-xl p-8 flex items-center justify-center border border-slate-200 shadow-sm relative overflow-hidden min-h-[500px]">
            {/* Phông nền màu mờ mờ khớp với mẫu đang chọn */}
            <div
              className={`absolute inset-0 opacity-[0.03] ${activeTemplateObj.color.replace("text-", "bg-")}`}
            ></div>

            <div className="relative z-10 w-full max-w-100 shadow-2xl rounded-sm overflow-hidden border border-slate-200/50 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeTemplateObj.image}
                alt={activeTemplateObj.name}
                className="w-full h-auto object-cover opacity-30 blur-[2px]"
              />

              {/* Box render giả lập thay thế nội dung thật vào ảnh */}
              <div className="absolute inset-0 p-8">
                {profile && <ActiveCVComponent data={profile} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
