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

build: $(foreach arch,$(GO_SUPPORTED_ARCH),build-shim-$(arch))

build-shim-%:
	$(GO_FLAGS) GOARCH=$* $(GO) build -o $(BINDIR)/containerd-shim-servingc-$* cmd/shim/main.go

clean-build:
	rm -rf $(BINDIR)

kind: kind-setup kind-shim-install

kind-setup:
	$(KIND) create cluster --name $(KIND_CLUSTER_NAME) --config $(TESTDIR)/kind/cluster.yaml

kind-shim-install: build
	$(DOCKER) cp $(BINDIR)/containerd-shim-servingc-$(GO_ARCH) \
		$(KIND_CLUSTER_NAME)-control-plane:/usr/bin/containerd-shim-servingc-v2
	$(KUBECTL) apply -f $(TESTDIR)/servingc/runtime-class.yaml

kind-delete:
	$(KIND) delete cluster --name $(KIND_CLUSTER_NAME)

clean: kind-delete clean-build
