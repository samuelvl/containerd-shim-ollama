Build the model:

```shell
docker buildx build --platform linux/arm64 --builder git-lfs --tag svlcastai/qwen2:0.5b --load .
```

Push the model:

```shell
docker push svlcastai/qwen2:0.5b
```
