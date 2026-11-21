"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UploadedImageResponse } from "@viecngon/types";
import { API_BASE_URL } from "@/lib/env";
import { candidateKeys } from "@/queries/queryKeys";
import { useAuthStore } from "@/store/authStore";

interface UploadCandidateAvatarArgs {
  file: File;
  persist?: boolean;
}

export function useUploadCandidateAvatar() {
  const queryClient = useQueryClient();

  return useMutation<UploadedImageResponse, Error, UploadCandidateAvatarArgs>({
    mutationFn: async ({ file, persist = false }) => {
      const formData = new FormData();
      formData.append("file", file);

      const query = persist ? "?persist=true" : "";
      const response = await fetch(
        `${API_BASE_URL}/candidate/profile/upload-avatar${query}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        let message = "Không thể tải ảnh đại diện lên hệ thống.";
        try {
          const errJson = (await response.json()) as {
            message?: string | string[];
          };
          if (Array.isArray(errJson.message)) {
            message = errJson.message[0] || message;
          } else if (typeof errJson.message === "string") {
            message = errJson.message;
          }
        } catch {
          // Giữ thông báo mặc định nếu response không phải JSON
        }
        throw new Error(message);
      }

      return (await response.json()) as UploadedImageResponse;
    },
    onSuccess: (data, variables) => {
      if (variables.persist) {
        void queryClient.invalidateQueries({
          queryKey: candidateKeys.profile(),
        });
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            avatarUrl: data.url,
          });
        }
      }
    },
  });
}
