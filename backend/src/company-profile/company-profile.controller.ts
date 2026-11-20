import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type {
  CompanyProfilePostItem,
  CompanyProfileResponse,
  UpdateCompanyProfileResponse,
} from '@viecngon/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CloudinaryService,
  type UploadedBinaryFile,
} from '../cloudinary/cloudinary.service';
import { CompanyProfileService } from './company-profile.service';
import {
  CreateCompanyPostDto,
  UpdateCompanyPostDto,
} from './dto/company-post.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

/**
 * Controller Quản lý hồ sơ doanh nghiệp (Employer/Company Profile Management)
 * Phân quyền dành riêng cho tài khoản Nhà tuyển dụng (NHATUYENDUNG).
 */
@Controller('employer/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('NHATUYENDUNG')
export class CompanyProfileController {
  constructor(
    private readonly companyProfileService: CompanyProfileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * [GET] /employer/profile
   * Lấy thông tin hồ sơ doanh nghiệp + HR + Chi nhánh + Điểm hoàn thiện
   */
  @Get()
  async getProfile(
    @CurrentUser('userId') userId: string,
  ): Promise<CompanyProfileResponse> {
    return this.companyProfileService.getCompanyProfile(userId);
  }

  /**
   * [PATCH] /employer/profile
   * Cập nhật từng phần (Partial Update) thông tin công ty và HR
   */
  @Patch()
  async updateProfilePatch(
    @CurrentUser('userId') userId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: UpdateCompanyProfileDto,
  ): Promise<UpdateCompanyProfileResponse> {
    return this.companyProfileService.updateCompanyProfile(userId, dto);
  }

  /**
   * [PUT] /employer/profile
   * Cập nhật đồng bộ thông tin hồ sơ doanh nghiệp
   */
  @Put()
  async updateProfilePut(
    @CurrentUser('userId') userId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: UpdateCompanyProfileDto,
  ): Promise<UpdateCompanyProfileResponse> {
    return this.companyProfileService.updateCompanyProfile(userId, dto);
  }

  /**
   * [POST] /employer/profile/upload-image
   * Upload ảnh Logo công ty hoặc ảnh cho từng Section lên Cloudinary
   */
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @UploadedFile() file: UploadedBinaryFile,
  ): Promise<{ url: string }> {
    const url = await this.cloudinaryService.uploadImage(
      file,
      'viecngon_company_media',
    );
    return { url };
  }

  /**
   * [POST] /employer/profile/posts
   * Tạo mới bài viết cho tab Bài viết trên trang công khai công ty
   */
  @Post('posts')
  async createPost(
    @CurrentUser('userId') userId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: CreateCompanyPostDto,
  ): Promise<CompanyProfilePostItem> {
    return this.companyProfileService.createCompanyPost(userId, dto);
  }

  /**
   * [PATCH] /employer/profile/posts/:postId
   * Cập nhật bài viết công ty
   */
  @Patch('posts/:postId')
  async updatePost(
    @CurrentUser('userId') userId: string,
    @Param('postId') postId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: UpdateCompanyPostDto,
  ): Promise<CompanyProfilePostItem> {
    return this.companyProfileService.updateCompanyPost(userId, postId, dto);
  }

  /**
   * [DELETE] /employer/profile/posts/:postId
   * Xóa bài viết công ty
   */
  @Delete('posts/:postId')
  async deletePost(
    @CurrentUser('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<{ message: string; deletedId: string }> {
    return this.companyProfileService.deleteCompanyPost(userId, postId);
  }
}
