"use client";

import { useMutation } from "@tanstack/react-query";
import { ChangePasswordPayload } from "@viecngon/types";
import toast from "react-hot-toast";
import { throwApiFormError } from "@/lib/validation";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordPayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      if (!response.ok) {
        await throwApiFormError(response, "Đổi mật khẩu thất bại");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
