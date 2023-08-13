package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"
	"log"
)

type GameUsecase interface {
	// game
	FindGames(query model.GamesQuery) (games []model.Game, err error)
	FindGame(ID uint32) (game *model.Game, err error)
	FindGamePeriods(IDs []uint32) (periods []model.GamePeriod, err error)
	RegisterGame(ctx context.Context, user model.User, game model.Game) (registered *model.Game, err error)
	RegisterGameMaster(ctx context.Context, user model.User, gameID uint32, playerID uint32, isProducer bool) (gameMaster *model.GameMaster, err error)
	UpdateGameMaster(ctx context.Context, user model.User, gameID uint32, gameMasterID uint32, isProducer bool) (err error)
	DeleteGameMaster(ctx context.Context, user model.User, gameID uint32, gameMasterID uint32) (err error)
	UpdateGameStatus(ctx context.Context, user model.User, gameID uint32, status model.GameStatus) (err error)
	UpdateGameSetting(ctx context.Context, user model.User, gameID uint32, gameName string, settings model.GameSettings) (err error)
	UpdateGamePeriod(ctx context.Context, user model.User, gameID uint32, period model.GamePeriod) (err error)
	ChangePeriodIfNeeded(ctx context.Context, gameID uint32) error
	// game participant
	FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error)
	FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error)
	FindMyGameParticipant(gameID uint32, user model.User) (participant *model.GameParticipant, err error)
	Participate(ctx context.Context, gameID uint32, user model.User, charaID *uint32, participant model.GameParticipant, password *string) (saved *model.GameParticipant, err error)
	Leave(ctx context.Context, gameID uint32, user model.User) (err error)
	// game participant profile
	FindParticipantProfile(participantID uint32) (profile *model.GameParticipantProfile, participant *model.GameParticipant, err error)
	UpdateParticipantProfile(ctx context.Context, gameID uint32, user model.User, name string, memo *string, iconId *uint32, profile model.GameParticipantProfile) (err error)
	// game participant icon
	FindGameParticipantIcons(model.GameParticipantIconsQuery) (icons []model.GameParticipantIcon, err error)
	RegisterGameParticipantIcon(ctx context.Context, gameID uint32, user model.User, icon model.GameParticipantIcon) (saved *model.GameParticipantIcon, err error)
	UpdateGameParticipantIcon(ctx context.Context, gameID uint32, user model.User, icon model.GameParticipantIcon) error
	DeleteGameParticipantIcon(ctx context.Context, gameID uint32, user model.User, iconID uint32) (err error)
	// game participant setting
	FindParticipantSetting(gameID uint32, user model.User) (setting *model.GameParticipantNotification, err error)
	UpdateParticipantSetting(ctx context.Context, gameID uint32, user model.User, setting model.GameParticipantNotification) (err error)
	// game participant follow
	FindParticipantFollows(participantID uint32) (follows []model.GameParticipant, err error)
	FindParticipantFollowers(participantID uint32) (follows []model.GameParticipant, err error)
	FollowParticipant(ctx context.Context, gameID uint32, user model.User, targetParticipantID uint32) (err error)
	UnfollowParticipant(ctx context.Context, gameID uint32, user model.User, targetParticipantID uint32) (err error)
	// game participant diary
	FindParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error)
	FindParticipantDiary(ID uint32) (diary *model.GameParticipantDiary, err error)
	RegisterParticipantDiary(ctx context.Context, gameID uint32, user model.User, diary model.GameParticipantDiary) (*model.GameParticipantDiary, error)
	UpdateParticipantDiary(ctx context.Context, gameID uint32, user model.User, diaryID uint32, diary model.GameParticipantDiary) error
}

type gameUsecase struct {
	gameService              app_service.GameService
	playerService            app_service.PlayerService
	charaService             app_service.CharaService
	gameMasterDomainService  dom_service.GameMasterDomainService
	participateDomainService dom_service.ParticipateDomainService
	transaction              Transaction
}

func NewGameUsecase(
	gameService app_service.GameService,
	playerService app_service.PlayerService,
	charaService app_service.CharaService,
	gameMasterDomainService dom_service.GameMasterDomainService,
	participateDomainService dom_service.ParticipateDomainService,
	tx Transaction,
) GameUsecase {
	return &gameUsecase{
		gameService:              gameService,
		playerService:            playerService,
		charaService:             charaService,
		gameMasterDomainService:  gameMasterDomainService,
		participateDomainService: participateDomainService,
		transaction:              tx,
	}
}

func (g *gameUsecase) FindGames(query model.GamesQuery) (games []model.Game, err error) {
	return g.gameService.FindGames(query)
}

func (g *gameUsecase) FindGame(ID uint32) (game *model.Game, err error) {
	return g.gameService.FindGame(ID)
}

func (g *gameUsecase) FindGamePeriods(IDs []uint32) (periods []model.GamePeriod, err error) {
	return g.gameService.FindGamePeriods(IDs)
}

func (g *gameUsecase) RegisterGame(ctx context.Context, user model.User, game model.Game) (registered *model.Game, err error) {
	gm, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		game.GameMasters = []model.GameMaster{
			{
				PlayerID:   player.ID,
				IsProducer: false,
			},
		}
		return g.gameService.RegisterGame(ctx, game)
	})
	if err != nil {
		return nil, err
	}
	return gm.(*model.Game), nil
}

func (g *gameUsecase) RegisterGameMaster(
	ctx context.Context,
	user model.User,
	gameID uint32,
	playerID uint32,
	isProducer bool,
) (gameMaster *model.GameMaster, err error) {
	gm, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if g == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		if !g.gameMasterDomainService.IsGameMaster(*game, *player, authorities) {
			return nil, fmt.Errorf("you are not game master")
		}
		return g.gameService.RegisterGameMaster(ctx, gameID, playerID, isProducer)
	})
	if err != nil {
		return nil, err
	}
	return gm.(*model.GameMaster), nil
}

func (g *gameUsecase) UpdateGameMaster(
	ctx context.Context,
	user model.User,
	gameID uint32,
	gameMasterID uint32,
	isProducer bool,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if g == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		err = g.gameMasterDomainService.AssertModifyGameMaster(*game, *player, authorities)
		if err != nil {
			return nil, err
		}
		return nil, g.gameService.UpdateGameMaster(ctx, model.GameMaster{
			ID:         gameMasterID,
			IsProducer: isProducer,
		})
	})
	return err
}

func (g *gameUsecase) DeleteGameMaster(
	ctx context.Context,
	user model.User,
	gameID uint32,
	gameMasterID uint32,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if g == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		err = g.gameMasterDomainService.AssertModifyGameMaster(*game, *player, authorities)
		if err != nil {
			return nil, err
		}
		log.Printf("player id: %d delete game master id %d", player.ID, gameMasterID)

		return nil, g.gameService.DeleteGameMaster(ctx, gameMasterID)
	})
	return err
}

func (g *gameUsecase) UpdateGameStatus(
	ctx context.Context,
	user model.User,
	gameID uint32,
	status model.GameStatus,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if g == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		if !g.gameMasterDomainService.IsGameMaster(*game, *player, authorities) {
			return nil, fmt.Errorf("you are not game master")
		}

		return nil, g.gameService.UpdateGameStatus(ctx, gameID, status)
	})
	return err
}

func (g *gameUsecase) UpdateGameSetting(
	ctx context.Context,
	user model.User,
	gameID uint32,
	gameName string,
	settings model.GameSettings,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if g == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		if !g.gameMasterDomainService.IsGameMaster(*game, *player, authorities) {
			return nil, fmt.Errorf("you are not game master")
		}

		return nil, g.gameService.UpdateGameSettings(ctx, gameID, gameName, settings)
	})
	return err
}

func (g *gameUsecase) UpdateGamePeriod(
	ctx context.Context,
	user model.User,
	gameID uint32,
	period model.GamePeriod,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if g == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		err = g.gameMasterDomainService.AssertModifyGameMaster(*game, *player, authorities)
		if err != nil {
			return nil, err
		}

		return nil, g.gameService.UpdateGamePeriod(ctx, gameID, period)
	})
	return err
}

func (g *gameUsecase) ChangePeriodIfNeeded(ctx context.Context, gameID uint32) error {
	_, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return nil, g.gameService.ChangePeriodIfNeeded(ctx, gameID)
	})
	return err
}

func (g *gameUsecase) FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error) {
	return g.gameService.FindGameParticipants(query)
}

func (g *gameUsecase) FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error) {
	return g.gameService.FindGameParticipant(query)
}

func (g *gameUsecase) FindMyGameParticipant(gameID uint32, user model.User) (participant *model.GameParticipant, err error) {
	return g.findMyGameParticipant(gameID, user)
}

func (g *gameUsecase) Participate(
	ctx context.Context,
	gameID uint32,
	user model.User,
	charaID *uint32,
	participant model.GameParticipant,
	password *string,
) (saved *model.GameParticipant, err error) {
	p, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		game, err := g.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if game == nil {
			return nil, fmt.Errorf("game not found")
		}
		player, err := g.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		if player == nil {
			return nil, fmt.Errorf("player not found")
		}
		authorities, err := g.playerService.FindAuthorities(player.ID)
		if err != nil {
			return nil, err
		}
		err = g.participateDomainService.AssertParticipate(*game, *player, authorities, password)
		if err != nil {
			return nil, err
		}
		return g.gameService.Participate(ctx, gameID, model.GameParticipant{
			Name:     participant.Name,
			PlayerID: player.ID,
		})
	})
	if err != nil {
		return nil, err
	}
	return p.(*model.GameParticipant), nil
}

func (g *gameUsecase) Leave(ctx context.Context, gameID uint32, user model.User) (err error) {
	// TODO: implement
	return fmt.Errorf("not yet implemented")
}

func (g *gameUsecase) FindParticipantProfile(participantID uint32) (profile *model.GameParticipantProfile, participant *model.GameParticipant, err error) {
	profile, err = g.gameService.FindGameParticipantProfile(participantID)
	if err != nil {
		return nil, nil, err
	}
	participant, err = g.gameService.FindGameParticipant(model.GameParticipantQuery{
		ID: &participantID,
	})
	if err != nil {
		return nil, nil, err
	}
	return profile, participant, nil
}

func (g *gameUsecase) UpdateParticipantProfile(
	ctx context.Context,
	gameID uint32,
	user model.User,
	name string,
	memo *string,
	iconID *uint32,
	profile model.GameParticipantProfile,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		if err := g.gameService.UpdateParticipant(ctx, myself.ID, name, memo, iconID); err != nil {
			return nil, err
		}
		return nil, g.gameService.UpdateGameParticipantProfile(ctx, myself.ID, model.GameParticipantProfile{
			GameParticipantID: myself.ID,
			ProfileImageURL:   profile.ProfileImageURL,
			Introduction:      profile.Introduction,
		})
	})
	return err
}

func (g *gameUsecase) FindGameParticipantIcons(query model.GameParticipantIconsQuery) (icons []model.GameParticipantIcon, err error) {
	return g.gameService.FindGameParticipantIcons(query)
}

func (g *gameUsecase) RegisterGameParticipantIcon(ctx context.Context, gameID uint32, user model.User, icon model.GameParticipantIcon) (saved *model.GameParticipantIcon, err error) {
	i, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		return g.gameService.RegisterGameParticipantIcon(ctx, myself.ID, icon)
	})
	if err != nil {
		return nil, err
	}
	return i.(*model.GameParticipantIcon), nil
}

func (g *gameUsecase) UpdateGameParticipantIcon(ctx context.Context, gameID uint32, user model.User, icon model.GameParticipantIcon) error {
	_, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		return nil, g.gameService.UpdateGameParticipantIcon(ctx, icon)
	})
	return err
}

func (g *gameUsecase) DeleteGameParticipantIcon(ctx context.Context, gameID uint32, user model.User, iconID uint32) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		icons, err := g.gameService.FindGameParticipantIcons(model.GameParticipantIconsQuery{
			GameParticipantID: &myself.ID,
		})
		if err != nil {
			return nil, err
		}
		if array.None(icons, func(i model.GameParticipantIcon) bool {
			return i.ID == iconID
		}) {
			return nil, fmt.Errorf("icon not found")
		}
		return nil, g.gameService.DeleteGameParticipantIcon(ctx, iconID)
	})
	return err
}

func (g *gameUsecase) FindParticipantSetting(gameID uint32, user model.User) (setting *model.GameParticipantNotification, err error) {
	myself, err := g.findMyGameParticipant(gameID, user)
	if err != nil {
		return nil, err
	}
	if myself == nil {
		return nil, fmt.Errorf("not found")
	}
	return g.gameService.FindGameParticipantNotificationSetting(myself.ID)
}

func (g *gameUsecase) UpdateParticipantSetting(
	ctx context.Context,
	gameID uint32,
	user model.User,
	setting model.GameParticipantNotification,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("not found")
		}
		return nil, g.gameService.UpdateGameParticipantNotificationSetting(ctx, myself.ID, setting)
	})
	return err
}

func (g *gameUsecase) FindParticipantFollows(participantID uint32) (follows []model.GameParticipant, err error) {
	return g.gameService.FindGameParticipantFollows(participantID)
}

func (g *gameUsecase) FindParticipantFollowers(participantID uint32) (follows []model.GameParticipant, err error) {
	return g.gameService.FindGameParticipantFollowers(participantID)
}

func (g *gameUsecase) FollowParticipant(
	ctx context.Context,
	gameID uint32,
	user model.User,
	targetParticipantID uint32,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		return nil, g.gameService.FollowGameParticipant(ctx, myself.ID, targetParticipantID)
	})
	return err
}

func (g *gameUsecase) UnfollowParticipant(
	ctx context.Context,
	gameID uint32,
	user model.User,
	targetParticipantID uint32,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		return nil, g.gameService.UnfollowGameParticipant(ctx, myself.ID, targetParticipantID)
	})
	return err
}

func (g *gameUsecase) FindParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error) {
	return g.gameService.FindGameParticipantDiaries(query)
}

func (g *gameUsecase) FindParticipantDiary(ID uint32) (*model.GameParticipantDiary, error) {
	return g.gameService.FindGameParticipantDiary(ID)
}

func (g *gameUsecase) RegisterParticipantDiary(
	ctx context.Context,
	gameID uint32,
	user model.User,
	diary model.GameParticipantDiary,
) (*model.GameParticipantDiary, error) {
	d, err := g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		return g.gameService.UpsertGameParticipantDiary(ctx, gameID, model.GameParticipantDiary{
			GameParticipantID: myself.ID,
			GamePeriodID:      diary.GamePeriodID,
			Title:             diary.Title,
			Body:              diary.Body,
		})
	})
	if err != nil {
		return nil, err
	}
	return d.(*model.GameParticipantDiary), nil
}

func (g *gameUsecase) UpdateParticipantDiary(
	ctx context.Context,
	gameID uint32,
	user model.User,
	diaryID uint32,
	diary model.GameParticipantDiary,
) (err error) {
	_, err = g.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := g.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, fmt.Errorf("you are not participating in this game")
		}
		existing, err := g.FindParticipantDiary(diaryID)
		if err != nil {
			return nil, err
		}
		if existing.GameParticipantID != myself.ID {
			return nil, errors.New("you can't update other's diary")
		}
		return g.gameService.UpsertGameParticipantDiary(ctx, diaryID, model.GameParticipantDiary{
			ID:                diaryID,
			GameParticipantID: myself.ID,
			Title:             diary.Title,
			Body:              diary.Body,
		})
	})
	return err
}

func (g *gameUsecase) findMyGameParticipant(gameID uint32, user model.User) (*model.GameParticipant, error) {
	player, err := g.playerService.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	return g.gameService.FindGameParticipant(model.GameParticipantQuery{
		GameID:   &gameID,
		PlayerID: &(player.ID),
	})
}
