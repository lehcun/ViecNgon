import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationItemResponse } from "@viecngon/types";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. Fetch danh sách thông báo
  const query = useQuery<NotificationItemResponse[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Lỗi tải thông báo");
      return res.json();
    },
    refetchInterval: 60000, // Tự động gọi lại API mỗi 1 phút (Polling) để lấy thông báo mới
  });

  // 2. Logic đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Lỗi khi cập nhật");
      return res.json();
    },
    // Chạy ngầm cập nhật lại danh sách để số ở chuông đỏ tự giảm xuống
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    markAsRead: markAsReadMutation.mutate,
  };
};
