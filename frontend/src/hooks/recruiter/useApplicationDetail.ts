import { useQuery } from "@tanstack/react-query";
import { ApplicationDetailResponse } from "@viecngon/types";

export const useApplicationDetail = (maDon: string) => {
  return useQuery<ApplicationDetailResponse>({
    // Đưa maDon vào queryKey để React Query biết mỗi đơn là 1 bộ cache riêng biệt
    queryKey: ["application-detail", maDon],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/employer/${maDon}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải chi tiết đơn ứng tuyển");
      }

      return response.json();
    },
    enabled: !!maDon, // Chỉ gọi API khi maDon đã tồn tại (không bị null)
  });
};
