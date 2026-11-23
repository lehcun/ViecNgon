import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  AdminSkillActionResponse,
  AdminSkillItem,
  AdminSkillsListResponse,
  DeleteAdminSkillResponse,
} from '@viecngon/types';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateAdminSkillDto } from './dto/create-admin-skill.dto';
import type { MergeAdminSkillDto } from './dto/merge-admin-skill.dto';
import type { QueryAdminSkillsDto } from './dto/query-admin-skills.dto';
import type { UpdateAdminSkillDto } from './dto/update-admin-skill.dto';

const SKILL_SELECT = {
  maKyNang: true,
  tenKyNang: true,
  _count: {
    select: {
      congViecKyNangs: true,
      ungViens: true,
    },
  },
} satisfies Prisma.KyNangSelect;

interface SkillRow {
  maKyNang: string;
  tenKyNang: string;
  _count: {
    congViecKyNangs: number;
    ungViens: number;
  };
}

@Injectable()
export class AdminSkillsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeName(raw: string): string {
    return raw.trim().replace(/\s+/g, ' ').slice(0, 100);
  }

  private mapSkill(row: SkillRow): AdminSkillItem {
    const jobsCount = row._count.congViecKyNangs;
    const candidatesCount = row._count.ungViens;
    return {
      maKyNang: row.maKyNang,
      tenKyNang: row.tenKyNang,
      jobsCount,
      candidatesCount,
      totalUsage: jobsCount + candidatesCount,
    };
  }

  async findAll(query: QueryAdminSkillsDto): Promise<AdminSkillsListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 15));
    const keyword = query.q?.trim();
    const usage = query.usage ?? 'ALL';
    const sortBy = query.sortBy ?? 'tenKyNang';
    const sortOrder = query.sortOrder ?? 'asc';

    const where: Prisma.KyNangWhereInput = keyword
      ? { tenKyNang: { contains: keyword } }
      : {};

    const rows = await this.prisma.kyNang.findMany({
      where,
      select: SKILL_SELECT,
    });

    const mapped = rows.map((row) => this.mapSkill(row));

    const filtered = mapped.filter((item) => {
      if (usage === 'IN_USE') return item.totalUsage > 0;
      if (usage === 'UNUSED') return item.totalUsage === 0;
      return true;
    });

    const dir = sortOrder === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      if (sortBy === 'jobsCount') {
        return (a.jobsCount - b.jobsCount) * dir;
      }
      if (sortBy === 'candidatesCount') {
        return (a.candidatesCount - b.candidatesCount) * dir;
      }
      return a.tenKyNang.localeCompare(b.tenKyNang, 'vi') * dir;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
      },
      summary: {
        total,
        inUse: filtered.filter((i) => i.totalUsage > 0).length,
        unused: filtered.filter((i) => i.totalUsage === 0).length,
      },
    };
  }

  async create(dto: CreateAdminSkillDto): Promise<AdminSkillActionResponse> {
    const normalized = this.normalizeName(dto.tenKyNang);
    if (!normalized) {
      throw new BadRequestException('Vui lòng nhập tên kỹ năng hợp lệ.');
    }

    const existingList = await this.prisma.kyNang.findMany({
      select: { maKyNang: true, tenKyNang: true },
    });

    const duplicate = existingList.find(
      (item) => item.tenKyNang.toLowerCase() === normalized.toLowerCase(),
    );
    if (duplicate) {
      throw new ConflictException(
        `Kỹ năng "${duplicate.tenKyNang}" đã tồn tại trong từ điển.`,
      );
    }

    const created = await this.prisma.kyNang.create({
      data: { tenKyNang: normalized },
      select: SKILL_SELECT,
    });

    return {
      message: `Đã thêm kỹ năng "${created.tenKyNang}" vào từ điển.`,
      skill: this.mapSkill(created),
    };
  }

  async update(
    id: string,
    dto: UpdateAdminSkillDto,
  ): Promise<AdminSkillActionResponse> {
    const normalized = this.normalizeName(dto.tenKyNang);
    if (!normalized) {
      throw new BadRequestException('Vui lòng nhập tên kỹ năng hợp lệ.');
    }

    const target = await this.prisma.kyNang.findUnique({
      where: { maKyNang: id },
      select: { maKyNang: true, tenKyNang: true },
    });

    if (!target) {
      throw new NotFoundException('Không tìm thấy kỹ năng trong từ điển.');
    }

    const existingList = await this.prisma.kyNang.findMany({
      where: { maKyNang: { not: id } },
      select: { maKyNang: true, tenKyNang: true },
    });

    const duplicate = existingList.find(
      (item) => item.tenKyNang.toLowerCase() === normalized.toLowerCase(),
    );
    if (duplicate) {
      throw new ConflictException(
        `Tên kỹ năng "${duplicate.tenKyNang}" đã tồn tại. Nếu muốn chuẩn hóa trùng lặp, hãy dùng chức năng Gộp kỹ năng.`,
      );
    }

    const updated = await this.prisma.kyNang.update({
      where: { maKyNang: id },
      data: { tenKyNang: normalized },
      select: SKILL_SELECT,
    });

    return {
      message: `Đã đổi tên kỹ năng thành "${updated.tenKyNang}".`,
      skill: this.mapSkill(updated),
    };
  }

  async merge(
    sourceId: string,
    dto: MergeAdminSkillDto,
  ): Promise<AdminSkillActionResponse> {
    const targetId = dto.targetSkillId.trim();
    if (sourceId === targetId) {
      throw new BadRequestException('Không thể gộp kỹ năng vào chính nó.');
    }

    const mergedTarget = await this.prisma.$transaction(async (tx) => {
      const [source, target] = await Promise.all([
        tx.kyNang.findUnique({
          where: { maKyNang: sourceId },
          select: { maKyNang: true, tenKyNang: true },
        }),
        tx.kyNang.findUnique({
          where: { maKyNang: targetId },
          select: { maKyNang: true, tenKyNang: true },
        }),
      ]);

      if (!source) {
        throw new NotFoundException('Không tìm thấy kỹ năng nguồn cần gộp.');
      }
      if (!target) {
        throw new NotFoundException('Không tìm thấy kỹ năng đích.');
      }

      // 1. Chuyển UngVienKyNang không bị trùng khóa kép [maUngVien, maKyNang]
      const [sourceCandidateLinks, targetCandidateLinks] = await Promise.all([
        tx.ungVienKyNang.findMany({
          where: { maKyNang: sourceId },
          select: { maUngVien: true, mucDo: true },
        }),
        tx.ungVienKyNang.findMany({
          where: { maKyNang: targetId },
          select: { maUngVien: true },
        }),
      ]);

      const existingCandidateIds = new Set(
        targetCandidateLinks.map((item) => item.maUngVien),
      );
      const candidateLinksToCreate = sourceCandidateLinks
        .filter((item) => !existingCandidateIds.has(item.maUngVien))
        .map((item) => ({
          maUngVien: item.maUngVien,
          maKyNang: targetId,
          mucDo: item.mucDo,
        }));

      if (candidateLinksToCreate.length > 0) {
        await tx.ungVienKyNang.createMany({
          data: candidateLinksToCreate,
        });
      }

      // 2. Chuyển CongViecKyNang không bị trùng khóa kép [maCongViec, maKyNang]
      const [sourceJobLinks, targetJobLinks] = await Promise.all([
        tx.congViecKyNang.findMany({
          where: { maKyNang: sourceId },
          select: { maCongViec: true },
        }),
        tx.congViecKyNang.findMany({
          where: { maKyNang: targetId },
          select: { maCongViec: true },
        }),
      ]);

      const existingJobIds = new Set(
        targetJobLinks.map((item) => item.maCongViec),
      );
      const jobLinksToCreate = sourceJobLinks
        .filter((item) => !existingJobIds.has(item.maCongViec))
        .map((item) => ({
          maCongViec: item.maCongViec,
          maKyNang: targetId,
        }));

      if (jobLinksToCreate.length > 0) {
        await tx.congViecKyNang.createMany({
          data: jobLinksToCreate,
        });
      }

      // 3. Xóa kỹ năng nguồn (cascade dọn các bản ghi liên kết cũ)
      await tx.kyNang.delete({
        where: { maKyNang: sourceId },
      });

      const refreshedTarget = await tx.kyNang.findUnique({
        where: { maKyNang: targetId },
        select: SKILL_SELECT,
      });

      return {
        sourceName: source.tenKyNang,
        targetRow: refreshedTarget as SkillRow,
      };
    });

    return {
      message: `Đã gộp "${mergedTarget.sourceName}" vào "${mergedTarget.targetRow.tenKyNang}" thành công.`,
      skill: this.mapSkill(mergedTarget.targetRow),
    };
  }

  async remove(id: string): Promise<DeleteAdminSkillResponse> {
    const deletedName = await this.prisma.$transaction(async (tx) => {
      const target = await tx.kyNang.findUnique({
        where: { maKyNang: id },
        select: SKILL_SELECT,
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy kỹ năng trong từ điển.');
      }

      const jobsCount = target._count.congViecKyNangs;
      const candidatesCount = target._count.ungViens;

      if (jobsCount > 0 || candidatesCount > 0) {
        throw new BadRequestException(
          `Không thể xóa "${target.tenKyNang}" vì đang được gắn trên ${jobsCount} tin tuyển dụng và ${candidatesCount} hồ sơ ứng viên. Hãy dùng chức năng Gộp kỹ năng nếu muốn chuẩn hóa.`,
        );
      }

      await tx.kyNang.delete({ where: { maKyNang: id } });
      return target.tenKyNang;
    });

    return {
      message: `Đã xóa kỹ năng "${deletedName}" khỏi từ điển.`,
      deletedId: id,
    };
  }
}
