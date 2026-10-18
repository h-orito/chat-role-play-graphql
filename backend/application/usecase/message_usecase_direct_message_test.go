package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
	"testing"
)

// 必要なメソッドだけ実装し、それ以外は埋め込んだ nil インターフェースに任せる (呼ばれたら panic)
type fakePlayerService struct {
	app_service.PlayerService
	players     map[string]model.Player
	authorities map[uint32][]model.PlayerAuthority
}

func (f *fakePlayerService) FindByUserName(_ context.Context, userName string) (*model.Player, error) {
	p, ok := f.players[userName]
	if !ok {
		return nil, nil
	}
	return &p, nil
}

func (f *fakePlayerService) FindAuthorities(_ context.Context, playerID uint32) ([]model.PlayerAuthority, error) {
	return f.authorities[playerID], nil
}

type fakeGameService struct {
	app_service.GameService
	game         model.Game
	participants map[uint32]model.GameParticipant // playerID -> participant
}

func (f *fakeGameService) FindGame(_ context.Context, ID uint32) (*model.Game, error) {
	if ID != f.game.ID {
		return nil, nil
	}
	return &f.game, nil
}

func (f *fakeGameService) FindGameParticipant(_ context.Context, query model.GameParticipantQuery) (*model.GameParticipant, error) {
	p, ok := f.participants[*query.PlayerID]
	if !ok || *query.GameID != f.game.ID {
		return nil, nil
	}
	return &p, nil
}

type fakeMessageService struct {
	app_service.MessageService
	groups []model.GameParticipantGroup
	dms    []model.DirectMessage
}

func (f *fakeMessageService) FindGameParticipantGroups(_ context.Context, query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	var result []model.GameParticipantGroup
	for _, g := range f.groups {
		if query.IDs != nil && !containsUint32(*query.IDs, g.ID) {
			continue
		}
		if query.MemberGroupParticipantID != nil && !containsUint32(g.MemberIDs, *query.MemberGroupParticipantID) {
			continue
		}
		result = append(result, g)
	}
	return result, nil
}

func (f *fakeMessageService) FindDirectMessages(_ context.Context, _ uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	var list []model.DirectMessage
	for _, dm := range f.dms {
		if dm.GameParticipantGroupID == *query.GameParticipantGroupID {
			list = append(list, dm)
		}
	}
	return model.DirectMessages{List: list}, nil
}

func (f *fakeMessageService) FindDirectMessage(_ context.Context, _ uint32, ID uint64) (*model.DirectMessage, error) {
	for _, dm := range f.dms {
		if dm.ID == ID {
			return &dm, nil
		}
	}
	return nil, nil
}

func (f *fakeMessageService) FindDirectMessageFavoriteGameParticipants(_ context.Context, _ uint32, _ uint64) (model.GameParticipants, error) {
	return model.GameParticipants{List: []model.GameParticipant{{ID: 1}}}, nil
}

func containsUint32(ids []uint32, id uint32) bool {
	for _, i := range ids {
		if i == id {
			return true
		}
	}
	return false
}

const (
	dmTestGameID  uint32 = 10
	dmTestGroupID uint32 = 100
)

// プレイヤー: member(参加者1, グループ所属) / outsider(参加者2, 非所属) / gm(GM, 非参加) / admin(管理者, 非参加) / stranger(未参加)
func newDirectMessageTestUsecase(viewAll bool) *messageUsecase {
	game := model.Game{
		ID:          dmTestGameID,
		Status:      model.GameStatusProgress,
		GameMasters: []model.GameMaster{{ID: 1, PlayerID: 3}},
	}
	game.Settings.Rule.IsGameMasterViewAllMessages = viewAll
	return &messageUsecase{
		messageService: &fakeMessageService{
			groups: []model.GameParticipantGroup{{ID: dmTestGroupID, MemberIDs: []uint32{1}}},
			dms:    []model.DirectMessage{{ID: 1000, GameParticipantGroupID: dmTestGroupID}},
		},
		gameService: &fakeGameService{
			game: game,
			participants: map[uint32]model.GameParticipant{
				1: {ID: 1},
				2: {ID: 2},
			},
		},
		playerService: &fakePlayerService{
			players: map[string]model.Player{
				"member":   {ID: 1},
				"outsider": {ID: 2},
				"gm":       {ID: 3},
				"admin":    {ID: 4},
				"stranger": {ID: 5},
			},
			authorities: map[uint32][]model.PlayerAuthority{
				4: {model.AuthorityAdmin},
			},
		},
		gameMasterDomainService: dom_service.NewGameMasterDomainService(),
	}
}

func TestDirectMessageViewPermission(t *testing.T) {
	cases := []struct {
		name     string
		user     *model.User
		viewAll  bool
		viewable bool
	}{
		{"未ログインは見られない", nil, true, false},
		{"グループのメンバーは見られる", &model.User{UserName: "member"}, false, true},
		{"同じゲームの非メンバーは見られない", &model.User{UserName: "outsider"}, true, false},
		{"ゲーム未参加者は見られない", &model.User{UserName: "stranger"}, true, false},
		{"GM は全発言閲覧 ON なら見られる", &model.User{UserName: "gm"}, true, true},
		{"GM でも全発言閲覧 OFF なら見られない", &model.User{UserName: "gm"}, false, false},
		{"管理者は全発言閲覧 ON なら見られる", &model.User{UserName: "admin"}, true, true},
		{"管理者でも全発言閲覧 OFF なら見られない", &model.User{UserName: "admin"}, false, false},
		{"プレイヤー未登録のユーザーは見られない", &model.User{UserName: "unknown"}, true, false},
	}
	ctx := context.Background()
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			u := newDirectMessageTestUsecase(c.viewAll)
			groupID := dmTestGroupID

			dms, err := u.FindDirectMessages(ctx, dmTestGameID, model.DirectMessagesQuery{GameParticipantGroupID: &groupID}, c.user)
			if c.viewable && (err != nil || len(dms.List) != 1) {
				t.Errorf("FindDirectMessages: want 1 message, got %v, err=%v", dms.List, err)
			}
			if !c.viewable && (err == nil || len(dms.List) != 0) {
				t.Errorf("FindDirectMessages: want error, got %v, err=%v", dms.List, err)
			}

			dm, err := u.FindDirectMessage(ctx, dmTestGameID, 1000, c.user)
			if c.viewable && (err != nil || dm == nil) {
				t.Errorf("FindDirectMessage: want message, got %v, err=%v", dm, err)
			}
			if !c.viewable && (err == nil || dm != nil) {
				t.Errorf("FindDirectMessage: want error, got %v, err=%v", dm, err)
			}

			pts, err := u.FindDirectMessageFavoriteGameParticipants(ctx, dmTestGameID, 1000, c.user)
			if c.viewable && (err != nil || len(pts.List) != 1) {
				t.Errorf("FindDirectMessageFavoriteGameParticipants: want 1 participant, got %v, err=%v", pts.List, err)
			}
			if !c.viewable && (err == nil || len(pts.List) != 0) {
				t.Errorf("FindDirectMessageFavoriteGameParticipants: want error, got %v, err=%v", pts.List, err)
			}
		})
	}
}

func TestFindDirectMessagesRejectsGroupOfOtherGame(t *testing.T) {
	u := newDirectMessageTestUsecase(false)
	// 他ゲームのグループ ID を指定しても、自ゲームのグループとしては見つからないので拒否される
	otherGroupID := uint32(999)
	_, err := u.FindDirectMessages(context.Background(), dmTestGameID,
		model.DirectMessagesQuery{GameParticipantGroupID: &otherGroupID}, &model.User{UserName: "member"})
	if err == nil {
		t.Errorf("want error for group not belonging to the caller")
	}
}

func TestFindDirectMessagesRequiresGroup(t *testing.T) {
	u := newDirectMessageTestUsecase(true)
	_, err := u.FindDirectMessages(context.Background(), dmTestGameID, model.DirectMessagesQuery{}, &model.User{UserName: "gm"})
	if err == nil {
		t.Errorf("want error when participant group is not specified")
	}
}

func TestFindGameParticipantGroupsPermission(t *testing.T) {
	memberID := uint32(1) // member の参加者 ID
	outsiderID := uint32(2)
	cases := []struct {
		name     string
		user     *model.User
		viewAll  bool
		memberID *uint32
		viewable bool
	}{
		{"未ログインは参加者指定でも見られない", nil, true, &memberID, false},
		{"自分の参加者 ID なら見られる", &model.User{UserName: "member"}, false, &memberID, true},
		{"他人の参加者 ID は見られない", &model.User{UserName: "outsider"}, false, &memberID, false},
		{"ゲーム未参加者は参加者指定でも見られない", &model.User{UserName: "stranger"}, false, &memberID, false},
		{"参加者でも全件一覧は見られない", &model.User{UserName: "member"}, true, nil, false},
		{"GM は全発言閲覧 ON なら全件一覧を見られる", &model.User{UserName: "gm"}, true, nil, true},
		{"GM は全発言閲覧 ON なら他人の参加者指定も見られる", &model.User{UserName: "gm"}, true, &memberID, true},
		{"GM でも全発言閲覧 OFF なら全件一覧は見られない", &model.User{UserName: "gm"}, false, nil, false},
		{"GM でも全発言閲覧 OFF なら他人の参加者指定は見られない", &model.User{UserName: "gm"}, false, &outsiderID, false},
		{"管理者は全発言閲覧 ON なら全件一覧を見られる", &model.User{UserName: "admin"}, true, nil, true},
		{"管理者でも全発言閲覧 OFF なら全件一覧は見られない", &model.User{UserName: "admin"}, false, nil, false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			u := newDirectMessageTestUsecase(c.viewAll)
			groups, err := u.FindGameParticipantGroups(context.Background(), model.GameParticipantGroupsQuery{
				GameID:                   dmTestGameID,
				MemberGroupParticipantID: c.memberID,
			}, c.user)
			if c.viewable && (err != nil || len(groups) != 1) {
				t.Errorf("want 1 group, got %v, err=%v", groups, err)
			}
			if !c.viewable && (err == nil || len(groups) != 0) {
				t.Errorf("want error, got %v, err=%v", groups, err)
			}
		})
	}
}
