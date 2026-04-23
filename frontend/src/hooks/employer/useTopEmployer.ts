import { useQuery } from "@tanstack/react-query";

export interface Employer {
  name: string;
  logo: string;
  jobs: number;
  location: string;
  color?: string;
}

const fetchTopEmployers = async (): Promise<Employer[]> => {
  const response = await fetch("http://localhost:3001/employer/top");

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
    brands: query.data,
  };
};
