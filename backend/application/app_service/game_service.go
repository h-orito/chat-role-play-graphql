package app_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"strconv"
	"strings"
	"time"
)

type GameService interface {
	// game
	FindGames(query model.GamesQuery) (games []model.Game, err error)
	FindGame(ID uint32) (game *model.Game, err error)
	FindGamePeriods(IDs []uint32) (periods []model.GamePeriod, err error)
	RegisterGame(ctx context.Context, game model.Game) (saved *model.Game, err error)
	RegisterGameMaster(ctx context.Context, gameID uint32, playerID uint32, isProducer bool) (gameMaster *model.GameMaster, err error)
	UpdateGameMaster(ctx context.Context, gameMaster model.GameMaster) (err error)
	DeleteGameMaster(ctx context.Context, gameMasterID uint32) (err error)
	UpdateGameStatus(ctx context.Context, gameID uint32, status model.GameStatus) (err error)
	UpdateGamePeriod(ctx context.Context, gameID uint32, period model.GamePeriod) (err error)
	UpdateGameSettings(ctx context.Context, gameID uint32, gameName string, settings model.GameSettings) (err error)
	ChangePeriodIfNeeded(ctx context.Context, gameID uint32) (err error)
	// game participant
	FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error)
	FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error)
	Participate(ctx context.Context, gameID uint32, participant model.GameParticipant) (saved *model.GameParticipant, err error)
	UpdateParticipant(ctx context.Context, participantID uint32, name string, memo *string, iconId *uint32) (err error)
	// game participant profile
	FindGameParticipantProfile(participantID uint32) (profile *model.GameParticipantProfile, err error)
	UpdateGameParticipantProfile(ctx context.Context, participantID uint32, profile model.GameParticipantProfile) (err error)
	// game participant icon
	FindGameParticipantIcons(query model.GameParticipantIconsQuery) (icons []model.GameParticipantIcon, err error)
	RegisterGameParticipantIcon(ctx context.Context, gameParticipantID uint32, icon model.GameParticipantIcon) (saved *model.GameParticipantIcon, err error)
	UpdateGameParticipantIcon(ctx context.Context, icon model.GameParticipantIcon) (err error)
	DeleteGameParticipantIcon(ctx context.Context, iconID uint32) (err error)
	// participant notification
	FindGameParticipantNotificationSetting(ID uint32) (notification *model.GameParticipantNotification, err error)
	UpdateGameParticipantNotificationSetting(ctx context.Context, participantID uint32, notification model.GameParticipantNotification) (err error)
	// participant follow
	FindGameParticipantFollows(participantID uint32) (follows []model.GameParticipant, err error)
	FindGameParticipantFollowers(participantID uint32) (follows []model.GameParticipant, err error)
	FollowGameParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error)
	UnfollowGameParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error)
	// participant diary
	FindGameParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error)
	FindGameParticipantDiary(ID uint32) (diary *model.GameParticipantDiary, err error)
	UpsertGameParticipantDiary(ctx context.Context, gameID uint32, diary model.GameParticipantDiary) (saved *model.GameParticipantDiary, err error)
}

type gameService struct {
	gameRepository            model.GameRepository
	gameParticipantRepository model.GameParticipantRepository
}

func NewGameService(
	gameRepository model.GameRepository,
	gameParticipantRepository model.GameParticipantRepository,
) GameService {
	return &gameService{
		gameRepository:            gameRepository,
		gameParticipantRepository: gameParticipantRepository,
	}
}

func (g *gameService) FindGames(query model.GamesQuery) (games []model.Game, err error) {
	return g.gameRepository.FindGames(query)
}

func (g *gameService) FindGame(ID uint32) (game *model.Game, err error) {
	return g.gameRepository.FindGame(ID)
}

func (g *gameService) FindGamePeriods(IDs []uint32) (periods []model.GamePeriod, err error) {
	return g.gameRepository.FindGamePeriods(IDs)
}

func (g *gameService) RegisterGame(ctx context.Context, game model.Game) (saved *model.Game, err error) {
	return g.gameRepository.RegisterGame(ctx, game)
}

func (g *gameService) RegisterGameMaster(ctx context.Context, gameID uint32, playerID uint32, isProducer bool) (gameMaster *model.GameMaster, err error) {
	return g.gameRepository.RegisterGameMaster(ctx, gameID, model.GameMaster{
		PlayerID:   playerID,
		IsProducer: isProducer,
	})
}

func (g *gameService) UpdateGameMaster(ctx context.Context, gameMaster model.GameMaster) (err error) {
	return g.gameRepository.UpdateGameMaster(ctx, gameMaster)
}

func (g *gameService) DeleteGameMaster(ctx context.Context, gameMasterID uint32) (err error) {
	return g.gameRepository.DeleteGameMaster(ctx, gameMasterID)
}

func (g *gameService) UpdateGameStatus(ctx context.Context, gameID uint32, status model.GameStatus) (err error) {
	return g.gameRepository.UpdateGameStatus(ctx, gameID, status)
}

func (g *gameService) UpdateGamePeriod(ctx context.Context, gameID uint32, period model.GamePeriod) (err error) {
	return g.gameRepository.UpdateGamePeriod(ctx, gameID, period)
}

func (g *gameService) UpdateGameSettings(ctx context.Context, gameID uint32, gameName string, settings model.GameSettings) (err error) {
	return g.gameRepository.UpdateGameSettings(ctx, gameID, gameName, settings)
}

func (g *gameService) ChangePeriodIfNeeded(ctx context.Context, gameID uint32) (err error) {
	game, err := g.gameRepository.FindGame(gameID)
	if err != nil {
		return err
	}
	now := time.Now()
	shouldChange, status := game.ShouldChangeStatus(now)
	if shouldChange {
		if status == model.GameStatusProgress && len(game.Periods) == 1 {
			// ゲーム開始
			g.startGame(ctx, *game)
		} else {
			// ステータスのみ更新
			if err := g.UpdateGameStatus(ctx, gameID, status); err != nil {
				return err
			}
		}
	} else if game.Status == model.GameStatusProgress {
		if game.Periods[len(game.Periods)-1].EndAt.Before(now) {
			// 日付追加
			count := game.Periods[len(game.Periods)-1].Count + 1
			if err := g.gameRepository.RegisterGamePeriod(ctx, game.ID, model.GamePeriod{
				Count:   count,
				Name:    strings.Join([]string{*game.Settings.Time.PeriodPrefix, strconv.Itoa(int(count)), *game.Settings.Time.PeriodSuffix}, ""),
				StartAt: now,
				EndAt:   game.Periods[len(game.Periods)-1].EndAt.Add(time.Duration(game.Settings.Time.PeriodIntervalSeconds*count) * time.Second),
			}); err != nil {
				return err
			}
		}
	}
	return nil
}

func (g *gameService) startGame(ctx context.Context, game model.Game) error {
	if err := g.UpdateGameStatus(ctx, game.ID, model.GameStatusProgress); err != nil {
		return err
	}
	if err := g.gameRepository.RegisterGamePeriod(ctx, game.ID, model.GamePeriod{
		Count:   1,
		Name:    strings.Join([]string{*game.Settings.Time.PeriodPrefix, "1", *game.Settings.Time.PeriodSuffix}, ""),
		StartAt: time.Now(),
		EndAt:   game.Settings.Time.StartGameAt.Add(time.Duration(game.Settings.Time.PeriodIntervalSeconds) * time.Second),
	}); err != nil {
		return err
	}

	return nil
}

func (g *gameService) FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error) {
	return g.gameParticipantRepository.FindGameParticipants(query)
}
func (g *gameService) FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error) {
	return g.gameParticipantRepository.FindGameParticipant(query)
}

func (g *gameService) Participate(ctx context.Context, gameID uint32, participant model.GameParticipant) (saved *model.GameParticipant, err error) {
	return g.gameParticipantRepository.RegisterGameParticipant(ctx, gameID, participant)
}

func (g *gameService) UpdateParticipant(ctx context.Context, participantID uint32, name string, memo *string, iconId *uint32) (err error) {
	return g.gameParticipantRepository.UpdateGameParticipant(ctx, participantID, name, memo, iconId)
}

func (g *gameService) FindGameParticipantProfile(participantID uint32) (profile *model.GameParticipantProfile, err error) {
	return g.gameParticipantRepository.FindGameParticipantProfile(participantID)
}

func (g *gameService) UpdateGameParticipantProfile(ctx context.Context, participantID uint32, profile model.GameParticipantProfile) (err error) {
	return g.gameParticipantRepository.UpdateGameParticipantProfile(ctx, participantID, profile)
}

func (g *gameService) FindGameParticipantIcons(query model.GameParticipantIconsQuery) (icons []model.GameParticipantIcon, err error) {
	return g.gameParticipantRepository.FindGameParticipantIcons(query)
}

func (g *gameService) RegisterGameParticipantIcon(ctx context.Context, gameParticipantID uint32, icon model.GameParticipantIcon) (saved *model.GameParticipantIcon, err error) {
	return g.gameParticipantRepository.RegisterGameParticipantIcon(ctx, gameParticipantID, icon)
}

func (g *gameService) UpdateGameParticipantIcon(ctx context.Context, icon model.GameParticipantIcon) error {
	return g.gameParticipantRepository.UpdateGameParticipantIcon(ctx, icon)
}

func (g *gameService) DeleteGameParticipantIcon(ctx context.Context, iconID uint32) (err error) {
	return g.gameParticipantRepository.DeleteGameParticipantIcon(ctx, iconID)
}

func (g *gameService) FindGameParticipantNotificationSetting(ID uint32) (notification *model.GameParticipantNotification, err error) {
	return g.gameParticipantRepository.FindGameParticipantNotificationSetting(ID)
}

func (g *gameService) UpdateGameParticipantNotificationSetting(ctx context.Context, participantID uint32, notification model.GameParticipantNotification) (err error) {
	return g.gameParticipantRepository.UpdateGameParticipantNotificationSetting(ctx, participantID, notification)
}

func (g *gameService) FindGameParticipantFollows(participantID uint32) (follows []model.GameParticipant, err error) {
	fs, err := g.gameParticipantRepository.FindGameParticipantFollows(participantID)
	if err != nil {
		return nil, err
	}
	ids := array.Map(fs, func(f model.GameParticipantFollow) uint32 {
		return f.FollowGameParticipantID
	})
	if (len(ids)) == 0 {
		return []model.GameParticipant{}, nil
	}
	pts, err := g.gameParticipantRepository.FindGameParticipants(model.GameParticipantsQuery{
		IDs: &ids,
	})
	if err != nil {
		return nil, err
	}
	return pts.List, nil
}

func (g *gameService) FindGameParticipantFollowers(participantID uint32) (follows []model.GameParticipant, err error) {
	fs, err := g.gameParticipantRepository.FindGameParticipantFollowers(participantID)
	if err != nil {
		return nil, err
	}
	ids := array.Map(fs, func(f model.GameParticipantFollow) uint32 {
		return f.GameParticipantID
	})
	if (len(ids)) == 0 {
		return []model.GameParticipant{}, nil
	}
	pts, err := g.gameParticipantRepository.FindGameParticipants(model.GameParticipantsQuery{
		IDs: &ids,
	})
	if err != nil {
		return nil, err
	}
	return pts.List, nil
}

func (g *gameService) FollowGameParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error) {
	return g.gameParticipantRepository.RegisterGameParticipantFollow(ctx, participantID, targetParticipantID)
}

func (g *gameService) UnfollowGameParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error) {
	return g.gameParticipantRepository.DeleteGameParticipantFollow(ctx, participantID, targetParticipantID)
}

func (g *gameService) FindGameParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error) {
	return g.gameParticipantRepository.FindGameParticipantDiaries(query)
}

func (g *gameService) FindGameParticipantDiary(ID uint32) (diary *model.GameParticipantDiary, err error) {
	return g.gameParticipantRepository.FindGameParticipantDiary(ID)
}

func (g *gameService) UpsertGameParticipantDiary(ctx context.Context, gameID uint32, diary model.GameParticipantDiary) (saved *model.GameParticipantDiary, err error) {
	return g.gameParticipantRepository.UpsertGameParticipantDiary(ctx, gameID, diary)
}
