import { IsString, MinLength } from 'class-validator';

export class MergeAdminSkillDto {
  @IsString({ message: 'Mã kỹ năng đích không hợp lệ' })
  @MinLength(1, { message: 'Vui lòng chọn kỹ năng đích để gộp' })
  targetSkillId: string;
}
