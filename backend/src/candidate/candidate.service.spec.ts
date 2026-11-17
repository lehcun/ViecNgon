import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { CandidateService } from './candidate.service';

describe('CandidateService', () => {
  let service: CandidateService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let cloudinaryService: { uploadCvPdf: jest.Mock };

  beforeEach(async () => {
    prisma = createPrismaMock();
    cloudinaryService = {
      uploadCvPdf: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudinaryService, useValue: cloudinaryService },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
  });

  it('trả về getProfile đầy đủ và hỗ trợ chuyenMon null', async () => {
    prisma.ungVien.findUnique.mockResolvedValue({
      maUngVien: 'uv-1',
      maTaiKhoan: 'tk-1',
      tenUngVien: 'Nguyễn Văn A',
      ngaySinh: new Date('1998-05-10'),
      gioiTinh: 'Nam',
      soNamKinhNghiem: 3,
      avatarUrl: null,
      chuyenMon: null,
      cvUrl: null,
      diaChi: 'Hà Nội',
      gioiThieuBanThan: '<p>Dev</p>',
      loaiCvMacDinh: 'ONLINE',
      maFileCvMacDinh: 'file-1',
      taiKhoan: {
        email: 'a@test.com',
        sdt: '0901234567',
        tenNguoiDung: 'Nguyễn Văn A',
      },
      kyNangs: [],
      kinhNghiems: [
        {
          maKinhNghiem: 'kn-1',
          tenCongTy: 'ABC Tech',
          viTri: 'Frontend',
          ngayBatDau: new Date('2022-01-01'),
          ngayKetThuc: null,
          moTaChiTiet: '<p>React</p>',
        },
      ],
      hocVans: [],
      chungChis: [],
      ngoaiNgus: [],
      danhSachFileCv: [
        {
          maFileCv: 'file-1',
          tenFile: 'cv.pdf',
          fileUrl: 'https://cdn/cv.pdf',
          ngayTaiLen: new Date('2026-01-01'),
        },
      ],
      portfolios: [],
    });

    const result = await service.getProfile('tk-1');
    expect(result.profession).toBe('');
    expect(result.defaultCvFile?.id).toBe('file-1');
    expect(result.experiences[0].startDate).toBe('01/2022');
  });

  it('ném NotFoundException trong getProfile khi không có hồ sơ', async () => {
    prisma.ungVien.findUnique.mockResolvedValue(null);
    await expect(service.getProfile('tk-missing')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('xử lý applyParsedCvData với ngày hợp lệ, MM/YYYY, YYYY và ngày lỗi Number.isNaN', async () => {
    prisma.ungVien.findUnique.mockResolvedValue({
      maUngVien: 'uv-1',
      maTaiKhoan: 'tk-1',
      tenUngVien: 'Ứng viên A',
      taiKhoan: { email: 'a@test.com', sdt: null, tenNguoiDung: 'Ứng viên A' },
      kyNangs: [],
      kinhNghiems: [],
      hocVans: [],
      chungChis: [],
      ngoaiNgus: [],
      danhSachFileCv: [],
      portfolios: [],
    });
    prisma.kyNang.findMany.mockResolvedValue([]);

    await service.applyParsedCvData('tk-1', {
      fullName: 'Trần Văn B',
      phoneNumber: '090000000000000000000000000',
      dateOfBirth: 'invalid-date-string',
      replaceExisting: true,
      experiences: [
        {
          companyName: 'ViecNgon',
          position: 'Fullstack',
          startDate: '03/2023',
          endDate: '2025',
          description: '<p>Làm hệ thống</p>',
        },
      ],
    } as any);

    expect(prisma.taiKhoan.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sdt: '09000000000000000000',
        }),
      }),
    );
    expect(prisma.kinhNghiem.createMany).toHaveBeenCalledTimes(1);
  });

  it('trả về getAppliedJobs kèm thông tin công ty và xử lý company null', async () => {
    prisma.ungVien.findUnique.mockResolvedValue({ maUngVien: 'uv-1' });
    prisma.donXinViec.findMany.mockResolvedValue([
      {
        maDon: 'don-1',
        ngayNop: new Date('2026-01-10'),
        trangThai: 'DA_NOP',
        fileCvUrl: 'https://cdn/cv.pdf',
        congViec: {
          maCongViec: 'job-1',
          tenCongViec: 'NestJS Dev',
          slug: 'nestjs-dev',
          thanhPho: 'Hà Nội',
          hinhThucLamViec: 'Hybrid',
          mucLuongToiThieu: 20000000,
          mucLuongToiDa: 35000000,
          trangThai: 'Đang tuyển',
          ngayHetHan: new Date('2026-12-31'),
          nhaTuyenDung: {
            congTy: {
              tenCongTy: 'ViecNgon Corp',
              logoUrl: 'https://cdn/logo.png',
              slug: 'viecngon-corp',
            },
          },
        },
      },
      {
        maDon: 'don-2',
        ngayNop: new Date('2026-01-11'),
        trangThai: 'DUOC_NHAN',
        fileCvUrl: null,
        congViec: {
          maCongViec: 'job-2',
          tenCongViec: 'React Dev',
          slug: 'react-dev',
          thanhPho: 'TP.HCM',
          hinhThucLamViec: 'Remote',
          mucLuongToiThieu: null,
          mucLuongToiDa: null,
          trangThai: 'Đang tuyển',
          ngayHetHan: null,
          nhaTuyenDung: null,
        },
      },
    ]);

    const applied = await service.getAppliedJobs('tk-1');
    expect(applied).toHaveLength(2);
    expect(applied[0].job.company?.name).toBe('ViecNgon Corp');
    expect(applied[1].job.company).toBeNull();
  });

  it('ném BadRequestException nếu uploadGeneratedCv thiếu file', async () => {
    await expect(
      service.uploadGeneratedCv('tk-1', undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('tạo và cập nhật kinh nghiệm làm việc có sanitize mô tả', async () => {
    prisma.ungVien.findUnique.mockResolvedValue({ maUngVien: 'uv-1' });
    prisma.kinhNghiem.create.mockResolvedValue({ maKinhNghiem: 'kn-1' });
    prisma.kinhNghiem.findFirst.mockResolvedValue({
      maKinhNghiem: 'kn-1',
      maUngVien: 'uv-1',
    });
    prisma.kinhNghiem.update.mockResolvedValue({
      maKinhNghiem: 'kn-1',
      tenCongTy: 'New Corp',
    });

    const created = await service.createExperience('tk-1', {
      companyName: 'ABC',
      position: 'Dev',
      startDate: '2024-01-01',
      description: '<p>Build</p>',
    } as any);
    expect(created.data.maKinhNghiem).toBe('kn-1');

    const updated = await service.updateExperience('tk-1', 'kn-1', {
      companyName: 'New Corp',
      position: 'Senior Dev',
      endDate: '',
      description: '<p>Updated</p>',
    } as any);
    expect(updated.data.tenCongTy).toBe('New Corp');
  });

  it('updateProfile và các hàm CRUD ném NotFoundException khi thiếu hồ sơ hoặc bản ghi', async () => {
    prisma.ungVien.update.mockResolvedValue({ maUngVien: 'uv-1' });
    const profRes = await service.updateProfile('tk-1', {
      userName: 'Nguyễn A',
      aboutMe: '<p>Bio</p>',
    } as any);
    expect(profRes.candidateId).toBe('uv-1');

    prisma.ungVien.findUnique.mockResolvedValueOnce(null);
    await expect(service.getAppliedJobs('tk-missing')).rejects.toThrow(
      NotFoundException,
    );

    prisma.ungVien.findUnique.mockResolvedValue({ maUngVien: 'uv-1' });
    prisma.kinhNghiem.findFirst.mockResolvedValue(null);
    prisma.hocVan.findFirst.mockResolvedValue(null);
    prisma.chungChi.findFirst.mockResolvedValue(null);
    prisma.portfolio.findFirst.mockResolvedValue(null);
    prisma.fileCv.findFirst.mockResolvedValue(null);

    await expect(
      service.updateExperience('tk-1', 'missing', {} as any),
    ).rejects.toThrow(NotFoundException);
    await expect(service.deleteExperience('tk-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
    await expect(
      service.updateEducation('tk-1', 'missing', {} as any),
    ).rejects.toThrow(NotFoundException);
    await expect(service.deleteEducation('tk-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
    await expect(
      service.updateCertificate('tk-1', 'missing', {} as any),
    ).rejects.toThrow(NotFoundException);
    await expect(service.deleteCertificate('tk-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
    await expect(
      service.updatePortfolio('tk-1', 'missing', {} as any),
    ).rejects.toThrow(NotFoundException);
    await expect(service.deletePortfolio('tk-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.deleteCvFile('tk-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
