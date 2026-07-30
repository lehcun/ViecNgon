import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. API lấy danh sách Gói quảng cáo (Hiển thị ở trang Pricing)
  async getPackages() {
    return await this.prisma.goiQuangCao.findMany({
      orderBy: { gia: 'asc' }, // Sắp xếp giá từ thấp đến cao để UI dễ hiển thị
    });
  }

  // 2. API lấy danh sách chiến dịch của HR
  async getMyCampaigns(maTaiKhoan: string) {
    // Tìm HR tương ứng với tài khoản đang đăng nhập
    const hr = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan },
    });

    if (!hr)
      throw new NotFoundException('Không tìm thấy tài khoản nhà tuyển dụng');

    const campaigns = await this.prisma.muaQuangCao.findMany({
      where: { maNTD: hr.maNTD },
      include: {
        goiQuangCao: { select: { tieuDe: true } },
      },
      orderBy: { ngayMua: 'desc' }, // Mới mua xếp lên đầu
    });

    // Format lại dữ liệu cho khớp với Interface CampaignResponse ở Frontend
    return campaigns.map((cam) => ({
      maMua: cam.maMua,
      tieuDe: cam.tieuDe,
      tenGoi: cam.goiQuangCao.tieuDe,
      giaTaiThoiDiemMua: Number(cam.giaTaiThoiDiemMua), // Ép kiểu Decimal của Prisma về Number
      soLuotConLai: cam.soLuotConLai,
      ngayMua: cam.ngayMua,
      ngayKetThuc: cam.ngayKetThuc,
      trangThai: cam.trangThai,
    }));
  }

  // 3. API Giả lập Thanh toán & Kích hoạt gói dịch vụ (CỰC KỲ QUAN TRỌNG)
  async purchasePackage(maTaiKhoan: string, maGoi: string) {
    const hr = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan },
    });
    if (!hr) throw new NotFoundException('Không tìm thấy thông tin HR');

    const pkg = await this.prisma.goiQuangCao.findUnique({
      where: { maGoi },
    });
    if (!pkg) throw new NotFoundException('Không tìm thấy gói dịch vụ này');

    // Tính toán thời gian hết hạn
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + (pkg.thoiGianHieuLuc || 30));

    // THỰC HIỆN TRANSACTION: Phải thành công cả 3 mới được lưu vào DB [i]
    return await this.prisma.$transaction(async (tx) => {
      // 3.1. Tạo bản ghi Mua Quảng Cáo (Trạng thái: Đang chạy)
      const newCampaign = await tx.muaQuangCao.create({
        data: {
          tieuDe: `Chiến dịch ${pkg.tieuDe} - Tháng ${now.getMonth() + 1}`,
          giaTaiThoiDiemMua: pkg.gia,
          soLuotConLai: pkg.soLuotDangTin, // Bơm lượt đăng tin cho HR
          ngayBatDau: now,
          ngayKetThuc: endDate,
          ngayMua: now,
          trangThai: 'Đang chạy',
          maNTD: hr.maNTD,
          maGoi: pkg.maGoi,
        },
      });

      // 3.2. Tạo hóa đơn thanh toán
      await tx.thanhToan.create({
        data: {
          ngayThanhToan: now,
          soTienThanhToan: pkg.gia,
          phuongThucTT: 'VNPay (Giả lập)',
          trangThaiTT: 'Thành công',
          ghiChu: `Thanh toán thành công gói ${pkg.tieuDe}`,
          maGiaoDichDoiTac: `VNPAY_${Date.now()}`,
          maMua: newCampaign.maMua,
        },
      });

      // 3.3. Tạo thông báo (chuông đỏ) để HR biết tiền đã vào tài khoản
      await tx.thongBao.create({
        data: {
          tieuDe: '💳 Thanh toán thành công',
          noiDung: `Bạn đã thanh toán thành công gói ${pkg.tieuDe}. Bạn có thêm ${pkg.soLuotDangTin} lượt đăng tin.`,
          trangThai: 'CHUA_DOC',
          maTaiKhoan: maTaiKhoan,
        },
      });

      return {
        message: 'Thanh toán và kích hoạt gói thành công!',
        campaignId: newCampaign.maMua,
      };
    });
  }
}
