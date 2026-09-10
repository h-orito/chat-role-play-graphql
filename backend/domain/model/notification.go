package model

import "context"

type NotificationRepository interface {
	Notify(ctx context.Context, webookUrl string, gameID uint32, text string, shouldContainUrl bool) error
}
