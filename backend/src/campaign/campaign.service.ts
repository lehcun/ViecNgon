import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { PackageResponse } from '@viecngon/types';
import { resolvePackageTierTemplate } from 'src/common/utils/package-tiers.util';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  private parseStoredFeatures(
    quyenLoiJson: string | null | undefined,
    fallbackFeatures: string[],
  ): string[] {
    if (!quyenLoiJson) {
      return fallbackFeatures;
    }

    try {
      const parsed: unknown = JSON.parse(quyenLoiJson);
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === 'string')
      ) {
        return parsed;
      }
    } catch {
      return fallbackFeatures;
    }

    return fallbackFeatures;
  }

  // 1. API lấy danh sách Gói quảng cáo 4 cấp (Hiển thị ở trang Pricing)
  async getPackages(): Promise<PackageResponse[]> {
    const packages = await this.prisma.goiQuangCao.findMany({
      orderBy: [{ capDoUuTien: 'asc' }, { gia: 'asc' }],
    });

    return packages.map((pkg) => {
      const template = resolvePackageTierTemplate({
        tieuDe: pkg.tieuDe,
        loaiQuangCao: pkg.loaiQuangCao,
        capDoUuTien: pkg.capDoUuTien,
      });

      return {
        maGoi: pkg.maGoi,
        tieuDe: pkg.tieuDe,
        loaiQuangCao: pkg.loaiQuangCao || template.loaiQuangCao,
        gia: Number(pkg.gia),
        thoiGianHieuLuc: pkg.thoiGianHieuLuc ?? template.durationDays,
        soLuotDangTin: pkg.soLuotDangTin ?? template.postCredits,
        priorityLevel: pkg.capDoUuTien || template.priorityLevel,
        badgeType: template.badgeType,
        badgeText: template.badgeText,
        description: pkg.moTaNgan || template.description,
        inheritedFrom: template.inheritedFrom,
        isPopular: template.isPopular,
        features: this.parseStoredFeatures(pkg.quyenLoiJson, template.features),
      };
    });
  }

  // 2. API lấy danh sách chiến dịch của HR
  async getMyCampaigns(maTaiKhoan: string) {
    const hr = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan },
    });

    if (!hr) {
      throw new NotFoundException('Không tìm thấy tài khoản nhà tuyển dụng');
    }

    const campaigns = await this.prisma.muaQuangCao.findMany({
      where: { maNTD: hr.maNTD },
      include: {
        goiQuangCao: {
          select: {
            tieuDe: true,
            capDoUuTien: true,
            loaiHuyHieu: true,
          },
        },
      },
      orderBy: { ngayMua: 'desc' },
    });

    return campaigns.map((cam) => ({
      id: cam.maMua,
      maMua: cam.maMua,
      tieuDe: cam.tieuDe,
      tenGoi: cam.goiQuangCao.tieuDe,
      giaTaiThoiDiemMua: Number(cam.giaTaiThoiDiemMua),
      soLuotConLai: cam.soLuotConLai ?? 0,
      ngayMua: cam.ngayMua,
      ngayKetThuc: cam.ngayKetThuc,
      trangThai: cam.trangThai,
      priorityLevel: cam.goiQuangCao.capDoUuTien,
      badgeType: cam.goiQuangCao.loaiHuyHieu,
    }));
  }

  // 3. API Thanh toán & Kích hoạt gói dịch vụ trong Transaction
  async purchasePackage(maTaiKhoan: string, maGoi: string) {
    const hr = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan },
    });
    if (!hr) throw new NotFoundException('Không tìm thấy thông tin HR');

    const pkg = await this.prisma.goiQuangCao.findUnique({
      where: { maGoi },
    });
    if (!pkg) throw new NotFoundException('Không tìm thấy gói dịch vụ này');

    const template = resolvePackageTierTemplate({
      tieuDe: pkg.tieuDe,
      loaiQuangCao: pkg.loaiQuangCao,
      capDoUuTien: pkg.capDoUuTien,
    });
    const priorityLevel = pkg.capDoUuTien || template.priorityLevel;
    const badgeType = (pkg.loaiHuyHieu || template.badgeType).slice(0, 30);
    const durationDays = pkg.thoiGianHieuLuc || template.durationDays;
    const postCredits = pkg.soLuotDangTin || template.postCredits;

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + durationDays);

    return await this.prisma.$transaction(async (tx) => {
      const campaignTitle = `Chiến dịch ${pkg.tieuDe} - Tháng ${now.getMonth() + 1}`.slice(
        0,
        100,
      );

      // 3.1 Tạo bản ghi Mua Quảng Cáo
      const newCampaign = await tx.muaQuangCao.create({
        data: {
          tieuDe: campaignTitle,
          giaTaiThoiDiemMua: pkg.gia,
          soLuotConLai: postCredits,
          ngayBatDau: now,
          ngayKetThuc: endDate,
          ngayMua: now,
          trangThai: 'Đang chạy',
          maNTD: hr.maNTD,
          maGoi: pkg.maGoi,
        },
      });

      // 3.2 Tạo hóa đơn thanh toán
      await tx.thanhToan.create({
        data: {
          ngayThanhToan: now,
          soTienThanhToan: pkg.gia,
          phuongThucTT: 'VNPay (Giả lập)',
          trangThaiTT: 'Thành công',
          ghiChu: `Thanh toán thành công gói ${pkg.tieuDe}`.slice(0, 255),
          maGiaoDichDoiTac: `VNPAY_${Date.now()}`.slice(0, 100),
          maMua: newCampaign.maMua,
        },
      });

      // 3.3 Nâng cấp ưu tiên cho các tin đang tuyển hiện tại của HR nếu gói mới cao hơn
      await tx.congViec.updateMany({
        where: {
          maNTD: hr.maNTD,
          trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
          doUuTien: { lt: priorityLevel },
        },
        data: {
          doUuTien: priorityLevel,
          nhanQuangCao: badgeType,
          lastRefreshedAt: now,
        },
      });

      // 3.4 Tạo thông báo cho HR
      await tx.thongBao.create({
        data: {
          tieuDe: '💳 Thanh toán gói dịch vụ thành công'.slice(0, 100),
          noiDung: `Bạn đã kích hoạt ${pkg.tieuDe} (+${postCredits} lượt đăng tin, hiệu lực ${durationDays} ngày).`.slice(
            0,
            255,
          ),
          trangThai: 'CHUA_DOC',
          maTaiKhoan,
        },
      });

      return {
        message: 'Thanh toán và kích hoạt gói thành công!',
        campaignId: newCampaign.maMua,
        priorityLevel,
        badgeType,
      };
    });
  }
}
