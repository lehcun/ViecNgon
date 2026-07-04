"use client";
import React, { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { PDFDownloadLink } from "@react-pdf/renderer";
import CVTemplate from "./CVTemplate";
import { CandidateProfileResponse } from "@viecngon/types";

interface DownloadCVButtonProps {
  profileData: CandidateProfileResponse | null; // Cục JSON Profile lấy từ backend
}

export default function DownloadCVButton({
  profileData,
}: DownloadCVButtonProps) {
  // Tránh lỗi Hydration của Next.js SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-500 rounded-lg font-medium cursor-not-allowed"
      >
        <Loader2 size={18} className="animate-spin" />
        Đang tải công cụ in...
      </button>
    );
  }

  return (
    // PDFDownloadLink sẽ tự động vẽ component CVTemplate ngầm bên dưới
    <PDFDownloadLink
      document={<CVTemplate data={profileData} />}
      fileName={`CV_${profileData?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
    >
      {({ loading }: any) =>
        loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Đang tạo PDF...
          </>
        ) : (
          <>
            <Download size={18} />
            Tải CV dạng PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}
