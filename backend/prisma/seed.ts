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
  await prisma.chiNhanh.deleteMany();
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
      moTa: 'FPT Software là công ty công nghệ lớn nhất Việt Nam với hơn 30.000 nhân viên trên toàn cầu. Chúng tôi tiên phong trong lĩnh vực chuyển đổi số, cung cấp các dịch vụ IT chất lượng cao như Cloud, AI/ML, Data Analytics và RPA cho hàng trăm khách hàng Fortune 500 trên thế giới.',
      phucLoi: JSON.stringify([
        'Lương tháng 13 và thưởng hiệu quả công việc cuối năm.',
        'Gói bảo hiểm sức khỏe FPT Care độc quyền cho nhân viên và người thân.',
        'Lộ trình thăng tiến rõ ràng, cơ hội làm việc Onsite ngắn hạn và dài hạn tại Nhật Bản, Mỹ, Châu Âu.',
        'Hệ sinh thái tiện ích Campus chuẩn quốc tế: phòng Gym, bể bơi, khu thể thao ngoài trời, quán cafe đa dạng.',
      ]),
      chuyenMon:
        'Cloud Computing, AI & Machine Learning, Automotive, Enterprise Applications.',
      aboutMe:
        'Môi trường làm việc trẻ trung, năng động, nơi mọi ý tưởng đều được tôn trọng và tạo điều kiện phát triển.',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
      website: 'https://fptsoftware.com',
      thanhPho: 'Hà Nội',
      diaChi: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội', // Trụ sở chính
      moHinhCongTy: 'Outsource / Dịch vụ IT',
      linhVuc: 'Công nghệ thông tin / Phần mềm',
      quyMo: '10,000+ nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (08:30 - 17:30)',
      chinhSachOT:
        'Thanh toán OT theo đúng quy định Luật Lao động (150%, 200%, 300%)',
      giaiThuong: 'Top 100 Nơi làm việc tốt nhất Việt Nam 2023, Sao Khuê 2023',
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
      moTa: 'Thành lập từ 2004, VNG là Kỳ lân công nghệ đầu tiên của Việt Nam. Chúng tôi xây dựng và phát triển các sản phẩm công nghệ với hàng chục triệu người dùng thực như Zalo, VNGGames, ZaloPay, và VNG Cloud.',
      phucLoi: JSON.stringify([
        'Lương tháng 13 & Performance Bonus (lên tới 3 tháng lương)',
        'Bảo hiểm sức khỏe Premium cho bản thân và gia đình',
        'Tài trợ chứng chỉ quốc tế (AWS, OCA, PMP...)',
      ]),
      chuyenMon: 'Social Media, Online Gaming, E-wallet, Cloud Services',
      aboutMe:
        'Kiến tạo công nghệ, Phát triển con người. VNG tin tưởng vào sức mạnh của Internet sẽ thay đổi cuộc sống.',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325179/vng_st3yi1.jpg',
      website: 'https://vng.com.vn',
      thanhPho: 'TP.HCM',
      diaChi:
        'VNG Campus, Z06 Đường số 13, Khu chế xuất Tân Thuận, Quận 7, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Internet & Giải trí điện tử',
      quyMo: '1000 - 5000 nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6',
      chinhSachOT:
        'Không khuyến khích OT. Áp dụng nghỉ bù (Comp-off) nếu có phát sinh OT',
      giaiThuong: 'Nhà xuất bản Game hàng đầu Đông Nam Á',
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
      phucLoi: JSON.stringify([
        'Gói bảo hiểm sức khỏe FPT Care độc quyền cho nhân viên và người thân.',
        'Hệ sinh thái tiện ích Campus chuẩn quốc tế: phòng Gym, bể bơi, khu thể thao ngoài trời, quán cafe đa dạng.',
      ]),
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
  // 3.1 TẠO CHI NHÁNH ĐỊA ĐIỂM (ĐA CHI NHÁNH)
  // =========================================================
  console.log('📍 Đang tạo Chi nhánh công ty...');

  const cnFPTHaNoi = await prisma.chiNhanh.create({
    data: {
      maCongTy: ctyFPT.maCongTy,
      thanhPho: 'Hà Nội',
      diaChi: 'Tòa nhà FPT, Số 17 Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=FPT+Duy+Tan',
    },
  });

  const cnFPTDaNang = await prisma.chiNhanh.create({
    data: {
      maCongTy: ctyFPT.maCongTy,
      thanhPho: 'Đà Nẵng',
      diaChi:
        'FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng',
      mapUrl: 'https://maps.google.com/?q=FPT+Complex',
    },
  });

  const cnVNGHCM = await prisma.chiNhanh.create({
    data: {
      maCongTy: ctyVNG.maCongTy,
      thanhPho: 'TP.HCM',
      diaChi:
        'VNG Campus, Z06 Đường số 13, Khu chế xuất Tân Thuận, Quận 7, TP.HCM',
      mapUrl: 'https://maps.google.com/?q=VNG+Campus',
    },
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
  console.log('💼 Đang đăng tải tin tuyển dụng chi tiết...');
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  // Job 1 - FPT Software (Chi nhánh Hà Nội)
  const job1 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Senior Java Backend Engineer (Financial Project)',
      slug: 'senior-java-backend-engineer-financial-project-fpt',

      // Khối nội dung chi tiết đã được chuẩn hóa JSON
      moTa: JSON.stringify([
        'Trực tiếp tham gia phân tích yêu cầu, thiết kế kiến trúc và viết code cho hệ thống Core Banking của đối tác chiến lược tại Mỹ.',
        'Tối ưu hóa hiệu năng hệ thống (performance tuning), đảm bảo khả năng xử lý hàng triệu giao dịch mỗi ngày (High Availability, Scalability).',
        'Phối hợp chặt chẽ với team BA, QA và khách hàng để giải quyết các technical bugs phức tạp.',
        'Thực hiện Code Review và hướng dẫn/mentor cho các bạn Junior/Fresher trong team.',
      ]),
      yeuCauCongViec: JSON.stringify([
        'Có tối thiểu 4 năm kinh nghiệm làm việc thực tế với Java (Java 8+ trở lên).',
        'Nắm vững hệ sinh thái Spring (Spring Boot, Spring MVC, Spring Data JPA, Spring Security).',
        'Có kinh nghiệm làm việc với kiến trúc Microservices và thiết kế RESTful APIs.',
        'Thành thạo các hệ quản trị CSDL quan hệ (PostgreSQL/Oracle) và NoSQL (MongoDB/Redis).',
        'Nắm vững các công cụ CI/CD, Git, Docker, Kubernetes.',
        'Tiếng Anh giao tiếp và đọc hiểu tài liệu chuyên ngành tốt (Tương đương TOEIC 650+).',
      ]),
      phucLoi: JSON.stringify([
        'Lương cơ bản lên đến $2500 + Thưởng hiệu suất dự án hàng quý.',
        'Được tài trợ 100% lệ phí thi các chứng chỉ quốc tế (AWS, Oracle, PMP).',
        'Cung cấp thiết bị làm việc hiện đại (Macbook, Màn hình phụ 27 inch).',
        'Tham gia các lớp đào tạo tiếng Nhật/Tiếng Anh miễn phí tại công ty.',
      ]),

      mucLuongToiThieu: 30000000,
      mucLuongToiDa: 60000000,
      yeuCauKinhNghiem: 4,
      capBac: 'Senior',

      // Khối địa điểm & hình thức
      thanhPho: 'Hà Nội',
      loaiHinh: 'Full-time',
      hinhThucLamViec: 'Hybrid', // Làm việc kết hợp

      // Khối thời gian & quan hệ
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      luotXem: 125,
      trangThai: 'Đang tuyển',
      maNTD: hrFPT.maNTD,
      maChiNhanh: cnFPTHaNoi.maChiNhanh,
    },
  });

  // Job 2 - VNG Corporation (Chi nhánh HCM)
  const job2 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Node.js Developer (ZaloPay Platform)',
      slug: 'nodejs-developer-zalopay-platform-vng',

      // Khối nội dung chi tiết đã được chuẩn hóa JSON
      moTa: JSON.stringify([
        'Phát triển và bảo trì các dịch vụ Backend/APIs cho nền tảng thanh toán ZaloPay, phục vụ hàng chục triệu người dùng.',
        'Tham gia vào quá trình System Design, giải quyết các bài toán về Concurrency, Data Consistency trong xử lý giao dịch tài chính.',
        'Giám sát hệ thống (Monitoring), phát hiện và xử lý sự cố (Troubleshooting) kịp thời để đảm bảo SLA 99.99%.',
        'Viết Unit Test và Integration Test để đảm bảo chất lượng code đầu ra.',
      ]),
      yeuCauCongViec: JSON.stringify([
        'Từ 2-3 năm kinh nghiệm phát triển Backend với Node.js (Express, NestJS).',
        'Hiểu biết sâu sắc về JavaScript/TypeScript, Event Loop và Async/Await trong Node.js.',
        'Có kinh nghiệm làm việc với Message Queue (Kafka, RabbitMQ) và hệ thống Cache (Redis).',
        'Tư duy logic tốt, am hiểu về Data Structures & Algorithms.',
        'Có kinh nghiệm trong lĩnh vực FinTech, Payment Gateway là một điểm cộng lớn.',
      ]),
      phucLoi: JSON.stringify([
        'Package thu nhập lên tới 15 tháng lương/năm.',
        'Cấp Macbook Pro M3 max option ngay ngày đầu tiên nhận việc.',
        'Tham gia CLB thể thao của công ty (Bóng đá, Cầu lông, Yoga) với phí tài trợ 100%.',
        'Môi trường làm việc cởi mở, không áp đặt dresscode.',
      ]),

      mucLuongToiThieu: 25000000,
      mucLuongToiDa: 45000000,
      yeuCauKinhNghiem: 2,
      capBac: 'Middle',

      // Khối địa điểm & hình thức
      thanhPho: 'TP.HCM',
      loaiHinh: 'Full-time',
      hinhThucLamViec: 'Tại văn phòng',

      // Khối thời gian & quan hệ
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      luotXem: 340,
      trangThai: 'Đang tuyển',
      maNTD: hrVNG.maNTD,
      maChiNhanh: cnVNGHCM.maChiNhanh,
    },
  });

  // (Optional: Job 3 làm việc từ xa hoàn toàn - Remote)
  const job3 = await prisma.congViec.create({
    data: {
      tenCongViec: 'Fullstack ReactJS/NodeJS (Remote - Đà Nẵng)',
      slug: 'fullstack-reactjs-nodejs-remote-fpt-danang',

      // Khối nội dung chi tiết đã được chuẩn hóa JSON
      moTa: JSON.stringify([
        'Tham gia dự án phát triển hệ thống ERP nội bộ cho khách hàng quốc tế.',
        'Viết code linh hoạt cho cả phía Frontend (React) và Backend (NodeJS).',
        'Chủ động báo cáo tiến độ công việc qua Jira và tham gia các buổi họp Daily Scrum hàng ngày.',
      ]),
      yeuCauCongViec: JSON.stringify([
        '3 năm kinh nghiệm lập trình Fullstack.',
        'Kỹ năng tự quản lý thời gian tốt vì tính chất công việc làm từ xa.',
        'Thành thạo Gitflow và quy trình CI/CD cơ bản.',
      ]),
      phucLoi: JSON.stringify([
        'Trợ cấp set-up góc làm việc tại nhà (Màn hình, bàn ghế công thái học).',
        'Thời gian làm việc hoàn toàn chủ động theo múi giờ cá nhân.',
      ]),

      mucLuongToiThieu: 20000000,
      mucLuongToiDa: 40000000,
      yeuCauKinhNghiem: 3,
      capBac: 'Middle',
      thanhPho: 'Đà Nẵng',
      loaiHinh: 'Full-time',
      hinhThucLamViec: 'Remote', // Làm việc từ xa hoàn toàn
      ngayDang: new Date(),
      ngayHetHan: nextMonth,
      luotXem: 89,
      trangThai: 'Đang tuyển',
      maNTD: hrFPT.maNTD,
      maChiNhanh: cnFPTDaNang.maChiNhanh,
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
