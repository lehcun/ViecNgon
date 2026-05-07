import { useMutation } from "@tanstack/react-query";

export interface ApplyJobPayload {
  maCongViec: string;
  chiTiet?: string;
  fileCvUrl?: string;
}

// 2. Hàm gọi API thuần (Fetch)
const applyForJobAPI = async (payload: ApplyJobPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/application`,
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
