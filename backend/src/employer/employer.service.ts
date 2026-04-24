import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';

@Injectable()
export class EmployerService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployerDto: CreateEmployerDto) {
    return 'This action adds a new employer';
  }

  findAll() {
    return this.prisma.congTy.findMany({});
  }

  async getCompaniesWithJobCount() {
    // Bước 1: Query database bằng Prisma
    const companies = await this.prisma.congTy.findMany({
      select: {
        maCongTy: true,
        tenCongTy: true,
        urlLogo: true,
        diaChi: true,
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
    const formattedCompanies = companies.map((company) => {
      // Một công ty có thể có nhiều HR, phải cộng dồn tổng số tin của tất cả HR đó lại
      const totalJobs = company.nhaTuyenDungs.reduce(
        (sum, hr) => sum + hr._count.congViecs,
        0,
      );

      return {
        id: company.maCongTy,
        name: company.tenCongTy,
        logo: company.urlLogo,
        location: company.diaChi,
        jobs: totalJobs, // Đây là tổng số việc làm hiển thị trên Card
      };
    });

    return formattedCompanies;
  }

  findOne(id: number) {
    return `This action returns a #${id} employer`;
  }

  update(id: number, updateEmployerDto: UpdateEmployerDto) {
    return `This action updates a #${id} employer`;
  }

  remove(id: number) {
    return `This action removes a #${id} employer`;
  }
}
