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

export interface Company {
  id: string;
  name: string;
  logo: string;
  location: string;
  jobs: number; // Đây là tổng số việc làm hiển thị trên Card
}
