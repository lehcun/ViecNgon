import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiCvUploadModal from "./AiCvUploadModal";

const parseCvMock = vi.fn();
const applyParsedCvMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("@/hooks/candidate/useParseCv", () => ({
  useParseCv: () => ({ mutateAsync: parseCvMock }),
}));

vi.mock("@/hooks/candidate/useApplyParsedCv", () => ({
  useApplyParsedCv: () => ({
    mutateAsync: applyParsedCvMock,
    isPending: false,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: (...args: unknown[]) => toastErrorMock(...args),
    success: vi.fn(),
  },
}));

describe("AiCvUploadModal", () => {
  beforeEach(() => {
    parseCvMock.mockReset();
    applyParsedCvMock.mockReset();
    toastErrorMock.mockReset();
  });

  it("không render khi đóng và kiểm tra định dạng/kích thước file khi mở", () => {
    const onClose = vi.fn();
    const { rerender, container } = render(
      <AiCvUploadModal isOpen={false} onClose={onClose} />,
    );
    expect(container.firstChild).toBeNull();

    rerender(<AiCvUploadModal isOpen={true} onClose={onClose} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    const badTypeFile = new File(["hello"], "cv.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    fireEvent.change(fileInput, { target: { files: [badTypeFile] } });
    expect(toastErrorMock).toHaveBeenCalledWith("Chỉ hỗ trợ file định dạng PDF.");

    const bigPdf = new File([new Uint8Array(6 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [bigPdf] } });
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Kích thước file PDF tối đa là 5MB.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
