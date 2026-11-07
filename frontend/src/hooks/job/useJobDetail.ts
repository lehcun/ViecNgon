import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobDetailResponse } from "@viecngon/types";
import toast from "react-hot-toast";

// 1. Fetch Job Detail
const fetchJobDetail = async (slugOrId: string): Promise<JobDetailResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job/${slugOrId}`,
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
    throw new Error(errorData.message || "Không thể tải thông tin công việc");
  }

  return response.json();
};

export const useJobDetail = (slugOrId: string) => {
  const query = useQuery({
    queryKey: ["jobDetail", slugOrId],
    queryFn: () => fetchJobDetail(slugOrId),
    enabled: !!slugOrId,
    refetchOnWindowFocus: false,
  });

  return {
    job: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// 2. Fetch Related Jobs
const fetchRelatedJobs = async (slugOrId: string): Promise<JobDetailResponse[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job/${slugOrId}/related`,
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
    throw new Error(errorData.message || "Không thể tải danh sách việc làm liên quan");
  }

  return response.json();
};

export const useRelatedJobs = (slugOrId: string) => {
  const query = useQuery({
    queryKey: ["relatedJobs", slugOrId],
    queryFn: () => fetchRelatedJobs(slugOrId),
    enabled: !!slugOrId,
    refetchOnWindowFocus: false,
  });

  return {
    relatedJobs: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// 3. Mutation Apply Job
export interface ApplyJobPayload {
  maCongViec: string;
  maCvFile?: string;
  coverLetter?: string;
  chiTiet?: string;
  fileCvUrl?: string;
}

const applyForJobAPI = async (payload: ApplyJobPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/candidate/applications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể nộp đơn xin việc lúc này.");
  }

  return response.json();
};

export const useApplyJob = (jobSlugOrId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyForJobAPI,
    onSuccess: (data) => {
      toast.success("Nộp đơn ứng tuyển thành công!");
      if (jobSlugOrId) {
        queryClient.invalidateQueries({ queryKey: ["jobDetail", jobSlugOrId] });
      }
      queryClient.invalidateQueries({ queryKey: ["jobDetail"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi nộp đơn ứng tuyển");
    },
  });
};
