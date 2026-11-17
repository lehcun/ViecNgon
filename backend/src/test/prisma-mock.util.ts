/**
 * Helper tạo mock PrismaService dùng chung cho các Jest unit tests tại Backend.
 */
export function createPrismaMock(
  overrides: Record<string, unknown> = {},
): Record<string, any> {
  const modelProxy = () => ({
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    upsert: jest.fn(),
  });

  const base: Record<string, any> = {
    taiKhoan: modelProxy(),
    ungVien: modelProxy(),
    fileCv: modelProxy(),
    kinhNghiem: modelProxy(),
    hocVan: modelProxy(),
    chungChi: modelProxy(),
    duAn: modelProxy(),
    portfolio: modelProxy(),
    ungVienKyNang: modelProxy(),
    congTy: modelProxy(),
    chiNhanh: modelProxy(),
    nhaTuyenDung: modelProxy(),
    congViec: modelProxy(),
    congViecKyNang: modelProxy(),
    donXinViec: modelProxy(),
    lichPhongVan: modelProxy(),
    danhGia: modelProxy(),
    thongBao: modelProxy(),
    baiViet: modelProxy(),
    theoDoiCongTy: modelProxy(),
    kyNang: modelProxy(),
    goiQuangCao: modelProxy(),
    muaQuangCao: modelProxy(),
    thanhToan: modelProxy(),
    banner: modelProxy(),
    congViecDaLuu: modelProxy(),
    $transaction: jest.fn(
      async (
        cbOrOps:
          | ((tx: Record<string, any>) => Promise<unknown>)
          | Promise<unknown>[],
      ) =>
        typeof cbOrOps === 'function' ? cbOrOps(base) : Promise.all(cbOrOps),
    ),
    ...overrides,
  };

  return base;
}
