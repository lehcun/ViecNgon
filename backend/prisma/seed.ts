import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface AiMatchJsonPayload {
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  breakdown: {
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    domainScore: number;
  };
}

function buildAiAnalysisJson(payload: AiMatchJsonPayload): string {
  return JSON.stringify(payload);
}

async function main(): Promise<void> {
  // =====================================================================
  // PHẦN 1: CLEAN UP (Xóa sạch theo thứ tự bảng con -> bảng cha)
  // =====================================================================
  console.log('🧹 Đang dọn dẹp dữ liệu cũ...');

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
  await prisma.fileCv.deleteMany();
  await prisma.kinhNghiem.deleteMany();
  await prisma.hocVan.deleteMany();
  await prisma.chungChi.deleteMany();
  await prisma.ngoaiNgu.deleteMany();
  await prisma.ungVien.deleteMany();
  await prisma.chiNhanh.deleteMany();
  await prisma.congTy.deleteMany();
  await prisma.taiKhoan.deleteMany();

  console.log('✅ Dọn dẹp cơ sở dữ liệu hoàn tất.');

  // =====================================================================
  // PHẦN 2: BĂM MẬT KHẨU (Bcrypt - Dùng chung mật khẩu "123456")
  // =====================================================================
  const hashedPassword = await bcrypt.hash('123456', 10);

  // =====================================================================
  // A. TỪ ĐIỂN KỸ NĂNG (KYNANG - 29 Kỹ năng IT chuẩn thực tế)
  // =====================================================================
  console.log('⚡ Đang tạo Từ điển Kỹ năng IT...');

  const skillNames: readonly string[] = [
    // Frontend (6)
    'ReactJS',
    'Next.js',
    'Vue.js',
    'Angular',
    'TypeScript',
    'Tailwind CSS',
    // Backend (8)
    'Node.js',
    'NestJS',
    'Java',
    'Spring Boot',
    'Golang',
    'Python',
    '.NET Core',
    'PHP',
    // Database & Cloud (10)
    'PostgreSQL',
    'MySQL',
    'SQL Server',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'CI/CD',
    // Khác (5)
    'Git',
    'Agile/Scrum',
    'Manual Testing',
    'Automation Test',
    'UI/UX Design',
  ];

  const skillMap = new Map<string, string>();
  for (const name of skillNames) {
    const created = await prisma.kyNang.create({
      data: { tenKyNang: name },
    });
    skillMap.set(name, created.maKyNang);
  }

  const getSkillId = (name: string): string => {
    const id = skillMap.get(name);
    if (!id) {
      throw new Error(`Không tìm thấy kỹ năng trong từ điển: ${name}`);
    }
    return id;
  };

  // =====================================================================
  // B. CÔNG TY & CHI NHÁNH (CONGTY & CHINHANH)
  // =====================================================================
  console.log('🏢 Đang tạo công ty công nghệ & chi nhánh tại Việt Nam...');

  const ctyFPT = await prisma.congTy.create({
    data: {
      tenCongTy: 'FPT Software',
      tenPhapLy: 'Công ty TNHH Phần mềm FPT',
      slug: 'fpt-software',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
      website: 'https://fptsoftware.com',
      thanhPho: 'Hà Nội',
      diaChi: 'FPT Complex, Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
      moHinhCongTy: 'Outsource',
      linhVuc: 'Dịch vụ Phần mềm & Chuyển đổi số',
      quyMo: '10,000+ nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (08:30 - 17:30)',
      chinhSachOT:
        'Thanh toán 150% ngày thường, 200% cuối tuần, 300% ngày lễ theo Luật Lao động',
      giaiThuong: 'Top 100 Nơi làm việc tốt nhất Việt Nam, Sao Khuê 2025',
      moTa: '<p><strong>FPT Software</strong> là doanh nghiệp xuất khẩu phần mềm và dịch vụ CNTT hàng đầu Đông Nam Á với hơn 30.000 kỹ sư tại 30 quốc gia.</p>',
      aboutMe:
        '<p>Tại FPT Software, đội ngũ kỹ sư được tham gia trực tiếp các dự án quy mô lớn cho hơn 100 tập đoàn Fortune 500 tại Mỹ, Nhật Bản và Châu Âu trong các mảng Automotive, BFSI, Aviation và Healthcare.</p>',
      chuyenMon:
        '<ul><li><strong>Backend & Enterprise:</strong> Java Spring Boot, .NET Core, Python, Microservices.</li><li><strong>Cloud & AI:</strong> AWS, Azure, Kubernetes, Generative AI & Data Platform.</li></ul>',
      phucLoi:
        '<ul><li>Thu nhập 14 - 16 tháng lương/năm kèm thưởng dự án quý.</li><li>Bảo hiểm sức khỏe FPT Care cho bản thân và gia đình.</li><li>Tài trợ 100% lệ phí thi chứng chỉ AWS, Azure, PMP, ISTQB.</li><li>Cơ hội onsite ngắn và dài hạn tại Nhật Bản, Singapore, Hoa Kỳ.</li></ul>',
      chiNhanhs: {
        create: [
          {
            thanhPho: 'Hà Nội',
            diaChi:
              'Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch, Dịch Vọng, Cầu Giấy, Hà Nội',
            mapUrl: 'https://maps.google.com/?q=FPT+Tower+Cau+Giay+Ha+Noi',
          },
          {
            thanhPho: 'Đà Nẵng',
            diaChi:
              'FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
            mapUrl: 'https://maps.google.com/?q=FPT+Complex+Da+Nang',
          },
          {
            thanhPho: 'TP.HCM',
            diaChi:
              'Tòa nhà F-Town 3, Đường D2, Khu Công nghệ cao, TP. Thủ Đức, TP.HCM',
            mapUrl: 'https://maps.google.com/?q=F-Town+3+Thu+Duc+TPHCM',
          },
        ],
      },
    },
    include: { chiNhanhs: true },
  });

  const ctyVNG = await prisma.congTy.create({
    data: {
      tenCongTy: 'VNG Corporation',
      tenPhapLy: 'Công ty Cổ phần VNG',
      slug: 'vng-corporation',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325179/vng_st3yi1.jpg',
      website: 'https://vng.com.vn',
      thanhPho: 'TP.HCM',
      diaChi:
        'VNG Campus, Z06 Đường số 13, Khu chế xuất Tân Thuận, Quận 7, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Hệ sinh thái Internet, FinTech & Cloud',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (09:00 - 18:30)',
      chinhSachOT: 'Không khuyến khích OT, hỗ trợ nghỉ bù và phụ cấp ăn tối',
      giaiThuong: 'Kỳ lân công nghệ Việt Nam, Top 10 Doanh nghiệp CNTT uy tín',
      moTa: '<p><strong>VNG Corporation</strong> phát triển các nền tảng số phục vụ hàng chục triệu người dùng Việt Nam như Zalo, ZaloPay, VNG Cloud và VNGGames.</p>',
      aboutMe:
        '<p>VNG xây dựng văn hóa "Đón nhận Thách thức" với Campus hiện đại hàng đầu Việt Nam, nơi các kỹ sư tự chủ hoàn toàn kiến trúc hệ thống chịu tải hàng triệu kết nối đồng thời.</p>',
      chuyenMon:
        '<ul><li><strong>High Concurrency Systems:</strong> Golang, Java, Node.js, Redis Cluster, Kafka.</li><li><strong>Cloud & Data Infrastructure:</strong> Kubernetes, Bare-metal Cloud, Big Data.</li></ul>',
      phucLoi:
        '<ul><li>Gói thu nhập cạnh tranh lên tới 15 - 17 tháng lương/năm.</li><li>Cấp MacBook Pro đời mới và màn hình rời ngay ngày onboard.</li><li>VNG Campus chuẩn quốc tế: Phòng Gym, hồ bơi, sân cầu lông miễn phí.</li><li>Khám sức khỏe định kỳ và bảo hiểm PVI Care cao cấp.</li></ul>',
      chiNhanhs: {
        create: [
          {
            thanhPho: 'TP.HCM',
            diaChi:
              'VNG Campus, Lô Z06 Đường số 13, Tân Thuận Đông, Quận 7, TP.HCM',
            mapUrl: 'https://maps.google.com/?q=VNG+Campus+Quan+7+TPHCM',
          },
          {
            thanhPho: 'Hà Nội',
            diaChi:
              'Tầng 12, Tòa nhà TNR Tower, 54A Nguyễn Chí Thanh, Đống Đa, Hà Nội',
            mapUrl: 'https://maps.google.com/?q=54A+Nguyen+Chi+Thanh+Ha+Noi',
          },
        ],
      },
    },
    include: { chiNhanhs: true },
  });

  const ctyMomo = await prisma.congTy.create({
    data: {
      tenCongTy: 'MoMo',
      tenPhapLy: 'Công ty Cổ phần Dịch vụ Di động Trực tuyến (M_Service)',
      slug: 'momo-m-service',
      logoUrl:
        'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png',
      website: 'https://momo.vn',
      thanhPho: 'TP.HCM',
      diaChi:
        'Tòa nhà Phú Mỹ Hưng, Số 8 Hoàng Văn Thái, Tân Phú, Quận 7, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'FinTech / Siêu ứng dụng Tài chính',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (Linh hoạt 08:30 - 18:00)',
      chinhSachOT: 'Nghỉ bù linh hoạt 1:1 và phụ cấp trực hệ thống Payment',
      giaiThuong: 'Siêu ứng dụng thanh toán số 1 Việt Nam, Top 10 FinTech APAC',
      moTa: '<p><strong>MoMo</strong> là siêu ứng dụng tài chính phục vụ hơn 31 triệu người dùng với hệ sinh thái thanh toán, đầu tư, bảo hiểm và Mini App hàng đầu Việt Nam.</p>',
      aboutMe:
        '<p>Đội ngũ Engineering tại MoMo vận hành hàng trăm Microservices xử lý hàng nghìn giao dịch/giây với tiêu chuẩn an toàn bảo mật cấp độ ngân hàng (PCI-DSS).</p>',
      chuyenMon:
        '<ul><li><strong>Super App Frontend:</strong> ReactJS, Next.js, TypeScript, React Native Mini App.</li><li><strong>FinTech Core Backend:</strong> Java Spring Boot, Golang, NestJS, Redis, PostgreSQL.</li></ul>',
      phucLoi:
        '<ul><li>Thưởng Tết & Performance Bonus từ 2 - 4 tháng lương.</li><li>Làm việc Hybrid linh hoạt 2 ngày Work From Home mỗi tuần.</li><li>Bảo hiểm sức khỏe cao cấp cho nhân viên và người thân.</li><li>Ngân sách đào tạo & tham gia hội thảo công nghệ hàng năm.</li></ul>',
      chiNhanhs: {
        create: [
          {
            thanhPho: 'TP.HCM',
            diaChi:
              'Tòa nhà Phú Mỹ Hưng, Số 8 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP.HCM',
            mapUrl: 'https://maps.google.com/?q=Phu+My+Hung+Tower+Quan+7',
          },
          {
            thanhPho: 'Hà Nội',
            diaChi:
              'Tầng 8, Tòa nhà Lotte Center, 54 Liễu Giai, Ba Đình, Hà Nội',
            mapUrl: 'https://maps.google.com/?q=Lotte+Center+Lieu+Giai+Ha+Noi',
          },
        ],
      },
    },
    include: { chiNhanhs: true },
  });

  const ctyShopee = await prisma.congTy.create({
    data: {
      tenCongTy: 'Shopee Vietnam',
      tenPhapLy: 'Công ty TNHH Shopee Việt Nam',
      slug: 'shopee-vietnam',
      logoUrl:
        'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1777681291/shopee-vn_hwihqn.jpg',
      website: 'https://careers.shopee.vn',
      thanhPho: 'TP.HCM',
      diaChi: 'Saigon Centre Tower 2, 67 Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Thương mại điện tử (E-Commerce)',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Singapore',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (09:00 - 18:00)',
      chinhSachOT:
        'Thanh toán lương OT theo quy định hoặc nghỉ bù chiến dịch Mega Sale',
      giaiThuong: 'Nền tảng Thương mại điện tử được yêu thích nhất Việt Nam',
      moTa: '<p><strong>Shopee Vietnam</strong> thuộc tập đoàn Sea, là nền tảng thương mại điện tử hàng đầu Đông Nam Á với lưu lượng truy cập bùng nổ vào các ngày Mega Campaign.</p>',
      aboutMe:
        '<p>Kỹ sư tại Shopee làm việc trực tiếp cùng đội ngũ Engineering khu vực Singapore & Việt Nam để xây dựng hạ tầng Flash Sale, Logistics và Search Engine thời gian thực.</p>',
      chuyenMon:
        '<ul><li><strong>E-Commerce Scale:</strong> Golang, Python, ReactJS, TypeScript, MySQL, Redis.</li><li><strong>QA & Reliability:</strong> Automation Testing, CI/CD, Performance Testing.</li></ul>',
      phucLoi:
        '<ul><li>Cấp MacBook Pro và gói trợ cấp làm việc tại nhà.</li><li>15 ngày phép năm + 1 ngày nghỉ sinh nhật có lương.</li><li>Pantry miễn phí đồ ăn vặt, cà phê và Happy Hour hàng tuần.</li><li>Bảo hiểm sức khỏe toàn diện + khám sức khỏe tổng quát định kỳ.</li></ul>',
      chiNhanhs: {
        create: [
          {
            thanhPho: 'TP.HCM',
            diaChi:
              'Tầng 17, Saigon Centre Tower 2, 67 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
            mapUrl: 'https://maps.google.com/?q=Saigon+Centre+67+Le+Loi+TPHCM',
          },
          {
            thanhPho: 'Hà Nội',
            diaChi:
              'Tòa nhà Capital Place, 29 Liễu Giai, Ngọc Khánh, Ba Đình, Hà Nội',
            mapUrl: 'https://maps.google.com/?q=Capital+Place+29+Lieu+Giai',
          },
        ],
      },
    },
    include: { chiNhanhs: true },
  });

  const ctyNAB = await prisma.congTy.create({
    data: {
      tenCongTy: 'NAB Innovation Centre',
      tenPhapLy: 'Công ty TNHH NAB Innovation Centre Vietnam',
      slug: 'nab-innovation-centre',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/National_Australia_Bank_logo.svg/512px-National_Australia_Bank_logo.svg.png',
      website: 'https://nab.com.au',
      thanhPho: 'TP.HCM',
      diaChi: 'Etown Central, 11 Đoàn Văn Bơ, Phường 13, Quận 4, TP.HCM',
      moHinhCongTy: 'Product',
      linhVuc: 'Ngân hàng số & FinTech (Digital Banking)',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Úc (Australia)',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (Hybrid chuẩn quốc tế)',
      chinhSachOT: 'Văn hóa tôn trọng Work-Life Balance, hầu như không OT',
      giaiThuong:
        'Top 5 Công ty IT tốt nhất Việt Nam (ITviec Best IT Companies)',
      moTa: '<p><strong>NAB Innovation Centre Vietnam</strong> là trung tâm công nghệ chiến lược trực thuộc Ngân hàng Quốc gia Úc (NAB), xây dựng nền tảng Digital Banking hiện đại phục vụ hàng triệu khách hàng tại Úc.</p>',
      aboutMe:
        '<p>Chúng tôi áp dụng 100% quy trình Agile/Scrum, Engineering Excellence và kiến trúc Cloud-Native trên AWS với môi trường giao tiếp tiếng Anh chuyên nghiệp.</p>',
      chuyenMon:
        '<ul><li><strong>Microfrontend & API:</strong> ReactJS, TypeScript, Node.js, Java Spring Boot.</li><li><strong>Cloud & DevSecOps:</strong> AWS, Kubernetes, Terraform, CI/CD Jenkins/GitHub Actions.</li></ul>',
      phucLoi:
        '<ul><li>Lương Gross thuộc top đầu thị trường + thưởng hiệu suất cuối năm.</li><li>Làm việc Hybrid linh hoạt, 20 ngày phép năm.</li><li>Chương trình đào tạo NAB Cloud Guild tài trợ 100% chứng chỉ AWS.</li><li>Môi trường tiếng Anh 100%, cơ hội công tác Melbourne / Sydney.</li></ul>',
      chiNhanhs: {
        create: [
          {
            thanhPho: 'TP.HCM',
            diaChi:
              'Tòa nhà Etown Central, 11 Đoàn Văn Bơ, Phường 13, Quận 4, TP.HCM',
            mapUrl: 'https://maps.google.com/?q=Etown+Central+Quan+4+TPHCM',
          },
          {
            thanhPho: 'Hà Nội',
            diaChi:
              'Tòa nhà Leadvisors Place, 41A Lý Thái Tổ, Hoàn Kiếm, Hà Nội',
            mapUrl: 'https://maps.google.com/?q=41A+Ly+Thai+To+Ha+Noi',
          },
        ],
      },
    },
    include: { chiNhanhs: true },
  });

  const ctyViettel = await prisma.congTy.create({
    data: {
      tenCongTy: 'Viettel Solutions',
      tenPhapLy: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel',
      slug: 'viettel-solutions',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Viettel_logo_2021.svg/512px-Viettel_logo_2021.svg.png',
      website: 'https://solutions.viettel.vn',
      thanhPho: 'Hà Nội',
      diaChi: 'Số 1 Trần Hữu Dực, Mỹ Đình 2, Nam Từ Liêm, Hà Nội',
      moHinhCongTy: 'Product',
      linhVuc: 'Hạ tầng Số, Smart City, Cloud & Cybersecurity',
      quyMo: '1000-5000 nhân viên',
      quocGia: 'Việt Nam',
      thoiGianLamViec: 'Thứ 2 - Thứ 6 (08:00 - 17:30)',
      chinhSachOT:
        'Theo quy định tập đoàn và phụ cấp triển khai dự án trọng điểm',
      giaiThuong: 'Doanh nghiệp Chuyển đổi số xuất sắc Quốc gia',
      moTa: '<p><strong>Viettel Solutions</strong> là đơn vị tiên phong kiến tạo Chính phủ số, Thành phố thông minh, Y tế số và nền tảng Viettel Cloud Make-in-Vietnam.</p>',
      aboutMe:
        '<p>Các kỹ sư tại Viettel Solutions trực tiếp phát triển các hệ thống quy mô quốc gia với yêu cầu cực cao về bảo mật, tính sẵn sàng và làm chủ công nghệ lõi.</p>',
      chuyenMon:
        '<ul><li><strong>Core Platform:</strong> Java, .NET Core, Angular, PostgreSQL, SQL Server.</li><li><strong>Cloud & DevOps:</strong> OpenStack, Kubernetes, Docker, CI/CD GitLab.</li></ul>',
      phucLoi:
        '<ul><li>Thu nhập hấp dẫn kèm phụ cấp ăn trưa, điện thoại và thưởng các dịp lễ lớn.</li><li>Gói bảo hiểm sức khỏe Viettel và chế độ nghỉ dưỡng hàng năm.</li><li>Cơ hội tiếp cận các bài toán dữ liệu lớn và hạ tầng quốc gia.</li></ul>',
      chiNhanhs: {
        create: [
          {
            thanhPho: 'Hà Nội',
            diaChi:
              'Trụ sở Tập đoàn Viettel, Lô D26 Khu đô thị mới Cầu Giấy, Nam Từ Liêm, Hà Nội',
            mapUrl: 'https://maps.google.com/?q=Viettel+Group+Ha+Noi',
          },
          {
            thanhPho: 'Đà Nẵng',
            diaChi:
              'Tòa nhà Viettel Đà Nẵng, Số 286 Cách Mạng Tháng Tám, Cẩm Lệ, Đà Nẵng',
            mapUrl: 'https://maps.google.com/?q=Viettel+Da+Nang',
          },
        ],
      },
    },
    include: { chiNhanhs: true },
  });

  // =====================================================================
  // C. TÀI KHOẢN & NHÀ TUYỂN DỤNG (TAIKHOAN & NHATUYENDUNG)
  // =====================================================================
  console.log('👤 Đang tạo Tài khoản Admin, Nhà tuyển dụng & Ứng viên...');

  const tkAdmin = await prisma.taiKhoan.create({
    data: {
      email: 'admin@viecngon.vn',
      tenNguoiDung: 'Quản Trị Viên ViecNgon',
      matKhau: hashedPassword,
      sdt: '0901000001',
      vaiTro: 'ADMIN',
      trangThai: 'Active',
    },
  });

  // HR cá nhân test gắn với MoMo: lehcuong2907@gmail.com ("Lê Hùng Cường")
  const tkHRCuong = await prisma.taiKhoan.create({
    data: {
      email: 'lehcuong2907@gmail.com',
      tenNguoiDung: 'Lê Hùng Cường',
      matKhau: hashedPassword,
      sdt: '0815114200',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const hrMomoCuong = await prisma.nhaTuyenDung.create({
    data: {
      hoTen: 'Lê Hùng Cường',
      chucVu: 'Senior Tech Talent Acquisition',
      soDienThoai: '0815114200',
      maCongTy: ctyMomo.maCongTy,
      maTaiKhoan: tkHRCuong.maTaiKhoan,
    },
  });

  const tkHRFPT = await prisma.taiKhoan.create({
    data: {
      email: 'hr.fpt@fptsoftware.com',
      tenNguoiDung: 'Nguyễn Phương Linh',
      matKhau: hashedPassword,
      sdt: '0912000111',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const hrFPT = await prisma.nhaTuyenDung.create({
    data: {
      hoTen: 'Nguyễn Phương Linh',
      chucVu: 'IT Recruitment Lead',
      soDienThoai: '0912000111',
      maCongTy: ctyFPT.maCongTy,
      maTaiKhoan: tkHRFPT.maTaiKhoan,
    },
  });

  const tkHRVNG = await prisma.taiKhoan.create({
    data: {
      email: 'talent@vng.com.vn',
      tenNguoiDung: 'Trần Minh Khôi',
      matKhau: hashedPassword,
      sdt: '0923000222',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const hrVNG = await prisma.nhaTuyenDung.create({
    data: {
      hoTen: 'Trần Minh Khôi',
      chucVu: 'Tech Talent Partner',
      soDienThoai: '0923000222',
      maCongTy: ctyVNG.maCongTy,
      maTaiKhoan: tkHRVNG.maTaiKhoan,
    },
  });

  const tkHRShopee = await prisma.taiKhoan.create({
    data: {
      email: 'careers@shopee.vn',
      tenNguoiDung: 'Võ Ngọc Ánh',
      matKhau: hashedPassword,
      sdt: '0934000333',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const hrShopee = await prisma.nhaTuyenDung.create({
    data: {
      hoTen: 'Võ Ngọc Ánh',
      chucVu: 'Regional Tech Recruiter',
      soDienThoai: '0934000333',
      maCongTy: ctyShopee.maCongTy,
      maTaiKhoan: tkHRShopee.maTaiKhoan,
    },
  });

  const tkHRNAB = await prisma.taiKhoan.create({
    data: {
      email: 'talent@nab.com.au',
      tenNguoiDung: 'Hoàng Gia Hân',
      matKhau: hashedPassword,
      sdt: '0945000444',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const hrNAB = await prisma.nhaTuyenDung.create({
    data: {
      hoTen: 'Hoàng Gia Hân',
      chucVu: 'People & Culture Specialist',
      soDienThoai: '0945000444',
      maCongTy: ctyNAB.maCongTy,
      maTaiKhoan: tkHRNAB.maTaiKhoan,
    },
  });

  const tkHRViettel = await prisma.taiKhoan.create({
    data: {
      email: 'tuyendung@viettel.com.vn',
      tenNguoiDung: 'Đỗ Hải Yến',
      matKhau: hashedPassword,
      sdt: '0956000555',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'Active',
    },
  });
  const hrViettel = await prisma.nhaTuyenDung.create({
    data: {
      hoTen: 'Đỗ Hải Yến',
      chucVu: 'Chuyên viên Tuyển dụng CNTT',
      soDienThoai: '0956000555',
      maCongTy: ctyViettel.maCongTy,
      maTaiKhoan: tkHRViettel.maTaiKhoan,
    },
  });

  // =====================================================================
  // D. BÀI ĐĂNG TUYỂN DỤNG (CONGVIEC & CONGVIEC_KYNANG - 15 Jobs thực tế)
  // =====================================================================
  console.log('💼 Đang tạo 15 Bài đăng tuyển dụng IT chuẩn Rich Text HTML...');

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const daysAgo = (days: number): Date => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };

  // Helper tạo Job kèm danh sách kỹ năng (3 - 5 kỹ năng)
  interface SeedJobInput {
    tenCongViec: string;
    slug: string;
    moTa: string;
    yeuCauCongViec: string;
    phucLoi: string;
    mucLuongToiThieu: number | null;
    mucLuongToiDa: number | null;
    yeuCauKinhNghiem: number;
    capBac: string;
    thanhPho: string;
    loaiHinh: string;
    hinhThucLamViec: string;
    ngayDang: Date;
    luotXem: number;
    trangThai: string;
    doUuTien?: number;
    nhanQuangCao?: string | null;
    maNTD: string;
    maChiNhanh: string | null;
    skills: string[];
  }

  const createJobWithSkills = async (input: SeedJobInput) => {
    const { skills, ...jobFields } = input;
    return prisma.congViec.create({
      data: {
        ...jobFields,
        lastRefreshedAt: jobFields.ngayDang,
        ngayHetHan: nextMonth,
        congViecKyNangs: {
          create: skills.map((skillName) => ({
            maKyNang: getSkillId(skillName),
          })),
        },
      },
    });
  };

  // --- 3 JOBS CỦA MOMO (HR Lê Hùng Cường - lehcuong2907@gmail.com) ---
  const jobMomoFrontend = await createJobWithSkills({
    tenCongViec: 'Senior Frontend Engineer (ReactJS / Next.js)',
    slug: 'senior-frontend-engineer-reactjs-nextjs-momo',
    moTa: '<p>Tham gia đội ngũ phát triển <strong>Super App MoMo & Web Ecosystem</strong> phục vụ hơn 31 triệu người dùng trên toàn quốc.</p><ul><li>Thiết kế và xây dựng giao diện Web App, Mini App hiệu năng cao với <strong>ReactJS, Next.js và TypeScript</strong>.</li><li>Tối ưu Core Web Vitals, giảm thời gian tải trang và đảm bảo trải nghiệm mượt mà trên thiết bị di động.</li><li>Phối hợp chặt chẽ cùng Product Owner, UI/UX Designer và Backend Engineer trong quy trình Agile/Scrum.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Có từ <strong>3 năm kinh nghiệm</strong> thực chiến với ReactJS, Next.js (App Router) và TypeScript.</li><li>Thành thạo Tailwind CSS, quản lý state (TanStack Query / Zustand) và tối ưu bundle size.</li><li>Hiểu biết về Web Security (XSS, CSRF), RESTful API và quy trình CI/CD.</li></ul>',
    phucLoi:
      '<ul><li>Mức lương cạnh tranh <strong>35 - 55 triệu VNĐ</strong> + thưởng Performance 2 - 4 tháng lương.</li><li>Chế độ làm việc <strong>Hybrid</strong> linh hoạt (2 ngày WFH/tuần), cấp sẵn MacBook Pro M3.</li><li>Gói bảo hiểm sức khỏe cao cấp cho nhân viên và người thân.</li></ul>',
    mucLuongToiThieu: 35000000,
    mucLuongToiDa: 55000000,
    yeuCauKinhNghiem: 3,
    capBac: 'Senior',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(1),
    luotXem: 842,
    trangThai: 'Đang tuyển',
    doUuTien: 2,
    nhanQuangCao: 'HOT',
    maNTD: hrMomoCuong.maNTD,
    maChiNhanh: ctyMomo.chiNhanhs[0].maChiNhanh,
    skills: ['ReactJS', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Git'],
  });

  const jobMomoFullstack = await createJobWithSkills({
    tenCongViec: 'Middle Fullstack Engineer (NestJS / ReactJS)',
    slug: 'middle-fullstack-engineer-nestjs-reactjs-momo',
    moTa: '<p>Xây dựng hệ thống <strong>Merchant Portal & Loyalty Platform</strong> giúp hàng trăm nghìn đối tác quản lý doanh thu và chiến dịch khuyến mãi trên MoMo.</p><ul><li>Phát triển API Microservices tốc độ cao bằng <strong>NestJS / Node.js</strong> kết hợp PostgreSQL và Redis.</li><li>Xây dựng dashboard quản trị trực quan bằng ReactJS, TypeScript và biểu đồ thời gian thực.</li><li>Tham gia review code, viết Unit/Integration test và tối ưu truy vấn cơ sở dữ liệu.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Tối thiểu <strong>2 năm kinh nghiệm</strong> làm việc với Node.js/NestJS và ReactJS/TypeScript.</li><li>Có kinh nghiệm thiết kế database quan hệ (PostgreSQL hoặc SQL Server) và caching với Redis.</li><li>Quen thuộc với Docker, Gitflow và tư duy giải quyết vấn đề hướng sản phẩm.</li></ul>',
    phucLoi:
      '<ul><li>Lương tháng từ <strong>25 - 42 triệu VNĐ</strong>, xét tăng lương 2 lần/năm.</li><li>Thưởng dự án theo quý và gói chăm sóc sức khỏe toàn diện.</li><li>Môi trường Product năng động, lộ trình phát triển lên Tech Lead rõ ràng.</li></ul>',
    mucLuongToiThieu: 25000000,
    mucLuongToiDa: 42000000,
    yeuCauKinhNghiem: 2,
    capBac: 'Middle',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(2),
    luotXem: 615,
    trangThai: 'Đang tuyển',
    maNTD: hrMomoCuong.maNTD,
    maChiNhanh: ctyMomo.chiNhanhs[0].maChiNhanh,
    skills: ['NestJS', 'ReactJS', 'TypeScript', 'PostgreSQL', 'Redis'],
  });

  const jobMomoDevOps = await createJobWithSkills({
    tenCongViec: 'Lead Cloud & DevOps Engineer (FinTech Infrastructure)',
    slug: 'lead-cloud-devops-engineer-fintech-momo',
    moTa: '<p>Dẫn dắt đội ngũ Platform Engineering vận hành hạ tầng thanh toán trực tuyến với cam kết <strong>SLA 99.99%</strong> trên môi trường Hybrid Cloud.</p><ul><li>Thiết kế, tự động hóa cụm Kubernetes (EKS) phục vụ hơn 300 Microservices.</li><li>Xây dựng pipeline CI/CD bảo mật, tích hợp kiểm thử tự động và canary deployment.</li><li>Tối ưu chi phí hạ tầng AWS và triển khai hệ thống observability toàn diện.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>5 năm kinh nghiệm</strong> DevOps / SRE cho hệ thống chịu tải cao.</li><li>Thành thạo AWS, Kubernetes, Docker, CI/CD và tự động hóa bằng Python/Bash.</li><li>Có chứng chỉ AWS Solutions Architect hoặc CKA là lợi thế lớn.</li></ul>',
    phucLoi:
      '<ul><li>Thu nhập hấp dẫn <strong>50 - 75 triệu VNĐ</strong> (hoặc thỏa thuận theo năng lực).</li><li>Thưởng hiệu suất năm và cổ phần ESOP cho cấp Lead.</li><li>Tài trợ 100% chi phí thi chứng chỉ Cloud quốc tế.</li></ul>',
    mucLuongToiThieu: 50000000,
    mucLuongToiDa: 75000000,
    yeuCauKinhNghiem: 5,
    capBac: 'Lead',
    thanhPho: 'Hà Nội',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(4),
    luotXem: 490,
    trangThai: 'Đang tuyển',
    maNTD: hrMomoCuong.maNTD,
    maChiNhanh: ctyMomo.chiNhanhs[1].maChiNhanh,
    skills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Python'],
  });

  // --- 3 JOBS CỦA FPT SOFTWARE ---
  const jobFPTJava = await createJobWithSkills({
    tenCongViec: 'Senior Java Backend Engineer (Global Banking Project)',
    slug: 'senior-java-backend-engineer-global-banking-fpt',
    moTa: '<p>Tham gia phát triển hệ thống <strong>Core Banking & Open API</strong> cho đối tác ngân hàng hàng đầu tại Singapore và Nhật Bản.</p><ul><li>Phân tích nghiệp vụ tài chính, thiết kế kiến trúc Microservices với <strong>Java & Spring Boot</strong>.</li><li>Tối ưu hiệu năng truy vấn trên PostgreSQL/SQL Server xử lý hàng triệu giao dịch mỗi ngày.</li><li>Review code, mentor các thành viên Junior/Fresher trong team Agile.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>4 năm kinh nghiệm</strong> phát triển Backend với Java (Java 11/17) và Spring Boot.</li><li>Thành thạo RESTful API, Microservices, Docker và CSDL quan hệ (PostgreSQL/SQL Server).</li><li>Đọc hiểu tài liệu tiếng Anh chuyên ngành tốt, sẵn sàng giao tiếp với khách hàng quốc tế.</li></ul>',
    phucLoi:
      '<ul><li>Lương <strong>40 - 65 triệu VNĐ</strong> + Thưởng dự án và lương tháng 13.</li><li>Bảo hiểm FPT Care + Cơ hội Onsite tại Nhật Bản / Singapore.</li><li>Đào tạo và tài trợ thi chứng chỉ AWS, Oracle Java miễn phí.</li></ul>',
    mucLuongToiThieu: 40000000,
    mucLuongToiDa: 65000000,
    yeuCauKinhNghiem: 4,
    capBac: 'Senior',
    thanhPho: 'Hà Nội',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(2),
    luotXem: 530,
    trangThai: 'Đang tuyển',
    doUuTien: 4,
    nhanQuangCao: 'DIAMOND',
    maNTD: hrFPT.maNTD,
    maChiNhanh: ctyFPT.chiNhanhs[0].maChiNhanh,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'AWS'],
  });

  const jobFPTTester = await createJobWithSkills({
    tenCongViec: 'Fresher / Junior QA Tester (Manual & Automation)',
    slug: 'fresher-junior-qa-tester-manual-automation-fpt',
    moTa: '<p>Đảm bảo chất lượng phần mềm cho các dự án Enterprise Web & Mobile dành cho thị trường Châu Âu tại FPT Complex Đà Nẵng.</p><ul><li>Phân tích tài liệu SRS/User Story, viết Test Plan, Test Case và thực hiện kiểm thử chức năng.</li><li>Phối hợp cùng team Dev xây dựng kịch bản <strong>Automation Test</strong> cho regression suite.</li><li>Theo dõi và quản lý bug trên Jira theo quy trình Agile/Scrum.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Sinh viên mới tốt nghiệp hoặc có từ <strong>0 - 1.5 năm kinh nghiệm</strong> kiểm thử phần mềm.</li><li>Nắm vững quy trình kiểm thử, viết Test Case rõ ràng và có kiến thức SQL cơ bản.</li><li>Có chứng chỉ ISTQB Foundation hoặc đã từng viết Automation Test là điểm cộng.</li></ul>',
    phucLoi:
      '<ul><li>Thu nhập <strong>10 - 18 triệu VNĐ</strong>, lộ trình review tăng lương mỗi 6 tháng.</li><li>Làm việc tại FPT Complex Đà Nẵng với xe đưa đón và khu thể thao hiện đại.</li><li>Được Senior QA đào tạo bài bản từ Manual lên Automation Test.</li></ul>',
    mucLuongToiThieu: 10000000,
    mucLuongToiDa: 18000000,
    yeuCauKinhNghiem: 1,
    capBac: 'Fresher',
    thanhPho: 'Đà Nẵng',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(3),
    luotXem: 412,
    trangThai: 'Đang tuyển',
    doUuTien: 4,
    nhanQuangCao: 'DIAMOND',
    maNTD: hrFPT.maNTD,
    maChiNhanh: ctyFPT.chiNhanhs[1].maChiNhanh,
    skills: ['Manual Testing', 'Automation Test', 'Agile/Scrum', 'Git'],
  });

  const jobFPTRemote = await createJobWithSkills({
    tenCongViec: 'Middle .NET Core & Angular Developer (Remote)',
    slug: 'middle-dotnet-core-angular-developer-remote-fpt',
    moTa: '<p>Phát triển hệ thống quản trị chuỗi cung ứng (Supply Chain ERP) làm việc <strong>Remote 100%</strong> cùng đội ngũ kỹ sư tại TP.HCM và khách hàng Úc.</p><ul><li>Xây dựng backend API bằng <strong>.NET Core</strong> và SQL Server hiệu năng cao.</li><li>Phát triển giao diện quản trị doanh nghiệp bằng Angular và TypeScript.</li><li>Tham gia họp Daily Standup và Sprint Review trực tuyến cùng khách hàng.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>2 - 3 năm kinh nghiệm</strong> với C# / .NET Core và Angular hoặc TypeScript.</li><li>Kinh nghiệm tối ưu hóa SQL Server, viết Stored Procedure và Entity Framework Core.</li><li>Kỹ năng tự quản lý tiến độ tốt khi làm việc từ xa.</li></ul>',
    phucLoi:
      '<ul><li>Lương <strong>25 - 40 triệu VNĐ</strong> + Phụ cấp thiết bị làm việc tại nhà.</li><li>Chế độ Remote hoàn toàn, chủ động không gian làm việc.</li><li>Hưởng đầy đủ bảo hiểm FPT Care và 15 ngày phép năm.</li></ul>',
    mucLuongToiThieu: 25000000,
    mucLuongToiDa: 40000000,
    yeuCauKinhNghiem: 2,
    capBac: 'Middle',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Remote',
    ngayDang: daysAgo(5),
    luotXem: 365,
    trangThai: 'Đang tuyển',
    maNTD: hrFPT.maNTD,
    maChiNhanh: null,
    skills: ['.NET Core', 'Angular', 'TypeScript', 'SQL Server'],
  });

  // --- 3 JOBS CỦA VNG CORPORATION ---
  const jobVNGGolang = await createJobWithSkills({
    tenCongViec: 'Senior Golang Backend Engineer (ZaloPay Core)',
    slug: 'senior-golang-backend-engineer-zalopay-core-vng',
    moTa: '<p>Xây dựng hệ thống ví điện tử và cổng thanh toán <strong>ZaloPay</strong> phục vụ hàng chục triệu người dùng với độ tin cậy tuyệt đối.</p><ul><li>Thiết kế các dịch vụ xử lý giao dịch phân tán bằng <strong>Golang</strong>, gRPC và Redis Cluster.</li><li>Giải quyết bài toán Data Consistency, Idempotency và chống gian lận thời gian thực.</li><li>Theo dõi metric, tracing hệ thống để tối ưu độ trễ xuống dưới 50ms.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>3 năm kinh nghiệm</strong> phát triển hệ thống Backend phân tán bằng Golang hoặc Java.</li><li>Am hiểu sâu về concurrency, Redis, PostgreSQL/MySQL và Kubernetes.</li><li>Tư duy giải thuật và thiết kế hệ thống vững chắc.</li></ul>',
    phucLoi:
      '<ul><li>Thu nhập <strong>40 - 70 triệu VNĐ</strong> (up to 17 tháng lương/năm).</li><li>Làm việc tại VNG Campus Quận 7 với đầy đủ tiện ích Gym, hồ bơi, canteen.</li><li>Cấp MacBook Pro và gói bảo hiểm sức khỏe cho gia đình.</li></ul>',
    mucLuongToiThieu: 40000000,
    mucLuongToiDa: 70000000,
    yeuCauKinhNghiem: 3,
    capBac: 'Senior',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(1),
    luotXem: 688,
    trangThai: 'Đang tuyển',
    doUuTien: 3,
    nhanQuangCao: 'SUPER_HOT',
    maNTD: hrVNG.maNTD,
    maChiNhanh: ctyVNG.chiNhanhs[0].maChiNhanh,
    skills: ['Golang', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
  });

  const jobVNGNode = await createJobWithSkills({
    tenCongViec: 'Junior Node.js / TypeScript Developer (VNG Cloud)',
    slug: 'junior-nodejs-typescript-developer-vng-cloud',
    moTa: '<p>Tham gia phát triển <strong>VNG Cloud Console & Billing API</strong> giúp doanh nghiệp quản trị tài nguyên Cloud chỉ với vài cú click.</p><ul><li>Phát triển RESTful API bằng Node.js, NestJS và TypeScript.</li><li>Tích hợp đồng bộ dữ liệu thanh toán với MySQL và MongoDB.</li><li>Viết Unit Test, tài liệu API và phối hợp với đội Frontend Vue.js/ReactJS.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>1 năm kinh nghiệm</strong> với Node.js / NestJS và TypeScript.</li><li>Nắm vững SQL (MySQL/PostgreSQL) và có kiến thức cơ bản về Docker, Git.</li><li>Ham học hỏi các công nghệ Cloud Computing và hệ thống phân tán.</li></ul>',
    phucLoi:
      '<ul><li>Lương <strong>15 - 25 triệu VNĐ</strong> + Thưởng tháng 13 và hiệu suất.</li><li>Được Senior Tech Lead hướng dẫn 1-1 lộ trình lên Middle.</li><li>Tham gia các CLB thể thao và teambuilding của VNG.</li></ul>',
    mucLuongToiThieu: 15000000,
    mucLuongToiDa: 25000000,
    yeuCauKinhNghiem: 1,
    capBac: 'Junior',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(6),
    luotXem: 294,
    trangThai: 'Đang tuyển',
    doUuTien: 3,
    nhanQuangCao: 'SUPER_HOT',
    maNTD: hrVNG.maNTD,
    maChiNhanh: ctyVNG.chiNhanhs[0].maChiNhanh,
    skills: ['Node.js', 'NestJS', 'TypeScript', 'MySQL', 'Docker'],
  });

  const jobVNGIntern = await createJobWithSkills({
    tenCongViec: 'Intern Frontend ReactJS / UI Engineer (VNG Fresher)',
    slug: 'intern-frontend-reactjs-ui-engineer-vng',
    moTa: '<p>Chương trình <strong>VNG Tech Fresher & Internship</strong> dành cho sinh viên năm cuối đam mê xây dựng sản phẩm Web hiện đại.</p><ul><li>Phát triển giao diện Web bằng ReactJS, TypeScript và Tailwind CSS dưới sự hướng dẫn của Mentor.</li><li>Tham gia dự án thật cùng đội ngũ sản phẩm VNG Digital Business.</li><li>Cơ hội trở thành nhân viên chính thức sau 3 tháng thực tập.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Sinh viên năm 3, năm 4 ngành CNTT hoặc tương đương, làm việc tối thiểu 4 ngày/tuần.</li><li>Có nền tảng vững về HTML/CSS, JavaScript/TypeScript và đã từng làm đồ án với ReactJS.</li><li>Biết sử dụng Git và có tinh thần chủ động học hỏi.</li></ul>',
    phucLoi:
      '<ul><li>Trợ cấp thực tập <strong>6 - 10 triệu VNĐ/tháng</strong> + hỗ trợ ăn trưa, gửi xe.</li><li>Được đánh giá lên Junior ngay sau kỳ thực tập nếu đạt kết quả tốt.</li><li>Trải nghiệm môi trường làm việc chuẩn kỳ lân công nghệ.</li></ul>',
    mucLuongToiThieu: null,
    mucLuongToiDa: null,
    yeuCauKinhNghiem: 0,
    capBac: 'Intern',
    thanhPho: 'Hà Nội',
    loaiHinh: 'Part-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(7),
    luotXem: 520,
    trangThai: 'Đang tuyển',
    maNTD: hrVNG.maNTD,
    maChiNhanh: ctyVNG.chiNhanhs[1].maChiNhanh,
    skills: ['ReactJS', 'TypeScript', 'Tailwind CSS', 'Git'],
  });

  // --- 2 JOBS CỦA SHOPEE VIETNAM ---
  const jobShopeeVue = await createJobWithSkills({
    tenCongViec: 'Middle Frontend Engineer (Vue.js / Seller Center)',
    slug: 'middle-frontend-engineer-vuejs-seller-center-shopee',
    moTa: '<p>Xây dựng hệ thống <strong>Shopee Seller Centre</strong> hỗ trợ hàng triệu nhà bán hàng tại Việt Nam và Đông Nam Á quản lý đơn hàng, livestream và quảng cáo.</p><ul><li>Phát triển các module phức tạp với <strong>Vue.js, TypeScript</strong> và kiến trúc Microfrontend.</li><li>Đảm bảo độ ổn định giao diện trong các sự kiện Mega Sale (9.9, 11.11, 12.12).</li><li>Phối hợp trực tiếp với team Product và Engineer tại Singapore.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>2 - 4 năm kinh nghiệm</strong> với Vue.js hoặc ReactJS và TypeScript chuyên sâu.</li><li>Am hiểu trình duyệt, tối ưu hóa rendering danh sách dữ liệu lớn.</li><li>Giao tiếp tiếng Anh tốt trong môi trường đa quốc gia.</li></ul>',
    phucLoi:
      '<ul><li>Lương <strong>28 - 45 triệu VNĐ</strong> + Thưởng KPI và tháng 13.</li><li>Làm việc tại Saigon Centre Quận 1, pantry đồ ăn vặt miễn phí.</li><li>15 ngày phép năm và bảo hiểm sức khỏe quốc tế.</li></ul>',
    mucLuongToiThieu: 28000000,
    mucLuongToiDa: 45000000,
    yeuCauKinhNghiem: 2,
    capBac: 'Middle',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(3),
    luotXem: 445,
    trangThai: 'Đang tuyển',
    doUuTien: 1,
    nhanQuangCao: 'BASIC',
    maNTD: hrShopee.maNTD,
    maChiNhanh: ctyShopee.chiNhanhs[0].maChiNhanh,
    skills: ['Vue.js', 'TypeScript', 'CI/CD', 'Git'],
  });

  const jobShopeePython = await createJobWithSkills({
    tenCongViec: 'Senior Data & Python Backend Engineer (Search Platform)',
    slug: 'senior-data-python-backend-engineer-shopee',
    moTa: '<p>Phát triển hệ thống <strong>Search & Recommendation Pipeline</strong> xử lý dữ liệu hành vi người dùng theo thời gian thực tại Shopee.</p><ul><li>Xây dựng Data API & ETL service tốc độ cao bằng <strong>Python, Golang</strong> trên nền tảng GCP/Kubernetes.</li><li>Tối ưu truy vấn dữ liệu lớn với PostgreSQL, MongoDB và Redis.</li><li>Đảm bảo khả năng chịu tải gấp 10 lần bình thường trong các khung giờ Flash Sale.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>4 năm kinh nghiệm</strong> Backend với Python hoặc Golang.</li><li>Thành thạo thiết kế hệ thống dữ liệu lớn, SQL/NoSQL và Docker/Kubernetes.</li><li>Tư duy phân tích hệ thống tốt, có kinh nghiệm E-commerce là lợi thế.</li></ul>',
    phucLoi:
      '<ul><li>Gói thu nhập <strong>45 - 70 triệu VNĐ</strong> (Thỏa thuận thêm cho ứng viên xuất sắc).</li><li>Cấp MacBook Pro và gói khám sức khỏe cao cấp.</li><li>Company Trip nước ngoài và các sự kiện văn hóa nội bộ sôi động.</li></ul>',
    mucLuongToiThieu: 45000000,
    mucLuongToiDa: 70000000,
    yeuCauKinhNghiem: 4,
    capBac: 'Senior',
    thanhPho: 'Hà Nội',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(5),
    luotXem: 378,
    trangThai: 'Đang tuyển',
    maNTD: hrShopee.maNTD,
    maChiNhanh: ctyShopee.chiNhanhs[1].maChiNhanh,
    skills: ['Python', 'Golang', 'PostgreSQL', 'Redis', 'GCP'],
  });

  // --- 2 JOBS CỦA NAB INNOVATION CENTRE ---
  const jobNABFullstack = await createJobWithSkills({
    tenCongViec: 'Senior Fullstack Software Engineer (React / Node.js / AWS)',
    slug: 'senior-fullstack-software-engineer-react-nodejs-aws-nab',
    moTa: '<p>Gia nhập squad Agile quốc tế xây dựng sản phẩm <strong>NAB Internet Banking</strong> phục vụ hơn 8 triệu khách hàng tại Úc.</p><ul><li>Phát triển Microfrontend bằng <strong>ReactJS & TypeScript</strong> kết hợp API bằng <strong>Node.js / NestJS</strong>.</li><li>Triển khai hạ tầng Serverless và Container trên <strong>AWS</strong> qua quy trình CI/CD tự động.</li><li>Thực hành TDD, Pair Programming và Code Quality theo chuẩn ngân hàng Úc.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>4 năm kinh nghiệm</strong> phát triển Fullstack JavaScript/TypeScript (ReactJS & Node.js).</li><li>Có kinh nghiệm thực tế triển khai ứng dụng trên AWS (Lambda, ECS/EKS, RDS).</li><li>Giao tiếp tiếng Anh lưu loát để làm việc hàng ngày với Product Manager tại Melbourne.</li></ul>',
    phucLoi:
      '<ul><li>Mức lương <strong>50 - 75 triệu VNĐ</strong> (100% Gross, thưởng hiệu suất hàng năm).</li><li>Làm việc Hybrid linh hoạt, 20 ngày phép năm, văn hóa không OT.</li><li>Tài trợ học và thi chứng chỉ AWS qua chương trình NAB Cloud Guild.</li></ul>',
    mucLuongToiThieu: 50000000,
    mucLuongToiDa: 75000000,
    yeuCauKinhNghiem: 4,
    capBac: 'Senior',
    thanhPho: 'TP.HCM',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(2),
    luotXem: 590,
    trangThai: 'Đang tuyển',
    maNTD: hrNAB.maNTD,
    maChiNhanh: ctyNAB.chiNhanhs[0].maChiNhanh,
    skills: ['ReactJS', 'Node.js', 'TypeScript', 'AWS', 'CI/CD'],
  });

  const jobNABUIUX = await createJobWithSkills({
    tenCongViec: 'Middle Product UI/UX Designer & Design System Specialist',
    slug: 'middle-product-uiux-designer-design-system-nab',
    moTa: '<p>Thiết kế trải nghiệm người dùng cho các ứng dụng tài chính số của NAB, đảm bảo tính nhất quán trên toàn bộ Design System.</p><ul><li>Thực hiện User Research, Wireframe, Prototype tương tác và Usability Testing.</li><li>Xây dựng và mở rộng bộ thư viện Component Design System phối hợp chặt chẽ với Frontend ReactJS.</li><li>Đảm bảo tiêu chuẩn Accessibility (WCAG) cho sản phẩm ngân hàng quốc tế.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>2 năm kinh nghiệm</strong> thiết kế sản phẩm Digital (Web/Mobile App).</li><li>Thành thạo Figma, tư duy Design Thinking và có hiểu biết về HTML/CSS/ReactJS.</li><li>Tiếng Anh giao tiếp tốt, có Portfolio trình bày rõ quá trình giải quyết bài toán UX.</li></ul>',
    phucLoi:
      '<ul><li>Thu nhập <strong>25 - 42 triệu VNĐ</strong> + Bảo hiểm cao cấp cho gia đình.</li><li>Môi trường quốc tế chuyên nghiệp tại Etown Central Quận 4 hoặc Hoàn Kiếm Hà Nội.</li><li>20 ngày nghỉ phép có lương mỗi năm.</li></ul>',
    mucLuongToiThieu: 25000000,
    mucLuongToiDa: 42000000,
    yeuCauKinhNghiem: 2,
    capBac: 'Middle',
    thanhPho: 'Hà Nội',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    ngayDang: daysAgo(6),
    luotXem: 275,
    trangThai: 'Đang tuyển',
    maNTD: hrNAB.maNTD,
    maChiNhanh: ctyNAB.chiNhanhs[1].maChiNhanh,
    skills: ['UI/UX Design', 'ReactJS', 'Agile/Scrum'],
  });

  // --- 2 JOBS CỦA VIETTEL SOLUTIONS ---
  const jobViettelJava = await createJobWithSkills({
    tenCongViec: 'Middle Java / Spring Boot Developer (Smart City Platform)',
    slug: 'middle-java-spring-boot-developer-smart-city-viettel',
    moTa: '<p>Phát triển nền tảng <strong>Điều hành Đô thị Thông minh (IOC)</strong> và Chính phủ số triển khai tại hơn 30 tỉnh thành trên cả nước.</p><ul><li>Thiết kế và xây dựng các dịch vụ Backend bằng <strong>Java Spring Boot</strong> tích hợp IoT và dữ liệu bản đồ số.</li><li>Tối ưu truy vấn dữ liệu lớn trên PostgreSQL và SQL Server.</li><li>Phối hợp triển khai hệ thống đóng gói qua Docker & Kubernetes lên hạ tầng Viettel Cloud.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>2 - 3 năm kinh nghiệm</strong> lập trình Java Spring Boot.</li><li>Thành thạo PostgreSQL hoặc SQL Server, có kinh nghiệm làm việc với Docker, Git và CI/CD.</li><li>Tinh thần trách nhiệm cao, sẵn sàng xử lý các bài toán quy mô lớn.</li></ul>',
    phucLoi:
      '<ul><li>Mức lương <strong>25 - 42 triệu VNĐ</strong> + Thưởng các ngày lễ lớn và dự án trọng điểm.</li><li>Phụ cấp ăn trưa, điện thoại và chế độ nghỉ dưỡng hàng năm tại hệ thống resort cao cấp.</li></ul>',
    mucLuongToiThieu: 25000000,
    mucLuongToiDa: 42000000,
    yeuCauKinhNghiem: 2,
    capBac: 'Middle',
    thanhPho: 'Hà Nội',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(4),
    luotXem: 318,
    trangThai: 'Đang tuyển',
    maNTD: hrViettel.maNTD,
    maChiNhanh: ctyViettel.chiNhanhs[0].maChiNhanh,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
  });

  const jobViettelPHP = await createJobWithSkills({
    tenCongViec: 'Junior PHP / Laravel & Next.js Portal Developer',
    slug: 'junior-php-laravel-nextjs-portal-developer-viettel',
    moTa: '<p>Xây dựng hệ thống cổng thông tin doanh nghiệp và chuyển đổi số SME cho khách hàng tại khu vực Miền Trung.</p><ul><li>Phát triển backend API với <strong>PHP</strong> (Laravel) và giao diện hiện đại bằng Next.js.</li><li>Bảo trì, nâng cấp tính năng và tối ưu cơ sở dữ liệu MySQL, Redis.</li><li>Hỗ trợ kiểm thử và triển khai ứng dụng theo quy trình Agile/Scrum.</li></ul>',
    yeuCauCongViec:
      '<ul><li>Từ <strong>1 năm kinh nghiệm</strong> với PHP (Laravel) hoặc Next.js.</li><li>Hiểu rõ MySQL, RESTful API và quản lý mã nguồn với Git.</li><li>Ưu tiên ứng viên đang sinh sống hoặc sẵn sàng làm việc tại Đà Nẵng.</li></ul>',
    phucLoi:
      '<ul><li>Thu nhập <strong>14 - 22 triệu VNĐ</strong> + Lương tháng 13 và thưởng dự án.</li><li>Môi trường tập đoàn ổn định, lộ trình tăng bậc rõ ràng.</li></ul>',
    mucLuongToiThieu: 14000000,
    mucLuongToiDa: 22000000,
    yeuCauKinhNghiem: 1,
    capBac: 'Junior',
    thanhPho: 'Đà Nẵng',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Tại văn phòng',
    ngayDang: daysAgo(8),
    luotXem: 240,
    trangThai: 'Đang tuyển',
    maNTD: hrViettel.maNTD,
    maChiNhanh: ctyViettel.chiNhanhs[1].maChiNhanh,
    skills: ['PHP', 'Next.js', 'MySQL', 'Redis', 'Git'],
  });

  // =====================================================================
  // E. ỨNG VIÊN & HỒ SƠ HYBRID CV (5 Ứng viên giàu dữ liệu thực tế)
  // =====================================================================
  console.log('🧑‍💻 Đang tạo 5 Hồ sơ Ứng viên Hybrid CV...');

  // Tài khoản cho 5 ứng viên
  const tkUVQuan = await prisma.taiKhoan.create({
    data: {
      email: 'quan.nguyen.fe@gmail.com',
      tenNguoiDung: 'Nguyễn Minh Quân',
      matKhau: hashedPassword,
      sdt: '0981100201',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  const tkUVNam = await prisma.taiKhoan.create({
    data: {
      email: 'nam.pham.java@gmail.com',
      tenNguoiDung: 'Phạm Hoàng Nam',
      matKhau: hashedPassword,
      sdt: '0982200302',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  const tkUVVy = await prisma.taiKhoan.create({
    data: {
      email: 'vy.tran.fullstack@gmail.com',
      tenNguoiDung: 'Trần Thảo Vy',
      matKhau: hashedPassword,
      sdt: '0983300403',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  const tkUVBao = await prisma.taiKhoan.create({
    data: {
      email: 'bao.le.qa@gmail.com',
      tenNguoiDung: 'Lê Quốc Bảo',
      matKhau: hashedPassword,
      sdt: '0984400504',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  const tkUVKiet = await prisma.taiKhoan.create({
    data: {
      email: 'kiet.dang.devops@gmail.com',
      tenNguoiDung: 'Đặng Tuấn Kiệt',
      matKhau: hashedPassword,
      sdt: '0985500605',
      vaiTro: 'UNGVIEN',
      trangThai: 'Active',
    },
  });

  // 1. Ứng viên Frontend Developer (React/Next.js - 3 năm exp)
  const uvQuan = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUVQuan.maTaiKhoan,
      tenUngVien: 'Nguyễn Minh Quân',
      ngaySinh: new Date('1999-05-14'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 3,
      chuyenMon: 'Frontend Developer (ReactJS / Next.js)',
      diaChi: 'Quận Bình Thạnh, TP.HCM',
      trangThaiPortfolio: 'Public',
      cvUrl:
        'https://res.cloudinary.com/demo/raw/upload/v1/cv/nguyen-minh-quan-fe.pdf',
      loaiCvMacDinh: 'ONLINE',
      gioiThieuBanThan:
        '<p>Kỹ sư Frontend với <strong>3 năm kinh nghiệm</strong> xây dựng Web Application hiệu năng cao bằng ReactJS, Next.js và TypeScript. Thế mạnh về tối ưu Core Web Vitals, thiết kế UI với Tailwind CSS và tích hợp TanStack React Query.</p>',
      danhSachFileCv: {
        create: [
          {
            tenFile: 'NguyenMinhQuan_Frontend_React_NextJS.pdf',
            fileUrl:
              'https://res.cloudinary.com/demo/raw/upload/v1/cv/nguyen-minh-quan-fe.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'Tiki Corporation',
            viTri: 'Frontend Engineer (React / Next.js)',
            ngayBatDau: new Date('2023-06-01'),
            ngayKetThuc: null,
            moTaChiTiet:
              '<ul><li>Phát triển trang chiến dịch Flash Sale và Seller Dashboard bằng Next.js 14 và TypeScript phục vụ 500K+ lượt truy cập/ngày.</li><li>Giảm 35% thời gian LCP thông qua SSR streaming, code-splitting và tối ưu hình ảnh.</li></ul>',
          },
          {
            tenCongTy: 'KMS Technology Vietnam',
            viTri: 'Junior Frontend Developer',
            ngayBatDau: new Date('2021-08-01'),
            ngayKetThuc: new Date('2023-05-31'),
            moTaChiTiet:
              '<ul><li>Xây dựng thư viện UI Component dùng chung với ReactJS, TypeScript và Tailwind CSS cho khách hàng Healthcare tại Mỹ.</li><li>Viết Unit Test đạt coverage 85% với Jest & React Testing Library.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học Bách Khoa TP.HCM (HCMUT)',
            nganhHoc: 'Khoa học Máy tính',
            ngayBatDau: new Date('2017-09-01'),
            ngayTotNghiep: new Date('2021-06-30'),
            gpa: '3.55/4.0',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'Meta Front-End Developer Professional Certificate',
            toChucCap: 'Coursera / Meta',
            ngayCap: new Date('2023-09-10'),
            ngayHetHan: null,
          },
          {
            tenChungChi: 'TOEIC 820 (Listening & Reading)',
            toChucCap: 'IIG Vietnam',
            ngayCap: new Date('2022-11-15'),
            ngayHetHan: new Date('2024-11-15'),
          },
        ],
      },
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'TOEIC 820' }],
      },
      portfolios: {
        create: [
          {
            tieuDe: 'E-Commerce Storefront Next.js 15 + Tailwind CSS',
            moTa: 'Nền tảng thương mại điện tử tối ưu SEO với Server Actions, Redis cache và cổng thanh toán giả lập VNPay.',
            projectUrl: 'https://github.com/minhquan-dev/nextjs-ecommerce-pro',
          },
        ],
      },
      kyNangs: {
        create: [
          { maKyNang: getSkillId('ReactJS'), mucDo: 'Chuyên gia' },
          { maKyNang: getSkillId('Next.js'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('TypeScript'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('Tailwind CSS'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('Git'), mucDo: 'Giỏi' },
        ],
      },
    },
  });

  // 2. Ứng viên Backend Developer (Java/Spring Boot - 4 năm exp)
  const uvNam = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUVNam.maTaiKhoan,
      tenUngVien: 'Phạm Hoàng Nam',
      ngaySinh: new Date('1997-09-20'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 4,
      chuyenMon: 'Senior Backend Developer (Java / Spring Boot)',
      diaChi: 'Quận Cầu Giấy, Hà Nội',
      trangThaiPortfolio: 'Public',
      cvUrl:
        'https://res.cloudinary.com/demo/raw/upload/v1/cv/pham-hoang-nam-java.pdf',
      loaiCvMacDinh: 'ONLINE',
      gioiThieuBanThan:
        '<p>Kỹ sư Backend chuyên sâu hệ sinh thái <strong>Java & Spring Boot</strong> với 4 năm kinh nghiệm xây dựng kiến trúc Microservices trong lĩnh vực FinTech và Ngân hàng số.</p>',
      danhSachFileCv: {
        create: [
          {
            tenFile: 'PhamHoangNam_Senior_Java_SpringBoot.pdf',
            fileUrl:
              'https://res.cloudinary.com/demo/raw/upload/v1/cv/pham-hoang-nam-java.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'Techcombank Digital Factory',
            viTri: 'Senior Java Backend Engineer',
            ngayBatDau: new Date('2022-08-01'),
            ngayKetThuc: null,
            moTaChiTiet:
              '<ul><li>Phát triển dịch vụ chuyển khoản nhanh NAPAS 24/7 bằng Java 17, Spring Boot và PostgreSQL.</li><li>Áp dụng Redis distributed lock xử lý đồng bộ 5.000 giao dịch/giây không xảy ra race condition.</li></ul>',
          },
          {
            tenCongTy: 'VNPT IT',
            viTri: 'Java Software Engineer',
            ngayBatDau: new Date('2020-07-01'),
            ngayKetThuc: new Date('2022-07-31'),
            moTaChiTiet:
              '<ul><li>Xây dựng API cổng dịch vụ công quốc gia và tích hợp chữ ký số.</li><li>Đóng gói ứng dụng với Docker và thiết lập CI/CD GitLab Runner.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học Bách Khoa Hà Nội (HUST)',
            nganhHoc: 'Kỹ thuật Phần mềm',
            ngayBatDau: new Date('2015-09-01'),
            ngayTotNghiep: new Date('2020-06-15'),
            gpa: '3.48/4.0',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'Oracle Certified Professional: Java SE 17 Developer',
            toChucCap: 'Oracle',
            ngayCap: new Date('2023-03-20'),
            ngayHetHan: null,
          },
          {
            tenChungChi: 'AWS Certified Developer - Associate',
            toChucCap: 'Amazon Web Services',
            ngayCap: new Date('2024-02-10'),
            ngayHetHan: new Date('2027-02-10'),
          },
        ],
      },
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'IELTS 7.0' }],
      },
      portfolios: {
        create: [
          {
            tieuDe: 'Microservices Core Ledger Engine (Spring Cloud)',
            moTa: 'Kiến trúc Microservices mô phỏng sổ cái giao dịch tài chính sử dụng Spring Boot, Kafka, PostgreSQL và Docker.',
            projectUrl:
              'https://github.com/hoangnam-java/core-ledger-microservices',
          },
        ],
      },
      kyNangs: {
        create: [
          { maKyNang: getSkillId('Java'), mucDo: 'Chuyên gia' },
          { maKyNang: getSkillId('Spring Boot'), mucDo: 'Chuyên gia' },
          { maKyNang: getSkillId('PostgreSQL'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('Redis'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('Docker'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('AWS'), mucDo: 'Khá' },
        ],
      },
    },
  });

  // 3. Ứng viên Fullstack Engineer (NestJS/React - 2 năm exp)
  const uvVy = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUVVy.maTaiKhoan,
      tenUngVien: 'Trần Thảo Vy',
      ngaySinh: new Date('2000-11-08'),
      gioiTinh: 'Nữ',
      soNamKinhNghiem: 2,
      chuyenMon: 'Fullstack Engineer (NestJS / ReactJS)',
      diaChi: 'Quận 3, TP.HCM',
      trangThaiPortfolio: 'Public',
      cvUrl:
        'https://res.cloudinary.com/demo/raw/upload/v1/cv/tran-thao-vy-fullstack.pdf',
      loaiCvMacDinh: 'ONLINE',
      gioiThieuBanThan:
        '<p>Fullstack Developer với <strong>2 năm kinh nghiệm</strong> làm chủ toàn bộ vòng đời sản phẩm từ NestJS/PostgreSQL phía Backend đến ReactJS/Next.js phía Frontend.</p>',
      danhSachFileCv: {
        create: [
          {
            tenFile: 'TranThaoVy_Fullstack_NestJS_React.pdf',
            fileUrl:
              'https://res.cloudinary.com/demo/raw/upload/v1/cv/tran-thao-vy-fullstack.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'Base.vn',
            viTri: 'Fullstack Software Engineer',
            ngayBatDau: new Date('2023-09-01'),
            ngayKetThuc: null,
            moTaChiTiet:
              '<ul><li>Phát triển hệ thống HRM SaaS bằng NestJS, PostgreSQL và ReactJS TypeScript phục vụ hơn 3.000 doanh nghiệp.</li><li>Thiết kế cơ chế RBAC phân quyền chi tiết và tối ưu tốc độ xuất báo cáo Excel 50.000 dòng dưới 3 giây.</li></ul>',
          },
          {
            tenCongTy: 'FPT Software',
            viTri: 'Junior Fullstack Developer',
            ngayBatDau: new Date('2022-06-01'),
            ngayKetThuc: new Date('2023-08-31'),
            moTaChiTiet:
              '<ul><li>Tham gia phát triển ứng dụng quản lý đào tạo nội bộ bằng Node.js, MongoDB và ReactJS.</li><li>Triển khai ứng dụng qua Docker Compose và GitHub Actions.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học FPT TP.HCM',
            nganhHoc: 'Kỹ thuật Phần mềm',
            ngayBatDau: new Date('2018-09-01'),
            ngayTotNghiep: new Date('2022-05-30'),
            gpa: '3.62/4.0',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'AWS Certified Cloud Practitioner',
            toChucCap: 'Amazon Web Services',
            ngayCap: new Date('2024-04-15'),
            ngayHetHan: new Date('2027-04-15'),
          },
          {
            tenChungChi: 'TOEIC 865',
            toChucCap: 'IIG Vietnam',
            ngayCap: new Date('2023-07-20'),
            ngayHetHan: new Date('2025-07-20'),
          },
        ],
      },
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'TOEIC 865' }],
      },
      portfolios: {
        create: [
          {
            tieuDe: 'TaskFlow SaaS Workspace (NestJS + Next.js + Redis)',
            moTa: 'Ứng dụng quản lý công việc nhóm thời gian thực với WebSocket, Drag-and-drop Kanban và xác thực JWT Cookie.',
            projectUrl: 'https://github.com/thaovy-tech/taskflow-saas',
          },
        ],
      },
      kyNangs: {
        create: [
          { maKyNang: getSkillId('NestJS'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('ReactJS'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('TypeScript'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('PostgreSQL'), mucDo: 'Khá' },
          { maKyNang: getSkillId('Redis'), mucDo: 'Khá' },
          { maKyNang: getSkillId('Docker'), mucDo: 'Khá' },
        ],
      },
    },
  });

  // 4. Ứng viên Fresher / Intern Tester (ĐH Duy Tân)
  const uvBao = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUVBao.maTaiKhoan,
      tenUngVien: 'Lê Quốc Bảo',
      ngaySinh: new Date('2003-02-19'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 1,
      chuyenMon: 'Fresher / Intern QA Tester (Manual & Automation)',
      diaChi: 'Quận Hải Châu, Đà Nẵng',
      trangThaiPortfolio: 'Public',
      cvUrl:
        'https://res.cloudinary.com/demo/raw/upload/v1/cv/le-quoc-bao-tester.pdf',
      loaiCvMacDinh: 'ONLINE',
      gioiThieuBanThan:
        '<p>Sinh viên tốt nghiệp loại Giỏi ngành Kỹ thuật Phần mềm với nền tảng vững về kiểm thử phần mềm Manual, API Testing (Postman) và đang mở rộng sang Automation Test với Playwright/TypeScript.</p>',
      danhSachFileCv: {
        create: [
          {
            tenFile: 'LeQuocBao_QA_Tester_CV.pdf',
            fileUrl:
              'https://res.cloudinary.com/demo/raw/upload/v1/cv/le-quoc-bao-tester.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'Enclave Đà Nẵng',
            viTri: 'QA Tester Intern',
            ngayBatDau: new Date('2024-06-01'),
            ngayKetThuc: new Date('2024-11-30'),
            moTaChiTiet:
              '<ul><li>Viết hơn 250 Test Case cho dự án Web E-learning và thực hiện Regression Test qua mỗi Sprint.</li><li>Kiểm thử API bằng Postman và truy vấn kiểm tra dữ liệu trực tiếp trên MySQL.</li></ul>',
          },
          {
            tenCongTy: 'Dự án Nghiên cứu Khoa học - ĐH Duy Tân',
            viTri: 'QA & Automation Member',
            ngayBatDau: new Date('2023-10-01'),
            ngayKetThuc: new Date('2024-05-15'),
            moTaChiTiet:
              '<ul><li>Xây dựng bộ kịch bản kiểm thử giao diện tự động cho hệ thống đăng ký tín chỉ bằng Playwright.</li><li>Báo cáo và phân loại hơn 60 lỗi giao diện và logic trước khi nghiệm thu.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học Duy Tân Đà Nẵng',
            nganhHoc: 'Kỹ thuật Phần mềm (CMU)',
            ngayBatDau: new Date('2021-09-01'),
            ngayTotNghiep: new Date('2025-05-30'),
            gpa: '3.71/4.0',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'ISTQB Certified Tester Foundation Level (CTFL)',
            toChucCap: 'ISTQB / VTB',
            ngayCap: new Date('2024-09-12'),
            ngayHetHan: null,
          },
          {
            tenChungChi: 'TOEIC 730',
            toChucCap: 'IIG Vietnam',
            ngayCap: new Date('2024-01-18'),
            ngayHetHan: new Date('2026-01-18'),
          },
        ],
      },
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'TOEIC 730' }],
      },
      portfolios: {
        create: [
          {
            tieuDe: 'Playwright E2E Automation Suite cho Website Tuyển dụng',
            moTa: 'Bộ script kiểm thử tự động các luồng Đăng nhập, Tìm kiếm việc làm và Nộp đơn CV.',
            projectUrl:
              'https://github.com/quocbao-qa/playwright-jobportal-tests',
          },
        ],
      },
      kyNangs: {
        create: [
          { maKyNang: getSkillId('Manual Testing'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('Automation Test'), mucDo: 'Khá' },
          { maKyNang: getSkillId('Agile/Scrum'), mucDo: 'Khá' },
          { maKyNang: getSkillId('MySQL'), mucDo: 'Khá' },
          { maKyNang: getSkillId('Git'), mucDo: 'Khá' },
        ],
      },
    },
  });

  // 5. Ứng viên DevOps & Cloud Engineer (5 năm exp)
  const uvKiet = await prisma.ungVien.create({
    data: {
      maTaiKhoan: tkUVKiet.maTaiKhoan,
      tenUngVien: 'Đặng Tuấn Kiệt',
      ngaySinh: new Date('1996-07-03'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 5,
      chuyenMon: 'Senior DevOps & Cloud Engineer (AWS / Kubernetes)',
      diaChi: 'Quận Đống Đa, Hà Nội',
      trangThaiPortfolio: 'Public',
      cvUrl:
        'https://res.cloudinary.com/demo/raw/upload/v1/cv/dang-tuan-kiet-devops.pdf',
      loaiCvMacDinh: 'ONLINE',
      gioiThieuBanThan:
        '<p>Kỹ sư DevOps / SRE với <strong>5 năm kinh nghiệm</strong> vận hành hạ tầng Cloud-Native trên AWS & GCP, tự động hóa CI/CD và tối ưu độ ổn định cho các hệ thống FinTech.</p>',
      danhSachFileCv: {
        create: [
          {
            tenFile: 'DangTuanKiet_Senior_DevOps_AWS_K8s.pdf',
            fileUrl:
              'https://res.cloudinary.com/demo/raw/upload/v1/cv/dang-tuan-kiet-devops.pdf',
          },
        ],
      },
      kinhNghiems: {
        create: [
          {
            tenCongTy: 'OneMount Group',
            viTri: 'Senior DevOps / SRE Engineer',
            ngayBatDau: new Date('2022-03-01'),
            ngayKetThuc: null,
            moTaChiTiet:
              '<ul><li>Quản trị cụm Kubernetes EKS với hơn 180 nodes phục vụ hệ sinh thái VinID & OneShop.</li><li>Thiết lập GitOps với ArgoCD và tối ưu hóa chi phí AWS Spot Instance giảm 28% hóa đơn Cloud hàng tháng.</li></ul>',
          },
          {
            tenCongTy: 'VCCorp',
            viTri: 'System & DevOps Engineer',
            ngayBatDau: new Date('2019-08-01'),
            ngayKetThuc: new Date('2022-02-28'),
            moTaChiTiet:
              '<ul><li>Triển khai pipeline CI/CD trên GitLab CI cho hơn 40 microservices.</li><li>Xây dựng hệ thống giám sát Prometheus, Grafana và ELK Stack.</li></ul>',
          },
        ],
      },
      hocVans: {
        create: [
          {
            tenTruong: 'Đại học Công nghệ - ĐHQGHN (UET)',
            nganhHoc: 'Mạng máy tính & Truyền thông',
            ngayBatDau: new Date('2014-09-01'),
            ngayTotNghiep: new Date('2019-06-20'),
            gpa: '3.38/4.0',
          },
        ],
      },
      chungChis: {
        create: [
          {
            tenChungChi: 'CKA: Certified Kubernetes Administrator',
            toChucCap: 'Cloud Native Computing Foundation (CNCF)',
            ngayCap: new Date('2023-11-10'),
            ngayHetHan: new Date('2026-11-10'),
          },
          {
            tenChungChi: 'AWS Certified Solutions Architect - Associate',
            toChucCap: 'Amazon Web Services',
            ngayCap: new Date('2023-04-05'),
            ngayHetHan: new Date('2026-04-05'),
          },
        ],
      },
      ngoaiNgus: {
        create: [{ tenNgoaiNgu: 'Tiếng Anh', trinhDo: 'TOEIC 800' }],
      },
      portfolios: {
        create: [
          {
            tieuDe: 'Terraform AWS EKS Production Blueprint',
            moTa: 'Mẫu Infrastructure as Code triển khai cụm EKS Multi-AZ, VPC chuẩn bảo mật và ArgoCD tự động.',
            projectUrl:
              'https://github.com/tuankiet-sre/aws-eks-terraform-blueprint',
          },
        ],
      },
      kyNangs: {
        create: [
          { maKyNang: getSkillId('AWS'), mucDo: 'Chuyên gia' },
          { maKyNang: getSkillId('Kubernetes'), mucDo: 'Chuyên gia' },
          { maKyNang: getSkillId('Docker'), mucDo: 'Chuyên gia' },
          { maKyNang: getSkillId('CI/CD'), mucDo: 'Giỏi' },
          { maKyNang: getSkillId('Python'), mucDo: 'Khá' },
          { maKyNang: getSkillId('Git'), mucDo: 'Giỏi' },
        ],
      },
    },
  });

  // =====================================================================
  // F. MÔ PHỎNG NỘP ĐƠN & PHỎNG VẤN (DONXINVIEC & LICHPHONGVAN - 10 Đơn)
  // =====================================================================
  console.log('📝 Đang tạo 10 Đơn ứng tuyển & Lịch phỏng vấn Google Meet...');

  // 1. [MoMo - HR Cường] Ứng viên Quân -> Senior Frontend Engineer (PHONG_VAN + Lịch Meet)
  const donMomo1 = await prisma.donXinViec.create({
    data: {
      maCongViec: jobMomoFrontend.maCongViec,
      maUngVien: uvQuan.maUngVien,
      trangThai: 'PHONG_VAN',
      ngayNop: daysAgo(3),
      fileCvUrl: uvQuan.cvUrl,
      chiTiet:
        '<p>Kính gửi anh Lê Hùng Cường, em có 3 năm kinh nghiệm ReactJS/Next.js và tối ưu Web Performance tại Tiki, rất mong được đồng hành cùng đội ngũ Super App MoMo.</p>',
      aiMatchScore: 91,
      aiAnalyzedAt: daysAgo(2),
      aiAnalysisJson: buildAiAnalysisJson({
        matchScore: 91,
        strengths: [
          'Khớp hoàn toàn stack ReactJS, Next.js, TypeScript và Tailwind CSS theo yêu cầu JD.',
          'Có 3 năm kinh nghiệm làm sản phẩm chịu tải lớn (500K+ lượt truy cập/ngày tại Tiki).',
          'Chủ động tối ưu LCP giảm 35% và thành thạo TanStack Query.',
        ],
        weaknesses: [
          'Chưa thể hiện rõ kinh nghiệm xây dựng Mini App trên nền tảng Mobile.',
        ],
        summary:
          'Ứng viên rất sáng giá cho vị trí Senior Frontend Engineer tại MoMo, đáp ứng vượt trội về kỹ năng React/Next.js và tư duy tối ưu hiệu năng.',
        breakdown: {
          skillsScore: 95,
          experienceScore: 90,
          educationScore: 88,
          domainScore: 89,
        },
      }),
    },
  });

  const interviewDate1 = new Date(now);
  interviewDate1.setDate(interviewDate1.getDate() + 2);
  interviewDate1.setHours(14, 0, 0, 0);

  await prisma.lichPhongVan.create({
    data: {
      maDon: donMomo1.maDon,
      thoiGian: interviewDate1,
      linkMeeting: 'https://meet.google.com/momo-fe-quan-2026',
      trangThaiLich: 'Đã lên lịch',
    },
  });

  // 2. [MoMo - HR Cường] Ứng viên Vy -> Middle Fullstack Engineer (PHU_HOP)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobMomoFullstack.maCongViec,
      maUngVien: uvVy.maUngVien,
      trangThai: 'PHU_HOP',
      ngayNop: daysAgo(2),
      fileCvUrl: uvVy.cvUrl,
      chiTiet:
        '<p>Chào anh Cường, em hiện đang làm Fullstack với NestJS, PostgreSQL và ReactJS tại Base.vn. Em xin gửi CV ứng tuyển vị trí Middle Fullstack Engineer tại MoMo ạ.</p>',
      aiMatchScore: 88,
      aiAnalyzedAt: daysAgo(1),
      aiAnalysisJson: buildAiAnalysisJson({
        matchScore: 88,
        strengths: [
          'Đúng chính xác 2 năm kinh nghiệm với NestJS, ReactJS, TypeScript và PostgreSQL.',
          'Đã triển khai hệ thống SaaS cho hơn 3.000 doanh nghiệp, phù hợp với Merchant Portal.',
          'Tốt nghiệp ĐH FPT GPA 3.62/4.0 cùng TOEIC 865.',
        ],
        weaknesses: [
          'Cần kiểm tra thêm mức độ chuyên sâu về xử lý Caching Redis phân tán.',
        ],
        summary:
          'Hồ sơ phù hợp cao (88/100) với vị trí Middle Fullstack Engineer tại MoMo, sẵn sàng mời phỏng vấn kỹ thuật.',
        breakdown: {
          skillsScore: 92,
          experienceScore: 86,
          educationScore: 90,
          domainScore: 84,
        },
      }),
    },
  });

  // 3. [MoMo - HR Cường] Ứng viên Kiệt -> Lead Cloud & DevOps Engineer (DA_XEM)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobMomoDevOps.maCongViec,
      maUngVien: uvKiet.maUngVien,
      trangThai: 'DA_XEM',
      ngayNop: daysAgo(1),
      fileCvUrl: uvKiet.cvUrl,
      chiTiet:
        '<p>Xin chào bộ phận Tuyển dụng MoMo, với 5 năm kinh nghiệm vận hành Kubernetes EKS và tối ưu chi phí AWS cho hệ thống FinTech/E-commerce, tôi mong muốn ứng tuyển vị trí Lead Cloud & DevOps Engineer.</p>',
      aiMatchScore: 94,
      aiAnalyzedAt: daysAgo(1),
      aiAnalysisJson: buildAiAnalysisJson({
        matchScore: 94,
        strengths: [
          'Đủ 5 năm kinh nghiệm SRE/DevOps đúng cấp bậc Lead, quản trị cụm K8s 180+ nodes.',
          'Sở hữu đồng thời hai chứng chỉ uy tín: CKA và AWS Solutions Architect.',
          'Kinh nghiệm thực tế giảm 28% chi phí Cloud trên AWS.',
        ],
        weaknesses: [
          'Vị trí đặt tại văn phòng Hà Nội, cần trao đổi xác nhận lịch làm việc trực tiếp.',
        ],
        summary:
          'Ứng viên xuất sắc cho vị trí Lead Cloud & DevOps Engineer với đầy đủ chứng chỉ và kinh nghiệm thực chiến quy mô lớn.',
        breakdown: {
          skillsScore: 96,
          experienceScore: 95,
          educationScore: 90,
          domainScore: 92,
        },
      }),
    },
  });

  // 4. [MoMo - HR Cường] Ứng viên Nam -> Middle Fullstack Engineer (CHO_DUYET)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobMomoFullstack.maCongViec,
      maUngVien: uvNam.maUngVien,
      trangThai: 'CHO_DUYET',
      ngayNop: daysAgo(0),
      fileCvUrl: uvNam.cvUrl,
      chiTiet:
        '<p>Chào anh Cường, tôi có 4 năm kinh nghiệm Backend FinTech tại Techcombank và muốn mở rộng sang vai trò Fullstack tại MoMo.</p>',
      aiMatchScore: 76,
      aiAnalyzedAt: now,
      aiAnalysisJson: buildAiAnalysisJson({
        matchScore: 76,
        strengths: [
          'Nền tảng FinTech, Microservices, PostgreSQL và Redis cực kỳ vững chắc (4 năm).',
          'Quen thuộc với các bài toán giao dịch thanh toán độ tin cậy cao.',
        ],
        weaknesses: [
          'Chuyên môn chính là Java Spring Boot, chưa có dự án thực tế với NestJS và ReactJS.',
        ],
        summary:
          'Ứng viên mạnh về nghiệp vụ FinTech và Backend nhưng cần đánh giá khả năng chuyển đổi sang stack Node.js/ReactJS.',
        breakdown: {
          skillsScore: 68,
          experienceScore: 88,
          educationScore: 85,
          domainScore: 90,
        },
      }),
    },
  });

  // 5. [FPT Software] Ứng viên Nam -> Senior Java Backend (PHONG_VAN + Lịch Meet)
  const donFPTJava = await prisma.donXinViec.create({
    data: {
      maCongViec: jobFPTJava.maCongViec,
      maUngVien: uvNam.maUngVien,
      trangThai: 'PHONG_VAN',
      ngayNop: daysAgo(4),
      fileCvUrl: uvNam.cvUrl,
      chiTiet:
        '<p>Kính gửi team tuyển dụng FPT Software, tôi gửi hồ sơ ứng tuyển vị trí Senior Java Backend Engineer cho dự án Global Banking.</p>',
      aiMatchScore: 95,
      aiAnalyzedAt: daysAgo(3),
      aiAnalysisJson: buildAiAnalysisJson({
        matchScore: 95,
        strengths: [
          '4 năm kinh nghiệm Java/Spring Boot đúng mảng Core Banking tại Techcombank.',
          'Có chứng chỉ Oracle Java SE 17 và AWS Developer.',
        ],
        weaknesses: ['Không có điểm yếu đáng kể so với yêu cầu JD.'],
        summary:
          'Ứng viên phù hợp gần như tuyệt đối với vị trí Senior Java Banking.',
        breakdown: {
          skillsScore: 96,
          experienceScore: 95,
          educationScore: 92,
          domainScore: 96,
        },
      }),
    },
  });

  const interviewDate2 = new Date(now);
  interviewDate2.setDate(interviewDate2.getDate() + 3);
  interviewDate2.setHours(9, 30, 0, 0);

  await prisma.lichPhongVan.create({
    data: {
      maDon: donFPTJava.maDon,
      thoiGian: interviewDate2,
      linkMeeting: 'https://meet.google.com/fpt-java-nam-2026',
      trangThaiLich: 'Đã lên lịch',
    },
  });

  // 6. [FPT Software] Ứng viên Bảo -> Fresher/Junior QA Tester (PHONG_VAN + Lịch Meet)
  const donFPTTester = await prisma.donXinViec.create({
    data: {
      maCongViec: jobFPTTester.maCongViec,
      maUngVien: uvBao.maUngVien,
      trangThai: 'PHONG_VAN',
      ngayNop: daysAgo(3),
      fileCvUrl: uvBao.cvUrl,
      chiTiet:
        '<p>Chào anh/chị HR FPT Đà Nẵng, em đã có chứng chỉ ISTQB CTFL và kinh nghiệm thực tập QA 6 tháng tại Enclave, rất mong được tham gia team QA của FPT Software.</p>',
      aiMatchScore: 90,
      aiAnalyzedAt: daysAgo(2),
      aiAnalysisJson: buildAiAnalysisJson({
        matchScore: 90,
        strengths: [
          'Sở hữu chứng chỉ ISTQB Foundation và GPA 3.71/4.0 tại ĐH Duy Tân Đà Nẵng.',
          'Đã có kinh nghiệm viết 250+ Test Case và Automation Test với Playwright.',
        ],
        weaknesses: ['Kinh nghiệm dự án Enterprise thực tế còn ở mức Fresher.'],
        summary: 'Ứng viên Fresher QA cực kỳ tiềm năng tại khu vực Đà Nẵng.',
        breakdown: {
          skillsScore: 92,
          experienceScore: 86,
          educationScore: 94,
          domainScore: 88,
        },
      }),
    },
  });

  const interviewDate3 = new Date(now);
  interviewDate3.setDate(interviewDate3.getDate() + 4);
  interviewDate3.setHours(15, 0, 0, 0);

  await prisma.lichPhongVan.create({
    data: {
      maDon: donFPTTester.maDon,
      thoiGian: interviewDate3,
      linkMeeting: 'https://meet.google.com/fpt-qa-bao-2026',
      trangThaiLich: 'Đã lên lịch',
    },
  });

  // 7. [NAB] Ứng viên Vy -> Senior Fullstack React/Node/AWS (PHU_HOP)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobNABFullstack.maCongViec,
      maUngVien: uvVy.maUngVien,
      trangThai: 'PHU_HOP',
      ngayNop: daysAgo(2),
      fileCvUrl: uvVy.cvUrl,
      chiTiet:
        '<p>Dear NAB Talent Team, I am excited to apply for the Fullstack Software Engineer position with my experience in TypeScript, ReactJS, Node.js, and AWS.</p>',
    },
  });

  // 8. [VNG] Ứng viên Quân -> Intern Frontend ReactJS (TU_CHOI - đã quá cấp bậc Senior)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobVNGNode.maCongViec,
      maUngVien: uvBao.maUngVien,
      trangThai: 'TU_CHOI',
      ngayNop: daysAgo(5),
      fileCvUrl: uvBao.cvUrl,
      chiTiet:
        '<p>Em xin ứng tuyển thử sức ở vị trí Backend Node.js tại VNG Cloud ạ.</p>',
    },
  });

  // 9. [Shopee] Ứng viên Quân -> Middle Frontend Engineer (DA_XEM)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobShopeeVue.maCongViec,
      maUngVien: uvQuan.maUngVien,
      trangThai: 'DA_XEM',
      ngayNop: daysAgo(2),
      fileCvUrl: uvQuan.cvUrl,
      chiTiet:
        '<p>Chào Shopee Careers, tôi có 3 năm kinh nghiệm Frontend E-commerce với ReactJS/TypeScript và sẵn sàng chuyển đổi nhanh sang Vue.js.</p>',
    },
  });

  // 10. [Viettel Solutions] Ứng viên Kiệt -> Middle Java Spring Boot (TU_CHOI - sai chuyên môn)
  await prisma.donXinViec.create({
    data: {
      maCongViec: jobViettelJava.maCongViec,
      maUngVien: uvKiet.maUngVien,
      trangThai: 'TU_CHOI',
      ngayNop: daysAgo(6),
      fileCvUrl: uvKiet.cvUrl,
      chiTiet:
        '<p>Tôi ứng tuyển tham gia hạ tầng Smart City của Viettel Solutions.</p>',
    },
  });

  // =====================================================================
  // G. GÓI DỊCH VỤ QUẢNG CÁO (GOIQUANGCAO, MUAQUANGCAO & THANHTOAN)
  // =====================================================================
  console.log('💳 Đang tạo Gói quảng cáo 4 cấp & Giao dịch thanh toán...');

  const pkgBasic = await prisma.goiQuangCao.create({
    data: {
      tieuDe: 'Gói Cơ Bản',
      loaiQuangCao: 'BASIC',
      gia: 500000,
      thoiGianHieuLuc: 14,
      soLuotDangTin: 1,
      capDoUuTien: 1,
      loaiHuyHieu: 'BASIC',
      moTaNgan: 'Phù hợp nhu cầu tuyển dụng nhanh cho 1 vị trí IT cụ thể.',
      quyenLoiJson: JSON.stringify([
        '1 tin tuyển dụng hiển thị trên sàn',
        'Thời gian hiển thị tin 14 ngày',
        'Tiếp cận danh sách ứng viên nộp hồ sơ chuẩn ATS',
        'Bộ lọc sàng lọc ứng viên cơ bản (kỹ năng, địa điểm)',
        'Nhận thông báo Email ngay khi có ứng viên nộp đơn',
      ]),
      ngayTao: daysAgo(60),
    },
  });

  const pkgStandard = await prisma.goiQuangCao.create({
    data: {
      tieuDe: 'Gói Tiêu Chuẩn',
      loaiQuangCao: 'HOT',
      gia: 1800000,
      thoiGianHieuLuc: 30,
      soLuotDangTin: 3,
      capDoUuTien: 2,
      loaiHuyHieu: 'HOT',
      moTaNgan: 'Tối ưu chi phí tuyển dụng đa vị trí với huy hiệu nổi bật.',
      quyenLoiJson: JSON.stringify([
        '3 tin tuyển dụng hiển thị trên sàn',
        'Thời gian hiển thị tin 30 ngày',
        'Huy hiệu "HOT JOB" nổi bật trên trang tìm kiếm việc làm',
        'Ưu tiên hiển thị trên các tin tuyển dụng thông thường',
        'Đặt lịch phỏng vấn Google Meet trực tiếp trên nền tảng',
      ]),
      ngayTao: daysAgo(60),
    },
  });

  const pkgVip = await prisma.goiQuangCao.create({
    data: {
      tieuDe: 'Gói VIP Đẩy Tin',
      loaiQuangCao: 'SUPER_HOT',
      gia: 3500000,
      thoiGianHieuLuc: 45,
      soLuotDangTin: 5,
      capDoUuTien: 3,
      loaiHuyHieu: 'SUPER_HOT',
      moTaNgan: 'Thu hút ứng viên chất lượng cao nhờ AI Match & Auto Refresh.',
      quyenLoiJson: JSON.stringify([
        '5 tin tuyển dụng hiển thị trên sàn',
        'Thời gian hiển thị tin 45 ngày',
        'Huy hiệu "SUPER HOT" cùng nền thẻ việc làm nổi bật',
        'Tự động làm mới (Auto Refresh) lên đầu trang mỗi thứ Hai',
        'Xếp hạng CV bằng AI Match Score Ranking cho mọi hồ sơ',
      ]),
      ngayTao: daysAgo(60),
    },
  });

  const pkgDiamond = await prisma.goiQuangCao.create({
    data: {
      tieuDe: 'Gói Kim Cương / Doanh nghiệp',
      loaiQuangCao: 'DIAMOND',
      gia: 8000000,
      thoiGianHieuLuc: 60,
      soLuotDangTin: 10,
      capDoUuTien: 4,
      loaiHuyHieu: 'DIAMOND',
      moTaNgan: 'Giải pháp thương hiệu tuyển dụng toàn diện cấp doanh nghiệp.',
      quyenLoiJson: JSON.stringify([
        '10 tin tuyển dụng hiển thị trên sàn',
        'Thời gian hiển thị tin 60 ngày',
        'Banner "Nhà Tuyển Dụng Nổi Bật" ở đầu trang Tìm việc (/jobs)',
        'Hiển thị Logo tại mục "Nhà tuyển dụng hàng đầu" Trang chủ',
        'Không giới hạn tài khoản HR phụ trong cùng doanh nghiệp',
      ]),
      ngayTao: daysAgo(60),
    },
  });

  const endIn14Days = new Date(now);
  endIn14Days.setDate(endIn14Days.getDate() + 14);

  const endIn30Days = new Date(now);
  endIn30Days.setDate(endIn30Days.getDate() + 30);

  const endIn45Days = new Date(now);
  endIn45Days.setDate(endIn45Days.getDate() + 45);

  const endIn60Days = new Date(now);
  endIn60Days.setDate(endIn60Days.getDate() + 60);

  // Giao dịch 1: FPT Software mua Gói Kim Cương / Doanh nghiệp
  const buyFPT = await prisma.muaQuangCao.create({
    data: {
      tieuDe: 'Chiến dịch Tuyển dụng Quý II - FPT Software',
      giaTaiThoiDiemMua: pkgDiamond.gia,
      soLuotConLai: 7,
      ngayBatDau: daysAgo(15),
      ngayKetThuc: endIn60Days,
      ngayMua: daysAgo(15),
      trangThai: 'Đang chạy',
      maNTD: hrFPT.maNTD,
      maGoi: pkgDiamond.maGoi,
    },
  });

  await prisma.thanhToan.create({
    data: {
      ngayThanhToan: daysAgo(15),
      soTienThanhToan: pkgDiamond.gia,
      phuongThucTT: 'VNPay QR Doanh nghiệp',
      trangThaiTT: 'Thành công',
      ghiChu: 'Thanh toán Gói Kim Cương / Doanh nghiệp - FPT Software',
      maGiaoDichDoiTac: 'VNPAY_FPT_20260401',
      maMua: buyFPT.maMua,
    },
  });

  // Giao dịch 2: VNG Corporation mua Gói VIP Đẩy Tin
  const buyVNG = await prisma.muaQuangCao.create({
    data: {
      tieuDe: 'Chiến dịch Đẩy Tin ZaloPay - VNG Corporation',
      giaTaiThoiDiemMua: pkgVip.gia,
      soLuotConLai: 2,
      ngayBatDau: daysAgo(10),
      ngayKetThuc: endIn45Days,
      ngayMua: daysAgo(10),
      trangThai: 'Đang chạy',
      maNTD: hrVNG.maNTD,
      maGoi: pkgVip.maGoi,
    },
  });

  await prisma.thanhToan.create({
    data: {
      ngayThanhToan: daysAgo(10),
      soTienThanhToan: pkgVip.gia,
      phuongThucTT: 'Chuyển khoản VietQR',
      trangThaiTT: 'Thành công',
      ghiChu: 'Thanh toán Gói VIP Đẩy Tin - VNG Corporation',
      maGiaoDichDoiTac: 'VNPAY_VNG_20260405',
      maMua: buyVNG.maMua,
    },
  });

  // Giao dịch 3: MoMo (HR Lê Hùng Cường) mua Gói Tiêu Chuẩn
  const buyMomo = await prisma.muaQuangCao.create({
    data: {
      tieuDe: 'Chiến dịch MoMo Tech Hiring 2026',
      giaTaiThoiDiemMua: pkgStandard.gia,
      soLuotConLai: 2,
      ngayBatDau: daysAgo(5),
      ngayKetThuc: endIn30Days,
      ngayMua: daysAgo(5),
      trangThai: 'Đang chạy',
      maNTD: hrMomoCuong.maNTD,
      maGoi: pkgStandard.maGoi,
    },
  });

  await prisma.thanhToan.create({
    data: {
      ngayThanhToan: daysAgo(5),
      soTienThanhToan: pkgStandard.gia,
      phuongThucTT: 'MoMo Business',
      trangThaiTT: 'Thành công',
      ghiChu: 'Thanh toán Gói Tiêu Chuẩn - MoMo',
      maGiaoDichDoiTac: 'MOMO_BIZ_20260410',
      maMua: buyMomo.maMua,
    },
  });

  // Giao dịch 4: Shopee Vietnam mua Gói Cơ Bản
  const buyShopee = await prisma.muaQuangCao.create({
    data: {
      tieuDe: 'Chiến dịch Tuyển Frontend Shopee',
      giaTaiThoiDiemMua: pkgBasic.gia,
      soLuotConLai: 0,
      ngayBatDau: daysAgo(3),
      ngayKetThuc: endIn14Days,
      ngayMua: daysAgo(3),
      trangThai: 'Đang chạy',
      maNTD: hrShopee.maNTD,
      maGoi: pkgBasic.maGoi,
    },
  });

  await prisma.thanhToan.create({
    data: {
      ngayThanhToan: daysAgo(3),
      soTienThanhToan: pkgBasic.gia,
      phuongThucTT: 'VNPay QR',
      trangThaiTT: 'Thành công',
      ghiChu: 'Thanh toán Gói Cơ Bản - Shopee Vietnam',
      maGiaoDichDoiTac: 'VNPAY_SHOPEE_20260412',
      maMua: buyShopee.maMua,
    },
  });

  // =====================================================================
  // H. DỮ LIỆU BỔ TRỢ (Theo dõi công ty, Đánh giá, Thông báo, Bài viết)
  // =====================================================================
  await prisma.theoDoiCongTy.createMany({
    data: [
      { maUngVien: uvQuan.maUngVien, maCongTy: ctyMomo.maCongTy },
      { maUngVien: uvQuan.maUngVien, maCongTy: ctyNAB.maCongTy },
      { maUngVien: uvVy.maUngVien, maCongTy: ctyMomo.maCongTy },
      { maUngVien: uvNam.maUngVien, maCongTy: ctyFPT.maCongTy },
      { maUngVien: uvKiet.maUngVien, maCongTy: ctyVNG.maCongTy },
    ],
  });

  await prisma.danhGia.createMany({
    data: [
      {
        rating: 4.8,
        tieuDe: 'Môi trường FinTech cực kỳ năng động và học hỏi nhiều',
        noiDung:
          'Đội ngũ Tech giỏi, sẵn sàng chia sẻ kiến thức về Microservices và hiệu năng Web. Chính sách Hybrid rất thoải mái.',
        ngayDanhGia: daysAgo(12),
        maDoiTuongDuocDanhGia: ctyMomo.maCongTy,
        loaiDoiTuong: 'CONGTY',
        maNguoiDanhGia: tkUVQuan.maTaiKhoan,
      },
      {
        rating: 4.9,
        tieuDe: 'Văn hóa Engineering chuẩn quốc tế, ít OT',
        noiDung:
          'Quy trình Agile bài bản, làm việc trực tiếp với chuyên gia Úc giúp nâng trình tiếng Anh và kỹ năng kiến trúc hệ thống.',
        ngayDanhGia: daysAgo(9),
        maDoiTuongDuocDanhGia: ctyNAB.maCongTy,
        loaiDoiTuong: 'CONGTY',
        maNguoiDanhGia: tkUVVy.maTaiKhoan,
      },
      {
        rating: 4.7,
        tieuDe: 'Campus đẹp, đồng nghiệp thân thiện',
        noiDung:
          'Nhiều dự án lớn để thử sức, đặc biệt phù hợp với các bạn thích bài toán High Traffic.',
        ngayDanhGia: daysAgo(7),
        maDoiTuongDuocDanhGia: ctyVNG.maCongTy,
        loaiDoiTuong: 'CONGTY',
        maNguoiDanhGia: tkUVKiet.maTaiKhoan,
      },
    ],
  });

  await prisma.baiViet.createMany({
    data: [
      {
        tieuDe: 'Cách MoMo tối ưu Microfrontend phục vụ 31 triệu người dùng',
        anhBiaUrl:
          'https://res.cloudinary.com/dbvlsf9bi/image/upload/v1776325179/vng_st3yi1.jpg',
        noiDung:
          '<p>Chia sẻ kiến trúc triển khai ReactJS & Next.js kết hợp CDN giúp giảm độ trễ tải Mini App trên toàn quốc xuống dưới 400ms.</p>',
        maCongTy: ctyMomo.maCongTy,
      },
      {
        tieuDe: 'FPT Software đẩy mạnh đào tạo kỹ sư AI & Automotive toàn cầu',
        anhBiaUrl:
          'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
        noiDung:
          '<p>Hơn 5.000 kỹ sư FPT Software hoàn thành chứng chỉ Cloud & Generative AI trong năm 2026 để đáp ứng nhu cầu chuyển đổi số từ Mỹ và Nhật Bản.</p>',
        maCongTy: ctyFPT.maCongTy,
      },
    ],
  });

  await prisma.thongBao.createMany({
    data: [
      {
        tieuDe: '📩 Ứng viên mới ứng tuyển vào MoMo',
        noiDung:
          'Ứng viên Trần Thảo Vy và Nguyễn Minh Quân vừa nộp hồ sơ cho các vị trí Engineering tại MoMo.',
        trangThai: 'CHUA_DOC',
        maTaiKhoan: tkHRCuong.maTaiKhoan,
      },
      {
        tieuDe: '📅 Lịch phỏng vấn mới từ MoMo',
        noiDung:
          'HR Lê Hùng Cường đã gửi lời mời phỏng vấn vị trí Senior Frontend Engineer qua Google Meet.',
        trangThai: 'CHUA_DOC',
        maTaiKhoan: tkUVQuan.maTaiKhoan,
      },
      {
        tieuDe: '🛡️ Chào mừng Quản trị viên',
        noiDung: `Hệ thống đã khởi tạo hoàn chỉnh dữ liệu cho ${tkAdmin.email}.`,
        trangThai: 'DA_DOC',
        maTaiKhoan: tkAdmin.maTaiKhoan,
      },
    ],
  });

  console.log('🎉 SEED THÀNH CÔNG RỰC RỠ!');
}

main()
  .catch((error: unknown) => {
    console.error('❌ Lỗi trong quá trình Seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
