package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
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

func (repo *PlayerRepository) FindPlayers(IDs []uint32) ([]model.Player, error) {
	return repo.findPlayers(repo.db.Connection, IDs)
}

func (repo *PlayerRepository) Find(ID uint32) (_ *model.Player, err error) {
	return repo.findPlayer(repo.db.Connection, ID)
}

func (repo *PlayerRepository) FindByName(name string) (_ *model.Player, err error) {
	rdbPlayer, err := repo.findRdbPlayerByName(repo.db.Connection, name)
	if err != nil {
		return nil, err
	}
	if rdbPlayer == nil {
		return nil, nil
	}
	return rdbPlayer.ToModel(), nil
}

func (repo *PlayerRepository) FindByUserName(username string) (_ *model.Player, err error) {
	return repo.findByUserName(repo.db.Connection, username)
}

func (repo *PlayerRepository) Save(ctx context.Context, p *model.Player) (_ *model.Player, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}

	rdbPlayer, err := repo.findRdbPlayer(tx, p.ID)
	if err != nil {
		return nil, err
	}
	if rdbPlayer == nil {
		return nil, nil
	}
	rdbPlayer.PlayerName = p.Name
	result := tx.Save(&rdbPlayer)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return repo.findPlayer(tx, rdbPlayer.ID)
}

func (repo *PlayerRepository) FindProfile(ID uint32) (profile *model.PlayerProfile, err error) {
	return repo.findProfile(repo.db.Connection, ID)
}

func (repo *PlayerRepository) SaveProfile(ctx context.Context, name string, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}

	rdbPlayer, err := repo.findRdbPlayer(tx, profile.PlayerID)
	if err != nil {
		return nil, err
	}
	if rdbPlayer == nil {
		return nil, errors.New("player not found")
	}
	rdbPlayer.PlayerName = name
	result := tx.Save(&rdbPlayer)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}

	rdbPlayerProfile, err := repo.findRdbProfile(tx, profile.PlayerID)
	if err != nil {
		return nil, err
	}
	if rdbPlayerProfile == nil {
		return nil, nil
	}
	rdbPlayerProfile.ProfileImageUrl = profile.ProfileImageURL
	rdbPlayerProfile.Introduction = profile.Introduction
	result = tx.Save(&rdbPlayerProfile)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return repo.findProfile(tx, rdbPlayerProfile.PlayerID)
}

func (repo *PlayerRepository) RegisterSnsAccount(
	ctx context.Context,
	playerID uint32,
	account *model.PlayerSnsAccount,
) (saved *model.PlayerSnsAccount, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	rdbPlayerAccount := PlayerSnsAccount{
		PlayerID:    playerID,
		SnsTypeCode: account.SnsType.String(),
		AccountName: account.AccountName,
		AccountUrl:  account.AccountURL,
	}
	result := tx.Create(&rdbPlayerAccount)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return repo.findSnsACcount(tx, rdbPlayerAccount.ID)
}

func (repo *PlayerRepository) UpdateSnsAccount(
	ctx context.Context,
	ID uint32,
	account *model.PlayerSnsAccount,
) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	rdbPlayerAccount, err := repo.findRdbSnsAccount(tx, ID)
	if err != nil {
		return err
	}
	if rdbPlayerAccount == nil {
		return nil
	}
	rdbPlayerAccount.SnsTypeCode = account.SnsType.String()
	rdbPlayerAccount.AccountName = account.AccountName
	rdbPlayerAccount.AccountUrl = account.AccountURL
	result := tx.Save(&rdbPlayerAccount)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

// DeleteSnsAccount implements model.PlayerRepository.
func (*PlayerRepository) DeleteSnsAccount(ctx context.Context, ID uint32) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	result := tx.Delete(&PlayerSnsAccount{}, ID)
	if result.Error != nil {
		return fmt.Errorf("failed to delete: %s \n", result.Error)
	}
	return nil
}

// ----------------------------------------------------------------------------

func (repo *PlayerRepository) findPlayers(db *gorm.DB, IDs []uint32) ([]model.Player, error) {
	rdbPlayers, err := repo.findRdbPlayers(db, IDs)
	if err != nil {
		return nil, err
	}
	return array.Map(rdbPlayers, func(p Player) model.Player {
		return *p.ToModel()
	}), nil
}

func (repo *PlayerRepository) findPlayer(db *gorm.DB, ID uint32) (_ *model.Player, err error) {
	rdbPlayer, err := repo.findRdbPlayer(db, ID)
	if err != nil {
		return nil, err
	}
	return rdbPlayer.ToModel(), nil
}

func (repo *PlayerRepository) findRdbPlayers(db *gorm.DB, IDs []uint32) ([]Player, error) {
	var rdbPlayers []Player
	result := db.Model(&Player{}).Where("id IN (?)", IDs).Find(&rdbPlayers)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbPlayers, nil
}

func (repo *PlayerRepository) findRdbPlayer(db *gorm.DB, ID uint32) (_ *Player, err error) {
	var rdbPlayer Player
	result := db.Model(&Player{}).First(&rdbPlayer, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbPlayer, nil
}

func (repo *PlayerRepository) findRdbPlayerByName(db *gorm.DB, name string) (_ *Player, err error) {
	var rdbPlayer Player
	result := db.Model(&Player{}).Where("player_name = ?", name).First(&rdbPlayer)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbPlayer, nil
}

func (repo *PlayerRepository) findByUserName(db *gorm.DB, username string) (_ *model.Player, err error) {
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
	return repo.findPlayer(db, rdbPlayerAccount.PlayerID)
}

func (repo *PlayerRepository) findProfile(db *gorm.DB, ID uint32) (profile *model.PlayerProfile, err error) {
	rdbPlayerProfile, err := repo.findRdbProfile(db, ID)
	if err != nil {
		return nil, err
	}
	rdbSnsAccounts, err := repo.findRdbSnsAccounts(db, ID)
	if err != nil {
		return nil, err
	}
	snsAccounts := array.Map(rdbSnsAccounts, func(sa PlayerSnsAccount) model.PlayerSnsAccount {
		return *sa.ToModel()
	})

	return rdbPlayerProfile.ToModel(snsAccounts), nil
}

func (repo *PlayerRepository) findRdbProfile(db *gorm.DB, ID uint32) (_ *PlayerProfile, err error) {
	var rdbPlayerProfile PlayerProfile
	result := db.Model(&PlayerProfile{}).First(&rdbPlayerProfile, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbPlayerProfile, nil
}

func (repo *PlayerRepository) findRdbSnsAccounts(db *gorm.DB, playerID uint32) (_ []PlayerSnsAccount, err error) {
	var rdbPlayerSnsAccounts []PlayerSnsAccount
	result := db.Model(&PlayerSnsAccount{}).Where("player_id = ?", playerID).Find(&rdbPlayerSnsAccounts)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbPlayerSnsAccounts, nil
}

func (repo *PlayerRepository) findSnsACcount(db *gorm.DB, ID uint32) (_ *model.PlayerSnsAccount, err error) {
	rdb, err := repo.findRdbSnsAccount(db, ID)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	return rdb.ToModel(), nil
}

func (repo *PlayerRepository) findRdbSnsAccount(db *gorm.DB, ID uint32) (_ *PlayerSnsAccount, err error) {
	var rdb PlayerSnsAccount
	result := db.Model(&PlayerSnsAccount{}).First(&rdb, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdb, nil
}
