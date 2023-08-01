package model

import (
	"chat-role-play/util/array"
	"context"
)

type Player struct {
	ID   uint32
	Name string
}

type PlayersQuery struct {
	IDs    *[]uint32
	Name   *string
	Paging *PagingQuery
}

type PlayerProfile struct {
	PlayerID        uint32
	ProfileImageURL *string
	Introduction    *string
	SnsAccounts     []PlayerSnsAccount
}

type PlayerSnsAccount struct {
	ID          uint32
	SnsType     SnsType
	AccountName string
	AccountURL  string
}

type SnsType int

const (
	SnsTypeTwitter SnsType = iota
	SnsTypeMastodon
	SnsTypeMisskey
	SnsTypeDiscord
	SnsTypeGithub
	SnsTypeWebSite
	SnsTypePixiv
)

func (st SnsType) String() string {
	switch st {
	case SnsTypeTwitter:
		return "Twitter"
	case SnsTypeMastodon:
		return "Mastodon"
	case SnsTypeMisskey:
		return "Misskey"
	case SnsTypeDiscord:
		return "Discord"
	case SnsTypeGithub:
		return "Github"
	case SnsTypeWebSite:
		return "WebSite"
	case SnsTypePixiv:
		return "Pixiv"
	default:
		return ""
	}
}

func SnsTypeValues() []SnsType {
	return []SnsType{
		SnsTypeTwitter,
		SnsTypeDiscord,
		SnsTypeGithub,
		SnsTypeWebSite,
		SnsTypePixiv,
	}
}

func SnsTypeValueOf(s string) *SnsType {
	return array.Find(SnsTypeValues(), func(st SnsType) bool {
		return st.String() == s
	})
}

type PlayerRepository interface {
	FindPlayers(query PlayersQuery) ([]Player, error)
	Find(ID uint32) (player *Player, err error)
	FindByName(name string) (player *Player, err error)
	FindByUserName(userName string) (player *Player, err error)
	Save(ctx context.Context, player *Player) (saved *Player, err error)
	FindProfile(ID uint32) (profile *PlayerProfile, err error)
	SaveProfile(ctx context.Context, name string, profile *PlayerProfile) (saved *PlayerProfile, err error)
	RegisterSnsAccount(ctx context.Context, playerID uint32, account *PlayerSnsAccount) (saved *PlayerSnsAccount, err error)
	UpdateSnsAccount(ctx context.Context, ID uint32, account *PlayerSnsAccount) error
	DeleteSnsAccount(ctx context.Context, ID uint32) error
}
