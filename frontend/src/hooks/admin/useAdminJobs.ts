"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  AdminJobActionResponse,
  AdminJobDetailResponse,
  AdminJobQueryParams,
  AdminJobsListResponse,
  DeleteAdminJobPayload,
  DeleteAdminJobResponse,
  ModerateAdminJobPayload,
} from "@viecngon/types";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/lib/env";
import { adminDashboardKeys, adminJobKeys } from "@/queries/queryKeys";

async function requestAdminJobsApi<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackError = "Đã có lỗi xảy ra khi kiểm duyệt tin tuyển dụng.",
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const rawMsg = errorBody?.message;
    const message = Array.isArray(rawMsg)
      ? rawMsg[0]
      : typeof rawMsg === "string"
        ? rawMsg
        : fallbackError;
    throw new Error(message);
  }

  return response.json();
}

function buildQueryString(params: AdminJobQueryParams): string {
  const search = new URLSearchParams();
  if (params.q && params.q.trim()) search.set("q", params.q.trim());
  if (params.status && params.status !== "ALL")
    search.set("status", params.status);
  if (params.city && params.city !== "ALL") search.set("city", params.city);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useAdminJobs(params: AdminJobQueryParams) {
  return useQuery<AdminJobsListResponse>({
    queryKey: adminJobKeys.list(params),
    queryFn: () =>
      requestAdminJobsApi<AdminJobsListResponse>(
        `/admin/jobs${buildQueryString(params)}`,
        { method: "GET" },
        "Không thể tải danh sách tin tuyển dụng.",
      ),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useAdminJobDetail(jobId: string | null) {
  return useQuery<AdminJobDetailResponse>({
    queryKey: adminJobKeys.detail(jobId ?? ""),
    queryFn: () =>
      requestAdminJobsApi<AdminJobDetailResponse>(
        `/admin/jobs/${jobId}`,
        { method: "GET" },
        "Không thể tải chi tiết tin tuyển dụng.",
      ),
    enabled: Boolean(jobId),
    staleTime: 30 * 1000,
  });
}

export function useModerateAdminJob() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminJobActionResponse,
    Error,
    { jobId: string; payload: ModerateAdminJobPayload }
  >({
    mutationFn: ({ jobId, payload }) =>
      requestAdminJobsApi<AdminJobActionResponse>(
        `/admin/jobs/${jobId}/moderate`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        "Không thể cập nhật trạng thái kiểm duyệt tin tuyển dụng.",
      ),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminJobKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminJobKeys.detail(variables.jobId),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.metrics(),
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Không thể cập nhật trạng thái kiểm duyệt tin.",
      );
    },
  });
}

export function useDeleteAdminJob() {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteAdminJobResponse,
    Error,
    { jobId: string; payload?: DeleteAdminJobPayload }
  >({
    mutationFn: ({ jobId, payload }) =>
      requestAdminJobsApi<DeleteAdminJobResponse>(
        `/admin/jobs/${jobId}`,
        {
          method: "DELETE",
          body: JSON.stringify(payload ?? {}),
        },
        "Không thể xóa tin tuyển dụng.",
      ),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminJobKeys.all });
      queryClient.removeQueries({
        queryKey: adminJobKeys.detail(variables.jobId),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.metrics(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể xóa tin tuyển dụng.");
    },
  });
}
