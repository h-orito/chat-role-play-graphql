// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package gqlmodel

type CreateGamePayload struct {
	Game *Game `json:"game"`
}

type CreateParticipantPayload struct {
	Participant *Participant `json:"participant"`
}

type CreatePlayerPayload struct {
	Player *Player `json:"player"`
}

type Game struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	Participants []*Participant `json:"participants"`
}

type GamesQuery struct {
	Ids    []string       `json:"ids,omitempty"`
	Name   *string        `json:"name,omitempty"`
	Paging *PageableQuery `json:"paging,omitempty"`
}

type NewGame struct {
	Name string `json:"name"`
}

type NewParticipant struct {
	GameID   string `json:"gameId"`
	PlayerID string `json:"playerId"`
}

type NewPlayer struct {
	Name string `json:"name"`
}

type PageableQuery struct {
	PageSize   int `json:"pageSize"`
	PageNumber int `json:"pageNumber"`
}

type Participant struct {
	ID string `json:"id"`
}

type ParticipantsQuery struct {
	Ids       []string       `json:"ids,omitempty"`
	PlayerIds []string       `json:"playerIds,omitempty"`
	Paging    *PageableQuery `json:"paging,omitempty"`
}

type Player struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SimpleGame struct {
	ID                string `json:"id"`
	Name              string `json:"name"`
	ParticipantsCount int    `json:"participantsCount"`
}
