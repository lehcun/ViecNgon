"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  EmployerJobsResponse,
  EmployerJobStatus,
  RepostJobPayload,
} from "@viecngon/types";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface EmployerJobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmployerJobStatus | string;
  sortBy?: "newest" | "expiring_soon" | "most_viewed" | string;
}

export const EMPLOYER_JOBS_QUERY_KEY = ["employerJobs"] as const;

/**
 * Hook fetch danh sách tin tuyển dụng có tìm kiếm, lọc status và phân trang
 */
export function useEmployerJobs(params: EmployerJobsQueryParams = {}) {
  const { page = 1, limit = 10, search = "", status = "ALL", sortBy = "newest" } = params;

  return useQuery<EmployerJobsResponse, Error>({
    queryKey: [...EMPLOYER_JOBS_QUERY_KEY, { page, limit, search, status, sortBy }],
    queryFn: async ({ signal }) => {
      const searchParams = new URLSearchParams();
      if (page) searchParams.set("page", String(page));
      if (limit) searchParams.set("limit", String(limit));
      if (search && search.trim() !== "") searchParams.set("search", search.trim());
      if (status && status !== "ALL") searchParams.set("status", status);
      if (sortBy) searchParams.set("sortBy", sortBy);

      const url = `${API_BASE_URL}/employer/jobs?${searchParams.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        signal,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const errorMsg =
          (Array.isArray(errorJson?.message)
            ? errorJson.message[0]
            : errorJson?.message) || "Không thể tải danh sách tin tuyển dụng.";
        throw new Error(errorMsg);
      }

      return res.json() as Promise<EmployerJobsResponse>;
    },
    staleTime: 1000 * 60, // 1 phút
  });
}

/**
 * Hook Mutation đăng lại / gia hạn tin tuyển dụng (POST /employer/jobs/:id/repost)
 */
export function useRepostJob() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { jobId: string; payload: RepostJobPayload }>({
    mutationFn: async ({ jobId, payload }) => {
      const res = await fetch(`${API_BASE_URL}/employer/jobs/${jobId}/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Không thể đăng lại tin tuyển dụng.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Đăng lại và gia hạn tin tuyển dụng thành công!");
      queryClient.invalidateQueries({ queryKey: EMPLOYER_JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["recruiterMetrics"] });
    },
    onError: (error) => {
      toast.error(error.message || "Đã xảy ra lỗi khi đăng lại tin tuyển dụng.");
    },
  });
}

/**
 * Hook Mutation tạm ẩn / hiện tin tuyển dụng (PATCH /employer/jobs/:id/toggle-visibility)
 */
export function useToggleJobVisibility() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`${API_BASE_URL}/employer/jobs/${jobId}/toggle-visibility`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Không thể thay đổi trạng thái tin tuyển dụng.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái hiển thị của tin!");
      queryClient.invalidateQueries({ queryKey: EMPLOYER_JOBS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi cập nhật trạng thái tin.");
    },
  });
}

/**
 * Hook Mutation xóa tin tuyển dụng có kiểm tra quyền sở hữu (DELETE /employer/jobs/:id)
 */
export function useDeleteEmployerJob() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (jobId: string) => {
      const res = await fetch(`${API_BASE_URL}/employer/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Không thể xóa tin tuyển dụng.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Đã xóa tin tuyển dụng thành công!");
      queryClient.invalidateQueries({ queryKey: EMPLOYER_JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["recruiterMetrics"] });
    },
    onError: (error) => {
      toast.error(error.message || "Đã xảy ra lỗi khi xóa tin tuyển dụng.");
    },
  });
}

