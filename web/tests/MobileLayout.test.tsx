import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileLayout } from "../src/components/MobileLayout.tsx";

describe("MobileLayout Component", () => {
  it("debe renderizar la marca Nibble y el indicador de racha diaria", () => {
    render(
      <MobileLayout streakCount={3}>
        <div data-testid="test-content">Contenido de prueba</div>
      </MobileLayout>
    );

    expect(screen.getByText(/Nibble/i)).toBeDefined();
    expect(screen.getByText(/3 días/i)).toBeDefined();
    expect(screen.getByTestId("test-content").textContent).toBe("Contenido de prueba");
  });
});
