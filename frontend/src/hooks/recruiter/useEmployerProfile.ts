"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  CompanyProfilePostItem,
  CompanyProfileResponse,
  CreateCompanyPostPayload,
  UpdateCompanyPostPayload,
  UpdateCompanyProfilePayload,
  UpdateCompanyProfileResponse,
} from "@viecngon/types";
import { API_BASE_URL } from "@/lib/env";
import { companyKeys, recruiterKeys } from "@/queries/queryKeys";

const EMPLOYER_PROFILE_URL = `${API_BASE_URL}/employer/profile`;
const EMPLOYER_PROFILE_POSTS_URL = `${EMPLOYER_PROFILE_URL}/posts`;

/** Query key định danh hồ sơ doanh nghiệp trong TanStack Query cache */
export const EMPLOYER_PROFILE_QUERY_KEY = recruiterKeys.companyProfile();

export class EmployerProfileApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly validationErrors: string[] = [],
  ) {
    super(message);
    this.name = "EmployerProfileApiError";
  }
}

async function parseResponseError(
  response: Response,
  fallbackMsg: string,
): Promise<EmployerProfileApiError> {
  try {
    const errorJson = await response.json();
    const rawMessage = errorJson?.message;

    if (Array.isArray(rawMessage)) {
      return new EmployerProfileApiError(
        rawMessage[0] || fallbackMsg,
        response.status,
        rawMessage,
      );
    }

    if (typeof rawMessage === "string") {
      return new EmployerProfileApiError(rawMessage, response.status);
    }
  } catch {
    // Phản hồi không phải JSON hợp lệ -> Dùng fallback message
  }

  return new EmployerProfileApiError(fallbackMsg, response.status);
}

async function getEmployerProfile(
  signal?: AbortSignal,
): Promise<CompanyProfileResponse> {
  const response = await fetch(EMPLOYER_PROFILE_URL, {
    method: "GET",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw await parseResponseError(
      response,
      "Không thể tải thông tin hồ sơ doanh nghiệp.",
    );
  }

  return (await response.json()) as CompanyProfileResponse;
}

async function patchEmployerProfile(
  payload: UpdateCompanyProfilePayload,
): Promise<UpdateCompanyProfileResponse> {
  const response = await fetch(EMPLOYER_PROFILE_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseResponseError(
      response,
      "Cập nhật hồ sơ doanh nghiệp thất bại. Vui lòng kiểm tra lại thông tin.",
    );
  }

  return (await response.json()) as UpdateCompanyProfileResponse;
}

export function useEmployerProfile(): UseQueryResult<
  CompanyProfileResponse,
  EmployerProfileApiError
> {
  return useQuery<CompanyProfileResponse, EmployerProfileApiError>({
    queryKey: EMPLOYER_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => getEmployerProfile(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 2;
    },
  });
}

export function useUpdateEmployerProfile(): UseMutationResult<
  UpdateCompanyProfileResponse,
  EmployerProfileApiError,
  UpdateCompanyProfilePayload
> {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCompanyProfileResponse,
    EmployerProfileApiError,
    UpdateCompanyProfilePayload
  >({
    mutationFn: patchEmployerProfile,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: EMPLOYER_PROFILE_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: companyKeys.all,
        }),
      ]);
    },
  });
}

export function useUploadCompanyImage(): UseMutationResult<
  { url: string },
  EmployerProfileApiError,
  File
> {
  return useMutation<{ url: string }, EmployerProfileApiError, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${EMPLOYER_PROFILE_URL}/upload-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw await parseResponseError(
          response,
          "Không thể tải ảnh lên hệ thống. Vui lòng thử lại.",
        );
      }

      return (await response.json()) as { url: string };
    },
  });
}

export function useCreateCompanyPost(): UseMutationResult<
  CompanyProfilePostItem,
  EmployerProfileApiError,
  CreateCompanyPostPayload
> {
  const queryClient = useQueryClient();

  return useMutation<
    CompanyProfilePostItem,
    EmployerProfileApiError,
    CreateCompanyPostPayload
  >({
    mutationFn: async (payload: CreateCompanyPostPayload) => {
      const response = await fetch(EMPLOYER_PROFILE_POSTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw await parseResponseError(
          response,
          "Không thể đăng bài viết mới. Vui lòng thử lại.",
        );
      }

      return (await response.json()) as CompanyProfilePostItem;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: EMPLOYER_PROFILE_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: companyKeys.all,
        }),
      ]);
    },
  });
}

export function useUpdateCompanyPost(): UseMutationResult<
  CompanyProfilePostItem,
  EmployerProfileApiError,
  { postId: string; payload: UpdateCompanyPostPayload }
> {
  const queryClient = useQueryClient();

  return useMutation<
    CompanyProfilePostItem,
    EmployerProfileApiError,
    { postId: string; payload: UpdateCompanyPostPayload }
  >({
    mutationFn: async ({ postId, payload }) => {
      const response = await fetch(`${EMPLOYER_PROFILE_POSTS_URL}/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw await parseResponseError(
          response,
          "Không thể cập nhật bài viết. Vui lòng thử lại.",
        );
      }

      return (await response.json()) as CompanyProfilePostItem;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: EMPLOYER_PROFILE_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: companyKeys.all,
        }),
      ]);
    },
  });
}

export function useDeleteCompanyPost(): UseMutationResult<
  { message: string; deletedId: string },
  EmployerProfileApiError,
  string
> {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; deletedId: string },
    EmployerProfileApiError,
    string
  >({
    mutationFn: async (postId: string) => {
      const response = await fetch(`${EMPLOYER_PROFILE_POSTS_URL}/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw await parseResponseError(
          response,
          "Không thể xóa bài viết. Vui lòng thử lại.",
        );
      }

      return (await response.json()) as { message: string; deletedId: string };
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: EMPLOYER_PROFILE_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: companyKeys.all,
        }),
      ]);
    },
  });
}
