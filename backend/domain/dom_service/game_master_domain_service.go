package dom_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"fmt"
)

type GameMasterDomainService interface {
	IsGameMaster(game model.Game, player model.Player, authorities []model.PlayerAuthority) bool
	AssertModifyGameMaster(game model.Game, player model.Player, authorities []model.PlayerAuthority) error
}

type gameMasterDomainService struct {
}

func NewGameMasterDomainService() GameMasterDomainService {
	return &gameMasterDomainService{}
}

func (ds *gameMasterDomainService) IsGameMaster(
	game model.Game,
	player model.Player,
	authorities []model.PlayerAuthority,
) bool {
	// AdminはGM扱い
	if array.Any(authorities, func(a model.PlayerAuthority) bool {
		return a.IsAdmin()
	}) {
		return true
	}
	return array.Any(game.GameMasters, func(gm model.GameMaster) bool {
		return gm.PlayerID == player.ID
	})
}

func (ds *gameMasterDomainService) AssertModifyGameMaster(
	game model.Game,
	player model.Player,
	authorities []model.PlayerAuthority,
) error {
	if !ds.IsGameMaster(game, player, authorities) {
		return fmt.Errorf("player is not game master")
	}
	if !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	return nil
}
