package storage_test

import (
	"sync"
	"testing"
	"time"

	"nibble-server/internal/storage"
)

func TestMemoryRepository_DeterministicCapsuleOrder(t *testing.T) {
	repo := storage.NewMemoryRepository()

	// Hacer múltiples lecturas seguidas para verificar que el orden siempre sea idéntico
	var firstOrder []string
	capsulesFirst, err := repo.GetCapsulesByTopic("topic-logic")
	if err != nil {
		t.Fatalf("Error obteniendo cápsulas: %v", err)
	}
	for _, c := range capsulesFirst {
		firstOrder = append(firstOrder, c.ID)
	}

	for i := 0; i < 20; i++ {
		capsules, err := repo.GetCapsulesByTopic("topic-logic")
		if err != nil {
			t.Fatalf("Iteración %d falló: %v", i, err)
		}
		if len(capsules) != len(firstOrder) {
			t.Fatalf("Longitud esperada %d, obtenida %d", len(firstOrder), len(capsules))
		}
		for idx, c := range capsules {
			if c.ID != firstOrder[idx] {
				t.Fatalf("Orden no determinista detectado en iteración %d: posición %d era %s, ahora es %s",
					i, idx, firstOrder[idx], c.ID)
			}
		}
	}
}

func TestMemoryRepository_ConcurrentAccess(t *testing.T) {
	repo := storage.NewMemoryRepository()
	const numGoroutines = 50
	var wg sync.WaitGroup

	wg.Add(numGoroutines * 2)

	// Goroutines concurrentes leyendo tópicos, cápsulas y racha
	for i := 0; i < numGoroutines; i++ {
		go func() {
			defer wg.Done()
			_, _ = repo.GetTopics()
			_, _ = repo.GetCapsulesByTopic("topic-logic")
			_, _ = repo.GetCapsuleByID("capsule-logic-01")
			_, _ = repo.GetCheck("capsule-logic-01", "chk-01")
			_, _ = repo.GetStreak()
		}()
	}

	// Goroutines concurrentes completando cápsulas (escritura)
	baseTime := time.Date(2026, 11, 1, 10, 0, 0, 0, time.UTC)
	for i := 0; i < numGoroutines; i++ {
		stepDay := i
		go func() {
			defer wg.Done()
			_, _ = repo.CompleteCapsule("capsule-logic-01", baseTime.Add(time.Duration(stepDay)*24*time.Hour))
		}()
	}

	wg.Wait()

	finalStreak, err := repo.GetStreak()
	if err != nil {
		t.Fatalf("Error consultando racha final: %v", err)
	}
	if finalStreak == nil || finalStreak.CurrentStreak <= 0 {
		t.Errorf("Estado de racha inconsistente tras accesos concurrentes: %+v", finalStreak)
	}
}
