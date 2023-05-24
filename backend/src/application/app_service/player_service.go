package app_service

import "chat-role-play/src/domain/model"

type PlayerService interface {
	Find(ID uint32) (player *model.Player, err error)
	FindByName(name string) (player *model.Player, err error)
	Save(player model.Player) (saved *model.Player, err error)
}

type playerService struct {
	playerRepository model.PlayerRepository
}

func NewPlayerService(playerRepository model.PlayerRepository) PlayerService {
	return &playerService{
		playerRepository: playerRepository,
	}
}

func (s *playerService) Find(ID uint32) (player *model.Player, err error) {
	return s.playerRepository.Find(ID)
}

func (s *playerService) FindByName(name string) (player *model.Player, err error) {
	return s.playerRepository.FindByName(name)
}

func (s *playerService) Save(player model.Player) (saved *model.Player, err error) {
	return s.playerRepository.Save(&player)
}
