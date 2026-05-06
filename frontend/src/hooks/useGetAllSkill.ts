import { useQuery } from "@tanstack/react-query";
import { SkillResponse } from "@viecngon/types";

const fetchAllSkill = async (): Promise<SkillResponse[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể tải tất cả kỹ năng");
  }
  const data = await response.json();

  return data;
};

export const useAllSkill = () => {
  const query = useQuery({
    queryKey: ["allSkill"],
    queryFn: () => fetchAllSkill(),

    refetchOnWindowFocus: false,
  });

  return {
    allSkill: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
