"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  AdminSkillActionResponse,
  AdminSkillQueryParams,
  AdminSkillsListResponse,
  CreateAdminSkillPayload,
  DeleteAdminSkillResponse,
  MergeAdminSkillPayload,
  UpdateAdminSkillPayload,
} from "@viecngon/types";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/lib/env";
import { adminSkillKeys } from "@/queries/queryKeys";

async function requestAdminSkillsApi<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackError = "Đã có lỗi xảy ra khi thao tác từ điển kỹ năng.",
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

function buildQuery(params: AdminSkillQueryParams): string {
  const search = new URLSearchParams();
  if (params.q && params.q.trim()) search.set("q", params.q.trim());
  if (params.usage && params.usage !== "ALL") search.set("usage", params.usage);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useAdminSkills(params: AdminSkillQueryParams) {
  return useQuery<AdminSkillsListResponse>({
    queryKey: adminSkillKeys.list(params),
    queryFn: () =>
      requestAdminSkillsApi<AdminSkillsListResponse>(
        `/admin/skills${buildQuery(params)}`,
        { method: "GET" },
        "Không thể tải danh sách kỹ năng.",
      ),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useCreateAdminSkill() {
  const queryClient = useQueryClient();

  return useMutation<AdminSkillActionResponse, Error, CreateAdminSkillPayload>({
    mutationFn: (payload) =>
      requestAdminSkillsApi<AdminSkillActionResponse>(
        "/admin/skills",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        "Không thể thêm kỹ năng mới.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminSkillKeys.all });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể thêm kỹ năng mới.");
    },
  });
}

export function useUpdateAdminSkill() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminSkillActionResponse,
    Error,
    { skillId: string; payload: UpdateAdminSkillPayload }
  >({
    mutationFn: ({ skillId, payload }) =>
      requestAdminSkillsApi<AdminSkillActionResponse>(
        `/admin/skills/${skillId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        "Không thể đổi tên kỹ năng.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminSkillKeys.all });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể đổi tên kỹ năng.");
    },
  });
}

export function useMergeAdminSkill() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminSkillActionResponse,
    Error,
    { sourceSkillId: string; payload: MergeAdminSkillPayload }
  >({
    mutationFn: ({ sourceSkillId, payload }) =>
      requestAdminSkillsApi<AdminSkillActionResponse>(
        `/admin/skills/${sourceSkillId}/merge`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        "Không thể gộp kỹ năng.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminSkillKeys.all });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể gộp kỹ năng.");
    },
  });
}

export function useDeleteAdminSkill() {
  const queryClient = useQueryClient();

  return useMutation<DeleteAdminSkillResponse, Error, string>({
    mutationFn: (skillId) =>
      requestAdminSkillsApi<DeleteAdminSkillResponse>(
        `/admin/skills/${skillId}`,
        { method: "DELETE" },
        "Không thể xóa kỹ năng.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminSkillKeys.all });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể xóa kỹ năng.");
    },
  });
}
