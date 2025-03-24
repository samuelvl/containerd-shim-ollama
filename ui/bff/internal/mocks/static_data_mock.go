package mocks

import (
	"context"
	"log/slog"
	"os"

	"github.com/google/uuid"
	"github.com/kubeflow/ollama/ui/bff/internal/constants"
)

func NewMockSessionContext(parent context.Context) context.Context {
	if parent == nil {
		parent = context.TODO()
	}
	traceId := uuid.NewString()
	ctx := context.WithValue(parent, constants.TraceIdKey, traceId)

	traceLogger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	ctx = context.WithValue(ctx, constants.TraceLoggerKey, traceLogger)
	return ctx
}

func NewMockSessionContextNoParent() context.Context {
	return NewMockSessionContext(context.TODO())
}
