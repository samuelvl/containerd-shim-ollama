package main

import (
	"context"

	"github.com/containerd/containerd/v2/pkg/shim"

	"github.com/samuelvl/containerd-shim-runc/pkg/shim/manager"
	_ "github.com/samuelvl/containerd-shim-runc/pkg/shim/task/plugin"
)

func main() {
	shim.Run(context.Background(), manager.NewShimManager("io.containerd.ollama.v2"))
}
