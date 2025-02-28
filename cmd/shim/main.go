package main

import (
	"context"

	"github.com/containerd/containerd/v2/pkg/shim"

	"github.com/samuelvl/servingc/pkg/shim/manager"
	_ "github.com/samuelvl/servingc/pkg/shim/task/plugin"
)

func main() {
	shim.Run(context.Background(), manager.NewShimManager("io.containerd.servingc.v2"))
}
