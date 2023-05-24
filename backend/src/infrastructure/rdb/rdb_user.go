package db

import (
	"time"
)

type PlayerAccount struct {
	ID        uint32
	PlayerID  uint32
	UserName  string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type PlayerAuthority struct {
	ID            uint32
	PlayerID      uint32
	AuthorityCode string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (PlayerAuthority) TableName() string {
	return "player_authorities"
}
