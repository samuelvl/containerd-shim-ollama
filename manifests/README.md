# Install Kubeflow Ollama UI

This folder contains Ollama UI manifests for deploying the Ollama UI as a standalone component in Kubeflow.

## Ollama Shim Installation

Create a kind cluster with the `ollama` shim:

```shell
cd ..
make kind
```

Deploy your model using the `ollama-shim` runtime class:

```shell
cd manifests
kubectl create namespace ai-models
kubectl apply -n ai-models -f models/qwen2-model.yaml
```

## UI Installation

To install the Ollama UI as a Kubeflow component, you need first to deploy the Ollama UI:

```bash
kubectl apply -k ui/overlays/istio -n kubeflow
```

And then to make it accessible through Kubeflow Central Dashboard, you need to add the following to your Kubeflow Centradl Dashboard ConfigMap:

```bash
kubectl edit configmap -n kubeflow centraldashboard-config
```

```yaml
apiVersion: v1
data:
  links: |-
    {
        "menuLinks": [
            {
                "icon": "store",
                "link": "/ollama/",
                "text": "Ollama",
                "type": "item"
            },
            ...
```

Or you can add it in one line with:

```bash
kubectl get configmap centraldashboard-config -n kubeflow -o json | jq '.data.links |= (fromjson | .menuLinks += [{"icon": "store", "link": "/ollama/", "text": "Ollama", "type": "item"}] | tojson)' | kubectl apply -f - -n kubeflow
```
