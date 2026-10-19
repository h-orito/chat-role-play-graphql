package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
	"time"
)

// addPeriod はゲームに 2 つ目の期間を追加し、期間を含むゲームを取り直して返す。
func addPeriod(ctx context.Context, t *testing.T, repo model.GameRepository, game *model.Game) *model.Game {
	t.Helper()
	last := game.Periods[len(game.Periods)-1]
	if err := repo.RegisterGamePeriod(ctx, game.ID, model.GamePeriod{
		Count:   last.Count + 1,
		Name:    "1日目",
		StartAt: last.EndAt,
		EndAt:   last.EndAt.Add(24 * time.Hour),
	}); err != nil {
		t.Fatalf("failed to register period: %v", err)
	}
	got, err := repo.FindGame(ctx, game.ID)
	if err != nil || got == nil || len(got.Periods) != 2 {
		t.Fatalf("failed to find game with 2 periods: %v", err)
	}
	return got
}

func TestDeleteGameMasterOfOtherGameIsIgnored(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		own := newFixture(ctx, t, database)
		victim := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		victimGM := victim.game.GameMasters[0]

		if err := repo.DeleteGameMaster(ctx, own.game.ID, victimGM.ID); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		got, _ := repo.FindGame(ctx, victim.game.ID)
		if len(got.GameMasters) != 1 {
			t.Errorf("victim game master must remain, got %v", got.GameMasters)
		}

		if err := repo.DeleteGameMaster(ctx, victim.game.ID, victimGM.ID); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		got, _ = repo.FindGame(ctx, victim.game.ID)
		if len(got.GameMasters) != 0 {
			t.Errorf("game master of the same game must be deleted, got %v", got.GameMasters)
		}
	})
}

func TestUpdateGameMasterOfOtherGameIsIgnored(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		own := newFixture(ctx, t, database)
		victim := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		victimGM := victim.game.GameMasters[0] // IsProducer = true

		if err := repo.UpdateGameMaster(ctx, own.game.ID, model.GameMaster{ID: victimGM.ID, IsProducer: false}); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		got, _ := repo.FindGame(ctx, victim.game.ID)
		if !got.GameMasters[0].IsProducer {
			t.Errorf("victim game master must not be updated")
		}

		if err := repo.UpdateGameMaster(ctx, victim.game.ID, model.GameMaster{ID: victimGM.ID, IsProducer: false}); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		got, _ = repo.FindGame(ctx, victim.game.ID)
		if got.GameMasters[0].IsProducer {
			t.Errorf("game master of the same game must be updated")
		}
	})
}

func TestDeleteGamePeriodOfOtherGameIsRejected(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		own := newFixture(ctx, t, database)
		victim := newFixture(ctx, t, database)
		repo := db.NewGameRepository(&database)
		ownGame := addPeriod(ctx, t, repo, own.game)
		victimGame := addPeriod(ctx, t, repo, victim.game)

		// 他ゲームの期間を削除対象に指定
		if err := repo.DeleteGamePeriod(ctx, ownGame.ID, victimGame.Periods[0].ID, ownGame.Periods[1].ID); err == nil {
			t.Errorf("want error for target period of other game")
		}
		// 他ゲームの期間を移動先に指定
		if err := repo.DeleteGamePeriod(ctx, ownGame.ID, ownGame.Periods[0].ID, victimGame.Periods[1].ID); err == nil {
			t.Errorf("want error for dest period of other game")
		}
		// 同じ期間を指定
		if err := repo.DeleteGamePeriod(ctx, ownGame.ID, ownGame.Periods[0].ID, ownGame.Periods[0].ID); err == nil {
			t.Errorf("want error for same target and dest")
		}
		got, _ := repo.FindGame(ctx, victimGame.ID)
		if len(got.Periods) != 2 {
			t.Errorf("victim periods must remain, got %d", len(got.Periods))
		}

		// 同じゲーム内なら削除できる
		if err := repo.DeleteGamePeriod(ctx, ownGame.ID, ownGame.Periods[0].ID, ownGame.Periods[1].ID); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		got, _ = repo.FindGame(ctx, ownGame.ID)
		if len(got.Periods) != 1 || got.Periods[0].ID != ownGame.Periods[1].ID {
			t.Errorf("want only period %d, got %v", ownGame.Periods[1].ID, got.Periods)
		}
	})
}
