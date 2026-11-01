import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StreakCelebrationModal } from "../src/features/streak/StreakCelebrationModal.tsx";

describe("StreakCelebrationModal Component", () => {
  it("debe mostrar los días de racha alcanzados y permitir cerrarse", () => {
    const handleClose = vi.fn();

    render(
      <StreakCelebrationModal
        currentStreak={5}
        totalDays={12}
        onClose={handleClose}
      />
    );

    expect(screen.getByText(/¡Racha de 5 días!/i)).toBeDefined();
    expect(screen.getByText(/¡Meta del día cumplida!/i)).toBeDefined();

    const ctaBtn = screen.getByRole("button", { name: /¡A por ello!/i });
    fireEvent.click(ctaBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
