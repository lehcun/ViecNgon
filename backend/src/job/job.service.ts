import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async getJobBySlug(slug: string) {
    // 1. Tìm công việc dựa vào slug
    const job = await this.prisma.congViec.findUnique({
      where: { slug },
      include: {
        nhaTuyenDung: {
          include: {
            congTy: true, // Join luôn để lấy thông tin Công ty (Tên, Logo...)
          },
        },
        congViecKyNangs: {
          include: {
            kyNang: true, // Join lấy tên các kỹ năng của công việc này
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Không tìm thấy công việc này!`);
    }

    // 2. Tăng số lượt xem (luotXem) lên 1 ngay dưới nền
    await this.prisma.congViec.update({
      where: { slug },
      data: { luotXem: { increment: 1 } },
    });

    const min = job.mucLuongToiThieu ? Number(job.mucLuongToiThieu) : 0;
    const max = job.mucLuongToiDa ? Number(job.mucLuongToiDa) : 0;

    let salaryDisplay = '';

    if (min === 0 && max === 0) {
      salaryDisplay = 'Thỏa thuận';
    } else if (min > 0 && max === 0) {
      salaryDisplay = `Từ ${min.toLocaleString()} VNĐ`;
    } else if (min === 0 && max > 0) {
      salaryDisplay = `Lên đến ${max.toLocaleString()} VNĐ`;
    } else {
      // Trường hợp có cả min và max (Ví dụ: 10.000.000 - 20.000.000 VNĐ)
      salaryDisplay = `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
    }

    // 3. Format lại dữ liệu cho Frontend dễ đọc (giống với Clean Architecture)
    const formattedJob = {
      id: job.maCongViec,
      title: job.tenCongViec,
      slug: job.slug,
      description: job.moTa,
      requirements: job.yeuCauCongViec,
      // Xử lý biến chuỗi JSON thành mảng
      benefits: job.phucLoi ? (JSON.parse(job.phucLoi) as string[]) : [],

      // Ép kiểu Decimal sang Number cho Frontend
      // Trả về cả min, max và chuỗi đã format
      salaryMin: min,
      salaryMax: max,
      salaryDisplay: salaryDisplay,

      experience: job.yeuCauKinhNghiem,
      level: job.capBac,

      location: job.thanhPho,
      type: job.loaiHinh,
      workModel: job.hinhThucLamViec,

      postedAt: job.ngayDang,
      deadline: job.ngayHetHan,
      updatedAt: job.ngayCapNhat,
      views: job.luotXem + 1, // Trả về số lượt xem mới nhất
      status: job.trangThai,

      // Mổ xẻ lấy mảng tên kỹ năng: ['React', 'Node.js']
      skills: job.congViecKyNangs.map((cvkn) => cvkn.kyNang.tenKyNang),

      // Thông tin công ty
      company: {
        id: job.nhaTuyenDung.congTy.maCongTy,
        name: job.nhaTuyenDung.congTy.tenCongTy,
        logo: job.nhaTuyenDung.congTy.logoUrl,
        slug: job.nhaTuyenDung.congTy.slug,
        companyModel: job.nhaTuyenDung.congTy.moHinhCongTy,
        industry: job.nhaTuyenDung.congTy.linhVuc,
        size: job.nhaTuyenDung.congTy.quyMo,
        country: job.nhaTuyenDung.congTy.quocGia,
        workingTime: job.nhaTuyenDung.congTy.thoiGianLamViec,
        otPolicy: job.nhaTuyenDung.congTy.chinhSachOT,
      },
    };

    return formattedJob;
  }
}
