import slugify from 'slugify';
import { Injectable, NotFoundException } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsFilterDto } from './dto/get-jobs-filter.dto';
import { Prisma } from '@prisma/client';
import { JobDetailResponse } from '@viecngon/types';

// 1. Interface cho Công Ty
export interface CongTyData {
  maCongTy: string;
  tenCongTy: string;
  slug: string;
  moTa: string | null;
  phucLoi: string | null;
  thanhPho: string | null;
  tenPhapLy: string | null;
  chuyenMon: string | null;
  aboutMe: string | null;
  logoUrl: string | null;
  website: string | null;
  diaChi: string | null;
  moHinhCongTy: string | null;
  linhVuc: string | null;
  quyMo: string | null;
  quocGia: string | null;
  thoiGianLamViec: string | null;
  chinhSachOT: string | null;
  giaiThuong: string | null;
}

// 2. Interface cho Nhà Tuyển Dụng (Đã join bảng CongTy)
export interface NhaTuyenDungData {
  maNTD: string;
  maCongTy: string;
  maTaiKhoan: string;
  congTy: CongTyData;
}

// 3. Interface cho Chi Nhánh
export interface ChiNhanhData {
  maChiNhanh: string;
  maCongTy: string;
  thanhPho: string;
  diaChi: string;
  mapUrl: string | null;
}

// 4. Interface cho Kỹ Năng
export interface KyNangData {
  maKyNang: string;
  tenKyNang: string;
}

// 5. Interface cho Bảng trung gian Công Việc - Kỹ Năng
export interface CongViecKyNangData {
  maCongViec: string;
  maKyNang: string;
  kyNang: KyNangData; // Join bảng Kỹ Năng
}

// 6. INTERFACE CHÍNH CHO JOB (Để truyền vào hàm format)
export interface JobWithRelations {
  // Các trường gốc của bảng CongViec (Dựa theo Schema)
  maCongViec: string;
  tenCongViec: string;
  slug: string;
  moTa: string | null;
  yeuCauCongViec: string | null;
  phucLoi: string | null;

  // Lưu ý: Kiểu Decimal trong DB Prisma trả về là kiểu Decimal object, không phải number
  mucLuongToiThieu: Prisma.Decimal | null;
  mucLuongToiDa: Prisma.Decimal | null;

  yeuCauKinhNghiem: number | null;
  capBac: string | null;
  thanhPho: string | null;
  loaiHinh: string;
  hinhThucLamViec: string | null;

  ngayDang: Date;
  ngayHetHan: Date | null;
  ngayCapNhat: Date;
  luotXem: number;
  trangThai: string;

  maNTD: string;
  maChiNhanh: string | null;

  // Các trường Join (Relations)
  nhaTuyenDung: NhaTuyenDungData;
  chiNhanh: ChiNhanhData | null; // Có thể null vì chiNhanh là optional
  congViecKyNangs: CongViecKyNangData[];
}

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

  async remove(id: string) {
    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec: id },
    });

    if (!job) {
      throw new NotFoundException(`Không tìm thấy việc làm với ID: ${id}`);
    }

    await this.prisma.congViec.delete({
      where: { maCongViec: id },
    });

    return { message: 'Xóa việc làm thành công' };
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

  async getJobs(filters: GetJobsFilterDto) {
    const { thanhPho, loaiHinh, hinhThucLamViec, mucLuong, page = 1 } = filters;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    // Bước 1: Xây dựng điều kiện Where (Type-safe)
    const whereCondition: Prisma.CongViecWhereInput = {
      trangThai: 'Đang tuyển',
    };

    if (thanhPho) whereCondition.thanhPho = { contains: thanhPho };
    if (loaiHinh) whereCondition.loaiHinh = loaiHinh;
    if (hinhThucLamViec) whereCondition.hinhThucLamViec = hinhThucLamViec;

    if (mucLuong) {
      whereCondition.OR = [
        { mucLuongToiDa: { gte: Number(mucLuong) } },
        { mucLuongToiThieu: { gte: Number(mucLuong) } },
      ];
    }

    console.log(whereCondition);

    // Bước 2: Query database
    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { ngayDang: 'desc' },
        include: {
          nhaTuyenDung: {
            include: { congTy: true },
          },
          chiNhanh: true,
          congViecKyNangs: {
            include: { kyNang: true },
          },
        },
      }),
      this.prisma.congViec.count({ where: whereCondition }),
    ]);

    // Bước 3: Format lại dữ liệu (Giống cách làm bên CompanyService)
    const formattedJobs = jobs.map((job) => this.formatJobData(job));

    console.log(formattedJobs);

    return {
      data: formattedJobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy chi tiết một công việc theo Slug
   * Học tập từ hàm getCompanyDetailBySlug()
   */
  async getJobDetailBySlug(slug: string): Promise<JobDetailResponse> {
    const job = await this.prisma.congViec.findUnique({
      where: { slug },
      include: {
        nhaTuyenDung: {
          include: {
            congTy: true,
          },
        },
        congViecKyNangs: {
          include: {
            kyNang: true,
          },
        },
        chiNhanh: true, // Lấy thêm thông tin chi nhánh nếu cần
      },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng này');
    }

    // Tăng lượt xem tin (Logic bổ sung thường có trong Job Detail)
    await this.prisma.congViec.update({
      where: { maCongViec: job.maCongViec },
      data: { luotXem: { increment: 1 } },
    });

    return this.formatJobData(job);
  }

  /**
   * Hàm Helper để format dữ liệu Job đồng nhất (Private)
   */
  private formatJobData(job: JobWithRelations) {
    const min = job.mucLuongToiThieu ? Number(job.mucLuongToiThieu) : 0;
    const max = job.mucLuongToiDa ? Number(job.mucLuongToiDa) : 0;

    // Logic tính toán hiển thị lương (Copy từ logic bạn đã làm cho Company)
    let salaryDisplay = 'Thỏa thuận';
    if (min > 0 && max > 0) {
      salaryDisplay = `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
    } else if (min > 0) {
      salaryDisplay = `Từ ${min.toLocaleString()} VNĐ`;
    } else if (max > 0) {
      salaryDisplay = `Lên đến ${max.toLocaleString()} VNĐ`;
    }

    const company = job.nhaTuyenDung?.congTy;

    if (!company) {
      throw new Error(
        `Data Integrity Error: Job ${job.maCongViec} is missing Company info`,
      );
    }

    return {
      id: job.maCongViec,
      title: job.tenCongViec,
      slug: job.slug,
      description: job.moTa,
      requirements: job.yeuCauCongViec,
      benefits: job.phucLoi || '', // Chuyển String Tiptap thành mảng nếu cần
      salaryMin: min || null,
      salaryMax: max || null,
      salaryDisplay: salaryDisplay,
      experience: job.yeuCauKinhNghiem,
      level: job.capBac,
      location: job.thanhPho,
      type: job.loaiHinh,
      workModel: job.hinhThucLamViec || 'Linh hoạt',
      postedAt: job.ngayDang,
      deadline: job.ngayHetHan,
      updatedAt: job.ngayCapNhat,
      views: job.luotXem,
      status: job.trangThai,
      // Map kỹ năng từ bảng trung gian
      skills:
        job.congViecKyNangs
          ?.map((ck: CongViecKyNangData) => ck.kyNang?.tenKyNang)
          .filter(Boolean) || [],
      // Thông tin công ty lồng bên trong
      company: {
        id: company.maCongTy,
        name: company.tenCongTy,
        logo: company.logoUrl,
        slug: company.slug,
        companyModel: company.moHinhCongTy,
        industry: company.linhVuc,
        size: company.quyMo,
        country: company.quocGia,
        workingTime: company.thoiGianLamViec,
        otPolicy: company.chinhSachOT,
      },
    };
  }
}
