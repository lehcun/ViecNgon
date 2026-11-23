import { IsIn } from 'class-validator';

export class UpdatePackageStatusDto {
  @IsIn(['HOATDONG', 'DA_AN'], {
    message: 'Trạng thái gói phải là HOATDONG hoặc DA_AN',
  })
  trangThai: 'HOATDONG' | 'DA_AN';
}
