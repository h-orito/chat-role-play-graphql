package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
	"testing"
)

type fakeProfileGameService struct {
	app_service.GameService
	game        model.Game
	participant model.GameParticipant
	profile     model.GameParticipantProfile
}

func (f *fakeProfileGameService) FindGame(_ context.Context, ID uint32) (*model.Game, error) {
	if ID != f.game.ID {
		return nil, nil
	}
	return &f.game, nil
}

func (f *fakeProfileGameService) FindGameParticipant(_ context.Context, query model.GameParticipantQuery) (*model.GameParticipant, error) {
	if query.ID == nil || *query.ID != f.participant.ID {
		return nil, nil
	}
	return &f.participant, nil
}

func (f *fakeProfileGameService) FindGameParticipantProfile(_ context.Context, participantID uint32) (*model.GameParticipantProfile, error) {
	if participantID != f.profile.GameParticipantID {
		return nil, nil
	}
	return &f.profile, nil
}

type fakeProfilePlayerService struct {
	fakePlayerService
}

func (f *fakeProfilePlayerService) Find(_ context.Context, ID uint32) (*model.Player, error) {
	for _, p := range f.players {
		if p.ID == ID {
			return &p, nil
		}
	}
	return nil, nil
}

// プレイヤー: owner(参加者本人) / other(他の参加者) / gm(GM) / admin(管理者)
func newParticipantPlayerTestUsecase(status model.GameStatus, isPlayerOpen bool) *gameUsecase {
	gmService := dom_service.NewGameMasterDomainService()
	return &gameUsecase{
		gameService: &fakeProfileGameService{
			game: model.Game{
				ID:          10,
				Status:      status,
				GameMasters: []model.GameMaster{{ID: 1, PlayerID: 3}},
			},
			participant: model.GameParticipant{ID: 100, GameID: 10, PlayerID: 1},
			profile:     model.GameParticipantProfile{GameParticipantID: 100, IsPlayerOpen: isPlayerOpen},
		},
		playerService: &fakeProfilePlayerService{fakePlayerService{
			players: map[string]model.Player{
				"owner": {ID: 1, Name: "owner-player"},
				"other": {ID: 2, Name: "other-player"},
				"gm":    {ID: 3, Name: "gm-player"},
				"admin": {ID: 4, Name: "admin-player"},
			},
			authorities: map[uint32][]model.PlayerAuthority{
				4: {model.AuthorityAdmin},
			},
		}},
		gameMasterDomainService:  gmService,
		participateDomainService: dom_service.NewParticipateDomainService(gmService),
	}
}

func TestFindParticipantPlayerVisibility(t *testing.T) {
	cases := []struct {
		name         string
		user         *model.User
		status       model.GameStatus
		isPlayerOpen bool
		viewable     bool
	}{
		{"非公開・進行中: 未ログインには見せない", nil, model.GameStatusProgress, false, false},
		{"非公開・進行中: 他の参加者には見せない", &model.User{UserName: "other"}, model.GameStatusProgress, false, false},
		{"非公開・進行中: プレイヤー未登録のユーザーには見せない", &model.User{UserName: "unknown"}, model.GameStatusProgress, false, false},
		{"非公開・進行中: 本人には見せる", &model.User{UserName: "owner"}, model.GameStatusProgress, false, true},
		{"非公開・進行中: GM には見せる", &model.User{UserName: "gm"}, model.GameStatusProgress, false, true},
		{"非公開・進行中: 管理者には見せる", &model.User{UserName: "admin"}, model.GameStatusProgress, false, true},
		{"公開・進行中: 未ログインにも見せる", nil, model.GameStatusProgress, true, true},
		{"非公開・エピローグ: 未ログインにも見せる", nil, model.GameStatusEpilogue, false, true},
		{"非公開・終了: 未ログインにも見せる", nil, model.GameStatusFinished, false, true},
		{"非公開・中止: 未ログインにも見せる", nil, model.GameStatusCancelled, false, true},
	}
	ctx := context.Background()
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			u := newParticipantPlayerTestUsecase(c.status, c.isPlayerOpen)

			_, _, player, err := u.FindParticipantProfile(ctx, 100, c.user)
			if err != nil {
				t.Fatalf("FindParticipantProfile: %v", err)
			}
			if c.viewable && (player == nil || player.Name != "owner-player") {
				t.Errorf("FindParticipantProfile: want owner-player, got %v", player)
			}
			if !c.viewable && player != nil {
				t.Errorf("FindParticipantProfile: want nil, got %v", player)
			}

			player, err = u.FindParticipantPlayer(ctx, 100, c.user)
			if err != nil {
				t.Fatalf("FindParticipantPlayer: %v", err)
			}
			if c.viewable && (player == nil || player.Name != "owner-player") {
				t.Errorf("FindParticipantPlayer: want owner-player, got %v", player)
			}
			if !c.viewable && player != nil {
				t.Errorf("FindParticipantPlayer: want nil, got %v", player)
			}
		})
	}
}

func TestFindParticipantProfileNotFound(t *testing.T) {
	u := newParticipantPlayerTestUsecase(model.GameStatusProgress, false)
	if _, _, _, err := u.FindParticipantProfile(context.Background(), 999, nil); err == nil {
		t.Errorf("want error for unknown participant")
	}
}
