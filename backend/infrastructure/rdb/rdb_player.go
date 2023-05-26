package db

import (
	model "chat-role-play/domain/model"
	"time"
)

type Player struct {
	ID         uint32
	PlayerName string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func (p Player) ToModel() *model.Player {
	return &model.Player{
		ID:   p.ID,
		Name: p.PlayerName,
	}
}
