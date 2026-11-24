import {
  computeJobRecommendationScore,
  normalizeVietnameseText,
} from './job-recommendation.util';

describe('job-recommendation.util', () => {
  it('chuẩn hóa văn bản tiếng Việt bỏ dấu đúng', () => {
    expect(normalizeVietnameseText('TP. Hồ Chí Minh - Lập trình viên')).toBe(
      'tp ho chi minh lap trinh vien',
    );
  });

  it('chấm điểm cao cho công việc trùng kỹ năng, chuyên môn, kinh nghiệm, thành phố và công ty theo dõi', () => {
    const score = computeJobRecommendationScore(
      {
        skillIds: new Set(['sk-react', 'sk-next', 'sk-ts']),
        savedJobSkillIds: new Set(['sk-react']),
        followedCompanyIds: new Set(['cty-momo']),
        profession: 'Senior Frontend Engineer',
        yearsOfExperience: 4,
        address: 'Quận 7, TP. Hồ Chí Minh',
      },
      {
        title: 'Senior Frontend Engineer (ReactJS / Next.js)',
        level: 'Senior',
        requiredYears: 3,
        city: 'Hồ Chí Minh',
        workModel: 'Hybrid',
        companyId: 'cty-momo',
        skillIds: ['sk-react', 'sk-next', 'sk-ts'],
      },
    );

    expect(score).toBe(100);
  });

  it('xếp công việc khớp kỹ năng cao hơn công việc không khớp kỹ năng', () => {
    const candidate = {
      skillIds: new Set(['sk-nestjs', 'sk-sql']),
      savedJobSkillIds: new Set<string>(),
      followedCompanyIds: new Set<string>(),
      profession: 'Backend Node.js',
      yearsOfExperience: 2,
      address: 'Hà Nội',
    };

    const matchingJobScore = computeJobRecommendationScore(candidate, {
      title: 'Backend Engineer (NestJS)',
      level: 'Middle',
      requiredYears: 2,
      city: 'Hà Nội',
      workModel: 'Tại văn phòng',
      companyId: 'cty-1',
      skillIds: ['sk-nestjs', 'sk-sql'],
    });

    const unrelatedJobScore = computeJobRecommendationScore(candidate, {
      title: 'iOS Swift Developer',
      level: 'Senior',
      requiredYears: 6,
      city: 'Đà Nẵng',
      workModel: 'Tại văn phòng',
      companyId: 'cty-2',
      skillIds: ['sk-swift'],
    });

    expect(matchingJobScore).toBeGreaterThan(unrelatedJobScore);
    expect(matchingJobScore).toBeGreaterThanOrEqual(80);
    expect(unrelatedJobScore).toBe(0);
  });

  it('cộng đủ 10 điểm địa điểm cho công việc Remote bất kể thành phố', () => {
    const score = computeJobRecommendationScore(
      {
        skillIds: new Set<string>(),
        savedJobSkillIds: new Set<string>(),
        followedCompanyIds: new Set<string>(),
        profession: null,
        yearsOfExperience: null,
        address: 'Đà Nẵng',
      },
      {
        title: 'Remote Cloud Engineer',
        level: 'Middle',
        requiredYears: 3,
        city: 'Hà Nội',
        workModel: 'Remote',
        companyId: 'cty-1',
        skillIds: ['sk-aws'],
      },
    );

    expect(score).toBe(10);
  });
});
