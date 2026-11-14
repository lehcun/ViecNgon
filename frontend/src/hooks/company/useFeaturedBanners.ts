import { useQuery } from "@tanstack/react-query";
import { FeaturedEmployerBannerItem } from "@viecngon/types";
import { companyKeys } from "@/queries/queryKeys";

export const useFeaturedBanners = () => {
  return useQuery<FeaturedEmployerBannerItem[]>({
    queryKey: companyKeys.featuredBanners(),
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/featured-banners`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) {
        return [];
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};
