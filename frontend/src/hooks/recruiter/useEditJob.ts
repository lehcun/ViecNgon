"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type {
  EmployerJobDetailResponse,
  UpdateEmployerJobPayload,
} from "@viecngon/types";
import { EMPLOYER_JOBS_QUERY_KEY } from "./useEmployerJobs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Hook fetch chi tiết một tin tuyển dụng của NTD để xem hoặc fill form sửa
 */
export function useEmployerJobDetail(jobId: string) {
  return useQuery<EmployerJobDetailResponse, Error>({
    queryKey: ["employerJobDetail", jobId],
    queryFn: async ({ signal }) => {
      if (!jobId) {
        throw new Error("Mã tin tuyển dụng không hợp lệ.");
      }

      const res = await fetch(`${API_BASE_URL}/employer/jobs/${jobId}`, {
        method: "GET",
        credentials: "include",
        signal,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const errorMsg =
          (Array.isArray(errorJson?.message)
            ? errorJson.message[0]
            : errorJson?.message) || "Không thể tải thông tin tin tuyển dụng.";
        throw new Error(errorMsg);
      }

      return res.json() as Promise<EmployerJobDetailResponse>;
    },
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2, // 2 phút
  });
}

/**
 * Hook Mutation cập nhật thông tin bài đăng tuyển dụng
 */
export function useUpdateEmployerJob(jobId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, Error, UpdateEmployerJobPayload>({
    mutationFn: async (payload: UpdateEmployerJobPayload) => {
      const res = await fetch(`${API_BASE_URL}/employer/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const errorMsg =
          (Array.isArray(errJson?.message)
            ? errJson.message.join(", ")
            : errJson?.message) || "Không thể cập nhật tin tuyển dụng.";
        throw new Error(errorMsg);
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Cập nhật tin tuyển dụng thành công!");
      queryClient.invalidateQueries({ queryKey: EMPLOYER_JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["employerJobDetail", jobId] });
      queryClient.invalidateQueries({ queryKey: ["recruiterMetrics"] });
      router.push("/employer/jobs");
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi cập nhật tin tuyển dụng.");
    },
  });
}

