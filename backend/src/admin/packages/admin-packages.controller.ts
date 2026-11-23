import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  AdminPackageActionResponse,
  AdminPackagesListResponse,
  AdminTransactionsListResponse,
  ConfirmAdminTransactionResponse,
} from '@viecngon/types';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import { AdminPackagesService } from './admin-packages.service';
import { CreateAdminPackageDto } from './dto/create-admin-package.dto';
import { QueryAdminPackagesDto } from './dto/query-admin-packages.dto';
import { QueryAdminTransactionsDto } from './dto/query-admin-transactions.dto';
import { UpdateAdminPackageDto } from './dto/update-admin-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Controller('admin/packages')
@AdminOnly()
export class AdminPackagesController {
  constructor(private readonly adminPackagesService: AdminPackagesService) {}

  @Get()
  findAllPackages(
    @Query() query: QueryAdminPackagesDto,
  ): Promise<AdminPackagesListResponse> {
    return this.adminPackagesService.findAllPackages(query);
  }

  @Post()
  createPackage(
    @Body() dto: CreateAdminPackageDto,
  ): Promise<AdminPackageActionResponse> {
    return this.adminPackagesService.createPackage(dto);
  }

  @Get('transactions')
  findAllTransactions(
    @Query() query: QueryAdminTransactionsDto,
  ): Promise<AdminTransactionsListResponse> {
    return this.adminPackagesService.findAllTransactions(query);
  }

  @Patch('transactions/:id/confirm')
  confirmTransaction(
    @Param('id') id: string,
  ): Promise<ConfirmAdminTransactionResponse> {
    return this.adminPackagesService.confirmTransaction(id);
  }

  @Patch(':id')
  updatePackage(
    @Param('id') id: string,
    @Body() dto: UpdateAdminPackageDto,
  ): Promise<AdminPackageActionResponse> {
    return this.adminPackagesService.updatePackage(id, dto);
  }

  @Patch(':id/status')
  updatePackageStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePackageStatusDto,
  ): Promise<AdminPackageActionResponse> {
    return this.adminPackagesService.updatePackageStatus(id, dto);
  }
}
