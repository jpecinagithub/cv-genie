import { describe, expect, it } from "vitest";
import { parseText } from "@/lib/parser";

describe("parseText", () => {
  it("parses named sections and contact info", () => {
    const input = [
      "Jane Doe",
      "jane@example.com | +34 600 000 000",
      "Resumen",
      "Perfil senior en finanzas.",
      "Experiencia",
      "Finance Manager | ACME (2020 - Actualidad)",
      "Educación",
      "MBA, IESE (2018)",
    ].join("\n");

    const result = parseText(input);

    expect(result.name).toBe("Jane Doe");
    expect(result.sectionLanguage).toBe("es");
    expect(result.contactInfo).toContain("jane@example.com");
    expect(result.summary).toContain("Perfil senior");
    expect(result.sections.map((s) => s.title)).toEqual(["Experiencia", "Educación"]);
  });

  it("creates fallback sections when no headers are present", () => {
    const input = [
      "John Doe",
      "john@example.com",
      "Perfil orientado a resultados.",
      "Con experiencia internacional.",
      "- Lideré equipos globales",
      "Licenciatura en Economía 2015",
      "Excel, Power BI, SQL",
      "Disponibilidad para viajar",
    ].join("\n");

    const result = parseText(input);

    expect(result.summary).toContain("Perfil orientado");
    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.sections.some((s) => s.title === "Experiencia")).toBe(true);
  });
});

