# containerd-shim-ollama

Deploy a containerd runtime shim for serving AI models with Ollama.

## Setup

Create a kind cluster with the `ollama` shim:

```shell
make kind
```

Deploy your model using the `ollama-shim` runtime class:

```shell
kubectl create namespace ai-models
kubectl apply -n ai-models -f ./tests/models/qwen2-model.yaml
```

Verify that the model is running:

```shell
kubectl wait --for=condition=available -n ai-models deployment/qwen2 --timeout=1m
```

Port-forward the model service to your local machine:

```shell
kubectl port-forward -n ai-models svc/qwen2 8080:80
```

Ask some questions to the model from your local machine (in a new terminal):

```shell
curl http://localhost:8080/api/generate -d '{
    "model": "qwen2:latest",
    "prompt": "What is the Kubecon?",
    "stream": false
}' | jq -r '.response'
```

## Troubleshooting

Connect to the kind node:

```shell
docker exec -it ollama-shim-control-plane bash
```

Inspect the logs of the containerd runtime to see the `ollama` shim in action:

```shell
journalctl -f -u containerd
```

Find the model from the image snapshot:

```shell
find /var/lib/containerd/ -name '*.gguf'
```

Start the model locally on the node:

```shell
ollama runner --port 8080 --ctx-size 8192 --model ${model}
```

## Clean-up

Delete the cluster to clean everything up:

```shell
make clean
```

## Links

- What is a shim?
    - https://iximiuz.com/en/posts/implementing-container-runtime-shim
- Containerd quickstart
    - https://gvisor.dev/docs/user_guide/containerd/quick_start
- Containerd runtime documentation
    - https://github.com/containerd/containerd/blob/main/core/runtime/v2/README.md
- Kind example
    - https://github.com/bluebrown/kind-wasmtime
- Digging into runc
    - https://blog.quarkslab.com/digging-into-runtimes-runc.html
