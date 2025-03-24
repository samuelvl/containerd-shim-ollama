# Kubeflow Ollama UI BFF

The Kubeflow Ollama UI BFF is the _backend for frontend_ (BFF) used by the Kubeflow Ollama UI.

## Pre-requisites:

### Dependencies

- Go >= 1.23.5

# Development

Run the following command to build the BFF:

```shell
make build
```

After building it, you can run our app with:

```shell
make run
```

If you want to use a different port, mock kubernetes client or ollama server - useful for front-end development, you can run:

```shell
make run PORT=8000 MOCK_K8S_CLIENT=true MOCK_MR_CLIENT=true
```

If you want to change the log level on deployment, add the LOG_LEVEL argument when running, supported levels are: ERROR, WARN, INFO, DEBUG. The default level is INFO.

```shell
# Run with debug logging
make run LOG_LEVEL=DEBUG
```

# Building and Deploying

Run the following command to build the BFF:

```shell
make build
```

The BFF binary will be inside `bin` directory

You can also build BFF docker image with:

```shell
make docker-build
```

## Getting started

### Endpoints

See the [OpenAPI specification](../api/openapi/mod-arch.yaml) for a complete list of endpoints.

### FAQ

#### 1. What is the structure of the mock Kubernetes environment?

The mock Kubernetes environment is activated when the environment variable `MOCK_K8S_CLIENT` is set to `true`. It is based on `env-test` and is designed to simulate a realistic Kubernetes setup for testing. The mock has the following characteristics:

- **Namespaces**:

  - `kubeflow`
  - `dora-namespace`
  - `bella-namespace`

- **Users**:

  - `user@example.com` (has `cluster-admin` privileges)
  - `doraNonAdmin@example.com` (restricted to the `dora-namespace`)
  - `bellaNonAdmin@example.com` (restricted to the `bella-namespace`)

- **Groups**:
  - `dora-service-group` (has access to `ollama-dora` inside `dora-namespace`)
  - `dora-namespace-group` (has access to the `dora-namespace`)

#### 2. How BFF authorization works for kubeflow-userid and kubeflow-groups?

Authorization is performed using Kubernetes SubjectAccessReview (SAR), which validates user access to resources.

- `kubeflow-userid`: Required header that specifies the user’s email. Access is checked directly for the user via SAR.
- `kubeflow-groups`: Optional header with a comma-separated list of groups. If the user does not have access, SAR checks group permissions using OR logic. If any group has access, the request is authorized.

#### 3. How do I allow CORS requests from other origins

When serving the UI directly from the BFF there is no need for any CORS headers to be served, by default they are turned off for security reasons.

If you need to enable CORS for any reasons you can add origins to the allow-list in several ways:

##### Via the make command

Add the following parameter to your command: `ALLOWED_ORIGINS` this takes a comma separated list of origins to permit serving to, alterantively you can specify the value `*` to allow all origins, **Note this is not recommended in production deployments as it poses a security risk**

Examples:

```shell
# Allow only the origin http://example.com:8081
make run ALLOWED_ORIGINS="http://example.com:8081"

# Allow the origins http://example.com and http://very-nice.com
make run ALLOWED_ORIGINS="http://example.com,http://very-nice.com"

# Allow all origins
make run ALLOWED_ORIGINS="*"

# Explicitly disable CORS (default behaviour)
make run ALLOWED_ORIGINS=""
```

#### Via environment variable

Setting CORS via environment variable follows the same rules as using the Makefile, simply set the environment variable `ALLOWED_ORIGINS` with the same value as above.

#### Via the command line arguments

Setting CORS via command line arguments follows the same rules as using the Makefile. Simply add the `--allowed-origins=` flag to your command.

Examples:

```shell
./bff --allowed-origins="http://my-domain.com,http://my-other-domain.com"
```
