import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCandidatePayload } from "@viecngon/types";

export const useUpdateCandidateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateCandidatePayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", // Bắt buộc phải khai báo Headers
          },
          body: JSON.stringify(data), // Phải ép kiểu Object về chuỗi JSON
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật hồ sơ");
      }

      return response.json();
    },
    onSuccess: () => {
      // Dọn dẹp cache để form tự động lấy dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });

  return {
    updateCandidateProfile: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
