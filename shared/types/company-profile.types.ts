/**
 * =====================================================================
 * COMPANY PROFILE TYPES (Employer / Company Profile Management)
 * ---------------------------------------------------------------------
 * Khai báo Types / Interfaces dùng chung giữa Backend (NestJS) và Frontend (Next.js).
 * Khớp 100% với Prisma Schema (CONGTY, CHINHANH, NHATUYENDUNG) và giao diện quản lý.
 * 
 * ⚠️ QUY TẮC MONOREPO:
 * File này CHỈ CHỨA `type` và `interface`.
 * KHÔNG export `const`, `enum` hay runtime object để đảm bảo an toàn tuyệt đối
 * khi Backend require qua CommonJS runtime.
 * =====================================================================
 */

/** Danh sách các trường dữ liệu dùng để tính "Độ hoàn thiện hồ sơ" */
export type CompanyProfileCompletionField =
  | "tenCongTy"
  | "logoUrl"
  | "aboutMe"
  | "moTa"
  | "phucLoi"
  | "linhVuc"
  | "website"
  | "thanhPho"
  | "diaChi"
  | "quyMo"
  | "quocGia"
  | "moHinhCongTy"
  | "thoiGianLamViec"
  | "chiNhanhs";

// ---------------------------------------------------------------------
// 1. DATA MODELS & API RESPONSE (GET /employer/profile)
// ---------------------------------------------------------------------

/** Ảnh hiển thị theo từng Section của trang Công ty */
export interface CompanySectionImages {
  introImages: string[];
  cultureImages: string[];
}

/** Thông tin Công ty (Bảng CONGTY) */
export interface CompanyInfo {
  maCongTy: string;
  tenCongTy: string;
  tenPhapLy: string | null;
  /** Slug định danh duy nhất (dùng cho nút "Xem trang công khai") */
  slug: string;
  /** Rich Text (HTML đã qua sanitize) - Khối "Giới thiệu công ty" */
  moTa: string | null;
  /** Rich Text (HTML đã qua sanitize) - Tab "Văn hóa & Đãi ngộ" */
  phucLoi: string | null;
  /** Rich Text (HTML đã qua sanitize) - Năng lực chuyên môn kỹ thuật */
  chuyenMon: string | null;
  /** Plain text - Slogan hiển thị dưới tên công ty */
  aboutMe: string | null;
  logoUrl: string | null;
  website: string | null;
  thanhPho: string | null;
  diaChi: string | null;
  moHinhCongTy: string | null;
  /** Danh sách tag "Lĩnh vực hoạt động trọng tâm" (đã parse mảng từ chuỗi DB) */
  linhVuc: string[];
  /** Khối Quy mô (VD: "1,000+ Kỹ sư") */
  quyMo: string | null;
  /** Khối Thị trường / Quốc gia (VD: "Toàn cầu & SEA") */
  quocGia: string | null;
  thoiGianLamViec: string | null;
  chinhSachOT: string | null;
  giaiThuong: string | null;
  /** Ảnh từng section hiển thị trên trang chi tiết công ty */
  sectionImages: CompanySectionImages;
}

/** Thông tin Nhà tuyển dụng / HR đang phụ trách (Bảng NHATUYENDUNG & TAIKHOAN) */
export interface HrProfileInfo {
  maNTD: string;
  hoTen: string | null;
  chucVu: string | null;
  soDienThoai: string | null;
  email: string;
}

/** Thông tin Chi nhánh / Trụ sở (Bảng CHINHANH) */
export interface CompanyBranchItem {
  maChiNhanh: string;
  thanhPho: string;
  diaChi: string;
  mapUrl: string | null;
  viDo: number | null;
  kinhDo: number | null;
  /** Xác định chi nhánh có trùng địa chỉ chính của công ty (TRỤ SỞ CHÍNH) */
  laTruSoChinh: boolean;
}

/** Payload tạo/cập nhật danh sách Chi nhánh */
export interface UpsertCompanyBranchPayload {
  maChiNhanh?: string;
  thanhPho: string;
  diaChi: string;
  mapUrl?: string | null;
  viDo?: number | null;
  kinhDo?: number | null;
}

/** Khối trạng thái "Độ hoàn thiện hồ sơ" */
export interface CompanyProfileCompletion {
  /** Phần trăm hoàn thiện từ 0 đến 100 (VD: 92%) */
  percent: number;
  /** Danh sách các trường còn thiếu để hiển thị "Gợi ý tối ưu hồ sơ" */
  missingFields: CompanyProfileCompletionField[];
}

/** Thông tin Bài viết & Tin tức công ty (Bảng BAIVIET) */
export interface CompanyProfilePostItem {
  maBaiViet: string;
  tieuDe: string;
  anhBiaUrl: string | null;
  noiDung: string;
  ngayDang: string | Date;
}

/** Payload tạo mới bài viết công ty */
export interface CreateCompanyPostPayload {
  tieuDe: string;
  anhBiaUrl?: string | null;
  noiDung: string;
}

/** Payload cập nhật bài viết công ty */
export interface UpdateCompanyPostPayload {
  tieuDe?: string;
  anhBiaUrl?: string | null;
  noiDung?: string;
}

/** Thông tin Đánh giá công ty hiển thị cho HR (Bảng DANHGIA) */
export interface CompanyProfileReviewItem {
  id: string;
  title: string;
  content: string | null;
  pros: string | null;
  cons: string | null;
  rating: number;
  recommend: boolean;
  createdAt: string | Date;
}

/** Thống kê nhanh dùng cho Badges trên các Tabs giao diện */
export interface CompanyProfileStats {
  /** Số lượng chi nhánh (hiển thị trên badge Tab Chi nhánh & Văn phòng) */
  totalBranches: number;
  /** Điểm đánh giá trung bình (VD: 4.8 sao trên badge Tab Đánh giá & Xếp hạng) */
  averageRating: number | null;
  /** Tổng số lượt đánh giá */
  totalReviews: number;
  /** Tỉ lệ % khuyên làm việc tại công ty */
  recommendPercent?: number | null;
  /** Tổng số bài viết đang hiển thị trên trang công ty */
  totalPosts?: number;
  /** Tổng số việc làm đang tuyển công khai */
  totalActiveJobs?: number;
  /** Tổng số ứng viên đang theo dõi công ty */
  followerCount?: number;
}

/** Payload phản hồi đầy đủ của endpoint GET /employer/profile */
export interface CompanyProfileResponse {
  company: CompanyInfo;
  hr: HrProfileInfo;
  branches: CompanyBranchItem[];
  posts?: CompanyProfilePostItem[];
  reviews?: CompanyProfileReviewItem[];
  completion: CompanyProfileCompletion;
  stats: CompanyProfileStats;
}

// ---------------------------------------------------------------------
// 2. REQUEST PAYLOAD (PUT/PATCH /employer/profile)
// ---------------------------------------------------------------------

/** Payload cập nhật thông tin công ty */
export interface UpdateCompanyInfoPayload {
  tenCongTy?: string;
  tenPhapLy?: string | null;
  moTa?: string | null;
  phucLoi?: string | null;
  chuyenMon?: string | null;
  aboutMe?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  thanhPho?: string | null;
  diaChi?: string | null;
  moHinhCongTy?: string | null;
  linhVuc?: string[];
  quyMo?: string | null;
  quocGia?: string | null;
  thoiGianLamViec?: string | null;
  chinhSachOT?: string | null;
  giaiThuong?: string | null;
  sectionImages?: CompanySectionImages;
}

/** Payload cập nhật thông tin cá nhân HR */
export interface UpdateHrProfilePayload {
  hoTen?: string | null;
  chucVu?: string | null;
  soDienThoai?: string | null;
}

/** Body tổng hợp khi gửi request cập nhật hồ sơ doanh nghiệp */
export interface UpdateCompanyProfilePayload {
  company?: UpdateCompanyInfoPayload;
  hr?: UpdateHrProfilePayload;
  branches?: UpsertCompanyBranchPayload[];
}

/** Phản hồi sau khi cập nhật thành công */
export interface UpdateCompanyProfileResponse {
  message: string;
  data: CompanyProfileResponse;
}

