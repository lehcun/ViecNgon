export interface LoginResponse {
  message: string;
  user: User;
}

export interface User {
  maTaiKhoan: string;
  email: string;
  tenNguoiDung: string;
  sdt?: string;
  vaiTro: "ADMIN" | "UNGVIEN" | "NHATUYENDUNG";
  trangThai: string;
}

export interface Job {
  maCongViec: string;
  tenCongViec: string;
  mucLuongToiThieu: number;
  mucLuongToiDa: number;
}

export interface Candidate {
  maUngVien: string;
  tenUngVien: string;
  chuyenMon: string;
  soNamKinhNghiem: number;
  avatarUrl: string | null;
  diaChi: string | null;
  kyNangs: Array<{ mucDo: string; kyNang: { tenKyNang: string } }>;
  portfolios: Array<{ tieuDe: string; projectUrl: string | null }>;
}

export interface FormattedTopCompany {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  slug: string;
  jobs: number;
}

export interface CompanyDetailResponse {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  website: string | null;
  slug: string;
  description: string | null;
  benefits: string[];
  skills: string[];
  aboutMe: string | null;
  country: string | null;
  city: string | null;
  companyModel: string | null;
  industry: string | null;
  size: string | null;
  workingTime: string | null;
  otPolicy: string | null;
  totalJobs: number;
  activeJobs: {
    id: string;
    title: string;
    slug: string;
    salaryDisplay: string;
    location: string | null;
    postedAt: string | Date;
    skills: string[];
    benefits: string[];
    workModel: string;
    // isHot?: boolean;
  }[];
}
