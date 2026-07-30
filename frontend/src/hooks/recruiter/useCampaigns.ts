import { useQuery } from "@tanstack/react-query";
import { CampaignResponse } from "@viecngon/types";

export const useCampaigns = () => {
  const query = useQuery<CampaignResponse[]>({
    queryKey: ["my-campaigns"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/my-campaigns`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Lỗi khi tải danh sách chiến dịch");
      return res.json();
    },
    staleTime: 0, // Luôn fetch mới nhất để HR thấy được số lượt đăng tin bị trừ
  });

  return {
    campaigns: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
