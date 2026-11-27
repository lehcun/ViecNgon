import type { PrismaClient } from '@prisma/client';

function utcDate(
  year: number,
  month: number,
  day: number,
  hour = 9,
  minute = 15,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

interface SeedCandidateSpec {
  name: string;
  email: string;
  phone: string;
  city: string;
  specialty: string;
  years: number;
  createdAt: Date;
  status?: 'HOATDONG' | 'KHOA';
  skills: string[];
}

const CANDIDATE_SPECS: SeedCandidateSpec[] = [
  // 2023 (3)
  {
    name: 'Lê Hoàng Minh',
    email: 'minh.le.2023@gmail.com',
    phone: '0903112201',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Backend Java / Spring Boot',
    years: 5,
    createdAt: utcDate(2023, 4, 12, 8, 30),
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
  },
  {
    name: 'Nguyễn Thị Thu Hà',
    email: 'thuha.qa.2023@gmail.com',
    phone: '0903112202',
    city: 'Hà Nội',
    specialty: 'QA Automation Engineer',
    years: 4,
    createdAt: utcDate(2023, 8, 19, 10, 10),
    skills: ['Playwright', 'TypeScript', 'Postman'],
  },
  {
    name: 'Trần Quốc Khánh',
    email: 'khanh.tran.2023@gmail.com',
    phone: '0903112203',
    city: 'Đà Nẵng',
    specialty: 'Fullstack Node.js / React',
    years: 4,
    createdAt: utcDate(2023, 11, 5, 14, 20),
    skills: ['Node.js', 'React', 'TypeScript', 'MongoDB'],
  },
  // 2024 (6)
  {
    name: 'Phạm Đức Anh',
    email: 'ducanh.fe.2024@gmail.com',
    phone: '0903112204',
    city: 'Hà Nội',
    specialty: 'Frontend React / Next.js',
    years: 3,
    createdAt: utcDate(2024, 2, 14, 9, 0),
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Võ Thị Ngọc Mai',
    email: 'ngocmai.ba.2024@gmail.com',
    phone: '0903112205',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Business Analyst IT',
    years: 3,
    createdAt: utcDate(2024, 4, 22, 11, 15),
    skills: ['SQL', 'Figma', 'Jira'],
  },
  {
    name: 'Đỗ Thanh Tùng',
    email: 'tung.devops.2024@gmail.com',
    phone: '0903112206',
    city: 'TP. Hồ Chí Minh',
    specialty: 'DevOps / Cloud Engineer',
    years: 4,
    createdAt: utcDate(2024, 6, 8, 15, 40),
    skills: ['AWS', 'Docker', 'Kubernetes', 'Linux'],
  },
  {
    name: 'Bùi Hải Đăng',
    email: 'haidang.mobile.2024@gmail.com',
    phone: '0903112207',
    city: 'Đà Nẵng',
    specialty: 'Mobile Flutter Developer',
    years: 3,
    createdAt: utcDate(2024, 8, 17, 8, 50),
    skills: ['Flutter', 'Dart', 'Firebase'],
  },
  {
    name: 'Huỳnh Gia Huy',
    email: 'giahuy.be.2024@gmail.com',
    phone: '0903112208',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Backend NestJS / Go',
    years: 4,
    createdAt: utcDate(2024, 10, 3, 13, 25),
    skills: ['NestJS', 'Go', 'PostgreSQL', 'Redis'],
  },
  {
    name: 'Ngô Phương Linh',
    email: 'phuonglinh.data.2024@gmail.com',
    phone: '0903112209',
    city: 'Hà Nội',
    specialty: 'Data Engineer',
    years: 3,
    createdAt: utcDate(2024, 12, 11, 16, 5),
    skills: ['Python', 'SQL', 'AWS'],
  },
  // 2025 (9)
  {
    name: 'Đinh Văn Hùng',
    email: 'hung.dinh.2025@gmail.com',
    phone: '0903112210',
    city: 'Hà Nội',
    specialty: 'Senior .NET Backend',
    years: 6,
    createdAt: utcDate(2025, 1, 20, 9, 10),
    skills: ['C#', '.NET', 'SQL Server', 'Docker'],
  },
  {
    name: 'Lý Mỹ Duyên',
    email: 'myduyen.uiux.2025@gmail.com',
    phone: '0903112211',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Product Designer (UI/UX)',
    years: 3,
    createdAt: utcDate(2025, 3, 7, 10, 45),
    skills: ['Figma', 'Tailwind CSS', 'React'],
  },
  {
    name: 'Trương Minh Triết',
    email: 'triet.ai.2025@gmail.com',
    phone: '0903112212',
    city: 'TP. Hồ Chí Minh',
    specialty: 'AI / Machine Learning Engineer',
    years: 3,
    createdAt: utcDate(2025, 4, 18, 14, 0),
    skills: ['Python', 'Docker', 'AWS'],
  },
  {
    name: 'Phan Anh Tuấn',
    email: 'anhtuan.fe.2025@gmail.com',
    phone: '0903112213',
    city: 'Đà Nẵng',
    specialty: 'Frontend Vue / React',
    years: 2,
    createdAt: utcDate(2025, 5, 29, 8, 20),
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Nguyễn Ngọc Bảo Trâm',
    email: 'baotram.qa.2025@gmail.com',
    phone: '0903112214',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Senior QA Manual & API',
    years: 4,
    createdAt: utcDate(2025, 7, 14, 11, 30),
    skills: ['Playwright', 'SQL', 'Postman'],
  },
  {
    name: 'Hoàng Nhật Nam',
    email: 'nhatnam.be.2025@gmail.com',
    phone: '0903112215',
    city: 'Hà Nội',
    specialty: 'Backend Java Microservices',
    years: 5,
    createdAt: utcDate(2025, 8, 25, 15, 10),
    skills: ['Java', 'Spring Boot', 'Kafka', 'Kubernetes'],
  },
  {
    name: 'Vũ Quốc Việt',
    email: 'quocviet.sec.2025@gmail.com',
    phone: '0903112216',
    city: 'Hà Nội',
    specialty: 'Cyber Security Engineer',
    years: 4,
    createdAt: utcDate(2025, 9, 19, 9, 55),
    skills: ['Linux', 'AWS', 'Docker'],
  },
  {
    name: 'Đoàn Thị Kim Ngân',
    email: 'kimngan.fs.2025@gmail.com',
    phone: '0903112217',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Fullstack TypeScript',
    years: 3,
    createdAt: utcDate(2025, 11, 3, 13, 40),
    skills: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL'],
  },
  {
    name: 'Tạ Quang Huy',
    email: 'quanghuy.spam.2025@gmail.com',
    phone: '0903112218',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Junior Web Developer',
    years: 1,
    createdAt: utcDate(2025, 12, 16, 17, 0),
    status: 'KHOA',
    skills: ['JavaScript', 'React'],
  },
  // 2026 — Jan to Nov (24 candidates, upward curve)
  {
    name: 'Nguyễn Thành Đạt',
    email: 'thanhdat.202601@gmail.com',
    phone: '0914001001',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Backend Node.js / NestJS',
    years: 3,
    createdAt: utcDate(2026, 1, 12, 9, 15),
    skills: ['Node.js', 'NestJS', 'TypeScript', 'PostgreSQL'],
  },
  {
    name: 'Trần Hải Yến',
    email: 'haiyen.202602@gmail.com',
    phone: '0914001002',
    city: 'Hà Nội',
    specialty: 'Frontend Next.js Developer',
    years: 2,
    createdAt: utcDate(2026, 2, 18, 10, 20),
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Lê Trung Kiên',
    email: 'trungkien.202603@gmail.com',
    phone: '0914001003',
    city: 'Đà Nẵng',
    specialty: 'Java Backend Developer',
    years: 3,
    createdAt: utcDate(2026, 3, 9, 14, 10),
    skills: ['Java', 'Spring Boot', 'SQL Server'],
  },
  {
    name: 'Phạm Thị Lan Anh',
    email: 'lananh.202604a@gmail.com',
    phone: '0914001004',
    city: 'Hà Nội',
    specialty: 'QA Automation / Playwright',
    years: 3,
    createdAt: utcDate(2026, 4, 6, 8, 45),
    skills: ['Playwright', 'TypeScript', 'Docker'],
  },
  {
    name: 'Võ Hoàng Long',
    email: 'hoanglong.202604b@gmail.com',
    phone: '0914001005',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Cloud DevOps Engineer',
    years: 4,
    createdAt: utcDate(2026, 4, 21, 15, 30),
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
  },
  {
    name: 'Đặng Minh Thư',
    email: 'minhthu.202605a@gmail.com',
    phone: '0914001006',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Data Analyst / BI',
    years: 2,
    createdAt: utcDate(2026, 5, 8, 9, 0),
    skills: ['Python', 'SQL', 'PostgreSQL'],
  },
  {
    name: 'Bùi Xuân Trường',
    email: 'xuantruong.202605b@gmail.com',
    phone: '0914001007',
    city: 'Hà Nội',
    specialty: 'Senior Go Backend',
    years: 5,
    createdAt: utcDate(2026, 5, 24, 11, 20),
    skills: ['Go', 'Redis', 'Docker', 'Kubernetes'],
  },
  {
    name: 'Hồ Gia Bảo',
    email: 'giabao.202606a@gmail.com',
    phone: '0914001008',
    city: 'Đà Nẵng',
    specialty: 'Mobile React Native',
    years: 3,
    createdAt: utcDate(2026, 6, 10, 10, 15),
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    name: 'Nguyễn Quỳnh Như',
    email: 'quynhnhu.202606b@gmail.com',
    phone: '0914001009',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Fullstack Next.js / NestJS',
    years: 3,
    createdAt: utcDate(2026, 6, 26, 16, 0),
    skills: ['Next.js', 'NestJS', 'TypeScript', 'SQL Server'],
  },
  {
    name: 'Trần Mạnh Cường',
    email: 'manhcuong.202607a@gmail.com',
    phone: '0914001010',
    city: 'Hà Nội',
    specialty: 'Backend Python / FastAPI',
    years: 4,
    createdAt: utcDate(2026, 7, 7, 9, 40),
    skills: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    name: 'Lê Thị Thanh Tâm',
    email: 'thanhtam.202607b@gmail.com',
    phone: '0914001011',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Frontend React Senior',
    years: 5,
    createdAt: utcDate(2026, 7, 23, 13, 15),
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Phạm Hữu Nghĩa',
    email: 'huunghia.202608a@gmail.com',
    phone: '0914001012',
    city: 'TP. Hồ Chí Minh',
    specialty: 'SRE / Platform Engineer',
    years: 5,
    createdAt: utcDate(2026, 8, 5, 8, 30),
    skills: ['Kubernetes', 'AWS', 'Docker', 'Linux'],
  },
  {
    name: 'Vũ Thị Khánh Linh',
    email: 'khanhlinh.202608b@gmail.com',
    phone: '0914001013',
    city: 'Hà Nội',
    specialty: 'AI / LLM Application Engineer',
    years: 3,
    createdAt: utcDate(2026, 8, 16, 11, 45),
    skills: ['Python', 'TypeScript', 'Next.js'],
  },
  {
    name: 'Đỗ Hoàng Phúc',
    email: 'hoangphuc.202608c@gmail.com',
    phone: '0914001014',
    city: 'Đà Nẵng',
    specialty: 'Backend Java Spring',
    years: 4,
    createdAt: utcDate(2026, 8, 28, 15, 20),
    skills: ['Java', 'Spring Boot', 'Redis', 'Docker'],
  },
  {
    name: 'Nguyễn Văn Khoa',
    email: 'vankhoa.202609a@gmail.com',
    phone: '0914001015',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Mobile iOS / Flutter',
    years: 4,
    createdAt: utcDate(2026, 9, 4, 9, 10),
    skills: ['Flutter', 'TypeScript', 'Firebase'],
  },
  {
    name: 'Trần Ngọc Hân',
    email: 'ngochan.202609b@gmail.com',
    phone: '0914001016',
    city: 'Hà Nội',
    specialty: 'Product Owner / IT BA',
    years: 4,
    createdAt: utcDate(2026, 9, 15, 14, 30),
    skills: ['SQL', 'Jira', 'Figma'],
  },
  {
    name: 'Lương Gia Thịnh',
    email: 'giathinh.202609c@gmail.com',
    phone: '0914001017',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Fullstack TypeScript Engineer',
    years: 4,
    createdAt: utcDate(2026, 9, 27, 16, 50),
    skills: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'],
  },
  {
    name: 'Mai Đức Thắng',
    email: 'ducthang.202610a@gmail.com',
    phone: '0914001018',
    city: 'Hà Nội',
    specialty: 'Senior Backend .NET / Azure',
    years: 6,
    createdAt: utcDate(2026, 10, 6, 8, 55),
    skills: ['C#', '.NET', 'SQL Server', 'Docker'],
  },
  {
    name: 'Châu Thị Bảo Ngọc',
    email: 'baongoc.202610b@gmail.com',
    phone: '0914001019',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Frontend TypeScript / Design System',
    years: 3,
    createdAt: utcDate(2026, 10, 17, 10, 40),
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
  },
  {
    name: 'Tống Nhật Minh',
    email: 'nhatminh.202610c@gmail.com',
    phone: '0914001020',
    city: 'Đà Nẵng',
    specialty: 'Data Engineer / Spark',
    years: 3,
    createdAt: utcDate(2026, 10, 26, 13, 15),
    skills: ['Python', 'SQL', 'AWS', 'Docker'],
  },
  {
    name: 'Nguyễn Hữu Phước',
    email: 'huuphuoc.202611a@gmail.com',
    phone: '0914001021',
    city: 'TP. Hồ Chí Minh',
    specialty: 'Senior Fullstack Engineer',
    years: 5,
    createdAt: utcDate(2026, 11, 3, 9, 20),
    skills: ['TypeScript', 'Next.js', 'NestJS', 'Docker'],
  },
  {
    name: 'Lê Minh Châu',
    email: 'minhchau.202611b@gmail.com',
    phone: '0914001022',
    city: 'Hà Nội',
    specialty: 'AI / Machine Learning Engineer',
    years: 4,
    createdAt: utcDate(2026, 11, 11, 11, 0),
    skills: ['Python', 'AWS', 'Docker', 'PostgreSQL'],
  },
  {
    name: 'Phan Quốc Bảo',
    email: 'quocbao.202611c@gmail.com',
    phone: '0914001023',
    city: 'TP. Hồ Chí Minh',
    specialty: 'DevOps & Security Engineer',
    years: 4,
    createdAt: utcDate(2026, 11, 19, 14, 45),
    skills: ['Kubernetes', 'AWS', 'Docker', 'Linux'],
  },
  {
    name: 'Trịnh Mỹ Linh',
    email: 'mylinh.202611d@gmail.com',
    phone: '0914001024',
    city: 'Đà Nẵng',
    specialty: 'Frontend React / Next.js',
    years: 2,
    createdAt: utcDate(2026, 11, 24, 10, 10),
    status: 'KHOA',
    skills: ['React', 'Next.js', 'TypeScript'],
  },
];

export async function seedRealisticExpansion(
  prisma: PrismaClient,
  hashedPassword: string,
  adminAccountId: string,
): Promise<void> {
  console.log(
    '📈 Đang mở rộng dữ liệu lịch sử thực tế (2023–2026: Users, HR, Jobs, Applications, Payments)...',
  );

  // 1. Rải lại ngayTao cho các tài khoản lõi để bảng /admin/users tự nhiên hơn
  const coreBackdates: Array<{ email: string; date: Date }> = [
    { email: 'hr.fpt@fptsoftware.com', date: utcDate(2024, 3, 10, 8, 30) },
    { email: 'hr.vng@vng.com.vn', date: utcDate(2024, 7, 15, 9, 0) },
    { email: 'hr.shopee@shopee.com', date: utcDate(2025, 2, 18, 10, 0) },
    { email: 'hr.nab@nab.com.au', date: utcDate(2025, 6, 12, 9, 30) },
    { email: 'hr.viettel@viettel.com.vn', date: utcDate(2025, 10, 20, 14, 0) },
    { email: 'lehcuong2907@gmail.com', date: utcDate(2026, 11, 20, 10, 15) },
    { email: 'nam.pham.java@gmail.com', date: utcDate(2026, 3, 14, 9, 20) },
    { email: 'quan.nguyen.fe@gmail.com', date: utcDate(2026, 5, 19, 11, 5) },
    { email: 'bao.le.qa@gmail.com', date: utcDate(2026, 7, 8, 15, 30) },
    { email: 'vy.tran.fs@gmail.com', date: utcDate(2026, 9, 12, 8, 45) },
    { email: 'kiet.dang.devops@gmail.com', date: utcDate(2026, 10, 21, 13, 10) },
  ];

  for (const item of coreBackdates) {
    await prisma.taiKhoan.updateMany({
      where: { email: item.email },
      data: { ngayTao: item.date },
    });
  }

  // Lấy từ điển kỹ năng, công ty, gói quảng cáo hiện có
  const [allSkills, companies, packages] = await Promise.all([
    prisma.kyNang.findMany(),
    prisma.congTy.findMany({
      include: { nhaTuyenDungs: true, chiNhanhs: true },
    }),
    prisma.goiQuangCao.findMany({ orderBy: { capDoUuTien: 'asc' } }),
  ]);

  const skillByName = new Map(
    allSkills.map((s) => [s.tenKyNang.toLowerCase(), s.maKyNang]),
  );

  // 2. Tạo 42 Ứng viên nền (TaiKhoan + UngVien + UngVienKyNang) rải từ 2023–2026
  const createdCandidateIds: string[] = [];
  const createdCandidateAccountIds: string[] = [];
  for (const spec of CANDIDATE_SPECS) {
    const account = await prisma.taiKhoan.create({
      data: {
        email: spec.email,
        tenNguoiDung: spec.name,
        matKhau: hashedPassword,
        provider: 'LOCAL',
        sdt: spec.phone,
        vaiTro: 'UNGVIEN',
        trangThai: spec.status ?? 'HOATDONG',
        ngayTao: spec.createdAt,
        ngayCapNhat: spec.createdAt,
      },
    });

    const ungVien = await prisma.ungVien.create({
      data: {
        maTaiKhoan: account.maTaiKhoan,
        tenUngVien: spec.name,
        soNamKinhNghiem: spec.years,
        chuyenMon: spec.specialty,
        diaChi: spec.city,
        gioiThieuBanThan: `<p>Kỹ sư <strong>${spec.specialty}</strong> với ${spec.years} năm kinh nghiệm phát triển sản phẩm công nghệ tại ${spec.city}.</p>`,
      },
    });

    createdCandidateIds.push(ungVien.maUngVien);
    createdCandidateAccountIds.push(account.maTaiKhoan);

    const skillLinks = spec.skills
      .map((name) => skillByName.get(name.toLowerCase()))
      .filter((id): id is string => Boolean(id));

    if (skillLinks.length > 0) {
      await prisma.ungVienKyNang.createMany({
        data: skillLinks.map((maKyNang) => ({
          maUngVien: ungVien.maUngVien,
          maKyNang,
          mucDo: spec.years >= 4 ? 'Thành thạo' : 'Khá',
        })),
      });
    }
  }

  // 3. Tạo 8 tài khoản HR (RECRUITER) cùng công ty để demo đổi chức vụ Owner <-> HR
  const coRecruiterSpecs = [
    {
      companyKey: 'fpt',
      name: 'Nguyễn Thảo Nhi',
      email: 'nhi.nt.hr@fptsoftware.com',
      phone: '0981200001',
      title: 'Senior IT Recruiter',
      createdAt: utcDate(2024, 9, 14, 9, 0),
    },
    {
      companyKey: 'fpt',
      name: 'Trần Anh Dũng',
      email: 'dung.ta.hr@fptsoftware.com',
      phone: '0981200002',
      title: 'Talent Acquisition Specialist',
      createdAt: utcDate(2026, 2, 11, 10, 30),
    },
    {
      companyKey: 'vng',
      name: 'Lê Ngọc Anh',
      email: 'ngocanh.hr@vng.com.vn',
      phone: '0981200003',
      title: 'Technical Recruiter',
      createdAt: utcDate(2025, 4, 22, 14, 15),
    },
    {
      companyKey: 'shopee',
      name: 'Phạm Khánh Vy',
      email: 'khanhvy.ta@shopee.com',
      phone: '0981200004',
      title: 'HRBP Engineering',
      createdAt: utcDate(2026, 5, 16, 9, 45),
    },
    {
      companyKey: 'nab',
      name: 'Đỗ Minh Khôi',
      email: 'khoi.do.hr@nab.com.au',
      phone: '0981200005',
      title: 'Talent Partner',
      createdAt: utcDate(2026, 7, 19, 11, 20),
    },
    {
      companyKey: 'viettel',
      name: 'Vũ Thu Trang',
      email: 'trangvt.hr@viettel.com.vn',
      phone: '0981200006',
      title: 'Chuyên viên Tuyển dụng CNTT',
      createdAt: utcDate(2026, 8, 25, 15, 0),
    },
    {
      companyKey: 'vng',
      name: 'Hoàng Minh Tú',
      email: 'tu.hm.ta@vng.com.vn',
      phone: '0981200007',
      title: 'Campus Recruiter',
      createdAt: utcDate(2026, 10, 12, 8, 50),
    },
    {
      companyKey: 'shopee',
      name: 'Bùi Phương Thảo',
      email: 'thao.bp.hr@shopee.com',
      phone: '0981200008',
      title: 'IT Recruiter',
      createdAt: utcDate(2026, 11, 14, 10, 20),
    },
  ];

  const findCompany = (key: string) =>
    companies.find((c) => c.tenCongTy.toLowerCase().includes(key)) ??
    companies[0];

  for (const hr of coRecruiterSpecs) {
    const comp = findCompany(hr.companyKey);
    if (!comp) continue;

    // Đảm bảo NTD đầu tiên của công ty mang vai trò OWNER
    if (comp.nhaTuyenDungs[0]) {
      await prisma.nhaTuyenDung.update({
        where: { maNTD: comp.nhaTuyenDungs[0].maNTD },
        data: { vaiTroTrongCongTy: 'OWNER' },
      });
    }

    const acc = await prisma.taiKhoan.create({
      data: {
        email: hr.email,
        tenNguoiDung: hr.name,
        matKhau: hashedPassword,
        provider: 'LOCAL',
        sdt: hr.phone,
        vaiTro: 'NHATUYENDUNG',
        trangThai: 'HOATDONG',
        ngayTao: hr.createdAt,
        ngayCapNhat: hr.createdAt,
      },
    });

    await prisma.nhaTuyenDung.create({
      data: {
        maTaiKhoan: acc.maTaiKhoan,
        maCongTy: comp.maCongTy,
        hoTen: hr.name,
        chucVu: hr.title,
        soDienThoai: hr.phone,
        vaiTroTrongCongTy: 'RECRUITER',
      },
    });
  }

  // 4. Tạo 3 Doanh nghiệp mới chờ Admin duyệt (CHUAKICHHOAT + OWNER + Thông báo Admin)
  const pendingCompanies = [
    {
      companyName: 'KMS Technology Vietnam',
      slug: 'kms-technology-vietnam',
      city: 'TP. Hồ Chí Minh',
      address: '123 Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh',
      website: 'https://kms-technology.com',
      model: 'Outsource',
      size: '1000+ nhân viên',
      hrName: 'Nguyễn Hoàng Bảo Châu',
      hrEmail: 'chau.nguyen@kms-technology.com',
      hrPhone: '0909887701',
      hrTitle: 'Talent Acquisition Manager',
      createdAt: utcDate(2026, 11, 24, 9, 30),
    },
    {
      companyName: 'ZaloPay Engineering',
      slug: 'zalopay-engineering',
      city: 'TP. Hồ Chí Minh',
      address: 'Z06 Đường số 13, Tân Thuận Đông, Quận 7',
      website: 'https://zalopay.vn',
      model: 'Product',
      size: '301 - 1000 nhân viên',
      hrName: 'Trần Quốc Trung',
      hrEmail: 'trung.tq@zalopay.vn',
      hrPhone: '0909887702',
      hrTitle: 'Head of Tech Hiring',
      createdAt: utcDate(2026, 11, 25, 14, 10),
    },
    {
      companyName: 'Tiki Engineering Hub',
      slug: 'tiki-engineering-hub',
      city: 'Hà Nội',
      address: 'Tòa nhà Viettel, 285 Cách Mạng Tháng 8',
      website: 'https://tiki.vn',
      model: 'Product',
      size: '301 - 1000 nhân viên',
      hrName: 'Phạm Minh Hiếu',
      hrEmail: 'hieu.pm@tiki.vn',
      hrPhone: '0909887703',
      hrTitle: 'Senior HRBP',
      createdAt: utcDate(2026, 11, 26, 16, 20),
    },
  ];

  for (const item of pendingCompanies) {
    const newComp = await prisma.congTy.create({
      data: {
        tenCongTy: item.companyName,
        slug: item.slug,
        thanhPho: item.city,
        diaChi: item.address,
        website: item.website,
        moHinhCongTy: item.model,
        quyMo: item.size,
        ngayTao: item.createdAt,
      },
    });

    await prisma.chiNhanh.create({
      data: {
        maCongTy: newComp.maCongTy,
        thanhPho: item.city,
        diaChi: item.address,
      },
    });

    const acc = await prisma.taiKhoan.create({
      data: {
        email: item.hrEmail,
        tenNguoiDung: item.hrName,
        matKhau: hashedPassword,
        provider: 'LOCAL',
        sdt: item.hrPhone,
        vaiTro: 'NHATUYENDUNG',
        trangThai: 'CHUAKICHHOAT',
        ngayTao: item.createdAt,
        ngayCapNhat: item.createdAt,
      },
    });

    await prisma.nhaTuyenDung.create({
      data: {
        maTaiKhoan: acc.maTaiKhoan,
        maCongTy: newComp.maCongTy,
        hoTen: item.hrName,
        chucVu: item.hrTitle,
        soDienThoai: item.hrPhone,
        vaiTroTrongCongTy: 'OWNER',
      },
    });

    await prisma.thongBao.create({
      data: {
        maTaiKhoan: adminAccountId,
        tieuDe: `Nhà tuyển dụng mới chờ duyệt: ${item.companyName}`,
        noiDung: `Doanh nghiệp ${item.companyName} (${item.hrName} - ${item.hrEmail}) vừa đăng ký tài khoản Nhà tuyển dụng và đang chờ Quản trị viên xét duyệt.`,
        trangThai: 'CHUA_DOC',
        ngayTao: item.createdAt,
      },
    });
  }

  // 5. Thêm 4 tin tuyển dụng IT mới (trong đó 3 tin CHO_DUYET)
  const fpt = findCompany('fpt');
  const vng = findCompany('vng');
  const shopee = findCompany('shopee');
  const nab = findCompany('nab');

  const extraJobs = [
    {
      comp: vng,
      title: 'Senior AI / LLM Engineer (RAG & Agents)',
      slug: 'vng-senior-ai-llm-engineer-2026',
      minSal: 38_000_000,
      maxSal: 62_000_000,
      exp: 3,
      level: 'Senior',
      city: 'TP. Hồ Chí Minh',
      workModel: 'Hybrid',
      status: 'CHO_DUYET',
      postedAt: utcDate(2026, 11, 24, 10, 0),
    },
    {
      comp: shopee,
      title: 'Mobile Flutter Engineer (Cross-Platform)',
      slug: 'shopee-mobile-flutter-engineer-2026',
      minSal: 26_000_000,
      maxSal: 42_000_000,
      exp: 2,
      level: 'Middle',
      city: 'Hà Nội',
      workModel: 'Tại văn phòng',
      status: 'CHO_DUYET',
      postedAt: utcDate(2026, 11, 25, 11, 30),
    },
    {
      comp: nab,
      title: 'Cloud Security & DevSecOps Engineer',
      slug: 'nab-cloud-security-devsecops-2026',
      minSal: 40_000_000,
      maxSal: 68_000_000,
      exp: 4,
      level: 'Senior',
      city: 'TP. Hồ Chí Minh',
      workModel: 'Hybrid',
      status: 'CHO_DUYET',
      postedAt: utcDate(2026, 11, 26, 9, 15),
    },
    {
      comp: fpt,
      title: 'Senior Data Engineer (Spark / Airflow / AWS)',
      slug: 'fpt-senior-data-engineer-aws-2026',
      minSal: 32_000_000,
      maxSal: 50_000_000,
      exp: 3,
      level: 'Senior',
      city: 'Đà Nẵng',
      workModel: 'Hybrid',
      status: 'DANG_TUYEN',
      postedAt: utcDate(2026, 10, 15, 8, 45),
    },
  ];

  for (const job of extraJobs) {
    const ntd = job.comp?.nhaTuyenDungs[0];
    if (!ntd) continue;
    await prisma.congViec.create({
      data: {
        tenCongViec: job.title,
        slug: job.slug,
        moTa: `<p>Tham gia xây dựng và vận hành hệ thống quy mô lớn cho vị trí <strong>${job.title}</strong> tại ${job.comp.tenCongTy}.</p>`,
        yeuCauCongViec: `<p>Tối thiểu ${job.exp} năm kinh nghiệm thực tế, tư duy thiết kế hệ thống tốt và làm việc nhóm hiệu quả.</p>`,
        phucLoi: `<p>Lương tháng 13, thưởng hiệu suất quý, bảo hiểm sức khỏe cao cấp và hỗ trợ chứng chỉ quốc tế.</p>`,
        mucLuongToiThieu: job.minSal,
        mucLuongToiDa: job.maxSal,
        yeuCauKinhNghiem: job.exp,
        capBac: job.level,
        thanhPho: job.city,
        loaiHinh: 'Full-time',
        hinhThucLamViec: job.workModel,
        ngayDang: job.postedAt,
        ngayHetHan: addDays(job.postedAt, 45),
        trangThai: job.status,
        luotXem: job.status === 'DANG_TUYEN' ? 218 : 0,
        maNTD: ntd.maNTD,
        maChiNhanh: job.comp.chiNhanhs[0]?.maChiNhanh ?? null,
      },
    });
  }

  // 6. Tạo thêm 32 Đơn ứng tuyển rải đều Jan–Nov 2026 đủ 5 trạng thái
  const activeJobs = await prisma.congViec.findMany({
    where: { trangThai: 'DANG_TUYEN', deletedAt: null },
    select: { maCongViec: true },
  });

  const appStatuses: Array<
    'CHO_DUYET' | 'DA_XEM' | 'PHONG_VAN' | 'DUOC_NHAN' | 'BI_LOAI'
  > = [
    'DA_XEM',
    'PHONG_VAN',
    'DUOC_NHAN',
    'BI_LOAI',
    'CHO_DUYET',
    'DA_XEM',
    'PHONG_VAN',
    'BI_LOAI',
    'DUOC_NHAN',
    'DA_XEM',
  ];

  const appMonths = [
    1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10,
    10, 10, 11, 11, 11, 11, 11, 11,
  ];

  if (activeJobs.length > 0 && createdCandidateIds.length > 0) {
    const appPayloads = appMonths.map((month, idx) => {
      const day = Math.min(25, 3 + ((idx * 5) % 22));
      const submittedAt = utcDate(2026, month, day, 9 + (idx % 8), 15);
      return {
        maUngVien: createdCandidateIds[idx % createdCandidateIds.length],
        maCongViec: activeJobs[idx % activeJobs.length].maCongViec,
        ngayNop: submittedAt,
        ngayTao: submittedAt,
        trangThai: appStatuses[idx % appStatuses.length],
        chiTiet:
          'Tôi rất quan tâm tới vị trí này và mong muốn đồng hành cùng đội ngũ kỹ thuật của quý công ty.',
        aiMatchScore: 64 + ((idx * 7) % 32),
      };
    });

    await prisma.donXinViec.createMany({ data: appPayloads });
  }

  // 7. Tạo thêm 15 Giao dịch gói quảng cáo rải đều năm 2026 (đủ 4 gói & PAID/PENDING/FAILED)
  if (packages.length > 0 && companies.length > 0) {
    const txSchedule: Array<{
      month: number;
      day: number;
      pkgIdx: number;
      compKey: string;
      status: 'PAID' | 'PENDING' | 'FAILED';
      method: string;
    }> = [
      { month: 1, day: 18, pkgIdx: 0, compKey: 'fpt', status: 'PAID', method: 'VNPAY' },
      { month: 2, day: 14, pkgIdx: 1, compKey: 'vng', status: 'PAID', method: 'VNPAY' },
      { month: 3, day: 21, pkgIdx: 2, compKey: 'shopee', status: 'PAID', method: 'MOMO' },
      { month: 4, day: 10, pkgIdx: 1, compKey: 'nab', status: 'PAID', method: 'VNPAY' },
      { month: 5, day: 19, pkgIdx: 3, compKey: 'fpt', status: 'PAID', method: 'CHUYEN_KHOAN' },
      { month: 6, day: 8, pkgIdx: 0, compKey: 'viettel', status: 'FAILED', method: 'MOMO' },
      { month: 6, day: 25, pkgIdx: 2, compKey: 'vng', status: 'PAID', method: 'VNPAY' },
      { month: 7, day: 15, pkgIdx: 1, compKey: 'shopee', status: 'PAID', method: 'MOMO' },
      { month: 8, day: 22, pkgIdx: 3, compKey: 'nab', status: 'PAID', method: 'CHUYEN_KHOAN' },
      { month: 9, day: 11, pkgIdx: 2, compKey: 'fpt', status: 'PAID', method: 'VNPAY' },
      { month: 10, day: 9, pkgIdx: 1, compKey: 'viettel', status: 'PAID', method: 'VNPAY' },
      { month: 10, day: 27, pkgIdx: 3, compKey: 'vng', status: 'PAID', method: 'CHUYEN_KHOAN' },
      { month: 11, day: 6, pkgIdx: 2, compKey: 'shopee', status: 'PAID', method: 'MOMO' },
      { month: 11, day: 21, pkgIdx: 3, compKey: 'fpt', status: 'PAID', method: 'VNPAY' },
      { month: 11, day: 25, pkgIdx: 1, compKey: 'nab', status: 'PENDING', method: 'MOMO' },
    ];

    for (let i = 0; i < txSchedule.length; i++) {
      const item = txSchedule[i];
      const pkg = packages[item.pkgIdx % packages.length];
      const comp = findCompany(item.compKey);
      const ntd = comp?.nhaTuyenDungs[0];
      if (!pkg || !comp || !ntd) continue;

      const buyDate = utcDate(2026, item.month, item.day, 10, 20);
      const endDate = addDays(buyDate, pkg.thoiGianHieuLuc ?? 30);

      const muaStatus =
        item.status === 'PAID'
          ? 'DANG_HOAT_DONG'
          : item.status === 'PENDING'
            ? 'CHO_THANH_TOAN'
            : 'DA_HUY';

      const ttStatus =
        item.status === 'PAID'
          ? 'THANH_CONG'
          : item.status === 'PENDING'
            ? 'CHO_THANH_TOAN'
            : 'THAT_BAI';

      const mua = await prisma.muaQuangCao.create({
        data: {
          tieuDe: pkg.tieuDe,
          giaTaiThoiDiemMua: pkg.gia,
          soLuotConLai: item.status === 'PAID' ? (pkg.soLuotDangTin ?? 5) : 0,
          ngayBatDau: buyDate,
          ngayKetThuc: endDate,
          ngayMua: buyDate,
          trangThai: muaStatus,
          maNTD: ntd.maNTD,
          maCongTy: comp.maCongTy,
          maGoi: pkg.maGoi,
        },
      });

      await prisma.thanhToan.create({
        data: {
          ngayThanhToan: buyDate,
          soTienThanhToan: pkg.gia,
          phuongThucTT: item.method,
          trangThaiTT: ttStatus,
          ghiChu: `Thanh toán ${pkg.tieuDe} - ${comp.tenCongTy}`,
          maGiaoDichDoiTac: `VN2026${String(item.month).padStart(2, '0')}${String(item.day).padStart(2, '0')}${String(i + 101)}`,
          maMua: mua.maMua,
        },
      });
    }
  }

  // 8. Bổ sung 10 Ứng viên ĐÃ TRÚNG TUYỂN (DUOC_NHAN) + Lịch phỏng vấn HOAN_THANH + Đánh giá ứng viên
  const jobsWithOwner = await prisma.congViec.findMany({
    where: { trangThai: 'DANG_TUYEN', deletedAt: null },
    include: {
      nhaTuyenDung: {
        include: { congTy: true },
      },
    },
  });

  const hiredSpecs = [
    {
      candIdx: 0,
      month: 3,
      day: 18,
      score: 94,
      rating: 4.9,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 5,
      vanHoa: 4,
      title: 'Kỹ năng kiến trúc hệ thống xuất sắc, sẵn sàng nhận việc ngay',
      note: 'Ứng viên trả lời rất chắc phần Microservices, tối ưu truy vấn SQL và giao tiếp rõ ràng với Tech Lead. Đề xuất gửi Offer bậc Senior.',
      shared: true,
    },
    {
      candIdx: 3,
      month: 4,
      day: 24,
      score: 91,
      rating: 4.8,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 4,
      vanHoa: 5,
      title: 'Tư duy Frontend sắc bén, am hiểu hiệu năng Next.js',
      note: 'Live coding hoàn thành sạch đẹp, chú trọng accessibility và tối ưu Core Web Vitals. Rất phù hợp văn hóa product team.',
      shared: true,
    },
    {
      candIdx: 5,
      month: 5,
      day: 15,
      score: 95,
      rating: 5.0,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 5,
      vanHoa: 5,
      title: 'Ứng viên DevOps nổi bật nhất đợt tuyển Q2',
      note: 'Kinh nghiệm vận hành Kubernetes production và tối ưu chi phí AWS rất thực chiến. Hội đồng phỏng vấn thống nhất tuyển dụng.',
      shared: true,
    },
    {
      candIdx: 7,
      month: 6,
      day: 12,
      score: 89,
      rating: 4.5,
      chuyenMon: 5,
      thaiDo: 4,
      giaiQuyet: 5,
      vanHoa: 4,
      title: 'Nền tảng Backend vững, xử lý concurrency tốt',
      note: 'Phân tích bài toán high-traffic rõ ràng, thái độ cầu thị. Đã chấp nhận Offer và chốt ngày onboard.',
      shared: true,
    },
    {
      candIdx: 9,
      month: 7,
      day: 20,
      score: 92,
      rating: 4.8,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 5,
      vanHoa: 4,
      title: 'Senior .NET giàu kinh nghiệm thực tế doanh nghiệp',
      note: 'Nắm vững Clean Architecture và SQL Server performance tuning. Có khả năng mentor junior trong team.',
      shared: true,
    },
    {
      candIdx: 11,
      month: 8,
      day: 14,
      score: 90,
      rating: 4.6,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 4,
      vanHoa: 5,
      title: 'Tư duy AI/ML bài bản, demo dự án thuyết phục',
      note: 'Ứng viên trình bày rõ kiến trúc RAG và cách đánh giá chất lượng mô hình. Phù hợp định hướng AI của công ty.',
      shared: true,
    },
    {
      candIdx: 14,
      month: 9,
      day: 10,
      score: 93,
      rating: 4.9,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 5,
      vanHoa: 5,
      title: 'Kỹ năng Java & Kafka đạt chuẩn Senior Lead',
      note: 'Giải quyết tình huống thiết kế hệ thống thanh toán thời gian thực rất ấn tượng. Đã ký Offer.',
      shared: true,
    },
    {
      candIdx: 16,
      month: 10,
      day: 8,
      score: 88,
      rating: 4.5,
      chuyenMon: 4,
      thaiDo: 5,
      giaiQuyet: 4,
      vanHoa: 5,
      title: 'Fullstack TypeScript linh hoạt, phối hợp nhóm tốt',
      note: 'Code sạch, hiểu rõ cả phía React Query lẫn NestJS API. Rất phù hợp với nhịp độ sprint của team.',
      shared: false,
    },
    {
      candIdx: 24,
      month: 11,
      day: 9,
      score: 96,
      rating: 5.0,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 5,
      vanHoa: 5,
      title: 'Senior Go Backend xuất sắc, vượt kỳ vọng vòng kỹ thuật',
      note: 'Chứng minh được khả năng tối ưu latency dịch vụ xuống dưới 20ms. Ban giám đốc duyệt Offer ngay sau vòng cuối.',
      shared: true,
    },
    {
      candIdx: 38,
      month: 11,
      day: 22,
      score: 92,
      rating: 4.8,
      chuyenMon: 5,
      thaiDo: 5,
      giaiQuyet: 4,
      vanHoa: 5,
      title: 'Ứng viên Fullstack toàn diện, tinh thần ownership cao',
      note: 'Chủ động đặt câu hỏi sâu về nghiệp vụ sản phẩm, hoàn thành xuất sắc cả vòng kỹ thuật lẫn văn hóa.',
      shared: true,
    },
  ];

  if (jobsWithOwner.length > 0 && createdCandidateIds.length > 0) {
    for (let i = 0; i < hiredSpecs.length; i++) {
      const spec = hiredSpecs[i];
      const job = jobsWithOwner[i % jobsWithOwner.length];
      const candId = createdCandidateIds[spec.candIdx % createdCandidateIds.length];
      const candAccId =
        createdCandidateAccountIds[spec.candIdx % createdCandidateAccountIds.length];
      const appliedAt = utcDate(2026, spec.month, Math.max(1, spec.day - 6), 9, 30);
      const interviewAt = utcDate(2026, spec.month, Math.max(2, spec.day - 2), 14, 0);
      const evaluatedAt = utcDate(2026, spec.month, spec.day, 16, 15);

      const don = await prisma.donXinViec.create({
        data: {
          maUngVien: candId,
          maCongViec: job.maCongViec,
          ngayNop: appliedAt,
          ngayTao: appliedAt,
          trangThai: 'DUOC_NHAN',
          chiTiet:
            'Kính gửi anh/chị HR, tôi rất hào hứng ứng tuyển vị trí này và tin rằng kinh nghiệm thực chiến của mình sẽ đóng góp tích cực cho đội ngũ.',
          aiMatchScore: spec.score,
        },
      });

      await prisma.lichPhongVan.create({
        data: {
          maDon: don.maDon,
          thoiGian: interviewAt,
          hinhThuc: i % 3 === 0 ? 'OFFLINE' : 'ONLINE',
          diaDiem:
            i % 3 === 0
              ? `Văn phòng ${job.nhaTuyenDung.congTy.tenCongTy}`
              : 'Google Meet',
          linkMeeting:
            i % 3 === 0
              ? null
              : `https://meet.google.com/vng-${String(100 + i)}-hired`,
          ghiChu: 'Phỏng vấn chuyên môn + Culture Fit cùng Tech Lead & HR.',
          trangThaiLich: 'HOAN_THANH',
        },
      });

      await prisma.danhGia.create({
        data: {
          maNguoiDanhGia: job.nhaTuyenDung.maTaiKhoan,
          maDoiTuongDuocDanhGia: candId,
          loaiDoiTuong: 'UNGVIEN',
          maDonThamChieu: don.maDon,
          rating: spec.rating,
          tieuDe: spec.title,
          noiDung: spec.note,
          ngayDanhGia: evaluatedAt,
          anDanh: false,
          diemChuyenMon: spec.chuyenMon,
          diemThaiDo: spec.thaiDo,
          diemGiaiQuyetVanDe: spec.giaiQuyet,
          diemPhuHopVanHoa: spec.vanHoa,
          ketQuaDanhGia: 'DAT',
          chiaSeUngVien: spec.shared,
          trangThai: 'DA_DUYET',
        },
      });

      if (spec.shared) {
        await prisma.thongBao.create({
          data: {
            maTaiKhoan: candAccId,
            tieuDe: `🎉 Chúc mừng trúng tuyển & Nhận xét từ ${job.nhaTuyenDung.congTy.tenCongTy}`,
            noiDung: `${job.nhaTuyenDung.congTy.tenCongTy} đã gửi thông báo trúng tuyển và chia sẻ nhận xét đánh giá (${spec.rating}/5 sao) cho vị trí ${job.tenCongViec}.`,
            trangThai: 'CHUA_DOC',
            ngayTao: evaluatedAt,
          },
        });
      }
    }
  }

  // 9. Bổ sung 18 Đánh giá Công ty (ẩn danh, đa dạng mức sao & trạng thái kiểm duyệt)
  const companyReviewsSpecs: Array<{
    compKey: string;
    candAccIdx: number;
    month: number;
    day: number;
    scores: [number, number, number, number, number];
    recommend: boolean;
    goodOt: boolean;
    title: string;
    content: string;
    pros: string;
    cons: string;
    status: 'DA_DUYET' | 'CHO_DUYET' | 'TU_CHOI';
    reported?: boolean;
    reportReason?: string;
    rejectReason?: string;
  }> = [
    {
      compKey: 'fpt',
      candAccIdx: 1,
      month: 4,
      day: 14,
      scores: [4, 5, 4, 5, 4],
      recommend: true,
      goodOt: true,
      title: 'Cơ hội làm việc với khách hàng quốc tế rất rộng mở',
      content:
        'Dự án quy mô lớn, quy trình bài bản và có nhiều chương trình đào tạo chứng chỉ Cloud, AI miễn phí cho nhân viên.',
      pros: 'Môi trường thân thiện, campus đẹp, thưởng dự án rõ ràng, nhiều cơ hội onsite Nhật/Mỹ.',
      cons: 'Một số dự án outsource cần họp lệch múi giờ nên đôi lúc phải linh hoạt thời gian.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'fpt',
      candAccIdx: 2,
      month: 7,
      day: 19,
      scores: [3, 4, 4, 4, 4],
      recommend: true,
      goodOt: false,
      title: 'Phù hợp cho Fresher và Middle tích lũy kinh nghiệm',
      content:
        'Đồng nghiệp nhiệt tình hỗ trợ, lộ trình đánh giá bậc lương hàng năm rõ ràng.',
      pros: 'Ổn định, nhiều hoạt động gắn kết nội bộ, chính sách bảo hiểm FPT Care tốt.',
      cons: 'Mức tăng lương nội bộ chưa đột phá bằng các công ty product ngoại.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'fpt',
      candAccIdx: 4,
      month: 10,
      day: 25,
      scores: [5, 5, 4, 5, 5],
      recommend: true,
      goodOt: true,
      title: 'Team AI & Data đầu tư mạnh, thiết bị làm việc xịn',
      content:
        'Được cấp GPU cluster để nghiên cứu và triển khai sản phẩm thực tế cho khách hàng lớn.',
      pros: 'Quản lý cởi mở, khuyến khích đề xuất công nghệ mới, không gian làm việc hiện đại.',
      cons: 'Thủ tục hành chính nội bộ đôi khi hơi nhiều bước.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'vng',
      candAccIdx: 6,
      month: 3,
      day: 22,
      scores: [5, 5, 4, 5, 5],
      recommend: true,
      goodOt: true,
      title: 'VNG Campus đẳng cấp, bài toán kỹ thuật triệu người dùng',
      content:
        'Làm việc tại VNG giúp nâng trình System Design rất nhanh vì hệ thống chịu tải cực lớn.',
      pros: 'Văn phòng có gym, căng tin xịn, phúc lợi tốt, đồng nghiệp giỏi và sẵn sàng chia sẻ.',
      cons: 'Áp lực chất lượng sản phẩm cao vào giai đoạn ra mắt tính năng lớn.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'vng',
      candAccIdx: 8,
      month: 8,
      day: 9,
      scores: [4, 4, 4, 4, 5],
      recommend: true,
      goodOt: true,
      title: 'Văn hóa mở, tôn trọng ý kiến kỹ sư',
      content:
        'Mọi người trao đổi thẳng thắn trên tinh thần xây dựng, review code kỹ và có chuẩn chung.',
      pros: 'Hybrid linh hoạt, bảo hiểm cho người thân, chế độ nghỉ phép rõ ràng.',
      cons: 'Khoảng cách di chuyển sang Quận 7 hơi xa với bạn ở khu Bắc thành phố.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'vng',
      candAccIdx: 10,
      month: 11,
      day: 12,
      scores: [3, 4, 3, 4, 5],
      recommend: false,
      goodOt: false,
      title: 'Văn phòng đẹp nhưng một số dự án đổi hướng nhanh',
      content:
        'Trải nghiệm tổng thể khá ổn về cơ sở vật chất, tuy nhiên roadmap sản phẩm đôi khi thay đổi gấp.',
      pros: 'Môi trường chuyên nghiệp, nhiều hoạt động thể thao và CLB.',
      cons: 'Giai đoạn chốt milestone cần tăng ca khá nhiều.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'shopee',
      candAccIdx: 12,
      month: 5,
      day: 17,
      scores: [5, 5, 4, 4, 5],
      recommend: true,
      goodOt: true,
      title: 'Thu nhập top đầu thị trường, quy trình kỹ thuật bài bản',
      content:
        'Được tiếp cận hạ tầng microservices quy mô Đông Nam Á, học hỏi rất nhiều từ các kỹ sư Singapore.',
      pros: 'Lương thưởng rất cạnh tranh, pantry đầy đủ đồ ăn nhẹ, văn phòng trung tâm.',
      cons: 'Nhịp độ công việc nhanh, đòi hỏi khả năng tự học và chịu áp lực tốt.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'shopee',
      candAccIdx: 13,
      month: 9,
      day: 21,
      scores: [4, 5, 4, 4, 5],
      recommend: true,
      goodOt: false,
      title: 'Môi trường phát triển cực nhanh cho kỹ sư trẻ',
      content:
        'Code review và tài liệu RFC rất chỉn chu, giúp kỹ năng thiết kế hệ thống tiến bộ rõ rệt sau 1 năm.',
      pros: 'Đồng nghiệp siêu giỏi, lương đúng hạn, đánh giá hiệu suất minh bạch.',
      cons: 'Các đợt sale lớn 11.11 / 12.12 trực on-call khá căng thẳng.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'momo',
      candAccIdx: 15,
      month: 6,
      day: 15,
      scores: [5, 4, 5, 5, 4],
      recommend: true,
      goodOt: true,
      title: 'Đội ngũ trẻ trung, làm sản phẩm FinTech tác động lớn',
      content:
        'Cảm giác tính năng mình viết được hàng chục triệu người Việt dùng mỗi ngày rất đã.',
      pros: 'Sếp tâm lý, ít phân cấp, thưởng Tết và ESOP hấp dẫn, nhiều workshop công nghệ.',
      cons: 'Một số dịch vụ legacy cần thời gian refactor song song với feature mới.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'momo',
      candAccIdx: 18,
      month: 10,
      day: 4,
      scores: [4, 5, 4, 5, 4],
      recommend: true,
      goodOt: true,
      title: 'Văn hóa chia sẻ tốt, cân bằng công việc ổn',
      content:
        'Team engineering phối hợp nhịp nhàng với Product và Design, ít họp thừa.',
      pros: 'Chính sách WFH linh hoạt, hỗ trợ chi phí học tập và thi chứng chỉ.',
      cons: 'Khu vực để xe giờ cao điểm hơi đông.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'nab',
      candAccIdx: 19,
      month: 4,
      day: 28,
      scores: [5, 5, 5, 5, 5],
      recommend: true,
      goodOt: true,
      title: 'Work-life balance đỉnh cao, văn hóa chuẩn Úc',
      content:
        'Không có văn hóa OT vô lý, mọi kế hoạch sprint đều được ước lượng thực tế và tôn trọng thời gian cá nhân.',
      pros: 'Tiếng Anh cải thiện nhanh, phúc lợi chăm sóc sức khỏe cực tốt, cấp MacBook Pro mới.',
      cons: 'Quy trình bảo mật ngân hàng chặt chẽ nên cài đặt công cụ cần qua bước duyệt.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'nab',
      candAccIdx: 20,
      month: 8,
      day: 30,
      scores: [4, 5, 5, 5, 5],
      recommend: true,
      goodOt: true,
      title: 'Ngân sách đào tạo AWS/Cloud cực kỳ hào phóng',
      content:
        'Công ty tài trợ 100% lệ phí thi chứng chỉ Cloud và có giờ học chuyên môn mỗi tuần.',
      pros: 'Quản lý tôn trọng nhân viên, môi trường đa quốc gia chuyên nghiệp.',
      cons: 'Tốc độ release chậm hơn startup do quy trình tuân thủ ngân hàng.',
      status: 'DA_DUYET',
    },
    {
      compKey: 'viettel',
      candAccIdx: 21,
      month: 9,
      day: 18,
      scores: [4, 4, 4, 4, 4],
      recommend: true,
      goodOt: false,
      title: 'Bài toán hạ tầng và dữ liệu quy mô quốc gia',
      content:
        'Nhiều dự án chuyển đổi số, 5G và AI tầm cỡ lớn, chế độ đãi ngộ ổn định.',
      pros: 'Thu nhập tốt so với mặt bằng Hà Nội, thưởng các dịp lễ lớn đầy đủ.',
      cons: 'Kỷ luật giờ giấc nghiêm, quy trình báo cáo nhiều lớp.',
      status: 'DA_DUYET',
    },
    // 3 bài CHO_DUYET mới gửi (để demo Admin duyệt trên /admin/reviews)
    {
      compKey: 'vng',
      candAccIdx: 22,
      month: 11,
      day: 25,
      scores: [5, 5, 4, 5, 5],
      recommend: true,
      goodOt: true,
      title: 'Trải nghiệm onboarding kỹ sư mới cực kỳ chỉn chu',
      content:
        'Có mentor kèm sát trong 2 tháng thử việc, tài liệu hệ thống rõ ràng và văn hóa team rất cởi mở.',
      pros: 'Môi trường năng động, thiết bị làm việc tốt, chế độ chăm sóc nhân viên chu đáo.',
      cons: 'Một số công cụ nội bộ cần thời gian làm quen ban đầu.',
      status: 'CHO_DUYET',
    },
    {
      compKey: 'nab',
      candAccIdx: 23,
      month: 11,
      day: 26,
      scores: [5, 5, 5, 5, 4],
      recommend: true,
      goodOt: true,
      title: 'Rất hài lòng với chính sách làm việc hybrid và văn hóa minh bạch',
      content:
        'Lãnh đạo lắng nghe góp ý từ đội ngũ kỹ thuật, đánh giá hiệu suất công bằng theo kết quả thực tế.',
      pros: 'Không OT, nhiều chương trình đào tạo lãnh đạo kỹ thuật và Cloud.',
      cons: 'Họp với team Melbourne buổi sáng đôi lúc khá sớm.',
      status: 'CHO_DUYET',
    },
    {
      compKey: 'momo',
      candAccIdx: 25,
      month: 11,
      day: 26,
      scores: [4, 4, 4, 5, 4],
      recommend: true,
      goodOt: true,
      title: 'Đội ngũ engineering mạnh, nhiều cơ hội tự chủ sản phẩm',
      content:
        'Kỹ sư được tham gia sâu từ khâu thiết kế sản phẩm đến vận hành thực tế trên hàng triệu người dùng.',
      pros: 'Đồng nghiệp giỏi, văn hóa trẻ trung, review lương rõ ràng.',
      cons: 'Giai đoạn chạy chiến dịch lớn cần hỗ trợ trực kỹ thuật ngoài giờ.',
      status: 'CHO_DUYET',
    },
    // 1 bài bị báo cáo vi phạm (BI_BAO_CAO / REPORTED)
    {
      compKey: 'viettel',
      candAccIdx: 26,
      month: 11,
      day: 23,
      scores: [2, 3, 2, 2, 3],
      recommend: false,
      goodOt: false,
      title: 'Quy trình phê duyệt quá rườm rà và thiếu linh hoạt',
      content:
        'Cần cải thiện tốc độ duyệt yêu cầu kỹ thuật và giảm bớt các cuộc họp không cần thiết vào cuối tuần.',
      pros: 'Lương thưởng ổn định, phúc lợi tốt.',
      cons: 'Quy trình hành chính nhiều tầng, áp lực tiến độ cao.',
      status: 'DA_DUYET',
      reported: true,
      reportReason:
        'Nội dung đánh giá có thông tin chưa chính xác về quy trình làm việc cuối tuần của đơn vị.',
    },
    // 1 bài TU_CHOI (để tab Từ chối / Đã ẩn trên /admin/reviews phong phú)
    {
      compKey: 'shopee',
      candAccIdx: 27,
      month: 11,
      day: 20,
      scores: [1, 1, 1, 1, 1],
      recommend: false,
      goodOt: false,
      title: 'Spam quảng cáo khóa học lập trình siêu tốc',
      content:
        'Liên hệ ngay trung tâm ABC để nhận học bổng 90% khóa học Fullstack đảm bảo việc làm...',
      pros: 'Không có.',
      cons: 'Nội dung quảng cáo không liên quan đến trải nghiệm làm việc.',
      status: 'TU_CHOI',
      rejectReason: 'Vi phạm quy định cộng đồng: nội dung spam quảng cáo dịch vụ bên ngoài.',
    },
  ];

  for (const rev of companyReviewsSpecs) {
    const comp = findCompany(rev.compKey);
    const authorAccId =
      createdCandidateAccountIds[rev.candAccIdx % createdCandidateAccountIds.length];
    if (!comp || !authorAccId) continue;

    const avg =
      Math.round(
        ((rev.scores[0] +
          rev.scores[1] +
          rev.scores[2] +
          rev.scores[3] +
          rev.scores[4]) /
          5) *
          10,
      ) / 10;
    const reviewDate = utcDate(2026, rev.month, rev.day, 15, 20);

    await prisma.danhGia.create({
      data: {
        maNguoiDanhGia: authorAccId,
        maDoiTuongDuocDanhGia: comp.maCongTy,
        loaiDoiTuong: 'CONGTY',
        rating: avg,
        tieuDe: rev.title,
        noiDung: rev.content,
        ngayDanhGia: reviewDate,
        anDanh: true,
        diemLuongPhucLoi: rev.scores[0],
        diemDaoTao: rev.scores[1],
        diemQuanLy: rev.scores[2],
        diemVanHoa: rev.scores[3],
        diemVanPhong: rev.scores[4],
        khuyenLamViec: rev.recommend,
        coOtTot: rev.goodOt,
        noiDungUuDiem: rev.pros,
        noiDungCaiThien: rev.cons,
        trangThai: rev.status,
        lyDoTuChoi: rev.rejectReason ?? null,
        biBaoCao: Boolean(rev.reported),
        lyDoBaoCao: rev.reportReason ?? null,
        ngayBaoCao: rev.reported ? addDays(reviewDate, 1) : null,
      },
    });

    if (rev.status === 'CHO_DUYET') {
      await prisma.thongBao.create({
        data: {
          maTaiKhoan: adminAccountId,
          tieuDe: `Đánh giá công ty mới chờ duyệt: ${comp.tenCongTy}`,
          noiDung: `Có bài đánh giá mới (${avg}/5 sao) "${rev.title}" dành cho ${comp.tenCongTy} đang chờ Quản trị viên kiểm duyệt.`,
          trangThai: 'CHUA_DOC',
          ngayTao: reviewDate,
        },
      });
    } else if (rev.reported) {
      await prisma.thongBao.create({
        data: {
          maTaiKhoan: adminAccountId,
          tieuDe: `Báo cáo vi phạm đánh giá từ ${comp.tenCongTy}`,
          noiDung: `${comp.tenCongTy} vừa báo cáo vi phạm bài đánh giá "${rev.title}". Lý do: ${rev.reportReason}`,
          trangThai: 'CHUA_DOC',
          ngayTao: addDays(reviewDate, 1),
        },
      });
    }
  }

  console.log(
    '✅ Đã mở rộng 42 Ứng viên, 11 HR/NTD (3 chờ duyệt), 4 Tin IT, 42 Đơn ứng tuyển (+10 trúng tuyển & đánh giá ứng viên), 18 Đánh giá công ty & 15 Giao dịch 2026!',
  );
}
