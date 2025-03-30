package api

import (
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/kubeflow/ollama/ui/bff/internal/constants"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
)

type ModelListEnvelope Envelope[[]models.ModelCatalogSource, None]
type ModelEnvelope Envelope[models.ModelCatalogSource, None]

func (app *App) GetAllModelsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	namespace, ok := r.Context().Value(constants.NamespaceHeaderParameterKey).(string)
	if !ok || namespace == "" {
		app.badRequestResponse(w, r, fmt.Errorf("missing namespace in the context"))
	}

	registries, err := app.repositories.Model.GetAllModels(r.Context(), app.kubernetesClient, namespace)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	ModelRes := ModelListEnvelope{
		Data: registries,
	}

	err = app.WriteJSON(w, http.StatusOK, ModelRes, nil)

	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
