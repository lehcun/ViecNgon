import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditJobPage from "./page";

const useEmployerJobDetailMock = vi.fn();
const updateJobMutateMock = vi.fn();
const useEmployerProfileMock = vi.fn();
const useAllSkillMock = vi.fn();
const toastErrorMock = vi.fn();
let repostParam: string | null = null;

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "repost" ? repostParam : null),
  }),
}));

vi.mock("@/hooks/recruiter/useEditJob", () => ({
  useEmployerJobDetail: (...args: unknown[]) => useEmployerJobDetailMock(...args),
  useUpdateEmployerJob: () => ({
    mutate: updateJobMutateMock,
    isPending: false,
  }),
}));

vi.mock("@/hooks/recruiter/useEmployerProfile", () => ({
  useEmployerProfile: () => useEmployerProfileMock(),
}));

vi.mock("@/hooks/useGetAllSkill", () => ({
  useAllSkill: () => useAllSkillMock(),
}));

vi.mock("@/components/common/RichTextEditor", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) => (
    <textarea
      aria-label="RichTextEditor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("@/components/common/JobTemplateSelector", () => ({
  default: ({
    label,
    onApply,
  }: {
    label: string;
    onApply: (val: string) => void;
  }) => (
    <button type="button" onClick={() => onApply(`<p>${label} mẫu</p>`)}>
      Mẫu {label}
    </button>
  ),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: (...args: unknown[]) => toastErrorMock(...args),
    success: vi.fn(),
  },
}));

function createResolvedParams(id: string): Promise<{ id: string }> {
  return Object.assign(Promise.resolve({ id }), {
    status: "fulfilled",
    value: { id },
  });
}

const sampleJob = {
  maCongViec: "job-123",
  tenCongViec: "Senior Backend Engineer",
  capBac: "Senior",
  loaiHinh: "Fulltime",
  hinhThucLamViec: "Hybrid",
  maChiNhanh: "cn-1",
  thanhPho: "",
  yeuCauKinhNghiem: 3,
  ngayHetHan: "2026-12-31T00:00:00.000Z",
  mucLuongToiThieu: 25000000,
  mucLuongToiDa: 40000000,
  moTa: "<p>Mô tả cũ</p>",
  yeuCauCongViec: "<p>Yêu cầu cũ</p>",
  phucLoi: "<p>Phúc lợi cũ</p>",
  kyNangs: ["sk-1"],
  trangThai: "DA_DUYET",
};

describe("EditJobPage", () => {
  beforeEach(() => {
    repostParam = null;
    updateJobMutateMock.mockReset();
    toastErrorMock.mockReset();
    useEmployerProfileMock.mockReturnValue({
      data: {
        branches: [
          {
            maChiNhanh: "cn-1",
            diaChi: "Số 1 Duy Tân",
            thanhPho: "Hà Nội",
            laTruSoChinh: true,
          },
        ],
      },
      isLoading: false,
    });
    useAllSkillMock.mockReturnValue({
      allSkill: [
        { id: "sk-1", name: "NestJS" },
        { id: "sk-2", name: "TypeScript" },
      ],
    });
  });

  it("hiển thị skeleton khi đang tải và thông báo lỗi khi fetch thất bại", async () => {
    useEmployerJobDetailMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { container, rerender } = render(
      <Suspense fallback={<div>loading</div>}>
        <EditJobPage params={createResolvedParams("job-123")} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    useEmployerJobDetailMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Không tìm thấy tin"),
    });

    rerender(
      <Suspense fallback={<div>loading</div>}>
        <EditJobPage params={createResolvedParams("job-123")} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Không thể tải thông tin tin tuyển dụng"),
      ).toBeInTheDocument();
    });
  });

  it("khởi tạo EditJobFormContent, tương tác form, chọn chi nhánh/Remote và submit", async () => {
    useEmployerJobDetailMock.mockReturnValue({
      data: sampleJob,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <Suspense fallback={<div>loading</div>}>
        <EditJobPage params={createResolvedParams("job-123")} />
      </Suspense>,
    );

    const titleInput = await screen.findByLabelText(/Tiêu đề công việc/i);
    expect(titleInput).toHaveValue("Senior Backend Engineer");

    fireEvent.change(screen.getByLabelText(/Chi nhánh làm việc/i), {
      target: { name: "maChiNhanh", value: "cn-1" },
    });
    expect(
      screen.getByLabelText(/Thành phố \/ Địa điểm làm việc/i),
    ).toHaveValue("Hà Nội");

    fireEvent.click(screen.getByText("TypeScript"));
    fireEvent.click(screen.getByText("Mẫu Mô tả công việc"));
    fireEvent.click(screen.getByText("Mẫu Yêu cầu công việc"));
    fireEvent.click(screen.getByText("Mẫu Quyền lợi & Đãi ngộ"));

    fireEvent.change(screen.getByLabelText(/Hình thức làm việc/i), {
      target: { name: "hinhThucLamViec", value: "Remote" },
    });
    expect(screen.getByLabelText(/Chi nhánh làm việc/i)).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/Mức lương thỏa thuận/i));
    fireEvent.submit(titleInput.closest("form")!);

    expect(updateJobMutateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        tenCongViec: "Senior Backend Engineer",
        maChiNhanh: null,
        kyNangs: ["sk-1", "sk-2"],
        mucLuongToiThieu: null,
        mucLuongToiDa: null,
      }),
    );
  });

  it("báo lỗi toast khi bỏ trống tiêu đề hoặc bỏ hết kỹ năng, và hỗ trợ chế độ repost", async () => {
    repostParam = "true";
    useEmployerJobDetailMock.mockReturnValue({
      data: sampleJob,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <Suspense fallback={<div>loading</div>}>
        <EditJobPage params={createResolvedParams("job-123")} />
      </Suspense>,
    );

    expect(
      await screen.findByText("Đăng lại tin tuyển dụng"),
    ).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Tiêu đề công việc/i);
    fireEvent.change(titleInput, {
      target: { name: "tenCongViec", value: "   " },
    });
    fireEvent.submit(titleInput.closest("form")!);
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Vui lòng nhập tiêu đề công việc!",
    );

    fireEvent.change(titleInput, {
      target: { name: "tenCongViec", value: "Valid Job Title" },
    });
    fireEvent.click(screen.getByText("NestJS"));
    fireEvent.submit(titleInput.closest("form")!);
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Vui lòng chọn ít nhất 1 kỹ năng chuyên môn!",
    );
  });
});
