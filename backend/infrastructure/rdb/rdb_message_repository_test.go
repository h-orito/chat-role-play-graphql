package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
	"time"
)

func newMessageRepository() model.MessageRepository {
	database := NewTestDB()
	return db.NewMessageRepository(&database)
}

func TestFindMessages(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	ids := []uint64{1, 2}
	periodID := uint32(1)
	types := []model.MessageType{model.MessageTypeTalkNormal}
	got, err := repo.FindMessages(gameID, model.MessagesQuery{
		IDs:          &ids,
		GamePeriodID: &periodID,
		Types:        &types,
		Paging: &model.PagingQuery{
			PageSize:   1,
			PageNumber: 1,
			Desc:       false,
		},
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize := 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	senderIds := []uint32{1}
	got, err = repo.FindMessages(gameID, model.MessagesQuery{
		SenderIDs: &senderIds,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 2
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	replyToMessageID := uint64(1)
	keywords := []string{"mess", "t%%est"}
	got, err = repo.FindMessages(gameID, model.MessagesQuery{
		ReplyToMessageID: &replyToMessageID,
		Keywords:         &keywords,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	since, err := time.Parse("2006-01-02 15:04:05", "2020-01-01 00:00:00")
	if err != nil {
		t.Errorf("failed to parse time: %s", err)
	}
	until, err := time.Parse("2006-01-02 15:04:05", "2099-01-01 00:00:00")
	if err != nil {
		t.Errorf("failed to parse time: %s", err)
	}
	got, err = repo.FindMessages(gameID, model.MessagesQuery{
		SinceAt: &since,
		UntilAt: &until,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 2
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	offset := uint64(1)
	if err != nil {
		t.Errorf("failed to parse time: %s", err)
	}
	got, err = repo.FindMessages(gameID, model.MessagesQuery{
		OffsetUnixtimeMilli: &offset,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 2
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}
}

func TestFindMessage(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	var id uint64 = 1
	got, err := repo.FindMessage(gameID, id)
	if err != nil {
		t.Errorf("failed to find message: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want message")
	}
}

func TestFindMessageReplies(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	var id uint64 = 1
	got, err := repo.FindMessageReplies(gameID, id)
	if err != nil {
		t.Errorf("failed to find message replies: %s", err)
	}
	wantSize := 1
	if len(got) != wantSize {
		t.Errorf("got %d replies, want %d", len(got), wantSize)
	}
}

func TestFindMessageFavoriteGameParticipants(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	var id uint64 = 1
	got, err := repo.FindMessageFavoriteGameParticipants(gameID, id)
	if err != nil {
		t.Errorf("failed to find message favorite game participants: %s", err)
	}
	wantSize := 1
	if got.Count != wantSize {
		t.Errorf("got %d favorite game participants, want %d", got.Count, wantSize)
	}
}

func TestRegisterMessage(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewMessageRepository(&database)
		m := model.Message{
			GamePeriodID: 1,
			Type:         model.MessageTypeTalkNormal,
			Sender: &model.MessageSender{
				GameParticipantID: 1,
				CharaImageID:      1,
				CharaName:         "chara name",
			},
			ReplyTo: &model.MessageReplyTo{
				MessageID:         1,
				GameParticipantID: 1,
			},
			Content: model.MessageContent{
				Number:            0,
				Text:              "text",
				IsConvertDisabled: false,
			},
			Time: model.MessageTime{
				SendAt:        time.Time{},
				UnixtimeMilli: 0,
			},
			Reactions: model.MessageReactions{
				ReplyCount:    0,
				FavoriteCount: 0,
			},
		}
		err := repo.RegisterMessage(ctx, 1, m)
		if err != nil {
			t.Errorf("failed to register: %s", err)
		}
		return nil, nil
	})
}

func TestRegisterMessageFavorite(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewMessageRepository(&database)
		err := repo.RegisterMessageFavorite(ctx, 1, 1, 1)
		if err != nil {
			t.Errorf("failed to register message favorite: %s", err)
		}
		return nil, nil
	})
}

func TestFindGameParticipantGroups(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	got, err := repo.FindGameParticipantGroups(model.GameParticipantGroupsQuery{
		GameID: gameID,
	})
	if err != nil {
		t.Errorf("failed to find game participant groups: %s", err)
	}
	wantSize := 1
	if len(got) != wantSize {
		t.Errorf("got %d game participant groups, want %d", len(got), wantSize)
	}
}

func TestRegisterGameParticipantGroup(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewMessageRepository(&database)
		err := repo.RegisterGameParticipantGroup(ctx, 1, model.GameParticipantGroup{
			Name:      "name",
			MemberIDs: []uint32{1, 2},
		})
		if err != nil {
			t.Errorf("failed to register game participant group: %s", err)
		}
		return nil, nil
	})
}

func TestFindDirectMessages(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	ids := []uint64{1, 2}
	periodID := uint32(1)
	types := []model.MessageType{model.MessageTypeTalkNormal}
	got, err := repo.FindDirectMessages(gameID, model.DirectMessagesQuery{
		IDs:          &ids,
		GamePeriodID: &periodID,
		Types:        &types,
		Paging: &model.PagingQuery{
			PageSize:   1,
			PageNumber: 1,
			Desc:       false,
		},
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize := 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	senderIds := []uint32{1}
	got, err = repo.FindDirectMessages(gameID, model.DirectMessagesQuery{
		SenderIDs: &senderIds,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	var gameParticipantGroupID uint32 = 1
	keywords := []string{"mess", "t%%est"}
	got, err = repo.FindDirectMessages(gameID, model.DirectMessagesQuery{
		GameParticipantGroupID: &gameParticipantGroupID,
		Keywords:               &keywords,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	since, err := time.Parse("2006-01-02 15:04:05", "2020-01-01 00:00:00")
	if err != nil {
		t.Errorf("failed to parse time: %s", err)
	}
	until, err := time.Parse("2006-01-02 15:04:05", "2099-01-01 00:00:00")
	if err != nil {
		t.Errorf("failed to parse time: %s", err)
	}
	got, err = repo.FindDirectMessages(gameID, model.DirectMessagesQuery{
		SinceAt: &since,
		UntilAt: &until,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}

	offset := uint64(1)
	if err != nil {
		t.Errorf("failed to parse time: %s", err)
	}
	got, err = repo.FindDirectMessages(gameID, model.DirectMessagesQuery{
		OffsetUnixtimeMilli: &offset,
	})
	if err != nil {
		t.Errorf("failed to find messages: %s", err)
	}
	wantSize = 1
	if len(got.List) != wantSize {
		t.Errorf("got %d messages, want %d", len(got.List), wantSize)
	}
}

func TestFindDirectMessage(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	var id uint64 = 1
	got, err := repo.FindDirectMessage(gameID, id)
	if err != nil {
		t.Errorf("failed to find message: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want message")
	}
}

func TestFindDirectMessageFavoriteGameParticipants(t *testing.T) {
	repo := newMessageRepository()
	var gameID uint32 = 1
	var id uint64 = 1
	got, err := repo.FindDirectMessageFavoriteGameParticipants(gameID, id)
	if err != nil {
		t.Errorf("failed to find message: %s", err)
	}
	wantSize := 1
	if got.Count != wantSize {
		t.Errorf("got %d game participants, want %d", got.Count, wantSize)
	}
}

func TestRegisterDirectMessage(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewMessageRepository(&database)
		m := model.DirectMessage{
			GamePeriodID: 1,
			Type:         model.MessageTypeTalkNormal,
			Sender: &model.MessageSender{
				GameParticipantID: 1,
				CharaImageID:      1,
				CharaName:         "chara name",
			},
			Content: model.MessageContent{
				Number:            0,
				Text:              "text",
				IsConvertDisabled: false,
			},
			Time: model.MessageTime{
				SendAt:        time.Time{},
				UnixtimeMilli: 0,
			},
			Reactions: model.DirectMessageReactions{
				FavoriteCount: 0,
			},
		}
		err := repo.RegisterDirectMessage(ctx, 1, m)
		if err != nil {
			t.Errorf("failed to register: %s", err)
		}
		return nil, nil
	})
}

func TestRegisterDirectMessageFavoriteGameParticipant(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewMessageRepository(&database)
		err := repo.RegisterDirectMessageFavorite(ctx, 1, 1, 1)
		if err != nil {
			t.Errorf("failed to register: %s", err)
		}
		return nil, nil
	})
}
