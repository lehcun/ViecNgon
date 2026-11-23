/**
 * =====================================================================
 * ADMIN PACKAGES & TRANSACTIONS SHARED TYPES
 * ---------------------------------------------------------------------
 * ⚠️ QUY TẮC MONOREPO:
 * CHỈ CHỨA `type` và `interface` — tuyệt đối KHÔNG export enum, const hay hàm.
 * =====================================================================
 */

export type AdminPackageStatus = 'HOATDONG' | 'DA_AN';

export type AdminPackageBadgeType = 'BASIC' | 'HOT' | 'SUPER_HOT' | 'DIAMOND';

export type AdminTransactionStatus =
  | 'THANH_CONG'
  | 'CHO_THANH_TOAN'
  | 'THAT_BAI';

export interface AdminPackageQueryParams {
  q?: string;
  status?: AdminPackageStatus | 'ALL';
}

export interface AdminPackageItem {
  maGoi: string;
  tieuDe: string;
  loaiQuangCao: string | null;
  gia: number;
  thoiGianHieuLuc: number;
  soLuotDangTin: number;
  capDoUuTien: number;
  loaiHuyHieu: AdminPackageBadgeType | null;
  moTaNgan: string | null;
  quyenLoi: string[];
  trangThai: AdminPackageStatus;
  ngayTao: string;
  purchasesCount: number;
  totalRevenue: number;
}

export interface AdminPackagesListResponse {
  items: AdminPackageItem[];
  summary: {
    total: number;
    active: number;
    hidden: number;
  };
}

export interface CreateAdminPackagePayload {
  tieuDe: string;
  loaiQuangCao?: string;
  gia: number;
  thoiGianHieuLuc: number;
  soLuotDangTin: number;
  capDoUuTien: number;
  loaiHuyHieu?: AdminPackageBadgeType | null;
  moTaNgan?: string;
  quyenLoi?: string[];
}

export type UpdateAdminPackagePayload = Partial<CreateAdminPackagePayload>;

export interface UpdateAdminPackageStatusPayload {
  trangThai: AdminPackageStatus;
}

export interface AdminPackageActionResponse {
  message: string;
  package: AdminPackageItem;
}

export interface AdminTransactionQueryParams {
  q?: string;
  status?: AdminTransactionStatus | 'ALL';
  packageId?: string;
  page?: number;
  limit?: number;
}

export interface AdminTransactionItem {
  maThanhToan: string;
  maGiaoDichDoiTac: string;
  ngayThanhToan: string;
  soTienThanhToan: number;
  phuongThucTT: string | null;
  trangThaiTT: AdminTransactionStatus;
  rawTrangThaiTT: string | null;
  ghiChu: string | null;
  campaign: {
    maMua: string;
    tieuDe: string | null;
    trangThai: string | null;
    soLuotConLai: number | null;
    ngayBatDau: string;
    ngayKetThuc: string;
  };
  package: {
    maGoi: string;
    tieuDe: string;
    loaiHuyHieu: string | null;
  };
  company: {
    maCongTy: string;
    tenCongTy: string;
    slug: string;
    logoUrl: string | null;
  } | null;
  recruiter: {
    maTaiKhoan: string;
    tenNguoiDung: string;
    email: string;
  };
}

export interface AdminTransactionsListResponse {
  items: AdminTransactionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalCount: number;
    successCount: number;
    pendingCount: number;
    failedCount: number;
    totalSuccessRevenue: number;
  };
}

export interface ConfirmAdminTransactionResponse {
  message: string;
  transaction: AdminTransactionItem;
}
