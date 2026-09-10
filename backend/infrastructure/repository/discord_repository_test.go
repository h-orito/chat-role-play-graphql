package repository_test

import (
	"chat-role-play/domain/model"
	"chat-role-play/infrastructure/repository"
	"context"
	"testing"
)

func newNotificationRepository() model.NotificationRepository {
	return repository.NewNotificationRepository()
}

func TestNotify(t *testing.T) {
	repo := newNotificationRepository()
	err := repo.Notify(context.Background(),
		"local webhook url",
		1,
		"text",
		true,
	)
	if err != nil {
		t.Errorf("failed to find player: %s", err)
	}
}
