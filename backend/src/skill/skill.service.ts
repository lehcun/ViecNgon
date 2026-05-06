import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(readonly prisma: PrismaService) {}

  async findAll() {
    const skills = await this.prisma.kyNang.findMany();
    return skills.map((skill) => ({
      id: skill.maKyNang,
      name: skill.tenKyNang,
    }));
  }
}
