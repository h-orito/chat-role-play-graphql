package dom_service

import (
	"chat-role-play/domain/model"
	"fmt"
)

type ParticipateDomainService interface {
	AssertParticipate(game model.Game, player model.Player) error
}

type participateDomainService struct {
	gameMasterDomainService GameMasterDomainService
}

func NewParticipateDomainService(
	gameMasterDomainService GameMasterDomainService,
) ParticipateDomainService {
	return &participateDomainService{
		gameMasterDomainService: gameMasterDomainService,
	}
}

func (s *participateDomainService) AssertParticipate(game model.Game, player model.Player) error {
	if game.Status == model.GameStatusClosed || game.Status == model.GameStatusOpening {
		// 参加登録可能になるまではGMのみ参加可能
		if s.gameMasterDomainService.IsGameMaster(game, player) {
			return nil
		} else {
			return fmt.Errorf("you cannot participate. status: %s", game.Status)
		}
	} else if game.Status == model.GameStatusRecruiting || game.Status == model.GameStatusProgress {
		// 参加登録可能
		return nil
	} else {
		// 終了後やキャンセル後は参加不可
		return fmt.Errorf("you cannot participate. status: %s", game.Status)
	}
}
