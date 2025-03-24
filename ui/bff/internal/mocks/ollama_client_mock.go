package mocks

import (
	"log/slog"

	"github.com/stretchr/testify/mock"
)

type OllamaClientMock struct {
	mock.Mock
}

func NewOllamaClient(_ *slog.Logger) (*OllamaClientMock, error) {
	return &OllamaClientMock{}, nil
}
