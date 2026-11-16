import { useMutation } from "@tanstack/react-query";
import { RegisterResponse, SignupPayload, User } from "@viecngon/types";
import { useAuthStore } from "@/store/authStore";
import { throwApiFormError } from "@/lib/validation";

interface RegisterCandidateApiResponse {
  message?: string;
  accessToken?: string;
  user: RegisterResponse["user"] | User;
}

export const useSignup = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (
      data: SignupPayload,
    ): Promise<RegisterCandidateApiResponse> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/candidate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            hoTen: data.hoTen || data.name,
            password: data.password,
            soDienThoai: data.soDienThoai,
          }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        await throwApiFormError(response, "Đăng ký thất bại");
      }

      return response.json();
    },
    onSuccess: (res) => {
      if (res?.user) {
        setUser(res.user as User);
      }
    },
  });
};
