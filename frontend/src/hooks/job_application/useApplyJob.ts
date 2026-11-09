import { useMutation } from "@tanstack/react-query";
import { ApplyJobPayload } from "@viecngon/types";

// 2. Hàm gọi API thuần (Fetch)
const applyForJobAPI = async (payload: ApplyJobPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/applications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Bắn lỗi ra để React Query bắt được và hiển thị cho người dùng (ví dụ: "Đã nộp rồi")
    throw new Error(errorData.message || "Không thể nộp đơn xin việc lúc này.");
  }

  return response.json();
};

// 3. Custom Hook xuất ra cho Component sử dụng
export const useApplyJob = () => {
  return useMutation({
    mutationFn: applyForJobAPI,
    onSuccess: (data) => {
      // Logic chạy ngầm khi nộp thành công (nếu cần)
      console.log("Nộp CV thành công:", data);
    },
    onError: (error) => {
      // Logic chạy ngầm khi lỗi
      console.error("Lỗi nộp CV:", error.message);
    },
  });
};
