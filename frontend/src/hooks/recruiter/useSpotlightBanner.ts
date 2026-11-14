import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  SpotlightBannerConfigResponse,
  UpdateSpotlightBannerPayload,
} from "@viecngon/types";
import { companyKeys, recruiterKeys } from "@/queries/queryKeys";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useSpotlightBanner = (enabled = true) => {
  const queryClient = useQueryClient();

  const configQuery = useQuery<SpotlightBannerConfigResponse>({
    queryKey: recruiterKeys.spotlightBanner(),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/recruiter/spotlight-banner`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.message || "Không thể tải cấu hình Banner Nhà tuyển dụng nổi bật",
        );
      }
      return res.json();
    },
    enabled,
    staleTime: 1000 * 60,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: UpdateSpotlightBannerPayload) => {
      const res = await fetch(`${API_BASE}/recruiter/spotlight-banner`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Lưu cấu hình Banner thất bại");
      }

      return (await res.json()) as SpotlightBannerConfigResponse;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(recruiterKeys.spotlightBanner(), updated);
      void queryClient.invalidateQueries({
        queryKey: companyKeys.featuredBanners(),
      });
      toast.success("Đã cập nhật Banner Nhà Tuyển Dụng Nổi Bật!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Có lỗi xảy ra khi lưu cấu hình Banner");
    },
  });

  const uploadCoverMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/recruiter/spotlight-banner/cover`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Tải ảnh nền lên thất bại");
      }

      return (await res.json()) as { url: string };
    },
    onError: (err: Error) => {
      toast.error(err.message || "Upload ảnh nền thất bại");
    },
  });

  return {
    config: configQuery.data,
    isLoading: configQuery.isLoading,
    isError: configQuery.isError,
    error: configQuery.error,
    refetch: configQuery.refetch,
    saveBanner: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    uploadCover: uploadCoverMutation.mutateAsync,
    isUploadingCover: uploadCoverMutation.isPending,
  };
};
