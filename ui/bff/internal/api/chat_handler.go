package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/kubeflow/ollama/ui/bff/internal/constants"
	"github.com/kubeflow/ollama/ui/bff/internal/integrations"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
)

type GenerateEnvelope Envelope[models.GenerateResponse, None]

// GenerateCompletionHandler handles requests to generate completions from an LLM
func (app *App) GenerateCompletionHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		app.badRequestResponse(w, r, fmt.Errorf("error reading request body: %w", err))
		return
	}
	defer r.Body.Close()

	// Parse the request body
	var generateRequest models.GenerateRequest
	if err := json.Unmarshal(body, &generateRequest); err != nil {
		app.badRequestResponse(w, r, fmt.Errorf("error parsing request body: %w", err))
		return
	}

	// Get HTTP client from context
	client, ok := r.Context().Value(constants.OllamaHttpClientKey).(integrations.HTTPClientInterface)
	if !ok || client == nil {
		app.serverErrorResponse(w, r, fmt.Errorf("error getting HTTP client from context"))
		return
	}

	var response models.GenerateResponse
	var generateErr error

	// If mock mode is enabled, use mock data
	if app.config.MockChatClient {
		response = app.repositories.Chat.GenerateMock(generateRequest)
	} else {
		// Forward the request to the Ollama service
		response, generateErr = app.repositories.Chat.Generate(r.Context(), client, generateRequest)
		if generateErr != nil {
			app.serverErrorResponse(w, r, fmt.Errorf("error generating completion: %w", generateErr))
			return
		}
	}

	// Wrap the response in the envelope and send it
	env := GenerateEnvelope{
		Data: response,
	}

	if err := app.WriteJSON(w, http.StatusOK, env, nil); err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
