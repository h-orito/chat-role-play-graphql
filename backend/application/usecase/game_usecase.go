package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"context"
	"fmt"
)

type GameUsecase interface {
	// game
	FindGames(query model.GamesQuery) (games []model.Game, err error)
	FindGame(ID uint32) (game *model.Game, err error)
	RegisterGame(ctx context.Context, game model.Game) (registered *model.Game, err error)
	RegisterGameMaster(ctx context.Context, gameID uint32, playerID uint32, isProducer bool) (gameMaster *model.GameMaster, err error)
	UpdateGameMaster(ctx context.Context, gameMasterID uint32, isProducer bool) (err error)
	DeleteGameMaster(ctx context.Context, gameMasterID uint32) (err error)
	UpdateGameStatus(ctx context.Context, gameID uint32, status model.GameStatus) (err error)
	UpdateGameSetting(ctx context.Context, gameID uint32, settings model.GameSettings) (err error)
	UpdateGamePeriod(ctx context.Context, gameID uint32, period model.GamePeriod) (err error)
	// game participant
	FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error)
	FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error)
	FindMyGameParticipant(gameID uint32, playerID uint32) (participant *model.GameParticipant, err error)
	Participate(ctx context.Context, gameID uint32, participant model.GameParticipant) (saved *model.GameParticipant, err error)
	Leave(ctx context.Context, participantID uint32) (err error)
	// game participant profile
	FindParticipantProfile(participantID uint32) (profile *model.GameParticipantProfile, err error)
	UpdateParticipantProfile(ctx context.Context, participantID uint32, name string, profile model.GameParticipantProfile) (err error)
	// game participant setting
	FindParticipantSetting(participantID uint32) (setting *model.GameParticipantNotification, err error)
	UpdateParticipantSetting(ctx context.Context, participantID uint32, setting model.GameParticipantNotification) (err error)
	// game participant follow
	FindParticipantFollows(participantID uint32) (follows []model.GameParticipant, err error)
	FindParticipantFollowers(participantID uint32) (follows []model.GameParticipant, err error)
	FollowParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error)
	UnfollowParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error)
	// game participant diary
	FindParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error)
	FindParticipantDiary(ID uint32) (diary *model.GameParticipantDiary, err error)
	RegisterParticipantDiary(ctx context.Context, gameID uint32, diary model.GameParticipantDiary) (*model.GameParticipantDiary, error)
	UpdateParticipantDiary(ctx context.Context, diaryID uint32, diary model.GameParticipantDiary) error
}

type gameUsecase struct {
	gameService app_service.GameService
	transaction Transaction
}

func NewGameUsecase(gameService app_service.GameService, tx Transaction) GameUsecase {
	return &gameUsecase{
		gameService: gameService,
		transaction: tx,
	}
}

func (g *gameUsecase) FindGames(query model.GamesQuery) (games []model.Game, err error) {
	return g.gameService.FindGames(query)
}

func (g *gameUsecase) FindGame(ID uint32) (game *model.Game, err error) {
	return g.gameService.FindGame(ID)
}

func (g *gameUsecase) RegisterGame(ctx context.Context, game model.Game) (registered *model.Game, err error) {
	return g.gameService.RegisterGame(ctx, game)
}

func (g *gameUsecase) RegisterGameMaster(ctx context.Context, gameID uint32, playerID uint32, isProducer bool) (gameMaster *model.GameMaster, err error) {
	return g.gameService.RegisterGameMaster(ctx, gameID, playerID, isProducer)
}

func (g *gameUsecase) UpdateGameMaster(ctx context.Context, gameMasterID uint32, isProducer bool) (err error) {
	return g.gameService.UpdateGameMaster(ctx, model.GameMaster{
		ID:         gameMasterID,
		IsProducer: isProducer,
	})
}

func (g *gameUsecase) DeleteGameMaster(ctx context.Context, gameMasterID uint32) (err error) {
	return g.gameService.DeleteGameMaster(ctx, gameMasterID)
}

func (g *gameUsecase) UpdateGameStatus(ctx context.Context, gameID uint32, status model.GameStatus) (err error) {
	return g.gameService.UpdateGameStatus(ctx, gameID, status)
}

func (g *gameUsecase) UpdateGameSetting(ctx context.Context, gameID uint32, settings model.GameSettings) (err error) {
	return g.gameService.UpdateGameSettings(ctx, gameID, settings)
}

func (g *gameUsecase) UpdateGamePeriod(ctx context.Context, gameID uint32, period model.GamePeriod) (err error) {
	return g.gameService.UpdateGamePeriod(ctx, gameID, period)
}

func (g *gameUsecase) FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error) {
	return g.gameService.FindGameParticipants(query)
}

func (g *gameUsecase) FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error) {
	return g.gameService.FindGameParticipant(query)
}

func (g *gameUsecase) FindMyGameParticipant(gameID uint32, playerID uint32) (participant *model.GameParticipant, err error) {
	return g.gameService.FindGameParticipant(model.GameParticipantQuery{
		GameID:   gameID,
		PlayerID: &playerID,
	})
}

func (g *gameUsecase) Participate(ctx context.Context, gameID uint32, participant model.GameParticipant) (saved *model.GameParticipant, err error) {
	return g.gameService.Participate(ctx, gameID, participant)
}

func (g *gameUsecase) Leave(ctx context.Context, participantID uint32) (err error) {
	// TODO: implement
	return fmt.Errorf("not yet implemented")
}

func (g *gameUsecase) FindParticipantProfile(participantID uint32) (profile *model.GameParticipantProfile, err error) {
	return g.gameService.FindGameParticipantProfile(participantID)
}

func (g *gameUsecase) UpdateParticipantProfile(ctx context.Context, participantID uint32, name string, profile model.GameParticipantProfile) (err error) {
	if err := g.gameService.UpdateParticipantName(ctx, participantID, name); err != nil {
		return err
	}
	return g.gameService.UpdateGameParticipantProfile(ctx, participantID, profile)
}

func (g *gameUsecase) FindParticipantSetting(participantID uint32) (setting *model.GameParticipantNotification, err error) {
	return g.gameService.FindGameParticipantNotificationSetting(participantID)
}

func (g *gameUsecase) UpdateParticipantSetting(ctx context.Context, participantID uint32, setting model.GameParticipantNotification) (err error) {
	return g.gameService.UpdateGameParticipantNotificationSetting(ctx, participantID, setting)
}

func (g *gameUsecase) FindParticipantFollows(participantID uint32) (follows []model.GameParticipant, err error) {
	return g.gameService.FindGameParticipantFollows(participantID)
}

func (g *gameUsecase) FindParticipantFollowers(participantID uint32) (follows []model.GameParticipant, err error) {
	return g.gameService.FindGameParticipantFollowers(participantID)
}

func (g *gameUsecase) FollowParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error) {
	return g.gameService.FollowGameParticipant(ctx, participantID, targetParticipantID)
}

func (g *gameUsecase) UnfollowParticipant(ctx context.Context, participantID uint32, targetParticipantID uint32) (err error) {
	return g.gameService.UnfollowGameParticipant(ctx, participantID, targetParticipantID)
}

func (g *gameUsecase) FindParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error) {
	return g.gameService.FindGameParticipantDiaries(query)
}

func (g *gameUsecase) FindParticipantDiary(ID uint32) (*model.GameParticipantDiary, error) {
	return g.gameService.FindGameParticipantDiary(ID)
}

func (g *gameUsecase) RegisterParticipantDiary(ctx context.Context, gameID uint32, diary model.GameParticipantDiary) (*model.GameParticipantDiary, error) {
	return g.gameService.UpsertGameParticipantDiary(ctx, gameID, diary)
}

func (g *gameUsecase) UpdateParticipantDiary(ctx context.Context, diaryID uint32, diary model.GameParticipantDiary) (err error) {
	_, err = g.gameService.UpsertGameParticipantDiary(ctx, diaryID, diary)
	return err
}
