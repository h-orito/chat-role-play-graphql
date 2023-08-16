package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
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

func (repo *CharaRepository) FindCharachips(query model.CharachipQuery) (charachips []model.Charachip, err error) {
	return findCharachips(repo.db.Connection, query)
}

func (repo *CharaRepository) FindCharachip(ID uint32) (charachip *model.Charachip, err error) {
	return findCharachip(repo.db.Connection, ID)
}

func (repo *CharaRepository) FindCharas(query model.CharaQuery) (charas []model.Chara, err error) {
	return findCharas(repo.db.Connection, query)
}

func (repo *CharaRepository) FindChara(ID uint32) (chara *model.Chara, err error) {
	return findChara(repo.db.Connection, ID)
}

func (repo *CharaRepository) FindCharaImages(query model.CharaImageQuery) (images []model.CharaImage, err error) {
	return findCharaImages(repo.db.Connection, query)
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
			array.Filter(charas, func(chara model.Chara) bool {
				return chara.CharachipID == c.ID
			}),
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

// chara

func findCharas(db *gorm.DB, query model.CharaQuery) (charas []model.Chara, err error) {
	rdbCharas, err := findRdbCharas(db, query)
	if err != nil {
		return nil, err
	}

	cIDs := array.Uint32Distinct(array.Map(rdbCharas, func(c Chara) uint32 {
		return c.ID
	}))

	images, err := findRdbCharaImages(db, model.CharaImageQuery{
		CharaIDs: &cIDs,
	})
	if err != nil {
		return nil, err
	}

	return array.Map(rdbCharas, func(c Chara) model.Chara {
		cis := array.Map(array.Filter(images, func(i CharaImage) bool {
			return i.CharaID == c.ID
		}), func(i CharaImage) model.CharaImage {
			return *i.ToModel()
		})
		return *c.ToModel(cis)
	}), nil
}

func findRdbCharas(db *gorm.DB, query model.CharaQuery) (charas []Chara, err error) {
	var rdbCharas []Chara
	result := db.Model(&Chara{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(&model.PagingQuery{
			PageSize:   10000,
			PageNumber: 1,
			Desc:       false,
		}))
	}
	if query.CharachipIDs != nil {
		result = result.Where("charachip_id in (?)", *query.CharachipIDs)
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
		result = result.Scopes(Paginate(&model.PagingQuery{
			PageSize:   10000,
			PageNumber: 1,
			Desc:       false,
		}))
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
