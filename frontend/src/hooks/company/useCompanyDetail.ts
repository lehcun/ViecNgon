import { useQuery } from "@tanstack/react-query";
import { CompanyDetailResponse } from "@viecngon/types";

const fetchCompanyDetail = async (
  slug: string,
): Promise<CompanyDetailResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/company/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể tải thông tin công ty");
  }

  return response.json();
};

export const useCompanyDetail = (slug: string) => {
  const query = useQuery({
    // QueryKey có chứa slug: Giúp React Query phân biệt cache của từng công ty khác nhau
    queryKey: ["companyDetail", slug],

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
  };
};
