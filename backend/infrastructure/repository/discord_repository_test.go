package repository_test

import (
	"chat-role-play/infrastructure/repository"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNotify(t *testing.T) {
	var gotContentType string
	var gotBody map[string]string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotContentType = r.Header.Get("Content-Type")
		body, _ := io.ReadAll(r.Body)
		json.Unmarshal(body, &gotBody)
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()

	repo := repository.NewNotificationRepository()
	if err := repo.Notify(context.Background(), server.URL, 1, "text", true); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if gotContentType != "application/json" {
		t.Errorf("Content-Type = %q, want application/json", gotContentType)
	}
	if gotBody["username"] != "ロールをプレイ！ ゲーム1通知" {
		t.Errorf("username = %q", gotBody["username"])
	}
	if gotBody["content"] != "text\nhttps://wolfort.dev/chat-role-play/games/1" {
		t.Errorf("content = %q", gotBody["content"])
	}
}

// 通知先が落ちていてもエラーにせず (通知は本質的な処理ではない)、呼び出し元を止めないこと。
func TestNotifyIgnoresUnreachableWebhook(t *testing.T) {
	// 一度起動して閉じたサーバーの URL = 接続拒否される宛先
	server := httptest.NewServer(http.NotFoundHandler())
	url := server.URL
	server.Close()

	repo := repository.NewNotificationRepository()
	if err := repo.Notify(context.Background(), url, 1, "text", false); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}
