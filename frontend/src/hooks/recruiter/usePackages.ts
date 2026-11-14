import { useQuery } from "@tanstack/react-query";
import { PackageResponse } from "@viecngon/types";
import { packageKeys } from "@/queries/queryKeys";

export const usePackages = () => {
  const query = useQuery<PackageResponse[]>({
    queryKey: packageKeys.all,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/packages`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Lỗi khi tải danh sách gói dịch vụ");
      const data = (await res.json()) as PackageResponse[];

      return data.map((pkg, index) => ({
        maGoi: pkg.maGoi,
        tieuDe: pkg.tieuDe,
        loaiQuangCao: pkg.loaiQuangCao,
        gia: Number(pkg.gia),
        thoiGianHieuLuc: pkg.thoiGianHieuLuc,
        soLuotDangTin: pkg.soLuotDangTin,
        priorityLevel: pkg.priorityLevel ?? index + 1,
        badgeType: pkg.badgeType,
        badgeText: pkg.badgeText,
        description: pkg.description,
        inheritedFrom: pkg.inheritedFrom,
        isPopular: pkg.isPopular ?? index === 1,
        features:
          pkg.features && pkg.features.length > 0
            ? pkg.features
            : [
                `${pkg.soLuotDangTin} lượt đăng tin tuyển dụng`,
                `Tin hiển thị trong ${pkg.thoiGianHieuLuc} ngày`,
              ],
      }));
    },
    staleTime: 10 * 60 * 1000,
  });

  return {
    packages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
