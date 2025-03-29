package mocks

import (
	"io"
	"log/slog"

	"github.com/stretchr/testify/mock"
)

type OllamaClientMock struct {
	mock.Mock
}

func NewOllamaClient(_ *slog.Logger) (*OllamaClientMock, error) {
	return &OllamaClientMock{}, nil
}

// Implementing the OllamaClientInterface methods for the mock
func (m *OllamaClientMock) GET(url string) ([]byte, error) {
	// For simple mock implementations, we can just return empty data
	return []byte("{}"), nil
}

func (m *OllamaClientMock) POST(url string, body io.Reader) ([]byte, error) {
	// For mocking generate responses, return a predefined response
	if url == "/api/generate" {
		return []byte(`{
			"model": "mock-model",
			"created_at": "2023-08-04T19:22:45.499127Z",
			"response": "This is a mock response from Ollama.",
			"done": true,
			"total_duration": 123456789,
			"load_duration": 12345678,
			"prompt_eval_count": 10,
			"prompt_eval_duration": 56789,
			"eval_count": 50,
			"eval_duration": 78901
		}`), nil
	}
	return []byte("{}"), nil
}

func (m *OllamaClientMock) PATCH(url string, body io.Reader) ([]byte, error) {
	// For simple mock implementations, we can just return empty data
	return []byte("{}"), nil
}
