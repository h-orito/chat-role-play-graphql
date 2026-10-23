package dom_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
)

type ParticipateDomainService interface {
	AssertParticipate(game model.Game, player model.Player, authorities []model.PlayerAuthority, password *string, charaID *uint32) error
	CanViewParticipantPlayer(
		game model.Game,
		participant model.GameParticipant,
		profile model.GameParticipantProfile,
		viewer *model.Player,
		authorities []model.PlayerAuthority,
	) bool
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

func (s *participateDomainService) AssertParticipate(
	game model.Game,
	player model.Player,
	authorities []model.PlayerAuthority,
	password *string,
	charaID *uint32,
) error {
	if game.Status == model.GameStatusClosed || game.Status == model.GameStatusOpening {
		// 参加登録可能になるまではGMのみ参加可能
		if s.gameMasterDomainService.IsGameMaster(game, player, authorities) {
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

	if charaID != nil {
		// 既に参加しているキャラクターはNG
		if array.Any(game.Participants.List, func(p model.GameParticipant) bool {
			return p.CharaID != nil && *p.CharaID == *charaID && !p.IsGone
		}) {
			return model.NewErrBusiness("既に他の人が利用しているキャラクターでは参加できません")
		}
	}

	return nil
}

// CanViewParticipantPlayer は参加者を操作しているプレイヤーを閲覧者に見せてよいか判定する。
// 見せてよいのは、参加者がプレイヤーを公開している場合、エピローグ以降、本人、GM (Admin 含む) のとき。
// viewer が nil なら未ログイン。
func (s *participateDomainService) CanViewParticipantPlayer(
	game model.Game,
	participant model.GameParticipant,
	profile model.GameParticipantProfile,
	viewer *model.Player,
	authorities []model.PlayerAuthority,
) bool {
	if profile.IsPlayerOpen || game.Status.ShouldSpoiler() {
		return true
	}
	if viewer == nil {
		return false
	}
	return viewer.ID == participant.PlayerID ||
		s.gameMasterDomainService.IsGameMaster(game, *viewer, authorities)
}
