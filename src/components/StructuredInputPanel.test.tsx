import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StructuredInputPanel } from "@/components/StructuredInputPanel";

const mockSetCvDataDirectly = vi.fn();
const mockSetProfileName = vi.fn();
const mockReset = vi.fn();

const mockCtx = {
  reset: mockReset,
  hasGenerated: false,
  profileName: "Jane Doe",
  setProfileName: mockSetProfileName,
  setCvDataDirectly: mockSetCvDataDirectly,
  sectionLanguage: "en" as const,
};

vi.mock("@/context/CvContext", () => ({
  useCv: () => mockCtx,
}));

describe("StructuredInputPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    mockSetCvDataDirectly.mockReset();
    mockSetProfileName.mockReset();
    mockReset.mockReset();
  });

  it("converts comma-separated skills into one-per-line input", () => {
    render(<StructuredInputPanel />);

    const skills = screen.getByPlaceholderText(
      "Escribe skills separadas por coma: React, TypeScript, Node.js...",
    ) as HTMLTextAreaElement;

    fireEvent.change(skills, { target: { value: "React, TypeScript" } });
    expect(skills.value).toBe("React\nTypeScript");
  });

  it("generates cvData using sectionLanguage and experience format", () => {
    render(<StructuredInputPanel />);

    fireEvent.change(screen.getByPlaceholderText("Cargo"), { target: { value: "Finance Manager" } });
    fireEvent.change(screen.getByPlaceholderText("Empresa"), { target: { value: "ACME" } });
    fireEvent.change(screen.getByPlaceholderText("Periodo (ej: 2020 - Presente)"), {
      target: { value: "2020 - Present" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Generar 5 CVs" }));

    expect(mockSetCvDataDirectly).toHaveBeenCalledTimes(1);
    const payload = mockSetCvDataDirectly.mock.calls[0][0];
    expect(payload.sectionLanguage).toBe("en");
    expect(payload.sections[0].title).toBe("Experiencia");
    expect(payload.sections[0].items[0]).toContain("Finance Manager | ACME (2020 - Present)");
  });
});
