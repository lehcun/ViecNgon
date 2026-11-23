/**
 * =====================================================================
 * ADMIN JOB MODERATION SHARED TYPES
 * ---------------------------------------------------------------------
 * ⚠️ QUY TẮC MONOREPO:
 * CHỈ CHỨA `type` và `interface` — tuyệt đối KHÔNG export enum, const hay hàm.
 * =====================================================================
 */

export type AdminJobStatus =
  | 'CHO_DUYET'
  | 'DA_DUYET'
  | 'TU_CHOI'
  | 'DA_AN'
  | 'HET_HAN';

export type AdminJobModerationAction = 'APPROVE' | 'REJECT' | 'HIDE';

export type AdminJobSortBy = 'ngayDang' | 'tenCongViec' | 'luotXem';

export interface AdminJobQueryParams {
  q?: string;
  status?: AdminJobStatus | 'ALL';
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: AdminJobSortBy;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminJobSummaryStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  hidden: number;
  expired: number;
}

export interface AdminJobListItem {
  maCongViec: string;
  tenCongViec: string;
  slug: string;
  trangThai: AdminJobStatus;
  thanhPho: string | null;
  loaiHinh: string;
  hinhThucLamViec: string | null;
  capBac: string | null;
  mucLuongToiThieu: number | null;
  mucLuongToiDa: number | null;
  ngayDang: string;
  ngayHetHan: string | null;
  luotXem: number;
  applicationsCount: number;
  nhanQuangCao: string | null;
  company: {
    maCongTy: string;
    tenCongTy: string;
    slug: string;
    logoUrl: string | null;
  };
  recruiter: {
    maTaiKhoan: string;
    tenNguoiDung: string;
    email: string;
  };
  skills: string[];
}

export interface AdminJobsListResponse {
  items: AdminJobListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: AdminJobSummaryStats;
}

export interface AdminJobDetailResponse extends AdminJobListItem {
  moTa: string | null;
  yeuCauCongViec: string | null;
  phucLoi: string | null;
  yeuCauKinhNghiem: number | null;
  branch: {
    thanhPho: string;
    diaChi: string;
  } | null;
}

export interface ModerateAdminJobPayload {
  action: AdminJobModerationAction;
  reason?: string;
}

export interface DeleteAdminJobPayload {
  reason?: string;
}

export interface AdminJobActionResponse {
  message: string;
  job: AdminJobListItem;
}

export interface DeleteAdminJobResponse {
  message: string;
  deletedId: string;
}
