package dom_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"fmt"
)

type GameMasterDomainService interface {
	IsGameMaster(game model.Game, player model.Player) bool
	AssertModifyGameMaster(game model.Game, player model.Player) error
}

type gameMasterDomainService struct {
}

func NewGameMasterDomainService() GameMasterDomainService {
	return &gameMasterDomainService{}
}

func (ds *gameMasterDomainService) IsGameMaster(
	game model.Game,
	player model.Player,
) bool {
	return array.Any(game.GameMasters, func(gm model.GameMaster) bool {
		return gm.PlayerID == player.ID
	})
}

func (ds *gameMasterDomainService) AssertModifyGameMaster(
	game model.Game,
	player model.Player,
) error {
	if !ds.IsGameMaster(game, player) {
		return fmt.Errorf("player is not game master")
	}
	if !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	return nil
}
