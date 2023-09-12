package graphql

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/graph-gophers/dataloader"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) registerGame(ctx context.Context, input gqlmodel.NewGame) (*gqlmodel.RegisterGamePayload, error) {
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	game, err := r.gameUsecase.RegisterGame(ctx, *user, input.MapToGame())
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGamePayload{
		Game: MapToGame(game),
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
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	saved, err := r.gameUsecase.RegisterGameMaster(ctx, *user, gameId, playerId, input.IsProducer)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameMasterPayload{
		GameMaster: MapToGameMaster(saved),
	}, nil
}

func (r *mutationResolver) updateGameMaster(ctx context.Context, input gqlmodel.UpdateGameMaster) (*gqlmodel.UpdateGameMasterPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	gameMasterId, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGameMaster(ctx, *user, gameID, gameMasterId, input.IsProducer); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameMasterPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameMaster(ctx context.Context, input gqlmodel.DeleteGameMaster) (*gqlmodel.DeleteGameMasterPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	gameMasterId, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	if err := r.gameUsecase.DeleteGameMaster(ctx, *user, gameID, gameMasterId); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteGameMasterPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGameStatus(ctx context.Context, input gqlmodel.UpdateGameStatus) (*gqlmodel.UpdateGameStatusPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGameStatus(ctx, *user, gameId, *model.GameStatusValueOf(input.Status.String())); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameStatusPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGameSetting(ctx context.Context, input gqlmodel.UpdateGameSetting) (*gqlmodel.UpdateGameSettingPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGameSetting(ctx, *user, gameId, input.Name, input.MapToGaneLabels(), input.MapToGameSetting()); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameSettingPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGamePeriod(ctx context.Context, input gqlmodel.UpdateGamePeriod) (*gqlmodel.UpdateGamePeriodPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	periodID, err := idToUint32(input.PeriodID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	if err := r.gameUsecase.UpdateGamePeriod(ctx, *user, gameId, model.GamePeriod{
		ID:      periodID,
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
	var charaID *uint32
	if input.CharaID != nil {
		ID, err := idToUint32(*input.CharaID)
		if err != nil {
			return nil, err
		}
		charaID = &ID
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	saved, err := r.gameUsecase.Participate(ctx, gameId, *user, model.GameParticipant{
		Name:    input.Name,
		CharaID: charaID,
	}, input.Password)
	if err != nil {
		var bize *model.ErrBusiness
		if errors.As(err, &bize) {
			e := err.(*model.ErrBusiness)
			graphql.AddError(ctx, &gqlerror.Error{
				Path:    graphql.GetPath(ctx),
				Message: e.Message,
				Extensions: map[string]interface{}{
					"code": "PARTICIPATE_ERROR",
				},
			})
			return nil, nil
		}
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantPayload{
		GameParticipant: MapToGameParticipant(*saved),
	}, nil
}

func (r *mutationResolver) updateGameParticipantProfile(ctx context.Context, input gqlmodel.UpdateGameParticipantProfile) (*gqlmodel.UpdateGameParticipantProfilePayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	var iconID *uint32
	if input.ProfileIconID != nil {
		ID, err := idToUint32(*input.ProfileIconID)
		if err != nil {
			return nil, err
		}
		iconID = &ID
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	var imageUrl *string
	if input.ProfileImageURL != nil {
		imageUrl = input.ProfileImageURL
	} else if input.ProfileImageFile != nil {
		url, err := r.imageUsecase.Upload(input.ProfileImageFile.File)
		if err != nil {
			return nil, err
		}
		imageUrl = url
	}
	profile := model.GameParticipantProfile{
		ProfileImageURL: imageUrl,
		Introduction:    input.Introduction,
	}
	if err := r.gameUsecase.UpdateParticipantProfile(ctx, gameId, *user, input.Name, input.Memo, iconID, profile); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantProfilePayload{Ok: true}, nil
}

func (r *queryResolver) gameParticipantIcons(ctx context.Context, participantID string) ([]*gqlmodel.GameParticipantIcon, error) {
	pID, err := idToUint32(participantID)
	if err != nil {
		return nil, err
	}
	isContainDeleted := false
	icons, err := r.gameUsecase.FindGameParticipantIcons(model.GameParticipantIconsQuery{
		GameParticipantID: &pID,
		IsContainDeleted:  &isContainDeleted,
	})
	if err != nil {
		return nil, err
	}
	return array.Map(icons, func(i model.GameParticipantIcon) *gqlmodel.GameParticipantIcon {
		return MapToGameParticipantIcon(i)
	}), nil
}

func (r *mutationResolver) registerGameParticipantIcon(ctx context.Context, input gqlmodel.NewGameParticipantIcon) (*gqlmodel.RegisterGameParticipantIconPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	url, err := r.imageUsecase.Upload(input.IconFile.File)
	if err != nil {
		return nil, err
	}
	icon, err := r.gameUsecase.RegisterGameParticipantIcon(ctx, gameId, *user, model.GameParticipantIcon{
		IconImageURL: *url,
		Width:        uint32(input.Width),
		Height:       uint32(input.Height),
	})
	return &gqlmodel.RegisterGameParticipantIconPayload{
		GameParticipantIcon: MapToGameParticipantIcon(*icon),
	}, nil
}

func (r *mutationResolver) updateGameParticipantIcon(ctx context.Context, input gqlmodel.UpdateGameParticipantIcon) (*gqlmodel.UpdateGameParticipantIconPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	iconID, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	err = r.gameUsecase.UpdateGameParticipantIcon(ctx, gameId, *user, model.GameParticipantIcon{
		ID:           iconID,
		DisplayOrder: uint32(input.DisplayOrder),
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantIconPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameParticipantIcon(ctx context.Context, input gqlmodel.DeleteGameParticipantIcon) (*gqlmodel.DeleteGameParticipantIconPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	iconId, err := idToUint32(input.IconID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.DeleteGameParticipantIcon(ctx, gameId, *user, iconId); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteGameParticipantIconPayload{Ok: true}, nil
}

func (r *mutationResolver) updateGameParticipantSetting(ctx context.Context, input gqlmodel.UpdateGameParticipantSetting) (*gqlmodel.UpdateGameParticipantSettingPayload, error) {
	gameId, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	notification := model.GameParticipantNotification{
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
	if err := r.gameUsecase.UpdateParticipantSetting(ctx, gameId, *user, notification); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantSettingPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameParticipant(ctx context.Context, input gqlmodel.DeleteGameParticipant) (*gqlmodel.DeleteGameParticipantPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	if err = r.gameUsecase.Leave(ctx, gameID, *user); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteGameParticipantPayload{Ok: true}, nil
}

func (r *mutationResolver) registerGameParticipantFollow(ctx context.Context, input gqlmodel.NewGameParticipantFollow) (*gqlmodel.RegisterGameParticipantFollowPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	targetGameParticipantID, err := idToUint32(input.TargetGameParticipantID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.FollowParticipant(ctx, gameID, *user, targetGameParticipantID); err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantFollowPayload{Ok: true}, nil
}

func (r *mutationResolver) deleteGameParticipantFollow(ctx context.Context, input gqlmodel.DeleteGameParticipantFollow) (*gqlmodel.DeleteGameParticipantFollowPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	targetGameParticipantID, err := idToUint32(input.TargetGameParticipantID)
	if err != nil {
		return nil, err
	}
	if err := r.gameUsecase.UnfollowParticipant(ctx, gameID, *user, targetGameParticipantID); err != nil {
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
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	saved, err := r.gameUsecase.RegisterParticipantDiary(ctx, gameID, *user, model.GameParticipantDiary{
		GamePeriodID: periodID,
		Title:        input.Title,
		Body:         input.Body,
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantDiaryPayload{
		GameParticipantDiary: MapToGameParticipantDiary(*saved),
	}, nil
}

func (r *mutationResolver) updateGameParticipantDiary(ctx context.Context, input gqlmodel.UpdateGameParticipantDiary) (*gqlmodel.UpdateGameParticipantDiaryPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	diaryID, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, err
	}
	diary := model.GameParticipantDiary{
		ID:    diaryID,
		Title: input.Title,
		Body:  input.Body,
	}
	if err = r.gameUsecase.UpdateParticipantDiary(ctx, gameID, *user, diaryID, diary); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantDiaryPayload{
		Ok: true,
	}, nil
}

func (r *mutationResolver) changePeriodIfNeeded(ctx context.Context, input gqlmodel.ChangePeriod) (*gqlmodel.ChangePeriodIfNeededPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	if err = r.gameUsecase.ChangePeriodIfNeeded(ctx, gameID); err != nil {
		return nil, err
	}
	return &gqlmodel.ChangePeriodIfNeededPayload{
		Ok: true,
	}, nil
}

// ------------------------------

func (r *queryResolver) games(ctx context.Context, query gqlmodel.GamesQuery) ([]*gqlmodel.SimpleGame, error) {
	q, err := query.MapToGamesQuery()
	if err != nil {
		return nil, err
	}
	games, err := r.gameUsecase.FindGames(*q)
	if err != nil {
		return nil, err
	}
	return array.Map(games, func(g model.Game) *gqlmodel.SimpleGame {
		return MapToSimpleGame(&g)
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
	p, err := r.gameUsecase.FindMyGameParticipant(gameId, *user)
	if err != nil {
		return nil, err
	}
	return MapToGameParticipant(*p), nil
}

func (r *gameParticipantResolver) followParticipantIds(ctx context.Context, obj *gqlmodel.GameParticipant) ([]string, error) {
	// MEMO: 複数参加者分が同時に取得されることはないと判断している。取得される場合はdataloaderにすること。
	participantId, err := idToUint32(obj.ID)
	if err != nil {
		return nil, err
	}
	pts, err := r.gameUsecase.FindParticipantFollows(participantId)
	if err != nil {
		return nil, err
	}
	return array.Map(pts, func(pt model.GameParticipant) string {
		return intIdToBase64(pt.ID, "GameParticipant")
	}), nil
}

func (r *gameParticipantResolver) followerParticipantIds(ctx context.Context, obj *gqlmodel.GameParticipant) ([]string, error) {
	// MEMO: 複数参加者分が同時に取得されることはないと判断している。取得される場合はdataloaderにすること。
	participantId, err := idToUint32(obj.ID)
	if err != nil {
		return nil, err
	}
	pts, err := r.gameUsecase.FindParticipantFollowers(participantId)
	if err != nil {
		return nil, err
	}
	return array.Map(pts, func(pt model.GameParticipant) string {
		return intIdToBase64(pt.ID, "GameParticipant")
	}), nil
}

func (r *queryResolver) gameParticipantProfile(ctx context.Context, participantID string) (*gqlmodel.GameParticipantProfile, error) {
	participantId, err := idToUint32(participantID)
	if err != nil {
		return nil, err
	}
	profile, participant, err := r.gameUsecase.FindParticipantProfile(participantId)
	if err != nil {
		return nil, err
	}
	return MapToGameParticipantProfile(*profile, *participant), nil
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
	return MapToGameParticipants(pts), nil
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
	return MapToGameParticipants(pts), nil
}

func (r *queryResolver) gameParticipantSetting(ctx context.Context, gameID string) (*gqlmodel.GameParticipantSetting, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	ps, err := r.gameUsecase.FindParticipantSetting(gID, *user)

	return MapToGameParticipantSetting(*ps), nil
}

func (r *queryResolver) gameDiaries(ctx context.Context, query gqlmodel.GameDiariesQuery) ([]*gqlmodel.GameParticipantDiary, error) {
	q, err := r.MapToGameDiariesQuery(query)
	if err != nil {
		return nil, err
	}
	diaries, err := r.gameUsecase.FindParticipantDiaries(*q)
	if err != nil {
		return nil, err
	}
	return MapToGameParticipantDiaries(diaries), nil
}

func (r *queryResolver) gameDiary(ctx context.Context, diaryID string) (*gqlmodel.GameParticipantDiary, error) {
	dID, err := idToUint32(diaryID)
	if err != nil {
		return nil, err
	}
	diary, err := r.gameUsecase.FindParticipantDiary(dID)
	if err != nil {
		return nil, err
	}
	return MapToGameParticipantDiary(*diary), nil
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

func (r *gameParticipantDiaryResolver) participant(ctx context.Context, obj *gqlmodel.GameParticipantDiary) (*gqlmodel.GameParticipant, error) {
	thunk := r.loaders.ParticipantLoader.Load(ctx, dataloader.StringKey(obj.ParticipantID))
	p, err := thunk()
	if err != nil {
		return nil, err
	}
	participant := p.(*model.GameParticipant)
	return MapToGameParticipant(*participant), nil
}

func (r *gameParticipantDiaryResolver) period(ctx context.Context, obj *gqlmodel.GameParticipantDiary) (*gqlmodel.GamePeriod, error) {
	thunk := r.loaders.ParticipantLoader.Load(ctx, dataloader.StringKey(obj.ParticipantID))
	p, err := thunk()
	if err != nil {
		return nil, err
	}
	period := p.(*model.GamePeriod)
	return MapToGamePeriod(period), nil
}

func (r *messageSenderResolver) icon(ctx context.Context, obj *gqlmodel.MessageSender) (*gqlmodel.GameParticipantIcon, error) {
	if obj.IconID == nil {
		return nil, nil
	}
	thunk := r.loaders.ParticipantIconLoader.Load(ctx, dataloader.StringKey(*obj.IconID))
	i, err := thunk()
	if err != nil {
		return nil, err
	}
	icon := i.(*model.GameParticipantIcon)
	return MapToGameParticipantIcon(*icon), nil
}

func (r *gameParticipantResolver) profileIcon(ctx context.Context, obj *gqlmodel.GameParticipant) (*gqlmodel.GameParticipantIcon, error) {
	if obj.ProfileIconID == nil {
		return nil, nil
	}
	thunk := r.loaders.ParticipantIconLoader.Load(ctx, dataloader.StringKey(*obj.ProfileIconID))
	i, err := thunk()
	if err != nil {
		return nil, err
	}
	icon := i.(*model.GameParticipantIcon)
	return MapToGameParticipantIcon(*icon), nil
}

// ----------------------------

func (r *Resolver) findGame(id uint32) (*gqlmodel.Game, error) {
	g, err := r.gameUsecase.FindGame(id)
	if err != nil {
		return nil, err
	}
	return MapToGame(g), nil
}
