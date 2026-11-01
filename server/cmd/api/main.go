package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"nibble-server/internal/api"
	"nibble-server/internal/storage"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	repo := storage.NewMemoryRepository()
	serverAPI := api.NewServer(repo)

	httpServer := &http.Server{
		Addr:         ":" + port,
		Handler:      serverAPI.Handler(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Manejo de apagado elegante (Graceful Shutdown)
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("🚀 Servidor Nibble API iniciado en http://localhost:%s", port)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("Error en el servidor HTTP: %v", err)
		}
	}()

	<-stop
	log.Println("🛑 Apagando el servidor limpiamente...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		log.Fatalf("Error forzando cierre de servidor: %v", err)
	}

	log.Println("✅ Servidor detenido con éxito.")
}
