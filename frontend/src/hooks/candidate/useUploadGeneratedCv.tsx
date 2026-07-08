import { useMutation, useQueryClient } from "@tanstack/react-query";

const cvService = {
  uploadGeneratedCv: async (formData: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/candidate/cv/upload-generated`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    if (!response.ok) {
      // Bắt lỗi từ Backend trả về
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Đã xảy ra lỗi khi lưu CV");
    }

    return response.json();
  },
};

export const useUploadGeneratedCv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => cvService.uploadGeneratedCv(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
};
