import { useQuery } from "@tanstack/react-query";

export const useApplicationDetail = (maDon: string) => {
  return useQuery({
    // Đưa maDon vào queryKey để React Query biết mỗi đơn là 1 bộ cache riêng biệt
    queryKey: ["application-detail", maDon],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${maDon}`,
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
