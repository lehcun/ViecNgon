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
import { formatVnd } from "@/lib/formatters";
import { EmptyState } from "@/components/ui/StateViews";

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
          credentials: "include",
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
      router.push("/campaigns");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi thực hiện giao dịch");
    },
    onSettled: () => {
      setLoadingPackageId(null);
    },
  });

  const handlePurchase = (pkg: PackageResponse) => {
    const packageId = pkg.maGoi;
    setLoadingPackageId(packageId);
    purchaseMutation.mutate(packageId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 space-y-10">
        <div className="max-w-xl mx-auto text-center space-y-3 animate-pulse">
          <div className="h-6 w-48 bg-surface-subtle rounded-full mx-auto" />
          <div className="h-9 w-3/4 bg-surface-subtle rounded mx-auto" />
          <div className="h-4 w-full bg-surface-muted rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-border-default rounded-2xl p-6 space-y-5 animate-pulse h-96"
            >
              <div className="h-6 w-2/3 bg-surface-subtle rounded" />
              <div className="h-10 w-1/2 bg-surface-subtle rounded" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-surface-muted rounded" />
                <div className="h-4 w-5/6 bg-surface-muted rounded" />
                <div className="h-4 w-4/5 bg-surface-muted rounded" />
              </div>
              <div className="h-11 w-full bg-surface-subtle rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-2 sm:px-4">
      {/* Header Page */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary/20 mb-3">
          <Zap size={14} /> Dịch vụ Tuyển dụng ViecNgon
        </span>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Bảng giá Gói Tuyển dụng & Quảng cáo
        </h1>
        <p className="mt-3 text-base text-text-secondary max-w-2xl mx-auto">
          Lựa chọn gói dịch vụ tối ưu để đăng tin, ghim vị trí nổi bật và tiếp
          cận hàng ngàn ứng viên IT tiềm năng.
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="max-w-xl mx-auto bg-surface-card border border-border-default rounded-xl p-6">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="Chưa có gói dịch vụ nào"
            description="Hiện tại hệ thống chưa mở bán gói quảng cáo. Vui lòng quay lại sau."
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          {packages.map((pkg) => {
            const packageId = pkg.maGoi;
            const isPurchasingThis = loadingPackageId === packageId;
            const isPopular = pkg.isPopular;

            return (
              <div
                key={packageId}
                className={`relative rounded-2xl bg-surface-card transition-all duration-200 flex flex-col justify-between ${
                  isPopular
                    ? "border-2 border-primary shadow-lg z-10"
                    : "border border-border-default shadow-xs hover:shadow-md"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider whitespace-nowrap">
                    <Star size={12} className="fill-white" /> Phổ biến nhất
                  </div>
                )}

                <div className="p-6 sm:p-7 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-text-primary">
                      {pkg.tieuDe}
                    </h3>
                    {pkg.loaiQuangCao && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-surface-subtle text-text-secondary">
                        {pkg.loaiQuangCao}
                      </span>
                    )}
                  </div>

                  <div className="my-5 pb-5 border-b border-border-default">
                    <span className="text-3xl font-bold text-text-primary tabular-nums">
                      {pkg.gia === 0 ? "Miễn phí" : formatVnd(pkg.gia)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 bg-surface-muted p-4 rounded-xl border border-border-default">
                    <div className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                      <div className="p-1.5 bg-primary-light text-primary rounded-lg shrink-0">
                        <FileText size={16} />
                      </div>
                      <span>{pkg.soLuotDangTin} lượt đăng tin tuyển dụng</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                      <div className="p-1.5 bg-info-light text-info rounded-lg shrink-0">
                        <CalendarDays size={16} />
                      </div>
                      <span>Hiệu lực trong {pkg.thoiGianHieuLuc} ngày</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Quyền lợi gói bao gồm
                    </p>
                    <ul className="space-y-2">
                      {pkg.features?.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-text-secondary"
                        >
                          <Check
                            size={16}
                            className="text-success shrink-0 mt-0.5"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0 mt-auto">
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={!!loadingPackageId}
                    className={`w-full h-11 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-primary hover:bg-primary-hover text-white"
                        : "bg-primary-dark hover:opacity-90 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isPurchasingThis ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Đang xử lý giao dịch...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>Mua ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
