"use client";

import { useQuery } from "@tanstack/react-query";
import type { EmployerLandingDataResponse } from "@viecngon/types";
import { API_BASE_URL } from "@/lib/env";
import { companyKeys } from "@/queries/queryKeys";

export function useEmployerLandingData() {
  return useQuery<EmployerLandingDataResponse>({
    queryKey: companyKeys.employerLanding(),
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/company/employer-landing`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Không thể tải dữ liệu cổng Nhà tuyển dụng.");
      }
      return res.json() as Promise<EmployerLandingDataResponse>;
    },
    staleTime: 5 * 60 * 1000,
  });
}
