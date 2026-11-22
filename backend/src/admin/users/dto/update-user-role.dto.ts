import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsIn(['UNGVIEN', 'NHATUYENDUNG', 'ADMIN'], {
    message: 'Vai trò phải là UNGVIEN, NHATUYENDUNG hoặc ADMIN',
  })
  vaiTro: 'UNGVIEN' | 'NHATUYENDUNG' | 'ADMIN';
}
