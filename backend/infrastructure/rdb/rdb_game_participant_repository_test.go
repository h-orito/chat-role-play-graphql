package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
	"time"
)

func newGameParticipantRepository() model.GameParticipantRepository {
	database := NewTestDB()
	return db.NewGameParticipantRepository(&database)
}

func TestFindGameParticipants(t *testing.T) {
	repo := newGameParticipantRepository()
	var gameID uint32 = 1
	got, err := repo.FindGameParticipants(model.GameParticipantsQuery{
		GameID: &gameID,
	})
	if err != nil {
		t.Errorf("failed to find game participants: %s", err)
	}
	wantSize := 2
	if len(got.List) != wantSize {
		t.Errorf("got %d game participants, want %d", got.Count, wantSize)
	}
}

func TestFindGameParticipant(t *testing.T) {
	repo := newGameParticipantRepository()
	var ID uint32 = 1
	var gameID uint32 = 1
	got, err := repo.FindGameParticipant(model.GameParticipantQuery{
		GameID: &gameID,
		ID:     &ID,
	})
	if err != nil {
		t.Errorf("failed to find game participant: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want game participant")
	}
}

func TestRegisterGameParticipant(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		gp := model.GameParticipant{
			Name:           "test",
			PlayerID:       1,
			IsGone:         false,
			LastAccessedAt: time.Now(),
		}
		got, err := repo.RegisterGameParticipant(ctx, 1, gp)
		if err != nil {
			t.Errorf("failed to register game participant: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want game participant")
		}
		return nil, nil
	})
}

func TestUpdateGameParticipant(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		err := repo.UpdateGameParticipant(ctx, 1, "name", nil, nil)
		if err != nil {
			t.Errorf("failed to register game participant: %s", err)
		}
		return nil, nil
	})
}

func TestFindGameParticipantProfile(t *testing.T) {
	repo := newGameParticipantRepository()
	got, err := repo.FindGameParticipantProfile(1)
	if err != nil {
		t.Errorf("failed to find participant profile: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want participant profile")
	}
}

func TestUpdateGameParticipantProfile(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		icon := "https://example.com/icon.png"
		intro := "introduction"
		gp := model.GameParticipantProfile{
			GameParticipantID: 1,
			ProfileImageURL:   &icon,
			Introduction:      &intro,
			FollowsCount:      0,
			FollowersCount:    0,
		}
		err := repo.UpdateGameParticipantProfile(ctx, 1, gp)
		if err != nil {
			t.Errorf("failed to register game participant: %s", err)
		}
		return nil, nil
	})
}

func TestFindGameParticipantNotificationSetting(t *testing.T) {
	repo := newGameParticipantRepository()
	got, err := repo.FindGameParticipantNotificationSetting(1)
	if err != nil {
		t.Errorf("failed to find participant notification settings: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want participant notification settings")
	}
}

func TestUpdateGameParticipantNotificationSetting(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		url := "url"
		notificationSetting := model.GameParticipantNotification{
			GameParticipantID: 1,
			DiscordWebhookUrl: &url,
			Game: model.GameNotificationSetting{
				Participate: false,
				Start:       false,
			},
			Message: model.MessageNotificationSetting{
				Reply:         false,
				DirectMessage: false,
				Keywords:      []string{"1", "2"},
			},
		}
		err := repo.UpdateGameParticipantNotificationSetting(ctx, 1, notificationSetting)
		if err != nil {
			t.Errorf("failed to register game participant: %s", err)
		}
		return nil, nil
	})
}

func TestFindGameParticipantFollows(t *testing.T) {
	repo := newGameParticipantRepository()
	got, err := repo.FindGameParticipantFollows(1)
	if err != nil {
		t.Errorf("failed to find participant follows: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want participant follows")
	}
}

func TestFindGameParticipantFollowers(t *testing.T) {
	repo := newGameParticipantRepository()
	got, err := repo.FindGameParticipantFollowers(1)
	if err != nil {
		t.Errorf("failed to find participant followers: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want participant followers")
	}
}

func TestRegisterGameParticipantFollow(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		err := repo.RegisterGameParticipantFollow(ctx, 2, 1)
		if err != nil {
			t.Errorf("failed to register game participant follow: %s", err)
		}
		return nil, nil
	})
}

func TestDeleteGameParticipantFollow(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		err := repo.DeleteGameParticipantFollow(ctx, 1, 2)
		if err != nil {
			t.Errorf("failed to delete game participant follow: %s", err)
		}
		return nil, nil
	})
}

func TestFindGameParticipantDiaries(t *testing.T) {
	repo := newGameParticipantRepository()
	var gameParticipantID uint32 = 1
	got, err := repo.FindGameParticipantDiaries(model.GameParticipantDiariesQuery{
		GameParticipantID: &gameParticipantID,
	})
	if err != nil {
		t.Errorf("failed to find participant diaries: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want participant diaries")
	}
}

func TestFindGameParticipantDiary(t *testing.T) {
	repo := newGameParticipantRepository()
	got, err := repo.FindGameParticipantDiary(1)
	if err != nil {
		t.Errorf("failed to find participant diary: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want participant diary")
	}
}

func TestUpsertGameParticipantDiary(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameParticipantRepository(&database)
		diary := model.GameParticipantDiary{
			ID:                1,
			GameParticipantID: 1,
			GamePeriodID:      1,
			Title:             "title",
			Body:              "body",
		}
		got, err := repo.UpsertGameParticipantDiary(ctx, 1, diary)
		if err != nil {
			t.Errorf("failed to register game participant diary: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want participant diary")
		}
		return nil, nil
	})
}
