import slugify from 'slugify';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { sanitizeRichText } from 'src/common/utils/sanitize-html.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsFilterDto } from './dto/get-jobs-filter.dto';
import { SearchJobsDto, JobSortBy } from './dto/search-jobs.dto';
import { GetEmployerJobsQueryDto } from './dto/get-employer-jobs-query.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { RepostJobDto } from './dto/repost-job.dto';
import { Prisma } from '@prisma/client';
import {
  JobDetailResponse,
  EmployerJobListItem,
  EmployerJobDetailResponse,
} from '@viecngon/types';
import { formatSalaryDisplay } from 'src/common/utils/format-salary';

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

// 5. Interface cho Bảng trung gian Công Việc - Kỹ Năng
export interface CongViecKyNangData {
  maCongViec: string;
  maKyNang: string;
  kyNang: KyNangData; // Join bảng Kỹ Năng
}

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) { }

  // Hàm private để dọn dẹp HTML dùng chung
  private sanitizeContent(htmlContent?: string): string | null {
    return sanitizeRichText(htmlContent);
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
    // 3. Xử lý an toàn trường maChiNhanh:
    // Kiểm tra chi nhánh có tồn tại và thuộc đúng công ty của NTD hay không
    let validatedChiNhanhId: string | null = null;
    const rawBranchId = createJobDto.maChiNhanh?.trim();
    if (
      rawBranchId &&
      rawBranchId !== '' &&
      rawBranchId !== 'null' &&
      rawBranchId !== 'undefined'
    ) {
      const chiNhanh = await this.prisma.chiNhanh.findFirst({
        where: {
          maChiNhanh: rawBranchId,
          maCongTy: nhaTuyenDung.maCongTy,
        },
      });
      if (chiNhanh) {
        validatedChiNhanhId = chiNhanh.maChiNhanh;
      }
    }

    // 4. Lưu vào Database
    return this.prisma.congViec.create({
      data: {
        ...jobData,
        slug: uniqueSlug,
        moTa: cleanMoTa,
        yeuCauCongViec: cleanYeuCau,
        phucLoi: cleanPhucLoi,
        maChiNhanh: validatedChiNhanhId,
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

    // Xử lý an toàn trường maChiNhanh khi update
    if ('maChiNhanh' in updateData) {
      const rawBranchId = updateData.maChiNhanh?.trim();
      if (
        rawBranchId &&
        rawBranchId !== '' &&
        rawBranchId !== 'null' &&
        rawBranchId !== 'undefined'
      ) {
        const branchExists = await this.prisma.chiNhanh.findUnique({
          where: { maChiNhanh: rawBranchId },
        });
        dataToUpdate.maChiNhanh = branchExists ? branchExists.maChiNhanh : null;
      } else {
        dataToUpdate.maChiNhanh = null;
      }
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
      salaryDisplay: formatSalaryDisplay(
        job.mucLuongToiThieu,
        job.mucLuongToiDa,
      ),

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

  async getJobs(filters: SearchJobsDto | GetJobsFilterDto) {
      const page = Math.max(1, Number(filters.page) || 1);
      const limit = Math.max(1, Number((filters as SearchJobsDto).limit) || 10);
      const skip = (page - 1) * limit;

      const {
        keyword,
        thanhPho,
        loaiHinh,
        hinhThucLamViec,
        capBac,
        yeuCauKinhNghiem,
        mucLuongMin,
        mucLuongMax,
        salaryRange,
        negotiable,
        sortBy = JobSortBy.NEWEST,
      } = filters as SearchJobsDto;

      // Hỗ trợ tham số cũ mucLuong nếu có
      const legacySalary = (filters as GetJobsFilterDto).mucLuong;

      const now = new Date();

      // Bước 1: Xây dựng điều kiện Where (Type-safe 100%)
      const andConditions: Prisma.CongViecWhereInput[] = [
        // 1. Ràng buộc trạng thái: Chỉ lấy các tin được duyệt / đang tuyển
        {
          OR: [
            { trangThai: 'DA_DUYET' },
            { trangThai: 'Đang tuyển' },
            { trangThai: 'ACTIVE' },
          ],
        },
        // 2. Ràng buộc thời hạn: Chưa hết hạn
        {
          OR: [{ ngayHetHan: null }, { ngayHetHan: { gte: now } }],
        },
      ];

      // 3. Tìm kiếm theo từ khóa (Tên công việc, Tên công ty hoặc Kỹ năng)
      if (keyword && keyword.trim()) {
        const kw = keyword.trim();
        andConditions.push({
          OR: [
            { tenCongViec: { contains: kw } },
            { nhaTuyenDung: { congTy: { tenCongTy: { contains: kw } } } },
            {
              congViecKyNangs: {
                some: {
                  kyNang: {
                    tenKyNang: { contains: kw },
                  },
                },
              },
            },
          ],
        });
      }

      // 4. Lọc theo Thành phố
      if (thanhPho && thanhPho.trim()) {
        andConditions.push({ thanhPho: { contains: thanhPho.trim() } });
      }

      // 5. Lọc theo Loại hình (Full-time, Part-time, Freelance)
      if (loaiHinh && loaiHinh.trim()) {
        andConditions.push({ loaiHinh: { contains: loaiHinh.trim() } });
      }

      // 6. Lọc theo Hình thức làm việc (Remote, Tại văn phòng, Hybrid)
      if (hinhThucLamViec && hinhThucLamViec.trim()) {
        andConditions.push({
          hinhThucLamViec: { contains: hinhThucLamViec.trim() },
        });
      }

      // 7. Lọc theo Cấp bậc (Intern, Fresher, Junior, Senior, Manager)
      if (capBac && capBac.trim()) {
        andConditions.push({ capBac: { contains: capBac.trim() } });
      }

      // 8. Lọc theo Số năm kinh nghiệm
      if (yeuCauKinhNghiem !== undefined && yeuCauKinhNghiem !== null) {
        const expNum = Number(yeuCauKinhNghiem);
        if (!isNaN(expNum)) {
          if (expNum === 0) {
            // Chưa có kinh nghiệm: yêu cầu 0 năm hoặc không yêu cầu
            andConditions.push({
              OR: [{ yeuCauKinhNghiem: null }, { yeuCauKinhNghiem: 0 }],
            });
          } else {
            // Tìm việc phù hợp với số năm kinh nghiệm <= expNum
            andConditions.push({
              OR: [
                { yeuCauKinhNghiem: null },
                { yeuCauKinhNghiem: { lte: expNum } },
              ],
            });
          }
        }
      }

      // 9. Lọc theo Mức lương
      if (negotiable || salaryRange === 'NEGOTIABLE') {
        andConditions.push({
          OR: [
            { mucLuongToiThieu: null, mucLuongToiDa: null },
            { mucLuongToiDa: { lte: 0 } },
          ],
        });
      } else if (salaryRange) {
        switch (salaryRange) {
          case 'UNDER_10': // Dưới 10 triệu
            andConditions.push({
              mucLuongToiDa: { lte: 10000000, gt: 0 },
            });
            break;
          case '10_20': // 10 - 20 triệu
            andConditions.push({
              AND: [
                { mucLuongToiThieu: { lte: 20000000 } },
                { mucLuongToiDa: { gte: 10000000 } },
              ],
            });
            break;
          case '20_30': // 20 - 30 triệu
            andConditions.push({
              AND: [
                { mucLuongToiThieu: { lte: 30000000 } },
                { mucLuongToiDa: { gte: 20000000 } },
              ],
            });
            break;
          case 'OVER_30': // Trên 30 triệu
            andConditions.push({
              mucLuongToiDa: { gte: 30000000 },
            });
            break;
        }
      } else if (mucLuongMin !== undefined || mucLuongMax !== undefined) {
        if (mucLuongMin !== undefined) {
          andConditions.push({
            OR: [
              { mucLuongToiDa: { gte: Number(mucLuongMin) } },
              { mucLuongToiThieu: { gte: Number(mucLuongMin) } },
            ],
          });
        }
        if (mucLuongMax !== undefined) {
          andConditions.push({
            OR: [
              { mucLuongToiThieu: { lte: Number(mucLuongMax) } },
              { mucLuongToiDa: { lte: Number(mucLuongMax) } },
            ],
          });
        }
      } else if (legacySalary) {
        andConditions.push({
          OR: [
            { mucLuongToiDa: { gte: Number(legacySalary) } },
            { mucLuongToiThieu: { gte: Number(legacySalary) } },
          ],
        });
      }

      const whereCondition: Prisma.CongViecWhereInput = {
        AND: andConditions,
      };

        // Sắp xếp
        let orderBy: Prisma.CongViecOrderByWithRelationInput = {
          ngayDang: 'desc',
        };
        if (sortBy === JobSortBy.SALARY_DESC) {
          orderBy = { mucLuongToiDa: 'desc' };
        } else if (sortBy === JobSortBy.MOST_VIEWED) {
          orderBy = { luotXem: 'desc' };
        }

        // Bước 2: Query database
        const [jobs, total] = await Promise.all([
          this.prisma.congViec.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy,
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

        // Bước 3: Format dữ liệu chuẩn
        const formattedJobs = jobs.map((job) => this.formatJobData(job));

        return {
          data: formattedJobs,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
          },
          total,
          page,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }

  /**
   * Lấy chi tiết một công việc theo Slug
   * Học tập từ hàm getCompanyDetailBySlug()
   */
  async getJobDetailBySlug(slug: string): Promise < JobDetailResponse > {
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

        if(!job) {
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
      salaryDisplay: formatSalaryDisplay(
        job.mucLuongToiThieu,
        job.mucLuongToiDa,
      ),
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
        website: company.website,
      },
    };
  }

  // =====================================================================
  // EMPLOYER JOB MANAGEMENT METHODS (QUẢN LÝ BÀI ĐĂNG TUYỂN DỤNG)
  // =====================================================================

  /**
   * 1. Lấy danh sách tin tuyển dụng của công ty (có tìm kiếm, lọc theo status và phân trang)
   */
  async getEmployerJobs(userId: string, query: GetEmployerJobsQueryDto) {
    const {
      search,
      status = 'ALL',
      sortBy = 'newest',
    } = query;

    // Đảm bảo page và limit luôn luôn là kiểu number nguyên (Int), tránh lỗi PrismaClientValidationError khi query từ HTTP URL
    const pageNum = Math.max(1, Number(query.page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    const now = new Date();

    // Lấy toàn bộ bài đăng thuộc công ty để tính countsByStatus chính xác cho Tabs
    const allCompanyJobs = await this.prisma.congViec.findMany({
      where: {
        nhaTuyenDung: { maCongTy: nhaTuyenDung.maCongTy },
      },
      select: {
        maCongViec: true,
        trangThai: true,
        ngayHetHan: true,
      },
    });

    const countsByStatus = {
      ALL: allCompanyJobs.length,
      DA_DUYET: 0,
      CHO_DUYET: 0,
      TU_CHUOI: 0,
      NHAP: 0,
      HET_HAN: 0,
      DA_AN: 0,
    };

    allCompanyJobs.forEach((j) => {
      const isExpired = j.ngayHetHan ? new Date(j.ngayHetHan) < now : false;
      const st = j.trangThai?.trim();

      if (isExpired || st === 'HET_HAN' || st === 'Hết hạn') {
        countsByStatus.HET_HAN++;
      } else if (st === 'CHO_DUYET' || st === 'Chờ duyệt') {
        countsByStatus.CHO_DUYET++;
      } else if (st === 'DA_AN' || st === 'Đã ẩn' || st === 'Đã đóng') {
        countsByStatus.DA_AN++;
      } else if (st === 'TU_CHUOI' || st === 'Từ chối') {
        countsByStatus.TU_CHUOI++;
      } else if (st === 'NHAP' || st === 'Nháp') {
        countsByStatus.NHAP++;
      } else if (
        st === 'DA_DUYET' ||
        st === 'DANG_TUYEN' ||
        st === 'Đang tuyển'
      ) {
        countsByStatus.DA_DUYET++;
      } else {
        countsByStatus.DA_DUYET++;
      }
    });

    // Xây dựng điều kiện WHERE cho query phân trang
    const whereCondition: Prisma.CongViecWhereInput = {
      nhaTuyenDung: { maCongTy: nhaTuyenDung.maCongTy },
    };

    // Lọc theo keyword tìm kiếm
    if (search && search.trim() !== '') {
      const term = search.trim();
      whereCondition.OR = [
        { tenCongViec: { contains: term } },
        { thanhPho: { contains: term } },
        { capBac: { contains: term } },
      ];
    }

    // Lọc theo trạng thái
    if (status && status !== 'ALL') {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'HET_HAN') {
        whereCondition.OR = [
          { trangThai: { in: ['HET_HAN', 'Hết hạn'] } },
          { ngayHetHan: { lt: now } },
        ];
      } else if (upperStatus === 'DA_DUYET' || upperStatus === 'DANG_TUYEN') {
        whereCondition.AND = [
          { trangThai: { in: ['DA_DUYET', 'DANG_TUYEN', 'Đang tuyển'] } },
          { OR: [{ ngayHetHan: null }, { ngayHetHan: { gte: now } }] },
        ];
      } else if (upperStatus === 'CHO_DUYET') {
        whereCondition.trangThai = { in: ['CHO_DUYET', 'Chờ duyệt'] };
      } else if (upperStatus === 'DA_AN') {
        whereCondition.trangThai = { in: ['DA_AN', 'Đã ẩn', 'Đã đóng'] };
      } else if (upperStatus === 'TU_CHUOI') {
        whereCondition.trangThai = { in: ['TU_CHUOI', 'Từ chối'] };
      } else if (upperStatus === 'NHAP') {
        whereCondition.trangThai = { in: ['NHAP', 'Nháp'] };
      }
    }

    // Xác định thứ tự sắp xếp
    let orderBy: Prisma.CongViecOrderByWithRelationInput = { ngayDang: 'desc' };
    if (sortBy === 'expiring_soon') {
      orderBy = { ngayHetHan: 'asc' };
    } else if (sortBy === 'most_viewed') {
      orderBy = { luotXem: 'desc' };
    }

    const [total, jobs] = await Promise.all([
      this.prisma.congViec.count({ where: whereCondition }),
      this.prisma.congViec.findMany({
        where: whereCondition,
        skip,
        take: limitNum,
        orderBy,
        include: {
          chiNhanh: true,
          congViecKyNangs: {
            include: { kyNang: true },
          },
          _count: {
            select: { donXinViecs: true },
          },
        },
      }),
    ]);

    const formattedJobs: EmployerJobListItem[] = jobs.map((job) => {
      const isExpired = job.ngayHetHan ? new Date(job.ngayHetHan) < now : false;
      const min = job.mucLuongToiThieu ? Number(job.mucLuongToiThieu) : null;
      const max = job.mucLuongToiDa ? Number(job.mucLuongToiDa) : null;

      let mappedStatus = job.trangThai;
      if (isExpired) {
        mappedStatus = 'HET_HAN';
      } else if (
        job.trangThai === 'Đang tuyển' ||
        job.trangThai === 'DANG_TUYEN'
      ) {
        mappedStatus = 'DA_DUYET';
      } else if (job.trangThai === 'Chờ duyệt') {
        mappedStatus = 'CHO_DUYET';
      } else if (job.trangThai === 'Đã đóng' || job.trangThai === 'Đã ẩn') {
        mappedStatus = 'DA_AN';
      }

      return {
        id: job.maCongViec,
        title: job.tenCongViec,
        slug: job.slug,
        salaryDisplay: formatSalaryDisplay(
          job.mucLuongToiThieu,
          job.mucLuongToiDa,
        ),
        minSalary: min,
        maxSalary: max,
        experienceYears: job.yeuCauKinhNghiem,
        level: job.capBac,
        city: job.thanhPho,
        jobType: job.loaiHinh,
        workModel: job.hinhThucLamViec,
        status: mappedStatus,
        postedAt: job.ngayDang.toISOString(),
        deadline: job.ngayHetHan ? job.ngayHetHan.toISOString() : null,
        updatedAt: job.ngayCapNhat.toISOString(),
        views: job.luotXem,
        applicationsCount: job._count.donXinViecs,
        skills: job.congViecKyNangs.map((ck) => ({
          id: ck.kyNang.maKyNang,
          name: ck.kyNang.tenKyNang,
        })),
        branch: job.chiNhanh
          ? {
            id: job.chiNhanh.maChiNhanh,
            city: job.chiNhanh.thanhPho,
            address: job.chiNhanh.diaChi,
          }
          : null,
        isExpired,
      };
    });

    return {
      data: formattedJobs,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      countsByStatus,
    };
  }

  /**
   * 2. Lấy chi tiết tin tuyển dụng của NTD (dùng để xem và pre-fill Form chỉnh sửa)
   */
  async getEmployerJobById(
    userId: string,
    jobId: string,
  ): Promise<EmployerJobDetailResponse> {
    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec: jobId },
      include: {
        nhaTuyenDung: true,
        chiNhanh: true,
        congViecKyNangs: {
          include: { kyNang: true },
        },
        _count: {
          select: { donXinViecs: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(
        `Không tìm thấy tin tuyển dụng với ID: ${jobId}`,
      );
    }

    // Kiểm tra quyền sở hữu (cùng maNTD hoặc cùng maCongTy)
    if (
      job.nhaTuyenDung.maCongTy !== nhaTuyenDung.maCongTy &&
      job.maNTD !== nhaTuyenDung.maNTD
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập tin tuyển dụng này.',
      );
    }

    const isExpired = job.ngayHetHan
      ? new Date(job.ngayHetHan) < new Date()
      : false;

    return {
      maCongViec: job.maCongViec,
      tenCongViec: job.tenCongViec,
      slug: job.slug,
      moTa: job.moTa,
      yeuCauCongViec: job.yeuCauCongViec,
      phucLoi: job.phucLoi,
      mucLuongToiThieu: job.mucLuongToiThieu
        ? Number(job.mucLuongToiThieu)
        : null,
      mucLuongToiDa: job.mucLuongToiDa ? Number(job.mucLuongToiDa) : null,
      yeuCauKinhNghiem: job.yeuCauKinhNghiem,
      capBac: job.capBac,
      thanhPho: job.thanhPho,
      loaiHinh: job.loaiHinh,
      hinhThucLamViec: job.hinhThucLamViec,
      ngayDang: job.ngayDang.toISOString(),
      ngayHetHan: job.ngayHetHan ? job.ngayHetHan.toISOString() : null,
      ngayCapNhat: job.ngayCapNhat.toISOString(),
      luotXem: job.luotXem,
      trangThai: job.trangThai,
      maChiNhanh: job.maChiNhanh,
      kyNangs: job.congViecKyNangs.map((ck) => ck.maKyNang),
      skills: job.congViecKyNangs.map((ck) => ({
        id: ck.kyNang.maKyNang,
        name: ck.kyNang.tenKyNang,
      })),
      branch: job.chiNhanh
        ? {
          id: job.chiNhanh.maChiNhanh,
          city: job.chiNhanh.thanhPho,
          address: job.chiNhanh.diaChi,
        }
        : null,
      applicationsCount: job._count.donXinViecs,
      isExpired,
    };
  }

  /**
   * 3. Chỉnh sửa tin tuyển dụng với Sanitize Rich Text & Kiểm tra quyền sở hữu
   */
  async updateEmployerJob(userId: string, jobId: string, dto: UpdateJobDto) {
    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    const existingJob = await this.prisma.congViec.findUnique({
      where: { maCongViec: jobId },
      include: { nhaTuyenDung: true },
    });
    if (!existingJob) {
      throw new NotFoundException(
        `Không tìm thấy tin tuyển dụng với ID: ${jobId}`,
      );
    }

    if (
      existingJob.nhaTuyenDung.maCongTy !== nhaTuyenDung.maCongTy &&
      existingJob.maNTD !== nhaTuyenDung.maNTD
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa tin tuyển dụng này.',
      );
    }

    const { kyNangs, ...fields } = dto;
    const dataToUpdate: Prisma.CongViecUpdateInput = {};

    // 1. Sanitize Rich Text
    if (fields.moTa !== undefined) {
      dataToUpdate.moTa = this.sanitizeContent(fields.moTa);
    }
    if (fields.yeuCauCongViec !== undefined) {
      dataToUpdate.yeuCauCongViec = this.sanitizeContent(fields.yeuCauCongViec);
    }
    if (fields.phucLoi !== undefined) {
      dataToUpdate.phucLoi = this.sanitizeContent(fields.phucLoi);
    }

    // 2. Title & Slug
    if (fields.tenCongViec && fields.tenCongViec.trim() !== '') {
      dataToUpdate.tenCongViec = fields.tenCongViec.trim();
      if (fields.tenCongViec.trim() !== existingJob.tenCongViec) {
        const baseSlug = slugify(fields.tenCongViec.trim(), {
          lower: true,
          locale: 'vi',
        });
        dataToUpdate.slug = `${baseSlug}-${Date.now()}`;
      }
    }

    // 3. Regular fields
    if (fields.capBac !== undefined) dataToUpdate.capBac = fields.capBac;
    if (fields.loaiHinh !== undefined) dataToUpdate.loaiHinh = fields.loaiHinh;
    if (fields.hinhThucLamViec !== undefined)
      dataToUpdate.hinhThucLamViec = fields.hinhThucLamViec;
    if (fields.thanhPho !== undefined)
      dataToUpdate.thanhPho = fields.thanhPho?.trim() || null;
    if (fields.yeuCauKinhNghiem !== undefined)
      dataToUpdate.yeuCauKinhNghiem = fields.yeuCauKinhNghiem;
    if (fields.mucLuongToiThieu !== undefined)
      dataToUpdate.mucLuongToiThieu = fields.mucLuongToiThieu;
    if (fields.mucLuongToiDa !== undefined)
      dataToUpdate.mucLuongToiDa = fields.mucLuongToiDa;
    if (fields.ngayHetHan !== undefined) {
      dataToUpdate.ngayHetHan = fields.ngayHetHan
        ? new Date(fields.ngayHetHan)
        : null;
    }

    // 4. Branch validation
    if ('maChiNhanh' in fields) {
      const rawBranch = fields.maChiNhanh?.trim();
      if (
        rawBranch &&
        rawBranch !== '' &&
        rawBranch !== 'null' &&
        rawBranch !== 'undefined' &&
        fields.hinhThucLamViec !== 'Remote'
      ) {
        const branch = await this.prisma.chiNhanh.findFirst({
          where: {
            maChiNhanh: rawBranch,
            maCongTy: nhaTuyenDung.maCongTy,
          },
        });
        dataToUpdate.chiNhanh = branch
          ? { connect: { maChiNhanh: branch.maChiNhanh } }
          : { disconnect: true };
      } else {
        dataToUpdate.chiNhanh = { disconnect: true };
      }
    }

    // 5. Quy tắc chuyển trạng thái: Nếu tin đang hiển thị mà sửa thông tin chính (Title, Mô tả, Yêu cầu)
    // Hệ thống tự động chuyển về 'CHO_DUYET' (nếu không có trangThai truyền vào)
    const isCriticalFieldChanged =
      (fields.tenCongViec && fields.tenCongViec !== existingJob.tenCongViec) ||
      (fields.moTa && fields.moTa !== existingJob.moTa) ||
      (fields.yeuCauCongViec &&
        fields.yeuCauCongViec !== existingJob.yeuCauCongViec);

    if (fields.trangThai) {
      dataToUpdate.trangThai = fields.trangThai;
    } else if (
      (existingJob.trangThai === 'DA_DUYET' ||
        existingJob.trangThai === 'Đang tuyển') &&
      isCriticalFieldChanged
    ) {
      dataToUpdate.trangThai = 'CHO_DUYET';
    }

    dataToUpdate.ngayCapNhat = new Date();

    // 6. Prisma Transaction cập nhật Job và bảng trung gian Kỹ năng
    return this.prisma.$transaction(async (tx) => {
      if (Array.isArray(kyNangs)) {
        await tx.congViecKyNang.deleteMany({
          where: { maCongViec: jobId },
        });
        if (kyNangs.length > 0) {
          await tx.congViecKyNang.createMany({
            data: kyNangs.map((id) => ({
              maCongViec: jobId,
              maKyNang: id,
            })),
          });
        }
      }

      return tx.congViec.update({
        where: { maCongViec: jobId },
        data: dataToUpdate,
        include: {
          chiNhanh: true,
          congViecKyNangs: { include: { kyNang: true } },
        },
      });
    });
  }

  /**
   * 4. Đăng lại / Gia hạn tin tuyển dụng đã hết hạn hoặc tạm ẩn
   */
  async repostEmployerJob(userId: string, jobId: string, dto: RepostJobDto) {
    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec: jobId },
      include: { nhaTuyenDung: true },
    });
    if (!job) {
      throw new NotFoundException(
        `Không tìm thấy tin tuyển dụng với ID: ${jobId}`,
      );
    }

    if (
      job.nhaTuyenDung.maCongTy !== nhaTuyenDung.maCongTy &&
      job.maNTD !== nhaTuyenDung.maNTD
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền đăng lại tin tuyển dụng này.',
      );
    }

    // Tính toán ngày hết hạn mới: mặc định +30 ngày kể từ hiện tại nếu không cung cấp
    let newDeadline: Date;
    if (dto.ngayHetHanMoi) {
      newDeadline = new Date(dto.ngayHetHanMoi);
    } else {
      newDeadline = new Date();
      newDeadline.setDate(newDeadline.getDate() + 30);
    }

    return this.prisma.congViec.update({
      where: { maCongViec: jobId },
      data: {
        ngayDang: new Date(),
        ngayHetHan: newDeadline,
        trangThai: 'DA_DUYET', // Kích hoạt lại tin
        ngayCapNhat: new Date(),
      },
      include: {
        chiNhanh: true,
        congViecKyNangs: { include: { kyNang: true } },
      },
    });
  }

  /**
   * 5. Tạm ẩn / Kích hoạt lại tin tuyển dụng
   */
  async toggleJobVisibility(userId: string, jobId: string) {
    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec: jobId },
      include: { nhaTuyenDung: true },
    });
    if (!job) {
      throw new NotFoundException(
        `Không tìm thấy tin tuyển dụng với ID: ${jobId}`,
      );
    }

    if (
      job.nhaTuyenDung.maCongTy !== nhaTuyenDung.maCongTy &&
      job.maNTD !== nhaTuyenDung.maNTD
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác tin tuyển dụng này.',
      );
    }

    const isCurrentlyHidden =
      job.trangThai === 'DA_AN' ||
      job.trangThai === 'Đã đóng' ||
      job.trangThai === 'Đã ẩn';

    const newStatus = isCurrentlyHidden ? 'DA_DUYET' : 'DA_AN';

    return this.prisma.congViec.update({
      where: { maCongViec: jobId },
      data: {
        trangThai: newStatus,
        ngayCapNhat: new Date(),
      },
    });
  }

  /**
   * 6. Xóa tin tuyển dụng an toàn có kiểm tra quyền sở hữu
   */
  async removeEmployerJob(userId: string, jobId: string) {
    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });
    if (!nhaTuyenDung) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec: jobId },
      include: { nhaTuyenDung: true },
    });
    if (!job) {
      throw new NotFoundException(
        `Không tìm thấy tin tuyển dụng với ID: ${jobId}`,
      );
    }

    if (
      job.nhaTuyenDung.maCongTy !== nhaTuyenDung.maCongTy &&
      job.maNTD !== nhaTuyenDung.maNTD
    ) {
      throw new ForbiddenException('Bạn không có quyền xóa tin tuyển dụng này.');
    }

    // Xóa liên kết kỹ năng trước, sau đó xóa tin tuyển dụng
    await this.prisma.$transaction([
      this.prisma.congViecKyNang.deleteMany({
        where: { maCongViec: jobId },
      }),
      this.prisma.congViec.delete({
        where: { maCongViec: jobId },
      }),
    ]);

    return { message: 'Xóa tin tuyển dụng thành công.' };
  }
}
