"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { CertificateItem } from "@viecngon/types";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CertificateItem | null;
}

function toInputMonth(dateStr?: string | null): string {
  if (!dateStr) return "";
  if (dateStr.includes("/")) {
    const [month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}`;
  }
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length >= 2) return `${parts[0]}-${parts[1].padStart(2, "0")}`;
  }
  return "";
}

function toIsoDate(monthStr: string): string {
  if (!monthStr) return "";
  return `${monthStr}-01`;
}

export default function CertificateModal({
  isOpen,
  onClose,
  initialData,
}: CertificateModalProps) {
  const isEditing = !!initialData?.id;
  const {
    createCertificate,
    isCreatingCertificate,
    updateCertificate,
    isUpdatingCertificate,
  } = useManageCandidateItems();

  const isPending = isCreatingCertificate || isUpdatingCertificate;

  const [name, setName] = useState(initialData?.name || "");
  const [organization, setOrganization] = useState(
    initialData?.organization || "",
  );
  const [issueMonth, setIssueMonth] = useState(() =>
    toInputMonth(initialData?.issueDate),
  );
  const [expirationMonth, setExpirationMonth] = useState(() =>
    toInputMonth(initialData?.expirationDate),
  );
  const [noExpiry, setNoExpiry] = useState(
    isEditing ? !initialData?.expirationDate : false,
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Vui lòng nhập tên chứng chỉ");
      return;
    }
    if (!organization.trim()) {
      toast.error("Vui lòng nhập tổ chức cấp");
      return;
    }
    if (!issueMonth) {
      toast.error("Vui lòng chọn ngày cấp");
      return;
    }

    const payload = {
      name: name.trim(),
      organization: organization.trim(),
      issueDate: toIsoDate(issueMonth),
      expirationDate: noExpiry
        ? null
        : expirationMonth
          ? toIsoDate(expirationMonth)
          : null,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateCertificate({ id: initialData.id, data: payload });
        toast.success("Cập nhật chứng chỉ thành công!");
      } else {
        await createCertificate(payload);
        toast.success("Thêm chứng chỉ thành công!");
      }
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới"}
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
          {/* Tên chứng chỉ */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tên chứng chỉ / Giải thưởng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: AWS Certified Solutions Architect - Associate"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Tổ chức cấp */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tổ chức / Đơn vị cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="VD: Amazon Web Services (AWS) hoặc Coursera"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Ngày cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                required
                value={issueMonth}
                onChange={(e) => setIssueMonth(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Ngày hết hạn
              </label>
              <input
                type="month"
                disabled={noExpiry}
                value={noExpiry ? "" : expirationMonth}
                onChange={(e) => setExpirationMonth(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Checkbox không hết hạn */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noExpiryCheck"
              checked={noExpiry}
              onChange={(e) => {
                setNoExpiry(e.target.checked);
                if (e.target.checked) setExpirationMonth("");
              }}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label
              htmlFor="noExpiryCheck"
              className="text-sm text-slate-700 cursor-pointer select-none font-medium"
            >
              Chứng chỉ này vô thời hạn (không có ngày hết hạn)
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 rounded-lg transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

