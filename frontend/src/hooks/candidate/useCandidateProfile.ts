import { useQuery } from "@tanstack/react-query";
import { CandidateProfileResponse } from "@viecngon/types";

export const useCandidateProfile = () => {
  const query = useQuery<CandidateProfileResponse, Error>({
    queryKey: ["candidateProfile"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      // Fetch không tự throw error với HTTP status 4xx, 5xx nên phải tự check
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu hồ sơ");
      }

      // Phải gọi hàm json() để parse dữ liệu trả về
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    candidateProfile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
