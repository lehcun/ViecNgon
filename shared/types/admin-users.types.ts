/**
 * =====================================================================
 * ADMIN USER MANAGEMENT SHARED TYPES
 * ---------------------------------------------------------------------
 * ⚠️ QUY TẮC MONOREPO:
 * CHỈ CHỨA `type` và `interface` — tuyệt đối KHÔNG export enum, const hay hàm.
 * =====================================================================
 */

export type AdminUserRole = 'UNGVIEN' | 'NHATUYENDUNG' | 'ADMIN';

export type EmployerCompanyRole = 'OWNER' | 'RECRUITER';

export type AdminUserStatus = 'HOATDONG' | 'KHOA' | 'CHUAKICHHOAT';

export type AdminUserProvider = 'LOCAL' | 'GOOGLE';

export type AdminUserSortBy = 'ngayTao' | 'tenNguoiDung' | 'email';

export type AdminSortOrder = 'asc' | 'desc';

export interface AdminUserQueryParams {
  q?: string;
  role?: AdminUserRole | 'ALL';
  status?: AdminUserStatus | 'ALL';
  provider?: AdminUserProvider | 'ALL';
  page?: number;
  limit?: number;
  sortBy?: AdminUserSortBy;
  sortOrder?: AdminSortOrder;
}

export interface AdminUserSummaryStats {
  total: number;
  active: number;
  locked: number;
  unactivated: number;
  admins: number;
  candidates: number;
  recruiters: number;
}

export interface AdminUserListItem {
  maTaiKhoan: string;
  email: string;
  tenNguoiDung: string;
  sdt: string | null;
  provider: AdminUserProvider;
  vaiTro: AdminUserRole;
  trangThai: AdminUserStatus;
  ngayTao: string;
  ngayCapNhat: string;
  avatarUrl: string | null;
  companyName: string | null;
  companySlug: string | null;
  companyRole?: EmployerCompanyRole | null;
}

export interface AdminUsersListResponse {
  items: AdminUserListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: AdminUserSummaryStats;
}

export interface AdminUserDetailResponse extends AdminUserListItem {
  candidateProfile: {
    maUngVien: string;
    tenUngVien: string;
    chuyenMon: string | null;
    diaChi: string | null;
    soNamKinhNghiem: number | null;
    cvUrl: string | null;
    applicationsCount: number;
    savedJobsCount: number;
    skillsCount: number;
  } | null;
  recruiterProfile: {
    maNTD: string;
    hoTen: string | null;
    chucVu: string | null;
    soDienThoai?: string | null;
    vaiTroTrongCongTy: string;
    maCongTy: string;
    tenCongTy: string;
    slug: string;
    logoUrl: string | null;
    thanhPho: string | null;
    diaChi?: string | null;
    website?: string | null;
    moHinhCongTy?: string | null;
    quyMo?: string | null;
    jobsCount: number;
  } | null;
  recentNotifications: Array<{
    maThongBao: string;
    tieuDe: string;
    noiDung: string;
    ngayTao: string;
  }>;
}

export interface UpdateAdminUserStatusPayload {
  trangThai: 'HOATDONG' | 'KHOA';
  reason?: string;
}

export interface UpdateAdminUserRolePayload {
  vaiTroTrongCongTy: EmployerCompanyRole;
}

export interface DeleteAdminUserPayload {
  reason?: string;
}

export interface AdminUserActionResponse {
  message: string;
  user: AdminUserListItem;
}

export interface DeleteAdminUserResponse {
  message: string;
  deletedId: string;
}
