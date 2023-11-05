package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type NotificationRepository struct {
}

func NewNotificationRepository() *NotificationRepository {
	return &NotificationRepository{}
}

func (nr *NotificationRepository) Notify(
	webhookUrl string,
	gameID uint32,
	text string,
	shouldContainUrl bool,
) error {
	// NOTE: 通知は本質的な処理ではないので、エラーは握りつぶす
	var discord Discord
	discord.Username = fmt.Sprintf("ロールをプレイ！ ゲーム%d通知", gameID)
	discord.Content = text

	if shouldContainUrl {
		discord.Content += fmt.Sprintf("\nhttps://wolfort.dev/chat-role-play/games/%d", gameID)
	}

	discord_json, _ := json.Marshal(discord)
	res, _ := http.Post(
		webhookUrl,
		"application/json",
		bytes.NewBuffer(discord_json),
	)
	defer res.Body.Close()

	return nil
}

type Discord struct {
	Username  string `json:"username"`
	AvatarUrl string `json:"avatar_url"`
	Content   string `json:"content"`
}
