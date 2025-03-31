package repositories

import (
	"context"
	"encoding/json"
	"fmt"

	k8s "github.com/kubeflow/ollama/ui/bff/internal/integrations"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
)

type ModelRepository struct {
}

func NewModelRepository() *ModelRepository {
	return &ModelRepository{}
}

func (m *ModelRepository) GetAllModels(sessionCtx context.Context, client k8s.KubernetesClientInterface, namespace string) ([]models.ModelCatalogSource, error) {
	// Get the ConfigMap with model catalog sources
	configMap, err := client.GetConfigMap(sessionCtx, namespace, "model-catalog-sources")
	if err != nil {
		// If config map doesn't exist, return empty array
		return []models.ModelCatalogSource{}, nil
	}

	// Extract modelCatalogSources data from ConfigMap
	modelCatalogSourcesData, exists := configMap.Data["modelCatalogSources"]
	if !exists {
		return []models.ModelCatalogSource{}, nil
	}

	// Parse the JSON data
	var parsedData struct {
		Sources []models.ModelCatalogSource `json:"sources"`
	}
	if err := json.Unmarshal([]byte(modelCatalogSourcesData), &parsedData); err != nil {
		return []models.ModelCatalogSource{}, fmt.Errorf("error parsing model catalog sources: %w", err)
	}

	// Get all services in the namespace
	services, err := client.GetServiceDetails(sessionCtx, namespace)
	if err != nil {
		return []models.ModelCatalogSource{}, fmt.Errorf("error fetching services: %w", err)
	}

	// Log services for debugging
	fmt.Printf("Services found: %d\n", len(services))
	for i, service := range services {
		fmt.Printf("Service %d: %s\n", i+1, service.Name)
	}

	// Create a map of service names for easy lookup
	serviceNames := make(map[string]bool)
	for _, service := range services {
		serviceNames[service.Name] = true
	}

	// Update status for each model in each source
	for i := range parsedData.Sources {
		for j := range parsedData.Sources[i].Models {
			model := &parsedData.Sources[i].Models[j]
			if serviceNames[model.Name] {
				model.Status = "deployed"
			} else {
				model.Status = "undeployed"
			}
		}
	}

	return parsedData.Sources, nil

}

// func (m *ModelRepository) GetModel(sessionCtx context.Context, client k8s.KubernetesClientInterface, namespace string, ollamaID string) (models.OllamaModel, error) {

// 	s, err := client.GetServiceDetailsByName(sessionCtx, namespace, ollamaID)
// 	if err != nil {
// 		return models.OllamaModel{}, fmt.Errorf("error fetching model registry: %w", err)
// 	}

// 	modelRegistry := models.OllamaModel{
// 		Name:   s.Name,
// 		ID:     ollamaID,
// 		Status: "Running",
// 	}

// 	return modelRegistry, nil
// }
