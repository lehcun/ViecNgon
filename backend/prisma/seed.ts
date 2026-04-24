import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Đang dọn dẹp cơ sở dữ liệu cũ (Reset)...');

  // XÓA DỮ LIỆU THEO THỨ TỰ TỪ BẢNG CON ĐẾN BẢNG CHA
  await prisma.thanhToan.deleteMany();
  await prisma.muaQuangCao.deleteMany();
  await prisma.lichPhongVan.deleteMany();
  await prisma.donXinViec.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.ungVienKyNang.deleteMany();
  await prisma.congViec.deleteMany();
  await prisma.ungVien.deleteMany();
  await prisma.nhaTuyenDung.deleteMany();
  await prisma.congTy.deleteMany();
  await prisma.danhGia.deleteMany();
  await prisma.thongBao.deleteMany();
  await prisma.kyNang.deleteMany();
  await prisma.goiQuangCao.deleteMany();
  await prisma.taiKhoan.deleteMany();

  console.log('Dọn dẹp xong! Bắt đầu tạo dữ liệu mới...');

  // ==========================================
  // 1. TẠO CÁC DANH MỤC GÓI QUẢNG CÁO (ĐẦY ĐỦ)
  // ==========================================
  console.log('Đang tạo các Gói Quảng Cáo...');
  await prisma.goiQuangCao.createMany({
    data: [
      {
        tieuDe: 'Gói Cơ Bản',
        loaiQuangCao: 'Tin thường',
        gia: 100000,
        thoiGianHieuLuc: 7,
        soLuotDangTin: 1,
        ngayTao: new Date(),
      },
      {
        tieuDe: 'Gói Tiêu Chuẩn',
        loaiQuangCao: 'Tin nổi bật',
        gia: 300000,
        thoiGianHieuLuc: 14,
        soLuotDangTin: 3,
        ngayTao: new Date(),
      },
      {
        tieuDe: 'Gói VIP - Đẩy tin lên TOP',
        loaiQuangCao: 'Top Tìm Kiếm',
        gia: 500000,
        thoiGianHieuLuc: 30,
        soLuotDangTin: 5,
        ngayTao: new Date(),
      },
      {
        tieuDe: 'Gói Kim Cương - Banner Trang Chủ',
        loaiQuangCao: 'Banner Trang Chủ',
        gia: 1500000,
        thoiGianHieuLuc: 30,
        soLuotDangTin: 10,
        ngayTao: new Date(),
      },
    ],
  });

  // Lấy ra 1 gói VIP để dùng cho phần Thanh Toán phía dưới
  const goiVip = await prisma.goiQuangCao.findFirst({
    where: { tieuDe: 'Gói VIP - Đẩy tin lên TOP' },
  });

  // ==========================================
  // 2. TẠO DANH MỤC KỸ NĂNG
  // ==========================================
  const kyNangReact = await prisma.kyNang.create({
    data: { tenKyNang: 'ReactJS' },
  });
  const kyNangNest = await prisma.kyNang.create({
    data: { tenKyNang: 'NestJS' },
  });
  const kyNangSQL = await prisma.kyNang.create({
    data: { tenKyNang: 'SQL Server' },
  });

  // ==========================================
  // 3. TẠO CÔNG TY (THEO DANH SÁCH TỪ UI TRANG CHỦ)
  // ==========================================
  console.log('Đang tạo dữ liệu Công Ty hàng đầu...');
  await prisma.congTy.createMany({
    data: [
      {
        tenCongTy: 'Grab (Vietnam)',
        urlLogo:
          'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325175/grab_w4das4.png',
        website: 'https://grab.com',
        diaChi: 'TP.HCM',
      },
      {
        tenCongTy: 'NAB Innovation',
        urlLogo:
          'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325176/nab_l1zght.png',
        website: 'https://nab.com.au',
        diaChi: 'Hà nội',
      },
      {
        tenCongTy: 'ANDPAD Vietnam',
        urlLogo:
          'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325177/andpa_omjtkp.png',
        website: 'https://andpad.vn',
        diaChi: 'TP.HCM',
      },
      {
        tenCongTy: 'HSC',
        urlLogo:
          'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325178/hsc_i6nltx.png',
        website: 'https://hsc.com.vn',
        diaChi: 'TP.HCM',
      },
      {
        tenCongTy: 'VNG Corporation',
        urlLogo:
          'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325179/vng_st3yi1.jpg',
        website: 'https://vng.com.vn',
        diaChi: 'TP.HCM',
      },
    ],
  });

  // Tạo riêng FPT Software để lấy object liên kết với HR phía dưới
  const congTyFPT = await prisma.congTy.create({
    data: {
      tenCongTy: 'FPT Software',
      urlLogo:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325180/fpt_nvigcr.png',
      website: 'https://fpt.com',
      diaChi: 'Đà Nẵng',
    },
  });

  // ==========================================
  // 4. TẠO TÀI KHOẢN (Admin, HR, Ứng viên)
  // ==========================================
  const tkAdmin = await prisma.taiKhoan.create({
    data: {
      email: 'admin@vieclamcdio.com',
      tenNguoiDung: 'Quản Trị Viên',
      matKhau: 'hashed_pw',
      vaiTro: 'ADMIN',
      trangThai: 'Active',
    },
  });

  const tkHR = await prisma.taiKhoan.create({
    data: {
      email: 'hr@fpt.com',
      tenNguoiDung: 'Lê HR',
      matKhau: 'hashed_pw',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });

  const tkUngVien = await prisma.taiKhoan.create({
    data: {
      email: 'ungvien@gmail.com',
      tenNguoiDung: 'Nguyễn Văn Ứng Viên',
      matKhau: 'hashed_pw',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  // ==========================================
  // 5. TẠO HỒ SƠ ỨNG VIÊN & NHÀ TUYỂN DỤNG
  // ==========================================
  const hrProfile = await prisma.nhaTuyenDung.create({
    data: { maCongTy: congTyFPT.maCongTy, maTaiKhoan: tkHR.maTaiKhoan },
  });

  const ungVienProfile = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUngVien.maTaiKhoan,
      tenUngVien: 'Nguyễn Văn Ứng Viên',
      chuyenMon: 'Fullstack Developer',
      cvUrl: 'https://link-to-cv.com/cv.pdf',
      diaChi: 'Đà Nẵng',
      soNamKinhNghiem: 2,
      avatarUrl: 'https://example.com/avatars/ungvien.png',
    },
  });

  // ==========================================
  // 6. GẮN KỸ NĂNG VÀ TẠO PORTFOLIO CHO ỨNG VIÊN
  // ==========================================
  await prisma.ungVienKyNang.createMany({
    data: [
      {
        maUngVien: ungVienProfile.maUngVien,
        maKyNang: kyNangReact.maKyNang,
        mucDo: 'Khá',
      },
      {
        maUngVien: ungVienProfile.maUngVien,
        maKyNang: kyNangNest.maKyNang,
        mucDo: 'Giỏi',
      },
    ],
  });

  await prisma.portfolio.create({
    data: {
      maUngVien: ungVienProfile.maUngVien,
      tieuDe: 'Dự án Website Bán Hàng',
      projectUrl: 'https://github.com/my-project',
    },
  });

  // ==========================================
  // 7. TẠO BÀI ĐĂNG CÔNG VIỆC TỪ HR FPT
  // ==========================================
  const congViec = await prisma.congViec.create({
    data: {
      maNTD: hrProfile.maNTD,
      tenCongViec: 'Lập Trình Viên NestJS',
      moTa: 'Thiết kế API hệ thống Backend',
      mucLuongToiThieu: 15000000,
      mucLuongToiDa: 25000000,
      ngayDang: new Date(),
      loaiHinh: 'Toàn thời gian',
      capBac: 'Junior',
      trangThai: 'Đang tuyển',
      diaDiem: 'TP.HCM',
    },
  });

  // ==========================================
  // 8. ỨNG VIÊN NỘP ĐƠN & NHÀ TUYỂN DỤNG HẸN LỊCH
  // ==========================================
  const donXinViec = await prisma.donXinViec.create({
    data: {
      maUngVien: ungVienProfile.maUngVien,
      maCongViec: congViec.maCongViec,
      chiTiet: 'Chào công ty, em có kinh nghiệm làm NestJS 2 năm...',
      ngayNop: new Date(),
      trangThai: 'Chờ phỏng vấn',
    },
  });

  await prisma.lichPhongVan.create({
    data: {
      maDon: donXinViec.maDon,
      thoiGian: new Date('2026-05-01T09:00:00Z'),
      linkMeeting: 'https://meet.google.com/abc-xyz',
      trangThaiLich: 'Đã lên lịch',
    },
  });

  // ==========================================
  // 9. HR MUA QUẢNG CÁO & THANH TOÁN
  // ==========================================
  if (goiVip) {
    const muaQuangCao = await prisma.muaQuangCao.create({
      data: {
        maNTD: hrProfile.maNTD,
        maGoi: goiVip.maGoi,
        giaTaiThoiDiemMua: 450000, // Có giảm giá
        soLuotConLai: 5,
        ngayBatDau: new Date(),
        ngayKetThuc: new Date(new Date().setDate(new Date().getDate() + 30)),
        ngayMua: new Date(),
        trangThai: 'Đã thanh toán',
      },
    });

    await prisma.thanhToan.create({
      data: {
        maMua: muaQuangCao.maMua,
        ngayThanhToan: new Date(),
        soTienThanhToan: 450000,
        phuongThucTT: 'Chuyển khoản VNPay',
        trangThaiTT: 'Thành công',
        maGiaoDichDoiTac: 'VNPAY99887766',
      },
    });
  }

  // ==========================================
  // 10. TẠO THÔNG BÁO VÀ ĐÁNH GIÁ
  // ==========================================
  await prisma.thongBao.create({
    data: {
      maTaiKhoan: tkUngVien.maTaiKhoan,
      tieuDe: 'Có lịch phỏng vấn mới!',
      noiDung: 'Bạn vừa nhận được lịch phỏng vấn từ FPT.',
      trangThai: 'Chưa đọc',
    },
  });

  await prisma.danhGia.create({
    data: {
      maNguoiDanhGia: tkUngVien.maTaiKhoan,
      maDoiTuongDuocDanhGia: hrProfile.maNTD,
      loaiDoiTuong: 'NTD',
      rating: 5.0,
      tieuDe: 'Tuyệt vời',
      noiDung: 'HR rất thân thiện và chuyên nghiệp',
      ngayDanhGia: new Date(),
    },
  });

  console.log(
    'Bơm dữ liệu thành công cho toàn bộ bảng (Đã cập nhật Logo Công ty và Gói Quảng cáo)!',
  );
}

main()
  .catch((e) => {
    console.error('Đã xảy ra lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
