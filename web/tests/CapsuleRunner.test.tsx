import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CapsuleRunner } from "../src/features/capsule/CapsuleRunner.tsx";
import canonicalFixture from "../../fixtures/canonical-capsule.json";
import type { Capsule, CheckAttempt } from "../src/types/domain.ts";

describe("CapsuleRunner Component (Tracer Bullet Flow)", () => {
  const mockCapsule: Capsule = canonicalFixture;

  it("debe permitir navegar los pasos secuencialmente y bloquear el avance hasta responder el quiz", async () => {
    const handleClose = vi.fn();
    const handleComplete = vi.fn();

    const mockEvaluateCheck = vi.fn(
      async (_checkId: string, selectedOptionId: string): Promise<CheckAttempt> => {
        return {
          checkId: "chk-01",
          selectedOptionId,
          isCorrect: selectedOptionId === "opt-b",
          explanationShown: "Explicación correcta de prueba",
        };
      }
    );

    render(
      <CapsuleRunner
        capsule={mockCapsule}
        onClose={handleClose}
        onComplete={handleComplete}
        evaluateCheckFn={mockEvaluateCheck}
      />
    );

    // Paso 1
    expect(screen.getByText(/Paso 1 de 3/i)).toBeDefined();
    expect(screen.getByText(/Falacia del Hombre de Paja/i)).toBeDefined();

    // Avanzar a Paso 2
    const nextBtn = screen.getByRole("button", { name: /Continuar/i });
    fireEvent.click(nextBtn);

    // Paso 2
    expect(screen.getByText(/Paso 2 de 3/i)).toBeDefined();
    expect(screen.getByText(/¿Por qué es tan común\?/i)).toBeDefined();

    // Avanzar a Paso 3 (contiene Quiz)
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Paso 3 de 3/i)).toBeDefined();
    expect(screen.getByText(/Desafío de Comprobación/i)).toBeDefined();

    // En paso 3 con quiz, el botón de avance debe estar bloqueado inicialmente
    const advanceBtn = screen.getByRole("button", {
      name: /Elige una opción para continuar/i,
    });
    expect(advanceBtn).toBeDefined();

    // Responder el Quiz seleccionando la opción correcta 'opt-b'
    const correctOptionBtn = screen.getByText(/Hombre de Paja/i);
    fireEvent.click(correctOptionBtn);

    await waitFor(() => {
      expect(mockEvaluateCheck).toHaveBeenCalledWith("chk-01", "opt-b");
    });

    // Debe mostrar la explicación
    await waitFor(() => {
      expect(screen.getByText(/Explicación correcta de prueba/i)).toBeDefined();
    });

    // Ahora el botón debe permitir finalizar la lección
    const finishBtn = screen.getByRole("button", { name: /Finalizar lección/i });
    fireEvent.click(finishBtn);

    // Pantalla de felicitación y resumen
    expect(screen.getByText(/¡Cápsula completada!/i)).toBeDefined();
    expect(screen.getByText(/100%/i)).toBeDefined(); // 1 de 1 acertada
    expect(handleComplete).toHaveBeenCalledWith(100);
  });
});
