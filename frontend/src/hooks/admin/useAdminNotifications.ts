"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  DeleteNotificationResponse,
  NotificationItemResponse,
  NotificationListResponse,
  UnreadCountResponse,
} from "@viecngon/types";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/lib/env";
import { adminNotificationKeys } from "@/queries/queryKeys";

export type AdminNotificationFilter = "ALL" | "UNREAD" | "READ";

export type AdminNotificationCategory = "employer" | "job" | "package" | "system";

export function classifyAdminNotification(
  notif: Pick<NotificationItemResponse, "title" | "content">,
): { category: AdminNotificationCategory; href: string } {
  const text = `${notif.title} ${notif.content}`.toLowerCase();

  if (
    text.includes("nhà tuyển dụng mới") ||
    text.includes("chờ kích hoạt") ||
    text.includes("tài khoản")
  ) {
    return { category: "employer", href: "/admin/users?status=CHUAKICHHOAT" };
  }

  if (
    text.includes("tin tuyển dụng") ||
    text.includes("chờ duyệt") ||
    text.includes("kiểm duyệt tin")
  ) {
    return { category: "job", href: "/admin/jobs?status=CHO_DUYET" };
  }

  if (
    text.includes("gói dịch vụ") ||
    text.includes("thanh toán") ||
    text.includes("giao dịch")
  ) {
    return { category: "package", href: "/admin/packages" };
  }

  return { category: "system", href: "/admin/notifications" };
}

export function formatRelativeTimeVi(dateInput: string | Date): string {
  const past = new Date(dateInput);
  if (Number.isNaN(past.getTime())) return "—";
  const diffMs = Date.now() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return past.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function requestNotificationApi<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackError = "Đã có lỗi xảy ra khi thao tác thông báo.",
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const rawMsg = body?.message;
    const message = Array.isArray(rawMsg)
      ? rawMsg[0]
      : typeof rawMsg === "string"
        ? rawMsg
        : fallbackError;
    throw new Error(message);
  }

  return res.json();
}

export function useAdminNotificationsList(params: {
  filter?: AdminNotificationFilter;
  q?: string;
  page?: number;
  limit?: number;
}) {
  const filter = params.filter ?? "ALL";
  const q = params.q?.trim() || "";
  const page = params.page ?? 1;
  const limit = params.limit ?? 15;

  return useQuery<NotificationListResponse>({
    queryKey: adminNotificationKeys.list({ filter, q, page, limit }),
    queryFn: () => {
      const search = new URLSearchParams({
        filter,
        page: String(page),
        limit: String(limit),
      });
      if (q) search.set("q", q);
      return requestNotificationApi<NotificationListResponse>(
        `/notifications?${search.toString()}`,
        { method: "GET" },
        "Không thể tải danh sách thông báo quản trị.",
      );
    },
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useAdminUnreadNotificationCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: adminNotificationKeys.unreadCount(),
    queryFn: () =>
      requestNotificationApi<UnreadCountResponse>(
        "/notifications/unread-count",
        { method: "GET" },
        "Không thể tải số lượng thông báo chưa đọc.",
      ),
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useAdminNotificationMutations() {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) =>
      requestNotificationApi(
        `/notifications/${id}/read`,
        { method: "PATCH" },
        "Không thể đánh dấu đã đọc.",
      ),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: adminNotificationKeys.all });

      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        adminNotificationKeys.unreadCount(),
      );

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: adminNotificationKeys.lists() },
        (old) => {
          if (!old) return old;
          const target = old.data.find((item) => item.id === id);
          if (!target || target.status === "DA_DOC") return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { ...item, status: "DA_DOC" as const } : item,
            ),
            unreadCount: Math.max(0, old.unreadCount - 1),
            readCount: old.readCount + 1,
          };
        },
      );

      queryClient.setQueryData<UnreadCountResponse>(
        adminNotificationKeys.unreadCount(),
        (old) => ({ count: Math.max(0, (old?.count ?? 1) - 1) }),
      );

      return { previousCount };
    },
    onError: (error: Error, _id, ctx) => {
      if (ctx?.previousCount) {
        queryClient.setQueryData(
          adminNotificationKeys.unreadCount(),
          ctx.previousCount,
        );
      }
      toast.error(error.message || "Không thể đánh dấu thông báo đã đọc.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: adminNotificationKeys.all,
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      requestNotificationApi(
        "/notifications/read-all",
        { method: "PATCH" },
        "Không thể đánh dấu tất cả đã đọc.",
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: adminNotificationKeys.all });
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        adminNotificationKeys.unreadCount(),
      );

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: adminNotificationKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) => ({
              ...item,
              status: "DA_DOC" as const,
            })),
            unreadCount: 0,
            readCount: old.allCount,
          };
        },
      );

      queryClient.setQueryData<UnreadCountResponse>(
        adminNotificationKeys.unreadCount(),
        { count: 0 },
      );

      return { previousCount };
    },
    onSuccess: () => {
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc.");
    },
    onError: (error: Error, _vars, ctx) => {
      if (ctx?.previousCount) {
        queryClient.setQueryData(
          adminNotificationKeys.unreadCount(),
          ctx.previousCount,
        );
      }
      toast.error(error.message || "Không thể đánh dấu tất cả đã đọc.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: adminNotificationKeys.all,
      });
    },
  });

  const deleteOneMutation = useMutation<
    DeleteNotificationResponse,
    Error,
    string
  >({
    mutationFn: (id) =>
      requestNotificationApi<DeleteNotificationResponse>(
        `/notifications/${id}`,
        { method: "DELETE" },
        "Không thể xóa thông báo.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      void queryClient.invalidateQueries({
        queryKey: adminNotificationKeys.all,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể xóa thông báo.");
    },
  });

  const deleteAllReadMutation = useMutation<
    DeleteNotificationResponse,
    Error,
    void
  >({
    mutationFn: () =>
      requestNotificationApi<DeleteNotificationResponse>(
        "/notifications/read",
        { method: "DELETE" },
        "Không thể dọn thông báo đã đọc.",
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      void queryClient.invalidateQueries({
        queryKey: adminNotificationKeys.all,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Không thể dọn thông báo đã đọc.");
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllRead: markAllAsReadMutation.isPending,
    deleteOne: deleteOneMutation.mutate,
    isDeletingOne: deleteOneMutation.isPending,
    deleteAllRead: deleteAllReadMutation.mutate,
    isDeletingRead: deleteAllReadMutation.isPending,
  };
}
