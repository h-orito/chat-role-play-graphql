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

type PlayerProfile struct {
	PlayerID        uint32 `gorm:"primaryKey"`
	ProfileImageUrl *string
	Introduction    *string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

func (p PlayerProfile) ToModel(snsAccounts []model.PlayerSnsAccount) *model.PlayerProfile {
	return &model.PlayerProfile{
		PlayerID:        p.PlayerID,
		ProfileImageURL: p.ProfileImageUrl,
		Introduction:    p.Introduction,
		SnsAccounts:     snsAccounts,
	}
}

type PlayerSnsAccount struct {
	ID          uint32
	PlayerID    uint32
	SnsTypeCode string
	AccountName string
	AccountUrl  string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (p PlayerSnsAccount) ToModel() *model.PlayerSnsAccount {
	return &model.PlayerSnsAccount{
		ID:          p.ID,
		SnsType:     *model.SnsTypeValueOf(p.SnsTypeCode),
		AccountName: p.AccountName,
		AccountURL:  p.AccountUrl,
	}
}
