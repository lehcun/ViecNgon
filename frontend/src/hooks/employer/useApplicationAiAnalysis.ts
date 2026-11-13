import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiMatchResult } from "@viecngon/types";
import toast from "react-hot-toast";
import { applicationKeys } from "@/queries/queryKeys";

const fetchAiAnalysis = async (
  maDon: string,
  refresh = false,
): Promise<AiMatchResult> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/employer/applications/${maDon}/ai-analysis${
    refresh ? "?refresh=true" : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Không thể tải phân tích AI cho hồ sơ này.",
    );
  }

  return response.json();
};

export const useApplicationAiAnalysis = (maDon: string, enabled = true) => {
  return useQuery<AiMatchResult, Error>({
    queryKey: applicationKeys.aiAnalysis(maDon),
    queryFn: () => fetchAiAnalysis(maDon, false),
    enabled: Boolean(maDon) && enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useRescanApplicationAi = (maDon: string) => {
  const queryClient = useQueryClient();

  return useMutation<AiMatchResult, Error, void>({
    mutationFn: () => fetchAiAnalysis(maDon, true),
    onSuccess: (data) => {
      queryClient.setQueryData(applicationKeys.aiAnalysis(maDon), data);
      toast.success("Đã quét lại điểm phù hợp AI!");
    },
    onError: (error) => {
      toast.error(error.message || "Không thể quét lại điểm AI lúc này.");
    },
  });
};
