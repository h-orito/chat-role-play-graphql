package gqlmodel

import "time"

// custom modelを定義

type GameParticipant struct {
	ID             string               `json:"id"`
	Name           string               `json:"name"`
	EntryNumber    int                  `json:"entryNumber"`
	PlayerID       string               `json:"playerId"`
	Player         *Player              `json:"player"`
	CharaID        *string              `json:"charaId"`
	Chara          *Chara               `json:"chara"`
	Memo           *string              `json:"memo"`
	ProfileIconID  *string              `json:"profileIconId"`
	ProfileIcon    *GameParticipantIcon `json:"profileIcon"`
	LastAccessedAt time.Time            `json:"lastAccessedAt"`
	IsGone         bool                 `json:"isGone"`
	CanChangeName  bool                 `json:"canChangeName"`
}

type MessageSender struct {
	ParticipantID string               `json:"participantId"`
	Name          string               `json:"name"`
	EntryNumber   int                  `json:"entryNumber"`
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
	ID                  string             `json:"id"`
	Name                string             `json:"name"`
	ParticipantIDs      []string           `json:"participantIds"`
	Participants        []*GameParticipant `json:"participants"`
	LatestUnixTimeMilli uint64             `json:"latestUnixTimeMilli"`
}

type GameCharaSetting struct {
	CharachipIDs         []string     `json:"charachipIds"`
	Charachips           []*Charachip `json:"charachips"`
	CanOriginalCharacter bool         `json:"canOriginalCharacter"`
}
