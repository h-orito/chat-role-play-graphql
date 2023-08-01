package db

import (
	model "chat-role-play/domain/model"
	"time"
)

type Designer struct {
	ID           uint32
	DesignerName string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (d Designer) ToModel() *model.Designer {
	return &model.Designer{
		ID:   d.ID,
		Name: d.DesignerName,
	}
}

type Charachip struct {
	ID            uint32
	CharachipName string
	DesignerID    uint32
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (c Charachip) ToModel(
	designer *model.Designer,
	charas []model.Chara,
) *model.Charachip {
	return &model.Charachip{
		ID:       c.ID,
		Name:     c.CharachipName,
		Designer: *designer,
		Charas:   charas,
	}
}

type Chara struct {
	ID          uint32
	CharaName   string
	CharachipId *uint32
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (c Chara) ToModel(
	images []model.CharaImage,
) *model.Chara {
	return &model.Chara{
		ID:     c.ID,
		Name:   c.CharaName,
		Images: images,
	}
}

type CharaImage struct {
	ID             uint32
	CharaID        uint32
	CharaImageType string
	CharaImageUrl  string
	Width          uint32
	Height         uint32
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func (c CharaImage) ToModel() *model.CharaImage {
	return &model.CharaImage{
		ID:   c.ID,
		Type: c.CharaImageType,
		Size: model.CharaSize{
			Width:  c.Width,
			Height: c.Height,
		},
		URL: c.CharaImageUrl,
	}
}
