/**
 * =====================================================================
 * ADMIN SKILLS DICTIONARY SHARED TYPES
 * ---------------------------------------------------------------------
 * ⚠️ QUY TẮC MONOREPO:
 * CHỈ CHỨA `type` và `interface` — tuyệt đối KHÔNG export enum, const hay hàm.
 * =====================================================================
 */

export type AdminSkillUsageFilter = 'ALL' | 'IN_USE' | 'UNUSED';

export type AdminSkillSortBy = 'tenKyNang' | 'jobsCount' | 'candidatesCount';

export interface AdminSkillQueryParams {
  q?: string;
  usage?: AdminSkillUsageFilter;
  page?: number;
  limit?: number;
  sortBy?: AdminSkillSortBy;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminSkillItem {
  maKyNang: string;
  tenKyNang: string;
  jobsCount: number;
  candidatesCount: number;
  totalUsage: number;
}

export interface AdminSkillsListResponse {
  items: AdminSkillItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    inUse: number;
    unused: number;
  };
}

export interface CreateAdminSkillPayload {
  tenKyNang: string;
}

export interface UpdateAdminSkillPayload {
  tenKyNang: string;
}

export interface MergeAdminSkillPayload {
  targetSkillId: string;
}

export interface AdminSkillActionResponse {
  message: string;
  skill: AdminSkillItem;
}

export interface DeleteAdminSkillResponse {
  message: string;
  deletedId: string;
}
