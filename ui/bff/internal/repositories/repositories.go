package repositories

// Repositories struct is a single convenient container to hold and represent all our repositories.
type Repositories struct {
	HealthCheck  *HealthCheckRepository
	Model        *ModelRepository
	OllamaClient OllamaClientInterface
	User         *UserRepository
	Namespace    *NamespaceRepository
	Chat         *ChatRepository
}

func NewRepositories(OllamaClient OllamaClientInterface) *Repositories {
	return &Repositories{
		HealthCheck:  NewHealthCheckRepository(),
		Model:        NewModelRepository(),
		OllamaClient: OllamaClient,
		User:         NewUserRepository(),
		Namespace:    NewNamespaceRepository(),
		Chat:         NewChatRepository(OllamaClient),
	}
}
