package repositories

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/kubeflow/ollama/ui/bff/internal/integrations"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
)

type ChatRepository struct {
	Client OllamaClientInterface
}

// NewChatRepository creates a new ChatRepository.
func NewChatRepository(client OllamaClientInterface) *ChatRepository {
	return &ChatRepository{
		Client: client,
	}
}

// Generate sends a request to the Ollama API to generate a response for a given prompt.
func (c *ChatRepository) Generate(ctx context.Context, client integrations.HTTPClientInterface, request models.GenerateRequest) (models.GenerateResponse, error) {
	// Convert the request to JSON
	requestBytes, err := json.Marshal(request)
	if err != nil {
		return models.GenerateResponse{}, fmt.Errorf("error marshalling request: %w", err)
	}
	// Send the request to the Ollama API
	responseBytes, err := client.POST("/api/generate", bytes.NewReader(requestBytes))
	if err != nil {
		return models.GenerateResponse{}, err
	}

	// Parse the response
	var response models.GenerateResponse
	if err := json.Unmarshal(responseBytes, &response); err != nil {
		return models.GenerateResponse{}, fmt.Errorf("error unmarshalling response: %w", err)
	}

	return response, nil
}

// ResolveServerAddress resolves the server address for local development mode
func (c *ChatRepository) ResolveServerAddress(host string, port int32) string {
	return fmt.Sprintf("http://%s:%s", host, strconv.Itoa(int(port)))
}

// GenerateMock returns a mock generate response for testing purposes
func (c *ChatRepository) GenerateMock(request models.GenerateRequest) models.GenerateResponse {
	return models.GenerateResponse{
		Model:              request.Model,
		CreatedAt:          "2023-08-04T19:22:45.499127Z",
		Response:           "This is a mock response from Ollama. The prompt was: " + request.Prompt,
		Done:               true,
		TotalDuration:      123456789,
		LoadDuration:       12345678,
		PromptEvalCount:    10,
		PromptEvalDuration: 56789,
		EvalCount:          50,
		EvalDuration:       78901,
	}
}
