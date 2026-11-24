export interface CandidateRecommendationSignals {
  skillIds: Set<string>;
  savedJobSkillIds: Set<string>;
  followedCompanyIds: Set<string>;
  profession: string | null;
  yearsOfExperience: number | null;
  address: string | null;
}

export interface JobRecommendationSignals {
  title: string;
  level: string | null;
  requiredYears: number | null;
  city: string | null;
  workModel: string | null;
  companyId: string;
  skillIds: string[];
}

const STOP_WORDS = new Set([
  'va',
  'la',
  'cho',
  'tai',
  'cua',
  'voi',
  'nhieu',
  'chua',
  'cap',
  'nhat',
  'it',
  'dev',
  'developer',
  'engineer',
  'ky',
  'su',
  'lap',
  'trinh',
  'vien',
]);

export function normalizeVietnameseText(
  input: string | null | undefined,
): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeMeaningfulWords(input: string | null | undefined): string[] {
  const normalized = normalizeVietnameseText(input);
  if (!normalized) return [];
  return normalized
    .split(' ')
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

function normalizeCityName(raw: string | null | undefined): string {
  const norm = normalizeVietnameseText(raw);
  if (!norm) return '';
  if (
    norm.includes('ho chi minh') ||
    norm.includes('hcm') ||
    norm.includes('sai gon')
  ) {
    return 'ho chi minh';
  }
  if (norm.includes('ha noi') || norm === 'hn') {
    return 'ha noi';
  }
  if (norm.includes('da nang') || norm === 'dn') {
    return 'da nang';
  }
  return norm;
}

/**
 * Tính điểm tương thích (0..100) giữa hồ sơ Ứng viên và 1 Tin tuyển dụng theo trọng số:
 * - 50 điểm: Khớp kỹ năng (UngVienKyNang ∩ CongViecKyNang)
 * - 20 điểm: Khớp chuyên môn / chức danh
 * - 15 điểm: Khớp số năm kinh nghiệm
 * - 10 điểm: Khớp thành phố hoặc Remote / Hybrid
 * -  5 điểm: Công ty đang theo dõi / kỹ năng trùng tin đã lưu
 */
export function computeJobRecommendationScore(
  candidate: CandidateRecommendationSignals,
  job: JobRecommendationSignals,
): number {
  let score = 0;

  // 1. Khớp kỹ năng (tối đa 50 điểm)
  if (candidate.skillIds.size > 0 && job.skillIds.length > 0) {
    const matchedSkills = job.skillIds.filter((id) =>
      candidate.skillIds.has(id),
    ).length;
    const denominator = Math.min(job.skillIds.length, 5);
    const ratio = Math.min(1, matchedSkills / Math.max(1, denominator));
    score += ratio * 50;
  }

  // 2. Khớp chuyên môn / chức danh (tối đa 20 điểm)
  const professionTokens = tokenizeMeaningfulWords(candidate.profession);
  if (professionTokens.length > 0) {
    const jobText = normalizeVietnameseText(`${job.title} ${job.level ?? ''}`);
    const matchedTokens = professionTokens.filter((token) =>
      jobText.includes(token),
    ).length;
    const ratio = matchedTokens / professionTokens.length;
    score += ratio * 20;
  }

  // 3. Khớp số năm kinh nghiệm (tối đa 15 điểm)
  if (
    candidate.yearsOfExperience !== null &&
    candidate.yearsOfExperience !== undefined &&
    job.requiredYears !== null &&
    job.requiredYears !== undefined
  ) {
    const diff = Math.abs(candidate.yearsOfExperience - job.requiredYears);
    if (diff <= 1) {
      score += 15;
    } else if (diff <= 2) {
      score += 10;
    } else if (diff <= 3) {
      score += 5;
    }
  } else if (job.requiredYears === null || job.requiredYears === 0) {
    score += 7.5;
  }

  // 4. Khớp địa điểm hoặc Remote/Hybrid (tối đa 10 điểm)
  const normWorkModel = normalizeVietnameseText(job.workModel);
  const candidateCity = normalizeCityName(candidate.address);
  const jobCity = normalizeCityName(job.city);

  if (normWorkModel.includes('remote') || normWorkModel.includes('tu xa')) {
    score += 10;
  } else if (candidateCity && jobCity && candidateCity === jobCity) {
    score += 10;
  } else if (
    normWorkModel.includes('hybrid') ||
    normWorkModel.includes('linh hoat')
  ) {
    score += 5;
  }

  // 5. Tín hiệu quan tâm cá nhân (tối đa 5 điểm)
  let affinity = 0;
  if (candidate.followedCompanyIds.has(job.companyId)) {
    affinity += 3;
  }
  if (
    candidate.savedJobSkillIds.size > 0 &&
    job.skillIds.some((id) => candidate.savedJobSkillIds.has(id))
  ) {
    affinity += 2;
  }
  score += Math.min(5, affinity);

  return Math.round(Math.min(100, score));
}
