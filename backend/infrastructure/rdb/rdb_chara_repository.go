package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type CharaRepository struct {
	db *DB
}

func NewCharaRepository(db *DB) model.CharaRepository {
	return &CharaRepository{
		db: db,
	}
}

func (repo *CharaRepository) FindDesigners(query model.DesignerQuery) (designers []model.Designer, err error) {
	return findDesigners(repo.db.Connection, query)
}

func (repo *CharaRepository) FindDesigner(ID uint32) (designer *model.Designer, err error) {
	return findDesigner(repo.db.Connection, ID)
}

func (repo *CharaRepository) RegisterDesigner(ctx context.Context, designer model.Designer) (saved *model.Designer, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerDesigner(tx, designer)
}

func (*CharaRepository) UpdateDesigner(ctx context.Context, designer model.Designer) (saved *model.Designer, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return updateDesigner(tx, designer)
}

func (repo *CharaRepository) FindCharachips(query model.CharachipQuery) (charachips []model.Charachip, err error) {
	return findCharachips(repo.db.Connection, query)
}

func (repo *CharaRepository) FindCharachip(ID uint32) (charachip *model.Charachip, err error) {
	return findCharachip(repo.db.Connection, ID)
}

func (repo *CharaRepository) RegisterCharachip(ctx context.Context, charachip model.Charachip) (saved *model.Charachip, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerCharachip(tx, charachip)
}

func (*CharaRepository) UpdateCharachip(ctx context.Context, charachip model.Charachip) (saved *model.Charachip, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return updateCharachip(tx, charachip)
}

func (repo *CharaRepository) FindCharas(query model.CharaQuery) (charas []model.Chara, err error) {
	return findCharas(repo.db.Connection, query)
}

func (repo *CharaRepository) FindChara(ID uint32) (chara *model.Chara, err error) {
	return findChara(repo.db.Connection, ID)
}

func (repo *CharaRepository) RegisterChara(
	ctx context.Context,
	chara model.Chara,
	charachipID *uint32,
	playerID *uint32,
) (saved *model.Chara, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerChara(tx, chara, charachipID, playerID)
}

func (*CharaRepository) UpdateChara(ctx context.Context, chara model.Chara) (saved *model.Chara, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return updateChara(tx, chara)
}

func (repo *CharaRepository) FindCharaImages(query model.CharaImageQuery) (images []model.CharaImage, err error) {
	return findCharaImages(repo.db.Connection, query)
}

func (repo *CharaRepository) RegisterCharaImage(
	ctx context.Context,
	image model.CharaImage,
	charaID uint32,
) (saved *model.CharaImage, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerCharaImage(tx, image, charaID)
}
func (*CharaRepository) UpdateCharaImage(ctx context.Context, image model.CharaImage) (saved *model.CharaImage, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return updateCharaImage(tx, image)
}

// designer

func findDesigners(db *gorm.DB, query model.DesignerQuery) (designers []model.Designer, err error) {
	rdbDesigners, err := findRdbDesigners(db, query)
	if err != nil {
		return nil, err
	}

	return array.Map(rdbDesigners, func(d Designer) model.Designer {
		return *d.ToModel()
	}), nil
}

func findRdbDesigners(db *gorm.DB, query model.DesignerQuery) (designers []Designer, err error) {
	var rdbDesigners []Designer
	result := db.Model(&Designer{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(nil))
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.Name != nil {
		result = result.Where("designer_name like ?", fmt.Sprintf("%%%s%%", *query.Name))
	}
	result = result.Find(&rdbDesigners)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbDesigners, nil
}

func findDesigner(db *gorm.DB, ID uint32) (designer *model.Designer, err error) {
	rdbDesigner, err := findRdbDesigner(db, ID)
	if err != nil {
		return nil, err
	}
	return rdbDesigner.ToModel(), nil
}

func findRdbDesigner(db *gorm.DB, ID uint32) (designer *Designer, err error) {
	var rdbDesigner Designer
	result := db.Model(&Designer{}).First(&rdbDesigner, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbDesigner, nil
}

func registerDesigner(db *gorm.DB, designer model.Designer) (saved *model.Designer, err error) {
	rdbDesigner := Designer{
		DesignerName: designer.Name,
	}
	result := db.Create(&rdbDesigner)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return findDesigner(db, rdbDesigner.ID)
}

func updateDesigner(db *gorm.DB, designer model.Designer) (saved *model.Designer, err error) {
	rdbDesigner, err := findRdbDesigner(db, designer.ID)
	if err != nil {
		return nil, err
	}
	if rdbDesigner == nil {
		return nil, fmt.Errorf("designer not found")
	}
	rdbDesigner.DesignerName = designer.Name
	result := db.Save(&rdbDesigner)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return findDesigner(db, rdbDesigner.ID)
}

// charachip

func findCharachips(db *gorm.DB, query model.CharachipQuery) (charachips []model.Charachip, err error) {
	rdbCharachips, err := findRdbCharachips(db, query)
	if err != nil {
		return nil, err
	}

	dsIDs := array.Uint32Distinct(array.Map(rdbCharachips, func(c Charachip) uint32 {
		return c.DesignerID
	}))
	designers, err := findDesigners(db, model.DesignerQuery{
		IDs: &dsIDs,
	})
	if err != nil {
		return nil, err
	}

	chipIDs := array.Map(rdbCharachips, func(c Charachip) uint32 {
		return c.ID
	})
	charas, err := findCharas(db, model.CharaQuery{
		CharachipIDs: &chipIDs,
	})
	if err != nil {
		return nil, err
	}

	return array.Map(rdbCharachips, func(c Charachip) model.Charachip {
		return *c.ToModel(
			array.Find(designers, func(d model.Designer) bool {
				return d.ID == c.DesignerID
			}),
			charas,
		)
	}), nil
}

func findRdbCharachips(db *gorm.DB, query model.CharachipQuery) (charachips []Charachip, err error) {
	var rdbCharachips []Charachip
	result := db.Model(&Charachip{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(nil))
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.Name != nil {
		result = result.Where("designer_name like ?", fmt.Sprintf("%%%s%%", *query.Name))
	}
	result = result.Find(&rdbCharachips)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbCharachips, nil
}

func findCharachip(db *gorm.DB, ID uint32) (charachip *model.Charachip, err error) {
	rdbCharachip, err := findRdbCharachip(db, ID)
	if err != nil {
		return nil, err
	}

	d, err := findDesigner(db, rdbCharachip.DesignerID)
	if err != nil {
		return nil, err
	}

	chipIDs := []uint32{rdbCharachip.ID}
	charas, err := findCharas(db, model.CharaQuery{
		CharachipIDs: &chipIDs,
	})
	if err != nil {
		return nil, err
	}

	return rdbCharachip.ToModel(
		d,
		charas,
	), nil
}

func findRdbCharachip(db *gorm.DB, ID uint32) (charachip *Charachip, err error) {
	var rdbCharachip Charachip
	result := db.Model(&Charachip{}).First(&rdbCharachip, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbCharachip, nil
}

func registerCharachip(db *gorm.DB, charachip model.Charachip) (saved *model.Charachip, err error) {
	rdbCharachip := Charachip{
		CharachipName: charachip.Name,
		DesignerID:    charachip.Designer.ID,
	}
	result := db.Create(&rdbCharachip)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return findCharachip(db, rdbCharachip.ID)
}

func updateCharachip(db *gorm.DB, charachip model.Charachip) (saved *model.Charachip, err error) {
	rdbCharachip, err := findRdbCharachip(db, charachip.ID)
	if err != nil {
		return nil, err
	}
	if rdbCharachip == nil {
		return nil, fmt.Errorf("charachip not found")
	}
	rdbCharachip.CharachipName = charachip.Name
	result := db.Save(&rdbCharachip)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return findCharachip(db, rdbCharachip.ID)
}

// chara

func findCharas(db *gorm.DB, query model.CharaQuery) (charas []model.Chara, err error) {
	rdbCharas, err := findRdbCharas(db, query)
	if err != nil {
		return nil, err
	}

	cIDs := array.Uint32Distinct(array.Map(rdbCharas, func(c Chara) uint32 {
		return c.ID
	}))

	images, err := findCharaImages(db, model.CharaImageQuery{
		CharaIDs: &cIDs,
	})
	if err != nil {
		return nil, err
	}

	return array.Map(rdbCharas, func(c Chara) model.Chara {
		return *c.ToModel(images)
	}), nil
}

func findRdbCharas(db *gorm.DB, query model.CharaQuery) (charas []Chara, err error) {
	var rdbCharas []Chara
	result := db.Model(&Chara{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(nil))
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.Name != nil {
		result = result.Where("designer_name like ?", fmt.Sprintf("%%%s%%", *query.Name))
	}
	result = result.Find(&rdbCharas)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbCharas, nil
}

func findChara(db *gorm.DB, ID uint32) (chara *model.Chara, err error) {
	rdbChara, err := findRdbChara(db, ID)
	if err != nil {
		return nil, err
	}

	images, err := findCharaImages(db, model.CharaImageQuery{
		CharaID: &rdbChara.ID,
	})
	if err != nil {
		return nil, err
	}

	return rdbChara.ToModel(images), nil
}

func findRdbChara(db *gorm.DB, ID uint32) (chara *Chara, err error) {
	var rdbChara Chara
	result := db.Model(&Chara{}).First(&rdbChara, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbChara, nil
}

func registerChara(
	db *gorm.DB,
	chara model.Chara,
	charachipID *uint32,
	playerID *uint32,
) (saved *model.Chara, err error) {
	rdbChara := Chara{
		CharaName:   chara.Name,
		CharachipId: charachipID,
		PlayerId:    playerID,
	}
	result := db.Create(&rdbChara)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return findChara(db, rdbChara.ID)
}

func updateChara(
	db *gorm.DB,
	chara model.Chara,
) (saved *model.Chara, err error) {
	rdbChara, err := findRdbChara(db, chara.ID)
	if err != nil {
		return nil, err
	}
	if rdbChara == nil {
		return nil, fmt.Errorf("chara not found")
	}
	rdbChara.CharaName = chara.Name
	result := db.Save(&rdbChara)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return findChara(db, rdbChara.ID)
}

// chara image

func findCharaImages(db *gorm.DB, query model.CharaImageQuery) (images []model.CharaImage, err error) {
	rdbCharaImages, err := findRdbCharaImages(db, query)
	if err != nil {
		return nil, err
	}

	return array.Map(rdbCharaImages, func(c CharaImage) model.CharaImage {
		return *c.ToModel()
	}), nil
}

func findRdbCharaImages(db *gorm.DB, query model.CharaImageQuery) (images []CharaImage, err error) {
	var rdbCharamages []CharaImage
	result := db.Model(&CharaImage{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(nil))
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.CharaIDs != nil {
		result = result.Where("chara_id in (?)", *query.CharaIDs)
	} else if query.CharaID != nil {
		result = result.Where("chara_id = ?", *query.CharaID)
	}
	result = result.Find(&rdbCharamages)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbCharamages, nil
}

func registerCharaImage(
	db *gorm.DB,
	image model.CharaImage,
	charaID uint32,
) (saved *model.CharaImage, err error) {
	rdbCharaImage := CharaImage{
		CharaID:        charaID,
		CharaImageType: image.Type,
		CharaImageUrl:  image.URL,
		Width:          image.Size.Width,
		Height:         image.Size.Height,
	}
	result := db.Create(&rdbCharaImage)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	var rdb CharaImage
	result = db.Model(&CharaImage{}).First(&rdb, rdbCharaImage.ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb.ToModel(), nil
}

func updateCharaImage(
	db *gorm.DB,
	image model.CharaImage,
) (saved *model.CharaImage, err error) {
	var rdbCharaImage CharaImage
	result := db.Model(&CharaImage{}).First(&rdbCharaImage, image.ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("chara image not found")
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	rdbCharaImage.CharaImageType = image.Type
	rdbCharaImage.CharaImageUrl = image.URL
	rdbCharaImage.Width = image.Size.Width
	rdbCharaImage.Height = image.Size.Height
	result = db.Save(&rdbCharaImage)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return rdbCharaImage.ToModel(), nil
}
