package model

import (
	"context"
	"net/url"
	"strings"
)

type NotificationRepository interface {
	Notify(ctx context.Context, webookUrl string, gameID uint32, text string, shouldContainUrl bool) error
}

// discordWebhookHosts は通知先として許可する Discord のホスト
var discordWebhookHosts = []string{
	"discord.com",
	"discordapp.com",
	"ptb.discord.com",
	"canary.discord.com",
}

// IsValidDiscordWebhookURL は通知先が Discord の Webhook URL か判定する。
// https で、Discord のホスト (ポート指定なし) の /api/webhooks/ 配下 (.. を含まない) だけを許可する。
func IsValidDiscordWebhookURL(rawURL string) bool {
	u, err := url.Parse(rawURL)
	if err != nil {
		return false
	}
	if u.Scheme != "https" || u.User != nil || u.Port() != "" {
		return false
	}
	isDiscordHost := false
	for _, h := range discordWebhookHosts {
		if strings.EqualFold(u.Hostname(), h) {
			isDiscordHost = true
			break
		}
	}
	return isDiscordHost &&
		strings.HasPrefix(u.EscapedPath(), "/api/webhooks/") &&
		!strings.Contains(u.EscapedPath(), "..")
}
