package model

type Game struct {
	ID           uint32
	Name         string
	Participants GameParticipants
}

type GameParticipants struct {
	Count int
	List  []GameParticipant
}

type GameParticipant struct {
	ID     uint32
	GameID uint32
}

type GameQuery struct {
	IDs    *[]uint32
	Name   *string
	Paging *PagingQuery
}

type PagingQuery struct {
	PageSize   int
	PageNumber int
}

type GameRepository interface {
	Find(ID uint32) (game *Game, err error)
	Search(query GameQuery) (games []Game, err error)
	FindGameParticipantsByGameID(
		ID uint32,
		pageSize *int,
		pageNumber *int,
	) (participants *GameParticipants, err error)
	Register(game Game) (saved *Game, err error)
}
