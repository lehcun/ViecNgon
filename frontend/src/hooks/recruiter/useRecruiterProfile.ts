import { useQuery } from "@tanstack/react-query";
import { RecruiterProfileResponse } from "@viecngon/types";

// ---------------------------------------------------------
// HOOK 1: LẤY THÔNG TIN HỒ SƠ HR & CÔNG TY (GET)
// ---------------------------------------------------------
export const useRecruiterProfile = () => {
  const query = useQuery<RecruiterProfileResponse>({
    queryKey: ["recruiterProfile"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recruiter/profile`,
        {
          method: "GET",
          credentials: "include", // Bắt buộc để gửi kèm Token Cookie
        },
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu nhà tuyển dụng");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Tái sử dụng dữ liệu trong 5 phút
    retry: 1,
  });

  return {
    recruiterProfile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
