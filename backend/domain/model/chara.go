package model

import "context"

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
	ID       uint32
	Name     string
	Designer Designer
	Charas   []Chara
}

type CharachipQuery struct {
	IDs    *[]uint32
	Name   *string
	Paging *PagingQuery
}

type Chara struct {
	ID     uint32
	Name   string
	Images []CharaImage
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
	Size CharaSize
	URL  string
}

type CharaImageQuery struct {
	IDs      *[]uint32
	CharaID  *uint32
	CharaIDs *[]uint32
	Paging   *PagingQuery
}

type CharaSize struct {
	Width  uint32
	Height uint32
}

type CharaRepository interface {
	// designer
	FindDesigners(query DesignerQuery) (designers []Designer, err error)
	FindDesigner(ID uint32) (designer *Designer, err error)
	RegisterDesigner(ctx context.Context, designer Designer) (saved *Designer, err error)
	UpdateDesigner(ctx context.Context, designer Designer) (saved *Designer, err error)
	// charachip
	FindCharachips(query CharachipQuery) (charachips []Charachip, err error)
	FindCharachip(ID uint32) (charachip *Charachip, err error)
	RegisterCharachip(ctx context.Context, charachip Charachip) (saved *Charachip, err error)
	UpdateCharachip(ctx context.Context, charachip Charachip) (saved *Charachip, err error)
	// chara
	FindCharas(query CharaQuery) (charas []Chara, err error)
	FindChara(ID uint32) (chara *Chara, err error)
	RegisterChara(
		ctx context.Context,
		chara Chara,
		charachipID *uint32,
		playerID *uint32,
	) (saved *Chara, err error)
	UpdateChara(ctx context.Context, chara Chara) (saved *Chara, err error)
	// chara image
	FindCharaImages(query CharaImageQuery) (images []CharaImage, err error)
	RegisterCharaImage(ctx context.Context, image CharaImage, charaID uint32) (saved *CharaImage, err error)
	UpdateCharaImage(ctx context.Context, image CharaImage) (saved *CharaImage, err error)
}
