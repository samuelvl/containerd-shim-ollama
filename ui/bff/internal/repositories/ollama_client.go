package repositories

import (
	"io"
	"log/slog"

	"github.com/kubeflow/ollama/ui/bff/internal/integrations"
)

type OllamaClientInterface interface {
	// Methods needed for ChatRepository
	GET(url string) ([]byte, error)
	POST(url string, body io.Reader) ([]byte, error)
	PATCH(url string, body io.Reader) ([]byte, error)
}

type OllamaClient struct {
	logger *slog.Logger
	client integrations.HTTPClientInterface
}

func NewOllamaClient(logger *slog.Logger) (OllamaClientInterface, error) {
	httpClient, err := integrations.NewHTTPClient(logger, "", "")
	if err != nil {
		return nil, err
	}

	return &OllamaClient{
		logger: logger,
		client: httpClient,
	}, nil
}

// Implementing the interface methods to delegate to the HTTP client
func (c *OllamaClient) GET(url string) ([]byte, error) {
	return c.client.GET(url)
}

func (c *OllamaClient) POST(url string, body io.Reader) ([]byte, error) {
	return c.client.POST(url, body)
}

func (c *OllamaClient) PATCH(url string, body io.Reader) ([]byte, error) {
	return c.client.PATCH(url, body)
}
