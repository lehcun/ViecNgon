import { useQuery } from "@tanstack/react-query";
import { ApplicationItem } from "@viecngon/types";

export const useEmployerCandidates = () => {
  const {
    data: candidates = [],
    isLoading,
    isError,
    error,
  } = useQuery<ApplicationItem[]>({
    queryKey: ["employer-candidates"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/application`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách ứng viên");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    candidates,
    isLoading,
    isError,
    error,
  };
};
