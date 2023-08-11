package dom_service

import (
	"chat-role-play/domain/model"
)

type ParticipateDomainService interface {
	AssertParticipate(game model.Game, player model.Player, password *string) error
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

func (s *participateDomainService) AssertParticipate(game model.Game, player model.Player, password *string) error {
	if game.Status == model.GameStatusClosed || game.Status == model.GameStatusOpening {
		// 参加登録可能になるまではGMのみ参加可能
		if s.gameMasterDomainService.IsGameMaster(game, player) {
			return nil
		} else {
			return model.NewErrBusiness("参加登録可能になるまではGMのみ参加可能です")
		}
	} else if game.Status == model.GameStatusRecruiting || game.Status == model.GameStatusProgress {
		// 参加登録可能
	} else {
		// 終了後やキャンセル後は参加不可
		return model.NewErrBusiness("終了後やキャンセル後は参加不可です")
	}

	if game.Settings.Password.HasPassword {
		if password == nil || *game.Settings.Password.Password != *password {
			return model.NewErrBusiness("パスワードが違います")
		}
	}

	return nil
}
