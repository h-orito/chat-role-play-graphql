package model

type NotificationRepository interface {
	Notify(webookUrl string, gameID uint32, text string, shouldContainUrl bool) error
}
