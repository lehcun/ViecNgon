import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplyParsedCvPayload, CandidateProfileResponse } from "@viecngon/types";
import toast from "react-hot-toast";

interface ApplyParsedCvResponse {
  message: string;
  profile: CandidateProfileResponse;
}

export const useApplyParsedCv = () => {
  const queryClient = useQueryClient();

  return useMutation<ApplyParsedCvResponse, Error, ApplyParsedCvPayload>({
    mutationFn: async (payload: ApplyParsedCvPayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/cv/apply-parsed-data`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Không thể lưu dữ liệu CV vào hồ sơ.",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Đã cập nhật hồ sơ từ CV thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Lưu dữ liệu CV thất bại.");
    },
  });
};

