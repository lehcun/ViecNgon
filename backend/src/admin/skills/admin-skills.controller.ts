import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  AdminSkillActionResponse,
  AdminSkillsListResponse,
  DeleteAdminSkillResponse,
} from '@viecngon/types';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import { AdminSkillsService } from './admin-skills.service';
import { CreateAdminSkillDto } from './dto/create-admin-skill.dto';
import { MergeAdminSkillDto } from './dto/merge-admin-skill.dto';
import { QueryAdminSkillsDto } from './dto/query-admin-skills.dto';
import { UpdateAdminSkillDto } from './dto/update-admin-skill.dto';

@Controller('admin/skills')
@AdminOnly()
export class AdminSkillsController {
  constructor(private readonly adminSkillsService: AdminSkillsService) {}

  @Get()
  findAll(
    @Query() query: QueryAdminSkillsDto,
  ): Promise<AdminSkillsListResponse> {
    return this.adminSkillsService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateAdminSkillDto): Promise<AdminSkillActionResponse> {
    return this.adminSkillsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminSkillDto,
  ): Promise<AdminSkillActionResponse> {
    return this.adminSkillsService.update(id, dto);
  }

  @Post(':id/merge')
  merge(
    @Param('id') id: string,
    @Body() dto: MergeAdminSkillDto,
  ): Promise<AdminSkillActionResponse> {
    return this.adminSkillsService.merge(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteAdminSkillResponse> {
    return this.adminSkillsService.remove(id);
  }
}
