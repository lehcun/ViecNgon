import type { CandidateProfileResponse } from "@viecngon/types";

export const MIN_PROFILE_COMPLETION_FOR_CV = 70;

export function calculateProfileCompletion(
  profile?: CandidateProfileResponse | null,
): number {
  if (!profile) return 0;

  const checks = [
    Boolean(profile.candidateName || profile.account?.userName),
    Boolean(profile.profession),
    Boolean(profile.account?.phoneNumber),
    Boolean(profile.dateOfBirth),
    Boolean(profile.address),
    Boolean(profile.aboutMe && profile.aboutMe.trim().length > 10),
    Boolean(profile.experiences && profile.experiences.length > 0),
    Boolean(profile.educations && profile.educations.length > 0),
    Boolean(profile.skills && profile.skills.length > 0),
    Boolean(profile.defaultCvFileId || profile.cvUrl),
  ];

  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

export function isProfileEligibleForCv(
  profile?: CandidateProfileResponse | null,
): boolean {
  return calculateProfileCompletion(profile) >= MIN_PROFILE_COMPLETION_FOR_CV;
}
