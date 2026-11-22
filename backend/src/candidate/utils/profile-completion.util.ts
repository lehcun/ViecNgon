export const MIN_PROFILE_COMPLETION_FOR_CV = 70;

export interface CandidateCompletionSource {
  tenUngVien?: string | null;
  chuyenMon?: string | null;
  ngaySinh?: Date | string | null;
  diaChi?: string | null;
  gioiThieuBanThan?: string | null;
  taiKhoan?: {
    tenNguoiDung?: string | null;
    sdt?: string | null;
  } | null;
  kinhNghiems?: readonly unknown[] | null;
  hocVans?: readonly unknown[] | null;
  kyNangs?: readonly unknown[] | null;
  chungChis?: readonly unknown[] | null;
  portfolios?: readonly unknown[] | null;
}

function stripHtmlText(raw?: string | null): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tính tỷ lệ hoàn thiện hồ sơ ứng viên (%) theo 7 nhóm trọng số chuẩn (tổng tối đa 100%):
 * - Thông tin cá nhân: 1%/trường (5 trường cơ bản => tối đa 5%)
 * - Giới thiệu bản thân (> 10 ký tự sau lọc HTML): 10%
 * - Học vấn (>= 1 mục): 15%
 * - Kinh nghiệm làm việc (+10%/nơi làm, tối đa 3 nơi): 30%
 * - Dự án nổi bật (+10%/dự án, tối đa 2 dự án): 20%
 * - Kỹ năng (+5%/kỹ năng, tối đa 3 kỹ năng): 15%
 * - Chứng chỉ (>= 1 mục): 5%
 */
export function calculateCandidateProfileCompletion(
  profile?: CandidateCompletionSource | null,
): number {
  if (!profile) return 0;

  const personalChecks = [
    Boolean(
      profile.tenUngVien?.trim() || profile.taiKhoan?.tenNguoiDung?.trim(),
    ),
    Boolean(profile.chuyenMon?.trim()),
    Boolean(profile.taiKhoan?.sdt?.trim()),
    Boolean(profile.ngaySinh),
    Boolean(profile.diaChi?.trim()),
  ];
  const personalScore = personalChecks.filter(Boolean).length; // 0..5%

  const aboutMeScore =
    stripHtmlText(profile.gioiThieuBanThan).length > 10 ? 10 : 0;
  const educationScore = (profile.hocVans?.length ?? 0) > 0 ? 15 : 0;
  const experienceScore = Math.min(3, profile.kinhNghiems?.length ?? 0) * 10;
  const portfolioScore = Math.min(2, profile.portfolios?.length ?? 0) * 10;
  const skillScore = Math.min(3, profile.kyNangs?.length ?? 0) * 5;
  const certificateScore = (profile.chungChis?.length ?? 0) > 0 ? 5 : 0;

  const total =
    personalScore +
    aboutMeScore +
    educationScore +
    experienceScore +
    portfolioScore +
    skillScore +
    certificateScore;

  return Math.min(100, total);
}

/**
 * Kiểm tra hồ sơ ứng viên có đủ điều kiện (>= 70%) để tạo, xem và dùng CV hệ thống ứng tuyển.
 */
export function isCandidateEligibleForCv(
  profile?: CandidateCompletionSource | null,
): boolean {
  return (
    calculateCandidateProfileCompletion(profile) >=
    MIN_PROFILE_COMPLETION_FOR_CV
  );
}
