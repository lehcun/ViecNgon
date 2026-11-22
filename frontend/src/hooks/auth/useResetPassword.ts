import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/env";
import { throwApiFormError } from "@/lib/validation";

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  role?: string;
}

const requestResetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiFormError(response, "Không thể đặt lại mật khẩu");
  }

  return response.json();
};

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      requestResetPassword(payload),
  });

  return {
    ...mutation,
    resetPassword: mutation.mutateAsync,
  };
};
