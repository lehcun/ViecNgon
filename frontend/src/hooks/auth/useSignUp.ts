import { useMutation } from "@tanstack/react-query";

export interface SignupPayload {
  email: string;
  name: string;
  password: string;
  role: "UNGVIEN" | "NHATUYENDUNG";
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupPayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      // Bắt lỗi nếu Backend trả về 400 (Trùng email) hoặc 500
      if (!response.ok) {
        const errorData = await response.json();
        // Ném lỗi ra kèm theo message từ backend (VD: "Email này đã được sử dụng")
        throw new Error(errorData.message || "Đăng ký thất bại");
      }

      return response.json();
    },
  });
};
