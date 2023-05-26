package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
)

type PlayerUsecase interface {
	Find(ID uint32) (player *model.Player, err error)
	FindByName(name string) (player *model.Player, err error)
}

type playerUsecase struct {
	playerService app_service.PlayerService
}

func NewPlayerUsecase(playerService app_service.PlayerService) PlayerUsecase {
	return &playerUsecase{
		playerService: playerService,
	}
}

func (s *playerUsecase) Find(ID uint32) (player *model.Player, err error) {
	return s.playerService.Find(ID)
}

func (s *playerUsecase) FindByName(name string) (player *model.Player, err error) {
	return s.playerService.FindByName(name)
}
