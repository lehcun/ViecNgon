"use client";

import { useQuery } from "@tanstack/react-query";
import { AppliedJobItem } from "@viecngon/types";

// Hàm fetch API lấy danh sách việc làm đã ứng tuyển
const fetchAppliedJobs = async (): Promise<AppliedJobItem[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/candidate/applied-jobs`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Không thể lấy danh sách việc làm đã ứng tuyển",
    );
  }

  return response.json();
};

export const useAppliedJobs = () => {
  const {
    data: appliedJobs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: fetchAppliedJobs,
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    retry: 1,
  });

  return {
    appliedJobs,
    isLoading,
    isError,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
