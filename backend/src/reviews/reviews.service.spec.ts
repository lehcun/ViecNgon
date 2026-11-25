import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { createPrismaMock } from '../test/prisma-mock.util';
import type { PrismaService } from '../prisma/prisma.service';
import { CompanyReviewsService } from './company-reviews.service';
import { CandidateReviewsService } from './candidate-reviews.service';
import { AdminReviewsService } from '../admin/reviews/admin-reviews.service';

describe('Reviews & Admin Moderation Services', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let companyReviewsService: CompanyReviewsService;
  let candidateReviewsService: CandidateReviewsService;
  let adminReviewsService: AdminReviewsService;

  beforeEach(() => {
    prisma = createPrismaMock();
    const prismaService = prisma as unknown as PrismaService;
    companyReviewsService = new CompanyReviewsService(prismaService);
    candidateReviewsService = new CandidateReviewsService(prismaService);
    adminReviewsService = new AdminReviewsService(prismaService);
  });

  it('chặn ứng viên gửi đánh giá trùng lặp cho cùng 1 công ty (409 Conflict)', async () => {
    prisma.congTy.findUnique.mockResolvedValue({
      maCongTy: 'ct-1',
      tenCongTy: 'FPT Software',
    });
    prisma.danhGia.findFirst.mockResolvedValue({ maDanhGia: 'dg-existing' });

    await expect(
      companyReviewsService.createCompanyReview('ct-1', 'tk-uv-1', {
        diemLuongPhucLoi: 5,
        diemDaoTao: 4,
        diemQuanLy: 5,
        diemVanHoa: 5,
        diemVanPhong: 4,
        khuyenLamViec: true,
        coOtTot: true,
        tieuDe: 'Môi trường tốt',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('chặn NTD báo cáo đánh giá của công ty khác (IDOR 403 Forbidden)', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maCongTy: 'ct-1',
      congTy: { tenCongTy: 'FPT Software' },
    });
    prisma.danhGia.findFirst.mockResolvedValue({
      maDanhGia: 'dg-other',
      maDoiTuongDuocDanhGia: 'ct-2',
      trangThai: 'DA_DUYET',
      tieuDe: 'Review',
      biBaoCao: false,
    });

    await expect(
      companyReviewsService.reportCompanyReview('dg-other', 'tk-ntd-1', {
        lyDoBaoCao: 'Nội dung vi phạm chính sách cộng đồng',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('chặn NTD đánh giá ứng viên khi đơn chưa đạt trạng thái Phỏng vấn / Trúng tuyển / Chưa phù hợp', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maCongTy: 'ct-1',
      congTy: { tenCongTy: 'FPT Software' },
    });
    prisma.donXinViec.findUnique.mockResolvedValue({
      maDon: 'don-1',
      trangThai: 'DANG_XEM_XET',
      maUngVien: 'uv-1',
      congViec: {
        tenCongViec: 'Senior Backend',
        nhaTuyenDung: { maCongTy: 'ct-1' },
      },
      ungVien: { maTaiKhoan: 'tk-uv-1' },
    });

    await expect(
      candidateReviewsService.createApplicationEvaluation('don-1', 'tk-ntd-1', {
        diemChuyenMon: 5,
        diemThaiDo: 5,
        diemGiaiQuyetVanDe: 4,
        diemPhuHopVanHoa: 4,
        ketQuaDanhGia: 'DAT',
        tieuDe: 'Tốt',
        noiDung: 'Ứng viên nắm vững chuyên môn.',
        chiaSeUngVien: true,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('Admin duyệt đánh giá chuyển trạng thái sang DA_DUYET và bắn thông báo cho ứng viên', async () => {
    prisma.danhGia.findFirst.mockResolvedValue({
      maDanhGia: 'dg-pending',
      maNguoiDanhGia: 'tk-uv-1',
      maDoiTuongDuocDanhGia: 'ct-1',
      tieuDe: 'Môi trường tốt',
    });
    prisma.congTy.findUnique.mockResolvedValue({ tenCongTy: 'FPT Software' });
    prisma.danhGia.update.mockResolvedValue({});
    prisma.thongBao.create.mockResolvedValue({});

    const result = await adminReviewsService.approveReview('dg-pending');

    expect(result.trangThai).toBe('DA_DUYET');
    expect(prisma.danhGia.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { maDanhGia: 'dg-pending' },
        data: { trangThai: 'DA_DUYET', biBaoCao: false, lyDoTuChoi: null },
      }),
    );
    expect(prisma.thongBao.create).toHaveBeenCalledTimes(1);
  });
});
