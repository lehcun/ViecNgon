export type ReviewVerificationSource =
  | "TUYEN_DUNG_VIECNGON"
  | "KINH_NGHIEM_CV"
  | "EMAIL_CONG_TY";

export interface CompanyReviewItem {
  id: string;
  authorName: string;
  authorRole: string;
  anDanh: boolean;
  daXacThuc: boolean;
  nguonXacThuc: ReviewVerificationSource;
  rating: number;
  diemLuongPhucLoi: number;
  diemDaoTao: number;
  diemQuanLy: number;
  diemVanHoa: number;
  diemVanPhong: number;
  khuyenLamViec: boolean;
  coOtTot: boolean;
  tieuDe: string;
  noiDung: string;
  noiDungUuDiem: string;
  noiDungCaiThien: string;
  createdAt: string;
}

export type CandidateEvalResult = "DAT" | "CAN_NHAC" | "CHUA_PHU_HOP";

export interface CandidateEvaluationItem {
  id: string;
  evaluatorName: string;
  evaluatorRole: string;
  rating: number;
  diemChuyenMon: number;
  diemThaiDo: number;
  diemGiaiQuyetVanDe: number;
  diemPhuHopVanHoa: number;
  ketQuaDanhGia: CandidateEvalResult;
  tieuDe: string;
  noiDung: string;
  chiaSeUngVien: boolean;
  createdAt: string;
}

export const COMPANY_CRITERIA_META = [
  { key: "diemLuongPhucLoi", label: "Lương thưởng & Phúc lợi" },
  { key: "diemDaoTao", label: "Đào tạo & Gắn kết" },
  { key: "diemQuanLy", label: "Sự quan tâm của Quản lý" },
  { key: "diemVanHoa", label: "Văn hóa & Môi trường" },
  { key: "diemVanPhong", label: "Văn phòng & Không gian" },
] as const;

export const CANDIDATE_CRITERIA_META = [
  { key: "diemChuyenMon", label: "Năng lực chuyên môn" },
  { key: "diemThaiDo", label: "Thái độ & Giao tiếp" },
  { key: "diemGiaiQuyetVanDe", label: "Tư duy giải quyết vấn đề" },
  { key: "diemPhuHopVanHoa", label: "Phù hợp văn hóa đội ngũ" },
] as const;

export const VERIFICATION_SOURCE_LABEL: Record<
  ReviewVerificationSource,
  string
> = {
  TUYEN_DUNG_VIECNGON: "Đã xác thực qua ViecNgon",
  KINH_NGHIEM_CV: "Xác thực từ kinh nghiệm CV",
  EMAIL_CONG_TY: "Xác thực qua Email công ty",
};

export const EVAL_RESULT_META: Record<
  CandidateEvalResult,
  { label: string; badgeClass: string; activeClass: string }
> = {
  DAT: {
    label: "Đạt yêu cầu",
    badgeClass:
      "bg-success-light text-success-text border border-success-border",
    activeClass:
      "bg-success-light text-success-text border-success ring-2 ring-success/20",
  },
  CAN_NHAC: {
    label: "Cân nhắc thêm",
    badgeClass:
      "bg-warning-light text-warning-text border border-warning-border",
    activeClass:
      "bg-warning-light text-warning-text border-warning ring-2 ring-warning/20",
  },
  CHUA_PHU_HOP: {
    label: "Chưa phù hợp",
    badgeClass: "bg-danger-light text-danger-text border border-danger-border",
    activeClass:
      "bg-danger-light text-danger-text border-danger ring-2 ring-danger/20",
  },
};

export const MOCK_COMPANY_REVIEWS: CompanyReviewItem[] = [
  {
    id: "mock-comp-rev-1",
    authorName: "Nguyễn Minh Tuấn",
    authorRole: "Senior Backend Engineer",
    anDanh: true,
    daXacThuc: true,
    nguonXacThuc: "TUYEN_DUNG_VIECNGON",
    rating: 4.8,
    diemLuongPhucLoi: 5,
    diemDaoTao: 5,
    diemQuanLy: 5,
    diemVanHoa: 5,
    diemVanPhong: 4,
    khuyenLamViec: true,
    coOtTot: true,
    tieuDe: "Môi trường kỹ thuật bài bản, đồng nghiệp hỗ trợ nhiệt tình",
    noiDung:
      "Quy trình code review và CI/CD rõ ràng, team tech sẵn sàng chia sẻ kiến thức và tạo điều kiện thử nghiệm công nghệ mới.",
    noiDungUuDiem:
      "Lương thưởng minh bạch đúng hạn, có ngân sách thi chứng chỉ AWS/Cloud, chính sách làm việc hybrid linh hoạt.",
    noiDungCaiThien:
      "Một vài dự án cao điểm cuối quý vẫn cần họp khá nhiều, nên tinh gọn quy trình báo cáo.",
    createdAt: "2026-11-18T09:30:00.000Z",
  },
  {
    id: "mock-comp-rev-2",
    authorName: "Trần Thảo Vy",
    authorRole: "Middle Frontend Engineer",
    anDanh: false,
    daXacThuc: true,
    nguonXacThuc: "EMAIL_CONG_TY",
    rating: 4.4,
    diemLuongPhucLoi: 4,
    diemDaoTao: 5,
    diemQuanLy: 4,
    diemVanHoa: 5,
    diemVanPhong: 4,
    khuyenLamViec: true,
    coOtTot: true,
    tieuDe: "Phù hợp cho kỹ sư muốn phát triển sâu về sản phẩm",
    noiDung:
      "Được tham gia trực tiếp từ khâu thiết kế kiến trúc giao diện cùng Product và Designer, không bị gò bó rập khuôn.",
    noiDungUuDiem:
      "Văn hóa cởi mở, sếp lắng nghe góp ý, có bảo hiểm sức khỏe cao cấp và khám định kỳ hằng năm.",
    noiDungCaiThien:
      "Chỗ gửi xe giờ cao điểm hơi đông, khu vực pantry nên mở rộng thêm.",
    createdAt: "2026-11-05T14:15:00.000Z",
  },
  {
    id: "mock-comp-rev-3",
    authorName: "Lê Hoàng Anh",
    authorRole: "QA Automation Engineer",
    anDanh: true,
    daXacThuc: true,
    nguonXacThuc: "KINH_NGHIEM_CV",
    rating: 3.6,
    diemLuongPhucLoi: 4,
    diemDaoTao: 3,
    diemQuanLy: 4,
    diemVanHoa: 4,
    diemVanPhong: 3,
    khuyenLamViec: false,
    coOtTot: false,
    tieuDe: "Chế độ ổn nhưng áp lực release cuối sprint khá cao",
    noiDung:
      "Nhìn chung đãi ngộ tương xứng mặt bằng chung thị trường IT, tuy nhiên lịch release dày nên QA thường phải tăng ca trước ngày go-live.",
    noiDungUuDiem:
      "Đội ngũ dev hợp tác tốt, trả lương OT đầy đủ theo luật và có phụ cấp ăn tối.",
    noiDungCaiThien:
      "Cần phân bổ lại timeline sprint để giảm áp lực kiểm thử gấp gáp vào cuối tuần.",
    createdAt: "2026-10-21T11:00:00.000Z",
  },
];

export const MOCK_CANDIDATE_EVALUATIONS: CandidateEvaluationItem[] = [
  {
    id: "mock-cand-eval-1",
    evaluatorName: "Phạm Quang Huy",
    evaluatorRole: "Engineering Manager",
    rating: 4.5,
    diemChuyenMon: 5,
    diemThaiDo: 5,
    diemGiaiQuyetVanDe: 4,
    diemPhuHopVanHoa: 4,
    ketQuaDanhGia: "DAT",
    tieuDe: "Nền tảng kiến trúc tốt, phản biện kỹ thuật sắc bén",
    noiDung:
      "Ứng viên nắm chắc thiết kế hệ thống phân tán, phân tích rõ đánh đổi giữa hiệu năng và chi phí bảo trì. Giao tiếp mạch lạc, chủ động đặt câu hỏi về bài toán thực tế của đội ngũ.",
    chiaSeUngVien: true,
    createdAt: "2026-11-22T10:15:00.000Z",
  },
  {
    id: "mock-cand-eval-2",
    evaluatorName: "Nguyễn Phương Linh",
    evaluatorRole: "Senior HRBP",
    rating: 4.0,
    diemChuyenMon: 4,
    diemThaiDo: 5,
    diemGiaiQuyetVanDe: 3,
    diemPhuHopVanHoa: 4,
    ketQuaDanhGia: "CAN_NHAC",
    tieuDe: "Thái độ chuyên nghiệp, cần làm rõ thêm kỳ vọng mức lương",
    noiDung:
      "Tác phong đúng giờ, trả lời trung thực về kinh nghiệm dự án trước đây và định hướng nghề nghiệp 2 năm tới. Nên trao đổi thêm ở vòng offer về mức lương kỳ vọng.",
    chiaSeUngVien: false,
    createdAt: "2026-11-20T15:40:00.000Z",
  },
];

export function computeCompanyReviewStats(reviews: CompanyReviewItem[]) {
  const count = reviews.length;
  if (count === 0) {
    return {
      avg: 0,
      recommendPct: 0,
      otPct: 0,
      criteriaAvg: {
        diemLuongPhucLoi: 0,
        diemDaoTao: 0,
        diemQuanLy: 0,
        diemVanHoa: 0,
        diemVanPhong: 0,
      },
      distribution: [5, 4, 3, 2, 1].map((s) => ({ star: s, count: 0, pct: 0 })),
    };
  }

  const avgOf = (getter: (item: CompanyReviewItem) => number) =>
    Number((reviews.reduce((s, r) => s + getter(r), 0) / count).toFixed(1));

  return {
    avg: avgOf((r) => r.rating),
    recommendPct: Math.round(
      (reviews.filter((r) => r.khuyenLamViec).length / count) * 100,
    ),
    otPct: Math.round((reviews.filter((r) => r.coOtTot).length / count) * 100),
    criteriaAvg: {
      diemLuongPhucLoi: avgOf((r) => r.diemLuongPhucLoi),
      diemDaoTao: avgOf((r) => r.diemDaoTao),
      diemQuanLy: avgOf((r) => r.diemQuanLy),
      diemVanHoa: avgOf((r) => r.diemVanHoa),
      diemVanPhong: avgOf((r) => r.diemVanPhong),
    },
    distribution: [5, 4, 3, 2, 1].map((star) => {
      const matched = reviews.filter((r) => Math.round(r.rating) === star).length;
      return { star, count: matched, pct: Math.round((matched / count) * 100) };
    }),
  };
}
