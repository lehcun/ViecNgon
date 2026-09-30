import { useQuery } from "@tanstack/react-query";
import { PackageResponse } from "@viecngon/types";

export const usePackages = () => {
  const query = useQuery<PackageResponse[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/packages`,
      );
      if (!res.ok) throw new Error("Lỗi khi tải danh sách gói dịch vụ");
      const data = (await res.json()) as PackageResponse[];

      // Xử lý dữ liệu thô từ Database thành dữ liệu đẹp cho UI
      return data.map((pkg: PackageResponse, index: number) => ({
        maGoi: pkg.maGoi,
        tieuDe: pkg.tieuDe,
        loaiQuangCao: pkg.loaiQuangCao,
        gia: Number(pkg.gia), // Ép kiểu Decimal từ Prisma về Number
        thoiGianHieuLuc: pkg.thoiGianHieuLuc,
        soLuotDangTin: pkg.soLuotDangTin,
        // Gán gói ở giữa (index 1) làm gói Phổ biến nhất
        isPopular: index === 1,
        // Tự động sinh ra mảng text đặc quyền để UI in ra các dấu tick xanh
        features: [
          `${pkg.soLuotDangTin} lượt đăng tin tuyển dụng`,
          `Tin hiển thị trong ${pkg.thoiGianHieuLuc} ngày`,
          `Phân loại: ${pkg.loaiQuangCao || "Tiêu chuẩn"}`,
          "Quản lý hồ sơ ứng viên trực tuyến",
          "Hỗ trợ kỹ thuật 24/7",
        ],
      }));
    },
    staleTime: 10 * 60 * 1000,
  });

  return {
    packages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
