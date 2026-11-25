import type {
  CompanyReviewItem,
  ReviewModerationStatus,
} from "./reviews.mock";

export const REVIEW_REPORT_REASONS = [
  "Ngôn từ thô tục, xúc phạm hoặc công kích cá nhân đích danh",
  "Thông tin sai sự thật, vu khống gây ảnh hưởng uy tín doanh nghiệp",
  "Tiết lộ thông tin bảo mật, dữ liệu nội bộ hoặc khách hàng",
  "Nội dung spam, quảng cáo hoặc đánh giá ảo từ đối thủ",
] as const;

export const REVIEW_STATUS_META: Record<
  ReviewModerationStatus,
  { label: string; badgeClass: string }
> = {
  CHO_DUYET: {
    label: "Chờ duyệt",
    badgeClass:
      "bg-warning-light text-warning-text border border-warning-border",
  },
  DA_DUYET: {
    label: "Đã duyệt",
    badgeClass:
      "bg-success-light text-success-text border border-success-border",
  },
  TU_CHOI: {
    label: "Từ chối",
    badgeClass: "bg-danger-light text-danger-text border border-danger-border",
  },
  DA_AN: {
    label: "Đã ẩn",
    badgeClass:
      "bg-surface-muted text-text-secondary border border-border-default",
  },
};

export type AdminKpiPeriod = "today" | "week" | "month";

export const ADMIN_REVIEWS_GROWTH_MOCK: Record<
  AdminKpiPeriod,
  { total: number; pending: number; reported: number; approved: number }
> = {
  today: { total: 3, pending: 2, reported: 1, approved: 1 },
  week: { total: 11, pending: 4, reported: 2, approved: 7 },
  month: { total: 28, pending: 9, reported: 4, approved: 19 },
};

export const MOCK_ADMIN_REVIEWS: CompanyReviewItem[] = [
  {
    id: "adm-rev-1",
    companyName: "FPT Software",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/512px-FPT_logo_2010.svg.png",
    authorName: "Đặng Tuấn Kiệt",
    authorRole: "Senior Java Backend",
    anDanh: true,
    daXacThuc: true,
    nguonXacThuc: "TUYEN_DUNG_VIECNGON",
    trangThai: "CHO_DUYET",
    rating: 4.4,
    diemLuongPhucLoi: 4,
    diemDaoTao: 5,
    diemQuanLy: 4,
    diemVanHoa: 5,
    diemVanPhong: 4,
    khuyenLamViec: true,
    coOtTot: true,
    tieuDe: "Quy trình phỏng vấn chuyên nghiệp, nhiều dự án Global lớn",
    noiDung:
      "Phỏng vấn kỹ thuật hỏi sâu về kiến trúc Microservices và thực tế xử lý sự cố production. HR phản hồi kết quả nhanh trong 3 ngày.",
    noiDungUuDiem:
      "Có lộ trình nâng bậc rõ ràng, hỗ trợ chi phí học chứng chỉ Cloud.",
    noiDungCaiThien:
      "Một số dự án yêu cầu onsite khách hàng nên thời gian di chuyển hơi xa.",
    createdAt: "2026-11-25T08:15:00.000Z",
  },
  {
    id: "adm-rev-2",
    companyName: "VNG Corporation",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/VNG_Corp._logo.svg/512px-VNG_Corp._logo.svg.png",
    authorName: "Phạm Quốc Anh",
    authorRole: "DevOps Engineer",
    anDanh: true,
    daXacThuc: true,
    nguonXacThuc: "KINH_NGHIEM_CV",
    trangThai: "CHO_DUYET",
    rating: 4.6,
    diemLuongPhucLoi: 5,
    diemDaoTao: 4,
    diemQuanLy: 5,
    diemVanHoa: 5,
    diemVanPhong: 4,
    khuyenLamViec: true,
    coOtTot: true,
    tieuDe: "Hạ tầng quy mô lớn, bài toán kỹ thuật rất đã tay",
    noiDung:
      "Được vận hành cụm Kubernetes hàng trăm node, đồng đội kỹ thuật giỏi và sẵn sàng mentor.",
    noiDungUuDiem: "Văn phòng Campus hiện đại, phúc lợi ăn trưa và gym tốt.",
    noiDungCaiThien: "Lịch trực on-call cuối tuần cần luân phiên đều hơn.",
    createdAt: "2026-11-24T17:40:00.000Z",
  },
  {
    id: "adm-rev-3",
    companyName: "Shopee Vietnam",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/512px-Shopee.svg.png",
    authorName: "Tài khoản ẩn danh",
    authorRole: "Frontend Developer",
    anDanh: true,
    daXacThuc: false,
    nguonXacThuc: "KINH_NGHIEM_CV",
    trangThai: "DA_DUYET",
    biBaoCao: true,
    lyDoBaoCao:
      "Thông tin sai sự thật, vu khống gây ảnh hưởng uy tín doanh nghiệp — Bài viết nêu đích danh quản lý và công bố thông tin nội bộ dự án chưa phát hành.",
    ngayBaoCao: "2026-11-24T14:20:00.000Z",
    rating: 1.6,
    diemLuongPhucLoi: 2,
    diemDaoTao: 2,
    diemQuanLy: 1,
    diemVanHoa: 1,
    diemVanPhong: 2,
    khuyenLamViec: false,
    coOtTot: false,
    tieuDe: "Dự án thay đổi yêu cầu liên tục, quản lý thiếu minh bạch",
    noiDung:
      "Lịch release dồn dập cuối tháng, thiếu tài liệu bàn giao rõ ràng cho thành viên mới vào team.",
    noiDungUuDiem: "Lương cứng tương đối cạnh tranh so với mặt bằng chung.",
    noiDungCaiThien:
      "Cần cải thiện cách giao tiếp giữa quản lý và kỹ sư, tránh đổi scope đột ngột.",
    createdAt: "2026-11-22T10:05:00.000Z",
  },
  {
    id: "adm-rev-4",
    companyName: "MoMo",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    authorName: "Trần Thảo Vy",
    authorRole: "Middle Frontend Engineer",
    anDanh: false,
    daXacThuc: true,
    nguonXacThuc: "EMAIL_CONG_TY",
    trangThai: "DA_DUYET",
    phanHoiCongTy:
      "Cảm ơn Thảo Vy đã đồng hành cùng đội ngũ Product Engineering của MoMo!",
    ngayPhanHoiCongTy: "2026-11-21T09:00:00.000Z",
    rating: 4.8,
    diemLuongPhucLoi: 5,
    diemDaoTao: 5,
    diemQuanLy: 5,
    diemVanHoa: 5,
    diemVanPhong: 4,
    khuyenLamViec: true,
    coOtTot: true,
    tieuDe: "Văn hóa sản phẩm cởi mở, tốc độ phát triển nhanh",
    noiDung:
      "Kỹ sư được trao quyền chủ động tối ưu hiệu năng ứng dụng phục vụ hàng chục triệu người dùng.",
    noiDungUuDiem: "Sếp lắng nghe góp ý, gói bảo hiểm sức khỏe tốt.",
    noiDungCaiThien: "Khu vực giữ xe giờ cao điểm hơi đông.",
    createdAt: "2026-11-20T13:30:00.000Z",
  },
  {
    id: "adm-rev-5",
    companyName: "NAB Innovation Centre",
    authorName: "Người dùng ẩn danh",
    authorRole: "Software Engineer",
    anDanh: true,
    daXacThuc: false,
    nguonXacThuc: "KINH_NGHIEM_CV",
    trangThai: "TU_CHOI",
    lyDoTuChoi:
      "Nội dung chứa từ ngữ công kích cá nhân không phù hợp với tiêu chuẩn cộng đồng ViecNgon.",
    rating: 1.0,
    diemLuongPhucLoi: 1,
    diemDaoTao: 1,
    diemQuanLy: 1,
    diemVanHoa: 1,
    diemVanPhong: 1,
    khuyenLamViec: false,
    coOtTot: false,
    tieuDe: "Đánh giá spam không có nội dung cụ thể",
    noiDung: "Không nên làm ở đây, toàn làm màu...",
    noiDungUuDiem: "Không có",
    noiDungCaiThien: "Đổi hết quản lý",
    createdAt: "2026-11-18T11:10:00.000Z",
  },
];
