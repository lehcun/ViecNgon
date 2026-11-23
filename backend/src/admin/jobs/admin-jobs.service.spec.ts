import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminJobsService } from './admin-jobs.service';

describe('AdminJobsService', () => {
  let service: AdminJobsService;
  let prismaMock: {
    congViec: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
    thongBao: {
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let mailerMock: { sendMail: jest.Mock };

  const sampleJobRow = {
    maCongViec: 'job-1',
    tenCongViec: 'Senior NestJS Engineer',
    slug: 'senior-nestjs-engineer',
    trangThai: 'CHO_DUYET',
    thanhPho: 'TP. Hồ Chí Minh',
    loaiHinh: 'Full-time',
    hinhThucLamViec: 'Hybrid',
    capBac: 'Senior',
    mucLuongToiThieu: 30000000,
    mucLuongToiDa: 50000000,
    ngayDang: new Date('2026-04-01T08:00:00.000Z'),
    ngayHetHan: new Date('2027-04-01T08:00:00.000Z'),
    luotXem: 42,
    nhanQuangCao: 'HOT',
    nhaTuyenDung: {
      congTy: {
        maCongTy: 'cty-1',
        tenCongTy: 'TechCorp Vietnam',
        slug: 'techcorp-vietnam',
        logoUrl: null,
      },
      taiKhoan: {
        maTaiKhoan: 'hr-acc-1',
        tenNguoiDung: 'HR TechCorp',
        email: 'hr@techcorp.vn',
      },
    },
    congViecKyNangs: [{ kyNang: { tenKyNang: 'NestJS' } }],
    _count: { donXinViecs: 3 },
  };

  beforeEach(() => {
    prismaMock = {
      congViec: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      thongBao: {
        create: jest.fn(),
      },
      $transaction: jest.fn((cb: (tx: typeof prismaMock) => unknown) =>
        Promise.resolve(cb(prismaMock)),
      ),
    };

    mailerMock = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };

    service = new AdminJobsService(
      prismaMock as unknown as PrismaService,
      mailerMock as unknown as MailerService,
    );
  });

  it('trả về danh sách phân trang và summary theo đúng bộ lọc hiện tại', async () => {
    prismaMock.congViec.findMany.mockResolvedValue([sampleJobRow]);
    prismaMock.congViec.count
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);

    const res = await service.findAll({ page: 1, limit: 12 });

    expect(res.items).toHaveLength(1);
    expect(res.items[0].trangThai).toBe('CHO_DUYET');
    expect(res.items[0].skills).toEqual(['NestJS']);
    expect(res.summary).toEqual({
      total: 5,
      pending: 2,
      approved: 1,
      rejected: 1,
      hidden: 1,
      expired: 0,
    });
  });

  it('ném NotFoundException khi xem chi tiết tin không tồn tại', async () => {
    prismaMock.congViec.findFirst.mockResolvedValue(null);
    await expect(service.findOne('missing-job')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('chặn từ chối tin khi không nhập lý do', async () => {
    await expect(
      service.moderate('job-1', { action: 'REJECT', reason: '   ' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('chặn duyệt tin đã quá hạn nộp hồ sơ', async () => {
    prismaMock.congViec.findFirst.mockResolvedValue({
      maCongViec: 'job-expired',
      tenCongViec: 'Old Job',
      trangThai: 'CHO_DUYET',
      ngayHetHan: new Date('2020-01-01T00:00:00.000Z'),
      nhaTuyenDung: { maTaiKhoan: 'hr-acc-1' },
    });

    await expect(
      service.moderate('job-expired', { action: 'APPROVE' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('duyệt tin thành công: cập nhật DA_DUYET và gửi ThongBao cho HR', async () => {
    prismaMock.congViec.findFirst.mockResolvedValue({
      maCongViec: 'job-1',
      tenCongViec: 'Senior NestJS Engineer',
      trangThai: 'CHO_DUYET',
      ngayHetHan: new Date('2027-04-01T08:00:00.000Z'),
      nhaTuyenDung: { maTaiKhoan: 'hr-acc-1' },
    });
    prismaMock.congViec.update.mockResolvedValue({
      ...sampleJobRow,
      trangThai: 'DA_DUYET',
    });

    const res = await service.moderate('job-1', { action: 'APPROVE' });

    expect(res.job.trangThai).toBe('DA_DUYET');
    expect(prismaMock.thongBao.create).toHaveBeenCalledTimes(1);
  });

  it('từ chối tin kèm lý do: cập nhật TU_CHOI và ghi lý do vào ThongBao', async () => {
    prismaMock.congViec.findFirst.mockResolvedValue({
      maCongViec: 'job-1',
      tenCongViec: 'Senior NestJS Engineer',
      trangThai: 'CHO_DUYET',
      ngayHetHan: null,
      nhaTuyenDung: { maTaiKhoan: 'hr-acc-1' },
    });
    prismaMock.congViec.update.mockResolvedValue({
      ...sampleJobRow,
      trangThai: 'TU_CHOI',
    });

    const res = await service.moderate('job-1', {
      action: 'REJECT',
      reason: 'Thiếu mô tả yêu cầu kỹ thuật rõ ràng',
    });

    expect(res.job.trangThai).toBe('TU_CHOI');
    const thongBaoCall = prismaMock.thongBao.create.mock.calls[0] as [
      { data: { maTaiKhoan: string; noiDung: string } },
    ];
    expect(thongBaoCall[0].data.maTaiKhoan).toBe('hr-acc-1');
    expect(thongBaoCall[0].data.noiDung).toContain(
      'Thiếu mô tả yêu cầu kỹ thuật rõ ràng',
    );
  });

  it('xóa mềm tin tuyển dụng: đặt deletedAt, chuyển DA_AN và ghi ThongBao', async () => {
    prismaMock.congViec.findFirst.mockResolvedValue({
      maCongViec: 'job-1',
      tenCongViec: 'Senior NestJS Engineer',
      nhaTuyenDung: { maTaiKhoan: 'hr-acc-1' },
    });
    prismaMock.congViec.update.mockResolvedValue({});

    const res = await service.softDelete('job-1', {
      reason: 'Tin tuyển dụng spam',
    });

    expect(res.deletedId).toBe('job-1');
    expect(prismaMock.thongBao.create).toHaveBeenCalledTimes(1);
  });
});
