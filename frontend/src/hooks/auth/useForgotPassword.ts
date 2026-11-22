import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/env";
import { throwApiFormError } from "@/lib/validation";

export interface ForgotPasswordPayload {
  email: string;
  portal?: "candidate" | "employer";
}

export interface ForgotPasswordResponse {
  message: string;
}

const requestForgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiFormError(
      response,
      "Không thể gửi yêu cầu khôi phục mật khẩu",
    );
  }

  return response.json();
};

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      requestForgotPassword(payload),
  });

  return {
    ...mutation,
    sendResetLink: mutation.mutateAsync,
  };
};
