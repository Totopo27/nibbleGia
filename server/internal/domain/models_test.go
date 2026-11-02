package domain_test

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"

	"nibble-server/internal/domain"
)

func TestCanonicalCapsuleFixtureDeserialization(t *testing.T) {
	fixturePath := filepath.Join("..", "..", "..", "fixtures", "canonical-capsule.json")
	data, err := os.ReadFile(fixturePath)
	if err != nil {
		t.Fatalf("Error leyendo el fixture canónico: %v", err)
	}

	var capsule domain.Capsule
	if err := json.Unmarshal(data, &capsule); err != nil {
		t.Fatalf("Error deserializando la cápsula: %v", err)
	}

	if err := capsule.Validate(); err != nil {
		t.Fatalf("La cápsula deserializada no es válida: %v", err)
	}

	if capsule.ID != "capsule-logic-01" {
		t.Errorf("ID esperado 'capsule-logic-01', obtenido '%s'", capsule.ID)
	}
	if len(capsule.Steps) != 3 {
		t.Fatalf("Se esperaban 3 pasos, obtenidos %d", len(capsule.Steps))
	}

	quizStep := capsule.Steps[2]
	if quizStep.Check == nil {
		t.Fatalf("El paso 3 debía contener un Check/Quiz de validación")
	}

	// Probar evaluación de respuesta
	attemptCorrect := quizStep.Check.Evaluate("opt-b")
	if !attemptCorrect.IsCorrect {
		t.Errorf("Se esperaba que opt-b fuera evaluada como correcta")
	}

	attemptIncorrect := quizStep.Check.Evaluate("opt-a")
	if attemptIncorrect.IsCorrect {
		t.Errorf("Se esperaba que opt-a fuera evaluada como incorrecta")
	}
}

func TestStreakCalculation(t *testing.T) {
	streak := domain.StreakState{}
	baseTime := time.Date(2026, 11, 1, 10, 0, 0, 0, time.UTC)

	// Día 1
	streak.RecordCompletion(baseTime)
	if streak.CurrentStreak != 1 || streak.MaxStreak != 1 {
		t.Errorf("Día 1: racha esperada 1, obtenida %d", streak.CurrentStreak)
	}

	// Mismo día (otra cápsula terminada el mismo día)
	streak.RecordCompletion(baseTime.Add(2 * time.Hour))
	if streak.CurrentStreak != 1 {
		t.Errorf("Mismo día: la racha no debió duplicarse, obtenida %d", streak.CurrentStreak)
	}

	// Día 2 consecutivo en diferente hora (ej. 23 horas después o en horario nocturno del día 2)
	day2 := time.Date(2026, 11, 2, 21, 30, 0, 0, time.UTC)
	streak.RecordCompletion(day2)
	if streak.CurrentStreak != 2 || streak.MaxStreak != 2 {
		t.Errorf("Día 2: racha esperada 2, obtenida %d", streak.CurrentStreak)
	}

	// Salto de 3 días (racha rota: día 5)
	day5 := time.Date(2026, 11, 5, 8, 0, 0, 0, time.UTC)
	streak.RecordCompletion(day5)
	if streak.CurrentStreak != 1 || streak.MaxStreak != 2 {
		t.Errorf("Racha rota: racha actual esperada 1, obtenida %d (max streak debió mantenerse en 2, obtenida %d)", streak.CurrentStreak, streak.MaxStreak)
	}
}
