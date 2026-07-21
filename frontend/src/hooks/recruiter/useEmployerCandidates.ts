import { useQuery } from "@tanstack/react-query";
import { ApplicationItem } from "@viecngon/types";

export const useEmployerApplication = () => {
  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useQuery<ApplicationItem[]>({
    queryKey: ["employer-application"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/employer`,
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
    applications,
    isLoading,
    isError,
    error,
  };
};
