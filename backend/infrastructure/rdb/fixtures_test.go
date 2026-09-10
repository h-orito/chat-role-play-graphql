package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"fmt"
	"testing"
	"time"
)

// runInRollbackTx はテスト用トランザクション (必ずロールバック) の中で f を実行する。
// fixture の作成も検証もこの tx 内で行うため、DB の状態 (seed や手作業データ) に依存せず、
// テスト終了後に何も残らない。tx 内の読み取りが未コミット行を見られるのは DB.Conn(ctx) (#47) による。
func runInRollbackTx(t *testing.T, f func(ctx context.Context, database db.DB)) {
	t.Helper()
	database := NewTestDB()
	sqlDB, err := database.Connection.DB()
	if err != nil {
		t.Fatal(err)
	}
	defer sqlDB.Close()

	transaction := NewTestTransaction(database.Connection)
	if _, err := transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		f(ctx, database)
		return nil, nil
	}); err != nil {
		t.Fatalf("transaction failed: %v", err)
	}
}

// fixture はゲーム 1 件 (ゲームマスター = player) と参加者 2 名 (player / player2) を tx 内に作ったもの。
type fixture struct {
	player       *model.Player
	player2      *model.Player
	game         *model.Game
	participant  *model.GameParticipant
	participant2 *model.GameParticipant
}

// uniqueName はテスト実行ごとに衝突しない名前を返す (user_name にユニーク制約があるため)。
func uniqueName(prefix string) string {
	return fmt.Sprintf("%s-%d", prefix, time.Now().UnixNano())
}

// signupPlayer は UserRepository.Signup でプレイヤー (player / account / authority / profile) を作り、
// 表示名を name に変更して返す。
func signupPlayer(ctx context.Context, t *testing.T, database db.DB, name string) *model.Player {
	t.Helper()
	userRepo := db.NewUserRepository(&database)
	playerRepo := db.NewPlayerRepository(&database)
	username := uniqueName(name)
	if _, err := userRepo.Signup(ctx, username); err != nil {
		t.Fatalf("failed to signup: %v", err)
	}
	player, err := playerRepo.FindByUserName(ctx, username)
	if err != nil || player == nil {
		t.Fatalf("failed to find signed up player: %v", err)
	}
	saved, err := playerRepo.Save(ctx, &model.Player{ID: player.ID, Name: name})
	if err != nil || saved == nil {
		t.Fatalf("failed to rename player: %v", err)
	}
	return saved
}

func newGameForFixture(gameMasterPlayerID uint32) model.Game {
	suffix := "日目"
	now := time.Now()
	return model.Game{
		Name:   "fixture game",
		Status: model.GameStatusProgress,
		GameMasters: []model.GameMaster{
			{PlayerID: gameMasterPlayerID, IsProducer: true},
		},
		Participants: model.GameParticipants{},
		Periods: []model.GamePeriod{
			{Count: 0, Name: "プロローグ", StartAt: now, EndAt: now.Add(24 * time.Hour)},
		},
		Settings: model.GameSettings{
			Chara:    model.GameCharaSettings{CharachipIDs: []uint32{1}, CanOriginalCharacter: true},
			Capacity: model.GameCapacitySettings{Min: 1, Max: 10},
			Time: model.GameTimeSettings{
				PeriodPrefix:          nil,
				PeriodSuffix:          &suffix,
				PeriodIntervalSeconds: 86400,
				OpenAt:                now,
				StartParticipateAt:    now,
				StartGameAt:           now,
			},
			Rule: model.GameRuleSettings{
				CanShorten:           true,
				CanSendDirectMessage: true,
			},
			Password: model.GamePasswordSettings{
				HasPassword: false,
				Password:    nil,
			},
		},
	}
}

func registerParticipant(ctx context.Context, t *testing.T, database db.DB, gameID uint32, player *model.Player) *model.GameParticipant {
	t.Helper()
	repo := db.NewGameParticipantRepository(&database)
	saved, err := repo.RegisterGameParticipant(ctx, gameID, model.GameParticipant{
		Name:           player.Name,
		PlayerID:       player.ID,
		IsGone:         false,
		LastAccessedAt: time.Now(),
	})
	if err != nil || saved == nil {
		t.Fatalf("failed to register participant: %v", err)
	}
	return saved
}

// newFixture はプレイヤー 2 名・ゲーム 1 件・参加者 2 名を tx 内に作る。
func newFixture(ctx context.Context, t *testing.T, database db.DB) *fixture {
	t.Helper()
	player := signupPlayer(ctx, t, database, "fixture player 1")
	player2 := signupPlayer(ctx, t, database, "fixture player 2")

	gameRepo := db.NewGameRepository(&database)
	game, err := gameRepo.RegisterGame(ctx, newGameForFixture(player.ID))
	if err != nil || game == nil {
		t.Fatalf("failed to register game: %v", err)
	}

	participant := registerParticipant(ctx, t, database, game.ID, player)
	participant2 := registerParticipant(ctx, t, database, game.ID, player2)
	return &fixture{
		player:       player,
		player2:      player2,
		game:         game,
		participant:  participant,
		participant2: participant2,
	}
}
