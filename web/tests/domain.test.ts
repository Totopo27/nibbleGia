import { describe, it, expect } from "vitest";
import canonicalFixture from "../../fixtures/canonical-capsule.json";
import type { Capsule, CheckAttempt } from "../src/types/domain.ts";

describe("Domain Contracts & Canonical Fixture", () => {
  it("debe validar la estructura completa del fixture canónico contra los tipos de Capsule", () => {
    const capsule: Capsule = canonicalFixture;

    expect(capsule.id).toBe("capsule-logic-01");
    expect(capsule.topicId).toBe("topic-logic");
    expect(capsule.steps).toHaveLength(3);

    const quizStep = capsule.steps[2];
    expect(quizStep.check).toBeDefined();
    expect(quizStep.check?.options).toHaveLength(3);
    expect(quizStep.check?.correctOptionId).toBe("opt-b");
  });

  it("debe evaluar correctamente un intento de respuesta", () => {
    const capsule: Capsule = canonicalFixture;
    const check = capsule.steps[2].check!;

    const attemptCorrect: CheckAttempt = {
      checkId: check.id,
      selectedOptionId: "opt-b",
      isCorrect: check.correctOptionId === "opt-b",
      explanationShown: check.explanation,
    };

    expect(attemptCorrect.isCorrect).toBe(true);

    const attemptIncorrect: CheckAttempt = {
      checkId: check.id,
      selectedOptionId: "opt-a",
      isCorrect: check.correctOptionId === "opt-a",
      explanationShown: check.explanation,
    };

    expect(attemptIncorrect.isCorrect).toBe(false);
  });
});
