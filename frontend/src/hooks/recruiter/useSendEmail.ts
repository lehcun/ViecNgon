import { useMutation } from "@tanstack/react-query";

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async ({
      applicationId,
      subject,
      content,
    }: {
      applicationId: string;
      subject: string;
      content: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/employer/${applicationId}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject, content }),
          credentials: "include",
        },
      );

      if (!res?.ok && res) throw new Error("Gửi email thất bại");
      return res ? res.json() : { success: true };
    },
  });
};
