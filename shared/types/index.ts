/**
 * =====================================================================
 * VIECNGON SHARED TYPES & INTERFACES
 * ---------------------------------------------------------------------
 * Khai báo Types / Interfaces dùng chung giữa Backend (NestJS) và Frontend (Next.js).
 *
 * ⚠️ QUY TẮC MONOREPO:
 * File này CHỈ CHỨA `type` và `interface`.
 * KHÔNG export `const`, `enum` hay runtime object để đảm bảo an toàn tuyệt đối
 * khi Backend require qua CommonJS runtime.
 * =====================================================================
 */

// =====================================================================
// 1. COMMON & PAGINATION TYPES
// =====================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =====================================================================
// 2. AUTHENTICATION & USER TYPES
// =====================================================================

export type UserRole = "ADMIN" | "UNGVIEN" | "NHATUYENDUNG";

export interface User {
  id?: string;
  sub?: string;
  email: string;
  name: string;
  sdt?: string;
  avatar?: string;
  avatarUrl?: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
}

export interface SignupPayload {
  email: string;
  name: string;
  password: string;
  role: "UNGVIEN" | "NHATUYENDUNG";
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    status: string;
  };
}

export interface ChangePasswordPayload {
  matKhauCu: string;
  matKhauMoi: string;
}

// =====================================================================
// 3. COMPANY (PUBLIC) TYPES
// =====================================================================

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  jobs: number;
  slug: string;
}

export interface FormattedTopCompany {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  slug: string;
  jobs: number;
}

export interface CompanyActiveJobItem {
  id: string;
  title: string;
  slug: string;
  salaryDisplay: string;
  location: string | null;
  postedAt: string | Date;
  skills: string[];
  benefits: string;
  workModel: string;
}

export interface CompanyDetailResponse {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  website: string | null;
  slug: string;
  description: string | null;
  benefits: string | null;
  skills: string[];
  aboutMe: string | null;
  city: string | null;
  companyModel: string | null;
  industry: string | null;
  size: string | null;
  country: string | null;
  workingTime: string | null;
  otPolicy: string | null;
  totalJobs: number;
  activeJobs: CompanyActiveJobItem[];
}

// =====================================================================
// 4. JOB & SKILL TYPES (PUBLIC, SEARCH, FILTER & DB RELATIONS)
// =====================================================================

export interface Job {
  maCongViec: string;
  tenCongViec: string;
  mucLuongToiThieu: number;
  mucLuongToiDa: number;
}

export interface SkillResponse {
  id: string;
  name: string;
}

export interface JobFilterParams {
  thanhPho?: string;
  loaiHinh?: string;
  hinhThucLamViec?: string;
  /**
   * Lọc theo mức lương tối thiểu mong muốn (VD: "500", "1000", "2000").
   * Ở Frontend lấy từ URL là string, xuống Backend sẽ được ép kiểu về Number.
   */
  mucLuong?: string;
  page?: string;
}

export interface JobResponse {
  data: JobDetailResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export type SearchJobsSortBy =
  | "NEWEST"
  | "SALARY_DESC"
  | "MOST_VIEWED"
  | string;

export interface SearchJobsQuery {
  keyword?: string;
  thanhPho?: string;
  hinhThucLamViec?: string;
  loaiHinh?: string;
  capBac?: string;
  yeuCauKinhNghiem?: number | string;
  mucLuongMin?: number | string;
  mucLuongMax?: number | string;
  salaryRange?: string;
  negotiable?: boolean | string;
  sortBy?: SearchJobsSortBy;
  page?: number | string;
  limit?: number | string;
}

export interface JobSearchResultResponse {
  data: JobDetailResponse[];
  meta: PaginationMeta;
  total: number;
  page: number;
  totalPages: number;
}

export interface JobBranchSummary {
  id: string;
  city: string;
  address: string;
  mapUrl?: string | null;
}

export interface JobCompanySummary {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
  companyModel: string | null;
  industry: string | null;
  size: string | null;
  address?: string | null;
  country: string | null;
  workingTime: string | null;
  otPolicy: string | null;
  website: string | null;
}

export type JobPromotionBadge =
  | "BASIC"
  | "HOT"
  | "SUPER_HOT"
  | "DIAMOND"
  | "HEADHUNT";

export interface JobDetailResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  requirements: string | null;
  benefits: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryDisplay: string;
  experience: number | null;
  level: string | null;
  location: string | null;
  type: string;
  workModel: string | null;
  postedAt: string | Date;
  deadline: Date | null;
  updatedAt: Date;
  views: number;
  status: string;
  skills: string[];
  branch?: JobBranchSummary | null;
  isApplied?: boolean;
  applicationStatus?: string | null;
  priorityLevel?: number;
  promotionBadge?: JobPromotionBadge | null;
  highlights?: string[];
  company: JobCompanySummary;
}

/** Form state khi tạo/sửa công việc trên UI */
export interface JobFormState {
  tenCongViec: string;
  moTa: string;
  yeuCauCongViec: string;
  phucLoi: string;
  mucLuongToiThieu: number | "";
  mucLuongToiDa: number | "";
  yeuCauKinhNghiem: number | "";
  capBac: string;
  thanhPho: string;
  loaiHinh: string;
  hinhThucLamViec: string;
  maChiNhanh: string;
  ngayHetHan: string;
  negotiable: boolean;
  kyNangs: string[];
}

/** Payload gửi lên Backend khi tạo mới tin tuyển dụng */
export interface CreateCongViecPayload {
  tenCongViec: string;
  moTa?: string;
  yeuCauCongViec?: string;
  phucLoi?: string;
  mucLuongToiThieu?: number;
  mucLuongToiDa?: number;
  yeuCauKinhNghiem?: number;
  capBac?: string;
  thanhPho?: string;
  loaiHinh: string;
  hinhThucLamViec?: string;
  maChiNhanh?: string;
  ngayDang: string;
  ngayHetHan?: string;
  trangThai: string;
  maTaiKhoan: string;
  kyNangs: string[];
}

// --- Database Join / Formatting Relation Types ---

export interface CongTyData {
  maCongTy: string;
  tenCongTy: string;
  slug: string;
  moTa: string | null;
  phucLoi: string | null;
  thanhPho: string | null;
  tenPhapLy: string | null;
  chuyenMon: string | null;
  aboutMe: string | null;
  logoUrl: string | null;
  website: string | null;
  diaChi: string | null;
  moHinhCongTy: string | null;
  linhVuc: string | null;
  quyMo: string | null;
  quocGia: string | null;
  thoiGianLamViec: string | null;
  chinhSachOT: string | null;
  giaiThuong: string | null;
}

export interface NhaTuyenDungData {
  maNTD: string;
  maCongTy: string;
  maTaiKhoan: string;
  congTy: CongTyData;
}

export interface ChiNhanhData {
  maChiNhanh: string;
  maCongTy: string;
  thanhPho: string;
  diaChi: string;
  mapUrl: string | null;
}

export interface KyNangData {
  maKyNang: string;
  tenKyNang: string;
}

export interface CongViecKyNangData {
  maCongViec: string;
  maKyNang: string;
  kyNang: KyNangData;
}

export interface JobWithRelations<TDecimal = any> {
  maCongViec: string;
  tenCongViec: string;
  slug: string;
  moTa: string | null;
  yeuCauCongViec: string | null;
  phucLoi: string | null;
  mucLuongToiThieu: TDecimal | null;
  mucLuongToiDa: TDecimal | null;
  yeuCauKinhNghiem: number | null;
  capBac: string | null;
  thanhPho: string | null;
  loaiHinh: string;
  hinhThucLamViec: string | null;
  ngayDang: Date;
  ngayHetHan: Date | null;
  ngayCapNhat: Date;
  luotXem: number;
  trangThai: string;
  doUuTien?: number | null;
  nhanQuangCao?: string | null;
  maNTD: string;
  maChiNhanh: string | null;
  nhaTuyenDung: NhaTuyenDungData;
  chiNhanh: ChiNhanhData | null;
  congViecKyNangs: CongViecKyNangData[];
}

// =====================================================================
// 5. CANDIDATE & CV PROFILE TYPES
// =====================================================================

export interface CandidateSkillItem {
  skillId: string;
  skillName: string;
  level: string | null;
}

export interface ExperienceItem {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface EducationItem {
  id: string;
  schoolName: string;
  major: string;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
}

export interface CertificateItem {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expirationDate: string | null;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface UploadedCvItem {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date | string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  projectUrl: string | null;
}

export interface CandidateDefaultCvFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface CandidateAccountInfo {
  email: string;
  userName: string;
  phoneNumber: string | null;
}

export interface CandidateProfileResponse {
  candidateId: string;
  accountId: string;
  candidateName: string;
  dateOfBirth: Date | string | null;
  gender: string | null;
  yearsOfExperience: number | null;
  avatarUrl: string | null;
  profession: string;
  cvUrl: string | null;
  address: string | null;

  // Hybrid CV fields
  aboutMe: string | null;
  defaultCvType: string; // 'ONLINE' | 'PDF'
  defaultCvFileId: string | null;
  defaultCvFile: CandidateDefaultCvFile | null;

  account: CandidateAccountInfo;
  skills: CandidateSkillItem[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certificates: CertificateItem[];
  languages: LanguageItem[];
  uploadedCvs: UploadedCvItem[];
  portfolios: PortfolioItem[];
}

export interface UpdateCandidatePayload {
  userName?: string;
  phoneNumber?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  yearsOfExperience?: number;
  avatarUrl?: string;
  profession?: string;
  cvUrl?: string;
  address?: string;
  aboutMe?: string;
  defaultCvType?: string;
  defaultCvFileId?: string;
}

export interface CreateExperiencePayload {
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export type UpdateExperiencePayload = Partial<CreateExperiencePayload>;

export interface CreateEducationPayload {
  schoolName: string;
  major: string;
  startDate: string;
  endDate?: string | null;
  gpa?: string | null;
}

export type UpdateEducationPayload = Partial<CreateEducationPayload>;

export interface CreateCertificatePayload {
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string | null;
}

export type UpdateCertificatePayload = Partial<CreateCertificatePayload>;

export interface CreatePortfolioPayload {
  title: string;
  description?: string | null;
  projectUrl?: string | null;
}

export type UpdatePortfolioPayload = Partial<CreatePortfolioPayload>;

export interface CreateCvFilePayload {
  fileName: string;
  fileUrl: string;
  isDefault?: boolean;
}

export interface ApplyJobPayload {
  maCongViec: string;
  maCvFile?: string;
  coverLetter?: string;
  chiTiet?: string;
  fileCvUrl?: string;
}

export interface AppliedJobItem {
  applicationId: string;
  appliedDate: string;
  applicationStatus: string; // 'CHO_DUYET' | 'DA_XEM' | 'PHU_HOP' | 'PHONG_VAN' | 'TRUNG_TUYEN' | 'KHONG_PHU_HOP'
  cvUrl: string | null;
  job: {
    id: string;
    title: string;
    slug: string;
    location: string | null;
    workModel: string | null;
    salaryDisplay: string;
    status: string;
    deadline: string | null;
    company: {
      name: string;
      logo: string | null;
      slug: string;
    } | null;
  };
}

// =====================================================================
// 6. RECRUITER / EMPLOYER DASHBOARD & APPLICATION TYPES
// =====================================================================

export interface RecentApplicant {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  avatarUrl: string | null;
  status: string;
  appliedAt: string | Date;
  jobTitle: string;
}

export interface DashboardJobItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  type: string;
  views: number;
  applicationsCount: number;
  status: string;
  postedAt: string | Date;
  deadline: string | Date | null;
  skills: string[] | null;
}

export interface RecruiterProfileResponse {
  recruiterId: string;
  accountId: string;
  companyId: string;
  account: {
    email: string;
    userName: string;
    phoneNumber: string | null;
  };
  company: {
    name: string;
    legalName: string | null;
    slug: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    industry: string | null;
    size: string | null;
  };
  statistics: {
    totalJobs: number;
    totalViews: number;
    totalApplications: number;
  };
  recentApplicants: RecentApplicant[];
  jobs: {
    count: number;
    list: DashboardJobItem[];
  };
}

export interface UpdateRecruiterPayload {
  userName?: string;
  phoneNumber?: string;
  companyName?: string;
  description?: string;
  website?: string;
  address?: string;
  city?: string;
  logoUrl?: string;
}

export interface RecruiterJobMetricsResponse {
  totalJobs: {
    count: number;
    changeThisMonth: number;
  };
  activeJobs: {
    count: number;
  };
  pendingJobs: {
    count: number;
    avgReviewTimeText: string;
  };
  totalApplications: {
    count: number;
    percentChangeThisWeek: number;
  };
  averageResponseRate: number;
}

export interface ApplicationItem {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  avatarUrl: string | null;
  contactEmail: string;
  jobId: string;
  jobTitle: string;
  appliedAt: string | Date;
  status: string;
  cvUrl: string | null;
  aiMatchScore?: number | null;
}

export interface ApplicationDetailResponse {
  // Thông tin đơn ứng tuyển
  applicationId: string;
  appliedAt: string | Date;
  status: string;
  coverLetter: string | null;
  cvUrl: string | null;

  // Thông tin công việc
  jobId: string;
  jobTitle: string;

  // Thông tin ứng viên
  candidateId: string;
  candidateName: string;
  avatarUrl: string | null;
  profession: string;
  aboutMe: string | null;

  contact: {
    email: string;
    phoneNumber: string | null;
    address: string | null;
  };

  // Dữ liệu hồ sơ trực tuyến (Hybrid CV)
  skills: {
    skillName: string;
    level: string | null;
  }[];

  experiences: {
    id: string;
    companyName: string;
    position: string;
    startDate: Date | string;
    endDate: Date | string | null;
    description: string | null;
  }[];

  educations: {
    id: string;
    schoolName: string;
    major: string;
    startDate: Date | string;
    endDate: Date | string | null;
    gpa: string | null;
  }[];
}

export interface ScheduleInterviewPayload {
  maDon: string;
  tieuDe: string;
  thoiGian: string; // Định dạng ISO 8601
  moTa?: string;
  taoGoogleMeet: boolean;
}

// =====================================================================
// 7. PACKAGE & CAMPAIGN TYPES
// =====================================================================

export type CampaignStatus = "DANG_CHAY" | "DA_KET_THUC" | "CHO_THANH_TOAN";

export interface PackageResponse {
  maGoi: string;
  tieuDe: string;
  loaiQuangCao: string;
  gia: number;
  thoiGianHieuLuc: number;
  soLuotDangTin: number;
  features: string[];
  isPopular?: boolean;
  priorityLevel?: number;
  badgeType?: JobPromotionBadge;
  badgeText?: string | null;
  description?: string;
  inheritedFrom?: string | null;
}

export interface FeaturedEmployerBannerJob {
  id: string;
  title: string;
  slug: string;
}

export interface FeaturedEmployerBannerItem {
  companyId: string;
  companyName: string;
  slug: string;
  logo: string | null;
  city?: string | null;
  tagline: string;
  bannerCoverUrl?: string | null;
  bannerBadgeText?: string | null;
  activeJobsCount: number;
  featuredJobs?: FeaturedEmployerBannerJob[];
}

export interface SpotlightBannerJobOption {
  id: string;
  title: string;
  slug: string;
  city?: string | null;
}

export interface SpotlightBannerConfigResponse {
  hasDiamondAccess: boolean;
  companyId: string;
  companyName: string;
  slug: string;
  logo: string | null;
  defaultCity: string | null;
  defaultTagline: string;
  bannerCoverUrl: string | null;
  bannerCity: string;
  bannerTagline: string;
  bannerBadgeText: string;
  selectedJobIds: string[];
  availableJobs: SpotlightBannerJobOption[];
  activeJobsCount: number;
}

export interface UpdateSpotlightBannerPayload {
  bannerCoverUrl?: string | null;
  bannerCity?: string | null;
  bannerTagline?: string | null;
  bannerBadgeText?: string | null;
  selectedJobIds?: string[];
}

export interface CampaignResponse {
  id: string;
  maMua?: string;
  tieuDe: string;
  tenGoi: string;
  giaTaiThoiDiemMua: number;
  soLuotConLai: number;
  ngayMua: string;
  ngayKetThuc: string;
  trangThai: CampaignStatus;
  priorityLevel?: number;
  badgeType?: string | null;
}

// =====================================================================
// 8. NOTIFICATION TYPES
// =====================================================================

export type NotificationStatus = "CHUA_DOC" | "DA_DOC";

export interface NotificationItemResponse {
  id: string;
  title: string;
  content: string;
  status: NotificationStatus;
  createdAt: string | Date;
}

export interface NotificationListResponse {
  data: NotificationItemResponse[];
  total: number;
  allCount: number;
  unreadCount: number;
  readCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}

// =====================================================================
// 9. SUB-MODULE EXPORTS
// =====================================================================

export * from "./company-profile.types";
export * from "./employer-job.types";
export * from "./admin-dashboard.types";
export * from "./ai-cv.types";
