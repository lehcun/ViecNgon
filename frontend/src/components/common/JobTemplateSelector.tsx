"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Check,
  X,
  FileText,
  AlertTriangle,
  Replace,
  ListPlus,
  Eye,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { JobTemplate } from "@/constants/job-templates";

interface JobTemplateSelectorProps {
  label: string;
  templates: JobTemplate[];
  currentContent: string;
  onApply: (content: string) => void;
}

export default function JobTemplateSelector({
  label,
  templates,
  currentContent,
  onApply,
}: JobTemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<JobTemplate | null>(null);
  const [showConfirmConflict, setShowConfirmConflict] = useState(false);

  // Kiểm tra xem ô soạn thảo hiện tại có nội dung thực sự hay không
  const isContentEmpty = (html: string) => {
    if (!html) return true;
    const stripped = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    return stripped.length === 0;
  };

  const handleSelectTemplate = (template: JobTemplate) => {
    setSelectedTemplate(template);

    // Nếu ô hiện tại đang trống -> áp dụng ngay lập tức
    if (isContentEmpty(currentContent)) {
      onApply(template.content);
      toast.success(`Đã áp dụng mẫu "${template.title}" thành công!`);
      setIsOpen(false);
      setSelectedTemplate(null);
      setPreviewTemplate(null);
    } else {
      // Nếu đã có nội dung -> mở hộp thoại xác nhận thay thế hoặc chèn thêm
      setShowConfirmConflict(true);
    }
  };

  const handleReplaceAll = () => {
    if (!selectedTemplate) return;
    onApply(selectedTemplate.content);
    toast.success(`Đã thay thế toàn bộ bằng mẫu "${selectedTemplate.title}"`);
    closeAllModals();
  };

  const handleAppendToEnd = () => {
    if (!selectedTemplate) return;
    // Chèn thêm vào cuối, ngăn cách bằng thẻ <hr/> hoặc <p></p>
    const combinedContent = `${currentContent.trim()}<br/><hr/><br/>${selectedTemplate.content}`;
    onApply(combinedContent);
    toast.success(`Đã chèn thêm mẫu vào cuối nội dung hiện tại`);
    closeAllModals();
  };

  const closeAllModals = () => {
    setShowConfirmConflict(false);
    setSelectedTemplate(null);
    setPreviewTemplate(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* Nút bấm kích hoạt gợi ý mẫu */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setPreviewTemplate(templates[0] || null);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 active:scale-95 border border-primary/20 rounded-md transition-all cursor-pointer shadow-xs"
        title="Dùng khung nội dung soạn sẵn chuẩn đẹp"
      >
        <Sparkles size={13} className="text-primary animate-pulse" />
        <span>Dùng mẫu gợi ý</span>
      </button>

      {/* ================= MODAL CHỌN MẪU ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Thư viện mẫu gợi ý: {label}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chọn một mẫu được tối ưu chuẩn mực để điền nhanh vào bài đăng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAllModals}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body: Danh sách mẫu & Khung xem trước */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Cột trái: Danh sách các mẫu */}
              <div className="md:col-span-5 p-4 overflow-y-auto space-y-2.5 max-h-[55vh]">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Danh sách gợi ý ({templates.length})
                </p>
                {templates.map((tpl) => {
                  const isCurrentPreview = previewTemplate?.id === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setPreviewTemplate(tpl)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrentPreview
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {tpl.roleBadge}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${
                            isCurrentPreview ? "text-primary translate-x-0.5" : "text-slate-300"
                          }`}
                        />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-1">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Cột phải: Xem trước nội dung chi tiết */}
              <div className="md:col-span-7 p-4 bg-slate-50/50 flex flex-col max-h-[55vh]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Eye size={14} className="text-primary" />
                    <span>Xem trước nội dung</span>
                  </div>
                  {previewTemplate && (
                    <span className="text-xs text-slate-400">
                      Mẫu: {previewTemplate.roleBadge}
                    </span>
                  )}
                </div>

                {previewTemplate ? (
                  <div className="flex-1 overflow-y-auto pr-2 bg-white rounded-xl p-4 border border-slate-200 text-sm text-slate-700 space-y-2">
                    <div
                      className="prose prose-sm max-w-none prose-slate"
                      dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <FileText size={32} className="mb-2 opacity-50" />
                    <span>Chọn một mẫu từ danh sách bên trái để xem trước</span>
                  </div>
                )}

                {/* Footer preview action */}
                <div className="pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    disabled={!previewTemplate}
                    onClick={() => previewTemplate && handleSelectTemplate(previewTemplate)}
                    className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover active:scale-95 rounded-lg shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>Áp dụng mẫu này</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CẢNH BÁO XUNG ĐỘT NỘI DUNG ================= */}
      {showConfirmConflict && selectedTemplate && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-amber-200 animate-in zoom-in-95 duration-150">
            {/* Header cảnh báo */}
            <div className="p-6 text-center border-b border-amber-100 bg-amber-50/60">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Ô soạn thảo đã có nội dung!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Bạn đang chọn mẫu <strong className="text-slate-800">"{selectedTemplate.title}"</strong>. Vui lòng chọn cách áp dụng bên dưới để tránh mất dữ liệu đã nhập:
              </p>
            </div>

            {/* Các lựa chọn hành động */}
            <div className="p-5 space-y-3 bg-white">
              <button
                type="button"
                onClick={handleReplaceAll}
                className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-left transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Replace size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-700">
                    Thay thế toàn bộ nội dung
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Xóa nội dung cũ và ghi đè hoàn toàn bằng mẫu mới.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleAppendToEnd}
                className="w-full p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-left transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ListPlus size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary">
                    Chèn thêm vào cuối
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Giữ nguyên nội dung hiện có và nối tiếp mẫu mới vào bên dưới.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmConflict(false)}
                className="w-full py-2.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Quay lại (Hủy bỏ)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

