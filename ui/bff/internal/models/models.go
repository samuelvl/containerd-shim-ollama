package models

// CustomProperties represents custom properties for a model
type ModelCustomProperties map[string]interface{}

// StatusModel represents the status of a model
type StatusModel string

const (
	StatusModelNotDeployed StatusModel = "NOT_DEPLOYED"
	StatusModelDeployed    StatusModel = "DEPLOYED"
	StatusModelError       StatusModel = "ERROR"
)

// OllamaModel extends ModelBase with additional fields specific to Ollama models
type OllamaModel struct {
	ID                       string                `json:"id"`
	Name                     string                `json:"name"`
	ExternalID               *string               `json:"externalID,omitempty"`
	Description              *string               `json:"description,omitempty"`
	CreateTimeSinceEpoch     string                `json:"createTimeSinceEpoch"`
	LastUpdateTimeSinceEpoch string                `json:"lastUpdateTimeSinceEpoch"`
	CustomProperties         ModelCustomProperties `json:"customProperties"`
	Image                    *string               `json:"image,omitempty"`
	Tags                     []string              `json:"tags,omitempty"`
	Author                   *string               `json:"author,omitempty"`
	Owner                    *string               `json:"owner,omitempty"`
	Deployed                 bool                  `json:"deployed"`
	Status                   StatusModel           `json:"status"`
}
