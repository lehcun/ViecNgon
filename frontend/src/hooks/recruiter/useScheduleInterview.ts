import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScheduleInterviewPayload } from "@viecngon/types";
import { toast } from "react-hot-toast";

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ScheduleInterviewPayload) => {
      // Tách maDon ra để gắn vào URL, các trường còn lại nhét vào Body
      const { maDon, ...bodyData } = payload;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/employer/${maDon}/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
          credentials: "include", // Bắt buộc để gửi kèm HTTP-Only Cookie (JWT)
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi khi lên lịch phỏng vấn");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Đã lên lịch phỏng vấn và tạo Google Meet thành công!");

      // Tự động làm mới dữ liệu để UI đổi trạng thái sang "Phỏng vấn" mà không cần F5
      queryClient.invalidateQueries({ queryKey: ["applicationDetail"] });
      queryClient.invalidateQueries({ queryKey: ["employer-candidates"] });
    },
    onError: (error: Error) => {
      toast.error(`Thất bại: ${error.message}`);
    },
  });
};
