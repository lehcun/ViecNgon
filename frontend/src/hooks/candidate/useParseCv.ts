import { useMutation } from "@tanstack/react-query";
import { ParseCvResponse } from "@viecngon/types";
import toast from "react-hot-toast";

export const useParseCv = () => {
  return useMutation<ParseCvResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/cv/parse`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Không thể phân tích file CV. Vui lòng thử lại.",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("AI đã bóc tách dữ liệu CV thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi bóc tách CV.");
    },
  });
};

