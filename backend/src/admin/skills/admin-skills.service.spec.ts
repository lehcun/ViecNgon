import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminSkillsService } from './admin-skills.service';

describe('AdminSkillsService', () => {
  let service: AdminSkillsService;
  let prismaMock: {
    kyNang: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    ungVienKyNang: {
      findMany: jest.Mock;
      createMany: jest.Mock;
    };
    congViecKyNang: {
      findMany: jest.Mock;
      createMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(() => {
    prismaMock = {
      kyNang: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      ungVienKyNang: {
        findMany: jest.fn(),
        createMany: jest.fn(),
      },
      congViecKyNang: {
        findMany: jest.fn(),
        createMany: jest.fn(),
      },
      $transaction: jest.fn((cb: (tx: typeof prismaMock) => unknown) =>
        Promise.resolve(cb(prismaMock)),
      ),
    };

    service = new AdminSkillsService(prismaMock as unknown as PrismaService);
  });

  it('trả về danh sách kỹ năng, lọc UNUSED và thống kê đúng', async () => {
    prismaMock.kyNang.findMany.mockResolvedValue([
      {
        maKyNang: 'sk-1',
        tenKyNang: 'ReactJS',
        _count: { congViecKyNangs: 5, ungViens: 3 },
      },
      {
        maKyNang: 'sk-2',
        tenKyNang: 'COBOL',
        _count: { congViecKyNangs: 0, ungViens: 0 },
      },
    ]);

    const res = await service.findAll({ usage: 'UNUSED' });

    expect(res.items).toHaveLength(1);
    expect(res.items[0].tenKyNang).toBe('COBOL');
    expect(res.summary).toEqual({ total: 1, inUse: 0, unused: 1 });
  });

  it('chặn thêm kỹ năng trùng tên không phân biệt hoa thường', async () => {
    prismaMock.kyNang.findMany.mockResolvedValue([
      { maKyNang: 'sk-1', tenKyNang: 'ReactJS' },
    ]);

    await expect(service.create({ tenKyNang: 'reactjs' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('gộp kỹ năng trùng lặp mà không tạo trùng khóa chính kép', async () => {
    prismaMock.kyNang.findUnique
      .mockResolvedValueOnce({ maKyNang: 'sk-src', tenKyNang: 'React.js' })
      .mockResolvedValueOnce({ maKyNang: 'sk-dst', tenKyNang: 'ReactJS' })
      .mockResolvedValueOnce({
        maKyNang: 'sk-dst',
        tenKyNang: 'ReactJS',
        _count: { congViecKyNangs: 2, ungViens: 2 },
      });

    prismaMock.ungVienKyNang.findMany
      .mockResolvedValueOnce([
        { maUngVien: 'uv-1', mucDo: 'Senior' },
        { maUngVien: 'uv-2', mucDo: 'Junior' },
      ])
      .mockResolvedValueOnce([{ maUngVien: 'uv-1' }]);

    prismaMock.congViecKyNang.findMany
      .mockResolvedValueOnce([{ maCongViec: 'job-1' }, { maCongViec: 'job-2' }])
      .mockResolvedValueOnce([{ maCongViec: 'job-1' }]);

    const res = await service.merge('sk-src', { targetSkillId: 'sk-dst' });

    expect(res.skill.tenKyNang).toBe('ReactJS');
    expect(prismaMock.ungVienKyNang.createMany).toHaveBeenCalledWith({
      data: [{ maUngVien: 'uv-2', maKyNang: 'sk-dst', mucDo: 'Junior' }],
    });
    expect(prismaMock.congViecKyNang.createMany).toHaveBeenCalledWith({
      data: [{ maCongViec: 'job-2', maKyNang: 'sk-dst' }],
    });
    expect(prismaMock.kyNang.delete).toHaveBeenCalledWith({
      where: { maKyNang: 'sk-src' },
    });
  });

  it('chặn xóa kỹ năng đang được Job hoặc Ứng viên sử dụng', async () => {
    prismaMock.kyNang.findUnique.mockResolvedValue({
      maKyNang: 'sk-1',
      tenKyNang: 'ReactJS',
      _count: { congViecKyNangs: 2, ungViens: 1 },
    });

    await expect(service.remove('sk-1')).rejects.toThrow(BadRequestException);
  });

  it('xóa thành công kỹ năng chưa được sử dụng', async () => {
    prismaMock.kyNang.findUnique.mockResolvedValue({
      maKyNang: 'sk-unused',
      tenKyNang: 'OldSkill',
      _count: { congViecKyNangs: 0, ungViens: 0 },
    });

    const res = await service.remove('sk-unused');

    expect(res.deletedId).toBe('sk-unused');
    expect(prismaMock.kyNang.delete).toHaveBeenCalledWith({
      where: { maKyNang: 'sk-unused' },
    });
  });
});
