import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminPackagesService } from './admin-packages.service';

describe('AdminPackagesService', () => {
  let service: AdminPackagesService;
  let prismaMock: {
    goiQuangCao: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    thanhToan: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      aggregate: jest.Mock;
      update: jest.Mock;
    };
    muaQuangCao: {
      update: jest.Mock;
    };
    thongBao: {
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const samplePackageRow = {
    maGoi: 'pkg-1',
    tieuDe: 'Gói VIP Đẩy Tin',
    loaiQuangCao: 'VIP',
    gia: 2500000,
    thoiGianHieuLuc: 30,
    soLuotDangTin: 5,
    capDoUuTien: 3,
    loaiHuyHieu: 'SUPER_HOT',
    moTaNgan: 'Đẩy tin nổi bật trên trang tìm việc',
    quyenLoiJson: JSON.stringify(['Huy hiệu SUPER_HOT', 'Đẩy tin tự động']),
    trangThai: 'HOATDONG',
    ngayTao: new Date('2026-01-01T00:00:00.000Z'),
    muaQuangCaos: [
      { giaTaiThoiDiemMua: 2500000 },
      { giaTaiThoiDiemMua: 2500000 },
    ],
  };

  const sampleTxRow = {
    maThanhToan: 'tx-1',
    maGiaoDichDoiTac: 'VN-PAY-20261123',
    ngayThanhToan: new Date('2026-04-01T09:00:00.000Z'),
    soTienThanhToan: 2500000,
    phuongThucTT: 'Chuyển khoản ngân hàng',
    trangThaiTT: 'Chờ thanh toán',
    ghiChu: 'Thanh toán Gói VIP',
    muaQuangCao: {
      maMua: 'mua-1',
      tieuDe: 'Chiến dịch Q2',
      trangThai: 'Chờ thanh toán',
      soLuotConLai: 5,
      ngayBatDau: new Date('2026-04-01T00:00:00.000Z'),
      ngayKetThuc: new Date('2026-05-01T00:00:00.000Z'),
      goiQuangCao: {
        maGoi: 'pkg-1',
        tieuDe: 'Gói VIP Đẩy Tin',
        loaiHuyHieu: 'SUPER_HOT',
      },
      congTy: {
        maCongTy: 'cty-1',
        tenCongTy: 'MoMo',
        slug: 'momo-m-service',
        logoUrl: null,
      },
      nhaTuyenDung: {
        congTy: {
          maCongTy: 'cty-1',
          tenCongTy: 'MoMo',
          slug: 'momo-m-service',
          logoUrl: null,
        },
        taiKhoan: {
          maTaiKhoan: 'hr-1',
          tenNguoiDung: 'Lê Hùng Cường',
          email: 'hr@momo.vn',
        },
      },
    },
  };

  beforeEach(() => {
    prismaMock = {
      goiQuangCao: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      thanhToan: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
        update: jest.fn(),
      },
      muaQuangCao: {
        update: jest.fn(),
      },
      thongBao: {
        create: jest.fn(),
      },
      $transaction: jest.fn((cb: (tx: typeof prismaMock) => unknown) =>
        Promise.resolve(cb(prismaMock)),
      ),
    };

    service = new AdminPackagesService(prismaMock as unknown as PrismaService);
  });

  it('trả về danh sách gói kèm tổng lượt mua, tổng doanh thu và summary', async () => {
    prismaMock.goiQuangCao.findMany.mockResolvedValue([samplePackageRow]);

    const res = await service.findAllPackages({});

    expect(res.items).toHaveLength(1);
    expect(res.items[0].purchasesCount).toBe(2);
    expect(res.items[0].totalRevenue).toBe(5000000);
    expect(res.items[0].quyenLoi).toEqual([
      'Huy hiệu SUPER_HOT',
      'Đẩy tin tự động',
    ]);
    expect(res.summary).toEqual({ total: 1, active: 1, hidden: 0 });
  });

  it('tạo gói dịch vụ mới với trạng thái mặc định HOATDONG', async () => {
    prismaMock.goiQuangCao.create.mockResolvedValue(samplePackageRow);

    const res = await service.createPackage({
      tieuDe: 'Gói VIP Đẩy Tin',
      gia: 2500000,
      thoiGianHieuLuc: 30,
      soLuotDangTin: 5,
      capDoUuTien: 3,
      loaiHuyHieu: 'SUPER_HOT',
      quyenLoi: ['Huy hiệu SUPER_HOT', 'Đẩy tin tự động'],
    });

    expect(res.package.trangThai).toBe('HOATDONG');
    expect(prismaMock.goiQuangCao.create).toHaveBeenCalledTimes(1);
  });

  it('ném NotFoundException khi ẩn/hiện gói không tồn tại', async () => {
    prismaMock.goiQuangCao.findUnique.mockResolvedValue(null);
    await expect(
      service.updatePackageStatus('missing-id', { trangThai: 'DA_AN' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('ẩn gói dịch vụ thành công sang DA_AN', async () => {
    prismaMock.goiQuangCao.findUnique.mockResolvedValue({
      maGoi: 'pkg-1',
      tieuDe: 'Gói VIP Đẩy Tin',
      trangThai: 'HOATDONG',
    });
    prismaMock.goiQuangCao.update.mockResolvedValue({
      ...samplePackageRow,
      trangThai: 'DA_AN',
    });

    const res = await service.updatePackageStatus('pkg-1', {
      trangThai: 'DA_AN',
    });

    expect(res.package.trangThai).toBe('DA_AN');
  });

  it('tra cứu giao dịch thanh toán phân trang và tính tổng doanh thu thành công', async () => {
    prismaMock.thanhToan.findMany.mockResolvedValue([sampleTxRow]);
    prismaMock.thanhToan.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);
    prismaMock.thanhToan.aggregate.mockResolvedValue({
      _sum: { soTienThanhToan: 2500000 },
    });

    const res = await service.findAllTransactions({ page: 1, limit: 12 });

    expect(res.items).toHaveLength(1);
    expect(res.items[0].trangThaiTT).toBe('CHO_THANH_TOAN');
    expect(res.summary.totalSuccessRevenue).toBe(2500000);
  });

  it('chặn xác nhận lại giao dịch đã Thành công', async () => {
    prismaMock.thanhToan.findUnique.mockResolvedValue({
      maThanhToan: 'tx-1',
      maGiaoDichDoiTac: 'VN-PAY-20261123',
      trangThaiTT: 'Thành công',
      muaQuangCao: {
        maMua: 'mua-1',
        goiQuangCao: { tieuDe: 'Gói VIP' },
        nhaTuyenDung: { maTaiKhoan: 'hr-1' },
      },
    });

    await expect(service.confirmTransaction('tx-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('xác nhận giao dịch chờ thanh toán: cập nhật ThanhToan, MuaQuangCao và ghi ThongBao', async () => {
    prismaMock.thanhToan.findUnique.mockResolvedValue({
      maThanhToan: 'tx-1',
      maGiaoDichDoiTac: 'VN-PAY-20261123',
      trangThaiTT: 'Chờ thanh toán',
      muaQuangCao: {
        maMua: 'mua-1',
        goiQuangCao: { tieuDe: 'Gói VIP Đẩy Tin' },
        nhaTuyenDung: { maTaiKhoan: 'hr-1' },
      },
    });
    prismaMock.thanhToan.update.mockResolvedValue({
      ...sampleTxRow,
      trangThaiTT: 'Thành công',
    });

    const res = await service.confirmTransaction('tx-1');

    expect(res.transaction.trangThaiTT).toBe('THANH_CONG');
    expect(prismaMock.muaQuangCao.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.thongBao.create).toHaveBeenCalledTimes(1);
  });
});
