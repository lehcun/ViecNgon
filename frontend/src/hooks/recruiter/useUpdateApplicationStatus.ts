import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      maDon,
      status,
    }: {
      maDon: string;
      status: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/employer/${maDon}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái ứng viên!");

      // QUAN TRỌNG: Báo cho React Query biết data đã cũ, cần gọi lại API GET để UI tự động cập nhật [1, 2]
      queryClient.invalidateQueries({ queryKey: ["employer-candidates"] });
      queryClient.invalidateQueries({ queryKey: ["recruiterProfile"] }); // Làm mới luôn số liệu thống kê ở Dashboard [10]
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
