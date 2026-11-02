package storage

import (
	"errors"
	"sync"
	"time"

	"nibble-server/internal/domain"
)

// Repository define el contrato de acceso a datos para temas, cápsulas y racha.
type Repository interface {
	GetTopics() ([]domain.Topic, error)
	GetCapsulesByTopic(topicID string) ([]domain.Capsule, error)
	GetCapsuleByID(id string) (*domain.Capsule, error)
	GetCheck(capsuleID, checkID string) (*domain.Check, error)
	GetStreak() (*domain.StreakState, error)
	CompleteCapsule(capsuleID string, completedAt time.Time) (*domain.StreakState, error)
}

// MemoryRepository es una implementación en memoria y segura para concurrencia.
type MemoryRepository struct {
	mu             sync.RWMutex
	topics         []domain.Topic
	capsules       map[string]domain.Capsule
	streak         domain.StreakState
	completedItems map[string]time.Time
}

// NewMemoryRepository crea una nueva instancia con un catálogo inicial curado y racha inicial.
func NewMemoryRepository() *MemoryRepository {
	imgStrawMan := "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
	imgSurvivorship := "https://images.unsplash.com/photo-1519074069444-1ba4e66a7b74?auto=format&fit=crop&w=800&q=80"
	imgPyramids := "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80"
	imgMonaLisa := "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
	imgCosmos := "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"

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
			Title:       "Historia Universal",
			Description: "Los momentos, civilizaciones y enigmas que cambiaron el rumbo del mundo.",
			Category:    "Humanidades",
			Icon:        "Hourglass",
		},
		{
			ID:          "topic-art",
			Title:       "Historia del Arte",
			Description: "Comprende el misterio de las obras maestras y aprende a leer una pintura.",
			Category:    "Cultura y Estética",
			Icon:        "Palette",
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
					ImageURL:  &imgStrawMan,
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
		"capsule-logic-02": {
			ID:               "capsule-logic-02",
			TopicID:          "topic-logic",
			Title:            "El Sesgo de Supervivencia",
			Order:            2,
			EstimatedMinutes: 4,
			Steps: []domain.Step{
				{
					ID:        "step-01",
					Order:     1,
					Narrative: "Durante la Segunda Guerra Mundial, el ejército examinó los bombarderos que volvían con impactos de bala en las alas y cola para blindar esas zonas.",
					ImageURL:  &imgSurvivorship,
				},
				{
					ID:        "step-02",
					Order:     2,
					Narrative: "El matemático Abraham Wald notó un error crítico: estaban estudiando solo a los supervivientes. Los aviones disparados en los motores nunca volvían a la base.",
				},
				{
					ID:        "step-03",
					Order:     3,
					Narrative: "¿Dónde radica el peligro del sesgo de supervivencia en la vida diaria?",
					Check: &domain.Check{
						ID:       "chk-02",
						Question: "Si alguien dice: 'Bill Gates y Steve Jobs abandonaron la universidad y se hicieron millonarios, por lo tanto estudiar no sirve', ¿por qué comete sesgo de supervivencia?",
						Options: []domain.CheckOption{
							{ID: "opt-a", Text: "Porque solo mira los pocos casos exitosos e ignora a los miles que fracasaron al abandonar los estudios"},
							{ID: "opt-b", Text: "Porque la tecnología no existía en el pasado"},
							{ID: "opt-c", Text: "Porque Bill Gates no es un personaje histórico relevante"},
						},
						CorrectOptionID: "opt-a",
						Explanation:     "El sesgo de supervivencia nos ciega al hacernos mirar solo a los ganadores visibles, ignorando el cementerio masivo de los que intentaron lo mismo y no sobrevivieron.",
					},
				},
			},
		},
		"capsule-history-01": {
			ID:               "capsule-history-01",
			TopicID:          "topic-history",
			Title:            "¿Por qué se construyeron las pirámides?",
			Order:            1,
			EstimatedMinutes: 4,
			Steps: []domain.Step{
				{
					ID:        "step-01",
					Order:     1,
					Narrative: "Para los antiguos egipcios, la muerte no era un final, sino el inicio de un viaje eterno. Una pirámide no era solo una tumba: era una máquina de ascensión para el alma del faraón.",
					ImageURL:  &imgPyramids,
				},
				{
					ID:        "step-02",
					Order:     2,
					Narrative: "Su forma triangular emulaba el 'Benben', la colina primordial de donde nació el dios solar Ra, y sus aristas funcionaban como una escalera cósmica hacia las estrellas imperecederas.",
				},
				{
					ID:        "step-03",
					Order:     3,
					Narrative: "Comprueba tu comprensión del sentido cósmico de esta arquitectura:",
					Check: &domain.Check{
						ID:       "chk-hist-01",
						Question: "¿Cuál era la razón fundamental por la que los egipcios preservaban el cuerpo (momia) dentro de una estructura impenetrable como la pirámide?",
						Options: []domain.CheckOption{
							{ID: "opt-a", Text: "Creían que el alma (Ka y Ba) necesitaba reconocer su cuerpo físico para sobrevivir en el más allá"},
							{ID: "opt-b", Text: "Para evitar que el cuerpo contaminara el agua del río Nilo"},
							{ID: "opt-c", Text: "Era un castigo impuesto por los sacerdotes de Anubis"},
						},
						CorrectOptionID: "opt-a",
						Explanation:     "La momificación y la tumba piramidal protegían el soporte físico que el alma requería para subsistir eternamente en el inframundo de Osiris.",
					},
				},
			},
		},
		"capsule-art-01": {
			ID:               "capsule-art-01",
			TopicID:          "topic-art",
			Title:            "¿Por qué es tan famosa la Mona Lisa?",
			Order:            1,
			EstimatedMinutes: 4,
			Steps: []domain.Step{
				{
					ID:        "step-01",
					Order:     1,
					Narrative: "La Mona Lisa de Leonardo da Vinci no siempre fue la pintura más célebre del planeta. Aunque su técnica del 'sfumato' era genial, un hecho histórico catapultó su mito global.",
					ImageURL:  &imgMonaLisa,
				},
				{
					ID:        "step-02",
					Order:     2,
					Narrative: "En 1911, un carpintero italiano llamado Vincenzo Peruggia la robó del Museo del Louvre escondiéndola bajo su abrigo. Durante dos años la prensa mundial no habló de otra cosa.",
				},
				{
					ID:        "step-03",
					Order:     3,
					Narrative: "Pongamos a prueba el análisis de este fenómeno:",
					Check: &domain.Check{
						ID:       "chk-art-01",
						Question: "Además del robo de 1911, ¿qué innovación técnica revolucionaria aplicó Da Vinci en el rostro de la Gioconda?",
						Options: []domain.CheckOption{
							{ID: "opt-a", Text: "Pintar con acuarelas sobre lienzo de seda japonesa"},
							{ID: "opt-b", Text: "El 'sfumato', difuminando los bordes de los ojos y la boca para crear una expresión viva e inaprensible"},
							{ID: "opt-c", Text: "El uso de luz ultravioleta para generar reflejos dorados"},
						},
						CorrectOptionID: "opt-b",
						Explanation:     "El sfumato (técnica de capas translúcidas de óleo sin líneas duras) genera la ilusión óptica de que la sonrisa cambia según dónde fijes la mirada.",
					},
				},
			},
		},
		"capsule-science-01": {
			ID:               "capsule-science-01",
			TopicID:          "topic-science",
			Title:            "El Horizonte de Sucesos",
			Order:            1,
			EstimatedMinutes: 4,
			Steps: []domain.Step{
				{
					ID:        "step-01",
					Order:     1,
					Narrative: "Un agujero negro posee una frontera invisible llamada horizonte de sucesos: el punto de no retorno donde la velocidad de escape supera a la velocidad de la luz.",
					ImageURL:  &imgCosmos,
				},
				{
					ID:        "step-02",
					Order:     2,
					Narrative: "Si cayeras hacia él, para un observador exterior tu tiempo parecería congelarse gradualmente y tu luz se volvería roja hasta desaparecer en el infinito.",
				},
				{
					ID:        "step-03",
					Order:     3,
					Narrative: "Verifica tu entendimiento de la física relativista:",
					Check: &domain.Check{
						ID:       "chk-sci-01",
						Question: "¿Por qué ni siquiera la luz puede escapar una vez que cruza el horizonte de sucesos?",
						Options: []domain.CheckOption{
							{ID: "opt-a", Text: "Porque el espacio-tiempo está tan intensamente curvado que todos los caminos futuros apuntan hacia el centro de la singularidad"},
							{ID: "opt-b", Text: "Porque la temperatura extremadamente fría congela los fotones de luz"},
							{ID: "opt-c", Text: "Porque la materia oscura absorbe la luz como una esponja"},
						},
						CorrectOptionID: "opt-a",
						Explanation:     "Bajo la relatividad general de Einstein, la gravedad extrema distorsiona el tejido del espacio-tiempo de tal modo que cualquier trayectoria futura conduce inevitablemente hacia la singularidad.",
					},
				},
			},
		},
	}

	return &MemoryRepository{
		topics:         initialTopics,
		capsules:       initialCapsules,
		streak:         domain.StreakState{TotalDays: 1, CurrentStreak: 1, MaxStreak: 1},
		completedItems: make(map[string]time.Time),
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

// GetCapsulesByTopic devuelve las cápsulas asociadas a un tema determinado, ordenadas deterministamente.
func (r *MemoryRepository) GetCapsulesByTopic(topicID string) ([]domain.Capsule, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []domain.Capsule
	for _, c := range r.capsules {
		if c.TopicID == topicID {
			result = append(result, c)
		}
	}

	// Orden determinista por Order y luego ID
	for i := 0; i < len(result)-1; i++ {
		for j := i + 1; j < len(result); j++ {
			if result[i].Order > result[j].Order || (result[i].Order == result[j].Order && result[i].ID > result[j].ID) {
				result[i], result[j] = result[j], result[i]
			}
		}
	}

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

// GetCheck busca un desafío interactivo específico dentro de una cápsula.
func (r *MemoryRepository) GetCheck(capsuleID, checkID string) (*domain.Check, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	capsule, found := r.capsules[capsuleID]
	if !found {
		return nil, errors.New("cápsula no encontrada")
	}

	for _, step := range capsule.Steps {
		if step.Check != nil && step.Check.ID == checkID {
			return step.Check, nil
		}
	}

	return nil, errors.New("desafío de validación no encontrado")
}

// GetStreak devuelve el estado actual de la racha del usuario.
func (r *MemoryRepository) GetStreak() (*domain.StreakState, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	s := r.streak
	return &s, nil
}

// CompleteCapsule registra la lección como terminada y recalcula la racha diaria.
func (r *MemoryRepository) CompleteCapsule(capsuleID string, completedAt time.Time) (*domain.StreakState, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.capsules[capsuleID]; !exists {
		return nil, errors.New("la cápsula no existe en el catálogo")
	}

	r.completedItems[capsuleID] = completedAt
	r.streak.RecordCompletion(completedAt)

	s := r.streak
	return &s, nil
}
