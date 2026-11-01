package storage

import (
	"errors"
	"sync"

	"nibble-server/internal/domain"
)

// Repository define el contrato de acceso a datos para temas y cápsulas.
type Repository interface {
	GetTopics() ([]domain.Topic, error)
	GetCapsuleByID(id string) (*domain.Capsule, error)
}

// MemoryRepository es una implementación en memoria y segura para concurrencia.
type MemoryRepository struct {
	mu       sync.RWMutex
	topics   []domain.Topic
	capsules map[string]domain.Capsule
}

// NewMemoryRepository crea una nueva instancia con un catálogo inicial curado.
func NewMemoryRepository() *MemoryRepository {
	img1 := "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"

	initialTopics := []domain.Topic{
		{
			ID:          "topic-logic",
			Title:       "Lógica y Pensamiento Crítico",
			Description: "Reconoce sesgos, desmonta falacias y razona con claridad en tu día a día.",
			Category:    "Filosofía y Mente",
			Icon:        "Brain",
		},
		{
			ID:          "topic-history",
			Title:       "Historia Universal en Cápsulas",
			Description: "Los momentos y figuras que cambiaron el rumbo de la civilización.",
			Category:    "Humanidades",
			Icon:        "Hourglass",
		},
		{
			ID:          "topic-science",
			Title:       "Maravillas del Cosmos",
			Description: "Desde la física cuántica hasta el horizonte de sucesos en 5 minutos.",
			Category:    "Ciencia y Naturaleza",
			Icon:        "Compass",
		},
	}

	initialCapsules := map[string]domain.Capsule{
		"capsule-logic-01": {
			ID:               "capsule-logic-01",
			TopicID:          "topic-logic",
			Title:            "La Falacia del Hombre de Paja",
			Order:            1,
			EstimatedMinutes: 4,
			Steps: []domain.Step{
				{
					ID:        "step-01",
					Order:     1,
					Narrative: "En cualquier debate o conversación, distorsionar la postura de tu interlocutor para que parezca ridícula y fácil de refutar se conoce como la Falacia del Hombre de Paja.",
					ImageURL:  &img1,
				},
				{
					ID:        "step-02",
					Order:     2,
					Narrative: "¿Por qué es tan común? Porque construir un muñeco de paja indefenso requiere mucho menos rigor que responder al argumento real más sofisticado.",
				},
				{
					ID:        "step-03",
					Order:     3,
					Narrative: "Pongamos a prueba tu intuición con un caso práctico cotidiano:",
					Check: &domain.Check{
						ID:       "chk-01",
						Question: "Ana propone: 'Deberíamos destinar más presupuesto escolar a bibliotecas'. Carlos responde: '¿O sea que quieres dejar a los niños sin material deportivo y educación física?'. ¿Qué falacia comete Carlos?",
						Options: []domain.CheckOption{
							{ID: "opt-a", Text: "Ad Hominem (atacar a la persona)"},
							{ID: "opt-b", Text: "Hombre de Paja (tergiversar la propuesta original)"},
							{ID: "opt-c", Text: "Falsa Causa (correlación no es causalidad)"},
						},
						CorrectOptionID: "opt-b",
						Explanation:     "Carlos exagera y distorsiona lo que dijo Ana, fingiendo que ella propuso eliminar el deporte, cuando solo habló de bibliotecas.",
					},
				},
			},
		},
	}

	return &MemoryRepository{
		topics:   initialTopics,
		capsules: initialCapsules,
	}
}

// GetTopics devuelve la lista de temas activos.
func (r *MemoryRepository) GetTopics() ([]domain.Topic, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]domain.Topic, len(r.topics))
	copy(result, r.topics)
	return result, nil
}

// GetCapsuleByID busca una cápsula por su identificador único.
func (r *MemoryRepository) GetCapsuleByID(id string) (*domain.Capsule, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	capsule, found := r.capsules[id]
	if !found {
		return nil, errors.New("cápsula no encontrada")
	}
	return &capsule, nil
}
