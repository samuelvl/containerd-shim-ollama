package models

type BaseModel struct {
	Catalog    string `json:"catalog,omitempty"`
	Repository string `json:"repository,omitempty"`
	Name       string `json:"name,omitempty"`
}

type ArtifactsProtocol string

const (
	ProtocolOCI ArtifactsProtocol = "oci"
)

type CatalogArtifacts struct {
	Protocol             ArtifactsProtocol `json:"protocol,omitempty"`
	CreateTimeSinceEpoch int64             `json:"createTimeSinceEpoch,omitempty"`
	Tags                 []string          `json:"tags,omitempty"`
	URI                  string            `json:"uri,omitempty"`
}

type CatalogModelDeploymentStatus string

const (
	StatusDeployed   CatalogModelDeploymentStatus = "deployed"
	StatusUndeployed CatalogModelDeploymentStatus = "undeployed"
	StatusPending    CatalogModelDeploymentStatus = "pending"
	StatusError      CatalogModelDeploymentStatus = "error"
)

type CatalogModel struct {
	Repository               string                       `json:"repository"`
	Name                     string                       `json:"name"`
	DisplayName              string                       `json:"displayName"`
	Provider                 string                       `json:"provider,omitempty"`
	Description              string                       `json:"description,omitempty"`
	LongDescription          string                       `json:"longDescription,omitempty"`
	Logo                     string                       `json:"logo,omitempty"`
	Readme                   string                       `json:"readme,omitempty"`
	Language                 []string                     `json:"language,omitempty"`
	License                  string                       `json:"license,omitempty"`
	LicenseLink              string                       `json:"licenseLink,omitempty"`
	Maturity                 string                       `json:"maturity,omitempty"`
	LibraryName              string                       `json:"libraryName,omitempty"`
	BaseModel                []BaseModel                  `json:"baseModel,omitempty"`
	Labels                   []string                     `json:"labels,omitempty"`
	Tasks                    []string                     `json:"tasks,omitempty"`
	CreateTimeSinceEpoch     int64                        `json:"createTimeSinceEpoch,omitempty"`
	LastUpdateTimeSinceEpoch int64                        `json:"lastUpdateTimeSinceEpoch,omitempty"`
	Artifacts                []CatalogArtifacts           `json:"artifacts,omitempty"`
	Status                   CatalogModelDeploymentStatus `json:"status"`
}

type ModelCatalogSource struct {
	Source string         `json:"source"`
	Models []CatalogModel `json:"models"`
}
