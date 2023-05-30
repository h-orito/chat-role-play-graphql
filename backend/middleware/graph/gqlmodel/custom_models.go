package gqlmodel

import "time"

// custom modelを定義

type GameParticipant struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	EntryNumber    int       `json:"entryNumber"`
	PlayerID       string    `json:"playerId"`
	Player         *Player   `json:"player"`
	CharaID        string    `json:"charaId"`
	Chara          *Chara    `json:"chara"`
	IsGone         bool      `json:"isGone"`
	LastAccessedAt time.Time `json:"lastAccessedAt"`
}

type MessageSender struct {
	ParticipantID string      `json:"participantId"`
	CharaName     string      `json:"charaName"`
	CharaImageID  string      `json:"charaImageId"`
	CharaImage    *CharaImage `json:"charaImage"`
}
