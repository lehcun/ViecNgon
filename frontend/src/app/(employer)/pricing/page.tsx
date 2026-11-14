"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Zap, ShoppingBag } from "lucide-react";
import { usePackages } from "@/hooks/recruiter/usePackages";
import { PackageResponse } from "@viecngon/types";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";
import PricingPackageCard from "@/components/pricing/PricingPackageCard";
import { packageKeys } from "@/queries/queryKeys";

export default function EmployerPricingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { packages, isLoading, isError, refetch } = usePackages();

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
      queryClient.invalidateQueries({ queryKey: packageKeys.myCampaigns() });
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
    setLoadingPackageId(pkg.maGoi);
    purchaseMutation.mutate(pkg.maGoi);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 space-y-10">
        <div className="max-w-xl mx-auto text-center space-y-3 animate-pulse">
          <div className="h-6 w-48 bg-surface-subtle rounded-full mx-auto" />
          <div className="h-9 w-3/4 bg-surface-subtle rounded mx-auto" />
          <div className="h-4 w-full bg-surface-muted rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-border-default rounded-2xl p-6 space-y-5 animate-pulse h-125"
            >
              <div className="h-6 w-2/3 bg-surface-subtle rounded" />
              <div className="h-10 w-1/2 bg-surface-subtle rounded" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-surface-muted rounded" />
                <div className="h-4 w-5/6 bg-surface-muted rounded" />
                <div className="h-4 w-4/5 bg-surface-muted rounded" />
                <div className="h-4 w-3/4 bg-surface-muted rounded" />
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
          <Zap size={14} /> Giải pháp Tuyển dụng ViecNgon
        </span>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Bảng giá Gói Tuyển dụng & Quảng cáo 4 Cấp
        </h1>
        <p className="mt-3 text-base text-text-secondary max-w-2xl mx-auto">
          Lựa chọn gói dịch vụ phù hợp để tăng độ phủ tin tuyển dụng, ưu tiên
          thứ hạng hiển thị và tiếp cận kỹ sư IT chất lượng cao.
        </p>
      </div>

      {isError ? (
        <div className="max-w-xl mx-auto bg-surface-card border border-border-default rounded-xl p-6">
          <ErrorState
            title="Không thể tải bảng giá dịch vụ"
            message="Vui lòng kiểm tra kết nối máy chủ và thử lại."
            onRetry={() => void refetch()}
          />
        </div>
      ) : packages.length === 0 ? (
        <div className="max-w-xl mx-auto bg-surface-card border border-border-default rounded-xl p-6">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="Chưa có gói dịch vụ nào"
            description="Hiện tại hệ thống chưa mở bán gói quảng cáo. Vui lòng quay lại sau."
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch pt-2">
          {packages.map((pkg) => (
            <PricingPackageCard
              key={pkg.maGoi}
              pkg={pkg}
              isPurchasing={loadingPackageId === pkg.maGoi}
              disabled={!!loadingPackageId}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
}
