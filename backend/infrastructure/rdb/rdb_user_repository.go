package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *DB
}

func NewUserRepository(db *DB) model.UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (repo *UserRepository) FindByUserName(ctx context.Context, username string) (_ *model.User, err error) {
	db := repo.db.Conn(ctx)
	var rdbPlayerAccount PlayerAccount
	result := db.
		Model(&PlayerAccount{}).
		Where("user_name = ?", username).
		First(&rdbPlayerAccount)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	authories := repo.findAuthories(db, rdbPlayerAccount.PlayerID)
	return &model.User{
		UserName: rdbPlayerAccount.UserName,
		Authorites: array.Map(authories, func(a PlayerAuthority) model.PlayerAuthority {
			return *model.PlayerAuthorityValueOf(a.AuthorityCode)
		}),
	}, nil
}

// FindPlayerAuthorities implements model.UserRepository.
func (repo *UserRepository) FindPlayerAuthorities(ctx context.Context, playerID uint32) (authorities []model.PlayerAuthority, err error) {
	aths := repo.findAuthories(repo.db.Conn(ctx), playerID)
	return array.Map(aths, func(a PlayerAuthority) model.PlayerAuthority {
		return *model.PlayerAuthorityValueOf(a.AuthorityCode)
	}), nil
}

func (repo *UserRepository) findAuthories(db *gorm.DB, playerID uint32) []PlayerAuthority {
	var rdbAuthorities []PlayerAuthority
	db.Model(&PlayerAuthority{}).Where("player_id = ?", playerID).Find(&rdbAuthorities)
	return rdbAuthorities
}

func (repo *UserRepository) Signup(ctx context.Context, username string) (_ *model.User, err error) {
	db := repo.db.Conn(ctx)
	existing, err := repo.FindByUserName(ctx, username)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, fmt.Errorf("user already exists. username: %s \n", username)
	}

	rdbPlayer := Player{
		PlayerName: "未登録",
	}
	result := db.Create(&rdbPlayer)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	pID := rdbPlayer.ID

	// account
	err = repo.savePlayerAccount(db, pID, username)
	if err != nil {
		return nil, fmt.Errorf("failed to save: %s \n", err)
	}

	// authority
	array.ForEach(model.DefaultAuthorites, func(authority model.PlayerAuthority) {
		repo.savePlayerAuthority(db, pID, authority.String())
	})

	// profile
	err = repo.saveProfile(db, pID)
	if err != nil {
		return nil, fmt.Errorf("failed to save: %s \n", err)
	}

	return &model.User{
		UserName:   username,
		Authorites: model.DefaultAuthorites,
	}, nil
}

func (repo *UserRepository) savePlayerAccount(db *gorm.DB, playerID uint32, username string) error {
	rdbPlayerAccount := PlayerAccount{
		PlayerID: playerID,
		UserName: username,
	}
	result := db.Create(&rdbPlayerAccount)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func (repo *UserRepository) savePlayerAuthority(db *gorm.DB, playerID uint32, authority string) error {
	rdbPlayerAuthority := PlayerAuthority{
		PlayerID:      playerID,
		AuthorityCode: authority,
	}
	result := db.Create(&rdbPlayerAuthority)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func (repo *UserRepository) saveProfile(db *gorm.DB, playerID uint32) error {
	rdbPlayerProfile := PlayerProfile{
		PlayerID: playerID,
	}
	result := db.Save(&rdbPlayerProfile)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}
