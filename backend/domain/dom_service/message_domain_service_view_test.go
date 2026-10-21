package dom_service_test

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"testing"
)

// 参加者 1 / 2 が参加、プレイヤー 3 が GM、プレイヤー 4 が管理者
func viewTestMessages() map[string]model.Message {
	sender := func(id uint32) *model.MessageSender { return &model.MessageSender{GameParticipantID: id} }
	receiver := func(id uint32) *model.MessageReceiver { return &model.MessageReceiver{GameParticipantID: id} }
	return map[string]model.Message{
		"通常発言":        {Type: model.MessageTypeTalkNormal, Sender: sender(2)},
		"ト書き":         {Type: model.MessageTypeDescription, Sender: sender(2)},
		"公開システム":      {Type: model.MessageTypeSystemPublic},
		"参加者1の独り言":    {Type: model.MessageTypeMonologue, Sender: sender(1)},
		"参加者2の独り言":    {Type: model.MessageTypeMonologue, Sender: sender(2)},
		"参加者1から2への秘話": {Type: model.MessageTypeSecret, Sender: sender(1), Receiver: receiver(2)},
		"参加者2から9への秘話": {Type: model.MessageTypeSecret, Sender: sender(2), Receiver: receiver(9)},
		"個別システム":      {Type: model.MessageTypeSystemPrivate, Receiver: receiver(1)},
	}
}

func TestCanViewMessage(t *testing.T) {
	svc := dom_service.NewMessageDomainService(dom_service.NewGameMasterDomainService())
	participant := func(id uint32) *model.GameParticipant { return &model.GameParticipant{ID: id} }
	player := func(id uint32) *model.Player { return &model.Player{ID: id} }
	admin := []model.PlayerAuthority{model.AuthorityAdmin}
	public := []string{"通常発言", "ト書き", "公開システム"}
	all := []string{"通常発言", "ト書き", "公開システム", "参加者1の独り言", "参加者2の独り言", "参加者1から2への秘話", "参加者2から9への秘話", "個別システム"}
	with := func(base []string, extra ...string) []string { return append(append([]string{}, base...), extra...) }

	cases := []struct {
		name        string
		status      model.GameStatus
		viewAll     bool
		myself      *model.GameParticipant
		player      *model.Player
		authorities []model.PlayerAuthority
		viewable    []string
	}{
		{"未ログインは公開の種別だけ", model.GameStatusProgress, true, nil, nil, nil, public},
		{"参加者1は自分の独り言と自分が送った秘話も", model.GameStatusProgress, false, participant(1), player(1), nil, with(public, "参加者1の独り言", "参加者1から2への秘話")},
		{"参加者2は自分の独り言と送った・受け取った秘話も", model.GameStatusProgress, false, participant(2), player(2), nil, with(public, "参加者2の独り言", "参加者1から2への秘話", "参加者2から9への秘話")},
		{"個別システムは宛先の参加者でも見られない", model.GameStatusProgress, false, participant(1), player(1), nil, with(public, "参加者1の独り言", "参加者1から2への秘話")},
		{"GM は全発言閲覧 OFF なら公開の種別だけ", model.GameStatusProgress, false, nil, player(3), nil, public},
		{"GM は全発言閲覧 ON なら全部", model.GameStatusProgress, true, nil, player(3), nil, all},
		{"GM でない人は全発言閲覧 ON でも公開の種別だけ", model.GameStatusProgress, true, nil, player(5), nil, public},
		{"管理者は全部", model.GameStatusProgress, false, nil, player(4), admin, all},
		{"エピローグなら未ログインでも全部", model.GameStatusEpilogue, false, nil, nil, nil, all},
		{"終了後なら未ログインでも全部", model.GameStatusFinished, false, nil, nil, nil, all},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			game := model.Game{Status: c.status, GameMasters: []model.GameMaster{{PlayerID: 3}}}
			game.Settings.Rule.IsGameMasterViewAllMessages = c.viewAll
			for name, message := range viewTestMessages() {
				want := false
				for _, v := range c.viewable {
					want = want || v == name
				}
				if got := svc.CanViewMessage(game, message, c.myself, c.player, c.authorities); got != want {
					t.Errorf("%s: got %v, want %v", name, got, want)
				}
			}
		})
	}
}

func TestGetViewableMessageTypesWithoutPlayerIsPublicTypes(t *testing.T) {
	// 通知 (notify_service) は player なしで「誰でも見られる種別」を求める
	svc := dom_service.NewMessageDomainService(dom_service.NewGameMasterDomainService())
	game := model.Game{Status: model.GameStatusProgress, GameMasters: []model.GameMaster{{PlayerID: 3}}}
	game.Settings.Rule.IsGameMasterViewAllMessages = true
	got := svc.GetViewableMessageTypes(game, nil, []model.PlayerAuthority{})
	if len(got) != len(model.MesssageTypeEveryoneViewableValues()) {
		t.Errorf("got %v, want public types", got)
	}
}
