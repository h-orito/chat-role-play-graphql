package app_service

import (
	"chat-role-play/domain/model"
	"context"
)

type CharaService interface {
	// designer
	FindDesigners(query model.DesignerQuery) (designers []model.Designer, err error)
	FindDesigner(ID uint32) (designer *model.Designer, err error)
	RegisterDesigner(ctx context.Context, designer model.Designer) (saved *model.Designer, err error)
	UpdateDesigner(ctx context.Context, designer model.Designer) (saved *model.Designer, err error)
	// charachip
	FindCharachips(query model.CharachipQuery) (charachips []model.Charachip, err error)
	FindCharachip(ID uint32) (charachip *model.Charachip, err error)
	RegisterCharachip(ctx context.Context, charachip model.Charachip) (saved *model.Charachip, err error)
	UpdateCharachip(ctx context.Context, charachip model.Charachip) (saved *model.Charachip, err error)
	// chara
	FindCharas(query model.CharaQuery) (charas []model.Chara, err error)
	FindChara(ID uint32) (chara *model.Chara, err error)
	RegisterChara(
		ctx context.Context,
		chara model.Chara,
		charachipID *uint32,
	) (saved *model.Chara, err error)
	UpdateChara(
		ctx context.Context,
		chara model.Chara,
	) (saved *model.Chara, err error)
	// chara image
	FindCharaImages(query model.CharaImageQuery) (images []model.CharaImage, err error)
	RegisterCharaImage(ctx context.Context, image model.CharaImage, charaID uint32) (saved *model.CharaImage, err error)
	UpdateCharaImage(ctx context.Context, image model.CharaImage) (saved *model.CharaImage, err error)
}

type charaService struct {
	charaRepository model.CharaRepository
}

func NewCharaService(charaRepository model.CharaRepository) CharaService {
	return &charaService{
		charaRepository: charaRepository,
	}
}

func (c *charaService) FindDesigners(query model.DesignerQuery) (designers []model.Designer, err error) {
	return c.charaRepository.FindDesigners(query)
}

func (c *charaService) FindDesigner(ID uint32) (designer *model.Designer, err error) {
	return c.charaRepository.FindDesigner(ID)
}

func (c *charaService) RegisterDesigner(ctx context.Context, designer model.Designer) (saved *model.Designer, err error) {
	return c.charaRepository.RegisterDesigner(ctx, designer)
}

func (c *charaService) UpdateDesigner(ctx context.Context, designer model.Designer) (saved *model.Designer, err error) {
	return c.charaRepository.UpdateDesigner(ctx, designer)
}

func (c *charaService) FindCharachips(query model.CharachipQuery) (charachips []model.Charachip, err error) {
	return c.charaRepository.FindCharachips(query)
}

func (c *charaService) FindCharachip(ID uint32) (charachip *model.Charachip, err error) {
	return c.charaRepository.FindCharachip(ID)
}

func (c *charaService) RegisterCharachip(ctx context.Context, charachip model.Charachip) (saved *model.Charachip, err error) {
	return c.charaRepository.RegisterCharachip(ctx, charachip)
}

func (c *charaService) UpdateCharachip(ctx context.Context, charachip model.Charachip) (saved *model.Charachip, err error) {
	return c.charaRepository.UpdateCharachip(ctx, charachip)
}

func (c *charaService) FindChara(ID uint32) (chara *model.Chara, err error) {
	return c.charaRepository.FindChara(ID)
}

func (c *charaService) FindCharas(query model.CharaQuery) (charas []model.Chara, err error) {
	return c.charaRepository.FindCharas(query)
}

func (c *charaService) RegisterChara(ctx context.Context, chara model.Chara, charachipID *uint32) (saved *model.Chara, err error) {
	return c.charaRepository.RegisterChara(ctx, chara, charachipID)
}

func (c *charaService) UpdateChara(ctx context.Context, chara model.Chara) (saved *model.Chara, err error) {
	return c.charaRepository.UpdateChara(ctx, chara)
}

func (c *charaService) FindCharaImages(query model.CharaImageQuery) (images []model.CharaImage, err error) {
	return c.charaRepository.FindCharaImages(query)
}

func (c *charaService) RegisterCharaImage(ctx context.Context, image model.CharaImage, charaID uint32) (saved *model.CharaImage, err error) {
	return c.charaRepository.RegisterCharaImage(ctx, image, charaID)
}

func (c *charaService) UpdateCharaImage(ctx context.Context, image model.CharaImage) (saved *model.CharaImage, err error) {
	return c.charaRepository.UpdateCharaImage(ctx, image)
}
