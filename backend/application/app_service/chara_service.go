package app_service

import (
	"chat-role-play/domain/model"
	"context"
)

type CharaService interface {
	// designer
	FindDesigners(ctx context.Context, query model.DesignerQuery) (designers []model.Designer, err error)
	FindDesigner(ctx context.Context, ID uint32) (designer *model.Designer, err error)
	// charachip
	FindCharachips(ctx context.Context, query model.CharachipQuery) (charachips []model.Charachip, err error)
	FindCharachip(ctx context.Context, ID uint32) (charachip *model.Charachip, err error)
	// chara
	FindCharas(ctx context.Context, query model.CharaQuery) (charas []model.Chara, err error)
	FindChara(ctx context.Context, ID uint32) (chara *model.Chara, err error)
	// chara image
	FindCharaImages(ctx context.Context, query model.CharaImageQuery) (images []model.CharaImage, err error)
}

type charaService struct {
	charaRepository model.CharaRepository
}

func NewCharaService(charaRepository model.CharaRepository) CharaService {
	return &charaService{
		charaRepository: charaRepository,
	}
}

func (c *charaService) FindDesigners(ctx context.Context, query model.DesignerQuery) (designers []model.Designer, err error) {
	return c.charaRepository.FindDesigners(ctx, query)
}

func (c *charaService) FindDesigner(ctx context.Context, ID uint32) (designer *model.Designer, err error) {
	return c.charaRepository.FindDesigner(ctx, ID)
}

func (c *charaService) FindCharachips(ctx context.Context, query model.CharachipQuery) (charachips []model.Charachip, err error) {
	return c.charaRepository.FindCharachips(ctx, query)
}

func (c *charaService) FindCharachip(ctx context.Context, ID uint32) (charachip *model.Charachip, err error) {
	return c.charaRepository.FindCharachip(ctx, ID)
}

func (c *charaService) FindChara(ctx context.Context, ID uint32) (chara *model.Chara, err error) {
	return c.charaRepository.FindChara(ctx, ID)
}

func (c *charaService) FindCharas(ctx context.Context, query model.CharaQuery) (charas []model.Chara, err error) {
	return c.charaRepository.FindCharas(ctx, query)
}

func (c *charaService) FindCharaImages(ctx context.Context, query model.CharaImageQuery) (images []model.CharaImage, err error) {
	return c.charaRepository.FindCharaImages(ctx, query)
}
