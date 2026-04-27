import { useQuery } from "@tanstack/react-query";
import { Candidate } from "@viecngon/types";

export const useCandidate = () => {
  return useQuery<Candidate, Error>({
    // Đặt tên key duy nhất để React Query quản lý cache
    queryKey: ["candidateProfile"],

    // Hàm gọi API thực tế
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/me`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },

    //  Quản lý Retry (Thử lại khi lỗi)
    retry: (failureCount, error: any) => {
      // Nếu lỗi 401 (Chưa đăng nhập/Hết hạn), KHÔNG gọi lại API nữa để tránh spam server
      if (error.response?.status === 401) return false;
      // Lỗi rớt mạng hoặc server quá tải thì cho phép thử lại tối đa 2 lần
      return failureCount < 2;
    },

    // Thời gian làm mới dữ liệu (Stale Time)
    // Giữ data không bị cũ trong 5 phút. Khi người dùng chuyển qua lại giữa các tab,
    // React Query sẽ dùng data có sẵn trong RAM thay vì gọi API liên tục, UI sẽ load nhanh như chớp.
    staleTime: 5 * 60 * 1000,
  });
};
