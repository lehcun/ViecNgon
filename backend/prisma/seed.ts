import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
  const password = '123456';
  const hashPassword = await bcrypt.hash(password, 10);

  // =========================================================
  // 2. TẠO TÀI KHOẢN (ADMIN, HR, ỨNG VIÊN)
  // =========================================================
  console.log('👤 Đang tạo Tài khoản...');

  const tkAdmin = await prisma.taiKhoan.create({
    data: {
      email: 'admin@viecngon.vn',
      tenNguoiDung: 'Quản Trị Viên',
      matKhau: hashPassword,
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
      matKhau: hashPassword,
      sdt: '0912222222',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const tkHR_VNG = await prisma.taiKhoan.create({
    data: {
      email: 'talent@vng.com.vn',
      tenNguoiDung: 'VNG Talent',
      matKhau: hashPassword,
      sdt: '0923333333',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const tkHR_Shopee = await prisma.taiKhoan.create({
    data: {
      email: 'hr@shopee.vn',
      tenNguoiDung: 'Shopee Careers',
      matKhau: hashPassword,
      sdt: '0934444444',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const tkHR_Momo = await prisma.taiKhoan.create({
    data: {
      email: 'tuyendung@momo.vn',
      tenNguoiDung: 'MoMo HR',
      matKhau: hashPassword,
      sdt: '0945555555',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });

  // Tài khoản Ứng viên
  const tkUV_Tuan = await prisma.taiKhoan.create({
    data: {
      email: '  ',
      tenNguoiDung: 'Nguyễn Anh Tuấn',
      matKhau: hashPassword,
      sdt: '0981112223',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });
  const tkUV_Mai = await prisma.taiKhoan.create({
    data: {
      email: 'mai.tran@gmail.com',
      tenNguoiDung: 'Trần Thị Phương Mai',
      matKhau: hashPassword,
      sdt: '0982223334',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });
  const tkUV_Hoang = await prisma.taiKhoan.create({
    data: {
      email: 'hoang.le@gmail.com',
      tenNguoiDung: 'Lê Minh Hoàng',
      matKhau: hashPassword,
      sdt: '0983334445',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  // =========================================================
  // 3. TẠO CÔNG TY & NHÀ TUYỂN DỤNG
  // =========================================================
  console.log('🏢 Đang tạo Công ty và kết nối hồ sơ HR...');

  // --- 1. FPT SOFTWARE ---
  const ctyFPT = await prisma.congTy.create({
    data: {
      tenCongTy: 'FPT Software',
      tenPhapLy: 'Công ty TNHH Phần mềm FPT',
      slug: 'fpt-software',
      moTa: '<p>FPT Software là công ty công nghệ lớn nhất Việt Nam với hơn 30.000 nhân viên trên toàn cầu. Chúng tôi tiên phong trong lĩnh vực chuyển đổi số, cung cấp các dịch vụ IT chất lượng cao cho hàng trăm khách hàng Fortune 500.</p>',
      phucLoi:
        '<ul><li>Lương tháng 13 và thưởng hiệu quả công việc cuối năm hấp dẫn.</li><li>Gói bảo hiểm sức khỏe FPT Care độc quyền dành cho nhân viên và người thân.</li><li>Cơ hội làm việc Onsite ngắn hạn và dài hạn tại Nhật Bản, Mỹ, và Châu Âu.</li><li>Hệ sinh thái Campus chuẩn quốc tế: phòng Gym, bể bơi, khu thể thao ngoài trời.</li></ul>',
      chuyenMon:
        '<ul><li><strong>Công nghệ:</strong> Java, .NET, Python, C++, Automotive.</li><li><strong>Giải pháp:</strong> Cloud Computing, AI/ML, Data Analytics, RPA.</li></ul>',
      aboutMe:
        '<p>Tại FPT Software, chúng tôi tin rằng "Con người là tài sản quý giá nhất". Môi trường làm việc trẻ trung, năng động, nơi mọi ý tưởng đột phá đều được tôn trọng và tạo điều kiện phát triển tối đa.</p>',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
      website: 'https://fptsoftware.com',
      thanhPho: 'Hà Nội',
      diaChi: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
      moHinhCongTy: 'Outsource / Dịch vụ IT',
      linhVuc: 'Công nghệ thông tin / Phần mềm',
      quyMo: '10,000+ nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (08:30 - 17:30)',
      chinhSachOT:
        'Thanh toán OT theo đúng quy định Luật Lao động (150%, 200%, 300%)',
      giaiThuong:
        'Top 100 Nơi làm việc tốt nhất Việt Nam, Giải thưởng Sao Khuê',
    },
  });
  const hrFPT = await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyFPT.maCongTy, maTaiKhoan: tkHR_FPT.maTaiKhoan },
  });

  // --- 2. VNG CORPORATION ---
  const ctyVNG = await prisma.congTy.create({
    data: {
      tenCongTy: 'VNG Corporation',
      tenPhapLy: 'Công ty Cổ phần VNG',
      slug: 'vng-corporation',
      moTa: '<p>Thành lập từ 2004, VNG là Kỳ lân công nghệ đầu tiên của Việt Nam. Chúng tôi xây dựng hệ sinh thái dịch vụ trực tuyến phục vụ hàng chục triệu người dùng.</p>',
      phucLoi:
        '<ul><li>Package thu nhập lên tới 15-18 tháng lương/năm.</li><li>VNG Campus chuẩn quốc tế với đầy đủ tiện ích: Canteen, Gym, khu giải trí.</li><li>Bảo hiểm sức khỏe Premium và khám sức khỏe định kỳ hàng năm.</li><li>Hỗ trợ kinh phí đào tạo và thi các chứng chỉ quốc tế chuyên sâu.</li></ul>',
      chuyenMon:
        '<ul><li><strong>Sản phẩm:</strong> Zalo, ZaloPay, VNGGames.</li><li><strong>Hạ tầng:</strong> VNG Cloud, Data Center chuẩn Tier III.</li></ul>',
      aboutMe:
        '<p>Với sứ mệnh "Kiến tạo công nghệ và Phát triển con người", VNG tạo ra một môi trường làm việc cởi mở, không khoảng cách, thúc đẩy sự sáng tạo không giới hạn.</p>',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325179/vng_st3yi1.jpg',
      website: 'https://vng.com.vn',
      thanhPho: 'TP.HCM',
      diaChi: 'VNG Campus, Z06 Đường số 13, Quận 7, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Internet & Giải trí điện tử',
      quyMo: '1,000 - 5,000 nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (09:00 - 18:30)',
      chinhSachOT: 'Không khuyến khích OT, áp dụng chế độ nghỉ bù linh hoạt.',
      giaiThuong: 'Nhà xuất bản Game hàng đầu Đông Nam Á',
    },
  });
  const hrVNG = await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyVNG.maCongTy, maTaiKhoan: tkHR_VNG.maTaiKhoan },
  });

  // --- 3. SHOPEE VIETNAM ---
  const ctyShopee = await prisma.congTy.create({
    data: {
      tenCongTy: 'Shopee Vietnam',
      tenPhapLy: 'Công ty TNHH Shopee',
      slug: 'shopee-vietnam',
      moTa: '<p>Shopee là nền tảng thương mại điện tử hàng đầu tại Đông Nam Á và Đài Loan, cung cấp trải nghiệm mua sắm trực tuyến dễ dàng và an toàn.</p>',
      phucLoi:
        '<ul><li>Cấp MacBook Pro ngay ngày đầu nhận việc.</li><li>Miễn phí trà, cafe, trái cây và đồ ăn nhẹ tại văn phòng hàng ngày.</li><li>Tham gia các sự kiện gắn kết nội bộ và du lịch công ty thường niên (Company Trip).</li><li>Môi trường đa quốc gia, làm việc trực tiếp với các chuyên gia từ Singapore.</li></ul>',
      chuyenMon:
        '<ul><li>Thương mại điện tử (E-commerce), Supply Chain.</li><li>Hệ thống chịu tải cao, Real-time Data Processing.</li></ul>',
      aboutMe:
        '<p>Chúng tôi tập trung vào việc trao quyền cho nhân viên để tạo ra tác động lớn cho cộng đồng thông qua công nghệ và đổi mới sáng tạo.</p>',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1777681291/shopee-vn_hwihqn.jpg',
      website: 'https://careers.shopee.vn',
      thanhPho: 'TP.HCM',
      diaChi: 'Saigon Centre, 65 Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Thương mại điện tử',
      quyMo: '1,000 - 5,000 nhân viên',
      quocGia: 'Singapore',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (09:00 - 18:00)',
      chinhSachOT: 'Thanh toán lương ngoài giờ theo quy định.',
      giaiThuong: 'Top 1 Nền tảng Thương mại điện tử phổ biến nhất Việt Nam',
    },
  });
  await prisma.nhaTuyenDung.create({
    data: { maCongTy: ctyShopee.maCongTy, maTaiKhoan: tkHR_Shopee.maTaiKhoan },
  });

  // --- 4. MOMO (FINTECH) ---
  const ctyMomo = await prisma.congTy.create({
    data: {
      tenCongTy: 'MoMo',
      tenPhapLy: 'Công ty Cổ phần Dịch vụ Di động Trực tuyến (M_Service)',
      slug: 'momo-vietnam',
      moTa: '<p>MoMo là siêu ứng dụng thanh toán số 1 Việt Nam, giúp người dùng thực hiện mọi giao dịch tài chính chỉ trên một nền tảng duy nhất.</p>',
      phucLoi:
        '<ul><li>Thưởng Performance định kỳ theo dự án và năng lực cá nhân.</li><li>Chế độ làm việc Hybrid (Linh hoạt làm việc tại nhà và văn phòng).</li><li>Trợ cấp thiết bị làm việc hiện đại cho toàn bộ nhân viên khối Tech.</li><li>Gói chăm sóc sức khỏe toàn diện định kỳ tại các bệnh viện quốc tế.</li></ul>',
      chuyenMon:
        '<ul><li>Payment Gateway, QR Payment, Digital Wallet.</li><li>Blockchain, AWS Cloud, High Performance Microservices.</li></ul>',
      aboutMe:
        '<p>Tại MoMo, chúng tôi xây dựng tương lai của tài chính số. Chúng tôi chào đón những cá nhân dám nghĩ, dám làm và có niềm đam mê mãnh liệt với sản phẩm.</p>',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png',
      website: 'https://momo.vn',
      thanhPho: 'TP.HCM',
      diaChi: 'Tòa nhà Phú Mỹ Hưng, Hoàng Văn Thái, Quận 7, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'FinTech / Tài chính số',
      quyMo: '1,000 - 5,000 nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6',
      chinhSachOT: 'Chế độ đãi ngộ OT cạnh tranh và nghỉ bù xứng đáng.',
      giaiThuong: 'Siêu ứng dụng thanh toán hàng đầu Việt Nam',
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
  // 5. TẠO HỒ SƠ ỨNG VIÊN (HYBRID CV - NESTED WRITES)
  // =========================================================
  console.log('🧑‍💻 Đang tạo Hồ sơ Ứng viên (Profile Động + File Đính kèm)...');

  // --- ỨNG VIÊN 1: SENIOR BACKEND ---
  const uvTuan = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUV_Tuan.maTaiKhoan,
      tenUngVien: 'Nguyễn Anh Tuấn',
      ngaySinh: new Date('1996-08-12'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 5,
      chuyenMon: 'Senior Backend Developer (Node.js/AWS)',
      diaChi: 'Cầu Giấy, Hà Nội',
      trangThaiPortfolio: 'Public',
      cvUrl: '/uploads/cv/tuan_nguyen_backend_cv.pdf',
      loaiCvMacDinh: 'ONLINE', // Ưu tiên dùng Profile động
      gioiThieuBanThan:
        '<p>Với hơn 5 năm kinh nghiệm làm việc trong các hệ thống <strong>High-Traffic</strong> và kiến trúc <strong>Microservices</strong>. Điểm mạnh của tôi là khả năng tối ưu hóa hiệu năng và thiết lập CI/CD.</p>',

      // 1. Ghi lồng File CV
      danhSachFileCv: {
        create: [
          {
            tenFile: 'Tuan_Nguyen_Backend_2026.pdf',
            fileUrl: '/uploads/cv/tuan_nguyen_backend_cv.pdf',
          },
        ],
      },
      // 2. Ghi lồng Kinh Nghiệm
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'XYZ Tech Company',
            viTri: 'Tech Lead',
            ngayBatDau: new Date('2022-06-01'),
            ngayKetThuc: null, // null = Đến nay
            moTaChiTiet:
              '<ul><li>Dẫn dắt team 5 người xây dựng Payment Gateway xử lý 10.000 TPS.</li><li>Thiết kế hệ thống Microservices với NestJS và Kafka.</li></ul>',
          },
          {
            tenCongTy: 'ABC Corp',
            viTri: 'Backend Developer',
            ngayBatDau: new Date('2018-09-01'),
            ngayKetThuc: new Date('2022-05-31'),
            moTaChiTiet:
              '<ul><li>Phát triển và bảo trì hệ thống ERP nội bộ.</li><li>Chuyển đổi thành công kiến trúc Monolith sang Microservices.</li></ul>',
          },
        ],
      },
      // 3. Ghi lồng Học Vấn
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học Bách Khoa Hà Nội',
            nganhHoc: 'Kỹ thuật Phần mềm',
            ngayBatDau: new Date('2014-09-01'),
            ngayTotNghiep: new Date('2018-06-01'),
            gpa: '3.4/4.0',
          },
        ],
      },
      // 4. Ghi lồng Chứng Chỉ
      chungChis: {
        create: [
          {
            tenChungChi: 'AWS Certified Solutions Architect',
            toChucCap: 'Amazon Web Services',
            ngayCap: new Date('2023-05-15'),
            ngayHetHan: new Date('2026-05-15'),
          },
        ],
      },
      // 5. Ghi lồng Ngoại Ngữ
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'TOEIC 850' }],
      },
    },
  });

  // --- ỨNG VIÊN 2: UI/UX & FRONTEND ---
  const uvMai = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUV_Mai.maTaiKhoan,
      tenUngVien: 'Trần Thị Phương Mai',
      ngaySinh: new Date('1999-03-25'),
      gioiTinh: 'Nữ',
      soNamKinhNghiem: 2,
      chuyenMon: 'UI/UX Designer & Frontend React',
      diaChi: 'Quận 1, TP.HCM',
      trangThaiPortfolio: 'Public',
      cvUrl: '/uploads/cv/mai_tran_design_cv.pdf',
      loaiCvMacDinh: 'PDF', // Ứng viên này thích dùng File PDF gốc hơn
      gioiThieuBanThan:
        '<p>Là một người đam mê cái đẹp và tư duy hướng người dùng (User-centric). Tôi có khả năng kết nối hoàn hảo giữa bản vẽ Figma và code ReactJS thực tế.</p>',

      danhSachFileCv: {
        create: [
          {
            tenFile: 'MaiTran_UIUX_Portfolio.pdf',
            fileUrl: '/uploads/cv/mai_tran_design_cv.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'Creative Agency',
            viTri: 'UI/UX Designer',
            ngayBatDau: new Date('2023-01-01'),
            ngayKetThuc: null,
            moTaChiTiet:
              '<ul><li>Thiết kế Design System cho 3 dự án E-commerce lớn.</li><li>Phối hợp cùng team Dev để đảm bảo Pixel-perfect.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học RMIT Việt Nam',
            nganhHoc: 'Cử nhân Thiết kế (Truyền thông số)',
            ngayBatDau: new Date('2018-09-01'),
            ngayTotNghiep: new Date('2022-06-01'),
            gpa: 'High Distinction',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'Google UX Design Professional',
            toChucCap: 'Coursera',
            ngayCap: new Date('2023-02-10'),
            ngayHetHan: null,
          }, // Chứng chỉ không hết hạn
        ],
      },
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'IELTS 7.5' }],
      },
    },
  });

  // --- ỨNG VIÊN 3: DEVOPS / CLOUD ---
  const uvHoang = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUV_Hoang.maTaiKhoan,
      tenUngVien: 'Lê Minh Hoàng',
      ngaySinh: new Date('1995-11-05'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 7,
      chuyenMon: 'Cloud & DevOps Engineer',
      diaChi: 'Hải Châu, Đà Nẵng',
      trangThaiPortfolio: 'Public',
      cvUrl: '/uploads/cv/hoang_le_devops_cv.pdf',
      loaiCvMacDinh: 'ONLINE',
      gioiThieuBanThan:
        '<p>Chuyên gia tự động hóa luồng triển khai phần mềm (CI/CD) và quản trị hạ tầng Cloud. Mục tiêu của tôi là "Make deployment boring".</p>',

      danhSachFileCv: {
        create: [
          {
            tenFile: 'HoangLe_DevOps_CV.pdf',
            fileUrl: '/uploads/cv/hoang_le_devops_cv.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'Global Tech',
            viTri: 'Senior Cloud Engineer',
            ngayBatDau: new Date('2020-03-01'),
            ngayKetThuc: null,
            moTaChiTiet:
              '<ul><li>Quản trị cụm Kubernetes với hơn 200 nodes trên AWS EKS.</li></ul>',
          },
          {
            tenCongTy: 'Local ISP',
            viTri: 'System Admin',
            ngayBatDau: new Date('2017-08-01'),
            ngayKetThuc: new Date('2020-02-28'),
            moTaChiTiet:
              '<ul><li>Vận hành hệ thống máy chủ Linux vật lý.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học FPT',
            nganhHoc: 'An toàn Thông tin',
            ngayBatDau: new Date('2013-09-01'),
            ngayTotNghiep: new Date('2017-08-01'),
            gpa: '3.0/4.0',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'CKA: Certified Kubernetes Administrator',
            toChucCap: 'CNCF',
            ngayCap: new Date('2024-01-10'),
            ngayHetHan: new Date('2027-01-10'),
          },
        ],
      },
    },
  });
  // =========================================================
  // 5.1 GẮN KỸ NĂNG CHO ỨNG VIÊN (Phần quan trọng của Hybrid CV)
  // =========================================================
  console.log('⚡ Đang cập nhật Kỹ năng chuyên môn cho Ứng viên...');
  await prisma.ungVienKyNang.createMany({
    data: [
      // Kỹ năng của Tuấn
      {
        maUngVien: uvTuan.maUngVien,
        maKyNang: knNode.maKyNang,
        mucDo: 'Chuyên gia',
      },
      { maUngVien: uvTuan.maUngVien, maKyNang: knSQL.maKyNang, mucDo: 'Giỏi' },
      { maUngVien: uvTuan.maUngVien, maKyNang: knTS.maKyNang, mucDo: 'Giỏi' },
      { maUngVien: uvTuan.maUngVien, maKyNang: knAWS.maKyNang, mucDo: 'Khá' },

      // Kỹ năng của Mai
      {
        maUngVien: uvMai.maUngVien,
        maKyNang: knFigma.maKyNang,
        mucDo: 'Chuyên gia',
      },
      { maUngVien: uvMai.maUngVien, maKyNang: knReact.maKyNang, mucDo: 'Giỏi' },

      // Kỹ năng của Hoàng
      {
        maUngVien: uvHoang.maUngVien,
        maKyNang: knAWS.maKyNang,
        mucDo: 'Chuyên gia',
      },
      {
        maUngVien: uvHoang.maUngVien,
        maKyNang: knDocker.maKyNang,
        mucDo: 'Chuyên gia',
      },
      { maUngVien: uvHoang.maUngVien, maKyNang: knK8s.maKyNang, mucDo: 'Giỏi' },
      {
        maUngVien: uvHoang.maUngVien,
        maKyNang: knPython.maKyNang,
        mucDo: 'Khá',
      },
    ],
  });

  // =========================================================
  // 5.2 TẠO PORTFOLIO / DỰ ÁN CÁ NHÂN
  // =========================================================
  console.log('📂 Đang bơm dữ liệu Portfolio (Dự án thực tế)...');

  await prisma.portfolio.createMany({
    data: [
      {
        maUngVien: uvTuan.maUngVien,
        tieuDe: 'Hệ thống Thanh toán V-Pay (Đồ án tốt nghiệp)',
        moTa: '<p>Xây dựng hệ thống cổng thanh toán mô phỏng với <strong>NestJS, Redis và SQL Server</strong>. Áp dụng RabbitMQ để xử lý hàng đợi giao dịch.</p>',
        projectUrl: 'https://github.com/tuan-nguyen/v-pay',
      },
      {
        maUngVien: uvMai.maUngVien,
        tieuDe: 'Redesign App Ngân hàng số Timo',
        moTa: '<p>Dự án cá nhân: Phân tích lại luồng UX và Redesign toàn bộ UI cho ứng dụng Timo. Sử dụng <strong>Figma</strong> để thiết kế Design System và Prototype.</p>',
        projectUrl: 'https://behance.net/maitran/timo-redesign',
      },
      {
        maUngVien: uvHoang.maUngVien,
        tieuDe: 'Tự động hóa CI/CD cho E-commerce Platform',
        moTa: '<p>Thiết lập luồng CI/CD hoàn chỉnh sử dụng GitHub Actions, build Docker Image và deploy tự động lên cụm Kubernetes (EKS) trên AWS.</p>',
        projectUrl: 'https://hoangle.dev/projects/k8s-ecommerce',
      },
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

      moTa: '<ul><li>Trực tiếp tham gia phân tích yêu cầu, thiết kế kiến trúc và viết code cho hệ thống Core Banking của đối tác chiến lược tại Mỹ.</li><li>Tối ưu hóa hiệu năng hệ thống (performance tuning), đảm bảo khả năng xử lý hàng triệu giao dịch mỗi ngày (High Availability, Scalability).</li><li>Phối hợp chặt chẽ với team BA, QA và khách hàng để giải quyết các technical bugs phức tạp.</li><li>Thực hiện Code Review và hướng dẫn/mentor cho các bạn Junior/Fresher trong team.</li></ul>',
      yeuCauCongViec:
        '<ul><li>Có tối thiểu 4 năm kinh nghiệm làm việc thực tế với Java (Java 8+ trở lên).</li><li>Nắm vững hệ sinh thái Spring (Spring Boot, Spring MVC, Spring Data JPA, Spring Security).</li><li>Có kinh nghiệm làm việc với kiến trúc Microservices và thiết kế RESTful APIs.</li><li>Thành thạo các hệ quản trị CSDL quan hệ (PostgreSQL/Oracle) và NoSQL (MongoDB/Redis).</li><li>Nắm vững các công cụ CI/CD, Git, Docker, Kubernetes.</li><li>Tiếng Anh giao tiếp và đọc hiểu tài liệu chuyên ngành tốt (Tương đương TOEIC 650+).</li></ul>',
      phucLoi:
        '<ul><li>Lương cơ bản lên đến $2500 + Thưởng hiệu suất dự án hàng quý.</li><li>Được tài trợ 100% lệ phí thi các chứng chỉ quốc tế (AWS, Oracle, PMP).</li><li>Cung cấp thiết bị làm việc hiện đại (Macbook, Màn hình phụ 27 inch).</li><li>Tham gia các lớp đào tạo tiếng Nhật/Tiếng Anh miễn phí tại công ty.</li></ul>',

      mucLuongToiThieu: 30000000,
      mucLuongToiDa: 60000000,
      yeuCauKinhNghiem: 4,
      capBac: 'Senior',

      thanhPho: 'Hà Nội',
      loaiHinh: 'Full-time',
      hinhThucLamViec: 'Hybrid', // Làm việc kết hợp

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

      moTa: '<ul><li>Phát triển và bảo trì các dịch vụ Backend/APIs cho nền tảng thanh toán ZaloPay, phục vụ hàng chục triệu người dùng.</li><li>Tham gia vào quá trình System Design, giải quyết các bài toán về Concurrency, Data Consistency trong xử lý giao dịch tài chính.</li><li>Giám sát hệ thống (Monitoring), phát hiện và xử lý sự cố (Troubleshooting) kịp thời để đảm bảo SLA 99.99%.</li><li>Viết Unit Test và Integration Test để đảm bảo chất lượng code đầu ra.</li></ul>',
      yeuCauCongViec:
        '<ul><li>Từ 2-3 năm kinh nghiệm phát triển Backend với Node.js (Express, NestJS).</li><li>Hiểu biết sâu sắc về JavaScript/TypeScript, Event Loop và Async/Await trong Node.js.</li><li>Có kinh nghiệm làm việc với Message Queue (Kafka, RabbitMQ) và hệ thống Cache (Redis).</li><li>Tư duy logic tốt, am hiểu về Data Structures & Algorithms.</li><li>Có kinh nghiệm trong lĩnh vực FinTech, Payment Gateway là một điểm cộng lớn.</li></ul>',
      phucLoi:
        '<ul><li>Package thu nhập lên tới 15 tháng lương/năm.</li><li>Cấp Macbook Pro M3 max option ngay ngày đầu tiên nhận việc.</li><li>Tham gia CLB thể thao của công ty (Bóng đá, Cầu lông, Yoga) với phí tài trợ 100%.</li><li>Môi trường làm việc cởi mở, không áp đặt dresscode.</li></ul>',

      mucLuongToiThieu: 25000000,
      mucLuongToiDa: 45000000,
      yeuCauKinhNghiem: 2,
      capBac: 'Middle',

      thanhPho: 'TP.HCM',
      loaiHinh: 'Full-time',
      hinhThucLamViec: 'Tại văn phòng',

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

      moTa: '<ul><li>Tham gia dự án phát triển hệ thống ERP nội bộ cho khách hàng quốc tế.</li><li>Viết code linh hoạt cho cả phía Frontend (React) và Backend (NodeJS).</li><li>Chủ động báo cáo tiến độ công việc qua Jira và tham gia các buổi họp Daily Scrum hàng ngày.</li></ul>',
      yeuCauCongViec:
        '<ul><li>3 năm kinh nghiệm lập trình Fullstack.</li><li>Kỹ năng tự quản lý thời gian tốt vì tính chất công việc làm từ xa.</li><li>Thành thạo Gitflow và quy trình CI/CD cơ bản.</li></ul>',
      phucLoi:
        '<ul><li>Trợ cấp set-up góc làm việc tại nhà (Màn hình, bàn ghế công thái học).</li><li>Thời gian làm việc hoàn toàn chủ động theo múi giờ cá nhân.</li></ul>',

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

  await prisma.donXinViec.createMany({
    data: [
      {
        maCongViec: job3.maCongViec,
        maUngVien: uvMai.maUngVien,
        trangThai: 'CHO_DUYET',
        ngayNop: new Date(),
        fileCvUrl: '/uploads/cv/mai_tran_cv.pdf',
        chiTiet:
          'Chào anh/chị HR, em gửi CV ứng tuyển vị trí Fullstack ReactJS/NodeJS ạ.',
      },
      {
        maCongViec: job1.maCongViec,
        maUngVien: uvHoang.maUngVien,
        trangThai: 'BI_LOAI',
        ngayNop: new Date(),
        fileCvUrl: '/uploads/cv/mai_tran_cv.pdf',
        chiTiet:
          'Chào anh/chị HR, em gửi CV ứng tuyển vị trí Senior Java Backend Engineer  ạ.',
      },
    ],
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
