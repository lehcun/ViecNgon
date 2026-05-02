import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface FormattedTopCompany {
  name: string;
  logo: string | null;
  location: string | null;
  slug: string;
  jobs: number;
}

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
}
