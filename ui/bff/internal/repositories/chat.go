package repositories

import (
	"fmt"
)

type ChatRepository struct{}

func NewChatRepository() *ChatRepository {
	return &ChatRepository{}
}

func (m *ChatRepository) ResolveServerAddress(clusterIP string, httpPort int32) string {
	url := fmt.Sprintf("http://%s:%d/chat", clusterIP, httpPort)
	return url
}
