package api

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"path"

	helper "github.com/kubeflow/ollama/ui/bff/internal/helpers"

	"github.com/kubeflow/ollama/ui/bff/internal/config"
	"github.com/kubeflow/ollama/ui/bff/internal/integrations"
	"github.com/kubeflow/ollama/ui/bff/internal/repositories"

	"github.com/julienschmidt/httprouter"
	"github.com/kubeflow/ollama/ui/bff/internal/mocks"
)

const (
	Version = "1.0.0"

	PathPrefix        = "/ollama"
	OllamaId          = "ollama"
	ApiPathPrefix     = "/api/v1"
	HealthCheckPath   = ApiPathPrefix + "/healthcheck"
	UserPath          = ApiPathPrefix + "/user"
	NamespaceListPath = ApiPathPrefix + "/namespaces"
	SettingsPath      = ApiPathPrefix + "/settings"
	ModelPath         = ApiPathPrefix + "/models"
)

type App struct {
	config           config.EnvConfig
	logger           *slog.Logger
	kubernetesClient integrations.KubernetesClientInterface
	repositories     *repositories.Repositories
}

func NewApp(cfg config.EnvConfig, logger *slog.Logger) (*App, error) {
	logger.Debug("Initializing app with config", slog.Any("config", cfg))
	var k8sClient integrations.KubernetesClientInterface
	var err error
	if cfg.MockK8Client {
		//mock all k8s calls
		ctx, cancel := context.WithCancel(context.Background())
		k8sClient, err = mocks.NewKubernetesClient(logger, ctx, cancel)
	} else {
		k8sClient, err = integrations.NewKubernetesClient(logger)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to create Kubernetes client: %w", err)
	}

	var ollamaClient repositories.OllamaClientInterface

	if cfg.MockChatClient {
		//mock all model calls
		// TODO: implement when we have ollama client
		ollamaClient, err = mocks.NewOllamaClient(logger)
	} else {
		ollamaClient, err = repositories.NewOllamaClient(logger)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to create ModelRegistryListPath client: %w", err)
	}

	app := &App{
		config:           cfg,
		logger:           logger,
		kubernetesClient: k8sClient,
		repositories:     repositories.NewRepositories(ollamaClient),
	}
	return app, nil
}

func (app *App) Shutdown(ctx context.Context, logger *slog.Logger) error {
	return app.kubernetesClient.Shutdown(ctx, logger)
}

func (app *App) Routes() http.Handler {
	// Router for /api/v1/*
	apiRouter := httprouter.New()

	apiRouter.NotFound = http.HandlerFunc(app.notFoundResponse)
	apiRouter.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	// HTTP client routes (requests that we forward to Ollama API)
	// on those, we perform SAR on Specific Service on a given namespace
	apiRouter.GET(HealthCheckPath, app.HealthcheckHandler)

	// Kubernetes routes
	apiRouter.GET(UserPath, app.UserHandler)
	apiRouter.GET(ModelPath, app.AttachNamespace((app.PerformSARonGetListServicesByNamespace(app.GetAllModelsHandler))))

	if app.config.StandaloneMode {
		apiRouter.GET(NamespaceListPath, app.GetNamespacesHandler)
	}

	// App Router
	appMux := http.NewServeMux()

	// handler for api calls
	appMux.Handle(ApiPathPrefix+"/", apiRouter)
	appMux.Handle(PathPrefix+ApiPathPrefix+"/", http.StripPrefix(PathPrefix, apiRouter))

	// file server for the frontend file and SPA routes
	staticDir := http.Dir(app.config.StaticAssetsDir)
	fileServer := http.FileServer(staticDir)
	appMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ctxLogger := helper.GetContextLoggerFromReq(r)
		// Check if the requested file exists
		if _, err := staticDir.Open(r.URL.Path); err == nil {
			ctxLogger.Debug("Serving static file", slog.String("path", r.URL.Path))
			// Serve the file if it exists
			fileServer.ServeHTTP(w, r)
			return
		}

		// Fallback to index.html for SPA routes
		ctxLogger.Debug("Static asset not found, serving index.html", slog.String("path", r.URL.Path))
		http.ServeFile(w, r, path.Join(app.config.StaticAssetsDir, "index.html"))
	})

	return app.RecoverPanic(app.EnableTelemetry(app.EnableCORS(app.InjectUserHeaders(appMux))))
}
