import { useQuery } from "@tanstack/react-query";
import Employer from "@/types";

const fetchTopEmployers = async (): Promise<Employer[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employer/top`,
  );

  if (!response.ok) {
    throw new Error(
      "Không thể kết nối đến máy chủ để lấy dữ liệu top công ty.",
    );
  }

  return response.json();
};

export const useTopEmployers = () => {
  const query = useQuery({
    queryKey: ["topEmployers"],
    queryFn: fetchTopEmployers,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    ...query,
    employers: query.data,
  };
};
