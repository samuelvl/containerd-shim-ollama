# Go command to use for build
GO      ?= go
INSTALL ?= install

# Root directory of the project (absolute path)
ROOTDIR = $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# Base path used to install
BINDIR ?= $(ROOTDIR)/.bin
MANIFESTDIR ?= $(ROOTDIR)/manifests

# Go build flags
GO_FLAGS ?= CGO_ENABLED=0 GOOS=linux
GO_SUPPORTED_ARCH = amd64 arm64
GO_ARCH = $(shell go env GOARCH)

# Kind flags
KIND ?= kind
KIND_CLUSTER_NAME ?= ollama-shim

KUBECTL ?= kubectl

# Docker flags
DOCKER ?= docker

# Other commands
CURL  ?= curl
UNZIP ?= unzip

build: $(foreach arch,$(GO_SUPPORTED_ARCH),build-shim-$(arch))

build-shim-%:
	$(GO_FLAGS) GOARCH=$* $(GO) build -o $(BINDIR)/containerd-shim-ollama-$* cmd/shim/main.go

clean-build:
	rm -rf $(BINDIR)

kind: kind-setup kind-shim-install kind-ollama-install

kind-setup:
	$(KIND) create cluster --name $(KIND_CLUSTER_NAME) --config $(MANIFESTDIR)/kind/cluster.yaml

kind-shim-install: build
    # Copy the ollama shim binary to the control plane node
	@echo "\033[32mCopying Ollama Shim binary to control plane node...\033[0m"
	$(DOCKER) cp $(BINDIR)/containerd-shim-ollama-$(GO_ARCH) \
		$(KIND_CLUSTER_NAME)-control-plane:/usr/bin/containerd-shim-ollama-v2
	@echo "\033[32mCreate the runtime class for Ollama's shim\033[0m"
    # Create the runtime class for the ollama shim
	$(KUBECTL) apply -f $(MANIFESTDIR)/ollama-shim/runtime-class.yaml

kind-ollama-install:
ifeq ("$(wildcard $(BINDIR)/bin/ollama)","")	
    # Download and extract ollama from github releases
	@echo "\033[32mDownload and extract ollama from github releases...\033[0m"
	$(CURL) --fail --show-error --location --progress-bar \
    	"https://ollama.com/download/ollama-linux-arm64.tgz?version=0.5.13" | tar -xzf - -C $(BINDIR)
endif
    # Copy the ollama binary to the control plane node
	@echo "\033[32mCopying ollama binary to the control plane node...\033[0m"
	$(DOCKER) cp $(BINDIR)/bin/ollama $(KIND_CLUSTER_NAME)-control-plane:/usr/bin/ollama

kind-delete:
	$(KIND) delete cluster --name $(KIND_CLUSTER_NAME)

.PHONY: ui-deployment-standalone
ui-deployment-standalone:
	./ui/scripts/deploy_ui_standalone.sh

.PHONY: ui-deployment-kubeflow
ui-deployment-kubeflow:
	./ui/scripts/deploy_ui_kubeflow.sh

clean: kind-delete clean-build
