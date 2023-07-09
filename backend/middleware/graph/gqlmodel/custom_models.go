package gqlmodel

import "time"

// custom modelを定義

type GameParticipant struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	EntryNumber    int       `json:"entryNumber"`
	PlayerID       string    `json:"playerId"`
	Player         *Player   `json:"player"`
	Memo           *string   `json:"memo"`
	LastAccessedAt time.Time `json:"lastAccessedAt"`
	IsGone         bool      `json:"isGone"`
}

type MessageSender struct {
	ParticipantID string               `json:"participantId"`
	Name          string               `json:"name"`
	IconID        string               `json:"iconId"`
	Icon          *GameParticipantIcon `json:"icon"`
}

type GameMaster struct {
	ID         string  `json:"id"`
	PlayerID   string  `json:"playerId"`
	Player     *Player `json:"player"`
	IsProducer bool    `json:"isProducer"`
}

type GameParticipantDiary struct {
	ID            string           `json:"id"`
	ParticipantID string           `json:"participantId"`
	Participant   *GameParticipant `json:"participant"`
	PeriodID      string           `json:"periodId"`
	Period        *GamePeriod      `json:"period"`
	Title         string           `json:"title"`
	Body          string           `json:"body"`
}

type GameParticipantGroup struct {
	ID             string             `json:"id"`
	Name           string             `json:"name"`
	ParticipantIDs []string           `json:"participantIds"`
	Participants   []*GameParticipant `json:"participants"`
}
