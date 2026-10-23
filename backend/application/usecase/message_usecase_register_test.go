package usecase

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
	"testing"
)

func newRegisterMessageTestUsecase(status model.GameStatus) *messageUsecase {
	u := newDirectMessageTestUsecase(false)
	gs := u.gameService.(*fakeGameService)
	gs.game.Status = status
	gs.game.Periods = []model.GamePeriod{{ID: 1}}
	u.messageDomainService = dom_service.NewMessageDomainService(dom_service.NewGameMasterDomainService())
	return u
}

func TestRegisterDirectMessagePermission(t *testing.T) {
	cases := []struct {
		name    string
		user    string
		status  model.GameStatus
		msgType model.MessageType
		groupID uint32
		ok      bool
	}{
		{"グループのメンバーは発言できる", "member", model.GameStatusProgress, model.MessageTypeTalkNormal, dmTestGroupID, true},
		{"同じゲームの非メンバーは発言できない", "outsider", model.GameStatusProgress, model.MessageTypeTalkNormal, dmTestGroupID, false},
		{"ゲーム未参加者は発言できない", "stranger", model.GameStatusProgress, model.MessageTypeTalkNormal, dmTestGroupID, false},
		{"GM でもメンバーでなければ通常発言はできない", "gm", model.GameStatusProgress, model.MessageTypeTalkNormal, dmTestGroupID, false},
		{"存在しないグループには発言できない", "member", model.GameStatusProgress, model.MessageTypeTalkNormal, 999, false},
		{"終了したゲームではメンバーでも発言できない", "member", model.GameStatusFinished, model.MessageTypeTalkNormal, dmTestGroupID, false},
		{"メンバーでも GM でなければシステム発言はできない", "member", model.GameStatusProgress, model.MessageTypeSystemPublic, dmTestGroupID, false},
		{"ゲーム未参加者はシステム発言できない", "stranger", model.GameStatusProgress, model.MessageTypeSystemPrivate, dmTestGroupID, false},
		{"GM はシステム発言できる", "gm", model.GameStatusProgress, model.MessageTypeSystemPublic, dmTestGroupID, true},
		{"管理者はシステム発言できる", "admin", model.GameStatusProgress, model.MessageTypeSystemPrivate, dmTestGroupID, true},
		{"プレイヤー未登録のユーザーは発言できない", "unknown", model.GameStatusProgress, model.MessageTypeTalkNormal, dmTestGroupID, false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			u := newRegisterMessageTestUsecase(c.status)
			msg := model.DirectMessage{
				GameParticipantGroupID: c.groupID,
				Type:                   c.msgType,
				Sender:                 &model.MessageSender{SenderName: "name"},
			}
			got, err := u.RegisterDirectMessageDryRun(context.Background(), dmTestGameID, model.User{UserName: c.user}, msg)
			if c.ok && (err != nil || got == nil) {
				t.Errorf("want ok, got %v, err=%v", got, err)
			}
			if !c.ok && err == nil {
				t.Errorf("want error, got %v", got)
			}
		})
	}
}

func TestRegisterMessagePermission(t *testing.T) {
	cases := []struct {
		name    string
		user    string
		status  model.GameStatus
		msgType model.MessageType
		ok      bool
	}{
		{"参加者は発言できる", "member", model.GameStatusProgress, model.MessageTypeTalkNormal, true},
		{"ゲーム未参加者は発言できない", "stranger", model.GameStatusProgress, model.MessageTypeTalkNormal, false},
		{"終了したゲームでは参加者も発言できない", "member", model.GameStatusFinished, model.MessageTypeTalkNormal, false},
		{"参加者でも GM でなければシステム発言はできない", "member", model.GameStatusProgress, model.MessageTypeSystemPublic, false},
		{"ゲーム未参加者はシステム発言できない", "stranger", model.GameStatusProgress, model.MessageTypeSystemPrivate, false},
		{"GM はシステム発言できる", "gm", model.GameStatusProgress, model.MessageTypeSystemPublic, true},
		{"GM は終了したゲームでもシステム発言できる", "gm", model.GameStatusFinished, model.MessageTypeSystemPublic, true},
		{"管理者はシステム発言できる", "admin", model.GameStatusProgress, model.MessageTypeSystemPrivate, true},
		{"プレイヤー未登録のユーザーは発言できない", "unknown", model.GameStatusProgress, model.MessageTypeSystemPublic, false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			u := newRegisterMessageTestUsecase(c.status)
			msg := model.Message{
				Type:   c.msgType,
				Sender: &model.MessageSender{SenderName: "name"},
			}
			got, err := u.RegisterMessageDryRun(context.Background(), dmTestGameID, model.User{UserName: c.user}, msg)
			if c.ok && (err != nil || got == nil) {
				t.Errorf("want ok, got %v, err=%v", got, err)
			}
			if !c.ok && err == nil {
				t.Errorf("want error, got %v", got)
			}
		})
	}
}
