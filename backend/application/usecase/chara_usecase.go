package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"context"
)

type CharaUsecase interface {
	FindDesigners(query model.DesignerQuery) ([]model.Designer, error)
	FindDesigner(ID uint32) (*model.Designer, error)
	RegisterDesigner(ctx context.Context, designer model.Designer) (*model.Designer, error)
	UpdateDesigner(ctx context.Context, designer model.Designer) (*model.Designer, error)
	FindCharachips(query model.CharachipQuery) ([]model.Charachip, error)
	FindCharachip(ID uint32) (*model.Charachip, error)
	RegisterCharachip(ctx context.Context, charachip model.Charachip) (*model.Charachip, error)
	UpdateCharachip(ctx context.Context, charachip model.Charachip) (*model.Charachip, error)
	FindCharas(IDs []uint32) ([]model.Chara, error)
	FindChara(ID uint32) (*model.Chara, error)
	RegisterChara(ctx context.Context, chara model.Chara, charachipID *uint32) (*model.Chara, error)
	UpdateChara(ctx context.Context, chara model.Chara) (*model.Chara, error)
	FindCharaImages(query model.CharaImageQuery) ([]model.CharaImage, error)
	RegisterCharaImage(ctx context.Context, image model.CharaImage, charaID uint32) (*model.CharaImage, error)
	UpdateCharaImage(ctx context.Context, image model.CharaImage) (*model.CharaImage, error)
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

func (c *charaUsecase) FindDesigners(query model.DesignerQuery) ([]model.Designer, error) {
	return c.charaService.FindDesigners(query)
}

func (c *charaUsecase) FindDesigner(ID uint32) (*model.Designer, error) {
	return c.charaService.FindDesigner(ID)
}

func (c *charaUsecase) RegisterDesigner(ctx context.Context, designer model.Designer) (*model.Designer, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.RegisterDesigner(ctx, designer)
	})
	return d.(*model.Designer), err
}

func (c *charaUsecase) UpdateDesigner(ctx context.Context, designer model.Designer) (*model.Designer, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.UpdateDesigner(ctx, designer)
	})
	return d.(*model.Designer), err
}

func (c *charaUsecase) FindCharachips(query model.CharachipQuery) ([]model.Charachip, error) {
	return c.charaService.FindCharachips(query)
}

func (c *charaUsecase) FindCharachip(ID uint32) (*model.Charachip, error) {
	return c.charaService.FindCharachip(ID)
}

func (c *charaUsecase) RegisterCharachip(ctx context.Context, charachip model.Charachip) (*model.Charachip, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.RegisterCharachip(ctx, charachip)
	})
	return d.(*model.Charachip), err
}

func (c *charaUsecase) UpdateCharachip(ctx context.Context, charachip model.Charachip) (*model.Charachip, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.UpdateCharachip(ctx, charachip)
	})
	return d.(*model.Charachip), err
}

func (c *charaUsecase) FindCharas(IDs []uint32) ([]model.Chara, error) {
	return c.charaService.FindCharas(model.CharaQuery{IDs: &IDs})
}

func (c *charaUsecase) FindChara(ID uint32) (*model.Chara, error) {
	return c.charaService.FindChara(ID)
}

func (c *charaUsecase) RegisterChara(ctx context.Context, chara model.Chara, charachipID *uint32) (*model.Chara, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.RegisterChara(ctx, chara, charachipID)
	})
	return d.(*model.Chara), err
}

func (c *charaUsecase) UpdateChara(ctx context.Context, chara model.Chara) (*model.Chara, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.UpdateChara(ctx, chara)
	})
	return d.(*model.Chara), err
}

func (c *charaUsecase) FindCharaImages(query model.CharaImageQuery) ([]model.CharaImage, error) {
	return c.charaService.FindCharaImages(query)
}

func (c *charaUsecase) RegisterCharaImage(ctx context.Context, image model.CharaImage, charaID uint32) (*model.CharaImage, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.RegisterCharaImage(ctx, image, charaID)
	})
	return d.(*model.CharaImage), err
}

func (c *charaUsecase) UpdateCharaImage(ctx context.Context, image model.CharaImage) (*model.CharaImage, error) {
	d, err := c.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return c.charaService.UpdateCharaImage(ctx, image)
	})
	return d.(*model.CharaImage), err
}
