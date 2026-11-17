import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RepostJobModal from "./RepostJobModal";

const pushMock = vi.fn();
const repostMutateMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/hooks/recruiter/useEmployerJobs", () => ({
  useRepostJob: () => ({
    mutate: repostMutateMock,
    isPending: false,
  }),
}));

describe("RepostJobModal", () => {
  beforeEach(() => {
    pushMock.mockReset();
    repostMutateMock.mockReset();
  });

  it("không render khi isOpen = false và submit gia hạn trực tiếp khi isOpen = true", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <RepostJobModal
        isOpen={false}
        jobId="job-1"
        jobTitle="Backend Dev"
        onClose={onClose}
      />,
    );
    expect(screen.queryByText(/Đăng lại tin/i)).not.toBeInTheDocument();

    rerender(
      <RepostJobModal
        isOpen={true}
        jobId="job-1"
        jobTitle="Backend Dev"
        onClose={onClose}
      />,
    );

    const dateInput = screen.getByLabelText(/Hạn nộp hồ sơ mới/i);
    fireEvent.change(dateInput, { target: { value: "2099-12-31" } });
    fireEvent.submit(dateInput.closest("form")!);

    expect(repostMutateMock).toHaveBeenCalledTimes(1);

    fireEvent.click(document.getElementById("repostOptionEdit")!);
    fireEvent.submit(dateInput.closest("form")!);
    expect(pushMock).toHaveBeenCalledWith("/employer-jobs/job-1/edit?repost=true");

    fireEvent.click(document.getElementById("repostOptionDirect")!);
    fireEvent.change(dateInput, { target: { value: "2020-01-01" } });
    fireEvent.blur(dateInput);
    fireEvent.submit(dateInput.closest("form")!);
    expect(
      screen.getByText(/Hạn nộp hồ sơ mới phải từ hôm nay trở đi/i),
    ).toBeInTheDocument();
  });
});
