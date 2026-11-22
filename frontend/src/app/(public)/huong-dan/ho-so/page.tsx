import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Info,
  Lock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hướng dẫn tính điểm & tối ưu hồ sơ | ViecNgon",
  description:
    "Bảng phân bổ trọng số phần trăm độ hoàn thiện hồ sơ và gợi ý lộ trình đạt mốc 70% để tạo và nộp CV trên ViecNgon.",
};

const WEIGHT_TABLE_ROWS = [
  {
    stt: 1,
    section: "Thông tin cá nhân",
    addRule: "+1% mỗi trường cơ bản: Họ tên, Chức danh, SĐT, Ngày sinh, Địa chỉ",
    removeRule: "-1% mỗi trường bị xóa trống",
    maxPercent: "5%",
    note: "Đảm bảo thông tin liên hệ chính xác cho nhà tuyển dụng",
  },
  {
    stt: 2,
    section: "Giới thiệu bản thân",
    addRule: "+10% khi đoạn giới thiệu có > 10 ký tự (sau lọc HTML)",
    removeRule: "-10% khi xóa hoặc còn ≤ 10 ký tự",
    maxPercent: "10%",
    note: "Tóm tắt mục tiêu nghề nghiệp và thế mạnh cốt lõi",
  },
  {
    stt: 3,
    section: "Học vấn",
    addRule: "+15% khi có ít nhất 1 mục học vấn",
    removeRule: "-15% khi xóa sạch học vấn (0 mục)",
    maxPercent: "15%",
    note: "Nền tảng bắt buộc phổ biến với ứng viên IT / Fresher",
  },
  {
    stt: 4,
    section: "Kinh nghiệm làm việc",
    addRule: "+10% / mỗi nơi làm (1 nơi = 10%, 2 nơi = 20%, ≥ 3 nơi = 30%)",
    removeRule: "-10% mỗi lần xóa 1 nơi (từ 3 xuống 0)",
    maxPercent: "30%",
    note: "Chặn trần tối đa ở 3 nơi làm việc",
  },
  {
    stt: 5,
    section: "Dự án nổi bật (Portfolio)",
    addRule: "+10% / mỗi dự án (1 dự án = 10%, ≥ 2 dự án = 20%)",
    removeRule: "-10% mỗi lần xóa 1 dự án (từ 2 xuống 0)",
    maxPercent: "20%",
    note: "Chặn trần tối đa ở 2 dự án nổi bật",
  },
  {
    stt: 6,
    section: "Kỹ năng",
    addRule: "+5% / mỗi kỹ năng (1 = 5%, 2 = 10%, ≥ 3 = 15%)",
    removeRule: "-5% mỗi lần xóa khi còn dưới 3 kỹ năng",
    maxPercent: "15%",
    note: "Chặn trần tối đa ở 3 kỹ năng chuyên môn",
  },
  {
    stt: 7,
    section: "Chứng chỉ",
    addRule: "+5% khi có ít nhất 1 chứng chỉ",
    removeRule: "-5% khi xóa sạch chứng chỉ (0 mục)",
    maxPercent: "5%",
    note: "Bổ sung lợi thế chuyên môn & ngoại ngữ / cloud",
  },
];

const CANDIDATE_SCENARIOS = [
  {
    title: "Ứng viên Fresher / mới ra trường (0% Kinh nghiệm làm việc)",
    badge: "Đạt 70% • Mở khóa CV",
    tone: "success" as const,
    formula:
      "Thông tin cá nhân (5%) + Giới thiệu (10%) + Học vấn (15%) + 3 Kỹ năng (15%) + 2 Dự án cá nhân (20%) + 1 Chứng chỉ (5%) = 70%",
    advice:
      "Dù chưa có kinh nghiệm đi làm chính thức, chỉ cần trình bày 2 đồ án/dự án thực tế và 1 chứng chỉ chuyên môn là đủ mốc 70% để mở khóa tạo, xem và nộp CV.",
  },
  {
    title: "Ứng viên đã đi làm (1 nơi làm, 1 dự án, chưa chứng chỉ)",
    badge: "Đạt 65% • Cần thêm 5%–10%",
    tone: "warning" as const,
    formula: "5% + 10% + 15% + 10% + 10% + 15% + 0% = 65%",
    advice:
      "Cần thêm 1 nơi làm việc (+10%), hoặc 1 dự án nổi bật (+10%), hoặc 1 chứng chỉ (+5%) là chạm mốc 70%–75% để sử dụng CV hệ thống ứng tuyển.",
  },
  {
    title: "Ứng viên chỉ mới nhập thông tin cơ bản",
    badge: "Đạt 45% • Đang khóa CV",
    tone: "danger" as const,
    formula: "5% + 10% + 15% + 15% = 45%",
    advice:
      "Chưa đạt mốc 70% nên tạm khóa tính năng Tạo CV, Xem CV và Dùng CV hệ thống gửi đơn (vẫn có thể ứng tuyển bằng liên kết CV ngoài như Google Drive / Notion).",
  },
];

export default function CandidateProfileGuidePage() {
  return (
    <div className="min-h-screen bg-surface-page pb-16">
      {/* Banner đầu trang (tối để hợp Navbar variant='public') */}
      <section className="bg-primary-dark text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/cv-profile"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Quay lại Hồ sơ của tôi
          </Link>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-blue-200 text-xs font-semibold">
              <Compass size={14} />
              Hướng dẫn hồ sơ ViecNgon
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai/25 border border-ai/50 text-indigo-200 text-xs font-semibold">
              <Sparkles size={13} />
              Mốc mở khóa CV: ≥ 70%
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Bảng phân bổ trọng số % &amp; Gợi ý hoàn thiện hồ sơ
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Hiểu rõ cách hệ thống cộng/trừ điểm hoàn thiện hồ sơ (tối đa 100%)
            và lộ trình nhanh nhất để đạt mốc 70% giúp mở khóa tạo CV, xem CV
            và ứng tuyển bằng CV hệ thống.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Khối 1: Bảng phân bổ trọng số % */}
        <section className="bg-surface-card rounded-2xl border border-border-default shadow-xs overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-main">
                Bảng phân bổ trọng số % đề xuất (Tổng = 100%)
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Công thức chỉ đánh giá trên dữ liệu hồ sơ thực tế, không tính
                file CV PDF đã tạo để tránh phụ thuộc vòng.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-light text-primary text-xs font-bold shrink-0">
              <Info size={14} />7 nhóm • Tối đa 100%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted/80 border-b border-border-default text-xs font-bold text-text-secondary uppercase tracking-wide">
                  <th className="py-3.5 px-4 text-center w-14">STT</th>
                  <th className="py-3.5 px-4">Mục trên hồ sơ</th>
                  <th className="py-3.5 px-4">Cách cộng (+)</th>
                  <th className="py-3.5 px-4">Cách trừ (-)</th>
                  <th className="py-3.5 px-4 text-center">Tối đa</th>
                  <th className="py-3.5 px-4">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {WEIGHT_TABLE_ROWS.map((row) => (
                  <tr
                    key={row.stt}
                    className="hover:bg-surface-muted/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-semibold text-text-muted tabular-nums">
                      {row.stt}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-text-main whitespace-nowrap">
                      {row.section}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {row.addRule}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {row.removeRule}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-bold text-xs tabular-nums">
                        {row.maxPercent}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">{row.note}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary-light/50 border-t border-border-default font-bold text-sm text-text-main">
                  <td colSpan={4} className="py-3.5 px-4 text-right">
                    TỔNG CỘNG (5 + 10 + 15 + 30 + 20 + 15 + 5)
                  </td>
                  <td className="py-3.5 px-4 text-center text-primary tabular-nums">
                    100%
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-text-secondary">
                    Mốc tối thiểu mở khóa CV: ≥ 70%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Khối 2: Gợi ý cho các nhóm ứng viên */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-main">
              Gợi ý lộ trình đạt mốc ≥ 70% cho từng nhóm ứng viên
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Tham khảo các tình huống thực tế dưới đây để tối ưu nhanh hồ sơ
              của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CANDIDATE_SCENARIOS.map((item) => {
              const badgeStyles =
                item.tone === "success"
                  ? "bg-success-light text-success-text border-success-border"
                  : item.tone === "warning"
                    ? "bg-warning-light text-warning-text border-warning-border"
                    : "bg-danger-soft text-danger-text border-danger-border";

              return (
                <div
                  key={item.title}
                  className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyles}`}
                    >
                      {item.tone === "success" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Lock size={13} />
                      )}
                      {item.badge}
                    </span>
                    <h3 className="font-bold text-text-main text-base leading-snug">
                      {item.title}
                    </h3>
                    <div className="rounded-xl bg-surface-muted/70 border border-border-subtle p-3 text-xs font-semibold text-primary leading-relaxed">
                      {item.formula}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.advice}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA footer */}
        <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-text-main text-base">
              Sẵn sàng nâng cấp hồ sơ lên 70% – 100%?
            </h3>
            <p className="text-sm text-text-muted mt-0.5">
              Bạn có thể nhập thủ công từng mục hoặc dùng AI bóc tách CV PDF tự
              động trong vài giây.
            </p>
          </div>
          <Link
            href="/cv-profile"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0"
          >
            Cập nhật hồ sơ ngay
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
