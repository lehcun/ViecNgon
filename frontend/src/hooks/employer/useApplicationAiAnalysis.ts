import { useQuery } from "@tanstack/react-query";
import { AiMatchResult } from "@viecngon/types";
import { applicationKeys } from "@/queries/queryKeys";

export const useApplicationAiAnalysis = (maDon: string, enabled = true) => {
  return useQuery<AiMatchResult, Error>({
    queryKey: applicationKeys.aiAnalysis(maDon),
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employer/applications/${maDon}/ai-analysis`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Không thể tải phân tích AI cho hồ sơ này.",
        );
      }

      return response.json();
    },
    enabled: Boolean(maDon) && enabled,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};

