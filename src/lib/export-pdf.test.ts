import { beforeEach, describe, expect, it, vi } from "vitest";

const pdfMocks = vi.hoisted(() => ({
  addImage: vi.fn(),
  addPage: vi.fn(),
  save: vi.fn(),
  html2canvas: vi.fn(),
  jsPDF: vi.fn(),
}));

vi.mock("html2canvas", () => ({
  default: pdfMocks.html2canvas,
}));

vi.mock("jspdf", () => ({
  default: pdfMocks.jsPDF,
}));

import { exportToPdf } from "@/lib/export-pdf";

describe("exportToPdf", () => {
  beforeEach(() => {
    pdfMocks.addImage.mockReset();
    pdfMocks.addPage.mockReset();
    pdfMocks.save.mockReset();
    pdfMocks.html2canvas.mockReset();
    pdfMocks.jsPDF.mockReset();

    pdfMocks.jsPDF.mockImplementation(() => ({
      addImage: pdfMocks.addImage,
      addPage: pdfMocks.addPage,
      save: pdfMocks.save,
    }));
  });

  it("exports a single-page PDF for small content", async () => {
    pdfMocks.html2canvas.mockResolvedValue({
      width: 1000,
      height: 1000,
      toDataURL: () => "data:image/png;base64,fake",
    });

    const element = document.createElement("div");
    element.textContent = "CV";
    document.body.appendChild(element);

    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    await exportToPdf(element, "cv-test");

    expect(pdfMocks.html2canvas).toHaveBeenCalledTimes(1);
    expect(pdfMocks.addImage).toHaveBeenCalledTimes(1);
    expect(pdfMocks.addPage).not.toHaveBeenCalled();
    expect(pdfMocks.save).toHaveBeenCalledWith("cv-test.pdf");
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it("adds extra pages for tall content", async () => {
    pdfMocks.html2canvas.mockResolvedValue({
      width: 1000,
      height: 3000,
      toDataURL: () => "data:image/png;base64,fake",
    });

    const element = document.createElement("div");
    document.body.appendChild(element);

    await exportToPdf(element, "cv-multipage");

    expect(pdfMocks.addPage).toHaveBeenCalled();
    expect(pdfMocks.addImage.mock.calls.length).toBeGreaterThan(1);
    expect(pdfMocks.save).toHaveBeenCalledWith("cv-multipage.pdf");
  });
});

