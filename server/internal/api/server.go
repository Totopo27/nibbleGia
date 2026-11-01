package api

import (
	"encoding/json"
	"net/http"

	"nibble-server/internal/storage"
)

// Server expone el multiplexor de rutas y dependencias del API.
type Server struct {
	repo   storage.Repository
	router *http.ServeMux
}

// NewServer construye el router HTTP y asocia los endpoints.
func NewServer(repo storage.Repository) *Server {
	s := &Server{
		repo:   repo,
		router: http.NewServeMux(),
	}

	s.routes()
	return s
}

// routes registra los endpoints de la API usando los patrones mejorados de net/http de Go 1.22+.
func (s *Server) routes() {
	s.router.HandleFunc("GET /api/health", s.handleHealth)
	s.router.HandleFunc("GET /api/topics", s.handleGetTopics)
	s.router.HandleFunc("GET /api/capsules/{id}", s.handleGetCapsule)
}

// Handler devuelve el handler HTTP envuelto con los middlewares globales.
func (s *Server) Handler() http.Handler {
	return Chain(s.router, RecoveryMiddleware, LoggingMiddleware, CORSMiddleware)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
}

func (s *Server) handleGetTopics(w http.ResponseWriter, r *http.Request) {
	topics, err := s.repo.GetTopics()
	if err != nil {
		http.Error(w, `{"error":"failed_to_fetch_topics"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(topics)
}

func (s *Server) handleGetCapsule(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, `{"error":"missing_capsule_id"}`, http.StatusBadRequest)
		return
	}

	capsule, err := s.repo.GetCapsuleByID(id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{
			"error": "capsule_not_found",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(capsule)
}
