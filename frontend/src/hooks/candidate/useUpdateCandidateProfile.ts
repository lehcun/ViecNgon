import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCandidatePayload } from "@viecngon/types";
import { candidateKeys } from "@/queries/queryKeys";
import { useAuthStore } from "@/store/authStore";

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
    onSuccess: (_result, variables) => {
      // Dọn dẹp cache để form tự động lấy dữ liệu mới
      void queryClient.invalidateQueries({ queryKey: candidateKeys.profile() });

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          ...(variables.userName ? { name: variables.userName } : {}),
          ...(variables.avatarUrl !== undefined
            ? { avatarUrl: variables.avatarUrl || undefined }
            : {}),
        });
      }
    },
  });

  return {
    updateCandidateProfile: mutation.mutate,
    updateCandidateProfileAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
