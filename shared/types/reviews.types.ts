/**
 * Shared TypeScript types & interfaces for Company Reviews, Candidate Evaluations,
 * and Admin Review Moderation.
 * ONLY `type` and `interface` declarations are permitted here.
 */

export type ReviewModerationStatus =
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI"
  | "DA_AN";

export type CandidateEvalResult = "DAT" | "CAN_NHAC" | "CHUA_PHU_HOP";

export type AdminReviewKpiPeriod = "today" | "week" | "month";

export type AdminReviewFilterTab =
  | "ALL"
  | "CHO_DUYET"
  | "REPORTED"
  | "DA_DUYET"
  | "REJECTED";

export type AdminReviewDatePreset =
  | "ALL"
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "THIS_MONTH"
  | "CUSTOM";

export interface PublicCompanyReviewItem {
  id: string;
  rating: number;
  diemLuongPhucLoi: number;
  diemDaoTao: number;
  diemQuanLy: number;
  diemVanHoa: number;
  diemVanPhong: number;
  khuyenLamViec: boolean;
  coOtTot: boolean;
  tieuDe: string;
  noiDung: string;
  noiDungUuDiem: string;
  noiDungCaiThien: string;
  trangThai: ReviewModerationStatus;
  biBaoCao: boolean;
  createdAt: string;
}

export interface CompanyReviewsResponse {
  reviews: PublicCompanyReviewItem[];
  myPendingReview: PublicCompanyReviewItem | null;
  hasReviewed: boolean;
}

export interface CreateCompanyReviewPayload {
  diemLuongPhucLoi: number;
  diemDaoTao: number;
  diemQuanLy: number;
  diemVanHoa: number;
  diemVanPhong: number;
  khuyenLamViec: boolean;
  coOtTot: boolean;
  tieuDe: string;
  noiDung?: string;
  noiDungUuDiem?: string;
  noiDungCaiThien?: string;
}

export interface ReportCompanyReviewPayload {
  lyDoBaoCao: string;
}

export interface CandidateEvaluationItemDto {
  id: string;
  evaluatorName: string;
  evaluatorRole: string;
  rating: number;
  diemChuyenMon: number;
  diemThaiDo: number;
  diemGiaiQuyetVanDe: number;
  diemPhuHopVanHoa: number;
  ketQuaDanhGia: CandidateEvalResult;
  tieuDe: string;
  noiDung: string;
  chiaSeUngVien: boolean;
  createdAt: string;
}

export interface CreateCandidateEvaluationPayload {
  diemChuyenMon: number;
  diemThaiDo: number;
  diemGiaiQuyetVanDe: number;
  diemPhuHopVanHoa: number;
  ketQuaDanhGia: CandidateEvalResult;
  tieuDe: string;
  noiDung: string;
  chiaSeUngVien: boolean;
}

export interface SharedCandidateEvaluationDto {
  id: string;
  rating: number;
  diemChuyenMon: number;
  diemThaiDo: number;
  diemGiaiQuyetVanDe: number;
  diemPhuHopVanHoa: number;
  ketQuaDanhGia: CandidateEvalResult;
  tieuDe: string;
  noiDung: string;
  createdAt: string;
}

export interface AdminReviewListItem extends PublicCompanyReviewItem {
  companyId: string;
  companyName: string;
  companyLogo?: string | null;
  lyDoTuChoi?: string | null;
  lyDoBaoCao?: string | null;
  ngayBaoCao?: string | null;
}

export interface AdminReviewCounts {
  total: number;
  pending: number;
  reported: number;
  approved: number;
  rejected: number;
}

export interface AdminReviewGrowthBucket {
  total: number;
  pending: number;
  reported: number;
  approved: number;
}

export interface AdminReviewsListResponse {
  items: AdminReviewListItem[];
  counts: AdminReviewCounts;
  growth: Record<AdminReviewKpiPeriod, AdminReviewGrowthBucket>;
}

export interface AdminReviewsQueryParams {
  tab?: AdminReviewFilterTab;
  rating?: number;
  datePreset?: AdminReviewDatePreset;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ModerateAdminReviewPayload {
  trangThai: "TU_CHOI" | "DA_AN";
  lyDoTuChoi: string;
}
