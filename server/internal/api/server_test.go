package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"nibble-server/internal/api"
	"nibble-server/internal/domain"
	"nibble-server/internal/storage"
)

func TestHealthEndpoint(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rec := httptest.NewRecorder()

	server.Handler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d", rec.Code)
	}

	var res map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&res); err != nil {
		t.Fatalf("Error decodificando respuesta: %v", err)
	}

	if res["status"] != "ok" {
		t.Errorf("Se esperaba status 'ok', obtenido '%s'", res["status"])
	}

	// Verificar cabeceras CORS
	corsHeader := rec.Header().Get("Access-Control-Allow-Origin")
	if corsHeader != "*" {
		t.Errorf("Cabecera CORS esperada '*', obtenida '%s'", corsHeader)
	}
}

func TestGetTopicsEndpoint(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	req := httptest.NewRequest(http.MethodGet, "/api/topics", nil)
	rec := httptest.NewRecorder()

	server.Handler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d", rec.Code)
	}

	var topics []domain.Topic
	if err := json.NewDecoder(rec.Body).Decode(&topics); err != nil {
		t.Fatalf("Error decodificando temas: %v", err)
	}

	if len(topics) < 3 {
		t.Errorf("Se esperaban al menos 3 temas iniciales, obtenidos %d", len(topics))
	}
}

func TestGetCapsulesByTopicEndpoint(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	req := httptest.NewRequest(http.MethodGet, "/api/topics/topic-logic/capsules", nil)
	rec := httptest.NewRecorder()

	server.Handler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d", rec.Code)
	}

	var capsules []domain.Capsule
	if err := json.NewDecoder(rec.Body).Decode(&capsules); err != nil {
		t.Fatalf("Error decodificando cápsulas por tema: %v", err)
	}

	if len(capsules) < 2 {
		t.Errorf("Se esperaban al menos 2 cápsulas para topic-logic, obtenidos %d", len(capsules))
	}
}

func TestGetCapsuleEndpoint(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	// Cápsula existente
	req := httptest.NewRequest(http.MethodGet, "/api/capsules/capsule-logic-01", nil)
	rec := httptest.NewRecorder()

	server.Handler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d", rec.Code)
	}

	var capsule domain.Capsule
	if err := json.NewDecoder(rec.Body).Decode(&capsule); err != nil {
		t.Fatalf("Error decodificando cápsula: %v", err)
	}

	if capsule.ID != "capsule-logic-01" {
		t.Errorf("ID esperado 'capsule-logic-01', obtenido '%s'", capsule.ID)
	}

	// Cápsula inexistente
	reqNotFound := httptest.NewRequest(http.MethodGet, "/api/capsules/inexistente", nil)
	recNotFound := httptest.NewRecorder()

	server.Handler().ServeHTTP(recNotFound, reqNotFound)

	if recNotFound.Code != http.StatusNotFound {
		t.Fatalf("Código esperado 404, obtenido %d", recNotFound.Code)
	}
}

func TestCheckAttemptEndpoint(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	// Intento con respuesta correcta (opt-b)
	bodyCorrect, _ := json.Marshal(map[string]string{
		"selectedOptionId": "opt-b",
	})
	req := httptest.NewRequest(http.MethodPost, "/api/capsules/capsule-logic-01/checks/chk-01/attempts", bytes.NewReader(bodyCorrect))
	rec := httptest.NewRecorder()

	server.Handler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d: %s", rec.Code, rec.Body.String())
	}

	var attempt domain.CheckAttempt
	if err := json.NewDecoder(rec.Body).Decode(&attempt); err != nil {
		t.Fatalf("Error decodificando intento: %v", err)
	}

	if !attempt.IsCorrect {
		t.Errorf("Se esperaba que el intento fuera marcado como correcto")
	}
	if attempt.SelectedOptionID != "opt-b" {
		t.Errorf("Opción esperada 'opt-b', obtenida '%s'", attempt.SelectedOptionID)
	}

	// Intento con respuesta incorrecta (opt-a)
	bodyIncorrect, _ := json.Marshal(map[string]string{
		"selectedOptionId": "opt-a",
	})
	reqInc := httptest.NewRequest(http.MethodPost, "/api/capsules/capsule-logic-01/checks/chk-01/attempts", bytes.NewReader(bodyIncorrect))
	recInc := httptest.NewRecorder()

	server.Handler().ServeHTTP(recInc, reqInc)

	if recInc.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d", recInc.Code)
	}

	var attemptInc domain.CheckAttempt
	if err := json.NewDecoder(recInc.Body).Decode(&attemptInc); err != nil {
		t.Fatalf("Error decodificando intento: %v", err)
	}

	if attemptInc.IsCorrect {
		t.Errorf("Se esperaba que el intento fuera marcado como incorrecto")
	}
}

func TestStreakAndCompletionEndpoints(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	// Obtener racha inicial
	reqStreak := httptest.NewRequest(http.MethodGet, "/api/profile/streak", nil)
	recStreak := httptest.NewRecorder()

	server.Handler().ServeHTTP(recStreak, reqStreak)

	if recStreak.Code != http.StatusOK {
		t.Fatalf("Código esperado 200, obtenido %d", recStreak.Code)
	}

	var initialStreak domain.StreakState
	if err := json.NewDecoder(recStreak.Body).Decode(&initialStreak); err != nil {
		t.Fatalf("Error decodificando racha inicial: %v", err)
	}

	if initialStreak.CurrentStreak < 1 {
		t.Errorf("Racha inicial esperada >= 1, obtenida %d", initialStreak.CurrentStreak)
	}

	// Completar cápsula existente
	completeBody, _ := json.Marshal(map[string]string{
		"capsuleId": "capsule-logic-01",
	})
	reqComp := httptest.NewRequest(http.MethodPost, "/api/progress/complete-capsule", bytes.NewReader(completeBody))
	recComp := httptest.NewRecorder()

	server.Handler().ServeHTTP(recComp, reqComp)

	if recComp.Code != http.StatusOK {
		t.Fatalf("Código esperado 200 al completar cápsula, obtenido %d", recComp.Code)
	}

	var updatedStreak domain.StreakState
	if err := json.NewDecoder(recComp.Body).Decode(&updatedStreak); err != nil {
		t.Fatalf("Error decodificando racha actualizada: %v", err)
	}

	if updatedStreak.TotalDays < 1 {
		t.Errorf("TotalDays esperado >= 1, obtenido %d", updatedStreak.TotalDays)
	}
}

func TestCORSOptionsPreflight(t *testing.T) {
	repo := storage.NewMemoryRepository()
	server := api.NewServer(repo)

	req := httptest.NewRequest(http.MethodOptions, "/api/topics", nil)
	rec := httptest.NewRecorder()

	server.Handler().ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("Código preflight esperado 204, obtenido %d", rec.Code)
	}
	if rec.Header().Get("Access-Control-Allow-Methods") == "" {
		t.Errorf("Se esperaba encabezado Access-Control-Allow-Methods presente")
	}
}
