package repository

import (
	"bytes"
	"chat-role-play/domain/model"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)

// notifyTimeout は Discord webhook 呼び出しの上限。Notify は DoInTx 内 (= プール接続を握ったまま) から
// 呼ばれるため、外部 API の無応答で接続を長時間占有しないよう短めにする。
const notifyTimeout = 10 * time.Second

type NotificationRepository struct {
	client *http.Client
	// isAllowedURL は送信してよい宛先か判定する (保存時の確認より前に登録された宛先にも送らないため)
	isAllowedURL func(string) bool
}

func NewNotificationRepository() *NotificationRepository {
	return &NotificationRepository{
		client: &http.Client{
			Timeout: notifyTimeout,
			// 許可した宛先以外に送らないよう、リダイレクトには従わない
			CheckRedirect: func(*http.Request, []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
		isAllowedURL: model.IsValidDiscordWebhookURL,
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
	// NOTE: webhook URL はトークンを含むため、ログには出さない
	if !nr.isAllowedURL(webhookUrl) {
		log.Printf("skip discord notification: webhook url is not allowed (game %d)", gameID)
		return nil
	}
	var discord Discord
	discord.Username = fmt.Sprintf("ロールをプレイ！ ゲーム%d通知", gameID)
	discord.Content = text
	// メンションは一切解釈させない
	discord.AllowedMentions = AllowedMentions{Parse: []string{}}

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
		log.Printf("failed to create discord notification request (game %d)", gameID)
		return nil
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := nr.client.Do(req)
	if err != nil {
		log.Printf("failed to notify discord (game %d): %v", gameID, withoutURL(err))
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

// withoutURL は *url.Error から URL を除いたエラーを返す (Error() が URL 全体を含むため)
func withoutURL(err error) error {
	var urlErr *url.Error
	if errors.As(err, &urlErr) {
		return fmt.Errorf("%s: %w", urlErr.Op, urlErr.Err)
	}
	return err
}

type Discord struct {
	Username        string          `json:"username"`
	AvatarUrl       string          `json:"avatar_url"`
	Content         string          `json:"content"`
	AllowedMentions AllowedMentions `json:"allowed_mentions"`
}

type AllowedMentions struct {
	Parse []string `json:"parse"`
}
