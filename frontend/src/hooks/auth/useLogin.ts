import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@viecngon/types";
import { throwApiFormError } from "@/lib/validation";

const fetchLogin = async (
  credentials: Record<string, string>,
): Promise<LoginResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    },
  );

  if (!response.ok) {
    await throwApiFormError(response, "Đăng nhập thất bại");
  }

  return response.json();
};

export const useLogin = () => {
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (credentials: Record<string, string>) =>
      fetchLogin(credentials),
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  return {
    ...mutation,
    login: mutation.mutateAsync,
  };
};
