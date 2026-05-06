import { Injectable, NotFoundException } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import slugify from 'slugify';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  // Hàm private để dọn dẹp HTML dùng chung
  private sanitizeContent(htmlContent?: string): string | null {
    if (!htmlContent) return null;
    return sanitizeHtml(htmlContent, {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'a',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'li',
        'ol',
        'br',
        'span',
        'div',
        'u',
      ],
      allowedAttributes: {
        a: ['href', 'target'],
        span: ['style'],
        p: ['style'],
      },
    });
  }

  async create(createJobDto: CreateJobDto) {
    // 1. Tạo Slug từ Tên công việc (VD: "Lập trình viên Java" -> "lap-trinh-vien-java-12345")
    const baseSlug = slugify(createJobDto.tenCongViec, {
      lower: true,
      locale: 'vi',
    });
    const uniqueSlug = `${baseSlug}-${Date.now()}`; // Đảm bảo unique tuyệt đối

    // 2. Làm sạch các trường chứa HTML từ Rich Text Editor
    const cleanMoTa = this.sanitizeContent(createJobDto.moTa);
    const cleanYeuCau = this.sanitizeContent(createJobDto.yeuCauCongViec);
    const cleanPhucLoi = this.sanitizeContent(createJobDto.phucLoi);

    const { kyNangs, maTaiKhoan, ...jobData } = createJobDto;

    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException(
        'Không tìm thấy thông tin nhà tuyển dụng cho tài khoản này.',
      );
    }
    // 3. Lưu vào Database
    return this.prisma.congViec.create({
      data: {
        ...jobData,
        slug: uniqueSlug,
        moTa: cleanMoTa,
        yeuCauCongViec: cleanYeuCau,
        phucLoi: cleanPhucLoi,
        maNTD: nhaTuyenDung.maNTD,
        congViecKyNangs: {
          create: kyNangs.map((id) => ({
            maKyNang: id,
          })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.congViec.findMany({
      where: { trangThai: 'Đang tuyển' },
      orderBy: { ngayDang: 'desc' },
      include: {
        nhaTuyenDung: true,
        // chiNhanh: true, // Mở comment nếu cần lấy thông tin chi nhánh
      },
    });
  }

  async findOne(maCongViec: string) {
    // 1. Tăng lượt xem lên 1 đơn vị mỗi lần gọi API lấy chi tiết
    await this.prisma.congViec.update({
      where: { maCongViec },
      data: { luotXem: { increment: 1 } },
    });

    // 2. Lấy dữ liệu công việc kèm quan hệ
    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec },
      include: {
        nhaTuyenDung: true,
        chiNhanh: true,
        congViecKyNangs: {
          include: {
            kyNang: true, // Trích xuất thêm tên kỹ năng nếu bạn có bảng KyNang
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(
        `Không tìm thấy công việc với mã: ${maCongViec}`,
      );
    }

    return job;
  }

  async update(maCongViec: string, updateData: Partial<CreateJobDto>) {
    // Làm sạch lại dữ liệu nếu HR có cập nhật các trường Rich Text
    const dataToUpdate: Record<string, any> = { ...updateData };

    if (typeof updateData.moTa === 'string') {
      dataToUpdate.moTa = this.sanitizeContent(updateData.moTa);
    }
    if (typeof updateData.yeuCauCongViec === 'string') {
      dataToUpdate.yeuCauCongViec = this.sanitizeContent(
        updateData.yeuCauCongViec,
      );
    }
    if (typeof updateData.phucLoi === 'string') {
      dataToUpdate.phucLoi = this.sanitizeContent(updateData.phucLoi);
    }

    // Cập nhật ngày cập nhật mới nhất
    dataToUpdate.ngayCapNhat = new Date();

    return this.prisma.congViec.update({
      where: { maCongViec },
      data: dataToUpdate,
    });
  }

  async remove(maCongViec: string) {
    return this.prisma.congViec.delete({
      where: { maCongViec },
    });
  }

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
      benefits: job.phucLoi,

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
