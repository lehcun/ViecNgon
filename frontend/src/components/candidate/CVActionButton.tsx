import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import CVTemplate from "./CVTemplate";
import { CandidateProfileResponse } from "@viecngon/types";

export default function CVActionButtons({
  data,
}: {
  data: CandidateProfileResponse;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  // HÀM 1: XỬ LÝ KHI BẤM "XEM TRƯỚC" (Mở Tab mới)
  const handlePreview = async () => {
    try {
      setIsGenerating(true);

      // 1. Dùng hàm pdf() để render component thành file ngầm
      const doc = <CVTemplate data={data} />;
      const asPdf = pdf(doc);

      // 2. Biến file ngầm đó thành định dạng Blob (Binary Large Object)
      const blob = await asPdf.toBlob();

      // 3. Tạo một đường link ảo trên trình duyệt
      const url = URL.createObjectURL(blob);

      // 4. Mở link ảo đó sang một tab mới để user xem trước
      window.open(url, "_blank");
    } catch (error) {
      console.error("Lỗi khi tạo PDF Preview:", error);
      alert("Có lỗi xảy ra khi tạo bản xem trước.");
    } finally {
      setIsGenerating(false);
    }
  };

  // HÀM 2: XỬ LÝ KHI BẤM "TẢI XUỐNG" (Tải thẳng về máy)
  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      const doc = <CVTemplate data={data} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);

      // Tạo một thẻ <a> ẩn để ép trình duyệt tải file xuống
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_${data.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp thẻ <a> sau khi tải xong
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải PDF:", error);
      alert("Có lỗi xảy ra khi tải file.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 w-fit">
      {/* Nút Xem trước */}
      <button
        onClick={handlePreview}
        disabled={isGenerating}
        className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Đang xử lý..." : "Xem trước CV"}
      </button>

      {/* Nút Tải xuống */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Đang xử lý..." : "Tải xuống ngay"}
      </button>
    </div>
  );
}
