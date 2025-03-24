package repositories

import (
	"log/slog"
)

type OllamaClientInterface interface {
	// OllamaClient methods
}

type OllamaClient struct {
	logger *slog.Logger
}

func NewOllamaClient(logger *slog.Logger) (OllamaClientInterface, error) {
	return &OllamaClient{logger: logger}, nil
}
