import { useQuery } from "@tanstack/react-query";
import type { CandidateProfileResponse } from "@viecngon/types";
import { candidateKeys } from "@/queries/queryKeys";

export const useCandidateProfile = () => {
  const query = useQuery<CandidateProfileResponse, Error>({
    queryKey: candidateKeys.profile(),
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu hồ sơ");
      }

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
