package graphql

import (
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
)

func MapToDesigner(d *model.Designer) *gqlmodel.Designer {
	if d == nil {
		return nil
	}
	return &gqlmodel.Designer{
		ID:   intIdToBase64(d.ID, "Designer"),
		Name: d.Name,
	}
}

func MapToCharachip(c *model.Charachip) *gqlmodel.Charachip {
	if c == nil {
		return nil
	}
	return &gqlmodel.Charachip{
		ID:             intIdToBase64(c.ID, "Charachip"),
		Name:           c.Name,
		Designer:       MapToDesigner(&c.Designer),
		DescriptionURL: c.DescriptionURL,
		CanChangeName:  c.CanChangeName,
		Charas: array.Map(c.Charas, func(c model.Chara) *gqlmodel.Chara {
			return MapToChara(&c)
		}),
	}
}

func MapToChara(c *model.Chara) *gqlmodel.Chara {
	if c == nil {
		return nil
	}
	return &gqlmodel.Chara{
		ID:   intIdToBase64(c.ID, "Chara"),
		Name: c.Name,
		Size: &gqlmodel.CharaSize{
			Width:  int(c.Size.Width),
			Height: int(c.Size.Height),
		},
		Images: array.Map(c.Images, func(i model.CharaImage) *gqlmodel.CharaImage {
			return MapToCharaImage(&i)
		}),
	}
}

func MapToCharaImage(ci *model.CharaImage) *gqlmodel.CharaImage {
	if ci == nil {
		return nil
	}
	return &gqlmodel.CharaImage{
		ID:   intIdToBase64(ci.ID, "CharaImage"),
		Type: ci.Type,
		URL:  ci.URL,
	}
}
