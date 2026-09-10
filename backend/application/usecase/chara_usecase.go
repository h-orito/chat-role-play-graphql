package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"context"
)

type CharaUsecase interface {
	FindDesigners(ctx context.Context, query model.DesignerQuery) ([]model.Designer, error)
	FindDesigner(ctx context.Context, ID uint32) (*model.Designer, error)
	FindCharachips(ctx context.Context, query model.CharachipQuery) ([]model.Charachip, error)
	FindCharachip(ctx context.Context, ID uint32) (*model.Charachip, error)
	FindCharas(ctx context.Context, IDs []uint32) ([]model.Chara, error)
	FindChara(ctx context.Context, ID uint32) (*model.Chara, error)
	FindCharaImages(ctx context.Context, query model.CharaImageQuery) ([]model.CharaImage, error)
}

type charaUsecase struct {
	charaService app_service.CharaService
	transaction  Transaction
}

func NewCharaUsecase(charaService app_service.CharaService, tx Transaction) CharaUsecase {
	return &charaUsecase{
		charaService: charaService,
		transaction:  tx,
	}
}

func (c *charaUsecase) FindDesigners(ctx context.Context, query model.DesignerQuery) ([]model.Designer, error) {
	return c.charaService.FindDesigners(ctx, query)
}

func (c *charaUsecase) FindDesigner(ctx context.Context, ID uint32) (*model.Designer, error) {
	return c.charaService.FindDesigner(ctx, ID)
}

func (c *charaUsecase) FindCharachips(ctx context.Context, query model.CharachipQuery) ([]model.Charachip, error) {
	return c.charaService.FindCharachips(ctx, query)
}

func (c *charaUsecase) FindCharachip(ctx context.Context, ID uint32) (*model.Charachip, error) {
	return c.charaService.FindCharachip(ctx, ID)
}

func (c *charaUsecase) FindCharas(ctx context.Context, IDs []uint32) ([]model.Chara, error) {
	return c.charaService.FindCharas(ctx, model.CharaQuery{IDs: &IDs})
}

func (c *charaUsecase) FindChara(ctx context.Context, ID uint32) (*model.Chara, error) {
	return c.charaService.FindChara(ctx, ID)
}

func (c *charaUsecase) FindCharaImages(ctx context.Context, query model.CharaImageQuery) ([]model.CharaImage, error) {
	return c.charaService.FindCharaImages(ctx, query)
}
