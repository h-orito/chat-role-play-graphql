package db

import (
	model "chat-role-play/src/domain/model"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type PlayerRepository struct {
	db *DB
}

func NewPlayerRepository(db *DB) model.PlayerRepository {
	return &PlayerRepository{
		db: db,
	}
}

func (repo *PlayerRepository) Find(ID uint32) (_ *model.Player, err error) {
	var rdbPlayer Player
	result := repo.db.Connection.Model(&Player{}).First(&rdbPlayer, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}

	return rdbPlayer.ToModel(), nil
}

func (repo *PlayerRepository) FindByName(name string) (_ *model.Player, err error) {
	var rdbPlayer Player
	result := repo.db.Connection.Model(&Player{}).Where("player_name = ?", name).First(&rdbPlayer)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}

	return rdbPlayer.ToModel(), nil
}

func (repo *PlayerRepository) FindByUserName(username string) (_ *model.Player, err error) {
	var rdbPlayerAccount PlayerAccount
	result := repo.db.Connection.
		Model(&PlayerAccount{}).
		Where("user_name = ?", username).
		First(&rdbPlayerAccount)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return repo.Find(rdbPlayerAccount.PlayerID)
}

func (repo *PlayerRepository) Save(g *model.Player) (_ *model.Player, err error) {
	rdbPlayer := Player{
		PlayerName: g.Name,
	}
	result := repo.db.Connection.Create(&rdbPlayer)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return repo.Find(rdbPlayer.ID)
}
