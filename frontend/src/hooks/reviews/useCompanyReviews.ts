"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  CompanyReviewsResponse,
  CreateCompanyReviewPayload,
  PublicCompanyReviewItem,
  ReportCompanyReviewPayload,
} from "@viecngon/types";
import { reviewKeys } from "@/queries/queryKeys";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function parseErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body?.message) && body.message.length > 0) {
      return String(body.message[0]);
    }
    if (typeof body?.message === "string" && body.message.trim()) {
      return body.message;
    }
  } catch {
    // ignore JSON parse error
  }
  return fallback;
}

export function useCompanyReviews(companyId?: string) {
  return useQuery<CompanyReviewsResponse>({
    queryKey: reviewKeys.company(companyId || ""),
    enabled: Boolean(companyId),
    staleTime: 60 * 1000,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/reviews/company/${companyId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Không thể tải danh sách đánh giá."),
        );
      }
      return (await res.json()) as CompanyReviewsResponse;
    },
  });
}

export function useCreateCompanyReview(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation<PublicCompanyReviewItem, Error, CreateCompanyReviewPayload>(
    {
      mutationFn: async (payload) => {
        const res = await fetch(`${API_BASE}/reviews/company/${companyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(
            await parseErrorMessage(res, "Không thể gửi đánh giá công ty."),
          );
        }
        return (await res.json()) as PublicCompanyReviewItem;
      },
      onSuccess: () => {
        toast.success(
          "Đã gửi đánh giá ẩn danh! Bài viết đang chờ Quản trị viên kiểm duyệt trước khi hiển thị công khai.",
        );
        void queryClient.invalidateQueries({
          queryKey: reviewKeys.company(companyId),
        });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    },
  );
}

export function useReportCompanyReview(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    { id: string; message: string },
    Error,
    { reviewId: string; payload: ReportCompanyReviewPayload }
  >({
    mutationFn: async ({ reviewId, payload }) => {
      const res = await fetch(
        `${API_BASE}/reviews/company/${reviewId}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Không thể gửi báo cáo vi phạm."),
        );
      }
      return (await res.json()) as { id: string; message: string };
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Đã gửi báo cáo vi phạm lên Quản trị viên.",
      );
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.company(companyId),
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
