package model

type Chara struct {
	ID     uint32
	Name   string
	Images []*CharaImage
}

type CharaImage struct {
	Type string     `json:"type"`
	Size *CharaSize `json:"size"`
	URL  string     `json:"url"`
}

type CharaSize struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

type Charachip struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Designer *Designer `json:"designer"`
	Charas   []*Chara  `json:"charas"`
}

type Designer struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
