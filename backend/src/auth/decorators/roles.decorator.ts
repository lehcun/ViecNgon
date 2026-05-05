import { SetMetadata } from '@nestjs/common';

// Định nghĩa key để lưu trữ metadata
export const ROLES_KEY = 'roles';

// Decorator này nhận vào một mảng các vai trò (VD: 'UNGVIEN', 'NHATUYENDUNG', 'ADMIN')
// và gán chúng vào metadata của hàm Controller.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
