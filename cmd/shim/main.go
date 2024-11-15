package main

import (
	"context"

	"github.com/containerd/containerd/runtime/v2/shim"

	"github.com/samuelvl/servingc/pkg/shim/manager"
	_ "github.com/samuelvl/servingc/pkg/shim/task/plugin"
)

func main() {
	shim.RunManager(context.Background(), manager.NewShimManager("io.containerd.servingc.v2"))
}
