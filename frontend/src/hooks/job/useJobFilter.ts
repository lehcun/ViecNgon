import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { JobDetailResponse } from "@viecngon/types";

// 1. Định nghĩa Type cho các tham số truyền vào (Khớp với DTO ở Backend)
export interface JobFilterParams {
  thanhPho?: string;
  loaiHinh?: string;
  hinhThucLamViec?: string;
  mucLuong?: string;
  page?: string;
}

// 2. Định nghĩa Type cho dữ liệu trả về (Dựa theo Prisma Schema)
export interface JobResponse {
  data: JobDetailResponse[];
  total: number;
  page: number;
  totalPages: number;
}

// 3. Hàm Fetch API
const fetchJobs = async (filters: JobFilterParams): Promise<JobResponse> => {
  // Tạo đối tượng URLSearchParams để tự động xử lý các dấu ? và &
  const params = new URLSearchParams();

  if (filters.thanhPho) params.append("thanhPho", filters.thanhPho);
  if (filters.loaiHinh) params.append("loaiHinh", filters.loaiHinh);
  if (filters.hinhThucLamViec)
    params.append("hinhThucLamViec", filters.hinhThucLamViec);
  if (filters.mucLuong) params.append("mucLuong", filters.mucLuong);
  if (filters.page) params.append("page", filters.page);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Lỗi khi tải danh sách việc làm");
  }

  return response.json();
};

// 4. Custom Hook sử dụng React Query
export const useJobFilter = (filters: JobFilterParams) => {
  return useQuery({
    // queryKey chứa toàn bộ biến filter. Khi bất kỳ filter nào đổi, React Query sẽ tự động gọi lại API!
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),

    // Giữ lại data cũ trên màn hình trong lúc đang fetch data mới (Giúp UI không bị giật chớp)
    placeholderData: keepPreviousData,

    // Tùy chọn: Không tự động gọi lại API khi người dùng chuyển tab trình duyệt
    refetchOnWindowFocus: false,
  });
};
