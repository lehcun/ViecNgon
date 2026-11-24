"use client";

import { useQuery } from "@tanstack/react-query";
import type { RecommendedJobsResponse } from "@viecngon/types";
import { API_BASE_URL } from "@/lib/env";
import { jobKeys } from "@/queries/queryKeys";

export function useRecommendedJobs(enabled: boolean, limit = 12) {
  return useQuery<RecommendedJobsResponse>({
    queryKey: jobKeys.recommended(limit),
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/jobs/recommended?limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách việc làm gợi ý.");
      }

      return response.json();
    },
    enabled,
    staleTime: 60 * 1000,
  });
}
