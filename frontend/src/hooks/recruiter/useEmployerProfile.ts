"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  CompanyProfileResponse,
  UpdateCompanyProfilePayload,
  UpdateCompanyProfileResponse,
} from "@viecngon/types";

// =====================================================================
// CẤU HÌNH & CONSTANTS
// =====================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const EMPLOYER_PROFILE_URL = `${API_BASE_URL}/employer/profile`;

/** Query key định danh hồ sơ doanh nghiệp trong TanStack Query cache */
export const EMPLOYER_PROFILE_QUERY_KEY = ["employerProfile"] as const;

// =====================================================================
// LỚP LỖI TUỲ CHỈNH (CUSTOM API ERROR)
// =====================================================================

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

/** Trích xuất chi tiết lỗi trả về từ NestJS ExceptionFilter */
async function parseResponseError(
  response: Response,
  fallbackMsg: string,
): Promise<EmployerProfileApiError> {
  try {
    const errorJson = await response.json();
    const rawMessage = errorJson?.message;

    if (Array.isArray(rawMessage)) {
      // Trường hợp class-validator trả về mảng danh sách lỗi
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

// =====================================================================
// FETCHERS (HTTP REQUESTS)
// =====================================================================

/**
 * Gọi API GET thông tin hồ sơ doanh nghiệp
 * BẮT BUỘC: credentials: "include" để truyền HttpOnly Cookie xác thực
 */
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

/**
 * Gọi API PATCH cập nhật hồ sơ doanh nghiệp
 */
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

// =====================================================================
// CUSTOM HOOKS (TANSTACK REACT QUERY V5)
// =====================================================================

/**
 * 1. Hook fetch dữ liệu hồ sơ doanh nghiệp
 * - Cache tự động, tái sử dụng dữ liệu trong 5 phút (staleTime).
 * - Không retry các lỗi xác thực (401, 403, 404).
 */
export function useEmployerProfile(): UseQueryResult<
  CompanyProfileResponse,
  EmployerProfileApiError
> {
  return useQuery<CompanyProfileResponse, EmployerProfileApiError>({
    queryKey: EMPLOYER_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => getEmployerProfile(signal),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Chỉ thử lại với lỗi hệ thống 5xx, không retry lỗi 4xx
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 2;
    },
  });
}

/**
 * 2. Hook cập nhật hồ sơ doanh nghiệp
 * - Tự động gọi queryClient.invalidateQueries để làm mới cache khi update thành công.
 * - Trả về mutate, trạng thái isPending, isSuccess, isError, error.
 */
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
      // Tự động làm mới dữ liệu cache ngay khi cập nhật thành công
      await queryClient.invalidateQueries({
        queryKey: EMPLOYER_PROFILE_QUERY_KEY,
      });
    },
  });
}
