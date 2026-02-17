import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CvData } from "@/types/cv";

const docxMocks = vi.hoisted(() => ({
  Document: vi.fn(),
  PackerToBlob: vi.fn(),
  Paragraph: vi.fn(),
  TextRun: vi.fn(),
}));

vi.mock("docx", () => ({
  Document: docxMocks.Document,
  Packer: { toBlob: docxMocks.PackerToBlob },
  Paragraph: docxMocks.Paragraph,
  TextRun: docxMocks.TextRun,
  HeadingLevel: { HEADING_2: "HEADING_2" },
  AlignmentType: { CENTER: "CENTER" },
  BorderStyle: { SINGLE: "SINGLE" },
}));

import { exportToDocx } from "@/lib/export-docx";

describe("exportToDocx", () => {
  beforeEach(() => {
    docxMocks.Document.mockReset();
    docxMocks.PackerToBlob.mockReset();
    docxMocks.Paragraph.mockReset();
    docxMocks.TextRun.mockReset();

    docxMocks.Document.mockImplementation((args) => ({ __type: "Document", args }));
    docxMocks.Paragraph.mockImplementation((args) => ({ __type: "Paragraph", args }));
    docxMocks.TextRun.mockImplementation((args) => ({ __type: "TextRun", args }));
    docxMocks.PackerToBlob.mockResolvedValue(new Blob(["docx"]));
  });

  it("creates and downloads a DOCX with translated English titles", async () => {
    vi.useFakeTimers();
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn(),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: vi.fn(),
    });

    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:fake-doc");
    const revokeObjectURLSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const data: CvData = {
      name: "Jane Doe",
      profession: "Finance Manager",
      sectionLanguage: "en",
      contactInfo: ["jane@example.com"],
      summary: "Senior profile",
      sections: [
        { key: "experience", title: "Experiencia", items: ["Finance Manager | ACME (2020 - Present)\nLed budgeting team"] },
        { key: "education", title: "Educación", items: ["MBA, IESE (2018)"] },
      ],
    };

    await exportToDocx(data, "jane-cv");
    vi.runAllTimers();

    expect(docxMocks.PackerToBlob).toHaveBeenCalledTimes(1);
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:fake-doc");
    expect(clickSpy).toHaveBeenCalled();

    const textRunArgs = docxMocks.TextRun.mock.calls.map((call) => call[0]?.text).filter(Boolean);
    expect(textRunArgs).toContain("Summary");
    expect(textRunArgs).toContain("Experience");
    expect(textRunArgs).toContain("Education");

    vi.useRealTimers();
  });
});
