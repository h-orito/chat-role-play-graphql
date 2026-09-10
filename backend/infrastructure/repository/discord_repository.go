package repository

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// notifyTimeout は Discord webhook 呼び出しの上限。Notify は DoInTx 内 (= プール接続を握ったまま) から
// 呼ばれるため、外部 API の無応答で接続を長時間占有しないよう短めにする。
const notifyTimeout = 10 * time.Second

type NotificationRepository struct {
	client *http.Client
}

func NewNotificationRepository() *NotificationRepository {
	return &NotificationRepository{
		client: &http.Client{Timeout: notifyTimeout},
	}
}

func (nr *NotificationRepository) Notify(
	ctx context.Context,
	webhookUrl string,
	gameID uint32,
	text string,
	shouldContainUrl bool,
) error {
	// NOTE: 通知は本質的な処理ではないので、エラーはログに残して握りつぶす
	var discord Discord
	discord.Username = fmt.Sprintf("ロールをプレイ！ ゲーム%d通知", gameID)
	discord.Content = text

	if shouldContainUrl {
		discord.Content += fmt.Sprintf("\nhttps://wolfort.dev/chat-role-play/games/%d", gameID)
	}

	discordJson, err := json.Marshal(discord)
	if err != nil {
		log.Printf("failed to marshal discord notification: %v", err)
		return nil
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhookUrl, bytes.NewBuffer(discordJson))
	if err != nil {
		log.Printf("failed to create discord notification request: %v", err)
		return nil
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := nr.client.Do(req)
	if err != nil {
		log.Printf("failed to notify discord: %v", err)
		return nil
	}
	defer res.Body.Close()
	// body を読み切らないと keep-alive 接続が再利用されない
	io.Copy(io.Discard, res.Body)
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		log.Printf("discord webhook returned status %d (game %d)", res.StatusCode, gameID)
	}

	return nil
}

type Discord struct {
	Username  string `json:"username"`
	AvatarUrl string `json:"avatar_url"`
	Content   string `json:"content"`
}
