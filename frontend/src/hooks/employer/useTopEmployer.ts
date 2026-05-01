import { useQuery } from "@tanstack/react-query";
import { Company } from "@viecngon/types";

const fetchTopCompanies = async (): Promise<Company[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/company/top`,
  );

  if (!response.ok) {
    throw new Error(
      "Không thể kết nối đến máy chủ để lấy dữ liệu top công ty.",
    );
  }

  return response.json();
};

export const useTopCompanies = () => {
  const query = useQuery({
    queryKey: ["topCompanies"],
    queryFn: fetchTopCompanies,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    ...query,
    companies: query.data,
  };
};
