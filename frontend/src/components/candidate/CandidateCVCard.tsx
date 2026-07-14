"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  ChevronRight,
  FileText,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
// Đảm bảo đường dẫn này trỏ đến đúng file hook của bạn
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";

// Helper chuyển đổi ngày (giống trong CVTemplate)
const formatDateToLocal = (dateString: string | null | Date) => {
  if (!dateString) return "Không xác định";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không xác định";
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return "Không xác định";
  }
};

export default function CandidateCVCard() {
  const { candidateProfile: profile, isLoading } = useCandidateProfile(); // Lấy profile từ hook
  const [isHovered, setIsHovered] = useState(false);

  // Loading skeleton mỏng nhẹ nếu đang lấy dữ liệu
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm h-62.5 animate-pulse flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
        <div className="w-48 h-4 bg-slate-200 rounded mb-2"></div>
        <div className="w-32 h-3 bg-slate-200 rounded"></div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP 1: CHƯA CÓ CV ---
  // Kiểm tra dựa trên schema UngVien:
  // - maFileCvMacDinh có giá trị (tức là đã chọn CV mặc định)
  // - Hoặc cvUrl có giá trị (trường hợp CV upload cũ)
  const hasCV = profile?.defaultCvFileId || profile?.cvUrl;

  if (!hasCV) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Hồ sơ đính kèm của bạn
          </h2>
        </div>

        <div className="flex-1 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/50 hover:bg-primary-light/20 cursor-pointer group">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud
              size={32}
              className="text-slate-300 group-hover:text-primary transition-colors"
            />
          </div>
          <p className="text-slate-600 mb-4 max-w-sm text-sm">
            Bạn chưa đính kèm CV. Tải lên CV của bạn để tối ưu hoá quá trình tìm
            việc và nhận gợi ý phù hợp nhất.
          </p>
          <Link
            href="/candidate/cv-builder" // Trỏ về trang Studio tạo CV
            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline text-sm"
          >
            Quản lý hồ sơ đính kèm <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP 2: ĐÃ CÓ CV (Hiển thị giống hình ảnh) ---

  // Nếu tìm thấy file trong mảng thì lấy tên, không thì sinh tên mặc định
  const defaultCv = profile?.defaultCvFile;

  const cvName =
    defaultCv?.fileName ||
    `CV_ViecNgon_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;

  const uploadDate = formatDateToLocal(
    defaultCv?.uploadedAt || new Date().toISOString(),
  );

  const fileUrl = defaultCv?.fileUrl || profile?.cvUrl || "#";

  const cvType =
    profile?.defaultCvType === "ONLINE" ? "Tạo từ Website" : "Tải lên từ máy";

  // Hàm xử lý Mở CV (Mở tab mới)
  const handleOpenCV = () => {
    if (fileUrl && fileUrl !== "#") {
      window.open(fileUrl, "_blank");
    } else {
      alert("Đường dẫn file chưa sẵn sàng!");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800">
          Hồ sơ đính kèm của bạn
        </h2>
        <Link
          href="/candidate/cv-builder" // Link tới trang tạo/quản lý CV
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
        >
          Quản lý CV <ChevronRight size={14} />
        </Link>
      </div>

      {/* Box hiển thị file CV */}
      <div
        className={`relative border rounded-xl transition-all duration-200 ${
          isHovered
            ? "border-primary shadow-md bg-blue-50/20"
            : "border-slate-200 bg-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-5 flex items-start gap-4">
          {/* Icon File PDF */}
          <div className="w-12 h-14 bg-rose-100 text-rose-500 rounded flex flex-col items-center justify-center shrink-0 border border-rose-200">
            <FileText size={24} />
            <span className="text-[9px] font-bold mt-1 uppercase">PDF</span>
          </div>

          {/* Thông tin File */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-bold text-slate-800 text-base truncate cursor-pointer hover:text-primary transition-colors"
                onClick={handleOpenCV}
                title={cvName}
              >
                {cvName}
              </h3>
              {/* Badge CV Chính */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                <CheckCircle2 size={12} />
                CV Chính
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              Cập nhật lần cuối:{" "}
              <span className="font-medium text-slate-700">{uploadDate}</span>
            </p>
            <p className="text-xs text-slate-400">
              Loại: <span className="font-medium">{cvType}</span>
            </p>
          </div>

          {/* Nút 3 chấm (Dropdown/Menu) */}
          <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Thanh công cụ khi Hover */}
        <div
          className={`flex items-center justify-end gap-2 px-4 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            onClick={handleOpenCV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye size={16} /> Xem
          </button>

          <a
            href={fileUrl}
            download={cvName}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Download size={16} /> Tải xuống
          </a>

          {/* Nút Xóa (Sẽ cần API để gỡ CV mặc định) */}
          <button
            onClick={() => alert("Tính năng xóa đang được phát triển")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-rose-500 hover:bg-rose-100 transition-colors ml-auto"
          >
            <Trash2 size={16} /> Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
