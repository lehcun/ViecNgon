export const MIN_PROFILE_COMPLETION_FOR_CV = 70;

export interface CandidateCompletionSource {
  tenUngVien?: string | null;
  chuyenMon?: string | null;
  ngaySinh?: Date | string | null;
  diaChi?: string | null;
  gioiThieuBanThan?: string | null;
  maFileCvMacDinh?: string | null;
  cvUrl?: string | null;
  taiKhoan?: {
    tenNguoiDung?: string | null;
    sdt?: string | null;
  } | null;
  kinhNghiems?: readonly unknown[] | null;
  hocVans?: readonly unknown[] | null;
  kyNangs?: readonly unknown[] | null;
}

/**
 * Tính tỷ lệ hoàn thiện hồ sơ ứng viên (%) theo đúng 10 tiêu chí chuẩn của hệ thống.
 */
export function calculateCandidateProfileCompletion(
  profile?: CandidateCompletionSource | null,
): number {
  if (!profile) return 0;

  const checks = [
    Boolean(profile.tenUngVien || profile.taiKhoan?.tenNguoiDung),
    Boolean(profile.chuyenMon),
    Boolean(profile.taiKhoan?.sdt),
    Boolean(profile.ngaySinh),
    Boolean(profile.diaChi),
    Boolean(
      profile.gioiThieuBanThan && profile.gioiThieuBanThan.trim().length > 10,
    ),
    Boolean(profile.kinhNghiems && profile.kinhNghiems.length > 0),
    Boolean(profile.hocVans && profile.hocVans.length > 0),
    Boolean(profile.kyNangs && profile.kyNangs.length > 0),
    Boolean(profile.maFileCvMacDinh || profile.cvUrl),
  ];

  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
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
