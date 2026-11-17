import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper, createTestQueryClient } from "@/test/query-wrapper";
import { useApplyParsedCv } from "./candidate/useApplyParsedCv";
import { useManageCandidateItems } from "./candidate/useManageCandidateItems";
import { useUpdateCandidateProfile } from "./candidate/useUpdateCandidateProfile";
import { useUploadGeneratedCv } from "./candidate/useUploadGeneratedCv";
import { useApplyJob, useJobDetail } from "./job/useJobDetail";
import { useRemoveJob } from "./job/useRemoveJob";
import {
  useEmployerJobDetail,
  useUpdateEmployerJob,
} from "./recruiter/useEditJob";
import {
  useDeleteEmployerJob,
  useEmployerJobs,
  useRepostJob,
  useToggleJobVisibility,
} from "./recruiter/useEmployerJobs";
import { useScheduleInterview } from "./recruiter/useScheduleInterview";
import { useUpdateApplicationStatus } from "./recruiter/useUpdateApplicationStatus";
import { useNotifications } from "./useNotifications";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("react-hot-toast", () => {
  const toastApi = {
    success: vi.fn(),
    error: vi.fn(),
  };
  return {
    default: toastApi,
    toast: toastApi,
  };
});

describe("React Query mutation invalidation hooks", () => {
  beforeEach(() => {
    pushMock.mockReset();
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        return new Response(
          JSON.stringify({
            ok: true,
            data: [],
            unreadCount: 1,
            readCount: 0,
            allCount: 1,
            total: 1,
            totalPages: 1,
            count: 1,
          }),
          { status: 200 },
        );
      }),
    );
  });

  it("invalidateQueries được gọi đúng trong các candidate & job hooks", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createQueryWrapper(queryClient);

    const { result: parsedCv } = renderHook(() => useApplyParsedCv(), { wrapper });
    const { result: manageItems } = renderHook(() => useManageCandidateItems(), {
      wrapper,
    });
    const { result: updateProfile } = renderHook(
      () => useUpdateCandidateProfile(),
      { wrapper },
    );
    const { result: uploadCv } = renderHook(() => useUploadGeneratedCv(), {
      wrapper,
    });
    const { result: applyJob } = renderHook(() => useApplyJob("job-slug"), {
      wrapper,
    });
    const { result: removeJob } = renderHook(() => useRemoveJob(), { wrapper });

    await act(async () => {
      await parsedCv.current.mutateAsync({} as never);
      await manageItems.current.createExperience({} as never);
      await updateProfile.current.updateCandidateProfileAsync({} as never);
      await uploadCv.current.mutateAsync(new FormData());
      await applyJob.current.mutateAsync({} as never);
      await removeJob.current.mutateAsync("job-1");
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["candidateProfile"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["jobDetail", "job-slug"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["recruiterProfile"],
    });
  });

  it("invalidateQueries được gọi đúng trong các recruiter & notification hooks", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = createQueryWrapper(queryClient);

    const { result: updateJob } = renderHook(() => useUpdateEmployerJob("j-1"), {
      wrapper,
    });
    const { result: repostJob } = renderHook(() => useRepostJob(), { wrapper });
    const { result: toggleVis } = renderHook(() => useToggleJobVisibility(), {
      wrapper,
    });
    const { result: delJob } = renderHook(() => useDeleteEmployerJob(), {
      wrapper,
    });
    const { result: schedule } = renderHook(() => useScheduleInterview(), {
      wrapper,
    });
    const { result: appStatus } = renderHook(() => useUpdateApplicationStatus(), {
      wrapper,
    });
    const { result: notifs } = renderHook(() => useNotifications(), {
      wrapper,
    });

    await act(async () => {
      await updateJob.current.mutateAsync({} as never);
      await repostJob.current.mutateAsync({ jobId: "j-1", payload: {} as never });
      await toggleVis.current.mutateAsync("j-1");
      await delJob.current.mutateAsync("j-1");
      await schedule.current.mutateAsync({ maDon: "d-1" } as never);
      await appStatus.current.mutateAsync({ maDon: "d-1", status: "DUOC_NHAN" });
      await notifs.current.markAsRead("n-1");
      await notifs.current.markAllAsRead();
    });

    expect(pushMock).toHaveBeenCalledWith("/employer-jobs");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["employerJobDetail", "j-1"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["applicationDetail"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["candidate-notifications"],
    });
  });

  it("fetch dữ liệu query trong useEmployerJobs, useEmployerJobDetail và useJobDetail", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapper(queryClient);

    const { result: jobsRes } = renderHook(
      () => useEmployerJobs({ page: 1, limit: 10, search: "React", status: "DA_DUYET" }),
      { wrapper },
    );
    const { result: detailRes } = renderHook(
      () => useEmployerJobDetail("job-1"),
      { wrapper },
    );
    const { result: publicDetailRes } = renderHook(
      () => useJobDetail("senior-react"),
      { wrapper },
    );

    await waitFor(() => {
      expect(jobsRes.current.isSuccess).toBe(true);
      expect(detailRes.current.isSuccess).toBe(true);
      expect(publicDetailRes.current.job).toBeDefined();
    });
  });
});
