package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
)

type GameUsecase interface {
	Find(ID uint32) (game *model.Game, err error)
	Search(query model.GameQuery) (games []model.Game, err error)
	FindGameParticipantsByGameID(
		ID uint32,
		pageSize *int,
		pageNumber *int,
	) (participants *model.GameParticipants, err error)
	Register(game model.Game) (registered *model.Game, err error)
}

type gameUsecase struct {
	gameService app_service.GameService
}

func NewGameUsecase(gameService app_service.GameService) GameUsecase {
	return &gameUsecase{
		gameService: gameService,
	}
}

func (s *gameUsecase) Find(ID uint32) (game *model.Game, err error) {
	return s.gameService.Find(ID)
}

func (s *gameUsecase) Search(query model.GameQuery) (games []model.Game, err error) {
	return s.gameService.Search(query)
}

func (s *gameUsecase) FindGameParticipantsByGameID(
	ID uint32,
	pageSize *int,
	pageNumber *int,
) (participants *model.GameParticipants, err error) {
	return s.gameService.FindGameParticipantsByGameID(ID, pageSize, pageNumber)
}

func (s *gameUsecase) Register(game model.Game) (registered *model.Game, err error) {
	return s.gameService.Register(game)
}
