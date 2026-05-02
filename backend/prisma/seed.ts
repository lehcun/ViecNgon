import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Bắt đầu dọn dẹp cơ sở dữ liệu (Clean up)...');

  // 1. Xóa dữ liệu theo thứ tự (từ bảng con đến bảng cha) để tránh lỗi khóa ngoại
  await prisma.theoDoiCongTy.deleteMany();
  await prisma.congViecKyNang.deleteMany();
  await prisma.ungVienKyNang.deleteMany();
  await prisma.lichPhongVan.deleteMany();
  await prisma.donXinViec.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.thanhToan.deleteMany();
  await prisma.muaQuangCao.deleteMany();
  await prisma.danhGia.deleteMany();
  await prisma.thongBao.deleteMany();
  await prisma.baiViet.deleteMany();
  await prisma.congViec.deleteMany();
  await prisma.goiQuangCao.deleteMany();
  await prisma.kyNang.deleteMany();
  await prisma.nhaTuyenDung.deleteMany();
  await prisma.ungVien.deleteMany();
  await prisma.congTy.deleteMany();
  await prisma.taiKhoan.deleteMany();

  console.log('✅ Dọn dẹp hoàn tất. Bắt đầu bơm dữ liệu mẫu (Seeding)...');

  // Mật khẩu chung: "123456" đã được băm (hash) bằng bcrypt
  const mockPassword =
    '$2b$10$XoV.Bv0Vj/E4.K1Y/2W6O.6x.OiN3aP9W9k1l2m3n4o5p6q7r8s9t';

  // =========================================================
  // 2. TẠO TÀI KHOẢN (ADMIN, HR, ỨNG VIÊN)
  // =========================================================
  console.log('👤 Đang tạo Tài khoản...');

  const tkAdmin = await prisma.taiKhoan.create({
    data: {
      email: 'admin@viecngon.vn',
      tenNguoiDung: 'Quản Trị Viên',
      matKhau: mockPassword,
      sdt: '0901111111',
      vaiTro: 'ADMIN',
      trangThai: 'Active',
    },
  });

  // Tài khoản HR
  const tkHR_FPT = await prisma.taiKhoan.create({
    data: {
      email: 'hr.fpt@fpt.com',
      tenNguoiDung: 'Tuyển dụng FPT',
      matKhau: mockPassword,
      sdt: '0912222222',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const tkHR_VNG = await prisma.taiKhoan.create({
    data: {
      email: 'talent@vng.com.vn',
      tenNguoiDung: 'VNG Talent',
      matKhau: mockPassword,
      sdt: '0923333333',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const tkHR_Shopee = await prisma.taiKhoan.create({
    data: {
      email: 'hr@shopee.vn',
      tenNguoiDung: 'Shopee Careers',
      matKhau: mockPassword,
      sdt: '0934444444',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const tkHR_Momo = await prisma.taiKhoan.create({
    data: {
      email: 'tuyendung@momo.vn',
      tenNguoiDung: 'MoMo HR',
      matKhau: mockPassword,
      sdt: '0945555555',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });

  // Tài khoản Ứng viên
  const tkUV_Tuan = await prisma.taiKhoan.create({
    data: {
      email: 'tuan.nguyen@gmail.com',
      tenNguoiDung: 'Nguyễn Anh Tuấn',
      matKhau: mockPassword,
      sdt: '0981112223',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });
  const tkUV_Mai = await prisma.taiKhoan.create({
    data: {
      email: 'mai.tran@gmail.com',
      tenNguoiDung: 'Trần Thị Phương Mai',
      matKhau: mockPassword,
      sdt: '0982223334',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });
  const tkUV_Hoang = await prisma.taiKhoan.create({
    data: {
      email: 'hoang.le@gmail.com',
      tenNguoiDung: 'Lê Minh Hoàng',
      matKhau: mockPassword,
      sdt: '0983334445',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  // =========================================================
  // 3. TẠO CÔNG TY & NHÀ TUYỂN DỤNG
  // =========================================================
  console.log('🏢 Đang tạo Công ty và kết nối hồ sơ HR...');

  const ctyFPT = await prisma.congTy.create({
    data: {
      tenCongTy: 'FPT Software',
      tenPhapLy: 'Công ty TNHH Phần mềm FPT',
      slug: 'fpt-software',
      moTa: 'FPT Software là công ty công nghệ lớn nhất Việt Nam với hơn 30.000 nhân viên trên toàn cầu, cung cấp các dịch vụ IT chất lượng cao.',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
      website: 'https://fptsoftware.com',
      diaChi: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
      thanhPho: 'Hà Nội',
      moHinhCongTy: 'Outsource',
      linhVuc: 'Phần mềm & IT',
      quyMo: '10000+ nhân viên',
      quocGia: 'Việt Nam',
    },
  });
  const hrFPT = await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyFPT.maCongTy, maTaiKhoan: tkHR_FPT.maTaiKhoan },
  });

  const ctyVNG = await prisma.congTy.create({
    data: {
      tenCongTy: 'VNG Corporation',
      tenPhapLy: 'Công ty Cổ phần VNG',
      slug: 'vng-corporation',
      moTa: 'Kỳ lân công nghệ đầu tiên của Việt Nam, phát triển Zalo, VNGGames, ZaloPay và nền tảng VNG Cloud.',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325179/vng_st3yi1.jpg',
      website: 'https://vng.com.vn',
      diaChi: 'Z06 Đường số 13, Tân Thuận Đông, Quận 7, TP.HCM',
      thanhPho: 'TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Giải trí & Internet',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Việt Nam',
    },
  });
  const hrVNG = await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyVNG.maCongTy, maTaiKhoan: tkHR_VNG.maTaiKhoan },
  });

  const ctyShopee = await prisma.congTy.create({
    data: {
      tenCongTy: 'Shopee Vietnam',
      tenPhapLy: 'Công ty TNHH Shopee',
      slug: 'shopee-vietnam',
      moTa: 'Nền tảng thương mại điện tử hàng đầu tại Đông Nam Á và Đài Loan.',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1777681291/shopee-vn_hwihqn.jpg',
      website: 'https://careers.shopee.vn',
      diaChi: 'Saigon Centre, 65 Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
      thanhPho: 'TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Thương mại điện tử',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Singapore',
    },
  });
  const hrShopee = await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyShopee.maCongTy, maTaiKhoan: tkHR_Shopee.maTaiKhoan },
  });

  const ctyMomo = await prisma.congTy.create({
    data: {
      tenCongTy: 'MoMo',
      tenPhapLy: 'Công ty Cổ phần Dịch vụ Di động Trực tuyến (M_Service)',
      slug: 'momo-vietnam',
      moTa: 'Siêu ứng dụng thanh toán số 1 tại Việt Nam, tiên phong trong lĩnh vực FinTech.',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png',
      website: 'https://momo.vn',
      diaChi: 'Tòa nhà Phú Mỹ Hưng, Hoàng Văn Thái, Quận 7, TP.HCM',
      thanhPho: 'TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'FinTech',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Việt Nam',
    },
  });
  const hrMomo = await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyMomo.maCongTy, maTaiKhoan: tkHR_Momo.maTaiKhoan },
  });

  // =========================================================
  // 4. TẠO TỪ ĐIỂN KỸ NĂNG (SKILLS)
  // =========================================================
  console.log('⚡ Đang tạo Kỹ năng hệ thống...');
  const skillsData = [
    'ReactJS',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'TypeScript',
    'Figma',
  ];
  const createdSkills: { maKyNang: string; tenKyNang: string }[] = [];
  for (const name of skillsData) {
    const skill = await prisma.kyNang.create({ data: { tenKyNang: name } });
    createdSkills.push(skill);
  }
  const [
    knReact,
    knNode,
    knPython,
    knJava,
    knSQL,
    knAWS,
    knDocker,
    knK8s,
    knTS,
    knFigma,
  ] = createdSkills;

  // =========================================================
  // 5. TẠO HỒ SƠ ỨNG VIÊN & GẮN KỸ NĂNG
  // =========================================================
  console.log('🧑‍💻 Đang tạo Hồ sơ Ứng viên...');
  const uvTuan = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUV_Tuan.maTaiKhoan,
      tenUngVien: 'Nguyễn Anh Tuấn',
      ngaySinh: new Date('1996-08-12'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 5,
      chuyenMon: 'Senior Backend Developer',
      cvUrl: '/uploads/cv/tuan_nguyen_cv.pdf',
      diaChi: 'Hà Nội',
      trangThaiPortfolio: 'Public',
    },
  });

  const uvMai = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUV_Mai.maTaiKhoan,
      tenUngVien: 'Trần Thị Phương Mai',
      ngaySinh: new Date('1999-03-25'),
      gioiTinh: 'Nữ',
      soNamKinhNghiem: 2,
      chuyenMon: 'UI/UX Designer & Frontend',
      cvUrl: '/uploads/cv/mai_tran_cv.pdf',
      diaChi: 'Hồ Chí Minh',
      trangThaiPortfolio: 'Public',
    },
  });

  const uvHoang = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUV_Hoang.maTaiKhoan,
      tenUngVien: 'Lê Minh Hoàng',
      ngaySinh: new Date('1995-11-05'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 7,
      chuyenMon: 'DevOps / Cloud Engineer',
      cvUrl: '/uploads/cv/hoang_le_cv.pdf',
      diaChi: 'Đà Nẵng',
      trangThaiPortfolio: 'Public',
    },
  });

  await prisma.ungVienKyNang.createMany({
    data: [
      {
        maUngVien: uvTuan.maUngVien,
        maKyNang: knNode.maKyNang,
        mucDo: 'Chuyên gia',
      },
      { maUngVien: uvTuan.maUngVien, maKyNang: knSQL.maKyNang, mucDo: 'Giỏi' },
      { maUngVien: uvTuan.maUngVien, maKyNang: knTS.maKyNang, mucDo: 'Giỏi' },
      {
        maUngVien: uvMai.maUngVien,
        maKyNang: knFigma.maKyNang,
        mucDo: 'Chuyên gia',
      },
      { maUngVien: uvMai.maUngVien, maKyNang: knReact.maKyNang, mucDo: 'Khá' },
      {
        maUngVien: uvHoang.maUngVien,
        maKyNang: knAWS.maKyNang,
        mucDo: 'Chuyên gia',
      },
      {
        maUngVien: uvHoang.maUngVien,
        maKyNang: knDocker.maKyNang,
        mucDo: 'Giỏi',
      },
      { maUngVien: uvHoang.maUngVien, maKyNang: knK8s.maKyNang, mucDo: 'Giỏi' },
    ],
  });

  // =========================================================
  // 6. TẠO CÔNG VIỆC (JOB POSTINGS) & GẮN KỸ NĂNG
  // =========================================================
  console.log('💼 Đang đăng tải các Job Tuyển dụng...');
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  // Job 1 - FPT
  const job1 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Senior Java Developer (Upto $2500)',
      moTa: 'Tham gia vào các dự án chuyển đổi số quy mô lớn cho khách hàng thị trường Mỹ và Nhật Bản. Yêu cầu thành thạo Spring Boot và Microservices.',
      mucLuongToiThieu: 30000000,
      mucLuongToiDa: 60000000,
      yeuCauKinhNghiem: 4,
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      diaDiem: 'Hà Nội',
      loaiHinh: 'Toàn thời gian',
      capBac: 'Senior',
      trangThai: 'Active',
      maNTD: hrFPT.maNTD,
    },
  });

  // Job 2 - VNG
  const job2 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Backend Node.js Engineer (ZaloPay)',
      moTa: 'Thiết kế và phát triển các hệ thống chịu tải cao (High Traffic) cho siêu ứng dụng ZaloPay. Làm việc trực tiếp với Redis, Kafka và CSDL phân tán.',
      mucLuongToiThieu: 25000000,
      mucLuongToiDa: 50000000,
      yeuCauKinhNghiem: 2,
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      diaDiem: 'Hồ Chí Minh',
      loaiHinh: 'Toàn thời gian',
      capBac: 'Middle',
      trangThai: 'Active',
      maNTD: hrVNG.maNTD,
    },
  });

  // Job 3 - Shopee
  const job3 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Frontend ReactJS Engineer (E-commerce)',
      moTa: 'Tối ưu hóa trải nghiệm người dùng trên nền tảng Web của Shopee. Làm việc với ReactJS, Redux, Webpack và các kỹ thuật tối ưu hóa hiệu năng.',
      mucLuongToiThieu: 20000000,
      mucLuongToiDa: 45000000,
      yeuCauKinhNghiem: 2,
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      diaDiem: 'Hồ Chí Minh',
      loaiHinh: 'Toàn thời gian',
      capBac: 'Middle',
      trangThai: 'Active',
      maNTD: hrShopee.maNTD,
    },
  });

  // Job 4 - MoMo
  const job4 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Data Engineer / Python Developer',
      moTa: 'Xây dựng Data Pipeline, xử lý Big Data từ hàng chục triệu giao dịch mỗi ngày. Ưu tiên ứng viên mạnh về Python, PySpark và Airflow.',
      mucLuongToiThieu: 35000000,
      mucLuongToiDa: 70000000,
      yeuCauKinhNghiem: 3,
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      diaDiem: 'Hồ Chí Minh',
      loaiHinh: 'Toàn thời gian',
      capBac: 'Senior',
      trangThai: 'Active',
      maNTD: hrMomo.maNTD,
    },
  });

  // Gắn kỹ năng cho Job
  await prisma.congViecKyNang.createMany({
    data: [
      { maCongViec: job1.maCongViec, maKyNang: knJava.maKyNang },
      { maCongViec: job1.maCongViec, maKyNang: knSQL.maKyNang },
      { maCongViec: job2.maCongViec, maKyNang: knNode.maKyNang },
      { maCongViec: job2.maCongViec, maKyNang: knTS.maKyNang },
      { maCongViec: job3.maCongViec, maKyNang: knReact.maKyNang },
      { maCongViec: job3.maCongViec, maKyNang: knTS.maKyNang },
      { maCongViec: job4.maCongViec, maKyNang: knPython.maKyNang },
      { maCongViec: job4.maCongViec, maKyNang: knSQL.maKyNang },
    ],
  });

  // =========================================================
  // 7. MÔ PHỎNG NỘP ĐƠN & GÓI QUẢNG CÁO
  // =========================================================
  console.log('📝 Đang tạo Đơn ứng tuyển và Gói Dịch vụ...');

  await prisma.donXinViec.create({
    data: {
      maCongViec: job2.maCongViec,
      maUngVien: uvTuan.maUngVien,
      trangThai: 'Đã xem',
      ngayNop: new Date(),
      fileCvUrl: '/uploads/cv/tuan_nguyen_cv.pdf',
      chiTiet:
        'Tôi có 5 năm kinh nghiệm làm Backend và rất mong muốn được cống hiến cho ZaloPay.',
    },
  });

  await prisma.donXinViec.create({
    data: {
      maCongViec: job3.maCongViec,
      maUngVien: uvMai.maUngVien,
      trangThai: 'Chờ duyệt',
      ngayNop: new Date(),
      fileCvUrl: '/uploads/cv/mai_tran_cv.pdf',
      chiTiet:
        'Chào anh/chị HR, em gửi CV ứng tuyển vị trí Frontend E-commerce ạ.',
    },
  });

  await prisma.goiQuangCao.createMany({
    data: [
      {
        tieuDe: 'Gói Cơ Bản (Free)',
        loaiQuangCao: 'Standard',
        gia: 0,
        thoiGianHieuLuc: 30,
        soLuotDangTin: 3,
        ngayTao: new Date(),
      },
      {
        tieuDe: 'Gói PRO - Đẩy Top',
        loaiQuangCao: 'Premium',
        gia: 990000,
        thoiGianHieuLuc: 30,
        soLuotDangTin: 10,
        ngayTao: new Date(),
      },
      {
        tieuDe: 'Gói Enterprise - Hiển thị Banner',
        loaiQuangCao: 'VIP',
        gia: 4990000,
        thoiGianHieuLuc: 30,
        soLuotDangTin: 50,
        ngayTao: new Date(),
      },
    ],
  });

  console.log(
    '🎉 SEEDING THÀNH CÔNG! Đã khởi tạo đầy đủ hệ sinh thái: Công ty, HR, Ứng viên, Việc làm và Kỹ năng.',
  );
}

main()
  .catch((e) => {
    console.error('❌ Lỗi trong quá trình Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
