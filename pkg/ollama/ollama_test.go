package ollama_test

import (
	"net"
	"testing"

	"github.com/ollama/ollama/envconfig"
	"github.com/ollama/ollama/server"
	"github.com/stretchr/testify/assert"
)

func TestOllamaServer(t *testing.T) {
	ln, err := net.Listen("tcp", envconfig.Host().Host)
	assert.NoError(t, err)

	err = server.Serve(ln)
	assert.NoError(t, err)
}
