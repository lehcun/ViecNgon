import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyDetailResponse, FormattedTopCompany } from '@viecngon/types';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // async createCompany(data: CreateCompanyDto) {
  //   const baseSlug = generateSlug(data.tenCongTy);

  //   // Logic xử lý nếu trùng slug (thêm chuỗi ngẫu nhiên hoặc timestamp)
  //   const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  //   return this.prisma.congTy.create({
  //     data: {
  //       ...data,
  //       slug: uniqueSlug,
  //     },
  //   });
  // }

  findAll() {
    return this.prisma.congTy.findMany({});
  }

  async getCompaniesWithJobCount() {
    // Bước 1: Query database bằng Prisma
    const companies = await this.prisma.congTy.findMany({
      select: {
        maCongTy: true,
        tenCongTy: true,
        logoUrl: true,
        thanhPho: true,
        slug: true,
        moTa: true,
        // Lồng vào bảng con NHATUYENDUNG để lấy dữ liệu đếm
        nhaTuyenDungs: {
          select: {
            _count: {
              select: {
                congViecs: {
                  where: {
                    trangThai: 'Đang tuyển',
                  },
                },
              },
            },
          },
        },
      },
      take: 8,
    });

    // Bước 2: Chuẩn hóa lại dữ liệu (Format) để khớp với Component Frontend
    const formattedCompanies: FormattedTopCompany[] = companies.map(
      (company) => {
        // Một công ty có thể có nhiều HR, phải cộng dồn tổng số tin của tất cả HR đó lại
        const totalJobs = company.nhaTuyenDungs.reduce((sum, hr) => {
          // TS tự hiểu hr có thuộc tính _count.congViecs nhờ Auto Inference
          const jobCount = hr._count?.congViecs ?? 0;
          return sum + jobCount;
        }, 0);

        return {
          id: company.maCongTy,
          name: company.tenCongTy,
          logo: company.logoUrl,
          location: company.thanhPho,
          slug: company.slug,
          description: company.moTa,
          jobs: totalJobs, // Đây là tổng số việc làm hiển thị trên Card
        };
      },
    );

    return formattedCompanies;
  }

  async getCompanyDetailBySlug(slug: string): Promise<CompanyDetailResponse> {
    // Bước 1: Truy vấn thông tin công ty và lồng bảng lấy các việc làm đang tuyển
    const company = await this.prisma.congTy.findUnique({
      where: { slug: slug },
      select: {
        maCongTy: true,
        tenCongTy: true,
        logoUrl: true,
        diaChi: true,
        website: true,
        slug: true,
        moTa: true,
        quocGia: true,
        thanhPho: true,
        moHinhCongTy: true,
        linhVuc: true,
        quyMo: true,
        thoiGianLamViec: true,
        chinhSachOT: true,
        nhaTuyenDungs: {
          select: {
            congViecs: {
              where: {
                trangThai: 'Đang tuyển', // Chỉ lấy các job còn hạn
              },
              select: {
                maCongViec: true,
                tenCongViec: true,
                mucLuongToiThieu: true,
                mucLuongToiDa: true,
                diaDiem: true,
                ngayHetHan: true,
              },
            },
          },
        },
      },
    });

    // Nếu người dùng gõ sai tên công ty trên URL
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty này');
    }

    // Bước 2: Gom tất cả việc làm từ các HR khác nhau vào chung một mảng phẳng (flat array)
    // flatMap sẽ lấy mảng congViecs của từng HR và trải phẳng chúng ra thành 1 mảng duy nhất
    const allActiveJobs = company.nhaTuyenDungs
      .flatMap((hr) => hr.congViecs)
      .map((job) => ({
        id: job.maCongViec,
        title: job.tenCongViec,

        salaryMin: job.mucLuongToiThieu ? Number(job.mucLuongToiThieu) : null,
        salaryMax: job.mucLuongToiDa ? Number(job.mucLuongToiDa) : null,

        location: job.diaDiem,
        deadline: job.ngayHetHan,
      }));

    // Bước 3: Trả về dữ liệu đã được Format gọn gàng
    return {
      id: company.maCongTy,
      name: company.tenCongTy,
      logo: company.logoUrl,
      location: company.diaChi,
      website: company.website,
      slug: company.slug,
      description: company.moTa,
      country: company.quocGia,
      city: company.thanhPho,
      companyModel: company.moHinhCongTy,
      industry: company.linhVuc,
      size: company.quyMo,
      workingTime: company.thoiGianLamViec,
      otPolicy: company.chinhSachOT,
      totalJobs: allActiveJobs.length,
      activeJobs: allActiveJobs,
    };
  }
}
