package dom_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
)

type GameMasterDomainService interface {
	IsGameMaster(game model.Game, player model.Player) bool
}

type gameMasterDomainService struct {
}

func NewGameMasterDomainService() GameMasterDomainService {
	return &gameMasterDomainService{}
}

func (*gameMasterDomainService) IsGameMaster(
	game model.Game,
	player model.Player,
) bool {
	return array.Any(game.GameMasters, func(gm model.GameMaster) bool {
		return gm.PlayerID == player.ID
	})
}
