package db

import (
	model "chat-role-play/src/domain/model"
	"chat-role-play/src/util/array"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type GameRepository struct {
	db *DB
}

func NewGameRepository(db *DB) model.GameRepository {
	return &GameRepository{
		db: db,
	}
}

func (repo *GameRepository) Find(ID uint32) (_ *model.Game, err error) {
	var rdbGame Game
	result := repo.db.Connection.Model(&Game{}).First(&rdbGame, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbGame.ToModel(), nil
}

func (repo *GameRepository) Search(query model.GameQuery) (games []model.Game, err error) {
	var rdbGames []Game
	result := repo.db.Connection.Model(&Game{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging.PageSize, query.Paging.PageNumber))
	} else {
		result = result.Scopes(Paginate(10, 1))
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.Name != nil {
		result = result.Where("game_name like ?", fmt.Sprintf("%%%s%%", *query.Name))
	}
	result = result.Find(&rdbGames)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}

	ids := array.Map(rdbGames, func(g Game) uint32 {
		return g.ID
	})
	pts, err := repo.findGameParticipantsByGameIDs(ids)
	if err != nil {
		return nil, err
	}
	return array.Map(rdbGames, func(g Game) model.Game {
		ptsCount := array.Count((*pts).List, func(p model.GameParticipant) bool {
			return p.GameID == g.ID
		})
		return *g.ToSimpleModel(ptsCount)
	}), nil
}

func (repo *GameRepository) FindGameParticipantsByGameID(
	ID uint32,
	pageSize *int,
	pageNumber *int,
) (_ *model.GameParticipants, err error) {
	var rdbGameParticipants []Participant
	result := repo.db.Connection.Model(&Participant{})
	if pageSize != nil && pageNumber != nil {
		result = result.Scopes(Paginate(*pageSize, *pageNumber))
	}
	result = result.Find(&rdbGameParticipants, "game_id = ?", ID)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &model.GameParticipants{
		List: array.Map(rdbGameParticipants, func(p Participant) model.GameParticipant {
			return *p.ToModel()
		}),
	}, nil
}

func (repo *GameRepository) findGameParticipantsByGameIDs(IDs []uint32) (participants *model.GameParticipants, err error) {
	var rdbGameParticipants []Participant
	result := repo.db.Connection.Model(&Participant{}).Find(&rdbGameParticipants, "game_id in (?)", IDs)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &model.GameParticipants{
		List: array.Map(rdbGameParticipants, func(p Participant) model.GameParticipant {
			return *p.ToModel()
		}),
	}, nil
}

func (repo *GameRepository) Save(g *model.Game) (_ *model.Game, err error) {
	rdbGame := Game{
		GameName: g.Name,
	}
	result := repo.db.Connection.Create(&rdbGame)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return repo.Find(rdbGame.ID)
}
