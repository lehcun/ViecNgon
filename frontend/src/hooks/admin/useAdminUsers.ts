"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  AdminUserActionResponse,
  AdminUserDetailResponse,
  AdminUserQueryParams,
  AdminUsersListResponse,
  UpdateAdminUserRolePayload,
  UpdateAdminUserStatusPayload,
} from "@viecngon/types";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/lib/env";
import { adminDashboardKeys, adminUserKeys } from "@/queries/queryKeys";

async function requestAdminUsersApi<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackError = "Đã có lỗi xảy ra khi thao tác quản lý người dùng.",
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

function buildQueryString(params: AdminUserQueryParams): string {
  const search = new URLSearchParams();
  if (params.q && params.q.trim()) search.set("q", params.q.trim());
  if (params.role && params.role !== "ALL") search.set("role", params.role);
  if (params.status && params.status !== "ALL")
    search.set("status", params.status);
  if (params.provider && params.provider !== "ALL")
    search.set("provider", params.provider);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useAdminUsers(params: AdminUserQueryParams) {
  return useQuery<AdminUsersListResponse>({
    queryKey: adminUserKeys.list(params),
    queryFn: () =>
      requestAdminUsersApi<AdminUsersListResponse>(
        `/admin/users${buildQueryString(params)}`,
        { method: "GET" },
        "Không thể tải danh sách tài khoản người dùng.",
      ),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useAdminUserDetail(userId: string | null) {
  return useQuery<AdminUserDetailResponse>({
    queryKey: adminUserKeys.detail(userId ?? ""),
    queryFn: () =>
      requestAdminUsersApi<AdminUserDetailResponse>(
        `/admin/users/${userId}`,
        { method: "GET" },
        "Không thể tải chi tiết tài khoản người dùng.",
      ),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminUserActionResponse,
    Error,
    { userId: string; payload: UpdateAdminUserStatusPayload }
  >({
    mutationFn: ({ userId, payload }) =>
      requestAdminUsersApi<AdminUserActionResponse>(
        `/admin/users/${userId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        "Không thể cập nhật trạng thái tài khoản.",
      ),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.metrics(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể cập nhật trạng thái tài khoản.");
    },
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminUserActionResponse,
    Error,
    { userId: string; payload: UpdateAdminUserRolePayload }
  >({
    mutationFn: ({ userId, payload }) =>
      requestAdminUsersApi<AdminUserActionResponse>(
        `/admin/users/${userId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        "Không thể cập nhật phân quyền tài khoản.",
      ),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.metrics(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể cập nhật phân quyền tài khoản.");
    },
  });
}
