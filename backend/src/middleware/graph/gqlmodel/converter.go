package gqlmodel

import (
	"chat-role-play/src/domain/model"
	"chat-role-play/src/util/array"
	"encoding/base64"
	"fmt"
)

func MapToGame(g *model.Game) *Game {
	if g == nil {
		return nil
	}
	return &Game{
		ID:   intIdToBase64(g.ID, "Game"),
		Name: g.Name,
		Participants: array.Map(g.Participants.List, func(p model.GameParticipant) *GameParticipant {
			return MapToParticipant(p)
		}),
	}
}

func (gg NewGame) MapToGame() model.Game {
	return model.Game{
		Name: gg.Name,
	}
}

func MapToSimpleGame(g *model.Game) *SimpleGame {
	if g == nil {
		return nil
	}
	return &SimpleGame{
		ID:                intIdToBase64(g.ID, "Game"),
		Name:              g.Name,
		ParticipantsCount: g.Participants.Count,
	}
}

func MapToParticipant(p model.GameParticipant) *GameParticipant {
	return &GameParticipant{
		ID: intIdToBase64(p.ID, "Participant"),
	}
}

func MapToPlayer(p *model.Player) *Player {
	if p == nil {
		return nil
	}
	return &Player{
		ID:   intIdToBase64(p.ID, "Player"),
		Name: p.Name,
	}
}

func intIdToBase64(id uint32, prefix string) string {
	str := fmt.Sprintf("%s:%d", prefix, id)
	return base64.StdEncoding.EncodeToString([]byte(str))
}
