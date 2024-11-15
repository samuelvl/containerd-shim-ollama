# servingc

Deploy a containerd runtime shim for serving AI models with Ollama.

## Setup

Create a kind cluster with the `servingc` runtime:

```shell
make kind
```

Deploy your model using the `servingc-shim` runtime class:

```shell
kubectl create namespace ai-models
kubectl apply -n ai-models -f tests/models/test-model.yaml
```

Verify that the model is running:

```shell
kubectl get pods -n ai-models
```

## Troubleshooting

Connect to the kind node:

```shell
docker exec -it servingc-control-plane bash
```

Inspect the logs of the containerd runtime to see the `servingc` runtime in action:

```shell
journalctl -f -u containerd
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
