import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsIn(['OWNER', 'RECRUITER'], {
    message: 'Chức vụ trong công ty chỉ có thể là OWNER hoặc RECRUITER (HR).',
  })
  vaiTroTrongCongTy: 'OWNER' | 'RECRUITER';
}
