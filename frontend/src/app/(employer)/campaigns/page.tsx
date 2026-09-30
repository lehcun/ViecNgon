"use client";

import React from "react";
import {
  ShoppingCart,
  Briefcase,
  Activity,
  Ticket,
  PlusCircle,
  CreditCard,
  RefreshCcw,
} from "lucide-react";
import { useCampaigns } from "@/hooks/recruiter/useCampaigns";
import Link from "next/link";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${`0${date.getDate()}`.slice(-2)}/${`0${date.getMonth() + 1}`.slice(-2)}/${date.getFullYear()}`;
};

const formatCurrency = (amount: number) => {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// ============================================================================
// 3. COMPONENT CHÍNH
// ============================================================================
export default function CampaignsPage() {
  const { campaigns, isLoading } = useCampaigns();

  if (isLoading) return <div>Đang tải các gói...</div>;

  const totalCredits = campaigns
    .filter((c) => c.trangThai === "DANG_CHAY")
    .reduce((sum, c) => sum + c.soLuotConLai, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ========================================== */}
        {/* PHẦN A: HEADER & NÚT CALL-TO-ACTION        */}
        {/* ========================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Quản lý Gói dịch vụ & Chiến dịch
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi lịch sử mua hàng, hạn sử dụng và số lượt đăng tin tuyển
              dụng còn lại.
            </p>
          </div>

          <Link
            href="/pricing"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 shrink-0"
          >
            <ShoppingCart size={18} /> Mua thêm gói
          </Link>
        </div>

        {/* ========================================== */}
        {/* PHẦN B: THỐNG KÊ NHANH (SUMMARY CARDS)     */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-slate-100 text-slate-600 rounded-xl">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Tổng số chiến dịch
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800">
                {campaigns.reduce((sum) => sum + 1, 0)}
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Gói đang hoạt động
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800">
                {campaigns
                  .filter((c) => c.trangThai === "DANG_CHAY")
                  .reduce((sum) => sum + 1, 0)}
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Ticket size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Tổng lượt đăng tin còn lại
              </p>
              <h3 className="text-3xl font-extrabold text-blue-600">
                {totalCredits}
              </h3>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PHẦN C: BẢNG DỮ LIỆU (DATA TABLE)          */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">
              Lịch sử Chiến dịch
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wide border-b border-slate-200">
                  <th className="px-6 py-4">Thông tin gói</th>
                  <th className="px-6 py-4">Thời hạn</th>
                  <th className="px-6 py-4 text-center">Lượt đăng</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Chưa có chiến dịch hoặc lịch sử mua gói nào.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Cột 1: Thông tin gói */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-slate-800 text-base mb-1">
                          {c.tieuDe}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">
                            {c.tenGoi}
                          </span>
                          <span>•</span>
                          <span>{formatCurrency(c.giaTaiThoiDiemMua)}</span>
                        </div>
                      </td>

                      {/* Cột 2: Thời hạn */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs w-6">
                              Từ:
                            </span>
                            <span className="font-medium">
                              {formatDate(c.ngayMua)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs w-6">
                              Đến:
                            </span>
                            <span className="font-medium">
                              {formatDate(c.ngayKetThuc)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 3: Lượt đăng */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            c.soLuotConLai === 0
                              ? "bg-rose-100 text-rose-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {c.soLuotConLai > 100 ? "∞" : c.soLuotConLai}
                        </span>
                      </td>

                      {/* Cột 4: Trạng thái (Badges) */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {c.trangThai === "DANG_CHAY" && (
                          <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                            Đang chạy
                          </span>
                        )}
                        {c.trangThai === "DA_KET_THUC" && (
                          <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full border border-slate-200">
                            Đã kết thúc
                          </span>
                        )}
                        {c.trangThai === "CHO_THANH_TOAN" && (
                          <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full border border-amber-200">
                            Chờ thanh toán
                          </span>
                        )}
                      </td>

                      {/* Cột 5: Hành động */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {c.trangThai === "DANG_CHAY" && c.soLuotConLai > 0 && (
                          <button
                            onClick={() =>
                              alert(
                                `Chuyển đến trang Đăng tin sử dụng ID: ${c.id}`,
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm transition-colors border border-blue-200"
                          >
                            <PlusCircle size={16} /> Đăng tin
                          </button>
                        )}

                        {c.trangThai === "DA_KET_THUC" && (
                          <a
                            href="/employer/pricing"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Chuyển đến trang gia hạn gói!");
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors border border-slate-300 shadow-sm"
                          >
                            <RefreshCcw size={16} /> Gia hạn
                          </a>
                        )}

                        {c.trangThai === "CHO_THANH_TOAN" && (
                          <button
                            onClick={() =>
                              alert(
                                `Chuyển đến VNPay để thanh toán đơn: ${c.id}`,
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
                          >
                            <CreditCard size={16} /> Thanh toán
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
