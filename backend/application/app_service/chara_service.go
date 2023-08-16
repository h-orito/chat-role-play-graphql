package app_service

import (
	"chat-role-play/domain/model"
)

type CharaService interface {
	// designer
	FindDesigners(query model.DesignerQuery) (designers []model.Designer, err error)
	FindDesigner(ID uint32) (designer *model.Designer, err error)
	// charachip
	FindCharachips(query model.CharachipQuery) (charachips []model.Charachip, err error)
	FindCharachip(ID uint32) (charachip *model.Charachip, err error)
	// chara
	FindCharas(query model.CharaQuery) (charas []model.Chara, err error)
	FindChara(ID uint32) (chara *model.Chara, err error)
	// chara image
	FindCharaImages(query model.CharaImageQuery) (images []model.CharaImage, err error)
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

func (c *charaService) FindCharachips(query model.CharachipQuery) (charachips []model.Charachip, err error) {
	return c.charaRepository.FindCharachips(query)
}

func (c *charaService) FindCharachip(ID uint32) (charachip *model.Charachip, err error) {
	return c.charaRepository.FindCharachip(ID)
}

func (c *charaService) FindChara(ID uint32) (chara *model.Chara, err error) {
	return c.charaRepository.FindChara(ID)
}

func (c *charaService) FindCharas(query model.CharaQuery) (charas []model.Chara, err error) {
	return c.charaRepository.FindCharas(query)
}

func (c *charaService) FindCharaImages(query model.CharaImageQuery) (images []model.CharaImage, err error) {
	return c.charaRepository.FindCharaImages(query)
}
