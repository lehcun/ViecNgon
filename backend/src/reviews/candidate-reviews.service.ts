import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CandidateEvalResult,
  CandidateEvaluationItemDto,
} from '@viecngon/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateEvaluationDto } from './dto/create-candidate-evaluation.dto';

const EVALUABLE_STATUSES = new Set(['PHONG_VAN', 'DUOC_NHAN', 'BI_LOAI']);

@Injectable()
export class CandidateReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyApplicationOwnership(
    maDon: string,
    recruiterUserId: string,
  ) {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: recruiterUserId },
      select: { maCongTy: true, congTy: { select: { tenCongTy: true } } },
    });
    if (!recruiter?.maCongTy) {
      throw new ForbiddenException(
        'Tài khoản Nhà tuyển dụng chưa liên kết với doanh nghiệp.',
      );
    }

    const application = await this.prisma.donXinViec.findUnique({
      where: { maDon },
      select: {
        maDon: true,
        trangThai: true,
        maUngVien: true,
        congViec: {
          select: {
            tenCongViec: true,
            nhaTuyenDung: {
              select: { maCongTy: true },
            },
          },
        },
        ungVien: {
          select: {
            maTaiKhoan: true,
          },
        },
      },
    });
    if (!application) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng tuyển.');
    }
    if (application.congViec.nhaTuyenDung.maCongTy !== recruiter.maCongTy) {
      throw new ForbiddenException(
        'Bạn không có quyền xem hoặc đánh giá hồ sơ ứng tuyển của doanh nghiệp khác.',
      );
    }

    return {
      application,
      companyName: recruiter.congTy?.tenCongTy || 'Nhà tuyển dụng',
    };
  }

  async getApplicationEvaluations(
    maDon: string,
    recruiterUserId: string,
  ): Promise<CandidateEvaluationItemDto[]> {
    await this.verifyApplicationOwnership(maDon, recruiterUserId);

    const rows = await this.prisma.danhGia.findMany({
      where: {
        maDonThamChieu: maDon,
        loaiDoiTuong: 'UNGVIEN',
        deletedAt: null,
      },
      orderBy: { ngayDanhGia: 'desc' },
      select: {
        maDanhGia: true,
        rating: true,
        diemChuyenMon: true,
        diemThaiDo: true,
        diemGiaiQuyetVanDe: true,
        diemPhuHopVanHoa: true,
        ketQuaDanhGia: true,
        tieuDe: true,
        noiDung: true,
        chiaSeUngVien: true,
        ngayDanhGia: true,
        nguoiDanhGia: {
          select: {
            tenNguoiDung: true,
            email: true,
            nhaTuyenDung: {
              select: { hoTen: true, chucVu: true },
            },
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.maDanhGia,
      evaluatorName:
        row.nguoiDanhGia.nhaTuyenDung?.hoTen ||
        row.nguoiDanhGia.tenNguoiDung ||
        row.nguoiDanhGia.email ||
        'Nhà tuyển dụng',
      evaluatorRole:
        row.nguoiDanhGia.nhaTuyenDung?.chucVu ||
        'Nhà tuyển dụng / Hội đồng phỏng vấn',
      rating: Number(row.rating ?? 0),
      diemChuyenMon: row.diemChuyenMon ?? 0,
      diemThaiDo: row.diemThaiDo ?? 0,
      diemGiaiQuyetVanDe: row.diemGiaiQuyetVanDe ?? 0,
      diemPhuHopVanHoa: row.diemPhuHopVanHoa ?? 0,
      ketQuaDanhGia: (row.ketQuaDanhGia as CandidateEvalResult) || 'CAN_NHAC',
      tieuDe: row.tieuDe ?? '',
      noiDung: row.noiDung ?? '',
      chiaSeUngVien: Boolean(row.chiaSeUngVien),
      createdAt: row.ngayDanhGia.toISOString(),
    }));
  }

  async createApplicationEvaluation(
    maDon: string,
    recruiterUserId: string,
    dto: CreateCandidateEvaluationDto,
  ): Promise<CandidateEvaluationItemDto> {
    const { application, companyName } = await this.verifyApplicationOwnership(
      maDon,
      recruiterUserId,
    );

    if (!EVALUABLE_STATUSES.has(application.trangThai)) {
      throw new BadRequestException(
        'Chỉ được đánh giá ứng viên khi hồ sơ đã đạt trạng thái Phỏng vấn, Trúng tuyển hoặc Chưa phù hợp.',
      );
    }

    const avgRating = Number(
      (
        (dto.diemChuyenMon +
          dto.diemThaiDo +
          dto.diemGiaiQuyetVanDe +
          dto.diemPhuHopVanHoa) /
        4
      ).toFixed(1),
    );

    const created = await this.prisma.$transaction(async (tx) => {
      const evaluation = await tx.danhGia.create({
        data: {
          maNguoiDanhGia: recruiterUserId,
          maDoiTuongDuocDanhGia: application.maUngVien,
          maDonThamChieu: maDon,
          loaiDoiTuong: 'UNGVIEN',
          trangThai: 'DA_DUYET',
          anDanh: false,
          daXacThuc: true,
          rating: avgRating,
          diemChuyenMon: dto.diemChuyenMon,
          diemThaiDo: dto.diemThaiDo,
          diemGiaiQuyetVanDe: dto.diemGiaiQuyetVanDe,
          diemPhuHopVanHoa: dto.diemPhuHopVanHoa,
          ketQuaDanhGia: dto.ketQuaDanhGia,
          tieuDe: dto.tieuDe.trim().slice(0, 100),
          noiDung: dto.noiDung.trim().slice(0, 500),
          chiaSeUngVien: dto.chiaSeUngVien,
        },
        select: {
          maDanhGia: true,
          rating: true,
          diemChuyenMon: true,
          diemThaiDo: true,
          diemGiaiQuyetVanDe: true,
          diemPhuHopVanHoa: true,
          ketQuaDanhGia: true,
          tieuDe: true,
          noiDung: true,
          chiaSeUngVien: true,
          ngayDanhGia: true,
          nguoiDanhGia: {
            select: {
              tenNguoiDung: true,
              email: true,
              nhaTuyenDung: { select: { hoTen: true, chucVu: true } },
            },
          },
        },
      });

      if (dto.chiaSeUngVien && application.ungVien?.maTaiKhoan) {
        const jobTitle = application.congViec.tenCongViec || 'vị trí ứng tuyển';
        await tx.thongBao.create({
          data: {
            maTaiKhoan: application.ungVien.maTaiKhoan,
            tieuDe: `Nhận xét phỏng vấn từ ${companyName}`.slice(0, 150),
            noiDung:
              `${companyName} vừa chia sẻ nhận xét đánh giá (${avgRating}/5 sao) cho hồ sơ vị trí ${jobTitle}. Bạn có thể xem chi tiết tại mục Việc làm đã ứng tuyển.`.slice(
                0,
                500,
              ),
            trangThai: 'CHUA_DOC',
          },
        });
      }

      return evaluation;
    });

    return {
      id: created.maDanhGia,
      evaluatorName:
        created.nguoiDanhGia.nhaTuyenDung?.hoTen ||
        created.nguoiDanhGia.tenNguoiDung ||
        created.nguoiDanhGia.email ||
        'Nhà tuyển dụng',
      evaluatorRole:
        created.nguoiDanhGia.nhaTuyenDung?.chucVu ||
        'Nhà tuyển dụng / Hội đồng phỏng vấn',
      rating: Number(created.rating ?? 0),
      diemChuyenMon: created.diemChuyenMon ?? 0,
      diemThaiDo: created.diemThaiDo ?? 0,
      diemGiaiQuyetVanDe: created.diemGiaiQuyetVanDe ?? 0,
      diemPhuHopVanHoa: created.diemPhuHopVanHoa ?? 0,
      ketQuaDanhGia:
        (created.ketQuaDanhGia as CandidateEvalResult) || 'CAN_NHAC',
      tieuDe: created.tieuDe ?? '',
      noiDung: created.noiDung ?? '',
      chiaSeUngVien: Boolean(created.chiaSeUngVien),
      createdAt: created.ngayDanhGia.toISOString(),
    };
  }
}
