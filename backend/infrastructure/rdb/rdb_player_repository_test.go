package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
)

func TestFindPlayers(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)
		ids := []uint32{f.player.ID, f.player2.ID}
		got, err := repo.FindPlayers(ctx, model.PlayersQuery{IDs: &ids})
		if err != nil {
			t.Fatalf("failed to find players: %s", err)
		}
		if len(got) != 2 {
			t.Errorf("got %d players, want 2", len(got))
		}
	})
}

func TestFind(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)
		got, err := repo.Find(ctx, f.player.ID)
		if err != nil {
			t.Fatalf("failed to find player: %s", err)
		}
		if got == nil || got.Name != f.player.Name {
			t.Errorf("got %+v, want %+v", got, f.player)
		}
	})
}

func TestFindByName(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)
		got, err := repo.FindByName(ctx, f.player.Name)
		if err != nil {
			t.Fatalf("failed to find player: %s", err)
		}
		if got == nil || got.ID != f.player.ID {
			t.Errorf("got %+v, want player %d", got, f.player.ID)
		}
	})
}

func TestFindByUserName(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		userRepo := db.NewUserRepository(&database)
		repo := db.NewPlayerRepository(&database)
		username := uniqueName("user")
		if _, err := userRepo.Signup(ctx, username); err != nil {
			t.Fatalf("failed to signup: %s", err)
		}
		got, err := repo.FindByUserName(ctx, username)
		if err != nil {
			t.Fatalf("failed to find player: %s", err)
		}
		if got == nil {
			t.Fatal("got nil, want player")
		}
		if got.Name != "未登録" {
			t.Errorf("name = %s, want 未登録 (Signup default)", got.Name)
		}

		unknown, err := repo.FindByUserName(ctx, uniqueName("unknown"))
		if err != nil || unknown != nil {
			t.Errorf("unknown user: got %+v (%v), want nil", unknown, err)
		}
	})
}

func TestSave(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)
		got, err := repo.Save(ctx, &model.Player{ID: f.player.ID, Name: "renamed player"})
		if err != nil {
			t.Fatalf("failed to save player: %s", err)
		}
		if got == nil || got.Name != "renamed player" {
			t.Fatalf("got %+v, want renamed player", got)
		}
		found, err := repo.Find(ctx, f.player.ID)
		if err != nil || found == nil || found.Name != "renamed player" {
			t.Errorf("found %+v (%v), want renamed player", found, err)
		}
	})
}

func TestFindProfile(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)
		got, err := repo.FindProfile(ctx, f.player.ID)
		if err != nil {
			t.Fatalf("failed to find profile: %s", err)
		}
		if got == nil {
			t.Fatal("got nil, want profile (created by Signup)")
		}
		if got.PlayerID != f.player.ID {
			t.Errorf("player id = %d, want %d", got.PlayerID, f.player.ID)
		}
	})
}

func TestSaveProfile(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)
		url := "https://example.com/icon.png"
		introduction := "test introduction"
		got, err := repo.SaveProfile(ctx, "profile name", &model.PlayerProfile{
			PlayerID:        f.player.ID,
			ProfileImageURL: &url,
			Introduction:    &introduction,
		})
		if err != nil {
			t.Fatalf("failed to save profile: %s", err)
		}
		if got == nil {
			t.Fatal("got nil, want profile")
		}
		found, err := repo.FindProfile(ctx, f.player.ID)
		if err != nil || found == nil {
			t.Fatalf("failed to find profile: %v", err)
		}
		if found.Introduction == nil || *found.Introduction != introduction {
			t.Errorf("introduction = %v, want %s", found.Introduction, introduction)
		}
		if found.ProfileImageURL == nil || *found.ProfileImageURL != url {
			t.Errorf("profile image url = %v, want %s", found.ProfileImageURL, url)
		}
		player, err := repo.Find(ctx, f.player.ID)
		if err != nil || player == nil || player.Name != "profile name" {
			t.Errorf("player name = %+v (%v), want profile name", player, err)
		}
	})
}

func TestSnsAccount(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewPlayerRepository(&database)

		registered, err := repo.RegisterSnsAccount(ctx, f.player.ID, &model.PlayerSnsAccount{
			SnsType:     model.SnsTypeTwitter,
			AccountName: "test account name",
			AccountURL:  "https://x.com/test",
		})
		if err != nil {
			t.Fatalf("failed to register sns account: %s", err)
		}
		if registered == nil || registered.ID == 0 {
			t.Fatalf("got %+v, want registered sns account", registered)
		}

		if err := repo.UpdateSnsAccount(ctx, registered.ID, &model.PlayerSnsAccount{
			SnsType:     model.SnsTypeTwitter,
			AccountName: "updated account name",
			AccountURL:  "https://x.com/updated",
		}); err != nil {
			t.Fatalf("failed to update sns account: %s", err)
		}
		profile, err := repo.FindProfile(ctx, f.player.ID)
		if err != nil || profile == nil {
			t.Fatalf("failed to find profile: %v", err)
		}
		if len(profile.SnsAccounts) != 1 || profile.SnsAccounts[0].AccountName != "updated account name" {
			t.Errorf("sns accounts = %+v, want 1 updated account", profile.SnsAccounts)
		}

		if err := repo.DeleteSnsAccount(ctx, registered.ID); err != nil {
			t.Fatalf("failed to delete sns account: %s", err)
		}
		profile, err = repo.FindProfile(ctx, f.player.ID)
		if err != nil || profile == nil || len(profile.SnsAccounts) != 0 {
			t.Errorf("sns accounts after delete = %+v (%v), want empty", profile, err)
		}
	})
}
