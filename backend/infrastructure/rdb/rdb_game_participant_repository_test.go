package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
	"time"
)

func TestFindGameParticipants(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		got, err := repo.FindGameParticipants(ctx, model.GameParticipantsQuery{GameID: &f.game.ID})
		if err != nil {
			t.Fatalf("failed to find game participants: %s", err)
		}
		if got.Count != 2 || len(got.List) != 2 {
			t.Fatalf("got count=%d list=%d participants, want 2", got.Count, len(got.List))
		}
		ids := map[uint32]bool{got.List[0].ID: true, got.List[1].ID: true}
		if !ids[f.participant.ID] || !ids[f.participant2.ID] {
			t.Errorf("got participants %v, want %d and %d", ids, f.participant.ID, f.participant2.ID)
		}
	})
}

func TestFindGameParticipant(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		got, err := repo.FindGameParticipant(ctx, model.GameParticipantQuery{
			GameID: &f.game.ID,
			ID:     &f.participant.ID,
		})
		if err != nil {
			t.Fatalf("failed to find game participant: %s", err)
		}
		if got == nil {
			t.Fatal("got nil, want game participant")
		}
		if got.PlayerID != f.player.ID || got.Name != f.player.Name {
			t.Errorf("got %+v, want player %d %s", got, f.player.ID, f.player.Name)
		}
	})
}

func TestFindGameParticipantByPlayer(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		got, err := repo.FindGameParticipant(ctx, model.GameParticipantQuery{
			GameID:   &f.game.ID,
			PlayerID: &f.player2.ID,
		})
		if err != nil {
			t.Fatalf("failed to find game participant: %s", err)
		}
		if got == nil || got.ID != f.participant2.ID {
			t.Errorf("got %+v, want participant %d", got, f.participant2.ID)
		}
	})
}

func TestRegisterGameParticipant(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		player3 := signupPlayer(ctx, t, database, "fixture player 3")
		repo := db.NewGameParticipantRepository(&database)
		got, err := repo.RegisterGameParticipant(ctx, f.game.ID, model.GameParticipant{
			Name:           "third",
			PlayerID:       player3.ID,
			IsGone:         false,
			LastAccessedAt: time.Now(),
		})
		if err != nil {
			t.Fatalf("failed to register game participant: %s", err)
		}
		if got == nil || got.ID == 0 || got.Name != "third" {
			t.Fatalf("got %+v, want registered participant", got)
		}
		// 参加登録で profile / notification setting も作られること
		profile, err := repo.FindGameParticipantProfile(ctx, got.ID)
		if err != nil || profile == nil {
			t.Errorf("profile should be created on register: %v", err)
		}
		setting, err := repo.FindGameParticipantNotificationSetting(ctx, got.ID)
		if err != nil || setting == nil {
			t.Errorf("notification setting should be created on register: %v", err)
		}
		participants, err := repo.FindGameParticipants(ctx, model.GameParticipantsQuery{GameID: &f.game.ID})
		if err != nil || participants.Count != 3 {
			t.Errorf("participants count = %d, want 3 (%v)", participants.Count, err)
		}
	})
}

func TestUpdateGameParticipant(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		memo := "memo"
		if err := repo.UpdateGameParticipant(ctx, f.participant.ID, "renamed", &memo, nil); err != nil {
			t.Fatalf("failed to update game participant: %s", err)
		}
		got, err := repo.FindGameParticipant(ctx, model.GameParticipantQuery{ID: &f.participant.ID})
		if err != nil || got == nil {
			t.Fatalf("failed to find participant: %v", err)
		}
		if got.Name != "renamed" {
			t.Errorf("name = %s, want renamed", got.Name)
		}
		if got.Memo == nil || *got.Memo != "memo" {
			t.Errorf("memo = %v, want memo", got.Memo)
		}
	})
}

func TestUpdateGameParticipantProfile(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		icon := "https://example.com/icon.png"
		intro := "introduction"
		if err := repo.UpdateGameParticipantProfile(ctx, f.participant.ID, model.GameParticipantProfile{
			GameParticipantID: f.participant.ID,
			ProfileImageURL:   &icon,
			Introduction:      &intro,
		}); err != nil {
			t.Fatalf("failed to update participant profile: %s", err)
		}
		got, err := repo.FindGameParticipantProfile(ctx, f.participant.ID)
		if err != nil || got == nil {
			t.Fatalf("failed to find participant profile: %v", err)
		}
		if got.Introduction == nil || *got.Introduction != intro {
			t.Errorf("introduction = %v, want %s", got.Introduction, intro)
		}
		if got.ProfileImageURL == nil || *got.ProfileImageURL != icon {
			t.Errorf("profile image url = %v, want %s", got.ProfileImageURL, icon)
		}
	})
}

func TestUpdateGameParticipantNotificationSetting(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		url := "https://discord.example.com/webhook"
		if err := repo.UpdateGameParticipantNotificationSetting(ctx, f.participant.ID, model.GameParticipantNotification{
			GameParticipantID: f.participant.ID,
			DiscordWebhookUrl: &url,
			Game: model.GameNotificationSetting{
				Participate: true,
				Start:       false,
			},
			Message: model.MessageNotificationSetting{
				Reply:         true,
				DirectMessage: false,
				Keywords:      []string{"1", "2"},
			},
		}); err != nil {
			t.Fatalf("failed to update notification setting: %s", err)
		}
		got, err := repo.FindGameParticipantNotificationSetting(ctx, f.participant.ID)
		if err != nil || got == nil {
			t.Fatalf("failed to find notification setting: %v", err)
		}
		if got.DiscordWebhookUrl == nil || *got.DiscordWebhookUrl != url {
			t.Errorf("webhook url = %v, want %s", got.DiscordWebhookUrl, url)
		}
		if !got.Game.Participate || got.Game.Start || !got.Message.Reply || got.Message.DirectMessage {
			t.Errorf("flags = %+v / %+v", got.Game, got.Message)
		}
		if len(got.Message.Keywords) != 2 {
			t.Errorf("keywords = %v, want 2", got.Message.Keywords)
		}

		settings, err := repo.FindGameParticipantNotificationSettings(ctx, []uint32{f.participant.ID, f.participant2.ID})
		if err != nil || len(settings) != 2 {
			t.Errorf("settings = %d, want 2 (%v)", len(settings), err)
		}
	})
}

func TestGameParticipantFollow(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)

		follows, err := repo.FindGameParticipantFollows(ctx, f.participant.ID)
		if err != nil || len(follows) != 0 {
			t.Fatalf("initial follows = %v (%v), want empty", follows, err)
		}

		if err := repo.RegisterGameParticipantFollow(ctx, f.participant.ID, f.participant2.ID); err != nil {
			t.Fatalf("failed to register follow: %s", err)
		}
		follows, err = repo.FindGameParticipantFollows(ctx, f.participant.ID)
		if err != nil || len(follows) != 1 || follows[0].FollowGameParticipantID != f.participant2.ID {
			t.Fatalf("follows = %+v (%v), want 1 follow to %d", follows, err, f.participant2.ID)
		}
		followers, err := repo.FindGameParticipantFollowers(ctx, f.participant2.ID)
		if err != nil || len(followers) != 1 || followers[0].GameParticipantID != f.participant.ID {
			t.Fatalf("followers = %+v (%v), want 1 follower %d", followers, err, f.participant.ID)
		}

		if err := repo.DeleteGameParticipantFollow(ctx, f.participant.ID, f.participant2.ID); err != nil {
			t.Fatalf("failed to delete follow: %s", err)
		}
		follows, err = repo.FindGameParticipantFollows(ctx, f.participant.ID)
		if err != nil || len(follows) != 0 {
			t.Errorf("follows after delete = %v (%v), want empty", follows, err)
		}
	})
}

func TestGameParticipantDiary(t *testing.T) {
	runInRollbackTx(t, func(ctx context.Context, database db.DB) {
		f := newFixture(ctx, t, database)
		repo := db.NewGameParticipantRepository(&database)
		periodID := f.game.Periods[0].ID

		saved, err := repo.UpsertGameParticipantDiary(ctx, f.game.ID, model.GameParticipantDiary{
			GameParticipantID: f.participant.ID,
			GamePeriodID:      periodID,
			Title:             "title",
			Body:              "body",
		})
		if err != nil {
			t.Fatalf("failed to upsert diary: %s", err)
		}
		if saved == nil || saved.ID == 0 {
			t.Fatalf("got %+v, want saved diary", saved)
		}

		got, err := repo.FindGameParticipantDiary(ctx, saved.ID)
		if err != nil || got == nil {
			t.Fatalf("failed to find diary: %v", err)
		}
		if got.Title != "title" || got.Body != "body" || got.GamePeriodID != periodID {
			t.Errorf("got %+v", got)
		}

		// 同じ ID で upsert すると更新される
		updated, err := repo.UpsertGameParticipantDiary(ctx, f.game.ID, model.GameParticipantDiary{
			ID:                saved.ID,
			GameParticipantID: f.participant.ID,
			GamePeriodID:      periodID,
			Title:             "title2",
			Body:              "body2",
		})
		if err != nil || updated == nil || updated.ID != saved.ID || updated.Title != "title2" {
			t.Errorf("update via upsert failed: %+v (%v)", updated, err)
		}

		diaries, err := repo.FindGameParticipantDiaries(ctx, model.GameParticipantDiariesQuery{
			GameParticipantID: &f.participant.ID,
		})
		if err != nil || len(diaries) != 1 {
			t.Errorf("diaries = %d (%v), want 1", len(diaries), err)
		}
	})
}
