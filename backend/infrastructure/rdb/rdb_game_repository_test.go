package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
	"time"
)

func TestFindGames(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		ids := []uint32{f.game.ID}
		got, err := repo.FindGames(ctx, model.GamesQuery{
			IDs: &ids,
			Paging: &model.PagingQuery{
				PageSize:   10,
				PageNumber: 1,
				Desc:       true,
			},
		})
		if err != nil {
			t.Fatalf("failed to find games: %s", err)
		}
		if len(got) != 1 {
			t.Fatalf("got %d games, want 1", len(got))
		}
		if got[0].Name != "fixture game" {
			t.Errorf("got name %q, want fixture game", got[0].Name)
		}
	})
}

func TestFindGamesByStatus(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		// Statuses フィルタの検証。他テストと違い DB 全体の Progress ゲームを対象にするため、
		// fixture が含まれることと全件が Progress であることだけを見る
		statuses := []model.GameStatus{model.GameStatusProgress}
		got, err := repo.FindGames(ctx, model.GamesQuery{
			Statuses: &statuses,
			Paging:   &model.PagingQuery{PageSize: 100000, PageNumber: 1, Desc: true},
		})
		if err != nil {
			t.Fatalf("failed to find games: %s", err)
		}
		found := false
		for _, g := range got {
			if g.ID == f.game.ID {
				found = true
			}
			if g.Status != model.GameStatusProgress {
				t.Errorf("game %d status = %s, want Progress", g.ID, g.Status)
			}
		}
		if !found {
			t.Errorf("fixture game %d not found in Progress games", f.game.ID)
		}
	})
}

func TestFindGame(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		got, err := repo.FindGame(ctx, f.game.ID)
		if err != nil {
			t.Fatalf("failed to find game: %s", err)
		}
		if got == nil {
			t.Fatal("got nil, want game")
		}
		if got.Name != "fixture game" || got.Status != model.GameStatusProgress {
			t.Errorf("got %s / %s, want fixture game / Progress", got.Name, got.Status)
		}
		if len(got.GameMasters) != 1 || got.GameMasters[0].PlayerID != f.player.ID {
			t.Errorf("game masters = %+v, want player %d", got.GameMasters, f.player.ID)
		}
		if got.Participants.Count != 2 {
			t.Errorf("participants count = %d, want 2", got.Participants.Count)
		}
		if len(got.Periods) != 1 || got.Periods[0].Name != "プロローグ" {
			t.Errorf("periods = %+v, want 1 period プロローグ", got.Periods)
		}
		if got.Settings.Capacity.Max != 10 {
			t.Errorf("capacity max = %d, want 10", got.Settings.Capacity.Max)
		}
	})
}

func TestFindGameNotFound(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		repo := db.NewGameRepository(&database)
		got, err := repo.FindGame(ctx, 0)
		if err != nil {
			t.Fatalf("unexpected error: %s", err)
		}
		if got != nil {
			t.Errorf("got %+v, want nil", got)
		}
	})
}

func TestFindGamePeriods(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		got, err := repo.FindGamePeriods(ctx, []uint32{f.game.Periods[0].ID})
		if err != nil {
			t.Fatalf("failed to find game periods: %s", err)
		}
		if len(got) != 1 || got[0].Name != "プロローグ" {
			t.Errorf("got %+v, want 1 period プロローグ", got)
		}
	})
}

func TestRegisterGame(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		player := signupPlayer(ctx, t, database, "game master")
		repo := db.NewGameRepository(&database)
		password := "password"
		g := newGameForFixture(player.ID)
		g.Name = "registered game"
		g.Status = model.GameStatusClosed
		g.Settings.Password = model.GamePasswordSettings{HasPassword: true, Password: &password}

		got, err := repo.RegisterGame(ctx, g)
		if err != nil {
			t.Fatalf("failed to register game: %s", err)
		}
		if got == nil {
			t.Fatal("got nil, want game")
		}
		if got.ID == 0 || got.Name != "registered game" || got.Status != model.GameStatusClosed {
			t.Errorf("got %+v", got)
		}
		if !got.Settings.Password.HasPassword {
			t.Errorf("password setting not saved")
		}
		if len(got.Periods) != 1 {
			t.Errorf("periods = %+v, want 1", got.Periods)
		}
	})
}

func TestUpdateGameStatus(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		if err := repo.UpdateGameStatus(ctx, f.game.ID, model.GameStatusCancelled); err != nil {
			t.Fatalf("failed to update game status: %s", err)
		}
		got, err := repo.FindGame(ctx, f.game.ID)
		if err != nil || got == nil {
			t.Fatalf("failed to find game: %v", err)
		}
		if got.Status != model.GameStatusCancelled {
			t.Errorf("status = %s, want Cancelled", got.Status)
		}
	})
}

func TestUpdateGamePeriod(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		period := f.game.Periods[0]
		endAt := time.Now().Add(48 * time.Hour).Truncate(time.Second)
		if err := repo.UpdateGamePeriod(ctx, f.game.ID, model.GamePeriod{
			ID:      period.ID,
			Count:   period.Count,
			Name:    "改名後",
			StartAt: period.StartAt,
			EndAt:   endAt,
		}); err != nil {
			t.Fatalf("failed to update game period: %s", err)
		}
		got, err := repo.FindGamePeriods(ctx, []uint32{period.ID})
		if err != nil || len(got) != 1 {
			t.Fatalf("failed to find period: %v (%d)", err, len(got))
		}
		if got[0].Name != "改名後" {
			t.Errorf("name = %s, want 改名後", got[0].Name)
		}
		if !got[0].EndAt.Equal(endAt) {
			t.Errorf("endAt = %v, want %v", got[0].EndAt, endAt)
		}
	})
}

func TestUpdateGamePeriodNotFound(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		err := repo.UpdateGamePeriod(ctx, f.game.ID, model.GamePeriod{ID: 0, Name: "x"})
		if err == nil {
			t.Error("expected error for unknown period, got nil")
		}
	})
}

func TestUpdateGameSettings(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		settings := f.game.Settings
		settings.Capacity = model.GameCapacitySettings{Min: 2, Max: 20}
		settings.Rule.CanShorten = false
		if err := repo.UpdateGameSettings(ctx, f.game.ID, "renamed game", []model.GameLabel{}, settings); err != nil {
			t.Fatalf("failed to update game settings: %s", err)
		}
		got, err := repo.FindGame(ctx, f.game.ID)
		if err != nil || got == nil {
			t.Fatalf("failed to find game: %v", err)
		}
		if got.Name != "renamed game" {
			t.Errorf("name = %s, want renamed game", got.Name)
		}
		if got.Settings.Capacity.Min != 2 || got.Settings.Capacity.Max != 20 {
			t.Errorf("capacity = %+v, want 2..20", got.Settings.Capacity)
		}
		if got.Settings.Rule.CanShorten {
			t.Errorf("CanShorten should be false")
		}
	})
}
