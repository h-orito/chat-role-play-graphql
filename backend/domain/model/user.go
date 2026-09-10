package model

import (
	"chat-role-play/util/array"
	"context"
)

type User struct {
	UserName   string
	Authorites []PlayerAuthority
}

type PlayerAuthority int

const (
	AuthorityPlayer PlayerAuthority = iota
	AuthorityAdmin
)

func (pa PlayerAuthority) String() string {
	switch pa {
	case AuthorityPlayer:
		return "AuthorityPlayer"
	case AuthorityAdmin:
		return "AuthorityAdmin"
	default:
		return ""
	}
}

func PlayerAuthorityValues() []PlayerAuthority {
	return []PlayerAuthority{
		AuthorityPlayer,
		AuthorityAdmin,
	}
}

func PlayerAuthorityValueOf(s string) *PlayerAuthority {
	return array.Find(PlayerAuthorityValues(), func(pa PlayerAuthority) bool {
		return pa.String() == s
	})
}

func (pa PlayerAuthority) IsAdmin() bool {
	return pa == AuthorityAdmin
}

var DefaultAuthorites = []PlayerAuthority{AuthorityPlayer}

type UserRepository interface {
	FindByUserName(ctx context.Context, userName string) (user *User, err error)
	FindPlayerAuthorities(ctx context.Context, playerID uint32) (authorities []PlayerAuthority, err error)
	Signup(ctx context.Context, userName string) (saved *User, err error)
}
