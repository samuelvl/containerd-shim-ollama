#!/usr/bin/env bash

# Check for required tools
command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required but it's not installed. Aborting."; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but it's not installed. Aborting."; exit 1; }
command -v kind >/dev/null 2>&1 || { echo >&2 "kind is required but it's not installed. Aborting."; exit 1; }

echo "WARNING: You must have proper push / pull access to ${IMG_UI_STANDALONE}. If this is a new image, make sure you set it to public to avoid issues."

# Get the root directory of the project
ROOT_DIR=$(cd $(dirname "$0")/../.. && pwd)

# Set Kubernetes context to kind
echo "Setting Kubernetes context to kind..."
if kubectl config use-context kind-ollama-shim  >/dev/null 2>&1; then
  echo "Ollama deployment already exists. Skipping to step 4."
else
    # Step 1: Create a kind cluster
    echo "Creating kind cluster..."
    (cd $ROOT_DIR && make kind)

    # Verify cluster creation
    echo "Verifying cluster..."
    kubectl cluster-info

    # Step 2: Create kubeflow namespace
    echo "Creating kubeflow namespace..."
    kubectl create namespace kubeflow

    echo "Deploying the model..."
    (cd $ROOT_DIR && kubectl apply -n kubeflow -f ./manifests/models/qwen2-model.yaml)
fi

echo "Editing kustomize image..."
pushd  $ROOT_DIR/manifests/ui/base
kustomize edit set image ollama-ui=${IMG_UI_STANDALONE}

# Step 4: Deploy model registry UI
echo "Deploying Ollama UI..."
pushd  $ROOT_DIR/manifests/ui/overlays/standalone
kustomize edit set namespace kubeflow
kubectl apply -n kubeflow -k .

# Wait for deployment to be available
echo "Waiting Ollama UI to be available..."
kubectl wait --for=condition=available -n kubeflow deployment/ollama-ui --timeout=1m

# Step 5: Port-forward the service
echo "Port-forwarding Ollama UI..."
echo -e "\033[32mDashboard available in http://localhost:8080\033[0m"
kubectl port-forward svc/ollama-ui-service -n kubeflow 8080:8080
