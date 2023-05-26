package app_service

import "chat-role-play/src/domain/model"

type GameService interface {
	Find(ID uint32) (game *model.Game, err error)
	Search(query model.GameQuery) (games []model.Game, err error)
	FindGameParticipantsByGameID(
		ID uint32,
		pageSize *int,
		pageNumber *int,
	) (participants *model.GameParticipants, err error)
	Register(game model.Game) (saved *model.Game, err error)
}

type gameService struct {
	gameRepository model.GameRepository
}

func NewGameService(gameRepository model.GameRepository) GameService {
	return &gameService{
		gameRepository: gameRepository,
	}
}

func (s *gameService) Find(ID uint32) (game *model.Game, err error) {
	return s.gameRepository.Find(ID)
}

func (s *gameService) Search(query model.GameQuery) (games []model.Game, err error) {
	return s.gameRepository.Search(query)
}

func (s *gameService) FindGameParticipantsByGameID(ID uint32, pageSize *int, pageNumber *int) (participants *model.GameParticipants, err error) {
	return s.gameRepository.FindGameParticipantsByGameID(ID, pageSize, pageNumber)
}

func (s *gameService) Register(game model.Game) (saved *model.Game, err error) {
	return s.gameRepository.Register(game)
}
