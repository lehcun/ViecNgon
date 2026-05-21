export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
}

export interface User {
  sub: string;
  email: string;
  name: string;
  sdt?: string;
  role: "ADMIN" | "UNGVIEN" | "NHATUYENDUNG";
  // status: "ACTIVE" | "INACTIVE";
  exp: number;
  iat: number;
}

export interface Job {
  maCongViec: string;
  tenCongViec: string;
  mucLuongToiThieu: number;
  mucLuongToiDa: number;
}

// export interface Candidate {
//   id: string;
//   tenUngVien: string;
//   chuyenMon: string;
//   soNamKinhNghiem: number;
//   avatarUrl: string | null;
//   diaChi: string | null;
//   kyNangs: Array<{ mucDo: string; kyNang: { tenKyNang: string } }>;
//   portfolios: Array<{ tieuDe: string; projectUrl: string | null }>;
// }

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
  activeJobs: {
    id: string;
    title: string;
    slug: string;
    salaryDisplay: string;
    location: string | null;
    postedAt: string | Date;
    skills: string[];
    benefits: string;
    workModel: string;
    // isHot?: boolean;
  }[];
}
export interface JobFilterParams {
  thanhPho?: string;
  loaiHinh?: string;
  hinhThucLamViec?: string;

  /**
   * Lọc theo mức lương tối thiểu mong muốn (USD hoặc VNĐ tùy thiết kế)
   * Lưu ý: Ở Frontend khi lấy từ URL xuống nó sẽ là chuỗi (string),
   * khi gửi xuống Backend (NestJS) thì Class-validator sẽ ép kiểu về Number.
   * VD: "500", "1000", "2000"
   */
  mucLuong?: string;
  page?: string;
}

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
  company: {
    id: string;
    name: string;
    logo: string | null;
    slug: string;
    companyModel: string | null;
    industry: string | null;
    size: string | null;
    country: string | null;
    workingTime: string | null;
    otPolicy: string | null;
  };
}

export interface CandidateProfileResponse {
  candidateId: string;
  accountId: string;
  candidateName: string;
  dateOfBirth: string | null;
  gender: string | null;
  yearsOfExperience: number | null;
  avatarUrl: string | null;
  profession: string;
  cvUrl: string | null;
  address: string | null;

  account: {
    email: string;
    userName: string;
    phoneNumber: string | null;
  };

  skills: {
    skillId: string;
    skillName: string;
    level: string | null;
  }[];
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

export interface RecentApplicant {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  avatarUrl: string | null;
  status: string;
  appliedAt: string | Date;
  jobTitle: string; // Tên job đã được BE map sẵn
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

export interface SkillResponse {
  id: string;
  name: string;
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
}
