"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  AdminPackageActionResponse,
  AdminPackageQueryParams,
  AdminPackagesListResponse,
  AdminTransactionQueryParams,
  AdminTransactionsListResponse,
  ConfirmAdminTransactionResponse,
  CreateAdminPackagePayload,
  UpdateAdminPackagePayload,
  UpdateAdminPackageStatusPayload,
} from "@viecngon/types";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/lib/env";
import {
  adminDashboardKeys,
  adminPackageKeys,
  packageKeys,
} from "@/queries/queryKeys";

async function requestAdminPackagesApi<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackError = "Đã có lỗi xảy ra khi thao tác gói dịch vụ.",
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

function buildPackageQuery(params: AdminPackageQueryParams): string {
  const search = new URLSearchParams();
  if (params.q && params.q.trim()) search.set("q", params.q.trim());
  if (params.status && params.status !== "ALL")
    search.set("status", params.status);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function buildTransactionQuery(params: AdminTransactionQueryParams): string {
  const search = new URLSearchParams();
  if (params.q && params.q.trim()) search.set("q", params.q.trim());
  if (params.status && params.status !== "ALL")
    search.set("status", params.status);
  if (params.packageId && params.packageId !== "ALL")
    search.set("packageId", params.packageId);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useAdminPackages(params: AdminPackageQueryParams) {
  return useQuery<AdminPackagesListResponse>({
    queryKey: adminPackageKeys.list(params),
    queryFn: () =>
      requestAdminPackagesApi<AdminPackagesListResponse>(
        `/admin/packages${buildPackageQuery(params)}`,
        { method: "GET" },
        "Không thể tải danh sách gói dịch vụ.",
      ),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useCreateAdminPackage() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminPackageActionResponse,
    Error,
    CreateAdminPackagePayload
  >({
    mutationFn: (payload) =>
      requestAdminPackagesApi<AdminPackageActionResponse>(
        "/admin/packages",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        "Không thể tạo gói dịch vụ mới.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminPackageKeys.all });
      queryClient.invalidateQueries({ queryKey: packageKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tạo gói dịch vụ mới.");
    },
  });
}

export function useUpdateAdminPackage() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminPackageActionResponse,
    Error,
    { packageId: string; payload: UpdateAdminPackagePayload }
  >({
    mutationFn: ({ packageId, payload }) =>
      requestAdminPackagesApi<AdminPackageActionResponse>(
        `/admin/packages/${packageId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        "Không thể cập nhật gói dịch vụ.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminPackageKeys.all });
      queryClient.invalidateQueries({ queryKey: packageKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể cập nhật gói dịch vụ.");
    },
  });
}

export function useToggleAdminPackageStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminPackageActionResponse,
    Error,
    { packageId: string; payload: UpdateAdminPackageStatusPayload }
  >({
    mutationFn: ({ packageId, payload }) =>
      requestAdminPackagesApi<AdminPackageActionResponse>(
        `/admin/packages/${packageId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        "Không thể cập nhật trạng thái gói dịch vụ.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminPackageKeys.all });
      queryClient.invalidateQueries({ queryKey: packageKeys.all });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể cập nhật trạng thái gói.");
    },
  });
}

export function useAdminTransactions(params: AdminTransactionQueryParams) {
  return useQuery<AdminTransactionsListResponse>({
    queryKey: adminPackageKeys.transactionList(params),
    queryFn: () =>
      requestAdminPackagesApi<AdminTransactionsListResponse>(
        `/admin/packages/transactions${buildTransactionQuery(params)}`,
        { method: "GET" },
        "Không thể tải lịch sử giao dịch thanh toán.",
      ),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useConfirmAdminTransaction() {
  const queryClient = useQueryClient();

  return useMutation<ConfirmAdminTransactionResponse, Error, string>({
    mutationFn: (transactionId) =>
      requestAdminPackagesApi<ConfirmAdminTransactionResponse>(
        `/admin/packages/transactions/${transactionId}/confirm`,
        { method: "PATCH" },
        "Không thể xác nhận giao dịch thanh toán.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: adminPackageKeys.transactions(),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.metrics(),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.recentTransactions(),
      });
      queryClient.invalidateQueries({
        queryKey: adminDashboardKeys.revenueBreakdown(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể xác nhận giao dịch thanh toán.");
    },
  });
}
