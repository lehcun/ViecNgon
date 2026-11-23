import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminPackagesController } from './admin-packages.controller';
import { AdminPackagesService } from './admin-packages.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminPackagesController],
  providers: [AdminPackagesService],
  exports: [AdminPackagesService],
})
export class AdminPackagesModule {}
