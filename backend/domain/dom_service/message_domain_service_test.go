package dom_service_test

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"log"
	"testing"
)

func TestReplaceRandomMessageText(t *testing.T) {
	// text := "[[2d6]or[3d6]][[fortune]or[fortune]][AAAorBBB]"
	// text := "[[2d6]or[2d6]]"
	text := "[AorB]"
	// text := "[kusodeka]aaaa[/kusodeka]"
	game := model.Game{}
	mes := model.MessageContent{
		Text:              text,
		IsConvertDisabled: false,
	}
	svc := dom_service.NewMessageDomainService()
	got, err := svc.ReplaceRandomMessageText(game, mes)
	if err != nil {
		t.Errorf("failed to replace random message text: %s", err)
	}
	if got.Text == "" || got.Text == text {
		t.Errorf("got nil, want message")
	}
	log.Printf("got: %s", got.Text)
}
