/**
 * =====================================================================
 * EMPLOYER JOB MANAGEMENT TYPES
 * ---------------------------------------------------------------------
 * Khai báo Types / Interfaces dùng chung giữa Backend (NestJS) và Frontend (Next.js)
 * cho chức năng Quản lý bài đăng tuyển dụng của Nhà tuyển dụng.
 *
 * ⚠️ QUY TẮC MONOREPO:
 * File này CHỈ CHỨA `type` và `interface`.
 * KHÔNG export `const`, `enum` hay runtime object.
 * =====================================================================
 */

export type EmployerJobStatus =
  | "ALL"
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHUOI"
  | "NHAP"
  | "HET_HAN"
  | "DA_AN";

export interface EmployerJobBranchInfo {
  id: string;
  city: string;
  address: string;
  isHeadquarter?: boolean;
}

export interface EmployerJobSkillInfo {
  id: string;
  name: string;
}

/** Thông tin tin tuyển dụng trong bảng danh sách (GET /employer/jobs) */
export interface EmployerJobListItem {
  id: string;
  title: string;
  slug: string;
  salaryDisplay: string;
  minSalary: number | null;
  maxSalary: number | null;
  experienceYears: number | null;
  level: string | null;
  city: string | null;
  jobType: string;
  workModel: string | null;
  status: string; // VD: DA_DUYET, CHO_DUYET, HET_HAN, DA_AN...
  postedAt: string;
  deadline: string | null;
  updatedAt: string;
  views: number;
  applicationsCount: number;
  skills: EmployerJobSkillInfo[];
  branch: EmployerJobBranchInfo | null;
  isExpired: boolean;
}

/** Bộ đếm số lượng tin theo từng trạng thái (dùng hiển thị Badge trên Tabs) */
export interface EmployerJobStatusCounts {
  ALL: number;
  DA_DUYET: number;
  CHO_DUYET: number;
  TU_CHUOI: number;
  NHAP: number;
  HET_HAN: number;
  DA_AN: number;
}

/** Phản hồi danh sách bài đăng có phân trang (GET /employer/jobs) */
export interface EmployerJobsResponse {
  data: EmployerJobListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  countsByStatus: EmployerJobStatusCounts;
}

/** Chi tiết tin tuyển dụng phục vụ hiển thị & điền form sửa (GET /employer/jobs/:id) */
export interface EmployerJobDetailResponse {
  maCongViec: string;
  tenCongViec: string;
  slug: string;
  moTa: string | null;
  yeuCauCongViec: string | null;
  phucLoi: string | null;
  mucLuongToiThieu: number | null;
  mucLuongToiDa: number | null;
  yeuCauKinhNghiem: number | null;
  capBac: string | null;
  thanhPho: string | null;
  loaiHinh: string;
  hinhThucLamViec: string | null;
  ngayDang: string;
  ngayHetHan: string | null;
  ngayCapNhat: string;
  luotXem: number;
  trangThai: string;
  maChiNhanh: string | null;
  kyNangs: string[]; // Mảng ID kỹ năng để bind vào checkbox form
  skills: EmployerJobSkillInfo[];
  branch: EmployerJobBranchInfo | null;
  applicationsCount: number;
  isExpired: boolean;
}

/** Payload cập nhật tin tuyển dụng (PUT/PATCH /employer/jobs/:id) */
export interface UpdateEmployerJobPayload {
  tenCongViec?: string;
  moTa?: string;
  yeuCauCongViec?: string;
  phucLoi?: string;
  mucLuongToiThieu?: number | null;
  mucLuongToiDa?: number | null;
  yeuCauKinhNghiem?: number | null;
  capBac?: string;
  thanhPho?: string;
  loaiHinh?: string;
  hinhThucLamViec?: string;
  ngayHetHan?: string | null;
  maChiNhanh?: string | null;
  kyNangs?: string[];
  trangThai?: string;
}

/** Payload đăng lại / gia hạn tin (POST /employer/jobs/:id/repost) */
export interface RepostJobPayload {
  ngayHetHanMoi?: string; // ISO 8601 string
  updateContent?: boolean;
}

/** Query params tìm kiếm & lọc danh sách tin tuyển dụng của NTD */
export interface EmployerJobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmployerJobStatus | string;
  sortBy?: "newest" | "expiring_soon" | "most_viewed" | string;
}


