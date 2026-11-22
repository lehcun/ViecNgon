import type { CandidateProfileResponse } from "@viecngon/types";

export const MIN_PROFILE_COMPLETION_FOR_CV = 70;

export type ProfileSuggestionKey =
  | "personalInfo"
  | "aboutMe"
  | "education"
  | "experience"
  | "portfolio"
  | "skills"
  | "certificate";

export interface ProfileCompletionSuggestion {
  key: ProfileSuggestionKey;
  label: string;
  gainPercent: number;
  maxPercent: number;
}

function stripHtmlText(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateProfileCompletion(
  profile?: CandidateProfileResponse | null,
): number {
  if (!profile) return 0;

  const personalChecks = [
    Boolean(
      profile.candidateName?.trim() || profile.account?.userName?.trim(),
    ),
    Boolean(profile.profession?.trim()),
    Boolean(profile.account?.phoneNumber?.trim()),
    Boolean(profile.dateOfBirth),
    Boolean(profile.address?.trim()),
  ];
  const personalScore = personalChecks.filter(Boolean).length; // 0..5%

  const aboutMeScore = stripHtmlText(profile.aboutMe).length > 10 ? 10 : 0;
  const educationScore = (profile.educations?.length ?? 0) > 0 ? 15 : 0;
  const experienceScore = Math.min(3, profile.experiences?.length ?? 0) * 10;
  const portfolioScore = Math.min(2, profile.portfolios?.length ?? 0) * 10;
  const skillScore = Math.min(3, profile.skills?.length ?? 0) * 5;
  const certificateScore = (profile.certificates?.length ?? 0) > 0 ? 5 : 0;

  return Math.min(
    100,
    personalScore +
      aboutMeScore +
      educationScore +
      experienceScore +
      portfolioScore +
      skillScore +
      certificateScore,
  );
}

export function getProfileCompletionSuggestions(
  profile?: CandidateProfileResponse | null,
): ProfileCompletionSuggestion[] {
  if (!profile) return [];

  const suggestions: ProfileCompletionSuggestion[] = [];

  const expCount = profile.experiences?.length ?? 0;
  if (expCount < 3) {
    suggestions.push({
      key: "experience",
      label: expCount > 0 ? "Thêm kinh nghiệm làm việc" : "Kinh nghiệm làm việc",
      gainPercent: 10,
      maxPercent: 30,
    });
  }

  const eduCount = profile.educations?.length ?? 0;
  if (eduCount === 0) {
    suggestions.push({
      key: "education",
      label: "Học vấn",
      gainPercent: 15,
      maxPercent: 15,
    });
  }

  const portfolioCount = profile.portfolios?.length ?? 0;
  if (portfolioCount < 2) {
    suggestions.push({
      key: "portfolio",
      label: portfolioCount > 0 ? "Thêm dự án nổi bật" : "Dự án nổi bật",
      gainPercent: 10,
      maxPercent: 20,
    });
  }

  if (stripHtmlText(profile.aboutMe).length <= 10) {
    suggestions.push({
      key: "aboutMe",
      label: "Giới thiệu bản thân",
      gainPercent: 10,
      maxPercent: 10,
    });
  }

  const skillCount = profile.skills?.length ?? 0;
  if (skillCount < 3) {
    suggestions.push({
      key: "skills",
      label: skillCount > 0 ? "Thêm kỹ năng chuyên môn" : "Kỹ năng chuyên môn",
      gainPercent: (3 - skillCount) * 5,
      maxPercent: 15,
    });
  }

  const certCount = profile.certificates?.length ?? 0;
  if (certCount === 0) {
    suggestions.push({
      key: "certificate",
      label: "Chứng chỉ",
      gainPercent: 5,
      maxPercent: 5,
    });
  }

  const personalChecks = [
    Boolean(
      profile.candidateName?.trim() || profile.account?.userName?.trim(),
    ),
    Boolean(profile.profession?.trim()),
    Boolean(profile.account?.phoneNumber?.trim()),
    Boolean(profile.dateOfBirth),
    Boolean(profile.address?.trim()),
  ];
  const personalScore = personalChecks.filter(Boolean).length;
  if (personalScore < 5) {
    suggestions.push({
      key: "personalInfo",
      label: "Thông tin cá nhân",
      gainPercent: 5 - personalScore,
      maxPercent: 5,
    });
  }

  return suggestions.sort((a, b) => b.gainPercent - a.gainPercent);
}

export function isProfileEligibleForCv(
  profile?: CandidateProfileResponse | null,
): boolean {
  return calculateProfileCompletion(profile) >= MIN_PROFILE_COMPLETION_FOR_CV;
}
