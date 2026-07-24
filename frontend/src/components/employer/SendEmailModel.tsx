"use client";

import React, { useState } from "react";
import { X, Send, Loader2, Mail } from "lucide-react";
import { useSendEmail } from "@/hooks/recruiter/useSendEmail";
import toast from "react-hot-toast";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateEmail: string;
  jobTitle: string;
  applicationId: string;
}

interface SendEmailFormProps {
  onClose: () => void;
  candidateEmail: string;
  jobTitle: string;
  applicationId: string;
  isPending: boolean;
  onSend: (
    payload: { applicationId: string; subject: string; content: string },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void },
  ) => void;
}

function SendEmailForm({
  onClose,
  candidateEmail,
  jobTitle,
  applicationId,
  isPending,
  onSend,
}: SendEmailFormProps) {
  const [subject, setSubject] = useState(
    `[ViecNgon] - Trao đổi về vị trí ${jobTitle || ""}`,
  );
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung email trước khi gửi!");
      return;
    }

    onSend(
      { applicationId, subject, content },
      {
        onSuccess: () => {
          toast.success("Đã gửi email thành công tới ứng viên!");
          onClose();
        },
        onError: (error: Error) => {
          toast.error(`Có lỗi xảy ra: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* HEADER MODAL */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          Gửi Email cho Ứng viên
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* BODY MODAL (Form nhập liệu) */}
      <div className="p-6 flex flex-col gap-4">
        {/* Ô Người nhận (Chỉ đọc) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Người nhận (To)
          </label>
          <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
            {candidateEmail || "Chưa có email"}
          </div>
        </div>

        {/* Ô Tiêu đề */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Tiêu đề (Subject)
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Ô Nội dung (Nếu sau này dùng React Quill thì thay thẻ textarea này) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Nội dung Email
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Xin chào bạn, chúng tôi nhận thấy hồ sơ của bạn rất ấn tượng..."
            className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
          <p className="text-[11px] text-slate-400 mt-1 italic">
            Email sẽ được gửi trực tiếp từ hệ thống nội bộ của ViecNgon.
          </p>
        </div>
      </div>

      {/* FOOTER MODAL (Nút bấm) */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSend}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {isPending ? "Đang gửi..." : "Gửi Email"}
        </button>
      </div>
    </div>
  );
}

export default function SendEmailModal({
  isOpen,
  onClose,
  candidateEmail,
  jobTitle,
  applicationId,
}: SendEmailModalProps) {
  const { mutate: sendEmail, isPending } = useSendEmail();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <SendEmailForm
        key={`${applicationId}-${jobTitle}`}
        onClose={onClose}
        candidateEmail={candidateEmail}
        jobTitle={jobTitle}
        applicationId={applicationId}
        isPending={isPending}
        onSend={sendEmail}
      />
    </div>
  );
}
