import type { Page } from "@playwright/test";
import { mockAuthSession } from "./mockAuth";

export const EMPLOYER_AUTH_USER = {
  id: "hr-vng-1",
  name: "Nguyễn Minh Tuấn",
  email: "hr@vng.com.vn",
  role: "NHATUYENDUNG" as const,
};

export const ADMIN_AUTH_USER = {
  id: "admin-1",
  name: "Quản trị viên Hệ thống",
  email: "admin@viecngon.vn",
  role: "ADMIN" as const,
};

export function createMockRecruiterProfile() {
  return {
    recruiterId: "rec-vng-1",
    accountId: "hr-vng-1",
    companyId: "comp-vng",
    account: {
      email: "hr@vng.com.vn",
      userName: "Nguyễn Minh Tuấn",
      phoneNumber: "0901234567",
    },
    company: {
      name: "VNG Corporation",
      legalName: "Công ty Cổ phần VNG",
      slug: "vng-corporation",
      description: "<p>Build Technologies and Grow People.</p>",
      logo: null,
      website: "https://vng.com.vn",
      address: "Khu chế xuất Tân Thuận, Quận 7",
      city: "TP.HCM",
      industry: "Công nghệ thông tin",
      size: "1,000+ Kỹ sư",
    },
    statistics: {
      totalJobs: 3,
      totalViews: 420,
      totalApplications: 18,
    },
    recentApplicants: [
      {
        applicationId: "app-em-1",
        candidateName: "Nguyễn Quang Ý",
        jobTitle: "Senior Next.js Engineer",
        status: "CHO_DUYET",
        appliedAt: "2026-11-12T08:00:00.000Z",
      },
    ],
    jobs: {
      count: 3,
      list: [
        {
          id: "job-em-1",
          title: "Senior Next.js Engineer",
          slug: "senior-nextjs-engineer",
          location: "TP.HCM",
          salary: "35 - 50 triệu",
          status: "DA_DUYET",
          applicationsCount: 10,
          postedAt: "2026-11-10T08:00:00.000Z",
        },
        {
          id: "job-em-2",
          title: "Backend NestJS Developer",
          slug: "backend-nestjs-developer",
          location: "Hà Nội",
          salary: "25 - 40 triệu",
          status: "CHO_DUYET",
          applicationsCount: 4,
          postedAt: "2026-11-11T08:00:00.000Z",
        },
      ],
    },
  };
}

export function createMockRecruiterMetrics() {
  return {
    totalJobs: { count: 3, changeThisMonth: 2 },
    activeJobs: { count: 1 },
    pendingJobs: { count: 1, avgReviewTimeText: "~2h xét duyệt" },
    totalApplications: { count: 18, percentChangeThisWeek: 24 },
    averageResponseRate: 85,
  };
}

export function createMockEmployerCompanyProfile() {
  return {
    company: {
      maCongTy: "comp-vng",
      tenCongTy: "VNG Corporation",
      tenPhapLy: "Công ty Cổ phần VNG",
      slug: "vng-corporation",
      moTa: "<p>Doanh nghiệp công nghệ hàng đầu Việt Nam.</p>",
      phucLoi: "<p>Lương tháng 13, thưởng hiệu suất.</p>",
      chuyenMon: "<p>Cloud, AI, Fintech &amp; Web Platform.</p>",
      aboutMe: "Build Technologies and Grow People",
      logoUrl: null,
      website: "https://vng.com.vn",
      thanhPho: "TP.HCM",
      diaChi: "Z06 Đường số 13, Tân Thuận Đông, Quận 7",
      moHinhCongTy: "Product & Service",
      linhVuc: ["Công nghệ thông tin / Phần mềm", "Điện toán đám mây & AI"],
      quyMo: "1,000+ Kỹ sư",
      quocGia: "Toàn cầu & SEA",
      thoiGianLamViec: "Thứ 2 - Thứ 6",
      chinhSachOT: "Không OT / Thêm lương OT",
      giaiThuong: "Top 10 Doanh nghiệp CNTT Việt Nam",
      sectionImages: {
        introImages: [],
        cultureImages: [],
      },
    },
    hr: {
      maNTD: "rec-vng-1",
      hoTen: "Nguyễn Minh Tuấn",
      chucVu: "Talent Acquisition Lead",
      soDienThoai: "0901234567",
      email: "hr@vng.com.vn",
    },
    branches: [
      {
        maChiNhanh: "br-hcm-1",
        thanhPho: "TP.HCM",
        diaChi: "VNG Campus, Quận 7",
        mapUrl: null,
        viDo: 10.7295,
        kinhDo: 106.7218,
        laTruSoChinh: true,
      },
      {
        maChiNhanh: "br-hn-1",
        thanhPho: "Hà Nội",
        diaChi: "Tòa nhà Hoàng Thành, Hai Bà Trưng",
        mapUrl: null,
        viDo: 21.0285,
        kinhDo: 105.8542,
        laTruSoChinh: false,
      },
    ],
    completion: {
      percent: 92,
      missingFields: ["logoUrl"],
    },
    stats: {
      totalBranches: 2,
      averageRating: 4.8,
      totalReviews: 45,
    },
  };
}

export function createMockEmployerJobs() {
  return [
    {
      id: "job-em-1",
      title: "Senior Next.js Engineer",
      slug: "senior-nextjs-engineer",
      salaryDisplay: "35 - 50 triệu",
      minSalary: 35000000,
      maxSalary: 50000000,
      experienceYears: 3,
      level: "Senior",
      city: "TP.HCM",
      jobType: "Fulltime",
      workModel: "Hybrid",
      status: "DA_DUYET",
      postedAt: "2026-11-10T08:00:00.000Z",
      deadline: "2027-01-30T00:00:00.000Z",
      updatedAt: "2026-11-12T08:00:00.000Z",
      views: 250,
      applicationsCount: 10,
      skills: [
        { id: "skill-nextjs", name: "Next.js" },
        { id: "skill-ts", name: "TypeScript" },
      ],
      branch: {
        id: "br-hcm-1",
        city: "TP.HCM",
        address: "VNG Campus, Quận 7",
        isHeadquarter: true,
      },
      isExpired: false,
    },
    {
      id: "job-em-2",
      title: "Backend NestJS Developer",
      slug: "backend-nestjs-developer",
      salaryDisplay: "25 - 40 triệu",
      minSalary: 25000000,
      maxSalary: 40000000,
      experienceYears: 2,
      level: "Middle",
      city: "Hà Nội",
      jobType: "Fulltime",
      workModel: "Remote",
      status: "CHO_DUYET",
      postedAt: "2026-11-11T08:00:00.000Z",
      deadline: "2027-02-15T00:00:00.000Z",
      updatedAt: "2026-11-11T08:00:00.000Z",
      views: 85,
      applicationsCount: 4,
      skills: [{ id: "skill-nestjs", name: "NestJS" }],
      branch: null,
      isExpired: false,
    },
    {
      id: "job-em-3",
      title: "QA Automation Playwright",
      slug: "qa-automation-playwright",
      salaryDisplay: "20 - 30 triệu",
      minSalary: 20000000,
      maxSalary: 30000000,
      experienceYears: 2,
      level: "Junior",
      city: "Đà Nẵng",
      jobType: "Fulltime",
      workModel: "Hybrid",
      status: "HET_HAN",
      postedAt: "2026-09-01T08:00:00.000Z",
      deadline: "2026-10-01T00:00:00.000Z",
      updatedAt: "2026-10-02T08:00:00.000Z",
      views: 110,
      applicationsCount: 4,
      skills: [{ id: "skill-ts", name: "TypeScript" }],
      branch: null,
      isExpired: true,
    },
  ];
}

export function createMockEmployerApplications() {
  return [
    {
      applicationId: "app-em-1",
      candidateId: "uv-1",
      candidateName: "Nguyễn Quang Ý",
      avatarUrl: null,
      contactEmail: "quangy.dev@viecngon.vn",
      jobId: "job-em-1",
      jobTitle: "Senior Next.js Engineer",
      appliedAt: "2026-11-12T08:30:00.000Z",
      status: "CHO_DUYET",
      cvUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
      aiMatchScore: 88,
    },
    {
      applicationId: "app-em-2",
      candidateId: "uv-2",
      candidateName: "Lê Hoàng Nam",
      avatarUrl: null,
      contactEmail: "nam.le@viecngon.vn",
      jobId: "job-em-2",
      jobTitle: "Backend NestJS Developer",
      appliedAt: "2026-11-11T09:15:00.000Z",
      status: "PHONG_VAN",
      cvUrl: "https://cdn.viecngon.vn/cv/le-hoang-nam.pdf",
      aiMatchScore: 76,
    },
    {
      applicationId: "app-em-3",
      candidateId: "uv-3",
      candidateName: "Phạm Minh Đức",
      avatarUrl: null,
      contactEmail: "duc.pham@viecngon.vn",
      jobId: "job-em-3",
      jobTitle: "QA Automation Playwright",
      appliedAt: "2026-11-10T10:00:00.000Z",
      status: "BI_LOAI",
      cvUrl: "https://cdn.viecngon.vn/cv/pham-minh-duc.pdf",
      aiMatchScore: 42,
    },
  ];
}

export function createMockEmployerApplicationDetail() {
  return {
    applicationId: "app-em-1",
    appliedAt: "2026-11-12T08:30:00.000Z",
    status: "CHO_DUYET",
    coverLetter: "Tôi có 3 năm kinh nghiệm phát triển Next.js & TypeScript.",
    cvUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
    jobId: "job-em-1",
    jobTitle: "Senior Next.js Engineer",
    candidateId: "uv-1",
    candidateName: "Nguyễn Quang Ý",
    avatarUrl: null,
    profession: "Frontend Developer (Next.js / React)",
    aboutMe: "<p>Chuyên sâu React, Next.js 16 và tối ưu hiệu năng Web.</p>",
    contact: {
      email: "quangy.dev@viecngon.vn",
      phoneNumber: "0912345678",
      address: "Quận 1, TP.HCM",
    },
    skills: [
      { skillName: "Next.js", level: "Thành thạo" },
      { skillName: "TypeScript", level: "Thành thạo" },
    ],
    experiences: [
      {
        id: "exp-1",
        companyName: "TechCorp Vietnam",
        position: "Frontend Developer",
        startDate: "2024-01-01T00:00:00.000Z",
        endDate: null,
        description: "Phát triển cổng tuyển dụng Next.js.",
      },
    ],
    educations: [
      {
        id: "edu-1",
        schoolName: "ĐH Bách Khoa TP.HCM",
        major: "Kỹ thuật Phần mềm",
        startDate: "2020-09-01T00:00:00.000Z",
        endDate: "2024-06-01T00:00:00.000Z",
        gpa: "3.6",
      },
    ],
  };
}

export function createMockAiAnalysis() {
  return {
    matchScore: 88,
    strengths: [
      "Kinh nghiệm thực chiến Next.js & TypeScript khớp yêu cầu",
      "Nền tảng kỹ thuật phần mềm vững chắc",
    ],
    weaknesses: ["Chưa thể hiện nhiều kinh nghiệm làm việc với Redis Cache"],
    summary:
      "Ứng viên phù hợp cao với vị trí Senior Next.js Engineer, sẵn sàng phỏng vấn chuyên môn.",
    breakdown: {
      skillsScore: 92,
      experienceScore: 85,
      educationScore: 88,
      domainScore: 86,
    },
    analyzedAt: "2026-11-12T08:35:00.000Z",
    cached: true,
  };
}

export async function setupEmployerSessionWithBaseMocks(page: Page) {
  await mockAuthSession(page, EMPLOYER_AUTH_USER);

  const recruiterProfile = createMockRecruiterProfile();
  const companyProfile = createMockEmployerCompanyProfile();

  await page.route("http://localhost:3001/recruiter/profile", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(recruiterProfile),
    }),
  );

  await page.route("http://localhost:3001/recruiter/job/metrics", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createMockRecruiterMetrics()),
    }),
  );

  await page.route("http://localhost:3001/employer/profile", async (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(companyProfile),
      });
    }
    return route.fallback();
  });

  await page.route("http://localhost:3001/skill/all", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "skill-nextjs", name: "Next.js" },
        { id: "skill-ts", name: "TypeScript" },
        { id: "skill-nestjs", name: "NestJS" },
      ]),
    }),
  );

  await page.route("http://localhost:3001/notifications*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [],
        total: 0,
        allCount: 0,
        unreadCount: 0,
        readCount: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
    }),
  );
}

export async function setupAdminDashboardMocks(page: Page) {
  await mockAuthSession(page, ADMIN_AUTH_USER);

  await page.route("http://localhost:3001/admin/dashboard/metrics", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        totalUsers: {
          count: 1540,
          candidatesCount: 1320,
          employersCount: 220,
          growthPercent: 18,
        },
        pendingJobs: {
          count: 7,
          requiresImmediateReview: true,
        },
        totalApplications: {
          count: 3420,
          growthPercent: 14,
        },
        platformRevenue: {
          totalAmount: 125000000,
          formattedAmount: "125.000.000 ₫",
          growthPercent: 22,
        },
      }),
    }),
  );

  await page.route("http://localhost:3001/admin/dashboard/charts?*", (route) => {
    const url = new URL(route.request().url());
    const period = url.searchParams.get("period") || "monthly";
    const totalByPeriod: Record<string, number> = {
      monthly: 320,
      quarterly: 890,
      yearly: 1540,
    };

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        period,
        subtitle: `Thống kê đăng ký mới (${period})`,
        currentPeriodTotal: totalByPeriod[period] ?? 320,
        growthPercent: 15,
        comparisonLabel: "so với kỳ trước",
        summary: {
          candidates: period === "yearly" ? 1320 : 280,
          employers: period === "yearly" ? 220 : 40,
        },
        data: [
          { label: "Kỳ 1", candidates: 120, employers: 18, total: 138 },
          { label: "Kỳ 2", candidates: 160, employers: 22, total: 182 },
        ],
      }),
    });
  });

  await page.route(
    "http://localhost:3001/admin/dashboard/application-stats?*",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          period: "monthly",
          totalApplications: 420,
          changePercentage: 12,
          averageResponseRate: 84,
          interviewRate: 32,
          hiredRate: 11,
          breakdown: [
            {
              status: "CHO_DUYET",
              label: "Chờ duyệt",
              count: 140,
              percentage: 33,
              color: "#F59E0B",
            },
            {
              status: "PHONG_VAN",
              label: "Phỏng vấn",
              count: 110,
              percentage: 26,
              color: "#2563EB",
            },
            {
              status: "TRUNG_TUYEN",
              label: "Trúng tuyển",
              count: 46,
              percentage: 11,
              color: "#16A34A",
            },
          ],
        }),
      }),
  );

  await page.route(
    "http://localhost:3001/admin/dashboard/revenue-breakdown",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          totalRevenue: 125000000,
          formattedTotalRevenue: "125.000.000 ₫",
          shortTotalRevenue: "125 Tr",
          growthPercent: 22,
          periodLabel: "Tháng 11/2026",
          packages: [
            {
              packageName: "Gói Kim Cương / Diamond",
              amount: 75000000,
              formattedAmount: "75.000.000 ₫",
              percentage: 60,
              color: "#2563EB",
            },
            {
              packageName: "Gói VIP Đẩy Tin / Pro",
              amount: 50000000,
              formattedAmount: "50.000.000 ₫",
              percentage: 40,
              color: "#16A34A",
            },
          ],
        }),
      }),
  );

  await page.route(
    "http://localhost:3001/admin/dashboard/recent-transactions",
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "tx-1",
            transactionCode: "VN-PAY-20261115",
            companyName: "VNG Corporation",
            companyLogo: null,
            packageName: "Gói Kim Cương / Diamond",
            amount: 5900000,
            formattedAmount: "5.900.000 ₫",
            paidAt: "2026-11-15T10:30:00.000Z",
            status: "PAID",
          },
        ]),
      }),
  );
}
