package mocks

import (
	"io"

	"github.com/stretchr/testify/mock"
)

type MockHTTPClient struct {
	mock.Mock
}

func (c *MockHTTPClient) GetOllamaID() string {
	return "ollama"
}

func (m *MockHTTPClient) GET(url string) ([]byte, error) {
	args := m.Called(url)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockHTTPClient) POST(url string, body io.Reader) ([]byte, error) {
	args := m.Called(url, body)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockHTTPClient) PATCH(url string, body io.Reader) ([]byte, error) {
	args := m.Called(url, body)
	return args.Get(0).([]byte), args.Error(1)
}
