import { useMutation } from "@tanstack/react-query";
import type {
  RegisterEmployerPayload,
  RegisterEmployerResponse,
} from "@viecngon/types";
import { throwApiFormError } from "@/lib/validation";

export function useRegisterEmployer() {
  return useMutation({
    mutationFn: async (
      payload: RegisterEmployerPayload,
    ): Promise<RegisterEmployerResponse> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/employer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        },
      );

      if (!response.ok) {
        await throwApiFormError(
          response,
          "Đăng ký tài khoản Nhà tuyển dụng thất bại.",
        );
      }

      return response.json() as Promise<RegisterEmployerResponse>;
    },
  });
}
