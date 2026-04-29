import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@viecngon/types";

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
    const errorData = await response.json();
    throw new Error(errorData.message || "Đăng nhập thất bại");
  }

  return response.json();
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (credentials: Record<string, string>) =>
      fetchLogin(credentials),
    onSuccess: (data) => {
      // Data Layer: Tự động lưu user vào Zustand ngay khi đăng nhập thành công
      setUser(data.user);
    },
  });

  return {
    ...mutation,
    login: mutation.mutate,
  };
};
