import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  NotificationItemResponse,
  NotificationListResponse,
  UnreadCountResponse,
} from "@viecngon/types";

export type NotificationFilterType = "ALL" | "UNREAD" | "READ";

interface UseNotificationsOptions {
  initialFilter?: NotificationFilterType;
  initialPage?: number;
  limit?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<NotificationFilterType>(
    options.initialFilter || "ALL",
  );
  const [page, setPage] = useState<number>(options.initialPage || 1);
  const limit = options.limit || 20;

  // =========================================================================
  // 1. QUERY: LẤY DANH SÁCH THÔNG BÁO (PHÂN TRANG & FILTER)
  // =========================================================================
  const listQueryKey = ["candidate-notifications", { filter, page, limit }];

  const listQuery = useQuery<NotificationListResponse>({
    queryKey: listQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        filter,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`${API_BASE}/candidate/notifications?${params}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Không thể tải danh sách thông báo");
      }

      return res.json();
    },
    refetchInterval: 30000, // Tự động refetch mỗi 30s để cập nhật
    staleTime: 10000,
  });

  // =========================================================================
  // 2. QUERY: LẤY SỐ LƯỢNG THÔNG BÁO CHƯA ĐỌC ĐỂ HIỂN THỊ BADGE ĐỎ
  // =========================================================================
  const unreadCountKey = ["candidate-notifications-unread-count"];

  const unreadCountQuery = useQuery<UnreadCountResponse>({
    queryKey: unreadCountKey,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/candidate/notifications/unread-count`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Không thể tải số thông báo chưa đọc");
      }

      return res.json();
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // =========================================================================
  // 3. MUTATION: ĐÁNH DẤU 1 THÔNG BÁO LÀ ĐÃ ĐỌC (OPTIMISTIC UPDATE)
  // =========================================================================
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${API_BASE}/candidate/notifications/${id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Lỗi khi cập nhật trạng thái thông báo");
      }

      return res.json();
    },
    onMutate: async (id: string) => {
      // 1. Huỷ các refetch ngầm đang chạy để tránh ghi đè dữ liệu lạc quan
      await queryClient.cancelQueries({ queryKey: ["candidate-notifications"] });
      await queryClient.cancelQueries({ queryKey: unreadCountKey });

      // 2. Lưu lại bản sao lưu (snapshot) trước khi sửa để phòng trường hợp lỗi
      const previousListData = queryClient.getQueryData<NotificationListResponse>(listQueryKey);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(unreadCountKey);

      // 3. Optimistic Update trong Cache danh sách
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: ["candidate-notifications"] },
        (old) => {
          if (!old) return old;

          const updatedData = old.data.map((item) =>
            item.id === id ? { ...item, status: "DA_DOC" as const } : item,
          );

          return {
            ...old,
            data: updatedData,
            unreadCount: Math.max(0, old.unreadCount - 1),
            readCount: old.readCount + 1,
          };
        },
      );

      // 4. Optimistic Update cho số đếm chưa đọc
      queryClient.setQueryData<UnreadCountResponse>(unreadCountKey, (old) => {
        if (!old) return { count: 0 };
        return { count: Math.max(0, old.count - 1) };
      });

      return { previousListData, previousUnreadCount };
    },
    onError: (_err, _id, context) => {
      // Rollback lại dữ liệu cũ nếu API thất bại
      if (context?.previousListData) {
        queryClient.setQueryData(listQueryKey, context.previousListData);
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(unreadCountKey, context.previousUnreadCount);
      }
    },
    onSettled: () => {
      // Đồng bộ lại với Backend
      queryClient.invalidateQueries({ queryKey: ["candidate-notifications"] });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });

  // =========================================================================
  // 4. MUTATION: ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC (OPTIMISTIC UPDATE)
  // =========================================================================
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${API_BASE}/candidate/notifications/read-all`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Lỗi khi đánh dấu tất cả đã đọc");
      }

      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["candidate-notifications"] });
      await queryClient.cancelQueries({ queryKey: unreadCountKey });

      const previousListData = queryClient.getQueryData<NotificationListResponse>(listQueryKey);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(unreadCountKey);

      // Optimistic update chuyển tất cả sang DA_DOC
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: ["candidate-notifications"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) => ({ ...item, status: "DA_DOC" as const })),
            unreadCount: 0,
            readCount: old.allCount,
          };
        },
      );

      queryClient.setQueryData<UnreadCountResponse>(unreadCountKey, { count: 0 });

      return { previousListData, previousUnreadCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousListData) {
        queryClient.setQueryData(listQueryKey, context.previousListData);
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(unreadCountKey, context.previousUnreadCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-notifications"] });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });

  const notifications: NotificationItemResponse[] = listQuery.data?.data || [];
  const unreadCount =
    unreadCountQuery.data?.count ?? listQuery.data?.unreadCount ?? 0;
  const readCount = listQuery.data?.readCount ?? 0;
  const allCount = listQuery.data?.allCount ?? listQuery.data?.total ?? 0;
  const total = listQuery.data?.total ?? 0;
  const totalPages = listQuery.data?.totalPages ?? 1;

  return {
    notifications,
    unreadCount,
    readCount,
    allCount,
    total,
    totalPages,
    page,
    setPage,
    filter,
    setFilter,
    isLoading: listQuery.isLoading,
    isRefetching: listQuery.isRefetching,
    isError: listQuery.isError,
    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    isMarkingAllRead: markAllAsReadMutation.isPending,
  };
};
