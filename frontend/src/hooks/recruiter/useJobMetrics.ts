"use client";

import { useQuery } from "@tanstack/react-query";
import { RecruiterJobMetricsResponse } from "@viecngon/types";

const fetchJobMetrics = async (): Promise<RecruiterJobMetricsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recruiter/job/metrics`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Không thể tải các chỉ số thống kê bài đăng.",
    );
  }

  return response.json();
};

export const useJobMetrics = () => {
  return useQuery({
    queryKey: ["jobMetrics"],
    queryFn: fetchJobMetrics,
    staleTime: 5 * 60 * 1000, // Tái sử dụng dữ liệu trong 5 phút để tránh gọi API liên tục
    retry: 1,
  });
};
