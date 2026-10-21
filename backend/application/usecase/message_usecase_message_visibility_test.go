package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
	"testing"
)

// 発言 (秘話・独り言など) の取得用。必要なメソッドだけ実装する
type fakeMessageServiceForMessages struct {
	app_service.MessageService
	messages []model.Message
	replies  map[uint64][]uint64 // 発言 ID -> 返信の発言 ID
}

func (f *fakeMessageServiceForMessages) find(ID uint64) *model.Message {
	for _, m := range f.messages {
		if m.ID == ID {
			msg := m
			return &msg
		}
	}
	return nil
}

func (f *fakeMessageServiceForMessages) FindMessage(_ context.Context, _ uint32, ID uint64) (*model.Message, error) {
	return f.find(ID), nil
}

// リポジトリと同じく種別で絞り込まずに返信を返す
func (f *fakeMessageServiceForMessages) FindMessageReplies(_ context.Context, _ uint32, messageID uint64, _ *model.GameParticipant) ([]model.Message, error) {
	var list []model.Message
	for _, id := range f.replies[messageID] {
		list = append(list, *f.find(id))
	}
	return list, nil
}

// リポジトリと同じく種別で絞り込まずにスレッド (自身 + 返信) を返す
func (f *fakeMessageServiceForMessages) FindThreadMessages(ctx context.Context, gameID uint32, messageID uint64, myself *model.GameParticipant) ([]model.Message, error) {
	replies, _ := f.FindMessageReplies(ctx, gameID, messageID, myself)
	return append([]model.Message{*f.find(messageID)}, replies...), nil
}

func (f *fakeMessageServiceForMessages) FindMessageFavoriteGameParticipants(_ context.Context, _ uint32, _ uint64) (model.GameParticipants, error) {
	return model.GameParticipants{List: []model.GameParticipant{{ID: 1}}}, nil
}

const (
	msgTalk           uint64 = 1001 // 通常発言 (参加者 2)
	msgMyMonologue    uint64 = 1002 // 参加者 1 の独り言
	msgSecretTo2      uint64 = 1003 // 参加者 1 → 2 の秘話
	msgSecretTo9      uint64 = 1004 // 参加者 2 → 9 の秘話
	msgSystemPrivate  uint64 = 1005 // 個別のシステムメッセージ
	msgOtherMonologue uint64 = 1006 // 参加者 2 の独り言
)

func newMessageVisibilityTestUsecase(status model.GameStatus, viewAll bool) *messageUsecase {
	game := model.Game{
		ID:          dmTestGameID,
		Status:      status,
		GameMasters: []model.GameMaster{{ID: 1, PlayerID: 3}},
	}
	game.Settings.Rule.IsGameMasterViewAllMessages = viewAll
	sender := func(id uint32) *model.MessageSender { return &model.MessageSender{GameParticipantID: id} }
	receiver := func(id uint32) *model.MessageReceiver { return &model.MessageReceiver{GameParticipantID: id} }
	return &messageUsecase{
		messageService: &fakeMessageServiceForMessages{
			messages: []model.Message{
				{ID: msgTalk, Type: model.MessageTypeTalkNormal, Sender: sender(2)},
				{ID: msgMyMonologue, Type: model.MessageTypeMonologue, Sender: sender(1)},
				{ID: msgSecretTo2, Type: model.MessageTypeSecret, Sender: sender(1), Receiver: receiver(2)},
				{ID: msgSecretTo9, Type: model.MessageTypeSecret, Sender: sender(2), Receiver: receiver(9)},
				{ID: msgSystemPrivate, Type: model.MessageTypeSystemPrivate},
				{ID: msgOtherMonologue, Type: model.MessageTypeMonologue, Sender: sender(2)},
			},
			replies: map[uint64][]uint64{
				msgTalk:      {msgMyMonologue, msgSecretTo2, msgSecretTo9, msgSystemPrivate, msgOtherMonologue},
				msgSecretTo9: {msgTalk},
			},
		},
		gameService: &fakeGameService{
			game:         game,
			participants: map[uint32]model.GameParticipant{1: {ID: 1}, 2: {ID: 2}},
		},
		playerService: &fakePlayerService{
			players: map[string]model.Player{
				"member":  {ID: 1},
				"member2": {ID: 2},
				"gm":      {ID: 3},
				"admin":   {ID: 4},
			},
			authorities: map[uint32][]model.PlayerAuthority{4: {model.AuthorityAdmin}},
		},
		messageDomainService:    dom_service.NewMessageDomainService(dom_service.NewGameMasterDomainService()),
		gameMasterDomainService: dom_service.NewGameMasterDomainService(),
	}
}

var allTestMessageIDs = []uint64{msgTalk, msgMyMonologue, msgSecretTo2, msgSecretTo9, msgSystemPrivate, msgOtherMonologue}

func visibilityCases() []struct {
	name     string
	user     *model.User
	status   model.GameStatus
	viewAll  bool
	viewable []uint64
} {
	return []struct {
		name     string
		user     *model.User
		status   model.GameStatus
		viewAll  bool
		viewable []uint64
	}{
		// 判定ルールの細かいケースはドメインサービスのテスト (message_domain_service_view_test.go) で確認する。
		// ここでは閲覧者の情報 (参加者・プレイヤー・権限・ゲーム) が判定に渡っていることを確認する
		{"未ログインは通常発言だけ", nil, model.GameStatusProgress, true, []uint64{msgTalk}},
		{"参加者は自分の独り言と自分が送った秘話も見られる", &model.User{UserName: "member"}, model.GameStatusProgress, false, []uint64{msgTalk, msgMyMonologue, msgSecretTo2}},
		{"GM は全発言閲覧 ON なら全部見られる", &model.User{UserName: "gm"}, model.GameStatusProgress, true, allTestMessageIDs},
		{"管理者は全部見られる", &model.User{UserName: "admin"}, model.GameStatusProgress, false, allTestMessageIDs},
	}
}

func containsUint64(ids []uint64, id uint64) bool {
	for _, i := range ids {
		if i == id {
			return true
		}
	}
	return false
}

func messageIDs(messages []model.Message) []uint64 {
	ids := []uint64{}
	for _, m := range messages {
		ids = append(ids, m.ID)
	}
	return ids
}

func TestFindMessageVisibility(t *testing.T) {
	ctx := context.Background()
	for _, c := range visibilityCases() {
		t.Run(c.name, func(t *testing.T) {
			u := newMessageVisibilityTestUsecase(c.status, c.viewAll)
			for _, id := range allTestMessageIDs {
				m, err := u.FindMessage(ctx, dmTestGameID, id, c.user)
				if err != nil {
					t.Fatalf("FindMessage(%d): %v", id, err)
				}
				if want := containsUint64(c.viewable, id); (m != nil) != want {
					t.Errorf("FindMessage(%d): viewable=%v, want %v", id, m != nil, want)
				}
				_, err = u.FindMessageFavoriteGameParticipants(ctx, dmTestGameID, id, c.user)
				if want := containsUint64(c.viewable, id); (err == nil) != want {
					t.Errorf("FindMessageFavoriteGameParticipants(%d): err=%v, want viewable=%v", id, err, want)
				}
			}
		})
	}
}

func TestFindMessageRepliesAndThreadVisibility(t *testing.T) {
	ctx := context.Background()
	for _, c := range visibilityCases() {
		t.Run(c.name, func(t *testing.T) {
			u := newMessageVisibilityTestUsecase(c.status, c.viewAll)

			replies, err := u.FindMessageReplies(ctx, dmTestGameID, msgTalk, c.user)
			if err != nil {
				t.Fatal(err)
			}
			for _, id := range messageIDs(replies) {
				if !containsUint64(c.viewable, id) {
					t.Errorf("FindMessageReplies returned hidden message %d", id)
				}
			}
			wantReplies := 0
			for _, id := range []uint64{msgMyMonologue, msgSecretTo2, msgSecretTo9, msgSystemPrivate, msgOtherMonologue} {
				if containsUint64(c.viewable, id) {
					wantReplies++
				}
			}
			if len(replies) != wantReplies {
				t.Errorf("FindMessageReplies: got %v, want %d messages", messageIDs(replies), wantReplies)
			}

			thread, err := u.FindThreadMessages(ctx, dmTestGameID, msgTalk, c.user)
			if err != nil {
				t.Fatal(err)
			}
			if len(thread) != wantReplies+1 {
				t.Errorf("FindThreadMessages: got %v, want %d messages", messageIDs(thread), wantReplies+1)
			}
			for _, id := range messageIDs(thread) {
				if !containsUint64(c.viewable, id) {
					t.Errorf("FindThreadMessages returned hidden message %d", id)
				}
			}

			// 閲覧できない発言の返信一覧・スレッドは返さない
			hiddenReplies, _ := u.FindMessageReplies(ctx, dmTestGameID, msgSecretTo9, c.user)
			hiddenThread, _ := u.FindThreadMessages(ctx, dmTestGameID, msgSecretTo9, c.user)
			if hiddenReplies == nil || hiddenThread == nil {
				t.Errorf("replies / thread must not be nil (non-null list in GraphQL schema)")
			}
			if !containsUint64(c.viewable, msgSecretTo9) && (len(hiddenReplies) != 0 || len(hiddenThread) != 0) {
				t.Errorf("hidden root returned replies=%v thread=%v", messageIDs(hiddenReplies), messageIDs(hiddenThread))
			}
		})
	}
}

// 誰でも見られる種別の発言は、閲覧判定のためにゲームを読み込まない (返信プレビューで返信ごとに呼ばれるため)
type countingGameService struct {
	*fakeGameService
	findGameCount int
}

func (f *countingGameService) FindGame(ctx context.Context, ID uint32) (*model.Game, error) {
	f.findGameCount++
	return f.fakeGameService.FindGame(ctx, ID)
}

func TestFindMessageSkipsVisibilityCheckForPublicTypes(t *testing.T) {
	u := newMessageVisibilityTestUsecase(model.GameStatusProgress, false)
	gs := &countingGameService{fakeGameService: u.gameService.(*fakeGameService)}
	u.gameService = gs

	if m, _ := u.FindMessage(context.Background(), dmTestGameID, msgTalk, nil); m == nil {
		t.Fatal("public message must be returned")
	}
	if gs.findGameCount != 0 {
		t.Errorf("FindGame called %d times for a public message", gs.findGameCount)
	}
	if m, _ := u.FindMessage(context.Background(), dmTestGameID, msgSecretTo9, nil); m != nil {
		t.Fatal("secret message must be hidden")
	}
	if gs.findGameCount == 0 {
		t.Errorf("FindGame must be called to check a hidden-type message")
	}
}
