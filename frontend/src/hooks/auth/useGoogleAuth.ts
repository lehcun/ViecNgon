import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

export const useGoogleRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ accessToken }: { accessToken: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Đăng ký bằng Google thất bại");
      }

      return res.json();
    },
    onSuccess: (data) => setUser(data),
  });
};

export const useGoogleLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ accessToken }: { accessToken: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Đăng nhập bằng Google thất bại");
      }

      return res.json();
    },
    onSuccess: (data) => setUser(data),
  });
};
