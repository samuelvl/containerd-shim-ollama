package api

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/kubeflow/ollama/ui/bff/internal/config"
	"github.com/kubeflow/ollama/ui/bff/internal/constants"
	"github.com/kubeflow/ollama/ui/bff/internal/mocks"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
	"github.com/kubeflow/ollama/ui/bff/internal/repositories"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheckHandler(t *testing.T) {

	mockOllamaClient, _ := mocks.NewOllamaClient(nil)

	app := App{config: config.EnvConfig{
		Port: 4000,
	},
		repositories: repositories.NewRepositories(mockOllamaClient),
	}

	rr := httptest.NewRecorder()
	req, err := http.NewRequest(http.MethodGet, HealthCheckPath, nil)
	ctx := context.WithValue(req.Context(), constants.KubeflowUserIdKey, mocks.KubeflowUserIDHeaderValue)
	req = req.WithContext(ctx)
	assert.NoError(t, err)

	app.HealthcheckHandler(rr, req, nil)

	rs := rr.Result()

	defer rs.Body.Close()

	body, err := io.ReadAll(rs.Body)
	assert.NoError(t, err)

	var healthCheckRes models.HealthCheckModel
	err = json.Unmarshal(body, &healthCheckRes)
	assert.NoError(t, err)

	assert.Equal(t, http.StatusOK, rr.Code)

	expected := models.HealthCheckModel{
		Status: "available",
		SystemInfo: models.SystemInfo{
			Version: Version,
		},
		UserID: mocks.KubeflowUserIDHeaderValue,
	}

	assert.Equal(t, expected, healthCheckRes)
}
