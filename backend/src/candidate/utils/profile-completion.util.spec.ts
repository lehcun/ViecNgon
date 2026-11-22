import {
  MIN_PROFILE_COMPLETION_FOR_CV,
  calculateCandidateProfileCompletion,
  isCandidateEligibleForCv,
} from './profile-completion.util';

describe('profile-completion.util', () => {
  it('trả về 0% khi profile null, undefined hoặc giới thiệu chỉ là HTML rỗng', () => {
    expect(calculateCandidateProfileCompletion(null)).toBe(0);
    expect(calculateCandidateProfileCompletion(undefined)).toBe(0);
    expect(
      calculateCandidateProfileCompletion({
        gioiThieuBanThan: '<p><br></p>   ',
      }),
    ).toBe(0);
    expect(isCandidateEligibleForCv(null)).toBe(false);
  });

  it('tính đúng 45% khi mới điền thông tin cơ bản (không kinh nghiệm, không dự án)', () => {
    const basicOnly = {
      tenUngVien: 'Nguyễn Văn A',
      chuyenMon: 'Backend Engineer',
      taiKhoan: { sdt: '0901234567' },
      ngaySinh: new Date('2000-01-01'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>Lập trình viên Backend TypeScript.</p>',
      hocVans: [{ maHocVan: 'hv-1' }],
      kyNangs: [{ maKyNang: 's-1' }, { maKyNang: 's-2' }, { maKyNang: 's-3' }],
    };
    // 5 + 10 + 15 + 0 + 0 + 15 + 0 = 45%
    expect(calculateCandidateProfileCompletion(basicOnly)).toBe(45);
    expect(isCandidateEligibleForCv(basicOnly)).toBe(false);
  });

  it('tính đúng 65% cho ứng viên có 1 kinh nghiệm + 1 dự án nhưng chưa có chứng chỉ', () => {
    const midCandidate = {
      tenUngVien: 'Nguyễn Văn A',
      chuyenMon: 'Backend Engineer',
      taiKhoan: { sdt: '0901234567' },
      ngaySinh: new Date('2000-01-01'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>Lập trình viên Backend TypeScript.</p>',
      hocVans: [{ maHocVan: 'hv-1' }],
      kinhNghiems: [{ maKinhNghiem: 'kn-1' }],
      portfolios: [{ maPortfolio: 'p-1' }],
      kyNangs: [{ maKyNang: 's-1' }, { maKyNang: 's-2' }, { maKyNang: 's-3' }],
    };
    // 5 + 10 + 15 + 10 + 10 + 15 + 0 = 65%
    expect(calculateCandidateProfileCompletion(midCandidate)).toBe(65);
    expect(isCandidateEligibleForCv(midCandidate)).toBe(false);
  });

  it('đạt đúng mốc 70% cho Fresher (0 kinh nghiệm, 2 dự án, 1 chứng chỉ, 3 kỹ năng)', () => {
    const fresher = {
      tenUngVien: 'Lê Hùng Cường',
      chuyenMon: 'Backend Developer',
      taiKhoan: { sdt: '0815114233' },
      ngaySinh: new Date('2005-07-29'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>TypeScript Developer với NestJS và Next.js.</p>',
      hocVans: [{ maHocVan: 'hv-1' }],
      kinhNghiems: [],
      portfolios: [{ maPortfolio: 'p-1' }, { maPortfolio: 'p-2' }],
      kyNangs: [{ maKyNang: 's-1' }, { maKyNang: 's-2' }, { maKyNang: 's-3' }],
      chungChis: [{ maChungChi: 'cc-1' }],
    };
    // 5 + 10 + 15 + 0 + 20 + 15 + 5 = 70%
    expect(calculateCandidateProfileCompletion(fresher)).toBe(70);
    expect(MIN_PROFILE_COMPLETION_FOR_CV).toBe(70);
    expect(isCandidateEligibleForCv(fresher)).toBe(true);
  });

  it('chặn trần đúng 100% khi đủ 7 nhóm kể cả có nhiều hơn 3 kinh nghiệm và 2 dự án', () => {
    const full = {
      tenUngVien: 'Nguyễn Văn A',
      chuyenMon: 'Fullstack Engineer',
      taiKhoan: { sdt: '0901234567' },
      ngaySinh: new Date('1998-01-01'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>Kỹ sư phần mềm với nhiều năm kinh nghiệm.</p>',
      hocVans: [{ maHocVan: 'hv-1' }],
      kinhNghiems: [
        { maKinhNghiem: 'kn-1' },
        { maKinhNghiem: 'kn-2' },
        { maKinhNghiem: 'kn-3' },
        { maKinhNghiem: 'kn-4' },
      ],
      portfolios: [
        { maPortfolio: 'p-1' },
        { maPortfolio: 'p-2' },
        { maPortfolio: 'p-3' },
      ],
      kyNangs: [
        { maKyNang: 's-1' },
        { maKyNang: 's-2' },
        { maKyNang: 's-3' },
        { maKyNang: 's-4' },
      ],
      chungChis: [{ maChungChi: 'cc-1' }],
    };
    expect(calculateCandidateProfileCompletion(full)).toBe(100);
    expect(isCandidateEligibleForCv(full)).toBe(true);
  });
});
