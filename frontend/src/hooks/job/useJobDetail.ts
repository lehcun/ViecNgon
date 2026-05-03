import { useQuery } from "@tanstack/react-query";
import { JobDetailResponse } from "@viecngon/types";

const fetchJobDetail = async (slug: string): Promise<JobDetailResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job/${slug}`,
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

export const useJobDetail = (slug: string) => {
  const query = useQuery({
    queryKey: ["jobDetail", slug],
    queryFn: () => fetchJobDetail(slug),

    enabled: !!slug,

    refetchOnWindowFocus: false,
  });

  return {
    job: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
