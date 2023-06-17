package graphql

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"
)

func (r *mutationResolver) registerGame(ctx context.Context, input gqlmodel.NewGame) (*gqlmodel.RegisterGamePayload, error) {
	game, err := r.gameUsecase.RegisterGame(ctx, input.MapToGame())
	if err != nil {
		return nil, err
	}
	g, err := r.findGame(game.ID)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGamePayload{
		Game: g,
	}, nil
}

func (r *mutationResolver) registerGameMaster(ctx context.Context, input gqlmodel.NewGameMaster) (*gqlmodel.RegisterGameMasterPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	playerId, err := idToUint32(input.PlayerID)
	if err != nil {
		return nil, err
	}
	saved, err := r.gameUsecase.RegisterGameMaster(ctx, gameId, playerId, input.IsProducer)
	if err != nil {
		return nil, err
	}
	player, err := r.playerUsecase.Find(saved.PlayerID)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameMasterPayload{
		GameMaster: gqlmodel.MapToGameMaster(saved, player),
	}, nil
}

func (r *mutationResolver) updateGameMaster(ctx context.Context, input gqlmodel.UpdateGameMaster) (*gqlmodel.UpdateGameMasterPayload, error) {
	gameMasterId, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGameMaster(ctx, gameMasterId, input.IsProducer); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameMasterPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameMaster(ctx context.Context, input gqlmodel.DeleteGameMaster) (*gqlmodel.DeleteGameMasterPayload, error) {
	gameMasterId, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.DeleteGameMaster(ctx, gameMasterId); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteGameMasterPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGameStatus(ctx context.Context, input gqlmodel.UpdateGameStatus) (*gqlmodel.UpdateGameStatusPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGameStatus(ctx, gameId, *model.GameStatusValueOf(input.Status.String())); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameStatusPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGameSetting(ctx context.Context, input gqlmodel.UpdateGameSetting) (*gqlmodel.UpdateGameSettingPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGameSetting(ctx, gameId, input.MapToGameSetting()); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameSettingPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGamePeriod(ctx context.Context, input gqlmodel.UpdateGamePeriod) (*gqlmodel.UpdateGamePeriodPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGamePeriod(ctx, gameId, model.GamePeriod{
		Name:    input.Name,
		StartAt: input.StartAt,
		EndAt:   input.EndAt,
	}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGamePeriodPayload{Ok: true}, nil
}

func (r *mutationResolver) registerGameParticipant(ctx context.Context, input gqlmodel.NewGameParticipant) (*gqlmodel.RegisterGameParticipantPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	charaId, err := idToUint32(input.CharaID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	saved, err := r.gameUsecase.Participate(ctx, gameId, model.GameParticipant{
		Name:     input.Name,
		PlayerID: player.ID,
		CharaID:  charaId,
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantPayload{
		GameParticipant: gqlmodel.MapToGameParticipant(*saved),
	}, nil
}

func (r *mutationResolver) updateGameParticipantProfile(ctx context.Context, input gqlmodel.UpdateGameParticipantProfile) (*gqlmodel.UpdateGameParticipantProfilePayload, error) {
	gameParticipantId, err := idToUint32(input.GameParticipantID)
	if err != nil {
		return nil, err
	}
	profile := model.GameParticipantProfile{
		GameParticipantID: gameParticipantId,
		IconURL:           input.IconURL,
		Introduction:      input.Introduction,
		Memo:              input.Memo,
	}
	if err := r.gameUsecase.UpdateParticipantProfile(ctx, gameParticipantId, input.Name, profile); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantProfilePayload{Ok: true}, nil
}

func (r *mutationResolver) updateGameParticipantSetting(ctx context.Context, input gqlmodel.UpdateGameParticipantSetting) (*gqlmodel.UpdateGameParticipantSettingPayload, error) {
	gameParticipantId, err := idToUint32(input.GameParticipantID)
	if err != nil {
		return nil, err
	}
	notification := model.GameParticipantNotification{
		GameParticipantID: gameParticipantId,
		DiscordWebhookUrl: input.Notification.DiscordWebhookURL,
		Game: model.GameNotificationSetting{
			Participate: input.Notification.Game.Participate,
			Start:       input.Notification.Game.Start,
		},
		Message: model.MessageNotificationSetting{
			Reply:         input.Notification.Message.Reply,
			DirectMessage: input.Notification.Message.DirectMessage,
			Keywords:      input.Notification.Message.Keywords,
		},
	}
	if err := r.gameUsecase.UpdateParticipantSetting(ctx, gameParticipantId, notification); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantSettingPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameParticipant(ctx context.Context, input gqlmodel.DeleteGameParticipant) (*gqlmodel.DeleteGameParticipantPayload, error) {
	participant, err := r.findMyGameParticipant(ctx, input.GameID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.Leave(ctx, participant.ID); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteGameParticipantPayload{Ok: true}, nil
}

func (r *mutationResolver) registerGameParticipantFollow(ctx context.Context, input gqlmodel.NewGameParticipantFollow) (*gqlmodel.RegisterGameParticipantFollowPayload, error) {
	participant, err := r.findMyGameParticipant(ctx, input.GameID)
	if err != nil {
		return nil, err
	}
	targetGameParticipantID, err := idToUint32(input.TargetGameParticipantID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.FollowParticipant(ctx, participant.ID, targetGameParticipantID); err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantFollowPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameParticipantFollow(ctx context.Context, input gqlmodel.DeleteGameParticipantFollow) (*gqlmodel.DeleteGameParticipantFollowPayload, error) {
	participant, err := r.findMyGameParticipant(ctx, input.GameID)
	if err != nil {
		return nil, err
	}
	targetGameParticipantID, err := idToUint32(input.TargetGameParticipantID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.UnfollowParticipant(ctx, participant.ID, targetGameParticipantID); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteGameParticipantFollowPayload{Ok: true}, nil
}

func (r *mutationResolver) registerGameParticipantDiary(ctx context.Context, input gqlmodel.NewGameParticipantDiary) (*gqlmodel.RegisterGameParticipantDiaryPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	periodID, err := idToUint32(input.PeriodID)
	if err != nil {
		return nil, err
	}
	participant, err := r.findMyGameParticipant(ctx, input.GameID)
	if err != nil {
		return nil, err
	}
	diary := model.GameParticipantDiary{
		GameParticipantID: participant.ID,
		GamePeriodID:      periodID,
		Title:             input.Title,
		Body:              input.Body,
	}
	saved, err := r.gameUsecase.RegisterParticipantDiary(ctx, gameID, diary)
	if err != nil {
		return nil, err
	}
	savedDiary, err := r.findDiary(gameID, saved.ID)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantDiaryPayload{
		GameParticipantDiary: savedDiary,
	}, nil
}

func (r *mutationResolver) updateGameParticipantDiary(ctx context.Context, input gqlmodel.UpdateGameParticipantDiary) (*gqlmodel.UpdateGameParticipantDiaryPayload, error) {
	diaryID, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	participant, err := r.findMyGameParticipant(ctx, input.GameID)
	if err != nil {
		return nil, err
	}
	existing, err := r.gameUsecase.FindParticipantDiary(diaryID)
	if err != nil {
		return nil, err
	}
	if existing.GameParticipantID != participant.ID {
		return nil, errors.New("you can't update other's diary")
	}
	diary := model.GameParticipantDiary{
		ID:    diaryID,
		Title: input.Title,
		Body:  input.Body,
	}
	if err = r.gameUsecase.UpdateParticipantDiary(ctx, diaryID, diary); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantDiaryPayload{
		Ok: true,
	}, nil
}

// ------------------------------

func (r *queryResolver) games(ctx context.Context, query gqlmodel.GamesQuery) ([]*gqlmodel.SimpleGame, error) {
	var intids *[]uint32
	var err error
	if query.Ids != nil {
		ids := array.Map(query.Ids, func(id string) uint32 {
			intid, e := idToUint32(id)
			if e != nil {
				err = e
			}
			return intid
		})
		if err != nil {
			return nil, err
		}
		intids = &ids
	}
	var paging *model.PagingQuery
	if query.Paging != nil {
		paging = &model.PagingQuery{
			PageSize:   query.Paging.PageSize,
			PageNumber: query.Paging.PageNumber,
			Desc:       query.Paging.IsDesc,
		}
	}
	q := model.GamesQuery{
		IDs:    intids,
		Name:   query.Name,
		Paging: paging,
	}
	games, err := r.gameUsecase.FindGames(q)
	if err != nil {
		return nil, err
	}
	return array.Map(games, func(g model.Game) *gqlmodel.SimpleGame {
		return gqlmodel.MapToSimpleGame(&g)
	}), nil
}

func (r *queryResolver) game(ctx context.Context, id string) (*gqlmodel.Game, error) {
	intid, err := idToUint32(id)
	if err != nil {
		return nil, err
	}
	return r.findGame(intid)
}

func (r *queryResolver) myGameParticipant(ctx context.Context, gameID string) (*gqlmodel.GameParticipant, error) {
	gameId, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	p, err := r.gameUsecase.FindMyGameParticipant(gameId, player.ID)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGameParticipant(*p), nil
}

func (r *queryResolver) gameParticipantProfile(ctx context.Context, participantID string) (*gqlmodel.GameParticipantProfile, error) {
	participantId, err := idToUint32(participantID)
	if err != nil {
		return nil, err
	}
	p, err := r.gameUsecase.FindParticipantProfile(participantId)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGameParticipantProfile(*p), nil
}

func (r *queryResolver) gameParticipantFollows(ctx context.Context, participantID string) ([]*gqlmodel.GameParticipant, error) {
	participantId, err := idToUint32(participantID)
	if err != nil {
		return nil, err
	}
	pts, err := r.gameUsecase.FindParticipantFollows(participantId)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGameParticipants(pts), nil
}

func (r *queryResolver) gameParticipantFollowers(ctx context.Context, participantID string) ([]*gqlmodel.GameParticipant, error) {
	participantId, err := idToUint32(participantID)
	if err != nil {
		return nil, err
	}
	pts, err := r.gameUsecase.FindParticipantFollowers(participantId)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGameParticipants(pts), nil
}

func (r *queryResolver) gameParticipantSetting(ctx context.Context, gameID string) (*gqlmodel.GameParticipantSetting, error) {
	gameId, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	p, err := r.gameUsecase.FindMyGameParticipant(gameId, player.ID)
	if err != nil {
		return nil, err
	}
	ps, err := r.gameUsecase.FindParticipantSetting(p.ID)

	return gqlmodel.MapToGameParticipantSetting(*ps), nil
}

func (r *queryResolver) gameDiaries(ctx context.Context, gameId string, query gqlmodel.GameDiariesQuery) ([]*gqlmodel.GameParticipantDiary, error) {
	gID, err := idToUint32(gameId)
	if err != nil {
		return nil, err
	}
	game, err := r.gameUsecase.FindGame(gID)
	if err != nil {
		return nil, err
	}
	q, err := r.MapToGameDiariesQuery(query)
	if err != nil {
		return nil, err
	}
	diaries, err := r.gameUsecase.FindParticipantDiaries(*q)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGameParticipantDiaries(diaries, game.Participants.List, game.Periods), nil
}

func (r *queryResolver) gameDiary(ctx context.Context, gameID string, diaryID string) (*gqlmodel.GameParticipantDiary, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	dID, err := idToUint32(diaryID)
	if err != nil {
		return nil, err
	}
	return r.findDiary(gID, dID)
}

func (r *queryResolver) MapToGameDiariesQuery(q gqlmodel.GameDiariesQuery) (*model.GameParticipantDiariesQuery, error) {
	var participantID *uint32
	if q.ParticipantID != nil {
		id, err := idToUint32(*q.ParticipantID)
		if err != nil {
			return nil, err
		}
		participantID = &id
	}
	var periodID *uint32
	if q.PeriodID != nil {
		id, err := idToUint32(*q.PeriodID)
		if err != nil {
			return nil, err
		}
		periodID = &id
	}
	return &model.GameParticipantDiariesQuery{
		GameParticipantID: participantID,
		GamePeriodID:      periodID,
	}, nil
}

// ----------------------------

func (r *Resolver) findGame(id uint32) (*gqlmodel.Game, error) {
	g, err := r.gameUsecase.FindGame(id)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGame(g), nil
}

func (r *Resolver) findMyGameParticipant(ctx context.Context, gameStringID string) (*model.GameParticipant, error) {
	gameID, err := idToUint32(gameStringID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	if player == nil {
		return nil, fmt.Errorf("player not found")
	}
	return r.gameUsecase.FindMyGameParticipant(gameID, player.ID)
}

// find participants by id
func (r *queryResolver) findGameParticipantById(ID uint32) (*gqlmodel.GameParticipant, error) {
	participant, err := r.gameUsecase.FindGameParticipant(model.GameParticipantQuery{ID: &ID})
	if err != nil {
		return nil, err
	}
	if participant == nil {
		return nil, nil
	}
	return gqlmodel.MapToGameParticipant(*participant), nil
}

// find participants by ids
func (r *queryResolver) findGameParticipantsByIDs(IDs []uint32) ([]*gqlmodel.GameParticipant, error) {
	participants, err := r.gameUsecase.FindGameParticipants(model.GameParticipantsQuery{IDs: &IDs})
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToGameParticipants(participants.List), nil
}

func (r *Resolver) findDiary(gameID uint32, diaryID uint32) (*gqlmodel.GameParticipantDiary, error) {
	game, err := r.gameUsecase.FindGame(gameID)
	if err != nil {
		return nil, err
	}
	diary, err := r.gameUsecase.FindParticipantDiary(diaryID)
	participant, err := r.gameUsecase.FindGameParticipant(model.GameParticipantQuery{
		GameID: game.ID,
		ID:     &diary.GameParticipantID,
	})
	if err != nil {
		return nil, err
	}
	period := array.Find(game.Periods, func(p model.GamePeriod) bool {
		return p.ID == diary.GamePeriodID
	})
	return gqlmodel.MapToGameParticipantDiary(*diary, participant, period), nil
}
