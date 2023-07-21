package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
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

func (repo *UserRepository) FindByUserName(username string) (_ *model.User, err error) {
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
	authories := repo.findAuthories(rdbPlayerAccount.PlayerID)
	return &model.User{
		UserName: rdbPlayerAccount.UserName,
		Authorites: array.Map(authories, func(a PlayerAuthority) model.PlayerAuthority {
			return *model.PlayerAuthorityValueOf(a.AuthorityCode)
		}),
	}, nil
}

func (repo *UserRepository) findAuthories(playerID uint32) []PlayerAuthority {
	var rdbAuthorities []PlayerAuthority
	repo.db.Connection.Model(&PlayerAuthority{}).Where("player_id = ?", playerID).Find(&rdbAuthorities)
	return rdbAuthorities
}

func (repo *UserRepository) Signup(username string) (_ *model.User, err error) {
	existing, err := repo.FindByUserName(username)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, fmt.Errorf("user already exists. username: %s \n", username)
	}

	rdbPlayer := Player{
		PlayerName: "未登録",
	}
	result := repo.db.Connection.Create(&rdbPlayer)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	pID := rdbPlayer.ID

	// account
	err = repo.savePlayerAccount(pID, username)
	if err != nil {
		return nil, fmt.Errorf("failed to save: %s \n", err)
	}

	// authority
	array.ForEach(model.DefaultAuthorites, func(authority model.PlayerAuthority) {
		repo.savePlayerAuthority(pID, authority.String())
	})

	// profile
	err = repo.saveProfile(pID)
	if err != nil {
		return nil, fmt.Errorf("failed to save: %s \n", err)
	}

	return &model.User{
		UserName:   username,
		Authorites: model.DefaultAuthorites,
	}, nil
}

func (repo *UserRepository) savePlayerAccount(playerID uint32, username string) error {
	rdbPlayerAccount := PlayerAccount{
		PlayerID: playerID,
		UserName: username,
	}
	result := repo.db.Connection.Create(&rdbPlayerAccount)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func (repo *UserRepository) savePlayerAuthority(playerID uint32, authority string) error {
	rdbPlayerAuthority := PlayerAuthority{
		PlayerID:      playerID,
		AuthorityCode: authority,
	}
	result := repo.db.Connection.Create(&rdbPlayerAuthority)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func (repo *UserRepository) saveProfile(playerID uint32) error {
	rdbPlayerProfile := PlayerProfile{
		PlayerID: playerID,
	}
	result := repo.db.Connection.Save(&rdbPlayerProfile)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}
