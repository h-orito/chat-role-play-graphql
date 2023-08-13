package graphql

import (
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
)

func MapToPlayer(
	p *model.Player,
	profile *model.PlayerProfile,
	authorities []model.PlayerAuthority,
) *gqlmodel.Player {
	if p == nil {
		return nil
	}
	return &gqlmodel.Player{
		ID:      intIdToBase64(p.ID, "Player"),
		Name:    p.Name,
		Profile: MapToPlayerProfile(profile),
		AuthorityCodes: array.Map(authorities, func(a model.PlayerAuthority) string {
			return a.String()
		}),
	}
}

func MapToPlayerProfile(p *model.PlayerProfile) *gqlmodel.PlayerProfile {
	if p == nil {
		return nil
	}
	return &gqlmodel.PlayerProfile{
		ProfileImageURL: p.ProfileImageURL,
		Introduction:    p.Introduction,
		SnsAccounts: array.Map(p.SnsAccounts, func(s model.PlayerSnsAccount) *gqlmodel.PlayerSnsAccount {
			return MapToPlayerSnsAccount(s)
		}),
	}
}

func MapToPlayerSnsAccount(s model.PlayerSnsAccount) *gqlmodel.PlayerSnsAccount {
	return &gqlmodel.PlayerSnsAccount{
		ID:   intIdToBase64(s.ID, "PlayerSnsAccount"),
		Type: gqlmodel.SnsType(s.SnsType.String()),
		Name: &s.AccountName,
		URL:  s.AccountURL,
	}
}
