"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  JobDetailResponse,
  JobSearchResultResponse,
  SearchJobsQuery,
} from "@viecngon/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useJobSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. ĐỌC FILTER TỪ URL SEARCH PARAMS
  const currentFilters: SearchJobsQuery = {
    keyword: searchParams.get("keyword") || undefined,
    thanhPho: searchParams.get("thanhPho") || undefined,
    hinhThucLamViec: searchParams.get("hinhThucLamViec") || undefined,
    loaiHinh: searchParams.get("loaiHinh") || undefined,
    capBac: searchParams.get("capBac") || undefined,
    yeuCauKinhNghiem: searchParams.get("yeuCauKinhNghiem") || undefined,
    mucLuongMin: searchParams.get("mucLuongMin") || undefined,
    mucLuongMax: searchParams.get("mucLuongMax") || undefined,
    salaryRange: searchParams.get("salaryRange") || undefined,
    negotiable: searchParams.get("negotiable") || undefined,
    sortBy: searchParams.get("sortBy") || "NEWEST",
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  };

  // 2. QUERY FETCH DATA QUA REACT QUERY (KEEP PREVIOUS DATA ĐỂ CHUYỂN TRANG MƯỢT MÀ)
  const query = useQuery<JobSearchResultResponse>({
    queryKey: ["jobs-search", currentFilters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (currentFilters.keyword) params.set("keyword", currentFilters.keyword);
      if (currentFilters.thanhPho) params.set("thanhPho", currentFilters.thanhPho);
      if (currentFilters.hinhThucLamViec)
        params.set("hinhThucLamViec", currentFilters.hinhThucLamViec);
      if (currentFilters.loaiHinh) params.set("loaiHinh", currentFilters.loaiHinh);
      if (currentFilters.capBac) params.set("capBac", currentFilters.capBac);
      if (currentFilters.yeuCauKinhNghiem !== undefined)
        params.set("yeuCauKinhNghiem", String(currentFilters.yeuCauKinhNghiem));
      if (currentFilters.mucLuongMin !== undefined)
        params.set("mucLuongMin", String(currentFilters.mucLuongMin));
      if (currentFilters.mucLuongMax !== undefined)
        params.set("mucLuongMax", String(currentFilters.mucLuongMax));
      if (currentFilters.salaryRange)
        params.set("salaryRange", currentFilters.salaryRange);
      if (currentFilters.negotiable)
        params.set("negotiable", String(currentFilters.negotiable));
      if (currentFilters.sortBy) params.set("sortBy", currentFilters.sortBy);
      if (currentFilters.page) params.set("page", String(currentFilters.page));
      if (currentFilters.limit) params.set("limit", String(currentFilters.limit));

      const res = await fetch(`${API_BASE}/jobs?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Không thể tải danh sách việc làm");
      }

      return res.json();
    },
    placeholderData: keepPreviousData, // Chuyển trang & filter mượt mà không bị giật trang
    staleTime: 1000 * 60 * 2, // 2 phút cache
  });

  // 3. CÁC HÀM CẬP NHẬT URL QUERY STRING (URL-DRIVEN STATE)
  const updateFilter = (key: string, value: string | undefined | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value.trim() !== "") {
      params.set(key, value.trim());
    } else {
      params.delete(key);
    }

    // Reset về trang 1 mỗi khi thay đổi bộ lọc (trừ khi đang đổi page)
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updateMultipleFilters = (newFilters: Record<string, string | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && String(value).trim() !== "") {
        params.set(key, String(value).trim());
      } else {
        params.delete(key);
      }
    });

    if (!newFilters.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const setPage = (newPage: number) => {
    updateFilter("page", String(newPage));
  };

  const jobs: JobDetailResponse[] = query.data?.data || [];
  const total = query.data?.total || query.data?.meta?.total || 0;
  const page = Number(currentFilters.page) || 1;
  const totalPages =
    query.data?.totalPages || query.data?.meta?.totalPages || 1;

  // Đếm số lượng bộ lọc đang được áp dụng (ngoại trừ page, limit, sortBy)
  const activeFilterCount = Object.entries(currentFilters).filter(
    ([k, v]) => !["page", "limit", "sortBy"].includes(k) && !!v,
  ).length;

  return {
    jobs,
    total,
    page,
    totalPages,
    currentFilters,
    activeFilterCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    updateFilter,
    updateMultipleFilters,
    clearAllFilters,
    setPage,
  };
};

