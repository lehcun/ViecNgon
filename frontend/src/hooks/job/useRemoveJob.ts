import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useRemoveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. Hàm gọi API xóa
    mutationFn: async (jobId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể xóa việc làm");
      }

      return res.json();
    },

    // 2. Xử lý sau khi xóa thành công
    onSuccess: () => {
      toast.success("Đã xóa tin tuyển dụng thành công!");

      // QUAN TRỌNG: Làm mới (Invalidate) danh sách việc làm để UI tự cập nhật lại
      // mà không cần người dùng F5 trang
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Nếu bạn có trang dashboard riêng của HR:
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
    },

    // 3. Xử lý khi có lỗi
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
