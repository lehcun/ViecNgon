import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [JobService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<JobService>(JobService);
  });

  it('getJobs xử lý bộ lọc yeuCauKinhNghiem hợp lệ và bỏ qua NaN', async () => {
    prisma.congViec.findMany.mockResolvedValue([]);
    prisma.congViec.count.mockResolvedValue(0);

    await service.getJobs({
      yeuCauKinhNghiem: 'invalid-number' as unknown as number,
    });
    expect(prisma.congViec.findMany).toHaveBeenCalledTimes(1);

    await service.getJobs({ yeuCauKinhNghiem: 0 });
    await service.getJobs({ yeuCauKinhNghiem: 3 });
    expect(prisma.congViec.findMany).toHaveBeenCalledTimes(3);
  });

  it('getEmployerJobs đếm trạng thái và map chi nhánh chính xác', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maNTD: 'hr-1',
      maCongTy: 'ct-1',
    });
    prisma.congViec.findMany
      .mockResolvedValueOnce([
        { maCongViec: 'j-1', trangThai: 'DA_DUYET', ngayHetHan: null },
        { maCongViec: 'j-2', trangThai: 'CHO_DUYET', ngayHetHan: null },
      ])
      .mockResolvedValueOnce([
        {
          maCongViec: 'j-1',
          tenCongViec: 'Backend Developer',
          slug: 'backend-developer',
          capBac: 'Senior',
          loaiHinh: 'Full-time',
          hinhThucLamViec: 'Hybrid',
          thanhPho: 'Hà Nội',
          diaChiChiTiet: 'Cầu Giấy',
          mucLuongToiThieu: 25000000,
          mucLuongToiDa: 40000000,
          yeuCauKinhNghiem: 3,
          trangThai: 'DA_DUYET',
          ngayDang: new Date('2026-01-01'),
          ngayHetHan: new Date('2099-01-01'),
          ngayCapNhat: new Date('2026-01-02'),
          luotXem: 100,
          doUuTien: 2,
          nhanQuangCao: 'HOT',
          congViecKyNangs: [{ kyNang: { maKyNang: 'kn-1', tenKyNang: 'NestJS' } }],
          chiNhanh: {
            maChiNhanh: 'cn-1',
            thanhPho: 'Hà Nội',
            diaChi: 'Số 1 Duy Tân',
          },
          _count: { donXinViecs: 5 },
        },
      ]);
    prisma.congViec.count.mockResolvedValue(1);

    const res = await service.getEmployerJobs('tk-hr', {
      page: 1,
      limit: 10,
      status: 'ALL',
    });

    expect(res.countsByStatus.ALL).toBe(2);
    expect(res.countsByStatus.DA_DUYET).toBe(1);
    expect(res.data[0].branch?.id).toBe('cn-1');
  });

  it('create trừ 1 lượt gói quảng cáo và tạo tin tuyển dụng trong transaction', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maNTD: 'hr-1',
      maCongTy: 'ct-1',
    });
    prisma.chiNhanh.findFirst.mockResolvedValue({ maChiNhanh: 'cn-1' });
    prisma.muaQuangCao.findFirst.mockResolvedValue({
      maMua: 'mua-1',
      goiQuangCao: {
        capDoUuTien: 3,
        loaiHuyHieu: null,
        loaiQuangCao: 'SUPER_HOT',
        thoiGianHieuLuc: 30,
      },
    });
    prisma.congViec.create.mockResolvedValue({ maCongViec: 'job-new' });

    const created = await service.create({
      maTaiKhoan: 'tk-hr',
      tenCongViec: 'Senior ReactJS',
      moTa: '<p>Mô tả</p>',
      yeuCauCongViec: '<p>Yêu cầu</p>',
      phucLoi: '<p>Phúc lợi</p>',
      maChiNhanh: 'cn-1',
      kyNangs: ['kn-1'],
    } as any);

    expect(created.maCongViec).toBe('job-new');
    expect(prisma.muaQuangCao.update).toHaveBeenCalledTimes(1);
  });

  it('removeEmployerJob chặn HR công ty khác xóa tin', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maNTD: 'hr-other',
      maCongTy: 'ct-other',
    });
    prisma.congViec.findUnique.mockResolvedValue({
      maCongViec: 'j-1',
      maNTD: 'hr-1',
      nhaTuyenDung: { maCongTy: 'ct-1' },
    });

    await expect(service.removeEmployerJob('tk-other', 'j-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('getEmployerJobById trả về chi tiết tin cùng chi nhánh hoặc branch null', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maNTD: 'hr-1',
      maCongTy: 'ct-1',
    });
    prisma.congViec.findUnique.mockResolvedValue({
      maCongViec: 'j-1',
      maNTD: 'hr-1',
      nhaTuyenDung: { maCongTy: 'ct-1' },
      tenCongViec: 'Senior NestJS',
      slug: 'senior-nestjs',
      moTa: '<p>Mo ta</p>',
      yeuCauCongViec: '<p>Yeu cau</p>',
      phucLoi: '<p>Phuc loi</p>',
      mucLuongToiThieu: 20000000,
      mucLuongToiDa: 35000000,
      yeuCauKinhNghiem: 2,
      capBac: 'Senior',
      thanhPho: 'Hà Nội',
      loaiHinh: 'Fulltime',
      hinhThucLamViec: 'Hybrid',
      ngayDang: new Date('2026-01-01'),
      ngayHetHan: new Date('2099-01-01'),
      ngayCapNhat: new Date('2026-01-02'),
      luotXem: 10,
      trangThai: 'DA_DUYET',
      maChiNhanh: 'cn-1',
      congViecKyNangs: [
        { maKyNang: 'kn-1', kyNang: { maKyNang: 'kn-1', tenKyNang: 'NestJS' } },
      ],
      chiNhanh: {
        maChiNhanh: 'cn-1',
        thanhPho: 'Hà Nội',
        diaChi: 'Số 1 Duy Tân',
      },
      _count: { donXinViecs: 3 },
    });

    const detail = await service.getEmployerJobById('tk-hr', 'j-1');
    expect(detail.branch?.id).toBe('cn-1');
    expect(detail.applicationsCount).toBe(3);
  });
});
