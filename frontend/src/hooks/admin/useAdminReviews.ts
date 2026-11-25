"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  AdminReviewsListResponse,
  AdminReviewsQueryParams,
  ModerateAdminReviewPayload,
} from "@viecngon/types";
import { adminReviewKeys, reviewKeys } from "@/queries/queryKeys";

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

export function useAdminReviews(params: AdminReviewsQueryParams) {
  return useQuery<AdminReviewsListResponse>({
    queryKey: adminReviewKeys.list(params),
    staleTime: 30 * 1000,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.tab) searchParams.set("tab", params.tab);
      if (params.rating) searchParams.set("rating", String(params.rating));
      if (params.datePreset) searchParams.set("datePreset", params.datePreset);
      if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
      if (params.dateTo) searchParams.set("dateTo", params.dateTo);
      if (params.search?.trim())
        searchParams.set("search", params.search.trim());

      const qs = searchParams.toString();
      const res = await fetch(
        `${API_BASE}/admin/reviews${qs ? `?${qs}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(
            res,
            "Không thể tải danh sách đánh giá cần kiểm duyệt.",
          ),
        );
      }
      return (await res.json()) as AdminReviewsListResponse;
    },
  });
}

export function useApproveAdminReview() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string; message: string }, Error, string>({
    mutationFn: async (reviewId) => {
      const res = await fetch(
        `${API_BASE}/admin/reviews/${reviewId}/approve`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Không thể duyệt bài đánh giá."),
        );
      }
      return (await res.json()) as { id: string; message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Đã duyệt bài đánh giá công khai.");
      void queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useModerateAdminReview() {
  const queryClient = useQueryClient();

  return useMutation<
    { id: string; message: string },
    Error,
    { reviewId: string; payload: ModerateAdminReviewPayload }
  >({
    mutationFn: async ({ reviewId, payload }) => {
      const res = await fetch(
        `${API_BASE}/admin/reviews/${reviewId}/moderate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Không thể xử lý bài đánh giá."),
        );
      }
      return (await res.json()) as { id: string; message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Đã cập nhật trạng thái kiểm duyệt.");
      void queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
