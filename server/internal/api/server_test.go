package api_test

import (
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
