package model

type Designer struct {
	ID   uint32
	Name string
}

type DesignerQuery struct {
	IDs    *[]uint32
	Name   *string
	Paging *PagingQuery
}

type Charachip struct {
	ID             uint32
	Name           string
	Designer       Designer
	DescriptionURL string
	CanChangeName  bool
	Charas         []Chara
}

type CharachipQuery struct {
	IDs    *[]uint32
	Name   *string
	Paging *PagingQuery
}

type Chara struct {
	ID          uint32
	CharachipID uint32
	Name        string
	Size        CharaSize
	Images      []CharaImage
}

type CharaSize struct {
	Width  uint32
	Height uint32
}

type CharaQuery struct {
	IDs          *[]uint32
	Name         *string
	CharachipIDs *[]uint32
	PlayerID     *uint32
	Paging       *PagingQuery
}

type CharaImage struct {
	ID   uint32
	Type string
	URL  string
}

type CharaImageQuery struct {
	IDs      *[]uint32
	CharaID  *uint32
	CharaIDs *[]uint32
	Paging   *PagingQuery
}

type CharaRepository interface {
	// designer
	FindDesigners(query DesignerQuery) (designers []Designer, err error)
	FindDesigner(ID uint32) (designer *Designer, err error)
	// charachip
	FindCharachips(query CharachipQuery) (charachips []Charachip, err error)
	FindCharachip(ID uint32) (charachip *Charachip, err error)
	// chara
	FindCharas(query CharaQuery) (charas []Chara, err error)
	FindChara(ID uint32) (chara *Chara, err error)
	// chara image
	FindCharaImages(query CharaImageQuery) (images []CharaImage, err error)
}
