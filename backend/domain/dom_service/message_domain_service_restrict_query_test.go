package dom_service_test

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"testing"
)

func newRestrictQueryTestService() dom_service.MessageDomainService {
	return dom_service.NewMessageDomainService(dom_service.NewGameMasterDomainService())
}

func TestRestrictMessagesQueryDuplicatedTypesDoNotBypassFilter(t *testing.T) {
	svc := newRestrictQueryTestService()
	// 閲覧可能なタイプを重複させて件数を全タイプ数 (6) に揃え、非公開タイプを混ぜる
	requested := []model.MessageType{
		model.MessageTypeTalkNormal, model.MessageTypeTalkNormal, model.MessageTypeTalkNormal,
		model.MessageTypeTalkNormal, model.MessageTypeTalkNormal, model.MessageTypeTalkNormal,
		model.MessageTypeSecret, model.MessageTypeMonologue, model.MessageTypeSystemPrivate,
	}
	got := svc.RestrictMessagesQuery(model.Game{Status: model.GameStatusProgress}, model.MessagesQuery{Types: &requested}, nil, nil, nil)
	if got.Types == nil {
		t.Fatalf("type filter must not be removed")
	}
	if len(*got.Types) != 1 || (*got.Types)[0] != model.MessageTypeTalkNormal {
		t.Errorf("want [TalkNormal], got %v", *got.Types)
	}
}

func TestRestrictMessagesQueryFiltersHiddenTypes(t *testing.T) {
	svc := newRestrictQueryTestService()
	got := svc.RestrictMessagesQuery(model.Game{Status: model.GameStatusProgress}, model.MessagesQuery{}, nil, nil, nil)
	if got.Types == nil {
		t.Fatalf("type filter must not be removed")
	}
	if len(*got.Types) != len(model.MesssageTypeEveryoneViewableValues()) {
		t.Errorf("want %v, got %v", model.MesssageTypeEveryoneViewableValues(), *got.Types)
	}
	for _, mt := range *got.Types {
		if !mt.IsEveryoneViewable() {
			t.Errorf("hidden type %v must be filtered", mt)
		}
	}
	if *got.IncludeMonologue || *got.IncludeSecret {
		t.Errorf("not logged in viewer must not include monologue / secret")
	}
}

func TestRestrictMessagesQueryAllTypesAfterEpilogue(t *testing.T) {
	svc := newRestrictQueryTestService()
	// エピローグ以降は全タイプ閲覧可なので、重複があってもフィルタ無し (nil) になる
	requested := append(model.MessageTypeValues(), model.MessageTypeTalkNormal)
	got := svc.RestrictMessagesQuery(model.Game{Status: model.GameStatusEpilogue}, model.MessagesQuery{Types: &requested}, nil, nil, nil)
	if got.Types != nil {
		t.Errorf("want nil (no type filter), got %v", *got.Types)
	}
}

func TestRestrictMessagesQueryIncludesOwnMonologueAndSecret(t *testing.T) {
	svc := newRestrictQueryTestService()
	game := model.Game{Status: model.GameStatusProgress}
	myself := &model.GameParticipant{ID: 1}
	monologue := []model.MessageType{model.MessageTypeMonologue}
	secret := []model.MessageType{model.MessageTypeSecret}
	otherSender := []uint32{2}
	ownSender := []uint32{1}

	cases := []struct {
		name          string
		query         model.MessagesQuery
		wantMonologue bool
		wantSecret    bool
	}{
		{"種別指定なしなら両方含める", model.MessagesQuery{}, true, true},
		{"独り言だけ求めたら独り言だけ", model.MessagesQuery{Types: &monologue}, true, false},
		{"秘話だけ求めたら秘話だけ", model.MessagesQuery{Types: &secret}, false, true},
		{"他人の発言だけ求めたら含めない", model.MessagesQuery{SenderIDs: &otherSender}, false, false},
		{"自分の発言を求めたら含める", model.MessagesQuery{SenderIDs: &ownSender}, true, true},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got := svc.RestrictMessagesQuery(game, c.query, myself, &model.Player{ID: 1}, nil)
			if *got.IncludeMonologue != c.wantMonologue || *got.IncludeSecret != c.wantSecret {
				t.Errorf("monologue=%v secret=%v, want %v %v", *got.IncludeMonologue, *got.IncludeSecret, c.wantMonologue, c.wantSecret)
			}
		})
	}
}

func TestRestrictMessagesQueryGameMasterViewAll(t *testing.T) {
	svc := newRestrictQueryTestService()
	game := model.Game{Status: model.GameStatusProgress, GameMasters: []model.GameMaster{{PlayerID: 3}}}
	game.Settings.Rule.IsGameMasterViewAllMessages = true
	// 全種別が見られるので type フィルタ自体が外れ、独り言・秘話の「自分の分だけ」の拡張も不要
	got := svc.RestrictMessagesQuery(game, model.MessagesQuery{}, nil, &model.Player{ID: 3}, nil)
	if got.Types != nil || *got.IncludeMonologue || *got.IncludeSecret {
		t.Errorf("want no type filter, got types=%v monologue=%v secret=%v", got.Types, *got.IncludeMonologue, *got.IncludeSecret)
	}
}
