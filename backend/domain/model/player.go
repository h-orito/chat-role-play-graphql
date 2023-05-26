package model

type Player struct {
	ID   uint32
	Name string
}

type PlayerRepository interface {
	Find(ID uint32) (player *Player, err error)
	FindByName(name string) (player *Player, err error)
	FindByUserName(userName string) (player *Player, err error)
	Save(player *Player) (saved *Player, err error)
}
