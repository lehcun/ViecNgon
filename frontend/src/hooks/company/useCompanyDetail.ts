import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CompanyDetailResponse,
  CompanyFollowResponse,
} from "@viecngon/types";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/env";
import { companyKeys } from "@/queries/queryKeys";

const fetchCompanyDetail = async (
  slug: string,
): Promise<CompanyDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/company/${slug}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể tải thông tin công ty");
  }

  return response.json();
};

export const useCompanyDetail = (slug: string) => {
  const query = useQuery({
    // QueryKey tập trung theo slug: Giúp React Query phân biệt cache của từng công ty khác nhau
    queryKey: companyKeys.detail(slug),

    queryFn: () => fetchCompanyDetail(slug),

    // Đảm bảo chỉ gọi API khi đã có slug (Tránh lỗi gọi API với slug bị undefined)
    enabled: !!slug,

    // Tùy chọn: Không tự động refetch khi chuyển tab để tránh gọi API thừa thãi
    refetchOnWindowFocus: false,
  });

  return {
    company: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export function useCompanyFollow(companyId?: string, enabled = false) {
  return useQuery<CompanyFollowResponse>({
    queryKey: companyKeys.followStatus(companyId || ""),
    enabled: Boolean(companyId) && enabled,
    staleTime: 60_000,
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/company/${companyId}/follow-status`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Không thể kiểm tra trạng thái theo dõi",
        );
      }
      return (await response.json()) as CompanyFollowResponse;
    },
  });
}

export function useToggleCompanyFollow(companyId: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation<CompanyFollowResponse, Error>({
    mutationFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/company/${companyId}/follow`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Không thể cập nhật trạng thái theo dõi",
        );
      }
      return (await response.json()) as CompanyFollowResponse;
    },
    onSuccess: async (data) => {
      if (data.message) {
        toast.success(data.message);
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: companyKeys.followStatus(companyId),
        }),
        queryClient.invalidateQueries({
          queryKey: companyKeys.detail(slug),
        }),
      ]);
    },
    onError: (err) => {
      toast.error(err.message || "Thao tác thất bại, vui lòng thử lại.");
    },
  });
}
