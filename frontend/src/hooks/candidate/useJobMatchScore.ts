import { useQuery } from "@tanstack/react-query";
import { AiMatchResult } from "@viecngon/types";
import { jobKeys } from "@/queries/queryKeys";

export const useJobMatchScore = (jobId: string, enabled = false) => {
  return useQuery<AiMatchResult, Error>({
    queryKey: jobKeys.matchPreview(jobId),
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/match-preview`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Không thể tính điểm tương thích AI.",
        );
      }

      return response.json();
    },
    enabled: Boolean(jobId) && enabled,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};

