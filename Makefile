# Go command to use for build
GO      ?= go
INSTALL ?= install

# Root directory of the project (absolute path)
ROOTDIR = $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# Base path used to install
BINDIR ?= $(ROOTDIR)/.bin
TESTDIR ?= $(ROOTDIR)/tests

# Go build flags
GO_FLAGS ?= CGO_ENABLED=0 GOOS=linux
GO_SUPPORTED_ARCH = amd64 arm64
GO_ARCH = $(shell go env GOARCH)

# Kind flags
KIND ?= kind
KIND_CLUSTER_NAME ?= servingc
KUBECTL ?= kubectl

# Docker flags
DOCKER ?= docker

# Other commands
CURL  ?= curl
UNZIP ?= unzip

build: $(foreach arch,$(GO_SUPPORTED_ARCH),build-shim-$(arch))

build-shim-%:
	$(GO_FLAGS) GOARCH=$* $(GO) build -o $(BINDIR)/containerd-shim-servingc-$* cmd/shim/main.go

clean-build:
	rm -rf $(BINDIR)

kind: kind-setup kind-shim-install kind-llamacpp-install

kind-setup:
	$(KIND) create cluster --name $(KIND_CLUSTER_NAME) --config $(TESTDIR)/kind/cluster.yaml

kind-shim-install: build
    # Copy the servingc shim binary to the control plane node
	$(DOCKER) cp $(BINDIR)/containerd-shim-servingc-$(GO_ARCH) \
		$(KIND_CLUSTER_NAME)-control-plane:/usr/bin/containerd-shim-servingc-v2
    # Create the runtime class for the servingc shim
	$(KUBECTL) apply -f $(TESTDIR)/servingc/runtime-class.yaml

kind-llamacpp-install:
    # Download and extract llama.cpp from github releases
	$(CURL) --fail --show-error --location --progress-bar \
        https://github.com/ggml-org/llama.cpp/releases/download/b4793/llama-b4793-bin-ubuntu-arm64.zip \
        --output $(BINDIR)/llama.cpp.zip
	$(UNZIP) -o $(BINDIR)/llama.cpp.zip -d $(BINDIR)/lamma.cpp
    # Copy the shared libraries to the control plane node
	for lib in libllama.so libllava_shared.so libggml-base.so libggml-cpu.so libggml.so libggml-rpc.so; do \
		$(DOCKER) cp $(BINDIR)/lamma.cpp/build/bin/$$lib \
			$(KIND_CLUSTER_NAME)-control-plane:/usr/local/lib/$$lib; \
	done
    # Copy the llama-server binary to the control plane node
	$(DOCKER) cp $(BINDIR)/lamma.cpp/build/bin/llama-server \
		$(KIND_CLUSTER_NAME)-control-plane:/usr/bin/llama-server
    # Run ldconfig to update the shared library cache
	$(DOCKER) exec $(KIND_CLUSTER_NAME)-control-plane ldconfig
    # Install libgomp1 dependency
	$(DOCKER) exec $(KIND_CLUSTER_NAME)-control-plane clean-install libgomp1

kind-delete:
	$(KIND) delete cluster --name $(KIND_CLUSTER_NAME)

clean: kind-delete clean-build
