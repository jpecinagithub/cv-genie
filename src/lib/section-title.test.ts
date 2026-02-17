import { describe, expect, it } from "vitest";
import { getSummaryTitle, translateSectionTitle } from "@/lib/section-title";

describe("section-title translations", () => {
  it("translates known section titles to English", () => {
    expect(translateSectionTitle("Experiencia", "en")).toBe("Experience");
    expect(translateSectionTitle("Habilidades", "en")).toBe("Skills");
    expect(translateSectionTitle("Idiomas", "en")).toBe("Languages");
  });

  it("returns original title when unknown", () => {
    expect(translateSectionTitle("Mi Seccion Custom", "en")).toBe("Mi Seccion Custom");
  });

  it("returns summary title by language", () => {
    expect(getSummaryTitle("es")).toBe("Resumen");
    expect(getSummaryTitle("en")).toBe("Summary");
  });
});

