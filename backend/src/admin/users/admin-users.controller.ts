import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import type {
  AdminUserActionResponse,
  AdminUserDetailResponse,
  AdminUsersListResponse,
  DeleteAdminUserResponse,
} from '@viecngon/types';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AdminUsersService } from './admin-users.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { QueryAdminUsersDto } from './dto/query-admin-users.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('admin/users')
@AdminOnly()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  findAll(@Query() query: QueryAdminUsersDto): Promise<AdminUsersListResponse> {
    return this.adminUsersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdminUserDetailResponse> {
    return this.adminUsersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser('userId') currentAdminId: string,
  ): Promise<AdminUserActionResponse> {
    return this.adminUsersService.updateStatus(id, dto, currentAdminId);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser('userId') currentAdminId: string,
  ): Promise<AdminUserActionResponse> {
    return this.adminUsersService.updateRole(id, dto, currentAdminId);
  }

  @Delete(':id')
  softDelete(
    @Param('id') id: string,
    @Body() dto: DeleteUserDto,
    @CurrentUser('userId') currentAdminId: string,
  ): Promise<DeleteAdminUserResponse> {
    return this.adminUsersService.softDelete(id, dto, currentAdminId);
  }
}
