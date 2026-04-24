import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
  message: string;
  user: {
    maTaiKhoan: string;
    email: string;
    tenNguoiDung: string;
    vaiTro: string;
  };
}

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
  const mutation = useMutation({
    mutationFn: (credentials: Record<string, string>) =>
      fetchLogin(credentials),
  });

  return {
    ...mutation,
    login: mutation.mutate,
  };
};
