import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${jobId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Không thể xóa công việc này");
      }
      return response.json();
    },

    // Chỉ làm nhiệm vụ của Data Layer: Cập nhật lại bộ nhớ đệm
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiterProfile"] });
    },

    // Bỏ qua onError ở đây, để Component tự lo
  });
};
