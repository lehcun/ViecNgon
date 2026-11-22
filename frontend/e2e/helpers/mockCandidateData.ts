import type { Page } from "@playwright/test";
import type {
  AppliedJobItem,
  CandidateProfileResponse,
  NotificationItemResponse,
} from "@viecngon/types";
import { mockAuthSession } from "./mockAuth";

export const MOCK_CANDIDATE_USER = {
  id: "uv-101",
  name: "Nguyễn Quang Ý",
  email: "quangy.dev@viecngon.vn",
  role: "UNGVIEN" as const,
};

export function createMockCandidateProfile(
  overrides: Partial<CandidateProfileResponse> = {},
): CandidateProfileResponse {
  return {
    candidateId: "cand-101",
    accountId: "uv-101",
    candidateName: "Nguyễn Quang Ý",
    dateOfBirth: "2002-05-18",
    gender: "Nam",
    yearsOfExperience: 2,
    avatarUrl: null,
    profession: "Frontend Developer (Next.js / React)",
    cvUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
    address: "120 Nguyễn Văn Linh, Đà Nẵng",
    aboutMe: "<p>Lập trình viên Frontend chuyên React, Next.js và TypeScript.</p>",
    defaultCvType: "PDF",
    defaultCvFileId: "cv-file-1",
    defaultCvFile: {
      id: "cv-file-1",
      fileName: "CV_Nguyen_Quang_Y.pdf",
      fileUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
      uploadedAt: new Date("2026-11-10T09:00:00.000Z"),
    },
    account: {
      email: "quangy.dev@viecngon.vn",
      userName: "Nguyễn Quang Ý",
      phoneNumber: "0905123456",
    },
    skills: [
      { skillId: "sk-1", skillName: "Next.js", level: "Senior" },
      { skillId: "sk-2", skillName: "TypeScript", level: "Middle" },
      { skillId: "sk-3", skillName: "NestJS", level: "Middle" },
    ],
    experiences: [
      {
        id: "exp-1",
        companyName: "FPT Software",
        position: "Frontend Engineer",
        startDate: "2024-01-01",
        endDate: null,
        description: "Phát triển hệ thống tuyển dụng bằng Next.js.",
      },
      {
        id: "exp-2",
        companyName: "ViecNgon Tech",
        position: "Backend Developer",
        startDate: "2022-06-01",
        endDate: "2023-12-01",
        description: "Xây dựng REST API NestJS và SQL Server.",
      },
      {
        id: "exp-3",
        companyName: "DaNang Lab",
        position: "Software Intern",
        startDate: "2021-06-01",
        endDate: "2022-05-01",
        description: "Tham gia phát triển giao diện web React.",
      },
    ],
    educations: [
      {
        id: "edu-1",
        schoolName: "Đại học Bách Khoa Đà Nẵng",
        major: "Kỹ thuật phần mềm",
        startDate: "2020-09-01",
        endDate: "2024-06-01",
        gpa: "3.6/4.0",
      },
    ],
    certificates: [
      {
        id: "cert-1",
        name: "AWS Certified Cloud Practitioner",
        organization: "Amazon Web Services",
        issueDate: "05/2025",
        expirationDate: null,
      },
    ],
    languages: [],
    uploadedCvs: [],
    portfolios: [
      {
        id: "port-1",
        title: "ViecNgon Recruitment Platform",
        description: "Nền tảng tuyển dụng IT tích hợp AI Match.",
        projectUrl: "https://github.com/demo/viecngon",
      },
      {
        id: "port-2",
        title: "Realtime Interview Scheduler",
        description: "Hệ thống đặt lịch phỏng vấn tự động qua Google Calendar.",
        projectUrl: "https://github.com/demo/scheduler",
      },
    ],
    ...overrides,
  };
}

export function createMockAppliedJobs(): AppliedJobItem[] {
  return [
    {
      applicationId: "app-201",
      appliedDate: "2026-11-12T08:30:00.000Z",
      applicationStatus: "PHONG_VAN",
      cvUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
      job: {
        id: "job-201",
        title: "NEXTJS DEVELOPER",
        slug: "nextjs-developer",
        location: "Đà Nẵng",
        workModel: "Hybrid",
        salaryDisplay: "25 - 35 triệu",
        status: "ACTIVE",
        deadline: "2026-12-30T00:00:00.000Z",
        company: {
          name: "MoMo",
          logo: null,
          slug: "momo",
        },
      },
    },
    {
      applicationId: "app-202",
      appliedDate: "2026-11-05T10:15:00.000Z",
      applicationStatus: "DA_XEM",
      cvUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
      job: {
        id: "job-202",
        title: "Senior React Engineer",
        slug: "senior-react-engineer",
        location: "TP.HCM",
        workModel: "Remote",
        salaryDisplay: "35 - 50 triệu",
        status: "ACTIVE",
        deadline: "2026-12-31T00:00:00.000Z",
        company: {
          name: "VNG Corporation",
          logo: null,
          slug: "vng-corporation",
        },
      },
    },
  ];
}

export function createMockNotifications(): NotificationItemResponse[] {
  return [
    {
      id: "noti-1",
      title: "Thư mời phỏng vấn từ MoMo",
      content:
        "Nhà tuyển dụng MoMo đã lên lịch phỏng vấn trực tuyến cho vị trí NEXTJS DEVELOPER.",
      status: "CHUA_DOC",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: "noti-2",
      title: "Nhà tuyển dụng đã xem CV của bạn",
      content: "VNG Corporation vừa xem hồ sơ ứng tuyển vị trí Senior React Engineer.",
      status: "CHUA_DOC",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "noti-3",
      title: "Chào mừng đến với ViecNgon",
      content: "Hoàn thiện hồ sơ để tăng cơ hội được nhà tuyển dụng liên hệ.",
      status: "DA_DOC",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export async function setupCandidateSessionWithBaseMocks(
  page: Page,
  options: {
    profile?: CandidateProfileResponse;
    appliedJobs?: AppliedJobItem[];
    notifications?: NotificationItemResponse[];
  } = {},
) {
  await mockAuthSession(page, MOCK_CANDIDATE_USER);

  const profileState = options.profile ?? createMockCandidateProfile();
  const appliedJobsState = options.appliedJobs ?? createMockAppliedJobs();
  const notificationsState = options.notifications ?? [];

  await page.route("**/candidate/profile", (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(profileState),
      });
    }
    return route.fallback();
  });

  await page.route("**/candidate/applied-jobs", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(appliedJobsState),
    }),
  );

  await page.route("**/candidate/notifications/unread-count", (route) => {
    const unread = notificationsState.filter(
      (n) => n.status === "CHUA_DOC",
    ).length;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: unread }),
    });
  });

  await page.route("**/candidate/notifications?*", (route) => {
    const url = new URL(route.request().url());
    const filter = url.searchParams.get("filter") || "ALL";
    const unreadCount = notificationsState.filter(
      (n) => n.status === "CHUA_DOC",
    ).length;
    const readCount = notificationsState.filter(
      (n) => n.status === "DA_DOC",
    ).length;
    const filtered =
      filter === "UNREAD"
        ? notificationsState.filter((n) => n.status === "CHUA_DOC")
        : filter === "READ"
          ? notificationsState.filter((n) => n.status === "DA_DOC")
          : notificationsState;

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: filtered,
        total: filtered.length,
        allCount: notificationsState.length,
        unreadCount,
        readCount,
        page: 1,
        limit: 50,
        totalPages: 1,
      }),
    });
  });

  return { profileState, appliedJobsState, notificationsState };
}
