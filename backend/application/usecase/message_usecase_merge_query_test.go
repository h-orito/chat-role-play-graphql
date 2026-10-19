package usecase

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
	"testing"
)

func newMergeQueryTestUsecase(status model.GameStatus) *messageUsecase {
	return &messageUsecase{
		gameService:             &fakeGameService{game: model.Game{ID: dmTestGameID, Status: status}},
		playerService:           &fakePlayerService{},
		messageDomainService:    dom_service.NewMessageDomainService(),
		gameMasterDomainService: dom_service.NewGameMasterDomainService(),
	}
}

func TestMergeQueryDuplicatedTypesDoNotBypassFilter(t *testing.T) {
	u := newMergeQueryTestUsecase(model.GameStatusProgress)
	// 閲覧可能なタイプを重複させて件数を全タイプ数 (6) に揃え、非公開タイプを混ぜる
	requested := []model.MessageType{
		model.MessageTypeTalkNormal, model.MessageTypeTalkNormal, model.MessageTypeTalkNormal,
		model.MessageTypeTalkNormal, model.MessageTypeTalkNormal, model.MessageTypeTalkNormal,
		model.MessageTypeSecret, model.MessageTypeMonologue, model.MessageTypeSystemPrivate,
	}
	merged, _, err := u.MergeQuery(context.Background(), dmTestGameID, model.MessagesQuery{Types: &requested}, nil)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if merged.Types == nil {
		t.Fatalf("type filter must not be removed")
	}
	if len(*merged.Types) != 1 || (*merged.Types)[0] != model.MessageTypeTalkNormal {
		t.Errorf("want [TalkNormal], got %v", *merged.Types)
	}
}

func TestMergeQueryFiltersHiddenTypes(t *testing.T) {
	u := newMergeQueryTestUsecase(model.GameStatusProgress)
	merged, _, err := u.MergeQuery(context.Background(), dmTestGameID, model.MessagesQuery{}, nil)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if merged.Types == nil {
		t.Fatalf("type filter must not be removed")
	}
	want := model.MesssageTypeEveryoneViewableValues()
	if len(*merged.Types) != len(want) {
		t.Errorf("want %v, got %v", want, *merged.Types)
	}
	for _, mt := range *merged.Types {
		if mt == model.MessageTypeSecret || mt == model.MessageTypeMonologue || mt == model.MessageTypeSystemPrivate {
			t.Errorf("hidden type %v must be filtered", mt)
		}
	}
}

func TestMergeQueryAllTypesAfterEpilogue(t *testing.T) {
	u := newMergeQueryTestUsecase(model.GameStatusEpilogue)
	// エピローグ以降は全タイプ閲覧可なので、重複があってもフィルタ無し (nil) になる
	requested := append(model.MessageTypeValues(), model.MessageTypeTalkNormal)
	merged, _, err := u.MergeQuery(context.Background(), dmTestGameID, model.MessagesQuery{Types: &requested}, nil)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if merged.Types != nil {
		t.Errorf("want nil (no type filter), got %v", *merged.Types)
	}
}
