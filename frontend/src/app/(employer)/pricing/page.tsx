"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Check,
  FileText,
  CalendarDays,
  Loader2,
  Star,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { usePackages } from "@/hooks/recruiter/usePackages";
import { PackageResponse } from "@viecngon/types";

const formatCurrency = (amount: number) => {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// ============================================================================
// COMPONENT CHÍNH: BẢNG GIÁ DỊCH VỤ TUYỂN DỤNG
// ============================================================================
export default function EmployerPricingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { packages, isLoading } = usePackages();

  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);

  const purchaseMutation = useMutation({
    mutationFn: async (maGoi: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ maGoi }),
          credentials: "include", // Bắt buộc gửi kèm JWT Cookie
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Thanh toán không thành công");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Thanh toán và kích hoạt gói dịch vụ thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-campaigns"] });
      router.push("/employer/campaigns");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi thực hiện giao dịch");
    },
    onSettled: () => {
      setLoadingPackageId(null);
    },
  });

  const handlePurchase = (pkg: PackageResponse) => {
    // Ưu tiên lấy maGoi từ CSDL, fallback sang id nếu có
    const packageId = pkg.maGoi || (pkg as any).id;
    setLoadingPackageId(packageId);
    purchaseMutation.mutate(packageId);
  };

  // 1. MÀN HÌNH LOADING KHI ĐANG FETCH DỮ LIỆU BẢNG GIÁ
  if (isLoading) {
    return (
      <div className="min-h-125 flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
        <p className="text-slate-600 font-medium text-sm">
          Đang tải bảng giá dịch vụ...
        </p>
      </div>
    );
  }

  // 2. MÀN HÌNH BẢNG GIÁ DỊCH VỤ
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* HEADER PAGE */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Zap size={14} /> Dịch vụ Tuyển dụng ViecNgon
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Bảng giá Gói Tuyển dụng & Quảng cáo
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Lựa chọn gói dịch vụ tối ưu để đăng tin, ghim vị trí nổi bật và tiếp
          cận hàng ngàn ứng viên tiềm năng ngay hôm nay.
        </p>
      </div>

      {/* GRID DANH SÁCH GÓI DỊCH VỤ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg) => {
          const packageId = pkg.maGoi || (pkg as any).id;
          const isPurchasingThis = loadingPackageId === packageId;
          const isPopular = pkg.isPopular;

          return (
            <div
              key={packageId}
              className={`relative rounded-2xl bg-white transition-all duration-300 flex flex-col justify-between ${
                isPopular
                  ? "border-2 border-primary shadow-xl scale-105 z-10"
                  : "border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Badge "Phổ biến nhất" cho gói ở giữa */}
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                  <Star size={13} className="fill-white" /> Phổ biến nhất
                </div>
              )}

              {/* THÔNG TIN CHÍNH CỦA GÓI */}
              <div className="p-6 sm:p-8 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {pkg.tieuDe}
                  </h3>
                  {pkg.loaiQuangCao && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {pkg.loaiQuangCao}
                    </span>
                  )}
                </div>

                {/* Hiển thị Giá tiền */}
                <div className="my-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {formatCurrency(pkg.gia)}
                    </span>
                  </div>
                </div>

                {/* Khối Thông số Cốt lõi */}
                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                      <FileText size={18} />
                    </div>
                    <span>{pkg.soLuotDangTin} lượt đăng tin tuyển dụng</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                      <CalendarDays size={18} />
                    </div>
                    <span>Hiệu lực trong {pkg.thoiGianHieuLuc} ngày</span>
                  </div>
                </div>

                {/* Danh sách Đặc quyền (Features) */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Quyền lợi gói bao gồm:
                  </p>
                  <ul className="space-y-2.5">
                    {pkg.features?.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-slate-600"
                      >
                        <Check
                          size={16}
                          className="text-emerald-500 shrink-0 mt-0.5"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* NÚT MUA HÀNG O FOOTER */}
              <div className="p-6 sm:p-8 pt-0 mt-auto">
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={!!loadingPackageId}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isPopular
                      ? "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPurchasingThis ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Đang xử lý giao dịch...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Mua ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
