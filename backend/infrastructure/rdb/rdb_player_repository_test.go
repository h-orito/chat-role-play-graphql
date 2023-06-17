package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
)

func newPlayerRepository() model.PlayerRepository {
	database := NewTestDB()
	return db.NewPlayerRepository(&database)
}

func TestFind(t *testing.T) {
	repo := newPlayerRepository()
	got, err := repo.Find(1)
	if err != nil {
		t.Errorf("failed to find player: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want player")
	}
}

func TestFindByName(t *testing.T) {
	repo := newPlayerRepository()
	got, err := repo.FindByName("player name 1")
	if err != nil {
		t.Errorf("failed to find player: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want player")
	}
}

func TestFindByUserName(t *testing.T) {
	repo := newPlayerRepository()
	got, err := repo.FindByUserName("user name 1")
	if err != nil {
		t.Errorf("failed to find player: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want player")
	}
}

func TestSave(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewPlayerRepository(&database)
		player := model.Player{
			ID:   1,
			Name: "test player 2",
		}
		got, err := repo.Save(ctx, &player)
		if err != nil {
			t.Errorf("failed to save player: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want player")
		}
		if got.Name != player.Name {
			t.Errorf("got %s, want %s", got.Name, player.Name)
		}
		return got, nil
	})
}

func TestFindProfile(t *testing.T) {
	repo := newPlayerRepository()
	got, err := repo.FindProfile(1)
	if err != nil {
		t.Errorf("failed to find profile: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want profile")
	}
}

func TestSaveProfile(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewPlayerRepository(&database)
		url := "test icon url"
		introduction := "test introduction"
		profile := model.PlayerProfile{
			PlayerID:     1,
			IconURL:      &url,
			Introduction: &introduction,
		}
		got, err := repo.SaveProfile(ctx, &profile)
		if err != nil {
			t.Errorf("failed to save profile: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want profile")
		}
		return got, nil
	})
}

func TestRegisterSnsAccount(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewPlayerRepository(&database)
		snsAccount := model.PlayerSnsAccount{
			SnsType:     model.SnsTypeTwitter,
			AccountName: "test account name",
			AccountURL:  "test account url",
		}
		playerID := uint32(1)
		got, err := repo.RegisterSnsAccount(ctx, playerID, &snsAccount)
		if err != nil {
			t.Errorf("failed to register sns account: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want sns account")
		}
		return got, nil
	})
}

func TestSaveSnsAccount(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewPlayerRepository(&database)
		snsAccount := model.PlayerSnsAccount{
			SnsType:     model.SnsTypeTwitter,
			AccountName: "test account name",
			AccountURL:  "test account url",
		}
		ID := uint32(1)
		err := repo.UpdateSnsAccount(ctx, ID, &snsAccount)
		if err != nil {
			t.Errorf("failed to save sns account: %s", err)
		}
		return nil, nil
	})
}
