package repositories

import (
	"context"
	"fmt"

	k8s "github.com/kubeflow/ollama/ui/bff/internal/integrations"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
)

type ModelRepository struct {
}

func NewModelRepository() *ModelRepository {
	return &ModelRepository{}
}

func (m *ModelRepository) GetAllModels(sessionCtx context.Context, client k8s.KubernetesClientInterface, namespace string) ([]models.OllamaModel, error) {

	resources, err := client.GetServiceDetails(sessionCtx, namespace)
	if err != nil {
		return nil, fmt.Errorf("error fetching models: %w", err)
	}

	var registries = []models.OllamaModel{}
	for _, s := range resources {
		serverAddress := m.ResolveServerAddress(s.ClusterIP, s.HTTPPort)
		registry := models.OllamaModel{
			Name:   s.Name,
			ID:     serverAddress,
			Status: "Running",
		}
		registries = append(registries, registry)
	}

	return registries, nil
}

func (m *ModelRepository) GetModel(sessionCtx context.Context, client k8s.KubernetesClientInterface, namespace string, ollamaID string) (models.OllamaModel, error) {

	s, err := client.GetServiceDetailsByName(sessionCtx, namespace, ollamaID)
	if err != nil {
		return models.OllamaModel{}, fmt.Errorf("error fetching model registry: %w", err)
	}

	modelRegistry := models.OllamaModel{
		Name:   s.Name,
		ID:     ollamaID,
		Status: "Running",
	}

	return modelRegistry, nil
}

func (m *ModelRepository) ResolveServerAddress(clusterIP string, httpPort int32) string {
	url := fmt.Sprintf("http://%s:%d/api/model_registry/v1alpha3", clusterIP, httpPort)
	return url
}
