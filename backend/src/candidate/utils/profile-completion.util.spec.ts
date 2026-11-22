import {
  MIN_PROFILE_COMPLETION_FOR_CV,
  calculateCandidateProfileCompletion,
  isCandidateEligibleForCv,
} from './profile-completion.util';

describe('profile-completion.util', () => {
  it('trả về 0% khi profile null hoặc undefined', () => {
    expect(calculateCandidateProfileCompletion(null)).toBe(0);
    expect(calculateCandidateProfileCompletion(undefined)).toBe(0);
    expect(isCandidateEligibleForCv(null)).toBe(false);
  });

  it('tính đúng 40% và chưa đủ mốc 70% khi mới có 4 tiêu chí', () => {
    const partial = {
      tenUngVien: 'Nguyễn Văn A',
      chuyenMon: 'Backend Engineer',
      taiKhoan: { sdt: '0901234567' },
      ngaySinh: new Date('2000-01-01'),
    };
    expect(calculateCandidateProfileCompletion(partial)).toBe(40);
    expect(isCandidateEligibleForCv(partial)).toBe(false);
  });

  it('đạt ngưỡng >= 70% khi hoàn thiện đủ 7/10 tiêu chí dù chưa có CV', () => {
    const eligible = {
      tenUngVien: 'Nguyễn Văn A',
      chuyenMon: 'Fullstack Engineer',
      taiKhoan: { sdt: '0901234567' },
      ngaySinh: new Date('2000-01-01'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>Kỹ sư phần mềm với 3 năm kinh nghiệm.</p>',
      kinhNghiems: [{ maKinhNghiem: 'kn-1' }],
    };
    expect(calculateCandidateProfileCompletion(eligible)).toBe(70);
    expect(MIN_PROFILE_COMPLETION_FOR_CV).toBe(70);
    expect(isCandidateEligibleForCv(eligible)).toBe(true);
  });

  it('trả về 100% khi hoàn thiện cả 10 tiêu chí', () => {
    const full = {
      tenUngVien: 'Nguyễn Văn A',
      chuyenMon: 'Fullstack Engineer',
      taiKhoan: { sdt: '0901234567' },
      ngaySinh: new Date('2000-01-01'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>Kỹ sư phần mềm với 3 năm kinh nghiệm.</p>',
      kinhNghiems: [{ maKinhNghiem: 'kn-1' }],
      hocVans: [{ maHocVan: 'hv-1' }],
      kyNangs: [{ maKyNang: 'knang-1' }],
      maFileCvMacDinh: 'file-1',
    };
    expect(calculateCandidateProfileCompletion(full)).toBe(100);
    expect(isCandidateEligibleForCv(full)).toBe(true);
  });
});
