package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
	"time"
)

func newGameRepository() model.GameRepository {
	database := NewTestDB()
	return db.NewGameRepository(&database)
}

func TestFindGames(t *testing.T) {
	repo := newGameRepository()
	got, err := repo.FindGames(model.GamesQuery{
		Paging: &model.PagingQuery{
			PageSize:   10,
			PageNumber: 1,
			Desc:       true,
		},
	})
	if err != nil {
		t.Errorf("failed to find games: %s", err)
	}
	wantSize := 1
	if len(got) != wantSize {
		t.Errorf("got %d games, want %d", len(got), wantSize)
	}
}

func TestFindGame(t *testing.T) {
	repo := newGameRepository()
	got, err := repo.FindGame(1)
	if err != nil {
		t.Errorf("failed to find game: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want game")
	}
}

func TestRegisterGame(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	suffix := "プロローグ"
	password := "password"
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameRepository(&database)
		g := model.Game{
			Name:   "test",
			Status: model.GameStatusClosed,
			GameMasters: []model.GameMaster{
				{
					PlayerID:   1,
					IsProducer: true,
				},
			},
			Participants: model.GameParticipants{},
			Periods: []model.GamePeriod{
				{
					Count:   0,
					Name:    "プロローグ",
					StartAt: time.Now(),
					EndAt:   time.Now(),
				},
			},
			Settings: model.GameSettings{
				Chara:    model.GameCharaSettings{CharachipIDs: []uint32{1}, CanOriginalCharacter: true},
				Capacity: model.GameCapacitySettings{Min: 1, Max: 10},
				Time: model.GameTimeSettings{
					PeriodPrefix:          nil,
					PeriodSuffix:          &suffix,
					PeriodIntervalSeconds: 86400,
					OpenAt:                time.Now(),
					StartParticipateAt:    time.Now(),
					StartGameAt:           time.Now(),
				},
				Rule: model.GameRuleSettings{
					CanShorten:           true,
					CanSendDirectMessage: true,
				},
				Password: model.GamePasswordSettings{
					HasPassword: true,
					Password:    &password,
				},
			},
		}
		got, err := repo.RegisterGame(ctx, g)
		if err != nil {
			t.Errorf("failed to register designer: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want designer")
		}
		return got, nil
	})
}

func TestUpdateGameStatus(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameRepository(&database)
		err := repo.UpdateGameStatus(ctx, 1, model.GameStatusCancelled)
		if err != nil {
			t.Errorf("failed to register designer: %s", err)
		}
		return nil, nil
	})
}

func TestUpdateGamePeriod(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameRepository(&database)
		err := repo.UpdateGamePeriod(ctx, 1, model.GamePeriod{
			Count:   0,
			Name:    "プロローグ",
			StartAt: time.Now(),
			EndAt:   time.Now(),
		})
		if err != nil {
			t.Errorf("failed to register designer: %s", err)
		}
		return nil, nil
	})
}

func TestUpdateGameSettings(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewGameRepository(&database)
		err := repo.UpdateGameSettings(ctx, 1, "name", []model.GameLabel{}, model.GameSettings{
			Chara:    model.GameCharaSettings{CharachipIDs: []uint32{1}, CanOriginalCharacter: true},
			Capacity: model.GameCapacitySettings{Min: 1, Max: 10},
			Time: model.GameTimeSettings{
				PeriodPrefix:          nil,
				PeriodSuffix:          nil,
				PeriodIntervalSeconds: 86400,
				OpenAt:                time.Now(),
				StartParticipateAt:    time.Now(),
				StartGameAt:           time.Now(),
			},
			Rule: model.GameRuleSettings{
				CanShorten:           true,
				CanSendDirectMessage: true,
			},
			Password: model.GamePasswordSettings{
				HasPassword: false,
				Password:    nil,
			},
		})
		if err != nil {
			t.Errorf("failed to register designer: %s", err)
		}
		return nil, nil
	})
}
