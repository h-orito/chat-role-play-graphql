package db_test

import (
	"chat-role-play/application/app_service"
	"chat-role-play/application/usecase"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"sort"
	"testing"
)

// 発言一覧 (DB の検索条件で絞り込む) と単一発言 (ドメインサービスで判定する) の閲覧可否が一致することを、
// 実 DB で確認する。どちらかのルールだけを変えるとこのテストが失敗する。
func TestMessageVisibilityOfListMatchesSingleMessage(t *testing.T) {
	for _, viewAll := range []bool{false, true} {
		runInRollbackTx(t, func(ctx context.Context, database db.DB) {
			userRepo := db.NewUserRepository(&database)
			playerRepo := db.NewPlayerRepository(&database)
			signup := func(name string) (*model.User, *model.Player) {
				username := uniqueName(name)
				if _, err := userRepo.Signup(ctx, username); err != nil {
					t.Fatalf("failed to signup: %v", err)
				}
				player, err := playerRepo.FindByUserName(ctx, username)
				if err != nil || player == nil {
					t.Fatalf("failed to find player: %v", err)
				}
				return &model.User{UserName: username}, player
			}
			gmUser, gmPlayer := signup("gm")
			user1, player1 := signup("participant1")
			user2, player2 := signup("participant2")
			outsider, _ := signup("outsider")

			gameRepo := db.NewGameRepository(&database)
			newGame := newGameForFixture(gmPlayer.ID)
			newGame.Settings.Rule.IsGameMasterViewAllMessages = viewAll
			game, err := gameRepo.RegisterGame(ctx, newGame)
			if err != nil || game == nil {
				t.Fatalf("failed to register game: %v", err)
			}
			p1 := registerParticipant(ctx, t, database, game.ID, player1)
			p2 := registerParticipant(ctx, t, database, game.ID, player2)

			messageRepo := db.NewMessageRepository(&database)
			sender := func(p *model.GameParticipant) *model.MessageSender {
				return &model.MessageSender{GameParticipantID: p.ID, SenderName: p.Name}
			}
			receiver := func(p *model.GameParticipant) *model.MessageReceiver {
				return &model.MessageReceiver{GameParticipantID: p.ID, ReceiverName: p.Name}
			}
			for _, m := range []model.Message{
				{Type: model.MessageTypeTalkNormal, Sender: sender(p1)},
				{Type: model.MessageTypeDescription, Sender: sender(p2)},
				{Type: model.MessageTypeSystemPublic},
				{Type: model.MessageTypeSystemPrivate, Receiver: receiver(p1)},
				{Type: model.MessageTypeMonologue, Sender: sender(p1)},
				{Type: model.MessageTypeMonologue, Sender: sender(p2)},
				{Type: model.MessageTypeSecret, Sender: sender(p1), Receiver: receiver(p2)},
				{Type: model.MessageTypeSecret, Sender: sender(p2), Receiver: receiver(p1)},
			} {
				m.GamePeriodID = game.Periods[0].ID
				m.Content = model.MessageContent{Text: "test"}
				if err := messageRepo.RegisterMessage(ctx, game.ID, m); err != nil {
					t.Fatalf("failed to register message: %v", err)
				}
			}

			gmDomainService := dom_service.NewGameMasterDomainService()
			u := usecase.NewMessageUsecase(
				app_service.NewMessageService(messageRepo, nil, nil),
				app_service.NewGameService(gameRepo, db.NewGameParticipantRepository(&database), nil),
				app_service.NewPlayerService(playerRepo, userRepo),
				dom_service.NewMessageDomainService(gmDomainService),
				gmDomainService,
				nil,
			)
			all, err := messageRepo.FindMessages(ctx, game.ID, model.MessagesQuery{}, nil)
			if err != nil || len(all.List) != 8 {
				t.Fatalf("failed to find all messages: %v %d", err, len(all.List))
			}

			viewers := map[string]*model.User{
				"未ログイン": nil, "参加者1": user1, "参加者2": user2, "未参加": outsider, "GM": gmUser,
			}
			for name, user := range viewers {
				listed, err := u.FindMessages(ctx, game.ID, model.MessagesQuery{}, user)
				if err != nil {
					t.Fatalf("%s: FindMessages: %v", name, err)
				}
				var single []uint64
				for _, m := range all.List {
					found, err := u.FindMessage(ctx, game.ID, m.ID, user)
					if err != nil {
						t.Fatalf("%s: FindMessage: %v", name, err)
					}
					if found != nil {
						single = append(single, m.ID)
					}
				}
				listedIDs := []uint64{}
				for _, m := range listed.List {
					listedIDs = append(listedIDs, m.ID)
				}
				sort.Slice(listedIDs, func(i, j int) bool { return listedIDs[i] < listedIDs[j] })
				sort.Slice(single, func(i, j int) bool { return single[i] < single[j] })
				if len(listedIDs) != len(single) {
					t.Errorf("viewAll=%v %s: list=%v single=%v", viewAll, name, listedIDs, single)
					continue
				}
				for i := range single {
					if listedIDs[i] != single[i] {
						t.Errorf("viewAll=%v %s: list=%v single=%v", viewAll, name, listedIDs, single)
						break
					}
				}
			}
		})
	}
}
