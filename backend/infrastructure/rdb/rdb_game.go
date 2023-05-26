package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"time"
)

type Game struct {
	ID           uint32
	GameName     string
	Participants []Participant
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Participant struct {
	ID        uint32
	PlayerID  uint32
	GameID    uint32
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (g Game) ToModel() *model.Game {
	return &model.Game{
		ID:   g.ID,
		Name: g.GameName,
		Participants: model.GameParticipants{
			Count: len(g.Participants),
			List: array.Map(g.Participants, func(rdb Participant) model.GameParticipant {
				return *rdb.ToModel()
			}),
		},
	}
}

func (g Game) ToSimpleModel(ptsCount int) *model.Game {
	return &model.Game{
		ID:   g.ID,
		Name: g.GameName,
		Participants: model.GameParticipants{
			Count: ptsCount,
			List:  nil,
		},
	}
}

func (p Participant) ToModel() *model.GameParticipant {
	return &model.GameParticipant{
		ID:     p.ID,
		GameID: p.GameID,
	}
}
