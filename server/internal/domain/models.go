package domain

import (
	"errors"
	"time"
)

// Topic representa un área de conocimiento macro (ej. Lógica, Pensamiento Crítico).
type Topic struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Icon        string `json:"icon"`
}

// CheckOption representa una alternativa seleccionable en un desafío de validación.
type CheckOption struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

// Check modela un desafío interactivo formativo incrustado en un paso de cápsula.
type Check struct {
	ID              string        `json:"id"`
	Question        string        `json:"question"`
	Options         []CheckOption `json:"options"`
	CorrectOptionID string        `json:"correctOptionId"`
	Explanation     string        `json:"explanation"`
}

// Step representa una pantalla o fragmento secuencial dentro de una cápsula de aprendizaje.
type Step struct {
	ID        string  `json:"id"`
	Order     int     `json:"order"`
	Narrative string  `json:"narrative"`
	ImageURL  *string `json:"imageUrl,omitempty"`
	Check     *Check  `json:"check,omitempty"`
}

// Capsule es la unidad atómica de microaprendizaje (3 a 7 minutos).
type Capsule struct {
	ID               string `json:"id"`
	TopicID          string `json:"topicId"`
	Title            string `json:"title"`
	Order            int    `json:"order"`
	EstimatedMinutes int    `json:"estimatedMinutes"`
	Steps            []Step `json:"steps"`
}

// Validate asegura la integridad pedagógica de una cápsula de aprendizaje.
func (c *Capsule) Validate() error {
	if c.ID == "" {
		return errors.New("la cápsula requiere un ID")
	}
	if c.Title == "" {
		return errors.New("la cápsula requiere un título")
	}
	if len(c.Steps) == 0 {
		return errors.New("la cápsula debe contener al menos un paso")
	}
	return nil
}

// CheckAttempt modela la respuesta del aprendiz frente a un desafío.
type CheckAttempt struct {
	CheckID            string `json:"checkId"`
	SelectedOptionID   string `json:"selectedOptionId"`
	IsCorrect          bool   `json:"isCorrect"`
	ExplanationShown   string `json:"explanationShown"`
}

// EvaluateCheck evalúa si la opción seleccionada por el aprendiz es la correcta.
func (chk *Check) Evaluate(selectedOptionID string) CheckAttempt {
	isCorrect := chk.CorrectOptionID == selectedOptionID
	return CheckAttempt{
		CheckID:          chk.ID,
		SelectedOptionID: selectedOptionID,
		IsCorrect:        isCorrect,
		ExplanationShown: chk.Explanation,
	}
}

// StreakState representa el estado conductual de constancia diaria del aprendiz.
type StreakState struct {
	TotalDays      int        `json:"totalDays"`
	CurrentStreak  int        `json:"currentStreak"`
	MaxStreak      int        `json:"maxStreak"`
	LastActiveDate *time.Time `json:"lastActiveDate,omitempty"`
}

// RecordCompletion actualiza el cálculo de racha diaria de forma pura en base a fechas.
func (s *StreakState) RecordCompletion(now time.Time) {
	currentDay := now.Truncate(24 * time.Hour)

	if s.LastActiveDate == nil {
		s.CurrentStreak = 1
		s.MaxStreak = 1
		s.TotalDays = 1
		s.LastActiveDate = &currentDay
		return
	}

	lastDay := s.LastActiveDate.Truncate(24 * time.Hour)
	diffDays := int(currentDay.Sub(lastDay).Hours() / 24)

	if diffDays == 0 {
		// Mismo día calendario, la racha ya se contabilizó hoy
		return
	} else if diffDays == 1 {
		// Día consecutivo: la racha se incrementa
		s.CurrentStreak++
		if s.CurrentStreak > s.MaxStreak {
			s.MaxStreak = s.CurrentStreak
		}
		s.TotalDays++
	} else {
		// Racha rota (más de 1 día de inactividad): se reinicia a 1
		s.CurrentStreak = 1
		s.TotalDays++
	}

	s.LastActiveDate = &currentDay
}
