// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Hàm này tự động chạy khi khởi động NestJS để kết nối DB
  async onModuleInit() {
    await this.$connect();
  }

  // Hàm này tự động chạy khi tắt server để ngắt kết nối an toàn
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
