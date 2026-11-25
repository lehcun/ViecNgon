"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  CandidateEvaluationItemDto,
  CreateCandidateEvaluationPayload,
} from "@viecngon/types";
import { reviewKeys } from "@/queries/queryKeys";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function parseErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body?.message) && body.message.length > 0) {
      return String(body.message[0]);
    }
    if (typeof body?.message === "string" && body.message.trim()) {
      return body.message;
    }
  } catch {
    // ignore JSON parse error
  }
  return fallback;
}

export function useCandidateEvaluations(maDon?: string, enabled = true) {
  return useQuery<CandidateEvaluationItemDto[]>({
    queryKey: reviewKeys.application(maDon || ""),
    enabled: Boolean(maDon) && enabled,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/reviews/applications/${maDon}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(
            res,
            "Không thể tải danh sách đánh giá ứng viên.",
          ),
        );
      }
      return (await res.json()) as CandidateEvaluationItemDto[];
    },
  });
}

export function useCreateCandidateEvaluation(maDon: string) {
  const queryClient = useQueryClient();

  return useMutation<
    CandidateEvaluationItemDto,
    Error,
    CreateCandidateEvaluationPayload
  >({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_BASE}/reviews/applications/${maDon}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Không thể lưu phiếu đánh giá ứng viên."),
        );
      }
      return (await res.json()) as CandidateEvaluationItemDto;
    },
    onSuccess: (created) => {
      toast.success(
        created.chiaSeUngVien
          ? "Đã lưu phiếu đánh giá và gửi thông báo nhận xét tới ứng viên!"
          : "Đã lưu phiếu đánh giá ứng viên (nội bộ HR)!",
      );
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.application(maDon),
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
