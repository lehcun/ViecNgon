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
