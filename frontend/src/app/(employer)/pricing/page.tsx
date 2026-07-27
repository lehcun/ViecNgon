"use client";

import React, { useState } from "react";
import {
  Check,
  FileText,
  CalendarDays,
  Loader2,
  Star,
  Zap,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ============================================================================
// 1. INTERFACES & MOCK DATA (Khớp với Database thực tế)
// ============================================================================
export interface PackageResponse {
  id: string;
  name: string;
  price: number;
  soLuotDangTin: number;
  thoiGianHieuLuc: number; // Tính bằng ngày
  description: string;
  features: string[];
  isPopular?: boolean;
}

const MOCK_PACKAGES: PackageResponse[] = [
  {
    id: "pkg-basic",
    name: "Cơ bản",
    price: 0,
    soLuotDangTin: 1,
    thoiGianHieuLuc: 7,
    description:
      "Trải nghiệm tính năng đăng tin cơ bản dành cho các doanh nghiệp mới.",
    features: [
      "Đăng 1 tin tuyển dụng hiển thị 7 ngày",
      "Tiếp cận kho CV ứng viên cơ bản",
      "Hỗ trợ quản lý trạng thái hồ sơ",
      "Hỗ trợ qua Email (Phản hồi 48h)",
    ],
    isPopular: false,
  },
  {
    id: "pkg-standard",
    name: "Tiêu chuẩn",
    price: 1500000,
    soLuotDangTin: 5,
    thoiGianHieuLuc: 30,
    description:
      "Giải pháp phổ biến nhất giúp tuyển dụng nhanh chóng và hiệu quả.",
    features: [
      "Đăng 5 tin tuyển dụng hiển thị 30 ngày",
      "Tin đăng được đánh dấu Nổi bật (Top 10)",
      "Mở khóa tính năng Xem CV ứng viên Ẩn",
      "Bộ lọc hồ sơ ứng viên bằng AI",
      "Hỗ trợ chuyên viên CSKH riêng",
    ],
    isPopular: true, // Đánh dấu gói Nổi bật
  },
  {
    id: "pkg-vip",
    name: "Doanh nghiệp VIP",
    price: 4990000,
    soLuotDangTin: 999, // Đại diện cho Không giới hạn
    thoiGianHieuLuc: 90,
    description:
      "Tối đa hóa sức mạnh thương hiệu tuyển dụng với đặc quyền VIP.",
    features: [
      "Đăng tin KHÔNG GIỚI HẠN trong 90 ngày",
      "Gắn huy hiệu Doanh Nghiệp Uy Tín",
      "Tự động gửi email mời ứng viên tiềm năng",
      "API tích hợp hệ thống ATS nội bộ công ty",
      "Báo cáo phân tích hiệu quả tuyển dụng",
      "Hỗ trợ kỹ thuật 24/7",
    ],
    isPopular: false,
  },
];

// ============================================================================
// 2. CUSTOM HOOKS & HELPERS
// ============================================================================
const usePurchasePackage = () => {
  return useMutation({
    mutationFn: async (packageId: string) => {
      // Giả lập thời gian xử lý API thanh toán (1 giây)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, packageId };
    },
    onSuccess: () => {
      toast.success("Đang chuyển hướng đến cổng thanh toán...");
      // TODO: Ở đây bạn sẽ dùng router.push() để chuyển sang trang Thanh toán (VNPay/Momo)
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi khởi tạo giao dịch.");
    },
  });
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
export default function EmployerPricingPage() {
  const { mutate: purchasePackage } = usePurchasePackage();

  // State lưu trữ ID của gói đang được bấm mua để hiện loading đúng nút
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);

  const handlePurchase = (pkg: PackageResponse) => {
    setLoadingPackageId(pkg.id);
    purchasePackage(pkg.id, {
      onSettled: () => {
        setLoadingPackageId(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Decorator (Hiệu ứng vòng tròn mờ phía sau) */}
      <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-blue-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-24 -right-24 w-125 h-125 bg-purple-300/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 z-10">
        {/* --- HEADER --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2">
            Bảng giá Dịch vụ
          </h2>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
            Đầu tư đúng chỗ, <br className="hidden sm:block" /> Tuyển dụng dễ
            dàng
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Nâng cấp gói dịch vụ để tiếp cận hàng ngàn ứng viên tiềm năng trên
            ViecNgon. Minh bạch, linh hoạt và không có phí ẩn.
          </p>
        </div>

        {/* --- PRICING GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-start">
          {MOCK_PACKAGES.map((pkg) => {
            const isPopular = pkg.isPopular;
            const isLoading = loadingPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col bg-white rounded-3xl transition-all duration-300 ${
                  isPopular
                    ? "border-2 border-blue-600 shadow-xl shadow-blue-900/10 md:-translate-y-4 md:scale-105 z-10"
                    : "border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200"
                }`}
              >
                {/* Badge "Phổ biến nhất" */}
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-linear-to-r from-blue-600 to-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
                      <Star size={14} className="fill-white" /> Phổ biến nhất
                    </span>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  {/* Tên & Mô tả */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 min-h-10">
                    {pkg.description}
                  </p>

                  {/* Giá tiền */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl lg:text-4xl font-extrabold text-slate-900">
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>
                    {pkg.price > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        * Đã bao gồm thuế VAT
                      </p>
                    )}
                  </div>

                  {/* Thông số cốt lõi (Icon Box) */}
                  <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Số lượt đăng tin
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {pkg.soLuotDangTin === 999
                            ? "Không giới hạn"
                            : `${pkg.soLuotDangTin} tin tuyển dụng`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shrink-0">
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Thời gian hiệu lực
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {pkg.thoiGianHieuLuc} ngày hiển thị
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách Tính năng */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                      Tính năng bao gồm:
                    </p>
                    <ul className="flex flex-col gap-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check
                            size={18}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-slate-600 leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer (Nút Mua) */}
                <div className="p-8 pt-0 mt-auto">
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isPopular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                        : "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-600 hover:bg-blue-50"
                    } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : pkg.price === 0 ? (
                      "Bắt đầu miễn phí"
                    ) : (
                      <>
                        <Zap
                          size={18}
                          className={isPopular ? "fill-white" : "fill-none"}
                        />
                        Mua ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- FAQ/Trust Note (Optional Extra Polish) --- */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            Thanh toán an toàn qua{" "}
            <span className="font-bold text-slate-700">VNPay / MoMo</span>. Cần
            hỗ trợ?
            <a href="#" className="text-blue-600 hover:underline font-semibold">
              Liên hệ bộ phận CSKH.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
