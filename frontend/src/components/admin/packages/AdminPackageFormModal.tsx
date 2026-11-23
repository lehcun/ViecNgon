"use client";

import React, { useState } from "react";
import { Loader2, Package, X } from "lucide-react";
import type {
  AdminPackageBadgeType,
  AdminPackageItem,
  CreateAdminPackagePayload,
} from "@viecngon/types";

interface AdminPackageFormModalProps {
  editingPackage: AdminPackageItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAdminPackagePayload) => void;
}

export default function AdminPackageFormModal({
  editingPackage,
  isSubmitting,
  onClose,
  onSubmit,
}: AdminPackageFormModalProps) {
  const [tieuDe, setTieuDe] = useState(editingPackage?.tieuDe ?? "");
  const [loaiQuangCao, setLoaiQuangCao] = useState(
    editingPackage?.loaiQuangCao ?? "",
  );
  const [gia, setGia] = useState(
    editingPackage ? String(editingPackage.gia) : "1500000",
  );
  const [soLuotDangTin, setSoLuotDangTin] = useState(
    editingPackage ? String(editingPackage.soLuotDangTin) : "3",
  );
  const [thoiGianHieuLuc, setThoiGianHieuLuc] = useState(
    editingPackage ? String(editingPackage.thoiGianHieuLuc) : "30",
  );
  const [capDoUuTien, setCapDoUuTien] = useState(
    editingPackage ? String(editingPackage.capDoUuTien) : "2",
  );
  const [loaiHuyHieu, setLoaiHuyHieu] = useState<AdminPackageBadgeType | "">(
    editingPackage?.loaiHuyHieu ?? "HOT",
  );
  const [moTaNgan, setMoTaNgan] = useState(editingPackage?.moTaNgan ?? "");
  const [quyenLoiText, setQuyenLoiText] = useState(
    editingPackage?.quyenLoi.join("\n") ?? "",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedTitle = tieuDe.trim();
    const numericGia = Number(gia);
    const numericCredits = Number(soLuotDangTin);
    const numericDays = Number(thoiGianHieuLuc);
    const numericPriority = Number(capDoUuTien);

    if (trimmedTitle.length < 2) {
      setErrorMsg("Tên gói dịch vụ tối thiểu 2 ký tự.");
      return;
    }
    if (Number.isNaN(numericGia) || numericGia < 0) {
      setErrorMsg("Giá bán phải là số không âm.");
      return;
    }
    if (!Number.isInteger(numericCredits) || numericCredits < 1) {
      setErrorMsg("Số lượt đăng tin phải là số nguyên tối thiểu 1.");
      return;
    }
    if (!Number.isInteger(numericDays) || numericDays < 1) {
      setErrorMsg("Thời gian hiệu lực phải là số nguyên tối thiểu 1 ngày.");
      return;
    }

    const quyenLoi = quyenLoiText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    onSubmit({
      tieuDe: trimmedTitle,
      loaiQuangCao: loaiQuangCao.trim() || undefined,
      gia: numericGia,
      soLuotDangTin: numericCredits,
      thoiGianHieuLuc: numericDays,
      capDoUuTien: numericPriority,
      loaiHuyHieu: loaiHuyHieu || null,
      moTaNgan: moTaNgan.trim() || undefined,
      quyenLoi,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={
        editingPackage ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"
      }
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl bg-surface-card border border-border-default rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <Package size={16} />
            </span>
            <h3 className="text-base font-bold text-text-primary">
              {editingPackage ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-danger-soft border border-danger-border text-xs font-medium text-danger-text">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pkg-title"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Tên gói dịch vụ <span className="text-danger">*</span>
              </label>
              <input
                id="pkg-title"
                type="text"
                maxLength={100}
                value={tieuDe}
                onChange={(e) => setTieuDe(e.target.value)}
                placeholder="VD: Gói VIP Đẩy Tin"
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="pkg-type"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Phân loại
              </label>
              <input
                id="pkg-type"
                type="text"
                maxLength={50}
                value={loaiQuangCao}
                onChange={(e) => setLoaiQuangCao(e.target.value)}
                placeholder="VD: VIP / Kim Cương"
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="pkg-price"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Giá bán (VNĐ) <span className="text-danger">*</span>
              </label>
              <input
                id="pkg-price"
                type="number"
                min={0}
                step={50000}
                value={gia}
                onChange={(e) => setGia(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="pkg-credits"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Số lượt đăng tin <span className="text-danger">*</span>
              </label>
              <input
                id="pkg-credits"
                type="number"
                min={1}
                max={500}
                value={soLuotDangTin}
                onChange={(e) => setSoLuotDangTin(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="pkg-days"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Hiệu lực (ngày) <span className="text-danger">*</span>
              </label>
              <input
                id="pkg-days"
                type="number"
                min={1}
                max={365}
                value={thoiGianHieuLuc}
                onChange={(e) => setThoiGianHieuLuc(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pkg-priority"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Mức độ ưu tiên (1 - 4)
              </label>
              <select
                id="pkg-priority"
                value={capDoUuTien}
                onChange={(e) => setCapDoUuTien(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="1">1 - Cơ Bản</option>
                <option value="2">2 - Tiêu Chuẩn</option>
                <option value="3">3 - VIP Đẩy Tin</option>
                <option value="4">4 - Kim Cương</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="pkg-badge"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Huy hiệu hiển thị
              </label>
              <select
                id="pkg-badge"
                value={loaiHuyHieu}
                onChange={(e) =>
                  setLoaiHuyHieu(e.target.value as AdminPackageBadgeType | "")
                }
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="">Không gắn huy hiệu</option>
                <option value="BASIC">BASIC</option>
                <option value="HOT">HOT</option>
                <option value="SUPER_HOT">SUPER_HOT</option>
                <option value="DIAMOND">DIAMOND</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="pkg-desc"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Mô tả ngắn (tối đa 255 ký tự)
            </label>
            <input
              id="pkg-desc"
              type="text"
              maxLength={255}
              value={moTaNgan}
              onChange={(e) => setMoTaNgan(e.target.value)}
              placeholder="Mô tả ngắn gọn giá trị gói dịch vụ..."
              className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="pkg-features"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Danh sách quyền lợi (mỗi dòng 1 quyền lợi)
            </label>
            <textarea
              id="pkg-features"
              rows={4}
              value={quyenLoiText}
              onChange={(e) => setQuyenLoiText(e.target.value)}
              placeholder={
                "Gắn nhãn SUPER HOT nổi bật\nƯu tiên hiển thị đầu trang tìm việc\nHỗ trợ AI Candidate Screening"
              }
              className="w-full rounded-lg border border-border-default bg-surface-card p-3 text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary transition-colors"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {editingPackage ? "Lưu thay đổi" : "Tạo gói dịch vụ"}
          </button>
        </div>
      </form>
    </div>
  );
}
