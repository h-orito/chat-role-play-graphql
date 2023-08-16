package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
)

type CharaUsecase interface {
	FindDesigners(query model.DesignerQuery) ([]model.Designer, error)
	FindDesigner(ID uint32) (*model.Designer, error)
	FindCharachips(query model.CharachipQuery) ([]model.Charachip, error)
	FindCharachip(ID uint32) (*model.Charachip, error)
	FindCharas(IDs []uint32) ([]model.Chara, error)
	FindChara(ID uint32) (*model.Chara, error)
	FindCharaImages(query model.CharaImageQuery) ([]model.CharaImage, error)
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

func (c *charaUsecase) FindCharachips(query model.CharachipQuery) ([]model.Charachip, error) {
	return c.charaService.FindCharachips(query)
}

func (c *charaUsecase) FindCharachip(ID uint32) (*model.Charachip, error) {
	return c.charaService.FindCharachip(ID)
}

func (c *charaUsecase) FindCharas(IDs []uint32) ([]model.Chara, error) {
	return c.charaService.FindCharas(model.CharaQuery{IDs: &IDs})
}

func (c *charaUsecase) FindChara(ID uint32) (*model.Chara, error) {
	return c.charaService.FindChara(ID)
}

func (c *charaUsecase) FindCharaImages(query model.CharaImageQuery) ([]model.CharaImage, error) {
	return c.charaService.FindCharaImages(query)
}
