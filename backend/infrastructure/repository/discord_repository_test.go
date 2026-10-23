package repository_test

import (
	"bytes"
	"chat-role-play/infrastructure/repository"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

func TestNotify(t *testing.T) {
	var gotContentType string
	var gotBody map[string]any
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotContentType = r.Header.Get("Content-Type")
		body, _ := io.ReadAll(r.Body)
		json.Unmarshal(body, &gotBody)
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()

	repo := repository.NewNotificationRepositoryAllowingAnyURL()
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
	// メンションは一切解釈させない
	mentions, ok := gotBody["allowed_mentions"].(map[string]any)
	if !ok {
		t.Fatalf("allowed_mentions = %v", gotBody["allowed_mentions"])
	}
	if parse, ok := mentions["parse"].([]any); !ok || len(parse) != 0 {
		t.Errorf("allowed_mentions.parse = %v, want []", mentions["parse"])
	}
}

// 通知先が落ちていてもエラーにせず (通知は本質的な処理ではない)、呼び出し元を止めないこと。
func TestNotifyIgnoresUnreachableWebhook(t *testing.T) {
	// 一度起動して閉じたサーバーの URL = 接続拒否される宛先
	server := httptest.NewServer(http.NotFoundHandler())
	url := server.URL
	server.Close()

	repo := repository.NewNotificationRepositoryAllowingAnyURL()
	if err := repo.Notify(context.Background(), url, 1, "text", false); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

// Discord の Webhook URL 以外には送らないこと
func TestNotifySkipsNotAllowedURL(t *testing.T) {
	called := false
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
	}))
	defer server.Close()

	repo := repository.NewNotificationRepository()
	if err := repo.Notify(context.Background(), server.URL+"/api/webhooks/1/token", 1, "text", false); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if called {
		t.Errorf("notification was sent to a non-discord url")
	}
}

// リダイレクトには従わないこと
func TestNotifyDoesNotFollowRedirect(t *testing.T) {
	redirected := false
	target := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		redirected = true
	}))
	defer target.Close()
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, target.URL, http.StatusFound)
	}))
	defer server.Close()

	repo := repository.NewNotificationRepositoryAllowingAnyURL()
	if err := repo.Notify(context.Background(), server.URL, 1, "text", false); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if redirected {
		t.Errorf("redirect was followed")
	}
}

// 送信に失敗しても、ログに webhook URL (トークンを含む) を出さないこと
func TestNotifyDoesNotLogWebhookURL(t *testing.T) {
	server := httptest.NewServer(http.NotFoundHandler())
	url := server.URL + "/api/webhooks/1/secret-token"
	server.Close()

	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer log.SetOutput(os.Stderr)

	repo := repository.NewNotificationRepositoryAllowingAnyURL()
	repo.Notify(context.Background(), url, 1, "text", false)
	repository.NewNotificationRepository().Notify(context.Background(), url, 1, "text", false)

	if buf.Len() == 0 {
		t.Fatalf("want failure logs")
	}
	if strings.Contains(buf.String(), "secret-token") {
		t.Errorf("log contains webhook token: %s", buf.String())
	}
}
