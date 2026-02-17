import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CvProvider, useCv } from "@/context/CvContext";

const toastMocks = vi.hoisted(() => ({
  warning: vi.fn(),
  error: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    warning: toastMocks.warning,
    error: toastMocks.error,
  },
}));

function TestConsumer() {
  const cv = useCv();
  return (
    <div>
      <button onClick={() => cv.setSectionLanguage("en")}>set-en</button>
      <button
        onClick={() =>
          cv.setRawText(
            [
              "Jane Doe",
              "jane@example.com",
              "Summary",
              "Senior profile",
              "Experience",
              "Finance Manager | ACME (2020 - Present)",
            ].join("\n"),
          )
        }
      >
        set-raw
      </button>
      <button onClick={cv.generate}>generate</button>
      <button onClick={cv.startSession}>start-session</button>
      <pre data-testid="cv-data">{JSON.stringify(cv.cvData)}</pre>
    </div>
  );
}

describe("CvContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    toastMocks.warning.mockReset();
    toastMocks.error.mockReset();
  });

  it("generates cvData with selected section language", () => {
    render(
      <CvProvider>
        <TestConsumer />
      </CvProvider>,
    );

    fireEvent.click(screen.getByText("set-en"));
    fireEvent.click(screen.getByText("set-raw"));
    fireEvent.click(screen.getByText("generate"));

    act(() => {
      vi.advanceTimersByTime(450);
    });

    const dataText = screen.getByTestId("cv-data").textContent ?? "null";
    const data = JSON.parse(dataText);
    expect(data.sectionLanguage).toBe("en");
    expect(data.name).toBe("Jane Doe");
  });

  it("expires session after 30 minutes and emits event", () => {
    const onExpired = vi.fn();
    window.addEventListener("cv-session-expired", onExpired);

    render(
      <CvProvider>
        <TestConsumer />
      </CvProvider>,
    );

    fireEvent.click(screen.getByText("start-session"));

    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000 + 10);
    });

    expect(onExpired).toHaveBeenCalledTimes(1);
    expect(toastMocks.warning).toHaveBeenCalledWith("Tu sesion vence en 5 minutos.");
    expect(toastMocks.warning).toHaveBeenCalledWith("Tu sesion vence en 1 minuto.");
    expect(toastMocks.error).toHaveBeenCalledWith("Tu sesion ha finalizado. Los datos locales se han borrado.");

    window.removeEventListener("cv-session-expired", onExpired);
  });
});
