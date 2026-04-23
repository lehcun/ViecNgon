import { Injectable } from '@nestjs/common';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EmployerService {
  constructor(private readonly prisma: PrismaClient) {}

  create(createEmployerDto: CreateEmployerDto) {
    return 'This action adds a new employer';
  }

  findAll() {
    return this.prisma.congTy.findMany({
      include: {
        _count: {
          select: {
            congViec: true,
          },
        },
      },
    });
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
