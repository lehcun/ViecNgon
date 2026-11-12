import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { CreateCertificateDto, UpdateCertificateDto } from './dto/certificate.dto';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';
import { CreateCvFileDto } from './dto/cv-file.dto';
import { ApplyParsedCvDto } from './dto/apply-parsed-cv.dto';
import { CandidateProfileResponse } from '@viecngon/types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { formatSalaryDisplay } from 'src/common/utils/format-salary';
import { sanitizeRichText } from 'src/common/utils/sanitize-html.util';

interface MockMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class CandidateService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  /**
   * Helper tìm kiếm Ứng viên theo mã tài khoản đăng nhập
   * Ngăn chặn hoàn toàn lỗi IDOR bằng cách xác thực sở hữu qua token userId
   */
  async getCandidateByUserId(userId: string) {
    const candidate = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: userId },
    });

    if (!candidate) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng viên tương ứng với tài khoản này.');
    }

    return candidate;
  }

  // =========================================================================
  // 1. READ: LẤY FULL HỒ SƠ ỨNG VIÊN
  // =========================================================================
  async getProfile(maTaiKhoan: string): Promise<CandidateProfileResponse> {
    const profile = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: maTaiKhoan },
      include: {
        taiKhoan: { select: { email: true, sdt: true, tenNguoiDung: true } },
        kyNangs: { include: { kyNang: true } },
        kinhNghiems: { orderBy: { ngayBatDau: 'desc' } },
        hocVans: { orderBy: { ngayBatDau: 'desc' } },
        chungChis: { orderBy: { ngayCap: 'desc' } },
        ngoaiNgus: true,
        danhSachFileCv: { orderBy: { ngayTaiLen: 'desc' } },
        portfolios: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        'Không tìm thấy hồ sơ ứng viên cho tài khoản này.',
      );
    }

    const formatMonthYear = (date: Date | null | undefined): string => {
      if (!date) return '';
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const defaultFileDb = profile.maFileCvMacDinh
      ? profile.danhSachFileCv.find(
        (f) => f.maFileCv === profile.maFileCvMacDinh,
      )
      : null;

    const defaultCvFile = defaultFileDb
      ? {
        id: defaultFileDb.maFileCv,
        fileName: defaultFileDb.tenFile,
        fileUrl: defaultFileDb.fileUrl,
        uploadedAt: defaultFileDb.ngayTaiLen,
      }
      : null;

    return {
      candidateId: profile.maUngVien,
      accountId: profile.maTaiKhoan,
      candidateName: profile.tenUngVien,
      dateOfBirth: profile.ngaySinh,
      gender: profile.gioiTinh,
      yearsOfExperience: profile.soNamKinhNghiem,
      avatarUrl: profile.avatarUrl,
      profession: profile.chuyenMon,
      cvUrl: profile.cvUrl,
      address: profile.diaChi,

      aboutMe: profile.gioiThieuBanThan,
      defaultCvType: profile.loaiCvMacDinh,
      defaultCvFileId: profile.maFileCvMacDinh,
      defaultCvFile: defaultCvFile,

      account: {
        email: profile.taiKhoan.email,
        userName: profile.taiKhoan.tenNguoiDung,
        phoneNumber: profile.taiKhoan.sdt,
      },

      skills: profile.kyNangs.map((k) => ({
        skillId: k.maKyNang,
        skillName: k.kyNang.tenKyNang,
        level: k.mucDo,
      })),

      experiences: profile.kinhNghiems.map((kn) => ({
        id: kn.maKinhNghiem,
        companyName: kn.tenCongTy,
        position: kn.viTri,
        startDate: formatMonthYear(kn.ngayBatDau),
        endDate: formatMonthYear(kn.ngayKetThuc),
        description: kn.moTaChiTiet,
      })),

      educations: profile.hocVans.map((hv) => ({
        id: hv.maHocVan,
        schoolName: hv.tenTruong,
        major: hv.nganhHoc,
        startDate: formatMonthYear(hv.ngayBatDau),
        endDate: formatMonthYear(hv.ngayTotNghiep),
        gpa: hv.gpa,
      })),

      certificates: profile.chungChis.map((cc) => ({
        id: cc.maChungChi,
        name: cc.tenChungChi,
        organization: cc.toChucCap,
        issueDate: formatMonthYear(cc.ngayCap),
        expirationDate: formatMonthYear(cc.ngayHetHan),
      })),

      languages: profile.ngoaiNgus.map((nn) => ({
        id: nn.maNgoaiNgu,
        name: nn.tenNgoaiNgu,
        proficiency: nn.trinhDo,
      })),

      uploadedCvs: profile.danhSachFileCv.map((file) => ({
        id: file.maFileCv,
        fileName: file.tenFile,
        fileUrl: file.fileUrl,
        uploadedAt: file.ngayTaiLen,
      })),

      portfolios: (profile.portfolios || []).map((p) => ({
        id: p.maPortfolio,
        title: p.tieuDe,
        description: p.moTa,
        projectUrl: p.projectUrl,
      })),
    };
  }

  // =========================================================================
  // 2. UPDATE PROFILE: CẬP NHẬT THÔNG TIN CÁ NHÂN (TRANSACTION + SANITIZE)
  // =========================================================================
  async updateProfile(userId: string, data: UpdateCandidateDto) {
    const cleanAboutMe = data.aboutMe !== undefined ? sanitizeRichText(data.aboutMe) : undefined;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật bảng TaiKhoan nếu có thay đổi
      if (data.userName || data.phoneNumber) {
        await tx.taiKhoan.update({
          where: { maTaiKhoan: userId },
          data: {
            tenNguoiDung: data.userName,
            sdt: data.phoneNumber,
          },
        });
      }

      // 2. Cập nhật bảng UngVien
      const updatedProfile = await tx.ungVien.update({
        where: { maTaiKhoan: userId },
        data: {
          tenUngVien: data.userName || undefined,
          ngaySinh: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          gioiTinh: data.gender,
          soNamKinhNghiem: data.yearsOfExperience,
          avatarUrl: data.avatarUrl,
          chuyenMon: data.profession,
          cvUrl: data.cvUrl,
          diaChi: data.address,
          gioiThieuBanThan: cleanAboutMe,
          loaiCvMacDinh: data.defaultCvType,
          maFileCvMacDinh: data.defaultCvFileId,
          trangThaiPortfolio: data.trangThaiPortfolio,
        },
      });

      return {
        message: 'Cập nhật hồ sơ thành công',
        candidateId: updatedProfile.maUngVien,
      };
    });
  }

  // =========================================================================
  // 3. CRUD SUB-ENTITIES: KINH NGHIỆM LÀM VIỆC (EXPERIENCES)
  // =========================================================================
  async createExperience(userId: string, dto: CreateExperienceDto) {
    const candidate = await this.getCandidateByUserId(userId);
    const cleanDescription = dto.description ? sanitizeRichText(dto.description) : null;

    const experience = await this.prisma.kinhNghiem.create({
      data: {
        tenCongTy: dto.companyName,
        viTri: dto.position,
        ngayBatDau: new Date(dto.startDate),
        ngayKetThuc: dto.endDate ? new Date(dto.endDate) : null,
        moTaChiTiet: cleanDescription,
        maUngVien: candidate.maUngVien,
      },
    });

    return {
      message: 'Thêm kinh nghiệm làm việc thành công',
      data: experience,
    };
  }

  async updateExperience(userId: string, id: string, dto: UpdateExperienceDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.kinhNghiem.findFirst({
      where: { maKinhNghiem: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy mục kinh nghiệm làm việc này hoặc bạn không có quyền chỉnh sửa.');
    }

    const cleanDescription = dto.description !== undefined ? sanitizeRichText(dto.description) : undefined;

    const updated = await this.prisma.kinhNghiem.update({
      where: { maKinhNghiem: id },
      data: {
        tenCongTy: dto.companyName,
        viTri: dto.position,
        ngayBatDau: dto.startDate ? new Date(dto.startDate) : undefined,
        ngayKetThuc: dto.endDate !== undefined ? (dto.endDate ? new Date(dto.endDate) : null) : undefined,
        moTaChiTiet: cleanDescription,
      },
    });

    return {
      message: 'Cập nhật kinh nghiệm làm việc thành công',
      data: updated,
    };
  }

  async deleteExperience(userId: string, id: string) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.kinhNghiem.findFirst({
      where: { maKinhNghiem: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy mục kinh nghiệm làm việc này hoặc bạn không có quyền xóa.');
    }

    await this.prisma.kinhNghiem.delete({
      where: { maKinhNghiem: id },
    });

    return { message: 'Xóa kinh nghiệm làm việc thành công' };
  }

  // =========================================================================
  // 4. CRUD SUB-ENTITIES: HỌC VẤN (EDUCATIONS)
  // =========================================================================
  async createEducation(userId: string, dto: CreateEducationDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const education = await this.prisma.hocVan.create({
      data: {
        tenTruong: dto.schoolName,
        nganhHoc: dto.major,
        ngayBatDau: new Date(dto.startDate),
        ngayTotNghiep: dto.endDate ? new Date(dto.endDate) : null,
        gpa: dto.gpa || null,
        maUngVien: candidate.maUngVien,
      },
    });

    return {
      message: 'Thêm học vấn thành công',
      data: education,
    };
  }

  async updateEducation(userId: string, id: string, dto: UpdateEducationDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.hocVan.findFirst({
      where: { maHocVan: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy thông tin học vấn này hoặc bạn không có quyền chỉnh sửa.');
    }

    const updated = await this.prisma.hocVan.update({
      where: { maHocVan: id },
      data: {
        tenTruong: dto.schoolName,
        nganhHoc: dto.major,
        ngayBatDau: dto.startDate ? new Date(dto.startDate) : undefined,
        ngayTotNghiep: dto.endDate !== undefined ? (dto.endDate ? new Date(dto.endDate) : null) : undefined,
        gpa: dto.gpa,
      },
    });

    return {
      message: 'Cập nhật học vấn thành công',
      data: updated,
    };
  }

  async deleteEducation(userId: string, id: string) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.hocVan.findFirst({
      where: { maHocVan: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy thông tin học vấn này hoặc bạn không có quyền xóa.');
    }

    await this.prisma.hocVan.delete({
      where: { maHocVan: id },
    });

    return { message: 'Xóa học vấn thành công' };
  }

  // =========================================================================
  // 5. CRUD SUB-ENTITIES: CHỨNG CHỈ (CERTIFICATES)
  // =========================================================================
  async createCertificate(userId: string, dto: CreateCertificateDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const certificate = await this.prisma.chungChi.create({
      data: {
        tenChungChi: dto.name,
        toChucCap: dto.organization,
        ngayCap: new Date(dto.issueDate),
        ngayHetHan: dto.expirationDate ? new Date(dto.expirationDate) : null,
        maUngVien: candidate.maUngVien,
      },
    });

    return {
      message: 'Thêm chứng chỉ thành công',
      data: certificate,
    };
  }

  async updateCertificate(userId: string, id: string, dto: UpdateCertificateDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.chungChi.findFirst({
      where: { maChungChi: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy chứng chỉ này hoặc bạn không có quyền chỉnh sửa.');
    }

    const updated = await this.prisma.chungChi.update({
      where: { maChungChi: id },
      data: {
        tenChungChi: dto.name,
        toChucCap: dto.organization,
        ngayCap: dto.issueDate ? new Date(dto.issueDate) : undefined,
        ngayHetHan: dto.expirationDate !== undefined ? (dto.expirationDate ? new Date(dto.expirationDate) : null) : undefined,
      },
    });

    return {
      message: 'Cập nhật chứng chỉ thành công',
      data: updated,
    };
  }

  async deleteCertificate(userId: string, id: string) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.chungChi.findFirst({
      where: { maChungChi: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy chứng chỉ này hoặc bạn không có quyền xóa.');
    }

    await this.prisma.chungChi.delete({
      where: { maChungChi: id },
    });

    return { message: 'Xóa chứng chỉ thành công' };
  }

  // =========================================================================
  // 6. CRUD SUB-ENTITIES: DỰ ÁN NỔI BẬT (PORTFOLIOS)
  // =========================================================================
  async createPortfolio(userId: string, dto: CreatePortfolioDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const portfolio = await this.prisma.portfolio.create({
      data: {
        tieuDe: dto.title,
        moTa: dto.description || null,
        projectUrl: dto.projectUrl || null,
        maUngVien: candidate.maUngVien,
      },
    });

    return {
      message: 'Thêm dự án nổi bật thành công',
      data: portfolio,
    };
  }

  async updatePortfolio(userId: string, id: string, dto: UpdatePortfolioDto) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.portfolio.findFirst({
      where: { maPortfolio: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy dự án này hoặc bạn không có quyền chỉnh sửa.');
    }

    const updated = await this.prisma.portfolio.update({
      where: { maPortfolio: id },
      data: {
        tieuDe: dto.title,
        moTa: dto.description,
        projectUrl: dto.projectUrl,
      },
    });

    return {
      message: 'Cập nhật dự án thành công',
      data: updated,
    };
  }

  async deletePortfolio(userId: string, id: string) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.portfolio.findFirst({
      where: { maPortfolio: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy dự án này hoặc bạn không có quyền xóa.');
    }

    await this.prisma.portfolio.delete({
      where: { maPortfolio: id },
    });

    return { message: 'Xóa dự án thành công' };
  }

  // =========================================================================
  // 7. CRUD SUB-ENTITIES: FILE CV (CV FILES)
  // =========================================================================
  async createCvFile(userId: string, dto: CreateCvFileDto) {
    const candidate = await this.getCandidateByUserId(userId);

    return await this.prisma.$transaction(async (tx) => {
      const newFileCv = await tx.fileCv.create({
        data: {
          tenFile: dto.fileName,
          fileUrl: dto.fileUrl,
          maUngVien: candidate.maUngVien,
        },
      });

      if (dto.isDefault) {
        await tx.ungVien.update({
          where: { maUngVien: candidate.maUngVien },
          data: {
            maFileCvMacDinh: newFileCv.maFileCv,
            loaiCvMacDinh: 'PDF',
          },
        });
      }

      return {
        message: 'Thêm file CV thành công',
        data: newFileCv,
      };
    });
  }

  async deleteCvFile(userId: string, id: string) {
    const candidate = await this.getCandidateByUserId(userId);

    const existing = await this.prisma.fileCv.findFirst({
      where: { maFileCv: id, maUngVien: candidate.maUngVien },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy file CV này hoặc bạn không có quyền xóa.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Nếu file này đang là file mặc định, reset về null
      if (candidate.maFileCvMacDinh === id) {
        await tx.ungVien.update({
          where: { maUngVien: candidate.maUngVien },
          data: {
            maFileCvMacDinh: null,
            loaiCvMacDinh: 'ONLINE',
          },
        });
      }

      await tx.fileCv.delete({
        where: { maFileCv: id },
      });

      return { message: 'Xóa file CV thành công' };
    });
  }

  // =========================================================================
  // 8. TẠO & UPLOAD CV TỪ MẪU WEB (PDF RENDERER)
  // =========================================================================
  async uploadGeneratedCv(maTaiKhoan: string, file: MockMulterFile) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file CV.');
    }

    try {
      const fileUrl = await this.cloudinaryService.uploadCvPdf(file);
      const ungVien = await this.getCandidateByUserId(maTaiKhoan);

      return await this.prisma.$transaction(async (tx) => {
        const newFileCv = await tx.fileCv.create({
          data: {
            tenFile: file.originalname || 'CV_ViecNgon.pdf',
            fileUrl: fileUrl,
            maUngVien: ungVien.maUngVien,
          },
        });

        await tx.ungVien.update({
          where: { maUngVien: ungVien.maUngVien },
          data: {
            loaiCvMacDinh: 'ONLINE',
            maFileCvMacDinh: newFileCv.maFileCv,
          },
        });

        return {
          message: 'Lưu CV mặc định thành công',
          fileId: newFileCv.maFileCv,
          fileUrl: newFileCv.fileUrl,
        };
      });
    } catch (error) {
      console.error('Lỗi khi lưu CV tạo từ web:', error);
      throw new InternalServerErrorException(
        'Không thể lưu CV vào hệ thống. Vui lòng thử lại.',
      );
    }
  }

  // =========================================================================
  // 8.5 ÁP DỤNG DỮ LIỆU CV ĐÃ BÓC TÁCH BẰNG AI VÀO HỒ SƠ (TRANSACTION)
  // =========================================================================
  private parseSafeDate(
    dateStr?: string | null,
    fallback?: Date,
  ): Date | null {
    if (!dateStr || typeof dateStr !== 'string') {
      return fallback ?? null;
    }

    const trimmed = dateStr.trim();
    if (!trimmed) return fallback ?? null;

    let normalized = trimmed;
    // MM/YYYY -> YYYY-MM-01
    const mmYyyyMatch = /^(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (mmYyyyMatch) {
      const month = mmYyyyMatch[1].padStart(2, '0');
      normalized = `${mmYyyyMatch[2]}-${month}-01`;
    } else if (/^\d{4}-\d{1,2}$/.test(trimmed)) {
      // YYYY-MM -> YYYY-MM-01
      const [y, m] = trimmed.split('-');
      normalized = `${y}-${m.padStart(2, '0')}-01`;
    } else if (/^\d{4}$/.test(trimmed)) {
      // YYYY -> YYYY-01-01
      normalized = `${trimmed}-01-01`;
    }

    const parsed = new Date(normalized);
    if (isNaN(parsed.getTime())) {
      return fallback ?? null;
    }

    const year = parsed.getFullYear();
    if (year < 1950 || year > 2100) {
      return fallback ?? null;
    }

    return parsed;
  }

  private truncateText(
    value: string | null | undefined,
    maxLength: number,
  ): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
  }

  async applyParsedCvData(userId: string, dto: ApplyParsedCvDto) {
    const candidate = await this.getCandidateByUserId(userId);
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật thông tin cơ bản trên TAIKHOAN (SĐT, Tên hiển thị)
      const phone = this.truncateText(dto.phoneNumber, 20);
      const fullName = this.truncateText(dto.fullName, 100);

      if (phone || fullName) {
        await tx.taiKhoan.update({
          where: { maTaiKhoan: userId },
          data: {
            ...(phone ? { sdt: phone } : {}),
            ...(fullName ? { tenNguoiDung: fullName } : {}),
          },
        });
      }

      // 2. Cập nhật bảng UNGVIEN
      const parsedDob = this.parseSafeDate(dto.dateOfBirth);
      const gender = this.truncateText(dto.gender, 10);
      const profession = this.truncateText(dto.profession, 150);
      const address = this.truncateText(dto.address, 255);
      const aboutMe = dto.aboutMe ? sanitizeRichText(dto.aboutMe) : undefined;

      await tx.ungVien.update({
        where: { maUngVien: candidate.maUngVien },
        data: {
          ...(fullName ? { tenUngVien: fullName } : {}),
          ...(parsedDob ? { ngaySinh: parsedDob } : {}),
          ...(gender ? { gioiTinh: gender } : {}),
          ...(dto.yearsOfExperience !== null &&
          dto.yearsOfExperience !== undefined
            ? { soNamKinhNghiem: dto.yearsOfExperience }
            : {}),
          ...(profession ? { chuyenMon: profession } : {}),
          ...(address ? { diaChi: address } : {}),
          ...(aboutMe !== undefined ? { gioiThieuBanThan: aboutMe } : {}),
        },
      });

      // 3. Nếu người dùng chọn ghi đè, xóa các mục chi tiết cũ trước khi đồng bộ
      if (dto.replaceExisting) {
        await Promise.all([
          tx.kinhNghiem.deleteMany({
            where: { maUngVien: candidate.maUngVien },
          }),
          tx.hocVan.deleteMany({
            where: { maUngVien: candidate.maUngVien },
          }),
          tx.chungChi.deleteMany({
            where: { maUngVien: candidate.maUngVien },
          }),
          tx.ungVienKyNang.deleteMany({
            where: { maUngVien: candidate.maUngVien },
          }),
        ]);
      }

      // 4. Tạo hàng loạt KINH_NGHIEM
      const validExperiences = (dto.experiences ?? [])
        .filter((exp) => exp.companyName?.trim() && exp.position?.trim())
        .map((exp) => ({
          maUngVien: candidate.maUngVien,
          tenCongTy: this.truncateText(exp.companyName, 150) ?? 'Không rõ',
          viTri: this.truncateText(exp.position, 100) ?? 'Nhân viên',
          ngayBatDau: this.parseSafeDate(exp.startDate, now) ?? now,
          ngayKetThuc: this.parseSafeDate(exp.endDate),
          moTaChiTiet: exp.description
            ? sanitizeRichText(exp.description)
            : null,
        }));

      if (validExperiences.length > 0) {
        await tx.kinhNghiem.createMany({ data: validExperiences });
      }

      // 5. Tạo hàng loạt HOC_VAN
      const validEducations = (dto.educations ?? [])
        .filter((edu) => edu.schoolName?.trim() && edu.major?.trim())
        .map((edu) => ({
          maUngVien: candidate.maUngVien,
          tenTruong: this.truncateText(edu.schoolName, 150) ?? 'Không rõ',
          nganhHoc: this.truncateText(edu.major, 100) ?? 'Chuyên ngành',
          ngayBatDau: this.parseSafeDate(edu.startDate, now) ?? now,
          ngayTotNghiep: this.parseSafeDate(edu.endDate),
          gpa: this.truncateText(edu.gpa, 10),
        }));

      if (validEducations.length > 0) {
        await tx.hocVan.createMany({ data: validEducations });
      }

      // 6. Tạo hàng loạt CHUNG_CHI
      const validCertificates = (dto.certificates ?? [])
        .filter((cert) => cert.name?.trim() && cert.organization?.trim())
        .map((cert) => ({
          maUngVien: candidate.maUngVien,
          tenChungChi: this.truncateText(cert.name, 150) ?? 'Chứng chỉ',
          toChucCap: this.truncateText(cert.organization, 150) ?? 'Tổ chức cấp',
          ngayCap: this.parseSafeDate(cert.issueDate, now) ?? now,
          ngayHetHan: this.parseSafeDate(cert.expirationDate),
        }));

      if (validCertificates.length > 0) {
        await tx.chungChi.createMany({ data: validCertificates });
      }

      // 7. Đồng bộ KYNANG & UNGVIEN_KYNANG (loại bỏ trùng lặp)
      const uniqueSkillsMap = new Map<
        string,
        { name: string; level: string | null }
      >();
      for (const item of dto.skills ?? []) {
        const cleanName = this.truncateText(item.skillName, 100);
        if (!cleanName) continue;
        const key = cleanName.toLowerCase();
        if (!uniqueSkillsMap.has(key)) {
          uniqueSkillsMap.set(key, {
            name: cleanName,
            level: this.truncateText(item.level, 50),
          });
        }
      }

      if (uniqueSkillsMap.size > 0) {
        const allSkills = await tx.kyNang.findMany();
        const skillLookup = new Map<string, string>(
          allSkills.map((s) => [s.tenKyNang.trim().toLowerCase(), s.maKyNang]),
        );

        for (const [key, skillItem] of uniqueSkillsMap.entries()) {
          let maKyNang = skillLookup.get(key);
          if (!maKyNang) {
            const createdSkill = await tx.kyNang.create({
              data: { tenKyNang: skillItem.name },
            });
            maKyNang = createdSkill.maKyNang;
            skillLookup.set(key, maKyNang);
          }

          await tx.ungVienKyNang.upsert({
            where: {
              maUngVien_maKyNang: {
                maUngVien: candidate.maUngVien,
                maKyNang,
              },
            },
            update: {
              ...(skillItem.level ? { mucDo: skillItem.level } : {}),
            },
            create: {
              maUngVien: candidate.maUngVien,
              maKyNang,
              mucDo: skillItem.level,
            },
          });
        }
      }

      // 8. Lưu bản ghi FILE_CV & gán maFileCvMacDinh nếu có fileUrl
      const safeFileUrl = this.truncateText(dto.fileUrl, 255);
      const safeFileName = this.truncateText(dto.fileName, 255);
      if (safeFileUrl && safeFileName) {
        const createdFileCv = await tx.fileCv.create({
          data: {
            tenFile: safeFileName,
            fileUrl: safeFileUrl,
            maUngVien: candidate.maUngVien,
          },
        });

        if (dto.setAsDefaultCv !== false) {
          await tx.ungVien.update({
            where: { maUngVien: candidate.maUngVien },
            data: {
              maFileCvMacDinh: createdFileCv.maFileCv,
              loaiCvMacDinh: 'PDF',
              cvUrl: safeFileUrl,
            },
          });
        }
      }
    });

    return {
      message: 'Áp dụng dữ liệu CV vào hồ sơ thành công!',
      profile: await this.getProfile(userId),
    };
  }

  // =========================================================================
  // 9. DANH SÁCH VIỆC LÀM ĐÃ ỨNG TUYỂN
  // =========================================================================
  async getAppliedJobs(userId: string) {
    const candidate = await this.getCandidateByUserId(userId);

    const applications = await this.prisma.donXinViec.findMany({
      where: { maUngVien: candidate.maUngVien },
      orderBy: { ngayNop: 'desc' },
      include: {
        congViec: {
          include: {
            nhaTuyenDung: {
              include: {
                congTy: {
                  select: {
                    tenCongTy: true,
                    logoUrl: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return applications.map((app) => {
      const job = app.congViec;
      const company = job.nhaTuyenDung?.congTy;

      return {
        applicationId: app.maDon,
        appliedDate: app.ngayNop,
        applicationStatus: app.trangThai,
        cvUrl: app.fileCvUrl,
        job: {
          id: job.maCongViec,
          title: job.tenCongViec,
          slug: job.slug,
          location: job.thanhPho,
          workModel: job.hinhThucLamViec,
          salaryDisplay: formatSalaryDisplay(
            job.mucLuongToiThieu,
            job.mucLuongToiDa,
          ),
          status: job.trangThai,
          deadline: job.ngayHetHan,
          company: company
            ? {
              name: company.tenCongTy,
              logo: company.logoUrl,
              slug: company.slug,
            }
            : null,
        },
      };
    });
  }
}
